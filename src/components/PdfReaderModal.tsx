import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { jsPDF } from 'jspdf';
import { 
  X, 
  BookOpen, 
  ArrowRight, 
  Clock, 
  Sparkles,
  Layers,
  Lock,
  Eye,
  ShieldCheck,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  FileText
} from 'lucide-react';

export const PdfReaderModal: React.FC = () => {
  const { 
    activeReadingPdf, 
    closePdfReader, 
    mockTests, 
    startFullMockTest, 
    startCustomSegmentTest,
    currentUser
  } = useApp();

  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [viewMode, setViewMode] = useState<'original_pdf' | 'text_reader'>('original_pdf');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [generatedOriginalPdfUrl, setGeneratedOriginalPdfUrl] = useState<string | null>(null);

  const currentMock = mockTests.find(m => m.id === activeReadingPdf?.testId);

  // Generate on-the-fly original PDF data URL if not uploaded directly
  useEffect(() => {
    if (!activeReadingPdf) return;

    if (activeReadingPdf.pdf.pdfDataUrl) {
      setGeneratedOriginalPdfUrl(activeReadingPdf.pdf.pdfDataUrl);
      return;
    }

    try {
      const doc = new jsPDF({ unit: 'mm', format: 'a4' });
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      
      // Top Brand Header Banner
      doc.setFillColor(15, 23, 42); // slate-900
      doc.rect(0, 0, pageWidth, 24, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(13);
      doc.setFont('helvetica', 'bold');
      doc.text('UPTO SELECTION • OFFICIAL STUDY LESSON GUIDE', 14, 12);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(180, 210, 255);
      doc.text(`Target Exam: ${activeReadingPdf.examName} | 100% Real Pattern Study Note`, 14, 18);

      // Title
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(15);
      doc.setFont('helvetica', 'bold');
      const splitTitle = doc.splitTextToSize(activeReadingPdf.pdf.title, pageWidth - 28);
      doc.text(splitTitle, 14, 35);

      // Summary Box
      let curY = 37 + (splitTitle.length * 6);
      doc.setFillColor(241, 245, 249);
      doc.roundedRect(14, curY, pageWidth - 28, 18, 2, 2, 'F');
      doc.setTextColor(51, 65, 85);
      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'italic');
      const splitSummary = doc.splitTextToSize(activeReadingPdf.pdf.summary, pageWidth - 34);
      doc.text(splitSummary, 18, curY + 6);

      // Content Body
      curY += 26;
      doc.setTextColor(30, 41, 59);
      doc.setFontSize(9.5);
      doc.setFont('helvetica', 'normal');
      const splitContent = doc.splitTextToSize(activeReadingPdf.pdf.contentMarkdown, pageWidth - 28);

      for (let i = 0; i < splitContent.length; i++) {
        if (curY > pageHeight - 20) {
          doc.setFontSize(7.5);
          doc.setTextColor(148, 163, 184);
          doc.text('UPTO SELECTION In-App Study Notes • Licensed Student Copy (Protected)', pageWidth / 2, pageHeight - 8, { align: 'center' });
          
          doc.addPage();
          curY = 20;
          doc.setFontSize(9.5);
          doc.setTextColor(30, 41, 59);
        }
        doc.text(splitContent[i], 14, curY);
        curY += 5.2;
      }

      // Page footer stamp
      doc.setFontSize(7.5);
      doc.setTextColor(148, 163, 184);
      doc.text('UPTO SELECTION In-App Study Notes • Licensed Student Copy (Protected)', pageWidth / 2, pageHeight - 8, { align: 'center' });

      const blob = doc.output('blob');
      const url = URL.createObjectURL(blob);
      setGeneratedOriginalPdfUrl(url);

      return () => {
        URL.revokeObjectURL(url);
      };
    } catch (e) {
      console.warn('PDF generation notice:', e);
    }
  }, [activeReadingPdf]);

  if (!activeReadingPdf) return null;

  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'large': return 'text-base leading-relaxed';
      case 'xlarge': return 'text-lg leading-loose';
      default: return 'text-sm leading-relaxed';
    }
  };

  return (
    <div className={`fixed inset-0 z-50 overflow-y-auto bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200 ${
      isFullscreen ? 'p-0' : ''
    }`}>
      <div 
        className={`relative w-full ${
          isFullscreen ? 'max-w-none h-screen rounded-none' : 'max-w-5xl rounded-3xl max-h-[95vh]'
        } bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold text-[10px] uppercase tracking-wider">
                  Original Lesson PDF
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {activeReadingPdf.pdf.readTimeMinutes} min read
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold flex items-center gap-1 border border-emerald-500/30">
                  <Lock className="w-3 h-3" /> In-Website Viewer (No External Tabs Required)
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-bold text-white tracking-tight line-clamp-1 mt-0.5">
                {activeReadingPdf.pdf.title}
              </h2>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-2">
            {/* Zoom Controls */}
            {viewMode === 'original_pdf' && (
              <div className="hidden sm:flex items-center bg-slate-800 rounded-lg p-0.5 text-xs text-slate-300">
                <button
                  onClick={() => setZoomLevel(prev => Math.max(70, prev - 10))}
                  className="p-1 hover:text-white cursor-pointer"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="px-1.5 font-mono text-[10px] font-bold">{zoomLevel}%</span>
                <button
                  onClick={() => setZoomLevel(prev => Math.min(150, prev + 10))}
                  className="p-1 hover:text-white cursor-pointer"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setZoomLevel(100)}
                  className="p-1 hover:text-white cursor-pointer ml-0.5"
                  title="Reset Zoom"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>
              </div>
            )}

            {/* Toggle View Mode */}
            <div className="flex items-center bg-slate-800 rounded-lg p-0.5 text-xs">
              <button
                onClick={() => setViewMode('original_pdf')}
                className={`px-2.5 py-1 rounded font-semibold cursor-pointer ${viewMode === 'original_pdf' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                Original PDF
              </button>
              <button
                onClick={() => setViewMode('text_reader')}
                className={`px-2.5 py-1 rounded font-semibold cursor-pointer ${viewMode === 'text_reader' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                Clean Reader
              </button>
            </div>

            {/* Fullscreen Toggle */}
            <button
              onClick={() => setIsFullscreen(prev => !prev)}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Close */}
            <button
              onClick={closePdfReader}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Read First Notice */}
        <div className="bg-emerald-500/10 border-b border-emerald-500/20 px-5 py-2 flex items-center justify-between text-xs text-emerald-950 dark:text-emerald-200">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>
              <strong>Read In-Website:</strong> You are viewing the original PDF file directly in the website. No need to open separate tabs or external apps!
            </span>
          </div>
          <span className="text-[11px] font-mono opacity-80 hidden md:inline">
            Pages: {activeReadingPdf.pdf.pagesCount || 1} • In-App Secured
          </span>
        </div>

        {/* PDF Reader Content Body */}
        <div className="p-2 sm:p-4 overflow-y-auto flex-1 bg-slate-100 dark:bg-slate-950/80 font-sans relative flex flex-col items-center">
          
          {/* Watermark overlay */}
          <div className="absolute top-4 right-6 opacity-30 select-none pointer-events-none text-right font-mono text-[10px] text-slate-500 z-20">
            UPTO SELECTION PROTECTED STUDY NOTE<br />
            Licensed to: {currentUser.email}
          </div>

          {/* Original PDF Embedded Viewer Mode - 100% In-Website */}
          {viewMode === 'original_pdf' ? (
            <div 
              className="w-full h-full min-h-[68vh] bg-white rounded-2xl overflow-hidden shadow-inner border border-slate-300 dark:border-slate-800 flex flex-col"
              style={{ transform: zoomLevel !== 100 ? `scale(${zoomLevel / 100})` : undefined, transformOrigin: 'top center' }}
            >
              {generatedOriginalPdfUrl ? (
                <iframe
                  src={`${generatedOriginalPdfUrl}#toolbar=0&navpanes=0&scrollbar=1`}
                  title={activeReadingPdf.pdf.title}
                  className="w-full h-full min-h-[68vh] border-0"
                />
              ) : (
                <div className="p-12 text-center text-slate-500">
                  <FileText className="w-10 h-10 mx-auto text-blue-500 mb-2 animate-pulse" />
                  <p className="font-bold">Loading Original PDF Document...</p>
                </div>
              )}
            </div>
          ) : (
            /* Clean Text & Formula Reader Mode */
            <div className="w-full max-w-3xl bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-700 relative z-10 my-auto">
              <div className="border-b border-slate-200 dark:border-slate-700 pb-4 mb-5">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs uppercase tracking-wider font-extrabold text-blue-600 dark:text-blue-400">
                    Target Exam: {activeReadingPdf.examName}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" /> High-Resolution Clean View
                  </span>
                </div>
                
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                  {activeReadingPdf.pdf.title}
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 italic">
                  {activeReadingPdf.pdf.summary}
                </p>
              </div>

              {/* Document Markdown content */}
              <div className={`prose dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 ${getFontSizeClass()} whitespace-pre-wrap font-sans select-none leading-relaxed`}>
                {activeReadingPdf.pdf.contentMarkdown}
              </div>

              {/* Bottom completion note */}
              <div className="mt-8 pt-5 border-t border-slate-200 dark:border-slate-700 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 text-xs font-semibold">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <span>Lesson reviewed! You are ready to start the practice mock test.</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Action Footer */}
        <div className="p-3.5 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-500">
            Mock Test: <strong className="text-slate-700 dark:text-slate-300">{activeReadingPdf.testTitle}</strong>
          </div>

          <div className="flex items-center gap-2">
            {currentMock && (
              <>
                <button
                  onClick={() => {
                    closePdfReader();
                    startCustomSegmentTest(currentMock, 10, 0);
                  }}
                  className="px-3.5 py-2 rounded-xl border border-blue-500/40 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Layers className="w-4 h-4" />
                  <span>Practice 10-100 Qs</span>
                </button>

                <button
                  onClick={() => {
                    closePdfReader();
                    startFullMockTest(currentMock);
                  }}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-600/25 flex items-center gap-2 transition-all cursor-pointer active:scale-95"
                >
                  <span>Start Test Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
