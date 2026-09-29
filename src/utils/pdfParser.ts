/**
 * Comprehensive client-side PDF text extractor and Question Paper Parser
 * Powered by Mozilla PDF.js with fallback streaming engine for files up to 1 GB (1,024 MB).
 * Accurately extracts questions, options (inline & multiline), answer keys, and solutions.
 */
import { Question } from '../types';
import * as pdfjsLib from 'pdfjs-dist';

// Configure Mozilla PDF.js worker safely for Vite / Browser
if (typeof window !== 'undefined' && 'GlobalWorkerOptions' in pdfjsLib) {
  try {
    // Official CDN worker matching installed version to avoid worker path issues
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
  } catch (err) {
    console.warn('Could not set GlobalWorkerOptions.workerSrc:', err);
  }
}

/** Maximum supported PDF file size: 1 Gigabyte (1,024 MB) */
export const MAX_PDF_SIZE_BYTES = 1024 * 1024 * 1024; // 1 GB = 1,073,741,824 bytes
export const MAX_PDF_SIZE_LABEL = '1 GB (1,024 MB)';

/**
 * Format bytes into human-readable string (KB, MB, GB)
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Convert a File object to an accessible URL
 * For small files (< 15 MB): generates a Base64 data URL
 * For large files (up to 1 GB): generates a lightweight Blob Object URL to prevent browser memory crashes
 */
export const fileToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    // For large files (> 15 MB up to 1 GB), Blob URL is instant (0ms) and uses 0 extra RAM
    if (file.size > 15 * 1024 * 1024) {
      try {
        const objectUrl = URL.createObjectURL(file);
        resolve(objectUrl);
        return;
      } catch (err) {
        console.warn('Object URL creation failed, falling back to FileReader:', err);
      }
    }

    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
};

/**
 * Progress callback type for streaming large PDF extraction up to 1 GB
 */
export type PdfExtractionProgressCallback = (progress: {
  percent: number;
  loadedBytes: number;
  totalBytes: number;
  stage: string;
}) => void;

/**
 * Clean common noise, running headers, and page watermarks from raw PDF lines
 */
export function cleanPdfTextLines(lines: string[]): string[] {
  const noisePatterns = [
    /^page\s+\d+(\s+of\s+\d+)?$/i,
    /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\/\S*)?$/i,
    /^copyright\s*©/i,
    /all\s*rights\s*reserved/i,
    /^testbook(\.com)?/i,
    /^gradeup(\.com)?/i,
    /^adda247(\.com)?/i,
    /^byju'?s/i,
    /^drishti\s*ias/i,
    /^ssc\s*portal/i,
    /^downloaded\s+from/i,
    /^t\.me\/\S+/i,
    /^join\s+telegram/i
  ];

  return lines.filter(line => {
    const trimmed = line.trim();
    if (!trimmed) return false;
    for (const pat of noisePatterns) {
      if (pat.test(trimmed)) return false;
    }
    return true;
  });
}

/**
 * Primary Text Extractor using Mozilla PDF.js with visual spatial line reconstruction
 */
async function extractWithPdfJs(
  file: File,
  onProgress?: PdfExtractionProgressCallback
): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({
    data: new Uint8Array(arrayBuffer),
    useSystemFonts: true,
  });

  const pdf = await loadingTask.promise;
  const numPages = pdf.numPages;
  const pageTexts: string[] = [];

  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();
    
    // Group text items by vertical position (Y coordinate) to preserve natural visual lines
    interface TextItemWithPos {
      text: string;
      x: number;
      y: number;
    }

    const items: TextItemWithPos[] = [];
    for (const item of textContent.items as any[]) {
      if (item.str && item.transform) {
        items.push({
          text: item.str,
          x: item.transform[4],
          y: item.transform[5],
        });
      }
    }

    // Sort top-to-bottom (Y descending in PDF space), then left-to-right (X ascending)
    items.sort((a, b) => {
      const yDiff = Math.abs(a.y - b.y);
      if (yDiff <= 4) {
        return a.x - b.x; // same line, sort left-to-right
      }
      return b.y - a.y; // top-to-bottom
    });

    // Merge into distinct lines
    const lines: string[] = [];
    let currentLineY = items[0]?.y ?? 0;
    let currentLineTokens: string[] = [];

    for (const item of items) {
      if (Math.abs(item.y - currentLineY) <= 4) {
        currentLineTokens.push(item.text);
      } else {
        if (currentLineTokens.length > 0) {
          lines.push(currentLineTokens.join(' ').replace(/\s{2,}/g, ' '));
        }
        currentLineTokens = [item.text];
        currentLineY = item.y;
      }
    }
    if (currentLineTokens.length > 0) {
      lines.push(currentLineTokens.join(' ').replace(/\s{2,}/g, ' '));
    }

    pageTexts.push(lines.join('\n'));

    if (onProgress) {
      const percent = Math.min(99, Math.round((pageNum / numPages) * 100));
      onProgress({
        percent,
        loadedBytes: Math.round((pageNum / numPages) * file.size),
        totalBytes: file.size,
        stage: `Extracted Page ${pageNum} of ${numPages} (${percent}%)...`
      });
    }
  }

  return pageTexts.join('\n\n');
}

