import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { EBook } from '../types';
import { jsPDF } from 'jspdf';
import { 
  BookOpen, 
  Sparkles, 
  Search, 
  Eye, 
  Lock, 
  ShieldCheck,
  Smartphone,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  FileText
} from 'lucide-react';

export const EBooksLibrary: React.FC = () => {
  const { ebooks } = useApp();
  const [selectedCat, setSelectedCat] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [readingEbook, setReadingEbook] = useState<EBook | null>(null);
  const [ebookPdfUrl, setEbookPdfUrl] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);

  const filteredEbooks = ebooks.filter(b => {
    const matchesCat = selectedCat === 'ALL' || b.category === selectedCat;
    const matchesQuery = b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  // Generate on-the-fly original PDF data URL if not present
  useEffect(() => {
    if (!readingEbook) {
      setEbookPdfUrl(null);
      return;
    }

    if (readingEbook.pdfDataUrl) {
      setEbookPdfUrl(readingEbook.pdfDataUrl);
      return;
    }

    try {
      const doc = new jsPDF({ unit: 'mm', format: 'a4' });
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      // Top Header
      doc.setFillColor(15, 23, 42); // slate-900
      doc.rect(0, 0, pageWidth, 24, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(13);
      doc.setFont('helvetica', 'bold');
      doc.text('UPTO SELECTION • OFFICIAL E-BOOK CAPSULE', 14, 12);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(180, 210, 255);
      doc.text(`Category: ${readingEbook.category} | Subject: ${readingEbook.subject} | ${readingEbook.pages} Pages`, 14, 18);

      // Book Title
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      const splitTitle = doc.splitTextToSize(readingEbook.title, pageWidth - 28);
      doc.text(splitTitle, 14, 36);

      // Chapters Box
      let curY = 38 + (splitTitle.length * 6);
      doc.setFillColor(241, 245, 249);
      doc.roundedRect(14, curY, pageWidth - 28, 22, 2, 2, 'F');
      doc.setTextColor(30, 41, 59);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text('Included Syllabus Chapters & Formulations:', 18, curY + 6);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(71, 85, 105);
      const chText = readingEbook.chapters.join('  •  ');
      const splitCh = doc.splitTextToSize(chText, pageWidth - 36);
      doc.text(splitCh, 18, curY + 12);

      // Content summary body
      curY += 28;
      doc.setTextColor(30, 41, 59);
      doc.setFontSize(9.5);
      doc.setFont('helvetica', 'normal');
      const splitContent = doc.splitTextToSize(readingEbook.contentSummary, pageWidth - 28);

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

      // Final footer
      doc.setFontSize(7.5);
      doc.setTextColor(148, 163, 184);
      doc.text('UPTO SELECTION In-App Study Notes • Licensed Student Copy (Protected)', pageWidth / 2, pageHeight - 8, { align: 'center' });

      const blob = doc.output('blob');
      const url = URL.createObjectURL(blob);
      setEbookPdfUrl(url);

      return () => {
        URL.revokeObjectURL(url);
      };
    } catch (e) {
      console.warn('Ebook PDF generation error:', e);
    }
  }, [readingEbook]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      
      {/* Banner in Blue Theme */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-wrap items-center justify-between gap-6 border border-blue-500/30">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-300" /> Free E-Books & Capsules
            </span>
            <span className="text-xs text-blue-200">Read-Only In-App Access</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Curated Study Material & E-Books
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 mt-2">
            Read complete topic capsules, static GK books, and speed calculation shortcuts right in the website. Original PDF files are viewable directly without needing to open external apps or tabs.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-center min-w-[180px]">
          <span className="text-2xl font-black text-white block">
            {ebooks.length} Books
          </span>
          <span className="text-xs text-blue-200 font-semibold">Available to Read</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {['ALL', 'SSC', 'Railways', 'Banking', 'State PSC'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedCat === cat
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search e-books & capsules..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-white"
          />
        </div>
      </div>

      {/* E-Books Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEbooks.map((book) => (
          <div
            key={book.id}
            className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4 hover:border-blue-500/50 transition-all group"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-500/20">
                  {book.category} • {book.subject}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {book.pages} pages
                </span>
              </div>

              <h3 className="font-bold text-base text-slate-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {book.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                {book.description}
              </p>

              {/* Chapter Previews */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1">
                <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">
                  Included Chapters:
                </span>
                {book.chapters.slice(0, 3).map((ch, idx) => (
                  <div key={idx} className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1.5 truncate">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                    <span className="truncate">{ch}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <button
                onClick={() => setReadingEbook(book)}
                className="w-full py-2.5 px-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-blue-600/20 cursor-pointer transition-all active:scale-95"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Read Original PDF in Website</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Reader Modal (In-Website Original PDF Viewer) */}
      {readingEbook && (
        <div className={`fixed inset-0 z-50 overflow-y-auto bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-150 ${
          isFullscreen ? 'p-0' : ''
        }`}>
          <div className={`relative w-full ${
            isFullscreen ? 'max-w-none h-screen rounded-none' : 'max-w-5xl rounded-3xl max-h-[94vh]'
          } bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden`}>
            
            {/* Header */}
            <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between border-b border-slate-800 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base line-clamp-1">{readingEbook.title}</h3>
                  <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Original PDF In-Website Reader • {readingEbook.category}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Zoom Controls */}
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

                {/* Fullscreen Toggle */}
                <button
                  onClick={() => setIsFullscreen(prev => !prev)}
                  className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
                  title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                >
                  {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>

                <button
                  onClick={() => setReadingEbook(null)}
                  className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* In-App PDF Container */}
            <div className="p-2 sm:p-4 overflow-y-auto flex-1 bg-slate-100 dark:bg-slate-950 flex flex-col items-center">
              <div 
                className="w-full h-full min-h-[70vh] bg-white rounded-2xl overflow-hidden shadow-inner border border-slate-300 dark:border-slate-800 flex flex-col"
                style={{ transform: zoomLevel !== 100 ? `scale(${zoomLevel / 100})` : undefined, transformOrigin: 'top center' }}
              >
                {ebookPdfUrl ? (
                  <iframe
                    src={`${ebookPdfUrl}#toolbar=0&navpanes=0&scrollbar=1`}
                    title={readingEbook.title}
                    className="w-full h-full min-h-[70vh] border-0"
                  />
                ) : (
                  <div className="p-12 text-center text-slate-500 my-auto">
                    <FileText className="w-10 h-10 mx-auto text-blue-500 mb-2 animate-pulse" />
                    <p className="font-bold">Preparing Original E-Book PDF for In-Website Reading...</p>
                  </div>
                )}
              </div>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 shrink-0">
              <span className="flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-blue-500" />
                <span>Reading within UPTO SELECTION • Original PDF View</span>
              </span>
              <button
                onClick={() => setReadingEbook(null)}
                className="px-4 py-1.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold text-xs cursor-pointer"
              >
                Close Reader
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
