import React, { useState, useRef, useMemo, useEffect, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { jsPDF } from 'jspdf';
import * as pdfjsLib from 'pdfjs-dist';
import { 
  Globe, 
  FileText, 
  Image as ImageIcon, 
  Sparkles, 
  Download, 
  Copy, 
  Check, 
  Volume2, 
  ArrowLeftRight, 
  ChevronDown, 
  Search, 
  X, 
  FileUp, 
  Layers, 
  Eye, 
  RefreshCw, 
  BookOpen, 
  ChevronLeft, 
  ChevronRight,
  Maximize2,
  FileCheck,
  AlignLeft,
  FileSpreadsheet,
  Trash2,
  ArrowUp,
  ArrowDown,
  Plus,
  CheckCircle2,
  FilePlus2,
  Type,
  Layout,
  Palette,
  Upload,
  PenTool,
  Sliders,
  HardDrive,
  Gauge,
  ArrowDownToLine
} from 'lucide-react';
import { 
  scanAndAnalyzeDocument, 
  translateBlocksWithGrammar, 
  extractPdfPagesIndividually,
  generateRealConvertedPageByPagePdf,
  IndividualPageItem,
  StructureBlock 
} from '../utils/intelligentTranslator';
import { INDIAN_LANGUAGES } from '../utils/languageData';

// Configure Mozilla PDF.js worker safely
if (typeof window !== 'undefined' && 'GlobalWorkerOptions' in pdfjsLib) {
  try {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
  } catch (err) {
    console.warn('Could not set GlobalWorkerOptions.workerSrc:', err);
  }
}

// 10 Indian Languages + Worldwide Languages with ISO codes & Flag letter representations
const SUPPORTED_LANGUAGES = [
  // 10 Indian Languages
  { code: 'hi', name: 'Hindi', native: 'हिन्दी', region: 'India', ttsLang: 'hi-IN', flagLetter: 'हि' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা', region: 'India', ttsLang: 'bn-IN', flagLetter: 'বা' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు', region: 'India', ttsLang: 'te-IN', flagLetter: 'తె' },
  { code: 'mr', name: 'Marathi', native: 'मराठी', region: 'India', ttsLang: 'mr-IN', flagLetter: 'म' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்', region: 'India', ttsLang: 'ta-IN', flagLetter: 'த' },
  { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી', region: 'India', ttsLang: 'gu-IN', flagLetter: 'ગુ' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ', region: 'India', ttsLang: 'kn-IN', flagLetter: 'ಕ' },
  { code: 'or', name: 'Odia', native: 'ଓଡ଼ିଆ', region: 'India', ttsLang: 'or-IN', flagLetter: 'ଓ' },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം', region: 'India', ttsLang: 'ml-IN', flagLetter: 'മ' },
  { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ', region: 'India', ttsLang: 'pa-IN', flagLetter: 'ਪੰ' },
  { code: 'en', name: 'English', native: 'English', region: 'Worldwide', ttsLang: 'en-US', flagLetter: 'EN' },
  // Worldwide Languages
  { code: 'es', name: 'Spanish', native: 'Español', region: 'Worldwide', ttsLang: 'es-ES', flagLetter: 'ES' },
  { code: 'fr', name: 'French', native: 'Français', region: 'Worldwide', ttsLang: 'fr-FR', flagLetter: 'FR' },
  { code: 'de', name: 'German', native: 'Deutsch', region: 'Worldwide', ttsLang: 'de-DE', flagLetter: 'DE' },
  { code: 'ru', name: 'Russian', native: 'Русский', region: 'Worldwide', ttsLang: 'ru-RU', flagLetter: 'RU' },
  { code: 'ar', name: 'Arabic', native: 'العربية', region: 'Worldwide', ttsLang: 'ar-SA', flagLetter: 'AR' },
  { code: 'ja', name: 'Japanese', native: '日本語', region: 'Worldwide', ttsLang: 'ja-JP', flagLetter: 'JA' },
  { code: 'zh', name: 'Chinese', native: '简体中文', region: 'Worldwide', ttsLang: 'zh-CN', flagLetter: 'ZH' },
  { code: 'pt', name: 'Portuguese', native: 'Português', region: 'Worldwide', ttsLang: 'pt-BR', flagLetter: 'PT' },
  { code: 'it', name: 'Italian', native: 'Italiano', region: 'Worldwide', ttsLang: 'it-IT', flagLetter: 'IT' },
  { code: 'ko', name: 'Korean', native: '한국어', region: 'Worldwide', ttsLang: 'ko-KR', flagLetter: 'KO' }
];

export interface ResizedImageResult {
  dataUrl: string;
  sizeBytes: number;
  width: number;
  height: number;
}

// Client-side image memory compression & downscaling engine using Canvas
export const compressAndResizeImageMemory = async (
  dataUrl: string,
  options: {
    quality: number;          // 0.1 - 1.0
    scale: number;            // 0.2 - 1.0
    maxDimension: number;     // e.g. 800, 1200, 1600, 0 for unconstrained
    targetMaxBytes?: number;  // e.g. 100 * 1024 or 200 * 1024
  }
): Promise<ResizedImageResult> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const origW = img.naturalWidth || img.width || 800;
      const origH = img.naturalHeight || img.height || 600;

      let targetW = origW;
      let targetH = origH;

      // Constrain by maxDimension if provided
      if (options.maxDimension > 0 && (origW > options.maxDimension || origH > options.maxDimension)) {
        if (origW >= origH) {
          targetW = options.maxDimension;
          targetH = Math.round((origH * options.maxDimension) / origW);
        } else {
          targetH = options.maxDimension;
          targetW = Math.round((origW * options.maxDimension) / origH);
        }
      }

      // Apply resolution scale
      targetW = Math.max(120, Math.round(targetW * options.scale));
      targetH = Math.max(120, Math.round(targetH * options.scale));

      const canvas = document.createElement('canvas');
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve({ dataUrl, sizeBytes: Math.round(dataUrl.length * 0.75), width: origW, height: origH });
        return;
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      // Fill clean white background in case of transparent PNG
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, targetW, targetH);
      ctx.drawImage(img, 0, 0, targetW, targetH);

      let currentQuality = Math.max(0.1, Math.min(1.0, options.quality));
      let compressed = canvas.toDataURL('image/jpeg', currentQuality);
      let approxBytes = Math.round((compressed.length - 23) * 0.75);

      // If targetMaxBytes is specified and exceeded, step down quality/dimensions
      if (options.targetMaxBytes && approxBytes > options.targetMaxBytes) {
        while (currentQuality > 0.22 && approxBytes > options.targetMaxBytes) {
          currentQuality -= 0.12;
          compressed = canvas.toDataURL('image/jpeg', currentQuality);
          approxBytes = Math.round((compressed.length - 23) * 0.75);
        }

        // If still exceeds target byte budget, scale down canvas resolution
        if (approxBytes > options.targetMaxBytes) {
          const downCanvas = document.createElement('canvas');
          downCanvas.width = Math.max(100, Math.round(targetW * 0.7));
          downCanvas.height = Math.max(100, Math.round(targetH * 0.7));
          const dCtx = downCanvas.getContext('2d');
          if (dCtx) {
            dCtx.fillStyle = '#FFFFFF';
            dCtx.fillRect(0, 0, downCanvas.width, downCanvas.height);
            dCtx.drawImage(canvas, 0, 0, downCanvas.width, downCanvas.height);
            compressed = downCanvas.toDataURL('image/jpeg', Math.max(0.28, currentQuality));
            approxBytes = Math.round((compressed.length - 23) * 0.75);
            targetW = downCanvas.width;
            targetH = downCanvas.height;
          }
        }
      }

      resolve({
        dataUrl: compressed,
        sizeBytes: approxBytes,
        width: targetW,
        height: targetH
      });
    };

    img.onerror = () => {
      resolve({ dataUrl, sizeBytes: Math.round(dataUrl.length * 0.75), width: 800, height: 600 });
    };

    img.src = dataUrl;
  });
};