/**
 * Fallback Chunked Scanner for raw streams if PDF.js is unavailable
 */
async function extractWithChunkedScanner(
  file: File,
  onProgress?: PdfExtractionProgressCallback
): Promise<string> {
  const totalSize = file.size;
  const CHUNK_SIZE = 16 * 1024 * 1024; // 16 MB chunks
  let offset = 0;
  const extractedChunks: string[] = [];
  let chunkIndex = 0;
  const totalChunks = Math.ceil(totalSize / CHUNK_SIZE);

  const tjRegex = /\((.*?)\)\s*Tj/g;
  const arrayTjRegex = /\[(.*?)\]\s*TJ/g;
  const streamRegex = /stream[\r\n]+([\s\S]*?)[\r\n]+endstream/g;

  while (offset < totalSize) {
    const end = Math.min(offset + CHUNK_SIZE, totalSize);
    const blobSlice = file.slice(offset, end);
    const chunkBuffer = await blobSlice.arrayBuffer();
    const uint8 = new Uint8Array(chunkBuffer);
    
    const textDecoder = new TextDecoder('latin1');
    const rawChunk = textDecoder.decode(uint8);

    chunkIndex++;
    const currentPercent = Math.min(98, Math.round((end / totalSize) * 100));

    if (onProgress) {
      onProgress({
        percent: currentPercent,
        loadedBytes: end,
        totalBytes: totalSize,
        stage: `Scanning stream chunk ${chunkIndex} of ${totalChunks} (${formatFileSize(end)} / ${formatFileSize(totalSize)})...`
      });
    }

    let match: RegExpExecArray | null;
    let foundInStream = false;

    while ((match = streamRegex.exec(rawChunk)) !== null) {
      const streamContent = match[1];
      const streamStartIndex = match.index;
      const dictSlice = rawChunk.slice(Math.max(0, streamStartIndex - 400), streamStartIndex);

      let textToScan = streamContent;

      if (dictSlice.includes('FlateDecode') && typeof DecompressionStream !== 'undefined') {
        try {
          const streamBytes = new Uint8Array(streamContent.length);
          for (let i = 0; i < streamContent.length; i++) {
            streamBytes[i] = streamContent.charCodeAt(i);
          }
          const ds = new DecompressionStream('deflate');
          const writer = ds.writable.getWriter();
          writer.write(streamBytes);
          writer.close();
          const resp = new Response(ds.readable);
          const decompressedBuf = await resp.arrayBuffer();
          textToScan = new TextDecoder('utf-8').decode(decompressedBuf);
        } catch {
          textToScan = streamContent;
        }
      }

      // Extract via (...) Tj
      let tjMatch: RegExpExecArray | null;
      while ((tjMatch = tjRegex.exec(textToScan)) !== null) {
        const decodedStr = tjMatch[1]
          .replace(/\\([()\\])/g, '$1')
          .replace(/\\n/g, '\n')
          .replace(/\\r/g, '')
          .replace(/\\t/g, ' ');
        if (decodedStr.trim().length > 1) {
          extractedChunks.push(decodedStr);
          foundInStream = true;
        }
      }

      // Extract via [...] TJ
      let arrMatch: RegExpExecArray | null;
      while ((arrMatch = arrayTjRegex.exec(textToScan)) !== null) {
        const inner = arrMatch[1];
        const strParts = inner.match(/\((.*?)\)/g);
        if (strParts) {
          const line = strParts.map(s => s.slice(1, -1).replace(/\\([()\\])/g, '$1')).join('');
          if (line.trim().length > 1) {
            extractedChunks.push(line);
            foundInStream = true;
          }
        }
      }
    }

    if (!foundInStream) {
      const lines = rawChunk.split(/[\r\n]+/);
      for (const line of lines) {
        const trimmed = line.trim();
        if (
          trimmed.length > 3 &&
          /[A-Za-z0-9\u0900-\u097F]/.test(trimmed) &&
          !trimmed.startsWith('%') &&
          !trimmed.includes('obj') &&
          !trimmed.includes('endobj') &&
          !trimmed.includes('xref')
        ) {
          extractedChunks.push(trimmed);
        }
      }
    }

    offset = end;
  }

  return extractedChunks.join('\n');
}

