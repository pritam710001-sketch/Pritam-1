import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MockTest } from '../types';
import { INDIAN_LANGUAGES, LanguageCode } from '../utils/languageData';
import { 
  X, 
  Layers, 
  Clock, 
  HelpCircle, 
  CheckCircle2, 
  Play, 
  Sliders, 
  Sparkles,
  BookOpen,
  Globe,
  Check,
  ShieldCheck,
  FileText,
  Zap,
  Target
} from 'lucide-react';

interface SegmentModalProps {
  test: MockTest | null;
  isOpen: boolean;
  onClose: () => void;
}

export const SegmentModal: React.FC<SegmentModalProps> = ({ test, isOpen, onClose }) => {
  const { 
    startCustomSegmentTest, 
    startFullMockTest,
    openPdfReader,
    language: globalLang,
    setLanguage: setGlobalLang
  } = useApp();

  // Selected Language: Defaults to global language or Hindi/English
  const [selectedLang, setSelectedLang] = useState<LanguageCode>(globalLang || 'hi');
  
  // Question Count Split: Min 10 to Max 100 (Default 25)
  const [splitCount, setSplitCount] = useState<number>(25);
  const [mode, setMode] = useState<'split' | 'full'>('split');
  const [selectedChunkIndex, setSelectedChunkIndex] = useState<number>(0);

  if (!isOpen || !test) return null;

  const totalQuestions = Math.max(test.questions.length, 100);
  const actualCount = mode === 'full' ? test.totalQuestions : splitCount;

  // Calculate chunks based on splitCount
  const totalChunks = Math.max(1, Math.ceil(totalQuestions / splitCount));
  const currentStartIndex = selectedChunkIndex * splitCount;
  const currentEndIndex = currentStartIndex + splitCount;

  // Calculated duration proportional to question count
  const estimatedMinutes = mode === 'full' 
    ? test.durationMinutes 
    : Math.max(10, Math.round((test.durationMinutes / test.totalQuestions) * splitCount));

  const handleLaunchTest = () => {
    // Set chosen language in AppContext so MockTestPlayer loads in this language
    setGlobalLang(selectedLang);

    if (mode === 'full') {
      startFullMockTest(test);
    } else {
      startCustomSegmentTest(test, splitCount, currentStartIndex);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div 
        className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-3"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 px-5 py-3.5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/20 rounded-xl">
              <Zap className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base tracking-tight">
                Pre-Test Setup & Simulator Options
              </h3>
              <p className="text-[11px] text-blue-100">
                Choose Language & Split Questions (Min 10 to Max 100 Qs)
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-5 space-y-4 max-h-[85vh] overflow-y-auto">
          {/* Target Mock Summary Card */}
          <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-black text-xs">
                CBT
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  {test.examName} • {test.type.replace('_', ' ')}
                </span>
                <h4 className="font-bold text-xs sm:text-sm text-slate-800 dark:text-white line-clamp-1">
                  {test.title}
                </h4>
              </div>
            </div>
            <button
              onClick={() => {
                onClose();
                openPdfReader(test);
              }}
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 shrink-0 ml-2 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded-lg border border-blue-200 dark:border-blue-900 cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-blue-500" />
              <span>Read PDF First</span>
            </button>
          </div>

          {/* 1. Indian 10 Languages Selection */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>1. Choose Test Language (10 Indian Languages):</span>
              </label>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                Active: {INDIAN_LANGUAGES.find(l => l.code === selectedLang)?.nativeName}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
              {INDIAN_LANGUAGES.map((lang) => {
                const isSelected = selectedLang === lang.code;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => setSelectedLang(lang.code)}
                    className={`p-2 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 ring-2 ring-blue-500/20 shadow-sm'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-blue-400'
                    }`}
                  >
                    <span className="text-xs font-black">{lang.nativeName}</span>
                    <span className="text-[9px] text-slate-400 font-semibold">{lang.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Question Splitting (Min 10 to Max 100 Questions) */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>2. Split Questions (Min 10 to Max 100 Questions):</span>
              </label>
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-[10px]">
                <button
                  type="button"
                  onClick={() => setMode('split')}
                  className={`px-2 py-0.5 rounded font-bold cursor-pointer transition-colors ${
                    mode === 'split' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500'
                  }`}
                >
                  Custom Split
                </button>
                <button
                  type="button"
                  onClick={() => setMode('full')}
                  className={`px-2 py-0.5 rounded font-bold cursor-pointer transition-colors ${
                    mode === 'full' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500'
                  }`}
                >
                  Full Exam
                </button>
              </div>
            </div>

            {mode === 'split' ? (
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
                {/* Preset Chips */}
                <div className="flex flex-wrap items-center gap-1.5">
                  {[10, 20, 25, 30, 50, 75, 100].map((size) => {
                    const isSelected = splitCount === size;
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => {
                          setSplitCount(size);
                          setSelectedChunkIndex(0);
                        }}
                        className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all cursor-pointer border ${
                          isSelected
                            ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-600/20'
                            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-blue-400'
                        }`}
                      >
                        {size} Qs
                      </button>
                    );
                  })}
                </div>

                {/* Slider from 10 to 100 */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-500">Fine Tune Count:</span>
                    <span className="text-blue-600 dark:text-blue-400 font-black text-sm">
                      {splitCount} Questions Selected
                    </span>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={100}
                    step={5}
                    value={splitCount}
                    onChange={(e) => {
                      setSplitCount(Number(e.target.value));
                      setSelectedChunkIndex(0);
                    }}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>Min: 10 Qs</span>
                    <span>25 Qs</span>
                    <span>50 Qs</span>
                    <span>75 Qs</span>
                    <span>Max: 100 Qs</span>
                  </div>
                </div>

                {/* Question Range Selection */}
                {totalChunks > 1 && (
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-700 space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-500 block uppercase">
                      Select Question Range / Set:
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                      {Array.from({ length: Math.min(totalChunks, 8) }).map((_, idx) => {
                        const sIdx = idx * splitCount + 1;
                        const eIdx = (idx + 1) * splitCount;
                        const isSelected = selectedChunkIndex === idx;
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setSelectedChunkIndex(idx)}
                            className={`p-1.5 rounded-lg border text-center text-xs transition-all cursor-pointer ${
                              isSelected
                                ? 'border-blue-600 bg-blue-50 dark:bg-blue-950 font-bold text-blue-600 dark:text-blue-300'
                                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                            }`}
                          >
                            <span className="block text-[9px] text-slate-400 uppercase">Set {idx + 1}</span>
                            <span className="font-mono text-[11px]">Q{sIdx} - Q{eIdx}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-3.5 bg-blue-50/50 dark:bg-blue-950/30 rounded-2xl border border-blue-200 dark:border-blue-900/60 text-xs text-blue-900 dark:text-blue-200 flex items-center justify-between">
                <span>Full Length Paper: <strong>{test.totalQuestions} Questions</strong> ({test.durationMinutes} Minutes)</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">100% Real Pattern</span>
              </div>
            )}
          </div>

          {/* Session Summary Bar */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Questions</span>
                <span className="font-black text-slate-800 dark:text-white text-sm">{actualCount} Qs</span>
              </div>
              <div className="h-6 w-px bg-slate-200 dark:bg-slate-700" />
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Time Allowed</span>
                <span className="font-black text-slate-800 dark:text-white text-sm">{estimatedMinutes} Mins</span>
              </div>
              <div className="h-6 w-px bg-slate-200 dark:bg-slate-700" />
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Negative Marking</span>
                <span className="font-bold text-rose-600 dark:text-rose-400 text-xs">-0.50 Marks</span>
              </div>
            </div>

            <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400">
              TCS iON CBT
            </span>
          </div>

          {/* Launch Button */}
          <button
            type="button"
            onClick={handleLaunchTest}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-black text-sm sm:text-base shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>
              Launch Test in {INDIAN_LANGUAGES.find(l => l.code === selectedLang)?.nativeName} ({actualCount} Questions)
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