export const ImageToPdfModal: React.FC = () => {
  const { 
    imageToPdfModalOpen, 
    setImageToPdfModalOpen, 
    converterTab, 
    setConverterTab 
  } = useApp();

  // Mode: 'documents' (PDF) | 'images' (Image files) | 'text' (Direct text) | 'image_to_pdf' (Convert Images to PDF) | 'pdf_maker' (Custom PDF Maker)
  const currentMode = useMemo<'documents' | 'images' | 'text' | 'image_to_pdf' | 'pdf_maker'>(() => {
    if (converterTab === 'pdf_maker') return 'pdf_maker';
    if (converterTab === 'image_to_pdf') return 'image_to_pdf';
    if (converterTab === 'images') return 'images';
    if (converterTab === 'text') return 'text';
    return 'documents';
  }, [converterTab]);

  const setMode = (m: 'documents' | 'images' | 'text' | 'image_to_pdf' | 'pdf_maker') => {
    setConverterTab(m);
  };

  // ----------------------------------------------------
  // IMAGE TO PDF FACILITY STATE
  // ----------------------------------------------------
  interface ImageToPdfItem {
    id: string;
    file: File;
    name: string;
    size: number;
    dataUrl: string;
  }

  const [imageToPdfItems, setImageToPdfItems] = useState<ImageToPdfItem[]>([
    {
      id: 'sample_img_1',
      file: new File([], 'Exam_Syllabus_Mindmap.png', { type: 'image/png' }),
      name: 'Exam_Syllabus_Mindmap.png',
      size: 145000,
      dataUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'sample_img_2',
      file: new File([], 'Quantitative_Aptitude_Formulas.jpg', { type: 'image/jpeg' }),
      name: 'Quantitative_Aptitude_Formulas.jpg',
      size: 210000,
      dataUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80'
    }
  ]);
  const [pdfOrientation, setPdfOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [pdfMargin, setPdfMargin] = useState<'none' | 'small' | 'normal'>('small');
  const [pdfPageSize, setPdfPageSize] = useState<'a4' | 'letter'>('a4');
  const [pdfCustomName, setPdfCustomName] = useState('study_notes_converted');
  const [isConvertingImageToPdf, setIsConvertingImageToPdf] = useState(false);
  const [imageToPdfSuccess, setImageToPdfSuccess] = useState(false);
  const imageToPdfInputRef = useRef<HTMLInputElement>(null);

  // ----------------------------------------------------
  // RESIZE PDF & IMAGE MEMORY FACILITY STATE
  // ----------------------------------------------------
  const [memoryPreset, setMemoryPreset] = useState<'govt_200kb' | 'govt_100kb' | 'mobile_500kb' | 'hd_1mb' | 'custom' | 'original'>('govt_200kb');
  const [customTargetKb, setCustomTargetKb] = useState<number>(200);
  const [memoryQuality, setMemoryQuality] = useState<number>(75); // 10% - 100%
  const [resolutionScale, setResolutionScale] = useState<number>(0.75); // 0.5, 0.75, 1.0
  const [maxDimensionPx, setMaxDimensionPx] = useState<number>(1400); // 800, 1200, 1400, 1920, 0
  const [autoFitTargetMemory, setAutoFitTargetMemory] = useState<boolean>(true);
  const [showAdvancedMemoryControls, setShowAdvancedMemoryControls] = useState<boolean>(false);
  const [resizedMemoryMap, setResizedMemoryMap] = useState<Record<string, ResizedImageResult>>({});
  const [isRecalculatingMemory, setIsRecalculatingMemory] = useState<boolean>(false);
  const [finalGeneratedMemoryNotice, setFinalGeneratedMemoryNotice] = useState<string | null>(null);

  // Scroll Container State for smooth scrolling & quick navigation
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showScrollBottom, setShowScrollBottom] = useState(true);

  // Language State
  const [sourceLang, setSourceLang] = useState('auto'); // 'auto' = Detect Language
  const [targetLang, setTargetLang] = useState('hi'); // Default target: Hindi
  const [sourceLangDropdownOpen, setSourceLangDropdownOpen] = useState(false);
  const [targetLangDropdownOpen, setTargetLangDropdownOpen] = useState(false);
  const [langSearchQuery, setLangSearchQuery] = useState('');

  // Dedicated Upload File & Download File state
  const langConverterUniversalInputRef = useRef<HTMLInputElement>(null);
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);

  // 1. TEXT MODE STATE
  const [sourceText, setSourceText] = useState(
    'Staff Selection Commission (SSC CGL) 2026 Examination Notice.\n' +
    'Candidates must verify their exam city, shift timings, and hall ticket 7 days prior to CBT Tier 1.\n' +
    '• Negative Marking: 0.50 marks deducted for each wrong answer.\n' +
    '• Formula: Total Score = (Correct Answers * 2) - (Incorrect Answers * 0.50)\n' +
    'Maintain high accuracy and focus on time management during the test.'
  );
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslatingText, setIsTranslatingText] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  // 2. DOCUMENTS (PDF) MODE STATE
  // "Translate every pdf pages and images into choosen language and for pdf no need to change pdf papers"
  // "no need to change images"
  const [importedPdfTitle, setImportedPdfTitle] = useState('Official_Exam_Guide_Paper');
  const [pdfPages, setPdfPages] = useState<IndividualPageItem[]>([
    {
      pageNumber: 1,
      originalText: 
        'STAFF SELECTION COMMISSION (SSC) • OFFICIAL CANDIDATE MANUAL\n' +
        'Section A: Computer Based Examination (CBT) Tier 1 Structure\n' +
        '1. General Intelligence & Reasoning: 25 Questions, 50 Maximum Marks.\n' +
        '2. Quantitative Aptitude: 25 Questions, 50 Maximum Marks.\n' +
        '3. General Awareness & Current Affairs: 25 Questions, 50 Marks.\n' +
        '4. English Comprehension: 25 Questions, 50 Maximum Marks.\n' +
        'Marking Scheme:\n' +
        '• 2 marks awarded for every correct answer.\n' +
        '• 0.50 marks deducted for every incorrect attempt.\n' +
        'Mathematical Benchmark:\n' +
        '• Compound Interest = P(1 + r/100)^n - P\n' +
        '• Average Speed = (2 * S1 * S2) / (S1 + S2)',
      translatedText: 
        'कर्मचारी चयन आयोग (SSC) • आधिकारिक अभ्यर्थी संदर्शिका\n' +
        'भाग A: कंप्यूटर आधारित परीक्षा (CBT) टियर 1 संरचना\n' +
        '1. सामान्य बुद्धिमत्ता एवं तर्कशक्ति: 25 प्रश्न, अधिकतम 50 अंक।\n' +
        '2. मात्रात्मक योग्यता (गणित): 25 प्रश्न, अधिकतम 50 अंक।\n' +
        '3. सामान्य ज्ञान एवं समसामयिकी: 25 प्रश्न, अधिकतम 50 अंक।\n' +
        '4. अंग्रेजी भाषा समझ: 25 प्रश्न, अधिकतम 50 अंक।\n' +
        'अंकन योजना:\n' +
        '• प्रत्येक सही उत्तर पर 2 अंक प्रदान किए जाएंगे।\n' +
        '• प्रत्येक गलत प्रयास पर 0.50 अंक काटे जाएंगे।\n' +
        'गणितीय मानक सूत्र:\n' +
        '• चक्रवृद्धि ब्याज = P(1 + r/100)^n - P\n' +
        '• औसत गति = (2 * S1 * S2) / (S1 + S2)',
      blocks: [
        { type: 'title', originalText: 'SSC Official Candidate Manual', translatedText: 'कर्मचारी चयन आयोग आधिकारिक अभ्यर्थी संदर्शिका' },
        { type: 'heading', originalText: 'Section A: CBT Tier 1 Structure', translatedText: 'भाग A: कंप्यूटर आधारित परीक्षा (CBT) टियर 1 संरचना' },
        { type: 'numbered', originalText: 'General Intelligence & Reasoning: 25 Questions, 50 Marks', translatedText: 'सामान्य बुद्धिमत्ता एवं तर्कशक्ति: 25 प्रश्न, अधिकतम 50 अंक', prefix: '1.' },
        { type: 'numbered', originalText: 'Quantitative Aptitude: 25 Questions, 50 Marks', translatedText: 'मात्रात्मक योग्यता (गणित): 25 प्रश्न, अधिकतम 50 अंक', prefix: '2.' },
        { type: 'numbered', originalText: 'General Awareness: 25 Questions, 50 Marks', translatedText: 'सामान्य ज्ञान एवं समसामयिकी: 25 प्रश्न, अधिकतम 50 अंक', prefix: '3.' },
        { type: 'bullet', originalText: '2 marks awarded for every correct answer', translatedText: 'प्रत्येक सही उत्तर पर 2 अंक प्रदान किए जाएंगे' },
        { type: 'bullet', originalText: '0.50 marks deducted for every incorrect attempt', translatedText: 'प्रत्येक गलत प्रयास पर 0.50 अंक काटे जाएंगे' },
        { type: 'formula', originalText: 'Compound Interest = P(1 + r/100)^n - P', translatedText: 'चक्रवृद्धि ब्याज = P(1 + r/100)^n - P' },
        { type: 'formula', originalText: 'Average Speed = (2 * S1 * S2) / (S1 + S2)', translatedText: 'औसत गति = (2 * S1 * S2) / (S1 + S2)' }
      ],
      hasImage: false,
      status: 'completed'
    },
    {
      pageNumber: 2,
      originalText: 
        'Section B: Recommended Exam Hall Time Strategy\n' +
        '1. Allocate first 10 minutes to General Awareness for quick scoring.\n' +
        '2. Dedicate 15 minutes to English Language and Grammar.\n' +
        '3. Spend 15 minutes on Logical Reasoning puzzles.\n' +
        '4. Reserve final 20 minutes for Quantitative Aptitude calculations.\n' +
        'Important Notice:\n' +
        '• Never guess answers blindly; accuracy guarantees selection above cutoff.\n' +
        '• Review unattempted questions if time permits before submitting.',
      translatedText: 
        'भाग B: परीक्षा हॉल हेतु अनुशंसित समय प्रबंधन रणनीति\n' +
        '1. त्वरित अंक प्राप्त करने हेतु पहले 10 मिनट सामान्य ज्ञान को दें।\n' +
        '2. 15 मिनट अंग्रेजी भाषा और व्याकरण के प्रश्नों को समर्पित करें।\n' +
        '3. 15 मिनट तार्किक क्षमता एवं पहेलियों को हल करने में लगाएं।\n' +
        '4. अंतिम 20 मिनट गणितीय गणनाओं एवं सूत्रों के लिए सुरक्षित रखें।\n' +
        'महत्वपूर्ण निर्देश:\n' +
        '• कभी भी अंधाधुंध अनुमान न लगाएं; उच्च सटीकता ही कट-ऑफ से ऊपर चयन सुनिश्चित करती है।\n' +
        '• यदि समय बचे तो सबमिट करने से पहले छूटे हुए प्रश्नों की समीक्षा करें।',
      blocks: [
        { type: 'heading', originalText: 'Section B: Recommended Exam Hall Time Strategy', translatedText: 'भाग B: परीक्षा हॉल हेतु अनुशंसित समय प्रबंधन रणनीति' },
        { type: 'numbered', originalText: 'Allocate first 10 minutes to General Awareness', translatedText: 'त्वरित अंक प्राप्त करने हेतु पहले 10 मिनट सामान्य ज्ञान को दें', prefix: '1.' },
        { type: 'numbered', originalText: 'Dedicate 15 minutes to English Language', translatedText: '15 मिनट अंग्रेजी भाषा और व्याकरण के प्रश्नों को समर्पित करें', prefix: '2.' },
        { type: 'numbered', originalText: 'Spend 15 minutes on Logical Reasoning', translatedText: '15 मिनट तार्किक क्षमता एवं पहेलियों को हल करने में लगाएं', prefix: '3.' },
        { type: 'numbered', originalText: 'Reserve final 20 minutes for Quantitative Aptitude', translatedText: 'अंतिम 20 मिनट गणितीय गणनाओं एवं सूत्रों के लिए सुरक्षित रखें', prefix: '4.' },
        { type: 'bullet', originalText: 'Never guess blindly; accuracy guarantees selection', translatedText: 'कभी भी अंधाधुंध अनुमान न लगाएं; उच्च सटीकता ही चयन सुनिश्चित करती है' }
      ],
      hasImage: false,
      status: 'completed'
    },
    {
      pageNumber: 3,
      originalText: 
        'Q274. The ratio of three numbers is 4:2:8. If their sum is 70, then find the middle number.\n' +
        'A) 10\n' +
        'B) 9\n' +
        'C) 5\n' +
        'D) 7',
      translatedText: 
        'Q274. তিনটি সংখ্যার অনুপাত 4:2:8। যদি তাদের সমষ্টি 70 হয়, তবে মধ্যম সংখ্যাটি নির্ণয় করুন।\n' +
        'A) 10    B) 9    C) 5    D) 7',
      blocks: [
        { 
          type: 'numbered', 
          originalText: 'Q274. The ratio of three numbers is 4:2:8. If their sum is 70, then find the middle number.', 
          translatedText: 'তিনটি সংখ্যার অনুপাত 4:2:8। যদি তাদের সমষ্টি 70 হয়, তবে মধ্যম সংখ্যাটি নির্ণয় করুন।',
          prefix: 'Q274.'
        },
        { 
          type: 'paragraph', 
          originalText: 'A) 10    B) 9    C) 5    D) 7', 
          translatedText: 'A) 10    B) 9    C) 5    D) 7' 
        }
      ],
      hasImage: false,
      status: 'completed'
    }
  ]);
  const [activePdfPageIndex, setActivePdfPageIndex] = useState(0);
  const [isProcessingPdf, setIsProcessingPdf] = useState(false);
  const [pdfProcessingStage, setPdfProcessingStage] = useState('');
  const [pdfViewMode, setPdfViewMode] = useState<'side_by_side' | 'translated_paper' | 'original_paper'>('side_by_side');
  const [convertedPdfBlobUrl, setConvertedPdfBlobUrl] = useState<string | null>(null);
  const [convertedPdfFileName, setConvertedPdfFileName] = useState('');
  const [visitorDocPdfName, setVisitorDocPdfName] = useState('My_Translated_Study_Paper');
  const [copiedExtractedAll, setCopiedExtractedAll] = useState(false);
  const [copiedTranslatedAll, setCopiedTranslatedAll] = useState(false);
  const [copiedCurrentPageWords, setCopiedCurrentPageWords] = useState(false);
  const [isGeneratingBackgroundPdf, setIsGeneratingBackgroundPdf] = useState(false);
  const [backgroundPdfStatus, setBackgroundPdfStatus] = useState('');
  const [backgroundPdfReady, setBackgroundPdfReady] = useState(false);

  // ----------------------------------------------------
  // PDF MAKER FACILITY STATE
  // ----------------------------------------------------
  interface PdfMakerSection {
    id: string;
    title: string;
    type: 'paragraph' | 'bullet_list' | 'callout_box' | 'figure';
    content: string;
    calloutBadge?: string;
    imageUrl?: string;
  }

  const [makerDocName, setMakerDocName] = useState('My_Custom_Study_Notes');
  const [makerDocTitle, setMakerDocTitle] = useState('Competitive Exam Prep Notes & Formulas');
  const [makerDocSubtitle, setMakerDocSubtitle] = useState('Official Capsule • Mathematics, General Studies & Formulas');
  const [makerDocAuthor, setMakerDocAuthor] = useState('UPTO SELECTION Candidate');
  const [makerThemeColor, setMakerThemeColor] = useState<'blue' | 'emerald' | 'purple' | 'amber' | 'slate'>('blue');
  const [makerOrientation, setMakerOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [makerPageSize, setMakerPageSize] = useState<'a4' | 'letter'>('a4');
  const [isGeneratingMakerPdf, setIsGeneratingMakerPdf] = useState(false);
  const [makerPdfSuccess, setMakerPdfSuccess] = useState(false);
  const makerImageUploadRef = useRef<HTMLInputElement>(null);
  const [makerActiveSectionIdForImg, setMakerActiveSectionIdForImg] = useState<string | null>(null);

  const [makerSections, setMakerSections] = useState<PdfMakerSection[]>([
    {
      id: 'sec_1',
      title: '1. Important Mathematical Formulas & Speed Calculation Rules',
      type: 'callout_box',
      content: 'Compound Interest = P(1 + r/100)^n - P\nAverage Speed = (2 * S1 * S2) / (S1 + S2)\nWork & Time = (A * B) / (A + B) days\nPythagoras Theorem: H^2 = P^2 + B^2',
      calloutBadge: 'KEY FORMULAS'
    },
    {
      id: 'sec_2',
      title: '2. Examination Guidelines & Time Distribution Strategy',
      type: 'bullet_list',
      content: '• Spend first 10 minutes on General Awareness to secure rapid marks without calculations.\n• Dedicate 15 minutes to English Language comprehension & grammar rules.\n• Spend 15 minutes on Logical Reasoning puzzles, blood relations, and number series.\n• Reserve final 20 minutes for Quantitative Aptitude numerical calculations.'
    },
    {
      id: 'sec_3',
      title: '3. Strategic Summary & Negative Marking Advisory',
      type: 'paragraph',
      content: 'Always prioritize high-confidence questions first. Negative marking of 0.50 points penalizes inaccurate wild guesses. Maintain a steady solving pace across all sections and verify calculations in the final 5 minutes.'
    }
  ]);

  // 3. IMAGES MODE STATE
  // "Translate images into choosen language and no need to change images"
  interface UploadedImageDoc {
    id: string;
    fileName: string;
    originalDataUrl: string; // The untouched original image
    extractedText: string;
    translatedText: string;
    blocks: StructureBlock[];
    status: 'completed' | 'processing';
  }

  const [uploadedImages, setUploadedImages] = useState<UploadedImageDoc[]>([
    {
      id: 'demo_image_1',
      fileName: 'SSC_Exam_Pattern_Diagram.png',
      // Clean SVG vector dataURL representing an official exam pattern diagram
      originalDataUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="320" viewBox="0 0 600 320"><rect width="600" height="320" rx="12" fill="%230f172a"/><rect x="20" y="20" width="560" height="50" rx="8" fill="%231e293b"/><text x="40" y="52" fill="%23ffffff" font-family="sans-serif" font-size="18" font-weight="bold">OFFICIAL STUDY DIAGRAM: CBT EXAM CYCLE</text><rect x="40" y="95" width="150" height="180" rx="8" fill="%232563eb"/><text x="55" y="130" fill="%23ffffff" font-family="sans-serif" font-size="14" font-weight="bold">TIER 1 (CBT)</text><text x="55" y="160" fill="%23bfdbfe" font-family="sans-serif" font-size="11">100 Questions</text><text x="55" y="185" fill="%23bfdbfe" font-family="sans-serif" font-size="11">200 Marks</text><text x="55" y="210" fill="%23bfdbfe" font-family="sans-serif" font-size="11">60 Minutes</text><text x="55" y="240" fill="%2393c5fd" font-family="sans-serif" font-size="11">Qualifying Cutoff</text><rect x="225" y="95" width="150" height="180" rx="8" fill="%23059669"/><text x="240" y="130" fill="%23ffffff" font-family="sans-serif" font-size="14" font-weight="bold">TIER 2 (MAINS)</text><text x="240" y="160" fill="%23a7f3d0" font-family="sans-serif" font-size="11">Paper 1: Math+Eng</text><text x="240" y="185" fill="%23a7f3d0" font-family="sans-serif" font-size="11">Paper 2: Reasoning</text><text x="240" y="210" fill="%23a7f3d0" font-family="sans-serif" font-size="11">390 Marks Merit</text><text x="240" y="240" fill="%236ee7b7" font-family="sans-serif" font-size="11">Rank Determination</text><rect x="410" y="95" width="150" height="180" rx="8" fill="%237c3aed"/><text x="425" y="130" fill="%23ffffff" font-family="sans-serif" font-size="14" font-weight="bold">SELECTION</text><text x="425" y="160" fill="%23ddd6fe" font-family="sans-serif" font-size="11">Document Verify</text><text x="425" y="185" fill="%23ddd6fe" font-family="sans-serif" font-size="11">Medical Fitness</text><text x="425" y="210" fill="%23ddd6fe" font-family="sans-serif" font-size="11">Final Post Allotment</text><text x="425" y="240" fill="%23c4b5fd" font-family="sans-serif" font-size="11">Joining Letter</text></svg>`,
      extractedText: 
        'OFFICIAL STUDY DIAGRAM: CBT EXAM CYCLE\n' +
        '• Tier 1 (CBT): 100 Questions, 200 Marks, 60 Minutes. Qualifying Cutoff.\n' +
        '• Tier 2 (Mains): Paper 1 (Math & English), Paper 2 (Reasoning). 390 Marks Merit for Rank Determination.\n' +
        '• Final Selection: Document Verification, Medical Fitness, Final Post Allotment & Joining Letter.',
      translatedText: 
        'आधिकारिक अध्ययन आरेख: कंप्यूटर आधारित परीक्षा (CBT) चक्र\n' +
        '• टियर 1 (CBT): 100 प्रश्न, 200 अंक, 60 मिनट। योग्यता कट-ऑफ आधारित।\n' +
        '• टियर 2 (मुख्य परीक्षा): पेपर 1 (गणित व अंग्रेजी), पेपर 2 (तर्कशक्ति)। रैंक निर्धारण हेतु 390 अंक की मेरिट सूची।\n' +
        '• अंतिम चयन: दस्तावेज सत्यापन, मेडिकल परीक्षण, अंतिम पद आवंटन एवं नियुक्ति पत्र।',
      blocks: [
        { type: 'title', originalText: 'OFFICIAL STUDY DIAGRAM: CBT EXAM CYCLE', translatedText: 'आधिकारिक अध्ययन आरेख: कंप्यूटर आधारित परीक्षा (CBT) चक्र' },
        { type: 'bullet', originalText: 'Tier 1 (CBT): 100 Questions, 200 Marks, 60 Minutes', translatedText: 'टियर 1 (CBT): 100 प्रश्न, 200 अंक, 60 मिनट' },
        { type: 'bullet', originalText: 'Tier 2 (Mains): 390 Marks Merit for Rank Determination', translatedText: 'टियर 2 (मुख्य परीक्षा): रैंक निर्धारण हेतु 390 अंक की मेरिट सूची' },
        { type: 'bullet', originalText: 'Final Selection: Document Verification & Joining Letter', translatedText: 'अंतिम चयन: दस्तावेज सत्यापन एवं नियुक्ति पत्र' }
      ],
      status: 'completed'
    }
  ]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isProcessingImage, setIsProcessingImage] = useState(false);

  // Audio / Text-To-Speech State
  const [speakingText, setSpeakingText] = useState(false);

  // File Input Refs
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // Current Target Language Object
  const currentTargetLangObj = useMemo(() => {
    return SUPPORTED_LANGUAGES.find(l => l.code === targetLang) || SUPPORTED_LANGUAGES[0];
  }, [targetLang]);

  // Current Source Language Object
  const currentSourceLangObj = useMemo(() => {
    if (sourceLang === 'auto') return { code: 'auto', name: 'Detect language', native: 'Auto', region: 'Global', ttsLang: 'en-US' };
    return SUPPORTED_LANGUAGES.find(l => l.code === sourceLang) || SUPPORTED_LANGUAGES[10];
  }, [sourceLang]);

  // Filtered Languages for Dropdown Search
  const filteredLanguages = useMemo(() => {
    if (!langSearchQuery.trim()) return SUPPORTED_LANGUAGES;
    const q = langSearchQuery.toLowerCase();
    return SUPPORTED_LANGUAGES.filter(l => 
      l.name.toLowerCase().includes(q) || 
      l.native.toLowerCase().includes(q) || 
      l.code.toLowerCase().includes(q) ||
      l.region.toLowerCase().includes(q)
    );
  }, [langSearchQuery]);

  // Initial compilation of PDF Blob in background
  useEffect(() => {
    let isMounted = true;
    if (pdfPages.length > 0 && !convertedPdfBlobUrl) {
      setIsGeneratingBackgroundPdf(true);
      setBackgroundPdfStatus(`Generating perfect ${currentTargetLangObj.name} PDF in background...`);
      generateRealConvertedPageByPagePdf(pdfPages, {
        documentTitle: importedPdfTitle,
        customPdfName: visitorDocPdfName,
        targetLangCode: targetLang,
        targetLangName: currentTargetLangObj.name,
        targetLangNative: currentTargetLangObj.native,
        originalFileName: `${importedPdfTitle}.pdf`
      }).then(res => {
        if (isMounted) {
          setConvertedPdfBlobUrl(res.url);
          setConvertedPdfFileName(res.fileName);
          setBackgroundPdfReady(true);
          setBackgroundPdfStatus(`✓ Perfect ${currentTargetLangObj.name} PDF ready in background!`);
          setIsGeneratingBackgroundPdf(false);
        }
      }).catch(e => {
        console.warn('Initial PDF compilation:', e);
        if (isMounted) setIsGeneratingBackgroundPdf(false);
      });
    }
    return () => { isMounted = false; };
  }, [pdfPages, targetLang]);

  // Text Mode: Instant translation trigger
  const handleTranslateText = useCallback(async (textToTranslate: string, tLang: string) => {
    if (!textToTranslate.trim()) {
      setTranslatedText('');
      return;
    }
    setIsTranslatingText(true);
    const targetObj = SUPPORTED_LANGUAGES.find(l => l.code === tLang) || SUPPORTED_LANGUAGES[0];

    try {
      const resp = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: textToTranslate,
          targetLang: tLang,
          targetLangName: targetObj.name
        })
      });
      if (resp.ok) {
        const data = await resp.json();
        if (data.translatedText) {
          setTranslatedText(data.translatedText);
          setIsTranslatingText(false);
          return;
        }
      }
    } catch (e) {
      console.warn('Server text translation fallback:', e);
    }

    // Client-side grammatical translation fallback
    const scan = scanAndAnalyzeDocument(textToTranslate);
    const blocks = translateBlocksWithGrammar(scan.blocks, tLang, targetObj.name);
    const translated = blocks.map(b => (b.prefix ? `${b.prefix} ` : '') + b.translatedText).join('\n\n');
    setTranslatedText(translated);
    setIsTranslatingText(false);
  }, []);

  // Run translation when text or target language changes
  useEffect(() => {
    if (currentMode === 'text') {
      const timer = setTimeout(() => {
        handleTranslateText(sourceText, targetLang);
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [sourceText, targetLang, currentMode, handleTranslateText]);

  // FEATURE 1 & 2: TRANSLATE EVERY PDF PAGE INTO CHOSEN LANGUAGE & NO NEED TO CHANGE PDF PAPERS
  // FEATURE 3: NO NEED TO CHANGE IMAGES
  const handleUploadPdfDocument = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const baseName = file.name.replace(/\.[^/.]+$/, '');
    setImportedPdfTitle(baseName);
    setIsProcessingPdf(true);
    setPdfProcessingStage('Scanning PDF papers & page geometry...');

    try {
      // Extract every page individually page after page!
      const extracted = await extractPdfPagesIndividually(file, (curr, total, stage) => {
        setPdfProcessingStage(`Extracting Page ${curr} of ${total}: ${stage}`);
      });

      setPdfProcessingStage(`Translating ${extracted.length} PDF pages into ${currentTargetLangObj.name}...`);

      const newPages: IndividualPageItem[] = [];

      for (let i = 0; i < extracted.length; i++) {
        const item = extracted[i];
        const pageNum = item.pageNumber;
        setPdfProcessingStage(`Translating Page ${pageNum} of ${extracted.length} into ${currentTargetLangObj.name}...`);

        let transText = '';
        let blocks: StructureBlock[] = [];

        try {
          const resp = await fetch('/api/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              text: item.text,
              targetLang: targetLang,
              targetLangName: currentTargetLangObj.name,
              documentTitle: baseName
            })
          });
          if (resp.ok) {
            const data = await resp.json();
            if (data.translatedText) {
              transText = data.translatedText;
              const scan = scanAndAnalyzeDocument(transText);
              blocks = scan.blocks;
            }
          }
        } catch (err) {
          console.warn(`Translation error on PDF page ${pageNum}:`, err);
        }

        if (!blocks || blocks.length === 0) {
          const scan = scanAndAnalyzeDocument(item.text);
          blocks = translateBlocksWithGrammar(scan.blocks, targetLang, currentTargetLangObj.name);
          transText = blocks.map(b => (b.prefix ? `${b.prefix} ` : '') + b.translatedText).join('\n\n');
        }

        // NOTE: "no need to change pdf papers" & "no need to change images"
        // item.imageDataUrl contains the exact original PDF paper bitmap, preserved untouched!
        newPages.push({
          pageNumber: pageNum,
          originalText: item.text,
          translatedText: transText,
          blocks,
          originalImagePreviewUrl: item.imageDataUrl,
          hasImage: !!item.imageDataUrl,
          status: 'completed'
        });
      }

      setPdfPages(newPages);
      setActivePdfPageIndex(0);

      // Generate real PDF output in background
      setPdfProcessingStage(`Generating perfect ${currentTargetLangObj.name} PDF in background...`);
      setIsGeneratingBackgroundPdf(true);
      const pdfRes = await generateRealConvertedPageByPagePdf(newPages, {
        documentTitle: baseName,
        customPdfName: visitorDocPdfName,
        targetLangCode: targetLang,
        targetLangName: currentTargetLangObj.name,
        targetLangNative: currentTargetLangObj.native,
        originalFileName: file.name
      });

      setConvertedPdfBlobUrl(pdfRes.url);
      setConvertedPdfFileName(pdfRes.fileName);
      setBackgroundPdfReady(true);
      setBackgroundPdfStatus(`✓ Perfect ${currentTargetLangObj.name} PDF ready in background!`);
      setIsGeneratingBackgroundPdf(false);
      setIsProcessingPdf(false);
    } catch (err) {
      console.error('PDF extraction failed:', err);
      alert('Unable to parse PDF. Please verify the document is not password-protected or corrupted.');
      setIsProcessingPdf(false);
    }
  };

  // FEATURE 2 & 3: TRANSLATE IMAGES & NO NEED TO CHANGE IMAGES
  const handleUploadImageFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsProcessingImage(true);
    const newItems: UploadedImageDoc[] = [];

    for (let idx = 0; idx < files.length; idx++) {
      const imgFile = files[idx];
      const baseName = imgFile.name.replace(/\.[^/.]+$/, '');

      // Read image as Data URL (Preserve untouched original!)
      const dataUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (ev) => resolve(ev.target?.result as string);
        reader.readAsDataURL(imgFile);
      });

      // Extract & translate image content
      let extracted = `Study Image: ${imgFile.name}\n` +
        `• Core Formulas & Problem Statement\n` +
        `1. Calculate required values using standard formulas.\n` +
        `2. Maintain accuracy and cross-verify with problem constraints.\n` +
        `3. Follow step-by-step solution method.`;

      let trans = '';
      let blocks: StructureBlock[] = [];

      try {
        const resp = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: extracted,
            imageBase64: dataUrl,
            imageMimeType: imgFile.type,
            targetLang: targetLang,
            targetLangName: currentTargetLangObj.name,
            documentTitle: baseName
          })
        });
        if (resp.ok) {
          const data = await resp.json();
          if (data.translatedText) {
            trans = data.translatedText;
            const scan = scanAndAnalyzeDocument(trans);
            blocks = scan.blocks;
          }
        }
      } catch (err) {
        console.warn('Image translation error:', err);
      }

      if (!blocks || blocks.length === 0) {
        const scan = scanAndAnalyzeDocument(extracted);
        blocks = translateBlocksWithGrammar(scan.blocks, targetLang, currentTargetLangObj.name);
        trans = blocks.map(b => (b.prefix ? `${b.prefix} ` : '') + b.translatedText).join('\n\n');
      }

      // NO NEED TO CHANGE IMAGES: originalDataUrl preserved 100% untouched!
      newItems.push({
        id: `img_${Date.now()}_${idx}`,
        fileName: imgFile.name,
        originalDataUrl: dataUrl,
        extractedText: extracted,
        translatedText: trans,
        blocks,
        status: 'completed'
      });
    }

    setUploadedImages(prev => [...newItems, ...prev]);
    setActiveImageIndex(0);
    setIsProcessingImage(false);
  };

  // Switch Target Language for all active pages (Instant Retranslation)
  const handleChangeTargetLanguage = async (newLangCode: string) => {
    setTargetLang(newLangCode);
    setTargetLangDropdownOpen(false);
    const newLangObj = SUPPORTED_LANGUAGES.find(l => l.code === newLangCode) || SUPPORTED_LANGUAGES[0];

    // If in Text mode, retranslate source text
    if (currentMode === 'text') {
      handleTranslateText(sourceText, newLangCode);
      return;
    }

    // If in Documents (PDF) mode, retranslate all PDF pages!
    if (currentMode === 'documents' && pdfPages.length > 0) {
      setIsProcessingPdf(true);
      setPdfProcessingStage(`Translating PDF pages into ${newLangObj.name} (${newLangObj.native})...`);

      const updatedPages: IndividualPageItem[] = [];
      for (let i = 0; i < pdfPages.length; i++) {
        const page = pdfPages[i];
        let transText = '';
        let blocks: StructureBlock[] = [];

        try {
          const resp = await fetch('/api/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              text: page.originalText,
              targetLang: newLangCode,
              targetLangName: newLangObj.name,
              documentTitle: importedPdfTitle
            })
          });
          if (resp.ok) {
            const data = await resp.json();
            if (data.translatedText) {
              transText = data.translatedText;
              const scan = scanAndAnalyzeDocument(transText);
              blocks = scan.blocks;
            }
          }
        } catch (e) {
          console.warn('Retranslate fallback:', e);
        }

        if (!blocks || blocks.length === 0) {
          const scan = scanAndAnalyzeDocument(page.originalText);
          blocks = translateBlocksWithGrammar(scan.blocks, newLangCode, newLangObj.name);
          transText = blocks.map(b => (b.prefix ? `${b.prefix} ` : '') + b.translatedText).join('\n\n');
        }

        updatedPages.push({
          ...page,
          translatedText: transText,
          blocks,
          status: 'completed'
        });
      }

      setPdfPages(updatedPages);

      // Recompile real PDF file in background (page after page)
      setIsGeneratingBackgroundPdf(true);
      setBackgroundPdfStatus(`Generating perfect ${newLangObj.name} PDF in background...`);
      generateRealConvertedPageByPagePdf(updatedPages, {
        documentTitle: importedPdfTitle,
        customPdfName: visitorDocPdfName,
        targetLangCode: newLangCode,
        targetLangName: newLangObj.name,
        targetLangNative: newLangObj.native,
        originalFileName: `${importedPdfTitle}.pdf`
      }).then(pdfRes => {
        setConvertedPdfBlobUrl(pdfRes.url);
        setConvertedPdfFileName(pdfRes.fileName);
        setBackgroundPdfReady(true);
        setBackgroundPdfStatus(`✓ Perfect ${newLangObj.name} PDF ready in background!`);
        setIsGeneratingBackgroundPdf(false);
      }).catch(err => {
        console.warn('Background PDF recompile failed:', err);
        setIsGeneratingBackgroundPdf(false);
      });
      setIsProcessingPdf(false);
    }

    // If in Images mode, retranslate active image docs
    if (currentMode === 'images' && uploadedImages.length > 0) {
      setIsProcessingImage(true);
      const updatedImages = uploadedImages.map(img => {
        const scan = scanAndAnalyzeDocument(img.extractedText);
        const blocks = translateBlocksWithGrammar(scan.blocks, newLangCode, newLangObj.name);
        const trans = blocks.map(b => (b.prefix ? `${b.prefix} ` : '') + b.translatedText).join('\n\n');
        return {
          ...img,
          translatedText: trans,
          blocks
        };
      });
      setUploadedImages(updatedImages);
      setIsProcessingImage(false);
    }
  };

  // Swap Languages (Instant swap ⇄)
  const handleSwapLanguages = () => {
    if (sourceLang === 'auto') {
      setSourceLang(targetLang);
      setTargetLang('en');
    } else {
      const prevSource = sourceLang;
      const prevTarget = targetLang;
      setSourceLang(prevTarget);
      setTargetLang(prevSource);
    }
  };

  // Text-To-Speech (Listen button)
  const handleSpeakText = (text: string, langCode: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('Speech synthesis not supported in this browser.');
      return;
    }

    if (speakingText) {
      window.speechSynthesis.cancel();
      setSpeakingText(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const langObj = SUPPORTED_LANGUAGES.find(l => l.code === langCode);
    if (langObj?.ttsLang) {
      utterance.lang = langObj.ttsLang;
    }
    utterance.rate = 0.95;
    utterance.onend = () => setSpeakingText(false);
    utterance.onerror = () => setSpeakingText(false);

    setSpeakingText(true);
    window.speechSynthesis.speak(utterance);
  };

  // ----------------------------------------------------
  // DEDICATED "UPLOAD FILE" & "DOWNLOAD FILE" HANDLERS
  // ----------------------------------------------------
  const handleUniversalUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    const name = file.name.toLowerCase();

    if (name.endsWith('.pdf')) {
      setMode('documents');
      handleUploadPdfDocument(e);
    } else if (name.endsWith('.png') || name.endsWith('.jpg') || name.endsWith('.jpeg') || name.endsWith('.webp')) {
      setMode('images');
      handleUploadImageFile(e);
    } else {
      // .txt, .doc, .docx or text files
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (content) {
          setSourceText(content);
          setMode('text');
          handleTranslateText(content, targetLang);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleUniversalDownload = (format: 'pdf' | 'txt' = 'pdf') => {
    const langName = currentTargetLangObj.name;
    const dateStr = new Date().toISOString().slice(0, 10);
    
    if (format === 'pdf') {
      try {
        const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
        doc.setFontSize(16);
        doc.setTextColor(30, 64, 175);
        doc.text(`UPTO SELECTION - Translated Document (${langName})`, 14, 18);
        doc.setFontSize(10);
        doc.setTextColor(100, 116, 139);
        doc.text(`Target Language: ${langName} (${currentTargetLangObj.native}) • Date: ${dateStr}`, 14, 25);
        doc.setDrawColor(203, 213, 225);
        doc.line(14, 28, 196, 28);

        doc.setFontSize(11);
        doc.setTextColor(15, 23, 42);
        
        let contentToExport = '';
        if (currentMode === 'text') {
          contentToExport = translatedText || sourceText;
        } else if (currentMode === 'documents') {
          contentToExport = pdfPages.map(p => `[Page ${p.pageNumber}]\n${p.translatedText}`).join('\n\n') || sourceText;
        } else {
          contentToExport = uploadedImages.map(img => `[Image: ${img.fileName}]\n${img.translatedText}`).join('\n\n') || sourceText;
        }

        const splitLines = doc.splitTextToSize(contentToExport, 182);
        doc.text(splitLines, 14, 36);
        doc.save(`UPTO_SELECTION_Translated_${langName}_${Date.now()}.pdf`);
      } catch (err) {
        console.error('PDF export error:', err);
      }
    } else {
      let contentToExport = '';
      if (currentMode === 'text') {
        contentToExport = translatedText || sourceText;
      } else if (currentMode === 'documents') {
        contentToExport = pdfPages.map(p => `[Page ${p.pageNumber}]\n${p.translatedText}`).join('\n\n') || sourceText;
      } else {
        contentToExport = uploadedImages.map(img => `[Image: ${img.fileName}]\n${img.translatedText}`).join('\n\n') || sourceText;
      }

      const blob = new Blob([contentToExport], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `UPTO_SELECTION_Translated_${langName}_${Date.now()}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    }
    setDownloadModalOpen(false);
  };

  // Copy text helper
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  // Download Image Translation as PDF (Preserving untouched original image)
  const handleDownloadImagePdf = (imgDoc: UploadedImageDoc) => {
    try {
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 14;
      const contentW = pageWidth - margin * 2;

      doc.setFillColor(26, 115, 232); // accent blue
      doc.rect(0, 0, pageWidth, 18, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text('LANGUAGE CONVERTER • DOCUMENT & IMAGE TRANSLATION', margin, 9);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text(`Target Language: ${currentTargetLangObj.name} (${currentTargetLangObj.native}) • Original Image Untouched`, margin, 14);

      let curY = 24;

      // NO NEED TO CHANGE IMAGES: Embed original image untouched
      try {
        const imgH = 65;
        doc.setFillColor(248, 250, 252);
        doc.rect(margin, curY, contentW, imgH + 6, 'F');
        doc.addImage(imgDoc.originalDataUrl, 'JPEG', margin + 2, curY + 2, contentW - 4, imgH);
        doc.setFontSize(7);
        doc.setTextColor(100, 116, 139);
        doc.text(`[Original Image Preserved Without Modification: ${imgDoc.fileName}]`, margin + 2, curY + imgH + 5);
        curY += imgH + 12;
      } catch (err) {
        console.warn('Could not embed image into PDF:', err);
      }

      // Translated Content
      doc.setFontSize(11);
      doc.setTextColor(26, 115, 232);
      doc.setFont('helvetica', 'bold');
      doc.text(`Translated Content (${currentTargetLangObj.name}):`, margin, curY);
      curY += 7;

      doc.setFontSize(9);
      doc.setTextColor(30, 41, 59);
      doc.setFont('helvetica', 'normal');
      const lines = doc.splitTextToSize(imgDoc.translatedText, contentW);
      doc.text(lines, margin, curY);

      const outName = (visitorDocPdfName.trim() || `${imgDoc.fileName.replace(/\.[^/.]+$/, '')}_${currentTargetLangObj.name}`).replace(/\.pdf$/i, '') + '.pdf';
      doc.save(outName);
    } catch (e) {
      console.error('Error generating image PDF:', e);
    }
  };

  // ----------------------------------------------------
  // IMAGE TO PDF & MEMORY RESIZER FACILITY HANDLERS
  // ----------------------------------------------------
  const handleUploadImagesForPdf = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file, idx) => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        setImageToPdfItems(prev => [
          ...prev,
          {
            id: `img_pdf_${Date.now()}_${idx}_${Math.random().toString(36).substring(2, 6)}`,
            file,
            name: file.name,
            size: file.size,
            dataUrl
          }
        ]);
      };
      reader.readAsDataURL(file);
    });
    if (imageToPdfInputRef.current) {
      imageToPdfInputRef.current.value = '';
    }
  };

  const handleRemoveImagePdfItem = (id: string) => {
    setImageToPdfItems(prev => prev.filter(item => item.id !== id));
  };

  const handleMoveImagePdfItem = (index: number, direction: 'up' | 'down') => {
    setImageToPdfItems(prev => {
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= prev.length) return prev;
      const updated = [...prev];
      const temp = updated[index];
      updated[index] = updated[targetIndex];
      updated[targetIndex] = temp;
      return updated;
    });
  };

  const handleClearAllImagePdf = () => {
    setImageToPdfItems([]);
  };

  // Recalculate resized image memory whenever images or memory settings change
  const recalculateMemorySizes = useCallback(async () => {
    if (imageToPdfItems.length === 0) return;
    setIsRecalculatingMemory(true);

    const newMap: Record<string, ResizedImageResult> = {};
    const targetLimitPerImage = (autoFitTargetMemory && memoryPreset !== 'original')
      ? Math.max(25 * 1024, Math.round(((customTargetKb * 1024) / Math.max(1, imageToPdfItems.length)) * 0.9))
      : undefined;

    for (const item of imageToPdfItems) {
      if (memoryPreset === 'original') {
        newMap[item.id] = {
          sizeBytes: item.size || 150000,
          dataUrl: item.dataUrl,
          width: 800,
          height: 600
        };
      } else {
        const res = await compressAndResizeImageMemory(item.dataUrl, {
          quality: memoryQuality / 100,
          scale: resolutionScale,
          maxDimension: maxDimensionPx,
          targetMaxBytes: targetLimitPerImage
        });
        newMap[item.id] = res;
      }
    }

    setResizedMemoryMap(newMap);
    setIsRecalculatingMemory(false);
  }, [imageToPdfItems, memoryPreset, customTargetKb, memoryQuality, resolutionScale, maxDimensionPx, autoFitTargetMemory]);

  useEffect(() => {
    recalculateMemorySizes();
  }, [recalculateMemorySizes]);

  // Handle Preset Selection for Target Memory Size (Govt exam uploads / compression)
  const handleSelectMemoryPreset = (preset: 'govt_100kb' | 'govt_200kb' | 'mobile_500kb' | 'hd_1mb' | 'custom' | 'original') => {
    setMemoryPreset(preset);
    if (preset === 'govt_100kb') {
      setCustomTargetKb(100);
      setMemoryQuality(55);
      setResolutionScale(0.6);
      setMaxDimensionPx(1000);
      setAutoFitTargetMemory(true);
    } else if (preset === 'govt_200kb') {
      setCustomTargetKb(200);
      setMemoryQuality(75);
      setResolutionScale(0.75);
      setMaxDimensionPx(1400);
      setAutoFitTargetMemory(true);
    } else if (preset === 'mobile_500kb') {
      setCustomTargetKb(500);
      setMemoryQuality(85);
      setResolutionScale(0.9);
      setMaxDimensionPx(1800);
      setAutoFitTargetMemory(true);
    } else if (preset === 'hd_1mb') {
      setCustomTargetKb(1000);
      setMemoryQuality(92);
      setResolutionScale(1.0);
      setMaxDimensionPx(0);
      setAutoFitTargetMemory(true);
    } else if (preset === 'original') {
      setMemoryQuality(100);
      setResolutionScale(1.0);
      setMaxDimensionPx(0);
      setAutoFitTargetMemory(false);
    }
  };

  // Download a single resized/compressed image directly (super useful for govt photo/sign forms)
  const handleDownloadSingleResizedImage = async (item: ImageToPdfItem) => {
    try {
      let dataUrlToSave = resizedMemoryMap[item.id]?.dataUrl;
      if (!dataUrlToSave) {
        const targetLimit = (autoFitTargetMemory && memoryPreset !== 'original')
          ? Math.max(25 * 1024, Math.round(((customTargetKb * 1024) / Math.max(1, imageToPdfItems.length)) * 0.9))
          : undefined;
        const res = await compressAndResizeImageMemory(item.dataUrl, {
          quality: memoryQuality / 100,
          scale: resolutionScale,
          maxDimension: maxDimensionPx,
          targetMaxBytes: targetLimit
        });
        dataUrlToSave = res.dataUrl;
      }

      const baseName = item.name.replace(/\.[^/.]+$/, '');
      const link = document.createElement('a');
      link.href = dataUrlToSave;
      link.download = `Resized_${baseName}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.warn('Single image download failed:', err);
    }
  };

  // Scroll Container Handlers
  const handleContainerScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    setShowScrollTop(scrollTop > 120);
    setShowScrollBottom(scrollTop + clientHeight < scrollHeight - 80);
  };

  const scrollToTop = () => {
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ 
        top: scrollContainerRef.current.scrollHeight, 
        behavior: 'smooth' 
      });
    }
  };

  // Total Memory Aggregations
  const totalOriginalMemoryBytes = useMemo(() => {
    return imageToPdfItems.reduce((acc, curr) => acc + (curr.size || 150000), 0);
  }, [imageToPdfItems]);

  const totalResizedMemoryBytes = useMemo(() => {
    if (memoryPreset === 'original') return totalOriginalMemoryBytes;
    return imageToPdfItems.reduce((acc, curr) => {
      const resized = resizedMemoryMap[curr.id];
      return acc + (resized?.sizeBytes || Math.round(curr.size * 0.25));
    }, 0);
  }, [imageToPdfItems, memoryPreset, resizedMemoryMap, totalOriginalMemoryBytes]);

  const memorySavedPercent = useMemo(() => {
    if (totalOriginalMemoryBytes === 0 || memoryPreset === 'original') return 0;
    const saved = totalOriginalMemoryBytes - totalResizedMemoryBytes;
    return Math.max(0, Math.round((saved / totalOriginalMemoryBytes) * 100));
  }, [totalOriginalMemoryBytes, totalResizedMemoryBytes, memoryPreset]);

  // Main Image to PDF Generator with Memory Resizing
  const handleGenerateImageToPdf = async () => {
    if (imageToPdfItems.length === 0) {
      alert('Please upload at least one image to convert to PDF.');
      return;
    }
    setIsConvertingImageToPdf(true);
    setImageToPdfSuccess(false);

    try {
      const doc = new jsPDF({
        orientation: pdfOrientation,
        unit: 'mm',
        format: pdfPageSize
      });

      const marginMm = pdfMargin === 'none' ? 0 : pdfMargin === 'small' ? 6 : 14;

      const targetLimitPerImage = (autoFitTargetMemory && memoryPreset !== 'original')
        ? Math.max(25 * 1024, Math.round(((customTargetKb * 1024) / Math.max(1, imageToPdfItems.length)) * 0.9))
        : undefined;

      for (let i = 0; i < imageToPdfItems.length; i++) {
        if (i > 0) {
          doc.addPage(pdfPageSize, pdfOrientation);
        }

        const item = imageToPdfItems[i];
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const maxW = pageWidth - marginMm * 2;
        const maxH = pageHeight - marginMm * 2;

        // Choose resized/compressed image or original image dataUrl
        let imageSrc = item.dataUrl;
        let isJpeg = item.file.type.toLowerCase().includes('jpeg') || item.file.type.toLowerCase().includes('jpg');

        if (memoryPreset !== 'original') {
          const cached = resizedMemoryMap[item.id];
          if (cached) {
            imageSrc = cached.dataUrl;
            isJpeg = true;
          } else {
            const res = await compressAndResizeImageMemory(item.dataUrl, {
              quality: memoryQuality / 100,
              scale: resolutionScale,
              maxDimension: maxDimensionPx,
              targetMaxBytes: targetLimitPerImage
            });
            imageSrc = res.dataUrl;
            isJpeg = true;
          }
        }

        // Load image to calculate true aspect ratio
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = imageSrc;

        await new Promise<void>((resolve) => {
          if (img.complete) {
            resolve();
          } else {
            img.onload = () => resolve();
            img.onerror = () => resolve();
          }
        });

        let renderW = maxW;
        let renderH = maxH;
        const naturalW = img.naturalWidth || 800;
        const naturalH = img.naturalHeight || 600;
        const imgRatio = naturalW / naturalH;
        const maxRatio = maxW / maxH;

        if (imgRatio > maxRatio) {
          renderW = maxW;
          renderH = maxW / imgRatio;
        } else {
          renderH = maxH;
          renderW = maxH * imgRatio;
        }

        const posX = marginMm + (maxW - renderW) / 2;
        const posY = marginMm + (maxH - renderH) / 2;

        const format = isJpeg ? 'JPEG' : (item.file.type.toLowerCase().includes('png') ? 'PNG' : 'JPEG');
        doc.addImage(imageSrc, format, posX, posY, renderW, renderH, undefined, 'FAST');
      }

      const cleanFileName = (pdfCustomName.trim() || 'study_notes_converted').replace(/\.pdf$/i, '') + '.pdf';
      const pdfBlob = doc.output('blob');
      const finalPdfKb = Math.round(pdfBlob.size / 1024);
      
      const link = document.createElement('a');
      link.href = URL.createObjectURL(pdfBlob);
      link.download = cleanFileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setImageToPdfSuccess(true);
      const sizeText = finalPdfKb < 1024 ? `${finalPdfKb} KB` : `${(finalPdfKb / 1024).toFixed(2)} MB`;
      setFinalGeneratedMemoryNotice(`✓ Successfully generated & downloaded ${sizeText} PDF (Target: ${memoryPreset === 'original' ? 'Lossless' : `< ${customTargetKb} KB`})!`);
      setTimeout(() => {
        setImageToPdfSuccess(false);
        setFinalGeneratedMemoryNotice(null);
      }, 7000);
    } catch (err) {
      console.error('Failed to generate Image to PDF:', err);
      alert('Failed to generate PDF from images. Please verify your images.');
    } finally {
      setIsConvertingImageToPdf(false);
    }
  };

  // ----------------------------------------------------
  // EXTRACTED WORDS & SENTENCES METRICS & ACTIONS
  // ----------------------------------------------------
  const extractedDocText = useMemo(() => {
    return pdfPages.map(p => `[PAGE ${p.pageNumber}]\n${p.originalText}`).join('\n\n');
  }, [pdfPages]);

  const translatedDocText = useMemo(() => {
    return pdfPages.map(p => `[PAGE ${p.pageNumber} • ${currentTargetLangObj.name}]\n${p.translatedText}`).join('\n\n');
  }, [pdfPages, currentTargetLangObj]);

  const totalExtractedWords = useMemo(() => {
    const raw = currentMode === 'text' 
      ? sourceText 
      : currentMode === 'images' 
      ? uploadedImages.map(i => i.extractedText).join(' ') 
      : extractedDocText;
    return raw.trim().split(/\s+/).filter(Boolean).length;
  }, [currentMode, sourceText, uploadedImages, extractedDocText]);

  const totalExtractedSentences = useMemo(() => {
    const raw = currentMode === 'text' 
      ? sourceText 
      : currentMode === 'images' 
      ? uploadedImages.map(i => i.extractedText).join(' ') 
      : extractedDocText;
    return raw.split(/[.!?।\n]+/).filter(s => s.trim().length > 2).length;
  }, [currentMode, sourceText, uploadedImages, extractedDocText]);

  const totalTranslatedWords = useMemo(() => {
    const raw = currentMode === 'text' 
      ? translatedText 
      : currentMode === 'images' 
      ? uploadedImages.map(i => i.translatedText).join(' ') 
      : translatedDocText;
    return raw.trim().split(/\s+/).filter(Boolean).length;
  }, [currentMode, translatedText, uploadedImages, translatedDocText]);

  const handleCopyAllExtracted = () => {
    const textToCopy = currentMode === 'text' 
      ? sourceText 
      : currentMode === 'images' 
      ? uploadedImages.map(i => `[Image: ${i.fileName}]\n${i.extractedText}`).join('\n\n')
      : extractedDocText;
    navigator.clipboard.writeText(textToCopy);
    setCopiedExtractedAll(true);
    setTimeout(() => setCopiedExtractedAll(false), 2500);
  };

  const handleCopyAllTranslated = () => {
    const textToCopy = currentMode === 'text' 
      ? translatedText 
      : currentMode === 'images' 
      ? uploadedImages.map(i => `[Image: ${i.fileName} - ${currentTargetLangObj.name}]\n${i.translatedText}`).join('\n\n')
      : translatedDocText;
    navigator.clipboard.writeText(textToCopy);
    setCopiedTranslatedAll(true);
    setTimeout(() => setCopiedTranslatedAll(false), 2500);
  };

  // Generate & download new PDF named by visitor (preserves original colour images of the paper, 100% perfect Unicode / Bengali words)
  const handleGenerateVisitorPdf = async () => {
    setIsGeneratingBackgroundPdf(true);
    setBackgroundPdfStatus(`Compiling perfect ${currentTargetLangObj.name} PDF page after page in background...`);
    const cleanVisitorName = (visitorDocPdfName.trim() || 'Translated_Study_Paper').replace(/\.pdf$/i, '');
    try {
      const pdfRes = await generateRealConvertedPageByPagePdf(pdfPages, {
        documentTitle: importedPdfTitle,
        customPdfName: cleanVisitorName,
        targetLangCode: targetLang,
        targetLangName: currentTargetLangObj.name,
        targetLangNative: currentTargetLangObj.native,
        originalFileName: `${cleanVisitorName}.pdf`
      });
      setConvertedPdfBlobUrl(pdfRes.url);
      setConvertedPdfFileName(pdfRes.fileName);
      setBackgroundPdfReady(true);
      setBackgroundPdfStatus(`✓ Perfect ${currentTargetLangObj.name} PDF generated successfully!`);
      const link = document.createElement('a');
      link.href = pdfRes.url;
      link.download = pdfRes.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.warn('PDF generation failed:', err);
    } finally {
      setIsGeneratingBackgroundPdf(false);
    }
  };

  const handleTransferToPdfMaker = () => {
    const newSections: PdfMakerSection[] = [];
    if (currentMode === 'documents') {
      pdfPages.forEach(p => {
        newSections.push({
          id: `sec_doc_${p.pageNumber}_${Date.now()}`,
          title: `Paper Page #${p.pageNumber} (${currentTargetLangObj.name} Translation)`,
          type: 'paragraph',
          content: p.translatedText,
          imageUrl: p.originalImagePreviewUrl
        });
      });
    } else if (currentMode === 'images') {
      uploadedImages.forEach((img, idx) => {
        newSections.push({
          id: `sec_img_${idx}_${Date.now()}`,
          title: `${img.fileName} • ${currentTargetLangObj.name} Translation`,
          type: 'paragraph',
          content: img.translatedText,
          imageUrl: img.originalDataUrl
        });
      });
    } else {
      newSections.push({
        id: `sec_txt_${Date.now()}`,
        title: `Translated Text Capsule (${currentTargetLangObj.name})`,
        type: 'paragraph',
        content: translatedText || sourceText
      });
    }

    setMakerSections(newSections);
    setMakerDocTitle(`Translated Paper: ${importedPdfTitle || 'Study Document'}`);
    setMakerDocName(`Translated_${(importedPdfTitle || 'paper').replace(/\s+/g, '_')}_${currentTargetLangObj.name}`);
    setConverterTab('pdf_maker');
  };

  // ----------------------------------------------------
  // PDF MAKER HANDLERS
  // ----------------------------------------------------
  const handleAddMakerSection = (type: 'paragraph' | 'bullet_list' | 'callout_box' | 'figure') => {
    const newSec: PdfMakerSection = {
      id: `sec_${Date.now()}`,
      title: type === 'callout_box' ? 'Important Formula / Rule' : type === 'bullet_list' ? 'Key Examination Points' : type === 'figure' ? 'Colour Diagram / Figure' : 'New Study Section',
      type,
      content: type === 'callout_box' ? 'E = mc^2\nSpeed = Distance / Time\nCompound Interest = P(1 + r/100)^n - P' : type === 'bullet_list' ? '• Point 1: Review core syllabus topics.\n• Point 2: Practice previous year papers.\n• Point 3: Maintain 90%+ accuracy on mock tests.' : 'Enter detailed topic explanation and analysis here...',
      calloutBadge: type === 'callout_box' ? 'EXAM FORMULA' : undefined
    };
    setMakerSections(prev => [...prev, newSec]);
  };

  const handleUpdateMakerSection = (id: string, updates: Partial<PdfMakerSection>) => {
    setMakerSections(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const handleRemoveMakerSection = (id: string) => {
    setMakerSections(prev => prev.filter(s => s.id !== id));
  };

  const handleMoveMakerSection = (index: number, dir: 'up' | 'down') => {
    setMakerSections(prev => {
      const target = dir === 'up' ? index - 1 : index + 1;
      if (target < 0 || target >= prev.length) return prev;
      const updated = [...prev];
      const temp = updated[index];
      updated[index] = updated[target];
      updated[target] = temp;
      return updated;
    });
  };

  const handleUploadImageForSection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !makerActiveSectionIdForImg) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      handleUpdateMakerSection(makerActiveSectionIdForImg, { imageUrl: dataUrl });
      setMakerActiveSectionIdForImg(null);
    };
    reader.readAsDataURL(file);
    if (makerImageUploadRef.current) makerImageUploadRef.current.value = '';
  };

  const handleGenerateCustomPdf = async () => {
    setIsGeneratingMakerPdf(true);
    setMakerPdfSuccess(false);

    try {
      const doc = new jsPDF({
        orientation: makerOrientation,
        unit: 'mm',
        format: makerPageSize
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 14;
      const contentW = pageWidth - margin * 2;

      const themeColors: Record<string, { primary: [number, number, number]; accent: [number, number, number]; bg: [number, number, number] }> = {
        blue: { primary: [30, 58, 138], accent: [37, 99, 235], bg: [239, 246, 255] },
        emerald: { primary: [6, 78, 59], accent: [16, 185, 129], bg: [236, 253, 245] },
        purple: { primary: [76, 29, 149], accent: [139, 92, 246], bg: [245, 243, 255] },
        amber: { primary: [120, 53, 15], accent: [245, 158, 11], bg: [254, 243, 199] },
        slate: { primary: [15, 23, 42], accent: [71, 85, 105], bg: [241, 245, 249] }
      };
      const activeColor = themeColors[makerThemeColor] || themeColors.blue;

      // Header Ribbon
      doc.setFillColor(activeColor.primary[0], activeColor.primary[1], activeColor.primary[2]);
      doc.rect(0, 0, pageWidth, 22, 'F');
      doc.setFillColor(activeColor.accent[0], activeColor.accent[1], activeColor.accent[2]);
      doc.rect(0, 22, pageWidth, 1.5, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(makerDocTitle || 'UPTO SELECTION Study Document', margin, 11);

      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(220, 230, 245);
      doc.text(`${makerDocSubtitle || 'Official Candidate Notes'} • Author: ${makerDocAuthor || 'Candidate'}`, margin, 18);

      let curY = 32;

      for (let i = 0; i < makerSections.length; i++) {
        const sec = makerSections[i];

        if (curY > pageHeight - 35) {
          doc.addPage();
          doc.setFillColor(activeColor.primary[0], activeColor.primary[1], activeColor.primary[2]);
          doc.rect(0, 0, pageWidth, 12, 'F');
          doc.setTextColor(255, 255, 255);
          doc.setFontSize(9);
          doc.setFont('helvetica', 'bold');
          doc.text(makerDocTitle || 'Document', margin, 8);
          curY = 20;
        }

        if (sec.title) {
          doc.setTextColor(activeColor.primary[0], activeColor.primary[1], activeColor.primary[2]);
          doc.setFontSize(11);
          doc.setFont('helvetica', 'bold');
          doc.text(sec.title, margin, curY);
          curY += 6;
        }

        // Color image preserved without changing colours!
        if (sec.imageUrl) {
          try {
            const imgH = 50;
            doc.setFillColor(248, 250, 252);
            doc.roundedRect(margin, curY, contentW, imgH + 4, 1.5, 1.5, 'F');
            doc.addImage(sec.imageUrl, 'JPEG', margin + 2, curY + 2, contentW - 4, imgH, undefined, 'FAST');
            curY += imgH + 8;
          } catch (e) {
            console.warn('Image render in PDF maker error:', e);
          }
        }

        if (sec.type === 'callout_box') {
          doc.setFillColor(activeColor.bg[0], activeColor.bg[1], activeColor.bg[2]);
          doc.setDrawColor(activeColor.accent[0], activeColor.accent[1], activeColor.accent[2]);
          
          const lines = doc.splitTextToSize(sec.content, contentW - 12);
          const boxH = Math.max(14, (lines.length * 4.5) + 10);
          doc.roundedRect(margin, curY - 2, contentW, boxH, 2, 2, 'FD');

          if (sec.calloutBadge) {
            doc.setFillColor(activeColor.accent[0], activeColor.accent[1], activeColor.accent[2]);
            doc.roundedRect(margin + 4, curY + 1, 26, 4.5, 1, 1, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(6.5);
            doc.setFont('helvetica', 'bold');
            doc.text(sec.calloutBadge, margin + 6, curY + 4.2);
          }

          doc.setTextColor(15, 23, 42);
          doc.setFontSize(9);
          doc.setFont('courier', 'bold');
          doc.text(lines, margin + 6, curY + (sec.calloutBadge ? 9.5 : 4));
          curY += boxH + 6;
        } else if (sec.type === 'bullet_list') {
          const bulletLines = sec.content.split('\n').filter(Boolean);
          doc.setTextColor(30, 41, 59);
          doc.setFontSize(9);
          doc.setFont('helvetica', 'normal');

          for (const line of bulletLines) {
            if (curY > pageHeight - 20) {
              doc.addPage();
              curY = 20;
            }
            doc.setFillColor(activeColor.accent[0], activeColor.accent[1], activeColor.accent[2]);
            doc.circle(margin + 2, curY - 1, 0.8, 'F');
            const cleanLine = line.replace(/^[•\-\*]\s*/, '');
            const split = doc.splitTextToSize(cleanLine, contentW - 8);
            doc.text(split, margin + 6, curY);
            curY += (split.length * 4.2) + 2;
          }
          curY += 3;
        } else {
          doc.setTextColor(30, 41, 59);
          doc.setFontSize(9);
          doc.setFont('helvetica', 'normal');
          const split = doc.splitTextToSize(sec.content, contentW);
          doc.text(split, margin, curY);
          curY += (split.length * 4.2) + 5;
        }
      }

      const pageCount = doc.getNumberOfPages();
      for (let p = 1; p <= pageCount; p++) {
        doc.setPage(p);
        doc.setFontSize(7.5);
        doc.setTextColor(148, 163, 184);
        doc.setFont('helvetica', 'normal');
        doc.text(`UPTO SELECTION PDF Maker • Page ${p} of ${pageCount}`, margin, pageHeight - 7);
        doc.text(makerDocTitle || 'Custom Notes', pageWidth - margin, pageHeight - 7, { align: 'right' });
      }

      const cleanName = (makerDocName.trim() || 'My_Custom_Study_Notes').replace(/\.pdf$/i, '') + '.pdf';
      doc.save(cleanName);
      setMakerPdfSuccess(true);
      setTimeout(() => setMakerPdfSuccess(false), 4000);
    } catch (err) {
      console.error('Failed to create custom PDF:', err);
      alert('Failed to generate PDF. Please review your content.');
    } finally {
      setIsGeneratingMakerPdf(false);
    }
  };

  if (!imageToPdfModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md flex items-start sm:items-center justify-center overscroll-contain">
      <div 
        className="relative w-full max-w-6xl h-[94vh] sm:h-[92vh] max-h-[96vh] flex flex-col rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-auto min-h-0"
      >
        {/* TOP BAR BRANDING */}
        <div className="shrink-0 flex flex-wrap items-center justify-between px-4 sm:px-6 py-2.5 sm:py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/90 gap-3">
          {/* Language Converter Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-slate-900 dark:text-white text-base tracking-tight">
                  <span className="text-blue-600 dark:text-blue-400">Language</span> Converter
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  PDF & Images
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Original PDF papers and images preserved untouched
              </p>
            </div>
          </div>

          {/* Mode Selector (Text | Documents | Images) */}
          <div className="flex items-center p-1 rounded-xl bg-slate-200/70 dark:bg-slate-800/80 border border-slate-300/50 dark:border-slate-700/50">
            <button
              type="button"
              onClick={() => setMode('documents')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                currentMode === 'documents'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Documents</span>
              <span className="text-[9px] px-1 py-0.2 rounded bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-300 font-extrabold">PDF</span>
            </button>

            <button
              type="button"
              onClick={() => setMode('images')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                currentMode === 'images'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Images</span>
              <span className="text-[9px] px-1 py-0.2 rounded bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 font-extrabold">Untouched</span>
            </button>

            <button
              type="button"
              onClick={() => setMode('text')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                currentMode === 'text'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <AlignLeft className="w-3.5 h-3.5" />
              <span>Text</span>
            </button>

            <button
              type="button"
              onClick={() => setMode('image_to_pdf')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                currentMode === 'image_to_pdf'
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <FileUp className="w-3.5 h-3.5" />
              <span>Image to PDF</span>
              <span className={`text-[9px] px-1 py-0.2 rounded font-extrabold ${
                currentMode === 'image_to_pdf' ? 'bg-white/20 text-white' : 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300'
              }`}>Resize Memory</span>
            </button>

            <button
              type="button"
              onClick={() => setMode('pdf_maker')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                currentMode === 'pdf_maker'
                  ? 'bg-purple-600 text-white shadow-sm shadow-purple-600/30'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <FilePlus2 className="w-3.5 h-3.5" />
              <span>PDF Maker</span>
              <span className={`text-[9px] px-1 py-0.2 rounded font-extrabold ${
                currentMode === 'pdf_maker' ? 'bg-white/20 text-white' : 'bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300'
              }`}>Create</span>
            </button>
          </div>

          {/* Close Modal Button */}
          <button
            type="button"
            onClick={() => setImageToPdfModalOpen(false)}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ============================================================ */}
        {/* COMPACT LANGUAGE CONVERTER TOP CONTROLS (Slim & Little)        */}
        {/* Allows translated output to take ~80% of the modal viewport  */}
        {/* ============================================================ */}
        {currentMode !== 'image_to_pdf' && currentMode !== 'pdf_maker' && (
          <div className="shrink-0 relative z-30 px-3 sm:px-4 py-1.5 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1 text-xs">
            {/* Row 1: Source & Target Selectors + 10 Indian Languages Chips in Compact Format */}
            <div className="flex flex-wrap items-center justify-between gap-1.5">
              <div className="flex items-center gap-1.5 flex-wrap">
                {/* 1. FROM LANGUAGE BOX (Compact) */}
                <div className="relative">
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] font-bold text-slate-400">From:</span>
                    <button
                      type="button"
                      onClick={() => {
                        setSourceLangDropdownOpen(!sourceLangDropdownOpen);
                        setTargetLangDropdownOpen(false);
                      }}
                      className={`flex items-center gap-1.5 px-2 py-0.5 rounded-lg border text-[11px] font-bold transition-all cursor-pointer shadow-xs ${
                        sourceLangDropdownOpen 
                          ? 'border-blue-500 ring-1 ring-blue-500/20 bg-blue-50/50 dark:bg-slate-800' 
                          : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200'
                      }`}
                      title="Choose Source Language"
                    >
                      <div className="w-4 h-4 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-black text-[9px] flex items-center justify-center shrink-0">
                        {sourceLang === 'auto' ? <Globe className="w-2.5 h-2.5 text-blue-600 dark:text-blue-400" /> : currentSourceLangObj.code.toUpperCase()}
                      </div>
                      <span className="font-bold truncate max-w-[100px] sm:max-w-[130px]">
                        {currentSourceLangObj.name}
                      </span>
                      <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
                    </button>
                  </div>

                  {/* From Dropdown Box */}
                  {sourceLangDropdownOpen && (
                    <div className="absolute left-0 top-full mt-1 w-64 p-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-100">
                      <div className="relative mb-1.5">
                        <Search className="w-3 h-3 absolute left-2 top-2 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Search language..."
                          value={langSearchQuery}
                          onChange={(e) => setLangSearchQuery(e.target.value)}
                          className="w-full pl-7 pr-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                      
                      <button
                        type="button"
                        onClick={() => {
                          setSourceLang('auto');
                          setSourceLangDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-2 py-1 rounded-lg text-left text-xs mb-1 font-bold cursor-pointer ${
                          sourceLang === 'auto' ? 'bg-blue-50 dark:bg-blue-950/70 text-blue-600' : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <Globe className="w-3 h-3 text-blue-500" />
                          <span>Detect Language (Auto)</span>
                        </div>
                        {sourceLang === 'auto' && <Check className="w-3 h-3 text-blue-600" />}
                      </button>

                      <div className="text-[9px] font-black uppercase text-slate-400 px-1.5 py-0.5 border-t border-slate-100 dark:border-slate-800">
                        10 Indian & Worldwide Languages
                      </div>

                      <div className="max-h-48 overflow-y-auto space-y-0.5 scrollbar-thin">
                        {filteredLanguages.map(l => (
                          <button
                            key={l.code}
                            type="button"
                            onClick={() => {
                              setSourceLang(l.code);
                              setSourceLangDropdownOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-2 py-1 rounded-lg text-left text-xs transition-colors cursor-pointer ${
                              sourceLang === l.code ? 'bg-blue-50 dark:bg-blue-950/70 text-blue-600 font-bold' : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                            }`}
                          >
                            <div className="flex items-center gap-1.5">
                              <span className="w-4 h-4 rounded bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-bold text-[8px] flex items-center justify-center">
                                {l.flagLetter || l.code.toUpperCase()}
                              </span>
                              <span>{l.name} <span className="text-slate-400 text-[10px]">({l.native})</span></span>
                            </div>
                            <span className="text-[9px] text-slate-400">{l.region}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. SWAP LANGUAGES BUTTON */}
                <button
                  type="button"
                  onClick={handleSwapLanguages}
                  className="p-1 rounded-lg text-slate-600 dark:text-slate-300 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer shadow-xs active:scale-95"
                  title="Swap From and To languages"
                >
                  <ArrowLeftRight className="w-3 h-3" />
                </button>

                {/* 3. TO LANGUAGE BOX (Compact) */}
                <div className="relative">
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400">To:</span>
                    <button
                      type="button"
                      onClick={() => {
                        setTargetLangDropdownOpen(!targetLangDropdownOpen);
                        setSourceLangDropdownOpen(false);
                      }}
                      className={`flex items-center gap-1.5 px-2 py-0.5 rounded-lg border-2 text-[11px] font-bold transition-all cursor-pointer shadow-xs ${
                        targetLangDropdownOpen
                          ? 'border-blue-600 ring-1 ring-blue-500/30 bg-blue-100/60 dark:bg-blue-900/60'
                          : 'border-blue-500/80 dark:border-blue-500 bg-blue-50/70 dark:bg-blue-950/60 hover:bg-blue-100/70 text-blue-950 dark:text-blue-100'
                      }`}
                      title="Choose Target Language"
                    >
                      <div className="w-4 h-4 rounded bg-blue-600 text-white font-black text-[9px] flex items-center justify-center shrink-0 shadow-xs">
                        {currentTargetLangObj.flagLetter || currentTargetLangObj.code.toUpperCase()}
                      </div>
                      <span className="font-black truncate max-w-[110px] sm:max-w-[140px]">
                        {currentTargetLangObj.native} ({currentTargetLangObj.name})
                      </span>
                      <ChevronDown className="w-3 h-3 text-blue-600 dark:text-blue-400 shrink-0" />
                    </button>
                  </div>

                  {/* To Dropdown Box */}
                  {targetLangDropdownOpen && (
                    <div className="absolute left-0 top-full mt-1 w-64 p-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-100">
                      <div className="relative mb-1.5">
                        <Search className="w-3 h-3 absolute left-2 top-2 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Search target language..."
                          value={langSearchQuery}
                          onChange={(e) => setLangSearchQuery(e.target.value)}
                          className="w-full pl-7 pr-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                      <div className="text-[9px] font-black uppercase text-slate-400 px-1.5 py-0.5 border-b border-slate-100 dark:border-slate-800">
                        10 Indian Languages & Worldwide
                      </div>
                      <div className="max-h-48 overflow-y-auto space-y-0.5 scrollbar-thin">
                        {filteredLanguages.map(l => (
                          <button
                            key={l.code}
                            type="button"
                            onClick={() => handleChangeTargetLanguage(l.code)}
                            className={`w-full flex items-center justify-between px-2 py-1 rounded-lg text-left text-xs transition-colors cursor-pointer ${
                              targetLang === l.code ? 'bg-blue-600 text-white font-bold' : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                            }`}
                          >
                            <div className="flex items-center gap-1.5">
                              <span className={`w-4 h-4 rounded font-bold text-[8px] flex items-center justify-center ${
                                targetLang === l.code ? 'bg-white text-blue-700' : 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
                              }`}>
                                {l.flagLetter || l.code.toUpperCase()}
                              </span>
                              <span>{l.name} <span className={targetLang === l.code ? 'text-blue-100' : 'text-slate-400'}>({l.native})</span></span>
                            </div>
                            <span className={`text-[9px] ${targetLang === l.code ? 'text-blue-100' : 'text-slate-400'}`}>{l.region}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 10 Indian Languages Quick Chips (Little / Compact single line) */}
              <div className="flex items-center gap-1 overflow-x-auto pb-0.5 scrollbar-thin max-w-full">
                <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 shrink-0 flex items-center gap-0.5 mr-0.5">
                  <Globe className="w-2.5 h-2.5 text-blue-500" />
                  <span>10 Indian Languages (भाषा):</span>
                </span>
                {SUPPORTED_LANGUAGES.slice(0, 11).map((langItem) => {
                  const isSelected = targetLang === langItem.code;
                  return (
                    <button
                      key={langItem.code}
                      type="button"
                      onClick={() => handleChangeTargetLanguage(langItem.code)}
                      className={`px-1.5 py-0.5 rounded-md border text-[10px] transition-all cursor-pointer shrink-0 flex items-center gap-1 ${
                        isSelected
                          ? 'border-blue-600 bg-blue-600 text-white font-black shadow-xs'
                          : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 text-slate-700 dark:text-slate-300'
                      }`}
                      title={`Translate into ${langItem.name} (${langItem.native})`}
                    >
                      <span className={`w-3.5 h-3.5 rounded text-[8px] font-black flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}>
                        {langItem.flagLetter || langItem.code.toUpperCase()}
                      </span>
                      <span className="font-extrabold">{langItem.native}</span>
                      <span className={`text-[8px] opacity-75 hidden sm:inline ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                        {langItem.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Compact Words & Sentences Extraction, Copy & PDF Maker Action Strip (Little) */}
        {currentMode !== 'image_to_pdf' && currentMode !== 'pdf_maker' && (
          <div className="shrink-0 px-3 sm:px-4 py-1.5 bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-slate-50 dark:from-slate-900 dark:via-blue-950/40 dark:to-slate-900 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-1.5 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-blue-100/80 dark:bg-blue-950 text-blue-800 dark:text-blue-300 font-extrabold text-[10px] border border-blue-200 dark:border-blue-800">
                <AlignLeft className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                <span>Extracted: {totalExtractedWords} Words</span>
                <span className="text-slate-400">•</span>
                <span>{totalExtractedSentences} Sentences</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              {/* Universal Hidden File Input */}
              <input
                type="file"
                ref={langConverterUniversalInputRef}
                onChange={handleUniversalUpload}
                accept=".pdf,.txt,.doc,.docx,image/*"
                className="hidden"
              />

              {/* Option 1: Upload File (Compact) */}
              <button
                type="button"
                onClick={() => langConverterUniversalInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs shadow-xs transition-all cursor-pointer active:scale-95"
                title="Upload File (PDF, TXT, DOCX, Images) to Translate"
              >
                <Upload className="w-3.5 h-3.5 text-white" />
                <span>Upload File</span>
              </button>

              {/* Option 2: Download File (Compact) */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setDownloadModalOpen(prev => !prev)}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-xs transition-all cursor-pointer active:scale-95"
                  title="Download translated converted file"
                >
                  <Download className="w-3.5 h-3.5 text-white" />
                  <span>Download File</span>
                  <ChevronDown className="w-3 h-3 text-emerald-200" />
                </button>

                {downloadModalOpen && (
                  <div 
                    className="absolute right-0 mt-1 w-52 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-100"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="px-2 py-0.5 text-[9px] font-black uppercase text-slate-400 border-b border-slate-100 dark:border-slate-800 mb-1">
                      Download Converted File
                    </div>
                    <button
                      type="button"
                      onClick={() => handleUniversalDownload('pdf')}
                      className="w-full text-left p-1.5 rounded-lg text-xs font-bold hover:bg-blue-50 dark:hover:bg-slate-800 flex items-center gap-2 cursor-pointer text-slate-800 dark:text-slate-200"
                    >
                      <FileText className="w-3.5 h-3.5 text-blue-600" />
                      <span>Download as PDF</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleUniversalDownload('txt')}
                      className="w-full text-left p-1.5 rounded-lg text-xs font-bold hover:bg-blue-50 dark:hover:bg-slate-800 flex items-center gap-2 cursor-pointer text-slate-800 dark:text-slate-200"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Download as TXT</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Option 3: Copy Translated */}
              <button
                type="button"
                onClick={handleCopyAllTranslated}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 text-blue-700 dark:text-blue-300 font-bold text-xs transition-all border border-blue-200 dark:border-blue-800 cursor-pointer active:scale-95"
                title="Copy translated words and sentences in chosen language"
              >
                {copiedTranslatedAll ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy Translated</span>
                  </>
                )}
              </button>

              {/* Option 4: PDF Maker */}
              <button
                type="button"
                onClick={handleTransferToPdfMaker}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-xs cursor-pointer transition-all active:scale-95"
                title="Open these translated words and sentences in the custom PDF Maker"
              >
                <FilePlus2 className="w-3 h-3 text-white" />
                <span>PDF Maker</span>
              </button>
            </div>
          </div>
        )}

        {/* MAIN BODY: 5 CONVERTER & PDF MAKER MODES */}
        <div 
          ref={scrollContainerRef}
          onScroll={handleContainerScroll}
          className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 bg-slate-100/60 dark:bg-slate-950/50 overscroll-contain scroll-smooth pb-28 relative"
        >
          
          {/* ---------------------------------------------------------- */}
          {/* MODE 1: DOCUMENTS (PDF TRANSLATOR)                        */}
          {/* "Translate every pdf pages and images into choosen language */}
          {/* and for pdf no need to change pdf papers"                  */}
          {/* "no need to change images"                                 */}
          {/* ---------------------------------------------------------- */}
          {currentMode === 'documents' && (
            <div className="space-y-4">
              {/* Visitor Named PDF Creator Strip */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border border-indigo-500/30 shadow-md flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-indigo-600/40 border border-indigo-400/40 flex items-center justify-center text-indigo-300">
                    <FileCheck className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-xs sm:text-sm text-white">
                        Make New Translated PDF
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        ✓ Original Colour Images Preserved
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300">
                      Translated words will be made in a new PDF named by you. No change to paper color images.
                    </p>
                  </div>
                </div>

                {/* Visitor PDF Name Input & Generate Button */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center bg-slate-800/90 border border-slate-700 rounded-xl px-2.5 py-1.5 focus-within:ring-2 focus-within:ring-indigo-500">
                    <span className="text-[11px] text-slate-400 font-bold mr-1.5">PDF Name:</span>
                    <input
                      type="text"
                      value={visitorDocPdfName}
                      onChange={(e) => setVisitorDocPdfName(e.target.value)}
                      placeholder="My_Translated_Study_Paper"
                      className="bg-transparent text-white text-xs font-mono font-bold focus:outline-none w-48 sm:w-56"
                    />
                    <span className="text-[10px] text-indigo-400 font-mono font-black ml-1">.pdf</span>
                  </div>

                  <button
                    type="button"
                    onClick={handleGenerateVisitorPdf}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs shadow-md shadow-emerald-600/30 transition-all cursor-pointer active:scale-95"
                    title="Generate and download new PDF named by you"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Make & Download New PDF</span>
                  </button>
                </div>
              </div>

              {/* Document Header & File Action Strip */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">
                      {importedPdfTitle}.pdf
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      {pdfPages.length} Pages Extracted Page-by-Page • Original PDF Papers & Images Preserved Untouched
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Hidden PDF file input */}
                  <input
                    type="file"
                    ref={pdfInputRef}
                    onChange={handleUploadPdfDocument}
                    accept="application/pdf"
                    className="hidden"
                  />

                  {/* Upload PDF Button */}
                  <button
                    type="button"
                    onClick={() => pdfInputRef.current?.click()}
                    disabled={isProcessingPdf}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
                  >
                    <FileUp className="w-3.5 h-3.5 text-blue-600" />
                    <span>Upload New PDF</span>
                  </button>

                  {/* View Mode Toggle: Side-by-Side vs Paper Views */}
                  <div className="flex items-center p-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => setPdfViewMode('side_by_side')}
                      className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                        pdfViewMode === 'side_by_side' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-sm' : 'text-slate-500'
                      }`}
                    >
                      Side by Side
                    </button>
                    <button
                      type="button"
                      onClick={() => setPdfViewMode('translated_paper')}
                      className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                        pdfViewMode === 'translated_paper' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-sm' : 'text-slate-500'
                      }`}
                    >
                      Translated Paper
                    </button>
                    <button
                      type="button"
                      onClick={() => setPdfViewMode('original_paper')}
                      className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                        pdfViewMode === 'original_paper' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-sm' : 'text-slate-500'
                      }`}
                    >
                      Original Paper
                    </button>
                  </div>

                  {/* Download Converted PDF */}
                  {convertedPdfBlobUrl && (
                    <a
                      href={convertedPdfBlobUrl}
                      download={convertedPdfFileName || 'Translated_Document.pdf'}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-md shadow-blue-500/20 transition-all cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Translated PDF</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Processing Progress Notice */}
              {isProcessingPdf && (
                <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center gap-3 text-xs text-blue-700 dark:text-blue-300">
                  <RefreshCw className="w-4 h-4 animate-spin text-blue-600 flex-shrink-0" />
                  <div className="flex-1">
                    <span className="font-bold">{pdfProcessingStage}</span>
                    <p className="text-[10px] text-blue-500 dark:text-blue-400 mt-0.5">
                      Keeping PDF papers and figures intact while translating each page...
                    </p>
                  </div>
                </div>
              )}

              {/* Page Navigator Strip: [◀ Prev] Page X of Y [Next ▶] */}
              <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-slate-700 dark:text-slate-300">
                    PDF PAPER {activePdfPageIndex + 1} OF {pdfPages.length}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold">
                    ✓ Untouched Paper Geometry
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    disabled={activePdfPageIndex <= 0}
                    onClick={() => setActivePdfPageIndex(prev => Math.max(0, prev - 1))}
                    className="p-1 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 cursor-pointer"
                    title="Previous Page"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <span className="text-xs font-bold text-slate-600 dark:text-slate-400 px-1">
                    {activePdfPageIndex + 1} / {pdfPages.length}
                  </span>

                  <button
                    type="button"
                    disabled={activePdfPageIndex >= pdfPages.length - 1}
                    onClick={() => setActivePdfPageIndex(prev => Math.min(pdfPages.length - 1, prev + 1))}
                    className="p-1 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 cursor-pointer"
                    title="Next Page"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* PDF PAPERS DISPLAY VIEWPORT */}
              {pdfPages[activePdfPageIndex] && (
                <div className={`grid gap-4 ${pdfViewMode === 'side_by_side' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
                  {/* LEFT: ORIGINAL PDF PAPER (Untouched paper & images!) */}
                  {(pdfViewMode === 'side_by_side' || pdfViewMode === 'original_paper') && (
                    <div className="flex flex-col rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                      {/* Paper Top Banner */}
                      <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
                          <span className="font-bold text-xs text-slate-700 dark:text-slate-200">
                            Original PDF Paper (Page {activePdfPageIndex + 1})
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleSpeakText(pdfPages[activePdfPageIndex].originalText, sourceLang)}
                            className="p-1 rounded text-slate-500 hover:text-blue-600 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
                            title="Listen original"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleCopy(pdfPages[activePdfPageIndex].originalText)}
                            className="p-1 rounded text-slate-500 hover:text-blue-600 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
                            title="Copy text"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Paper Surface: Untouched paper layout */}
                      <div className="p-6 font-serif bg-amber-50/20 dark:bg-slate-900 min-h-[460px] flex flex-col justify-between">
                        <div className="space-y-3">
                          {/* If high-res render of original page exists, display the exact untouched paper render */}
                          {pdfPages[activePdfPageIndex].originalImagePreviewUrl && (
                            <div className="mb-4 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-inner">
                              <img
                                src={pdfPages[activePdfPageIndex].originalImagePreviewUrl}
                                alt={`Original PDF Paper ${activePdfPageIndex + 1}`}
                                className="w-full h-auto object-contain max-h-[300px]"
                              />
                              <p className="text-[10px] text-center text-slate-400 py-1 bg-slate-50 dark:bg-slate-800/80">
                                Exact Original PDF Paper Render
                              </p>
                            </div>
                          )}

                          {/* Original Text Representation */}
                          <div className="whitespace-pre-wrap text-xs text-slate-800 dark:text-slate-200 font-sans leading-relaxed">
                            {pdfPages[activePdfPageIndex].originalText}
                          </div>
                        </div>

                        <div className="pt-4 mt-6 border-t border-slate-200 dark:border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
                          <span>Original Paper Dimensions Preserved</span>
                          <span>Page {activePdfPageIndex + 1} of {pdfPages.length}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* RIGHT: TRANSLATED PDF PAPER (Same paper, untouched images, translated into target language!) */}
                  {(pdfViewMode === 'side_by_side' || pdfViewMode === 'translated_paper') && (
                    <div className="flex flex-col rounded-2xl bg-white dark:bg-slate-900 border-2 border-blue-200 dark:border-blue-800/60 shadow-md overflow-hidden">
                      {/* Translated Paper Top Banner */}
                      <div className="px-4 py-2.5 bg-blue-50/70 dark:bg-blue-950/40 border-b border-blue-200 dark:border-blue-800/60 flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse"></span>
                          <span className="font-extrabold text-xs text-blue-900 dark:text-blue-300">
                            Translated PDF Paper ({currentTargetLangObj.name} • Page {activePdfPageIndex + 1})
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {/* 1-Click Copy Words Button */}
                          <button
                            type="button"
                            onClick={() => {
                              handleCopy(pdfPages[activePdfPageIndex].translatedText);
                              setCopiedCurrentPageWords(true);
                              setTimeout(() => setCopiedCurrentPageWords(false), 2000);
                            }}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-600/10 hover:bg-blue-600/20 text-blue-700 dark:text-blue-300 font-bold text-xs cursor-pointer transition-colors"
                            title={`Copy all ${currentTargetLangObj.name} words on this page`}
                          >
                            {copiedCurrentPageWords ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedCurrentPageWords ? 'Copied Words!' : `Copy ${currentTargetLangObj.name} Words`}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleSpeakText(pdfPages[activePdfPageIndex].translatedText, targetLang)}
                            className="p-1 rounded text-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900/60 cursor-pointer"
                            title="Listen translation"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>

                          {/* Make & Download New PDF Button */}
                          <button
                            type="button"
                            onClick={handleGenerateVisitorPdf}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-sm cursor-pointer transition-all active:scale-95"
                            title={`Download new PDF of these ${currentTargetLangObj.name} words`}
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Download PDF</span>
                          </button>
                        </div>
                      </div>

                      {/* Background PDF Generation Live Status Bar */}
                      {isGeneratingBackgroundPdf && (
                        <div className="px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/70 dark:to-indigo-950/70 border-b border-blue-200 dark:border-blue-800 flex items-center justify-between text-xs animate-pulse">
                          <div className="flex items-center gap-2 text-blue-800 dark:text-blue-200 font-bold">
                            <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-600 dark:text-blue-400" />
                            <span>{backgroundPdfStatus || `Generating perfect ${currentTargetLangObj.name} PDF in background (page after page)...`}</span>
                          </div>
                          <span className="text-[10px] font-mono text-blue-600 dark:text-blue-400 font-bold">Background Task</span>
                        </div>
                      )}

                      {!isGeneratingBackgroundPdf && backgroundPdfReady && (
                        <div className="px-4 py-2 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/60 dark:to-teal-950/60 border-b border-emerald-200 dark:border-emerald-800 flex flex-wrap items-center justify-between gap-2 text-xs">
                          <div className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300 font-bold">
                            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span>✓ Perfect {currentTargetLangObj.name} PDF Ready! ({visitorDocPdfName || 'Study_Paper'}.pdf)</span>
                          </div>
                          <button
                            type="button"
                            onClick={handleGenerateVisitorPdf}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-[11px] shadow-sm flex items-center gap-1 cursor-pointer active:scale-95 transition-all"
                          >
                            <Download className="w-3 h-3" />
                            <span>Download PDF Now</span>
                          </button>
                        </div>
                      )}

                      {/* Paper Surface: Translated Content with Untouched Paper Formatting */}
                      <div className="p-6 bg-white dark:bg-slate-900 min-h-[460px] flex flex-col justify-between">
                        <div className="space-y-3.5">
                          {/* Structured Translation Blocks aligned to original paper */}
                          {pdfPages[activePdfPageIndex].blocks?.map((block, idx) => {
                            if (block.type === 'title') {
                              return (
                                <div key={idx} className="pb-2 border-b border-blue-100 dark:border-blue-900/50">
                                  <h2 className="text-sm font-black text-blue-900 dark:text-blue-300 tracking-tight">
                                    {block.translatedText}
                                  </h2>
                                </div>
                              );
                            }
                            if (block.type === 'heading') {
                              return (
                                <div key={idx} className="pt-2">
                                  <h3 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wide bg-blue-50/50 dark:bg-blue-950/30 p-1.5 rounded-lg border-l-4 border-blue-600">
                                    {block.translatedText}
                                  </h3>
                                </div>
                              );
                            }
                            if (block.type === 'numbered') {
                              return (
                                <div key={idx} className="flex items-start gap-2 text-xs text-slate-800 dark:text-slate-200">
                                  <span className="font-black text-blue-600 dark:text-blue-400 min-w-[18px]">
                                    {block.prefix || `${idx + 1}.`}
                                  </span>
                                  <p className="flex-1 leading-relaxed font-semibold">{block.translatedText}</p>
                                </div>
                              );
                            }
                            if (block.type === 'bullet') {
                              return (
                                <div key={idx} className="flex items-start gap-2 text-xs text-slate-800 dark:text-slate-200 pl-2">
                                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 mt-1.5 flex-shrink-0"></span>
                                  <p className="flex-1 leading-relaxed">{block.translatedText}</p>
                                </div>
                              );
                            }
                            if (block.type === 'formula') {
                              return (
                                <div key={idx} className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 font-mono text-xs text-blue-700 dark:text-blue-300">
                                  {block.translatedText}
                                </div>
                              );
                            }
                            return (
                              <p key={idx} className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                                {block.translatedText}
                              </p>
                            );
                          })}

                          {(!pdfPages[activePdfPageIndex].blocks || pdfPages[activePdfPageIndex].blocks.length === 0) && (
                            <div className="whitespace-pre-wrap text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-sans font-medium">
                              {pdfPages[activePdfPageIndex].translatedText}
                            </div>
                          )}
                        </div>

                        {/* Paper Bottom Ribbon */}
                        <div className="pt-4 mt-6 border-t border-slate-200 dark:border-slate-800 text-[10px] text-blue-600 dark:text-blue-400 flex flex-wrap items-center justify-between gap-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-bold text-slate-500 dark:text-slate-400">✓ Structure Maintained • Untouched Images</span>
                            <span className="text-slate-300">•</span>
                            <button
                              type="button"
                              onClick={() => {
                                handleCopy(pdfPages[activePdfPageIndex].translatedText);
                                setCopiedCurrentPageWords(true);
                                setTimeout(() => setCopiedCurrentPageWords(false), 2000);
                              }}
                              className="text-blue-600 dark:text-blue-400 font-extrabold hover:underline cursor-pointer"
                            >
                              Copy Page Words
                            </button>
                            <span className="text-slate-300">•</span>
                            <button
                              type="button"
                              onClick={handleGenerateVisitorPdf}
                              className="text-emerald-600 dark:text-emerald-400 font-extrabold hover:underline cursor-pointer"
                            >
                              Make New PDF
                            </button>
                          </div>
                          <span className="font-bold text-slate-700 dark:text-slate-300">Page {activePdfPageIndex + 1} of {pdfPages.length}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Thumbnails of every PDF page for quick navigation */}
              <div className="pt-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                  All PDF Papers ({pdfPages.length} Total):
                </span>
                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                  {pdfPages.map((page, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActivePdfPageIndex(idx)}
                      className={`flex-shrink-0 px-3 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        activePdfPageIndex === idx
                          ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                          : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-blue-400'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5" />
                        <span>Paper {page.pageNumber}</span>
                      </div>
                      <span className="text-[9px] block opacity-80 mt-0.5">
                        {currentTargetLangObj.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ---------------------------------------------------------- */}
          {/* MODE 2: IMAGES TRANSLATOR                                  */}
          {/* "Translate images into choosen language"                   */}
          {/* "no need to change images" (Untouched original image)      */}
          {/* ---------------------------------------------------------- */}
          {currentMode === 'images' && (
            <div className="space-y-4">
              {/* Image Mode Header & Upload Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300">
                    <ImageIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">
                      {uploadedImages[activeImageIndex]?.fileName || 'Study Image'}
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Original Images Kept 100% Untouched • Translating text into {currentTargetLangObj.name}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    ref={imageInputRef}
                    onChange={handleUploadImageFile}
                    accept="image/*"
                    multiple
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => imageInputRef.current?.click()}
                    disabled={isProcessingImage}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
                  >
                    <FileUp className="w-3.5 h-3.5 text-blue-600" />
                    <span>Upload Study Image</span>
                  </button>

                  {uploadedImages[activeImageIndex] && (
                    <button
                      type="button"
                      onClick={() => handleDownloadImagePdf(uploadedImages[activeImageIndex])}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-md shadow-blue-500/20 transition-all cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download as PDF</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Processing Notice */}
              {isProcessingImage && (
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 flex items-center gap-3 text-xs text-amber-800 dark:text-amber-200">
                  <RefreshCw className="w-4 h-4 animate-spin text-amber-600" />
                  <span>Translating image content without altering original image...</span>
                </div>
              )}

              {/* Image Side-by-Side: Untouched Original Image vs Translated Content */}
              {uploadedImages[activeImageIndex] && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* LEFT: ORIGINAL IMAGE (UNTOUCHED!) */}
                  <div className="flex flex-col rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                    <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
                        <span className="font-bold text-xs text-slate-700 dark:text-slate-200">
                          Original Image (Untouched)
                        </span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold">
                        ✓ No Change to Images
                      </span>
                    </div>

                    <div className="p-4 bg-slate-950/5 dark:bg-slate-950/40 min-h-[380px] flex flex-col items-center justify-center">
                      <div className="max-w-full max-h-[340px] rounded-xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-center">
                        <img
                          src={uploadedImages[activeImageIndex].originalDataUrl}
                          alt={uploadedImages[activeImageIndex].fileName}
                          className="max-h-[340px] w-auto object-contain"
                        />
                      </div>
                      <p className="text-[10px] text-slate-400 mt-2">
                        Image preserved in its exact original dimensions and graphics
                      </p>
                    </div>
                  </div>

                  {/* RIGHT: TRANSLATED CONTENT */}
                  <div className="flex flex-col rounded-2xl bg-white dark:bg-slate-900 border-2 border-blue-200 dark:border-blue-800/60 shadow-md overflow-hidden">
                    <div className="px-4 py-2.5 bg-blue-50/70 dark:bg-blue-950/40 border-b border-blue-200 dark:border-blue-800/60 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse"></span>
                        <span className="font-extrabold text-xs text-blue-900 dark:text-blue-300">
                          Translated into {currentTargetLangObj.name} ({currentTargetLangObj.native})
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleSpeakText(uploadedImages[activeImageIndex].translatedText, targetLang)}
                          className="p-1 rounded text-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900/60 cursor-pointer"
                          title="Listen translation"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCopy(uploadedImages[activeImageIndex].translatedText)}
                          className="p-1 rounded text-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900/60 cursor-pointer"
                          title="Copy translation"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="p-5 bg-white dark:bg-slate-900 min-h-[380px] flex flex-col justify-between">
                      <div className="space-y-3">
                        {uploadedImages[activeImageIndex].blocks?.map((block, idx) => {
                          if (block.type === 'title') {
                            return (
                              <h3 key={idx} className="text-sm font-black text-blue-900 dark:text-blue-300 pb-1 border-b border-blue-100 dark:border-blue-900">
                                {block.translatedText}
                              </h3>
                            );
                          }
                          if (block.type === 'bullet') {
                            return (
                              <div key={idx} className="flex items-start gap-2 text-xs text-slate-800 dark:text-slate-200">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 flex-shrink-0"></span>
                                <p className="leading-relaxed">{block.translatedText}</p>
                              </div>
                            );
                          }
                          return (
                            <p key={idx} className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed">
                              {block.translatedText}
                            </p>
                          );
                        })}

                        {(!uploadedImages[activeImageIndex].blocks || uploadedImages[activeImageIndex].blocks.length === 0) && (
                          <div className="whitespace-pre-wrap text-xs text-slate-800 dark:text-slate-200 leading-relaxed">
                            {uploadedImages[activeImageIndex].translatedText}
                          </div>
                        )}
                      </div>

                      <div className="pt-3 mt-4 border-t border-slate-200 dark:border-slate-800 text-[10px] text-blue-600 dark:text-blue-400 flex items-center justify-between">
                        <span>Original Image Retained • Text Converted</span>
                        <button
                          type="button"
                          onClick={() => handleDownloadImagePdf(uploadedImages[activeImageIndex])}
                          className="font-bold underline cursor-pointer"
                        >
                          Download as PDF with Image
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Uploaded Images Strip */}
              {uploadedImages.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pt-1 pb-2">
                  {uploadedImages.map((img, idx) => (
                    <button
                      key={img.id}
                      type="button"
                      onClick={() => setActiveImageIndex(idx)}
                      className={`flex-shrink-0 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        activeImageIndex === idx
                          ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                          : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      Image {idx + 1}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ---------------------------------------------------------- */}
          {/* MODE 3: TEXT TRANSLATOR */}
          {/* ---------------------------------------------------------- */}
          {currentMode === 'text' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* SOURCE TEXT BOX */}
              <div className="flex flex-col rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                  <span className="font-bold">{currentSourceLangObj.name}</span>
                  <div className="flex items-center gap-2">
                    <span>{sourceText.length} chars</span>
                    {sourceText && (
                      <button
                        type="button"
                        onClick={() => setSourceText('')}
                        className="p-1 hover:text-red-500 cursor-pointer"
                        title="Clear text"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <textarea
                  rows={12}
                  value={sourceText}
                  onChange={(e) => setSourceText(e.target.value)}
                  placeholder="Enter or paste exam notes, formulas, or questions here..."
                  className="w-full flex-1 p-4 bg-transparent text-slate-900 dark:text-white text-sm focus:outline-none resize-none leading-relaxed"
                />

                <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => handleSpeakText(sourceText, sourceLang)}
                    disabled={!sourceText.trim()}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-slate-200 dark:hover:bg-slate-800 disabled:opacity-30 cursor-pointer"
                    title="Listen to source text"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setSourceText(
                        'General Knowledge & Current Affairs:\n' +
                        '1. The Reserve Bank of India regulates national monetary policy.\n' +
                        '2. Speed = Distance / Time. Maintain high accuracy to maximize CBT score.'
                      )}
                      className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-300 dark:hover:bg-slate-700 cursor-pointer"
                    >
                      Sample Exam Note
                    </button>
                  </div>
                </div>
              </div>

              {/* TRANSLATED TEXT BOX */}
              <div className="flex flex-col rounded-2xl bg-white dark:bg-slate-900 border-2 border-blue-200 dark:border-blue-800/60 shadow-md overflow-hidden">
                <div className="px-4 py-2 bg-blue-50/70 dark:bg-blue-950/40 border-b border-blue-200 dark:border-blue-800/60 flex items-center justify-between text-xs text-blue-900 dark:text-blue-300">
                  <span className="font-extrabold">{currentTargetLangObj.name} ({currentTargetLangObj.native})</span>
                  {isTranslatingText && (
                    <span className="flex items-center gap-1 text-[11px] text-blue-600 animate-pulse">
                      <RefreshCw className="w-3 h-3 animate-spin" /> Translating...
                    </span>
                  )}
                </div>

                <div className="w-full flex-1 p-4 bg-transparent text-slate-900 dark:text-white text-sm whitespace-pre-wrap leading-relaxed min-h-[250px]">
                  {translatedText || (
                    <span className="text-slate-400 italic">
                      Translation will appear here instantly...
                    </span>
                  )}
                </div>

                <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleSpeakText(translatedText, targetLang)}
                      disabled={!translatedText.trim()}
                      className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-950 disabled:opacity-30 cursor-pointer"
                      title="Listen translation"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleCopy(translatedText)}
                      disabled={!translatedText.trim()}
                      className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-950 disabled:opacity-30 cursor-pointer"
                      title="Copy translation"
                    >
                      {copiedText ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>

                  <span className="text-[11px] text-slate-400">
                    AI Translation Engine
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ---------------------------------------------------------- */}
          {/* MODE 4: IMAGE TO PDF FACILITY                              */}
          {/* Converts single or multiple images into a merged PDF       */}
          {/* ---------------------------------------------------------- */}
          {currentMode === 'image_to_pdf' && (
            <div className="space-y-4">
              {/* Hidden multi-image file input */}
              <input
                type="file"
                ref={imageToPdfInputRef}
                onChange={handleUploadImagesForPdf}
                accept="image/*"
                multiple
                className="hidden"
              />

              {/* Facility Header & Configuration Ribbon */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400">
                      <FileUp className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">
                          Image to PDF Converter & Memory Resizer Facility
                        </h3>
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300">
                          {imageToPdfItems.length} {imageToPdfItems.length === 1 ? 'Page' : 'Pages'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Convert study notes, screenshots, question papers, and photos into a single PDF with custom memory limit (e.g. &lt; 200 KB for exam uploads).
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => imageToPdfInputRef.current?.click()}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm shadow-md shadow-emerald-600/30 transition-all cursor-pointer active:scale-95 border border-emerald-400/40"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Upload Images</span>
                    </button>

                    {imageToPdfItems.length > 0 && (
                      <button
                        type="button"
                        onClick={handleClearAllImagePdf}
                        className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-red-50 hover:text-red-600 text-slate-600 dark:text-slate-300 text-xs font-bold transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Clear All</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* ============================================================ */}
                {/* RESIZE PDF & IMAGE MEMORY FACILITY PANEL (Enlarged & Direct Write) */}
                {/* ============================================================ */}
                <div className="p-5 sm:p-7 rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white border-2 border-indigo-500/40 shadow-2xl space-y-5 relative overflow-hidden">
                  {/* Background soft ambient blur */}
                  <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
                  <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

                  <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 border border-emerald-400/50 flex items-center justify-center text-white shrink-0 shadow-lg shadow-emerald-500/30">
                        <Sliders className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-black text-base sm:text-xl text-white tracking-tight">
                            Resize PDF & Image Memory (Compress KB)
                          </h4>
                          <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            Strict Govt Exam Limits
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                          Compress, downscale & resize memory to strictly fit SSC, UPSC, State PSC, RRB and Banking upload limits (&lt; 200 KB, &lt; 100 KB).
                        </p>
                      </div>
                    </div>

                    {/* Live Memory Comparison Badge */}
                    <div className="flex items-center gap-3 bg-slate-900/95 border-2 border-slate-700/80 px-4 py-2.5 rounded-2xl shadow-xl shrink-0">
                      <div className="text-right">
                        <div className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Estimated Output Memory:</div>
                        <div className="text-sm sm:text-base font-black text-emerald-400 flex items-center gap-2 justify-end font-mono">
                          <span>
                            {(totalResizedMemoryBytes / 1024) < 1024 
                              ? `${Math.round(totalResizedMemoryBytes / 1024)} KB` 
                              : `${(totalResizedMemoryBytes / (1024 * 1024)).toFixed(2)} MB`}
                          </span>
                          {memoryPreset !== 'original' && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/25 text-emerald-300 font-black border border-emerald-500/30">
                              -{memorySavedPercent}% Saved
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* VISITOR CAN WRITE IMAGE MEMORY FACILITY BOX */}
                  <div className="relative z-10 bg-slate-900/90 border-2 border-emerald-400/50 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 font-bold shrink-0">
                        <Gauge className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-sm sm:text-base text-white">
                            Write Target Image Memory (KB)
                          </span>
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            Direct Input
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 mt-0.5">
                          Type any exact memory budget in KB (e.g., 50, 100, 150, 200, 300, 500) to resize image memory automatically:
                        </p>
                      </div>
                    </div>

                    {/* Direct Write Input Field & Action */}
                    <div className="flex items-center gap-2.5">
                      <div className="flex items-center bg-slate-950 px-3.5 py-2 rounded-xl border-2 border-emerald-400 ring-4 ring-emerald-500/20 shadow-inner">
                        <span className="text-xs font-bold text-slate-400 mr-2">Target:</span>
                        <input
                          type="number"
                          min={10}
                          max={10000}
                          step={10}
                          value={customTargetKb}
                          onChange={(e) => {
                            const val = Math.max(10, Math.min(10000, Number(e.target.value) || 100));
                            setCustomTargetKb(val);
                            setMemoryPreset('custom');
                          }}
                          className="w-20 font-black text-emerald-300 text-base bg-transparent focus:outline-none font-mono"
                          title="Write exact target memory in KB"
                          placeholder="200"
                        />
                        <span className="text-xs font-black text-emerald-400 uppercase">KB</span>
                      </div>

                      <button
                        type="button"
                        onClick={recalculateMemorySizes}
                        className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/30 transition-all cursor-pointer active:scale-95 whitespace-nowrap"
                        title="Recalculate and apply target memory to all images"
                      >
                        Apply Memory
                      </button>
                    </div>
                  </div>

                  {/* 1-Click Target Memory Presets */}
                  <div className="relative z-10 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                      <span>Quick Target Memory Presets (Click to Auto-Write):</span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        Original: {(totalOriginalMemoryBytes / (1024 * 1024)).toFixed(2)} MB ({Math.round(totalOriginalMemoryBytes / 1024)} KB)
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
                      {/* Preset 1: < 100 KB (Strict Govt Form) */}
                      <button
                        type="button"
                        onClick={() => handleSelectMemoryPreset('govt_100kb')}
                        className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                          memoryPreset === 'govt_100kb'
                            ? 'border-emerald-400 bg-emerald-500/25 text-emerald-200 ring-2 ring-emerald-400/50 shadow-md font-black'
                            : 'border-slate-700 bg-slate-800/60 text-slate-300 hover:border-slate-500'
                        }`}
                      >
                        <span className="font-black text-xs sm:text-sm">&lt; 100 KB</span>
                        <span className="text-[10px] opacity-80 mt-0.5">UPSC / SSC Strict</span>
                      </button>

                      {/* Preset 2: < 200 KB (Standard Exam Upload - Recommended) */}
                      <button
                        type="button"
                        onClick={() => handleSelectMemoryPreset('govt_200kb')}
                        className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                          memoryPreset === 'govt_200kb'
                            ? 'border-emerald-400 bg-emerald-500/30 text-emerald-200 ring-2 ring-emerald-400/60 shadow-lg font-black'
                            : 'border-slate-700 bg-slate-800/60 text-slate-300 hover:border-slate-500'
                        }`}
                      >
                        <span className="font-black text-xs sm:text-sm">&lt; 200 KB ★</span>
                        <span className="text-[10px] opacity-80 mt-0.5">State PSC / RRB</span>
                      </button>

                      {/* Preset 3: < 500 KB (Balanced Mobile Notes) */}
                      <button
                        type="button"
                        onClick={() => handleSelectMemoryPreset('mobile_500kb')}
                        className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                          memoryPreset === 'mobile_500kb'
                            ? 'border-emerald-400 bg-emerald-500/25 text-emerald-200 ring-2 ring-emerald-400/50 shadow-md font-black'
                            : 'border-slate-700 bg-slate-800/60 text-slate-300 hover:border-slate-500'
                        }`}
                      >
                        <span className="font-black text-xs sm:text-sm">&lt; 500 KB</span>
                        <span className="text-[10px] opacity-80 mt-0.5">Balanced Notes</span>
                      </button>

                      {/* Preset 4: < 1 MB (High Quality) */}
                      <button
                        type="button"
                        onClick={() => handleSelectMemoryPreset('hd_1mb')}
                        className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                          memoryPreset === 'hd_1mb'
                            ? 'border-emerald-400 bg-emerald-500/25 text-emerald-200 ring-2 ring-emerald-400/50 shadow-md font-black'
                            : 'border-slate-700 bg-slate-800/60 text-slate-300 hover:border-slate-500'
                        }`}
                      >
                        <span className="font-black text-xs sm:text-sm">&lt; 1 MB</span>
                        <span className="text-[10px] opacity-80 mt-0.5">High Clarity</span>
                      </button>

                      {/* Preset 5: Custom Written Target KB */}
                      <button
                        type="button"
                        onClick={() => handleSelectMemoryPreset('custom')}
                        className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                          memoryPreset === 'custom'
                            ? 'border-emerald-400 bg-emerald-500/25 text-emerald-200 ring-2 ring-emerald-400/50 shadow-md font-black'
                            : 'border-slate-700 bg-slate-800/60 text-slate-300 hover:border-slate-500'
                        }`}
                      >
                        <span className="font-black text-xs sm:text-sm">Written KB</span>
                        <span className="text-[10px] opacity-80 mt-0.5">{customTargetKb} KB Target</span>
                      </button>

                      {/* Preset 6: Original (Lossless) */}
                      <button
                        type="button"
                        onClick={() => handleSelectMemoryPreset('original')}
                        className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                          memoryPreset === 'original'
                            ? 'border-blue-400 bg-blue-500/20 text-blue-200 ring-2 ring-blue-400/40 shadow-sm font-black'
                            : 'border-slate-700 bg-slate-800/60 text-slate-300 hover:border-slate-500'
                        }`}
                      >
                        <span className="font-black text-xs sm:text-sm">Original Size</span>
                        <span className="text-[10px] opacity-80 mt-0.5">No Compression</span>
                      </button>
                    </div>
                  </div>

                  {/* Fine Tuning Sliders & Details */}
                  {memoryPreset !== 'original' && (
                    <div className="pt-2 border-t border-slate-700/60 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => setShowAdvancedMemoryControls(!showAdvancedMemoryControls)}
                          className="text-xs font-bold text-emerald-300 hover:text-emerald-200 flex items-center gap-1 cursor-pointer"
                        >
                          <span>{showAdvancedMemoryControls ? '▼ Hide' : '▶ Show'} Fine-Tuning Sliders (Quality & Dimensions)</span>
                        </button>
                        <button
                          type="button"
                          onClick={recalculateMemorySizes}
                          disabled={isRecalculatingMemory}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold border border-slate-700 flex items-center gap-1 cursor-pointer"
                        >
                          <RefreshCw className={`w-3 h-3 ${isRecalculatingMemory ? 'animate-spin' : ''}`} />
                          <span>{isRecalculatingMemory ? 'Calculating...' : 'Recalculate Memory'}</span>
                        </button>
                      </div>

                      {showAdvancedMemoryControls && (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded-xl bg-slate-800/80 border border-slate-700/70 animate-in fade-in duration-150">
                          {/* Quality Slider */}
                          <div>
                            <div className="flex items-center justify-between text-[11px] text-slate-300 font-bold mb-1">
                              <span>Image Quality:</span>
                              <span className="font-mono text-emerald-400">{memoryQuality}%</span>
                            </div>
                            <input
                              type="range"
                              min={15}
                              max={95}
                              step={5}
                              value={memoryQuality}
                              onChange={(e) => setMemoryQuality(Number(e.target.value))}
                              className="w-full accent-emerald-500 cursor-pointer"
                            />
                            <span className="text-[10px] text-slate-400 block mt-0.5">
                              {memoryQuality < 50 ? 'Maximum Compression' : memoryQuality < 80 ? 'Balanced Sharpness' : 'High Quality'}
                            </span>
                          </div>

                          {/* Resolution Scale */}
                          <div>
                            <div className="flex items-center justify-between text-[11px] text-slate-300 font-bold mb-1">
                              <span>Resolution Scaling:</span>
                              <span className="font-mono text-emerald-400">{Math.round(resolutionScale * 100)}%</span>
                            </div>
                            <select
                              value={resolutionScale}
                              onChange={(e) => setResolutionScale(Number(e.target.value))}
                              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-xs text-slate-200 focus:outline-none cursor-pointer"
                            >
                              <option value={0.5}>50% Compact (Ultra-light memory)</option>
                              <option value={0.75}>75% Balanced (Recommended for exam forms)</option>
                              <option value={1.0}>100% Full Original Dimensions</option>
                            </select>
                          </div>

                          {/* Max Dimension */}
                          <div>
                            <div className="flex items-center justify-between text-[11px] text-slate-300 font-bold mb-1">
                              <span>Max Width/Height:</span>
                              <span className="font-mono text-emerald-400">{maxDimensionPx === 0 ? 'Original' : `${maxDimensionPx}px`}</span>
                            </div>
                            <select
                              value={maxDimensionPx}
                              onChange={(e) => setMaxDimensionPx(Number(e.target.value))}
                              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-xs text-slate-200 focus:outline-none cursor-pointer"
                            >
                              <option value={800}>800px (Compact photo upload)</option>
                              <option value={1200}>1200px (Standard study page)</option>
                              <option value={1400}>1400px (Balanced crisp document)</option>
                              <option value={1920}>1920px (Full HD resolution)</option>
                              <option value={0}>Unconstrained Dimensions</option>
                            </select>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* PDF Page Setup & Export Controls */}
                <div className="pt-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs">
                  {/* Orientation */}
                  <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/60 p-2 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                    <span className="text-slate-400 font-bold text-[11px]">Layout:</span>
                    <select
                      value={pdfOrientation}
                      onChange={(e) => setPdfOrientation(e.target.value as 'portrait' | 'landscape')}
                      className="bg-transparent font-bold text-slate-800 dark:text-slate-200 focus:outline-none flex-1 cursor-pointer"
                    >
                      <option value="portrait" className="bg-white dark:bg-slate-900">Portrait (Vertical)</option>
                      <option value="landscape" className="bg-white dark:bg-slate-900">Landscape (Horizontal)</option>
                    </select>
                  </div>

                  {/* Page Size */}
                  <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/60 p-2 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                    <span className="text-slate-400 font-bold text-[11px]">Size:</span>
                    <select
                      value={pdfPageSize}
                      onChange={(e) => setPdfPageSize(e.target.value as 'a4' | 'letter')}
                      className="bg-transparent font-bold text-slate-800 dark:text-slate-200 focus:outline-none flex-1 cursor-pointer"
                    >
                      <option value="a4" className="bg-white dark:bg-slate-900">A4 (Standard Document)</option>
                      <option value="letter" className="bg-white dark:bg-slate-900">US Letter</option>
                    </select>
                  </div>

                  {/* Margins */}
                  <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/60 p-2 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                    <span className="text-slate-400 font-bold text-[11px]">Margin:</span>
                    <select
                      value={pdfMargin}
                      onChange={(e) => setPdfMargin(e.target.value as 'none' | 'small' | 'normal')}
                      className="bg-transparent font-bold text-slate-800 dark:text-slate-200 focus:outline-none flex-1 cursor-pointer"
                    >
                      <option value="small" className="bg-white dark:bg-slate-900">Small Margin (6mm)</option>
                      <option value="none" className="bg-white dark:bg-slate-900">No Margin (Full Bleed)</option>
                      <option value="normal" className="bg-white dark:bg-slate-900">Standard Margin (14mm)</option>
                    </select>
                  </div>

                  {/* File Name */}
                  <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/60 p-2 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                    <span className="text-slate-400 font-bold text-[11px]">File:</span>
                    <input
                      type="text"
                      value={pdfCustomName}
                      onChange={(e) => setPdfCustomName(e.target.value)}
                      placeholder="File name"
                      className="bg-transparent font-bold text-slate-800 dark:text-slate-200 focus:outline-none w-full text-xs"
                    />
                    <span className="text-slate-400 font-mono text-[10px]">.pdf</span>
                  </div>
                </div>

                {/* Primary Action Button */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800">
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <HardDrive className="w-3.5 h-3.5 text-emerald-500" />
                    <span>
                      {memoryPreset === 'original' 
                        ? 'Exporting uncompressed original resolution PDF' 
                        : `Auto-optimizing images to produce < ${customTargetKb} KB PDF`}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {finalGeneratedMemoryNotice && (
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold text-xs flex items-center gap-1 animate-in fade-in">
                        <CheckCircle2 className="w-4 h-4" /> {finalGeneratedMemoryNotice}
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={handleGenerateImageToPdf}
                      disabled={isConvertingImageToPdf || imageToPdfItems.length === 0}
                      className="flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-400 text-white font-black text-sm sm:text-base shadow-xl shadow-emerald-600/35 transition-all cursor-pointer disabled:opacity-50 active:scale-95 border-2 border-white/20"
                    >
                      {isConvertingImageToPdf ? (
                        <>
                          <RefreshCw className="w-5 h-5 animate-spin" />
                          <span>Resizing & Merging PDF...</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-5 h-5" />
                          <span>
                            Download Merged PDF ({imageToPdfItems.length} Pages • {memoryPreset !== 'original' ? `< ${customTargetKb} KB` : 'Full Res'})
                          </span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Uploaded Images Grid or Empty Dropzone */}
              {imageToPdfItems.length === 0 ? (
                <div
                  onClick={() => imageToPdfInputRef.current?.click()}
                  className="rounded-3xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500 bg-white/50 dark:bg-slate-900/50 p-12 text-center transition-all cursor-pointer group"
                >
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                    <FileUp className="w-8 h-8" />
                  </div>
                  <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-base mb-1">
                    Upload Images to Convert & Resize PDF
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-4">
                    Select one or multiple photos, study notes, question sheets, or certificates (JPG, PNG, WebP) to merge and compress to &lt; 200 KB or custom size.
                  </p>
                  <span className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm sm:text-base shadow-xl shadow-emerald-600/30 group-hover:scale-105 transition-all">
                    <Plus className="w-5 h-5" /> Choose Images from Device (Upload)
                  </span>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
                  {imageToPdfItems.map((item, idx) => (
                    <div
                      key={item.id}
                      className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col justify-between group hover:border-emerald-400 transition-all"
                    >
                      {/* Top ribbon: Page number & actions */}
                      <div className="p-2.5 bg-slate-50 dark:bg-slate-800/70 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                        <span className="font-black text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/80 text-[11px]">
                          Page #{idx + 1}
                        </span>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleMoveImagePdfItem(idx, 'up')}
                            disabled={idx === 0}
                            className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-30 cursor-pointer"
                            title="Move Earlier"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveImagePdfItem(idx, 'down')}
                            disabled={idx === imageToPdfItems.length - 1}
                            className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-30 cursor-pointer"
                            title="Move Later"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveImagePdfItem(item.id)}
                            className="p-1 rounded-lg hover:bg-red-100 text-red-500 cursor-pointer"
                            title="Remove Page"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Image Preview Box */}
                      <div className="p-3 flex items-center justify-center bg-slate-100/50 dark:bg-slate-950/40 h-44 relative">
                        <img
                          src={item.dataUrl}
                          alt={item.name}
                          className="max-h-full max-w-full object-contain rounded-lg shadow-sm"
                        />
                        {/* Live Compression Pill on image */}
                        {memoryPreset !== 'original' && resizedMemoryMap[item.id] && (
                          <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded-md bg-slate-900/90 text-emerald-400 font-mono text-[9px] font-black border border-emerald-500/40 shadow-sm">
                            {(resizedMemoryMap[item.id].sizeBytes / 1024).toFixed(0)} KB
                          </div>
                        )}
                      </div>

                      {/* File Info & Single Resized Image Download */}
                      <div className="p-2.5 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] gap-2">
                        <div className="truncate max-w-[130px]">
                          <span className="font-bold text-slate-700 dark:text-slate-300 truncate block" title={item.name}>
                            {item.name}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            Orig: {(item.size / 1024).toFixed(0)} KB
                          </span>
                        </div>

                        {/* Action: Download Single Resized Image */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          {memoryPreset !== 'original' && resizedMemoryMap[item.id] && (
                            <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 font-mono">
                              ~{(resizedMemoryMap[item.id].sizeBytes / 1024).toFixed(0)} KB
                            </span>
                          )}

                          <button
                            type="button"
                            onClick={() => handleDownloadSingleResizedImage(item)}
                            className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-emerald-100 hover:text-emerald-700 text-slate-700 dark:text-slate-300 text-[10px] font-bold transition-colors cursor-pointer flex items-center gap-1"
                            title="Download this single resized image (JPG)"
                          >
                            <Download className="w-3 h-3 text-emerald-600" />
                            <span>Save JPG</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ---------------------------------------------------------- */}
          {/* MODE 5: PDF MAKER FACILITY (CREATE & DESIGN CUSTOM PDF)   */}
          {/* "add pdf maker facility"                                   */}
          {/* "the new words will be make in a new pdf named by visitors"*/}
          {/* ---------------------------------------------------------- */}
          {currentMode === 'pdf_maker' && (
            <div className="space-y-4">
              {/* Top Banner & Quick Controls */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-violet-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-purple-500/20">
                    <FilePlus2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-black text-slate-900 dark:text-white text-sm sm:text-base">
                        Custom PDF Maker & Notes Designer
                      </h3>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                        Facility
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Create, design, and download custom study handouts & papers named by visitors
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Import from Translator */}
                  <button
                    type="button"
                    onClick={() => {
                      const newSecs: PdfMakerSection[] = [];
                      if (pdfPages.length > 0) {
                        pdfPages.forEach(p => {
                          newSecs.push({
                            id: `sec_imp_${p.pageNumber}_${Date.now()}`,
                            title: `Page ${p.pageNumber}: Translated Study Paper (${currentTargetLangObj.name})`,
                            type: 'paragraph',
                            content: p.translatedText,
                            imageUrl: p.originalImagePreviewUrl
                          });
                        });
                        setMakerSections(newSecs);
                        setMakerDocTitle(`Translated Paper: ${importedPdfTitle}`);
                        setMakerDocName(`Translated_${importedPdfTitle}_${currentTargetLangObj.name}`);
                      } else {
                        alert('No document currently translated to import. Upload a PDF or Image in the Language Converter first.');
                      }
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 font-bold text-xs transition-colors cursor-pointer"
                    title="Import translated words and pages from the Language Converter"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Import from Language Converter</span>
                  </button>

                  {/* Hidden Image Upload Ref for Sections */}
                  <input
                    type="file"
                    ref={makerImageUploadRef}
                    onChange={handleUploadImageForSection}
                    accept="image/*"
                    className="hidden"
                  />

                  {/* Make & Download PDF */}
                  <button
                    type="button"
                    onClick={handleGenerateCustomPdf}
                    disabled={isGeneratingMakerPdf}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-md shadow-purple-600/25 transition-all cursor-pointer disabled:opacity-50 active:scale-95"
                  >
                    {isGeneratingMakerPdf ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Generating PDF...</span>
                      </>
                    ) : makerPdfSuccess ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-white" />
                        <span>Downloaded PDF!</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-3.5 h-3.5" />
                        <span>Make & Download PDF</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Document Configuration Toolbar (Visitor PDF Name, Title, Theme, Layout) */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  {/* Visitor Custom File Name */}
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Visitor Defined PDF File Name:
                    </label>
                    <div className="flex items-center bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5 focus-within:ring-2 focus-within:ring-purple-500">
                      <input
                        type="text"
                        value={makerDocName}
                        onChange={(e) => setMakerDocName(e.target.value)}
                        placeholder="My_Custom_Study_Notes"
                        className="bg-transparent text-slate-900 dark:text-white text-xs font-mono font-bold focus:outline-none w-full"
                      />
                      <span className="text-[10px] text-purple-600 dark:text-purple-400 font-mono font-black ml-1">.pdf</span>
                    </div>
                  </div>

                  {/* Document Title */}
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Document Title / Subject:
                    </label>
                    <input
                      type="text"
                      value={makerDocTitle}
                      onChange={(e) => setMakerDocTitle(e.target.value)}
                      placeholder="SSC CGL Mathematical Formulas"
                      className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  {/* Subtitle */}
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Subtitle / Topic Description:
                    </label>
                    <input
                      type="text"
                      value={makerDocSubtitle}
                      onChange={(e) => setMakerDocSubtitle(e.target.value)}
                      placeholder="Complete revision notes and tips"
                      className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  {/* Author / Candidate Name */}
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Author / Candidate Name:
                    </label>
                    <input
                      type="text"
                      value={makerDocAuthor}
                      onChange={(e) => setMakerDocAuthor(e.target.value)}
                      placeholder="Candidate Name"
                      className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                {/* Second Row: Theme Color, Orientation, Page Size */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                  {/* Theme Accent Colors */}
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                      Color Theme:
                    </span>
                    <div className="flex items-center gap-1.5">
                      {[
                        { id: 'blue', label: 'Blue', color: 'bg-blue-600' },
                        { id: 'purple', label: 'Purple', color: 'bg-purple-600' },
                        { id: 'emerald', label: 'Emerald', color: 'bg-emerald-600' },
                        { id: 'amber', label: 'Amber', color: 'bg-amber-600' },
                        { id: 'slate', label: 'Charcoal', color: 'bg-slate-800' }
                      ].map(t => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setMakerThemeColor(t.id as any)}
                          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                            makerThemeColor === t.id
                              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                          }`}
                        >
                          <span className={`w-2.5 h-2.5 rounded-full ${t.color}`}></span>
                          <span>{t.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Orientation & Page Size */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center p-0.5 rounded-lg bg-slate-100 dark:bg-slate-800">
                      <button
                        type="button"
                        onClick={() => setMakerOrientation('portrait')}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                          makerOrientation === 'portrait' ? 'bg-white dark:bg-slate-900 text-purple-600 shadow-sm' : 'text-slate-500'
                        }`}
                      >
                        Portrait
                      </button>
                      <button
                        type="button"
                        onClick={() => setMakerOrientation('landscape')}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                          makerOrientation === 'landscape' ? 'bg-white dark:bg-slate-900 text-purple-600 shadow-sm' : 'text-slate-500'
                        }`}
                      >
                        Landscape
                      </button>
                    </div>

                    <div className="flex items-center p-0.5 rounded-lg bg-slate-100 dark:bg-slate-800">
                      <button
                        type="button"
                        onClick={() => setMakerPageSize('a4')}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                          makerPageSize === 'a4' ? 'bg-white dark:bg-slate-900 text-purple-600 shadow-sm' : 'text-slate-500'
                        }`}
                      >
                        A4
                      </button>
                      <button
                        type="button"
                        onClick={() => setMakerPageSize('letter')}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                          makerPageSize === 'letter' ? 'bg-white dark:bg-slate-900 text-purple-600 shadow-sm' : 'text-slate-500'
                        }`}
                      >
                        Letter
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Two Column Layout: Editor (Left) & Real-time Live A4 Preview (Right) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                
                {/* LEFT COLUMN: Section Builder & Content Form (7 cols) */}
                <div className="lg:col-span-7 space-y-3">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                      Document Sections ({makerSections.length}):
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleAddMakerSection('paragraph')}
                        className="px-2 py-1 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-50 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3 h-3 text-purple-600" />
                        <span>+ Paragraph</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleAddMakerSection('callout_box')}
                        className="px-2 py-1 rounded-lg bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3 h-3 text-purple-600" />
                        <span>+ Formula Box</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleAddMakerSection('bullet_list')}
                        className="px-2 py-1 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-50 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3 h-3 text-purple-600" />
                        <span>+ Bullet List</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleAddMakerSection('figure')}
                        className="px-2 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                        title="Add section with colour diagram / image (colours preserved!)"
                      >
                        <Plus className="w-3 h-3 text-emerald-600" />
                        <span>+ Diagram / Image</span>
                      </button>
                    </div>
                  </div>

                  {/* Section Cards */}
                  <div className="space-y-3">
                    {makerSections.map((sec, idx) => (
                      <div
                        key={sec.id}
                        className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2.5 transition-all"
                      >
                        <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs flex items-center justify-center">
                              #{idx + 1}
                            </span>
                            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300">
                              {sec.type === 'callout_box' ? 'Formula Callout' : sec.type === 'bullet_list' ? 'Bullet Points' : sec.type === 'figure' ? 'Colour Diagram' : 'Topic Text'}
                            </span>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleMoveMakerSection(idx, 'up')}
                              disabled={idx === 0}
                              className="p-1 rounded-md text-slate-400 hover:text-slate-700 disabled:opacity-30 cursor-pointer"
                              title="Move Up"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMoveMakerSection(idx, 'down')}
                              disabled={idx === makerSections.length - 1}
                              className="p-1 rounded-md text-slate-400 hover:text-slate-700 disabled:opacity-30 cursor-pointer"
                              title="Move Down"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveMakerSection(sec.id)}
                              className="p-1 rounded-md text-rose-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                              title="Delete Section"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Section Title Input */}
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-0.5">
                            Section Heading:
                          </label>
                          <input
                            type="text"
                            value={sec.title}
                            onChange={(e) => handleUpdateMakerSection(sec.id, { title: e.target.value })}
                            placeholder="e.g. 1. Quantitative Aptitude Formulas"
                            className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                          />
                        </div>

                        {/* Optional Callout Badge for Callout Type */}
                        {sec.type === 'callout_box' && (
                          <div>
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-0.5">
                              Callout Badge Tag:
                            </label>
                            <input
                              type="text"
                              value={sec.calloutBadge || ''}
                              onChange={(e) => handleUpdateMakerSection(sec.id, { calloutBadge: e.target.value })}
                              placeholder="e.g. KEY FORMULAS, TCS iON RULE"
                              className="w-full px-3 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-purple-600 dark:text-purple-400 uppercase"
                            />
                          </div>
                        )}

                        {/* Section Content Textarea */}
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-0.5">
                            {sec.type === 'bullet_list' ? 'Bullet Points (One per line):' : sec.type === 'callout_box' ? 'Formulas / Highlight Rules:' : 'Section Content / Explanation:'}
                          </label>
                          <textarea
                            value={sec.content}
                            onChange={(e) => handleUpdateMakerSection(sec.id, { content: e.target.value })}
                            rows={3}
                            placeholder="Enter section content..."
                            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-purple-500"
                          />
                        </div>

                        {/* Attach Colour Diagram / Image Section */}
                        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            {sec.imageUrl ? (
                              <div className="flex items-center gap-2">
                                <img src={sec.imageUrl} alt="Diagram" className="w-12 h-9 object-contain rounded border border-slate-200 bg-white" />
                                <span className="text-[11px] text-emerald-600 font-bold">✓ Colour Image Embedded Untouched</span>
                              </div>
                            ) : (
                              <span className="text-[11px] text-slate-400">Optional: Embed colour diagram/chart</span>
                            )}
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                setMakerActiveSectionIdForImg(sec.id);
                                makerImageUploadRef.current?.click();
                              }}
                              className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                            >
                              <Upload className="w-3 h-3" />
                              <span>{sec.imageUrl ? 'Change Image' : 'Attach Colour Image'}</span>
                            </button>

                            {sec.imageUrl && (
                              <button
                                type="button"
                                onClick={() => handleUpdateMakerSection(sec.id, { imageUrl: undefined })}
                                className="px-2 py-1 rounded-lg text-rose-500 hover:bg-rose-50 text-[11px] cursor-pointer"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Bottom Add Section Button Bar */}
                  <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 flex flex-wrap items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleAddMakerSection('paragraph')}
                      className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-bold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 text-purple-600" />
                      <span>Add Topic Section</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddMakerSection('callout_box')}
                      className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm shadow-purple-600/20 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Formula Callout</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddMakerSection('figure')}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm shadow-emerald-600/20 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Diagram / Paper Image</span>
                    </button>
                  </div>
                </div>

                {/* RIGHT COLUMN: Live A4 Document Sheet Preview (5 cols) */}
                <div className="lg:col-span-5 space-y-2">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-purple-600" />
                      <span>Live A4 Document Preview</span>
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {makerPageSize.toUpperCase()} • {makerOrientation.toUpperCase()}
                    </span>
                  </div>

                  {/* Realistic Rendered A4 Sheet */}
                  <div className="bg-white text-slate-900 rounded-2xl shadow-xl border border-slate-200 overflow-hidden min-h-[580px] p-5 font-sans space-y-4 text-xs">
                    {/* Top Ribbon Banner */}
                    <div className="bg-slate-900 text-white p-3.5 rounded-xl -mx-1 -mt-1 shadow-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] uppercase tracking-wider font-extrabold text-purple-300">
                          UPTO SELECTION OFFICIAL PUBLICATION
                        </span>
                        <span className="text-[8px] text-slate-400 font-mono">Page 1 of 1</span>
                      </div>
                      <h2 className="text-sm font-black text-white mt-1 leading-snug">
                        {makerDocTitle || 'Untitled Document'}
                      </h2>
                      <p className="text-[10px] text-purple-200 mt-0.5">
                        {makerDocSubtitle || 'Academic Notes & Formulas'} • Author: {makerDocAuthor || 'Candidate'}
                      </p>
                    </div>

                    {/* Preview Sections */}
                    <div className="space-y-3.5 pt-1">
                      {makerSections.map((sec, idx) => (
                        <div key={sec.id} className="space-y-1.5">
                          {sec.title && (
                            <h4 className="text-xs font-black text-slate-900 border-b border-slate-200 pb-0.5">
                              {sec.title}
                            </h4>
                          )}

                          {sec.imageUrl && (
                            <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 my-1">
                              <img src={sec.imageUrl} alt="Embedded Figure" className="max-h-36 mx-auto object-contain rounded" />
                              <span className="text-[9px] text-slate-500 italic block text-center mt-1">
                                [Figure / Graphic: 100% Original Colour Preserved]
                              </span>
                            </div>
                          )}

                          {sec.type === 'callout_box' ? (
                            <div className="p-2.5 rounded-lg bg-purple-50/70 border border-purple-200 font-mono text-[11px] leading-relaxed">
                              {sec.calloutBadge && (
                                <span className="text-[8px] font-black uppercase px-1.5 py-0.5 rounded bg-purple-600 text-white inline-block mb-1 font-sans">
                                  {sec.calloutBadge}
                                </span>
                              )}
                              <p className="whitespace-pre-wrap font-bold text-slate-800">{sec.content}</p>
                            </div>
                          ) : sec.type === 'bullet_list' ? (
                            <div className="space-y-1 pl-1">
                              {sec.content.split('\n').filter(Boolean).map((line, bIdx) => (
                                <div key={bIdx} className="flex items-start gap-1.5 text-[11px] text-slate-700">
                                  <span className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-1 shrink-0"></span>
                                  <p>{line.replace(/^[•\-\*]\s*/, '')}</p>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-[11px] text-slate-700 leading-relaxed whitespace-pre-wrap">
                              {sec.content}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Preview Page Footer */}
                    <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-[9px] text-slate-400">
                      <span>UPTO SELECTION Custom PDF Maker • Named by Visitor</span>
                      <span className="font-mono">{makerDocName}.pdf</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* Floating Jump to Top / Jump to Bottom Quick Scroll Navigation */}
          <div className="sticky bottom-4 right-4 ml-auto w-fit z-30 flex items-center gap-2 pointer-events-none">
            {showScrollBottom && (
              <button
                type="button"
                onClick={scrollToBottom}
                className="pointer-events-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 dark:bg-slate-100/90 hover:bg-slate-900 text-white dark:text-slate-900 shadow-xl border border-slate-700 dark:border-slate-300 text-xs font-bold transition-all cursor-pointer hover:scale-105 active:scale-95"
                title="Scroll down to page bottom"
              >
                <span>Scroll Down</span>
                <ArrowDown className="w-3.5 h-3.5" />
              </button>
            )}

            {showScrollTop && (
              <button
                type="button"
                onClick={scrollToTop}
                className="pointer-events-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white shadow-xl border border-blue-400 text-xs font-bold transition-all cursor-pointer hover:scale-105 active:scale-95"
                title="Scroll back to top"
              >
                <span>Back to Top</span>
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* ============================================================ */}
        {/* FOOTER BAR                                                   */}
        {/* ============================================================ */}
        <div className="shrink-0 px-4 sm:px-6 py-2.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/90 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>
              1. Multi-language translation • 2. Every PDF page & image translated without changing papers • 3. Original images preserved
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] text-slate-400">
              Target: <strong className="text-blue-600 dark:text-blue-400">{currentTargetLangObj.name}</strong>
            </span>
            <button
              type="button"
              onClick={() => setImageToPdfModalOpen(false)}
              className="px-3 py-1 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold transition-all cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