/**
 * Universal Dual-Engine PDF Text Extractor
 * Tries Mozilla PDF.js first; automatically falls back to streaming chunk scanner
 */
export async function extractTextFromPdf(
  file: File,
  onProgress?: PdfExtractionProgressCallback
): Promise<string> {
  const totalSize = file.size;

  if (totalSize > MAX_PDF_SIZE_BYTES) {
    throw new Error(
      `File size (${formatFileSize(totalSize)}) exceeds the maximum supported PDF size of 1 GB (${formatFileSize(MAX_PDF_SIZE_BYTES)}). Please upload a PDF up to 1 GB.`
    );
  }

  try {
    if (onProgress) {
      onProgress({
        percent: 5,
        loadedBytes: 0,
        totalBytes: totalSize,
        stage: `Analyzing PDF structure with Mozilla PDF.js (${formatFileSize(totalSize)})...`
      });
    }

    const text = await extractWithPdfJs(file, onProgress);
    if (text && text.trim().length > 100) {
      if (onProgress) {
        onProgress({
          percent: 100,
          loadedBytes: totalSize,
          totalBytes: totalSize,
          stage: `Successfully extracted text from ${formatFileSize(totalSize)} PDF!`
        });
      }
      return text;
    }
  } catch (err) {
    console.warn('PDF.js text extraction failed or was incomplete, switching to chunked scanner:', err);
  }

  // Fallback engine
  const fallbackText = await extractWithChunkedScanner(file, onProgress);
  if (onProgress) {
    onProgress({
      percent: 100,
      loadedBytes: totalSize,
      totalBytes: totalSize,
      stage: `Extraction completed via stream decoder.`
    });
  }
  return fallbackText;
}

/**
 * Extracts multiple options from a single string if options appear inline (e.g. "(A) 12 (B) 14 (C) 16 (D) 18")
 */
function extractInlineOptions(line: string): { label: string; text: string }[] {
  // Regex finding option markers: (A), (B), (C), (D) or (a), (b), (c), (d) or A), B), C), D) or 1), 2), 3), 4) or (1), (2), (3), (4)
  const markerRegex = /(?:^|\s+)(?:[\(\[]?([A-Da-d1-4])[\)\]\.\:\-]|([A-Da-d1-4])[\.\)])\s+/g;
  
  const matches: { index: number; label: string; matchLength: number }[] = [];
  let m: RegExpExecArray | null;

  while ((m = markerRegex.exec(line)) !== null) {
    const label = (m[1] || m[2]).toUpperCase();
    matches.push({
      index: m.index,
      label,
      matchLength: m[0].length
    });
  }

  if (matches.length < 2) return [];

  const results: { label: string; text: string }[] = [];
  for (let i = 0; i < matches.length; i++) {
    const cur = matches[i];
    const startIndex = cur.index + cur.matchLength;
    const endIndex = (i + 1 < matches.length) ? matches[i + 1].index : line.length;
    const optText = line.substring(startIndex, endIndex).trim();
    results.push({ label: cur.label, text: optText });
  }

  return results;
}

/**
 * Pre-scans text to extract separate Answer Key table if present (e.g. "ANSWER KEY: 1-A, 2-B, 3-C...")
 */
function extractAnswerKeyMap(fullText: string): Map<number, number> {
  const ansMap = new Map<number, number>();

  // Look for sections titled "ANSWER KEY", "ANSWERS", "SOLUTION KEY", "उत्तर कुंजी"
  const keyHeaderMatch = fullText.match(/(?:ANSWER\s*KEY|ANSWERS|KEY|उत्तर\s*कुंजी)[\:\s\-]+([\s\S]{10,2500})/i);
  if (!keyHeaderMatch) return ansMap;

  const keyBlock = keyHeaderMatch[1];
  // Match pairs: 1 - A, 1. A, 1) B, 1: (C), Q1: D, 1: 2
  const pairRegex = /(?:Q(?:uestion)?\.?\s*)?(\d+)[\.\s\:\-\)]+[\(\[]?([A-Da-d1-4])[\)\]]?/g;
  let p: RegExpExecArray | null;

  while ((p = pairRegex.exec(keyBlock)) !== null) {
    const qNum = parseInt(p[1], 10);
    const ansChar = p[2].toUpperCase();
    let ansIdx = 0;
    if (ansChar === 'A' || ansChar === '1') ansIdx = 0;
    else if (ansChar === 'B' || ansChar === '2') ansIdx = 1;
    else if (ansChar === 'C' || ansChar === '3') ansIdx = 2;
    else if (ansChar === 'D' || ansChar === '4') ansIdx = 3;
    ansMap.set(qNum, ansIdx);
  }

  return ansMap;
}

/**
 * Advanced Multi-Pattern Question Parser
 * Flawlessly detects questions from Indian competitive exam papers with varied option layouts,
 * separate answer keys, inline horizontal choices, Hindi/bilingual text, and explanations.
 */
export function parseQuestionsFromText(
  text: string, 
  defaultPositive = 2, 
  defaultNegative = 0.5,
  defaultSection = 'General Section'
): Question[] {
  if (!text || !text.trim()) return [];

  // Extract separate answer key map if present in text
  const separateAnswerKeyMap = extractAnswerKeyMap(text);

  const rawLines = text.split(/\r?\n/);
  const cleanLines = cleanPdfTextLines(rawLines);

  const questions: Question[] = [];

  let currentQNumber = 1;
  let currentQText = '';
  let currentOptions: string[] = [];
  let currentAnswer = -1; // -1 means unset yet
  let currentExplanation = '';
  let currentTopic = 'Core Concept';
  let currentSection = defaultSection;
  let currentDifficulty: 'Easy' | 'Medium' | 'Hard' = 'Medium';

  // Question Start Patterns:
  // Q1. / Q.1 / Q1) / Question 1. / 1. / 1) / 1: / प्र. 1. / प्रश्न 1: / (1)
  const qStartRegex = /^(?:(?:Q(?:uestion|ue|ues)?\.?\s*(\d+)[\.\:\-\)]?)|(?:(\d+)[\.\:\-\)]\s+)|(?:[\(](\d+)[\)]\s+)|(?:(?:प्र(?:श्न)?\.?\s*(\d+)[\.\:\-\)]?)))(.+)/i;

  // Single-line Option Marker: (A) / A) / A. / [A] / (1) / 1) / 1.
  const singleOptionRegex = /^[(\[]?([A-Da-d1-4])[)\]\.\:\-]\s*(.+)/;

  // Answer Key Line: Ans: A / Answer : (B) / Key : 1 / Correct Option: 3 / उत्तर : C
  const ansRegex = /^(?:Ans(?:wer)?|Correct(?:\s*Option)?|Key|Right\s*Ans(?:wer)?|उत्तर)[\:\s\-]+[\(\[]?([A-Da-d1-4])[\)\]]?/i;

  // Explanation Line: Explanation: / Solution: / Exp: / हल: / व्याख्या:
  const explRegex = /^(?:Exp(?:lanation)?|Solution|Sol|Hint|Reason|हल|व्याख्या)[\:\s\-]+(.+)/i;

  // Section Header Line: Section: ... / Part A ... / Subject: ...
  const sectionHeaderRegex = /^(?:Section|Part|Subject|खण्ड|भाग)[\:\s\-]+(.+)/i;

  const finalizeQuestion = () => {
    if (currentQText.trim()) {
      // Clean option labels from options if still present (e.g. "(A) 45" -> "45")
      const cleanedOptions = currentOptions.map(opt => {
        return opt.replace(/^[(\[]?[A-Da-d1-4][)\]\.\:\-]\s*/, '').trim();
      }).filter(Boolean);

      // If at least 2 options detected or if options are present
      if (cleanedOptions.length >= 2 || currentOptions.length >= 2) {
        const finalOpts = cleanedOptions.length >= 2 ? cleanedOptions : currentOptions;
        while (finalOpts.length < 4) {
          finalOpts.push('None of the above / None');
        }

        // Determine correct answer
        let finalAnswerIndex = currentAnswer;
        if (finalAnswerIndex < 0 && separateAnswerKeyMap.has(currentQNumber)) {
          finalAnswerIndex = separateAnswerKeyMap.get(currentQNumber)!;
        }
        if (finalAnswerIndex < 0) {
          // Default to Option A (0) if no answer key was explicitly declared
          finalAnswerIndex = 0;
        }

        const qIdx = questions.length + 1;
        questions.push({
          id: `gen-q-${Date.now()}-${qIdx}`,
          questionNumber: qIdx,
          questionText: currentQText.trim(),
          options: finalOpts.slice(0, 4),
          correctAnswerIndex: Math.min(3, Math.max(0, finalAnswerIndex)),
          explanation: currentExplanation.trim() || 'Refer to the attached lesson PDF notes for detailed concept revision.',
          section: currentSection,
          topic: currentTopic,
          marksPositive: defaultPositive,
          marksNegative: defaultNegative,
          difficulty: currentDifficulty
        });
      }
    }

    currentQText = '';
    currentOptions = [];
    currentAnswer = -1;
    currentExplanation = '';
    currentTopic = 'Core Concept';
  };

  for (let i = 0; i < cleanLines.length; i++) {
    const rawLine = cleanLines[i];
    const line = rawLine.trim();
    if (!line) continue;

    // 1. Check for Section Header
    const secMatch = line.match(sectionHeaderRegex);
    if (secMatch) {
      finalizeQuestion();
      currentSection = secMatch[1].trim();
      continue;
    }

    // 2. Check for Question Start
    const qMatch = line.match(qStartRegex);
    if (qMatch) {
      finalizeQuestion();
      const numStr = qMatch[1] || qMatch[2] || qMatch[3] || qMatch[4] || '1';
      currentQNumber = parseInt(numStr, 10) || (questions.length + 1);
      currentQText = qMatch[5].trim();
      currentDifficulty = currentQNumber % 3 === 0 ? 'Hard' : (currentQNumber % 2 === 0 ? 'Medium' : 'Easy');
      
      // Check if question line also contains inline options immediately
      const inlineOnQLine = extractInlineOptions(currentQText);
      if (inlineOnQLine.length >= 2) {
        // Strip options from question text
        const firstOptPos = currentQText.search(/(?:[\(\[]?[A-Da-d1-4][\)\]\.\:\-]|(?:^|\s+)[A-Da-d][\.\)])\s+/);
        if (firstOptPos > 5) {
          currentQText = currentQText.substring(0, firstOptPos).trim();
        }
        for (const opt of inlineOnQLine) {
          currentOptions.push(opt.text);
        }
      }
      continue;
    }

    // 3. Check for Inline Horizontal Options on this line: (A) ... (B) ... (C) ... (D) ...
    const inlineOptions = extractInlineOptions(line);
    if (inlineOptions.length >= 2 && currentQText && currentOptions.length < 4) {
      for (const opt of inlineOptions) {
        currentOptions.push(opt.text);
      }
      continue;
    }

    // 4. Check for Single Option on its own line: (A) Option text
    const optMatch = line.match(singleOptionRegex);
    if (optMatch && currentQText && currentOptions.length < 4) {
      currentOptions.push(optMatch[2].trim());
      continue;
    }

    // 5. Check for Answer Key Line
    const ansMatch = line.match(ansRegex);
    if (ansMatch) {
      const val = ansMatch[1].toUpperCase();
      if (val === 'A' || val === '1') currentAnswer = 0;
      else if (val === 'B' || val === '2') currentAnswer = 1;
      else if (val === 'C' || val === '3') currentAnswer = 2;
      else if (val === 'D' || val === '4') currentAnswer = 3;
      continue;
    }

    // 6. Check for Explanation Line
    const explMatch = line.match(explRegex);
    if (explMatch) {
      currentExplanation = explMatch[1].trim();
      continue;
    }

    // 7. Continuation of existing fields
    if (currentExplanation) {
      currentExplanation += ' ' + line;
    } else if (currentOptions.length > 0) {
      // Append to the last option
      currentOptions[currentOptions.length - 1] += ' ' + line;
    } else if (currentQText) {
      // Append to question text
      currentQText += ' ' + line;
    }
  }

  // Finalize last question
  finalizeQuestion();

  return questions;
}
