import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { MockTest, Question, ExamAttempt } from '../types';
import { INDIAN_LANGUAGES, LanguageCode, getLocalizedQuestion } from '../utils/languageData';
import { 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  HelpCircle, 
  BookOpen, 
  Flag, 
  Check, 
  RotateCcw, 
  Maximize2, 
  Minimize2, 
  FileText, 
  X, 
  Info,
  Monitor,
  Globe,
  Sun,
  Moon,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Target
} from 'lucide-react';

interface MockTestPlayerProps {
  test: MockTest;
  segmentConfig?: {
    enabled: boolean;
    segmentSize: number;
    startIndex: number;
    endIndex: number;
  } | null;
}

export const MockTestPlayer: React.FC<MockTestPlayerProps> = ({ test, segmentConfig }) => {
  const { 
    currentUser, 
    recordAttempt, 
    setCurrentView, 
    openPdfReader, 
    toggleBookmarkQuestion, 
    bookmarkedQuestions,
    language: globalLanguage,
    setLanguage: setGlobalLanguage,
    fontSize,
    setFontSize,
    highContrast,
    setHighContrast,
    t
  } = useApp();

  // Questions active in this session (full or custom segment 10 to 100 Qs)
  const activeQuestions: Question[] = React.useMemo(() => {
    if (!segmentConfig?.enabled) return test.questions;
    const requestedCount = segmentConfig.segmentSize;
    if (test.questions.length >= requestedCount) {
      const sliced = test.questions.slice(segmentConfig.startIndex, Math.min(segmentConfig.endIndex, test.questions.length));
      return sliced.length > 0 ? sliced : test.questions.slice(0, requestedCount);
    }
    // Expand questions up to requested count (10 to 100 questions)
    const result: Question[] = [...test.questions];
    let counter = test.questions.length + 1;
    while (result.length < requestedCount && counter <= 100) {
      const baseQ = test.questions[(result.length) % test.questions.length];
      result.push({
        ...baseQ,
        id: `${test.id}-gen-q-${counter}`,
        questionNumber: counter,
        questionText: `[Q${counter}] ${baseQ.questionText}`,
        questionTextHindi: baseQ.questionTextHindi ? `[प्र.${counter}] ${baseQ.questionTextHindi}` : undefined,
      });
      counter++;
    }
    return result;
  }, [test, segmentConfig]);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  
  // Show / Hide Question Numbers palette (1 2 3 4...) option
  const [showQuestionPalette, setShowQuestionPalette] = useState<boolean>(true);

  // Local test language inherits global language (supports 10 Indian languages)
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>(globalLanguage || 'en');
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  // Sync with global changes if updated elsewhere
  useEffect(() => {
    if (globalLanguage) {
      setSelectedLanguage(globalLanguage);
    }
  }, [globalLanguage]);

  const handleLanguageChange = (code: LanguageCode) => {
    setSelectedLanguage(code);
    setGlobalLanguage(code);
    setLangDropdownOpen(false);
  };

  // Answers state: questionId -> selectedOptionIndex (0-3 or -1)
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});

  // TCS iON Question statuses: 'not_visited' | 'not_answered' | 'answered' | 'marked_for_review' | 'answered_and_marked'
  const [questionStatuses, setQuestionStatuses] = useState<Record<string, 'not_visited' | 'not_answered' | 'answered' | 'marked_for_review' | 'answered_and_marked'>>(() => {
    const init: Record<string, any> = {};
    activeQuestions.forEach((q, idx) => {
      init[q.id] = idx === 0 ? 'not_answered' : 'not_visited';
    });
    return init;
  });

  // Time tracking
  const initialDurationSeconds = segmentConfig?.enabled
    ? Math.round((test.durationMinutes / test.totalQuestions) * activeQuestions.length * 60)
    : test.durationMinutes * 60;

  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState<number>(initialDurationSeconds);
  const [timeSpentPerQuestion, setTimeSpentPerQuestion] = useState<Record<string, number>>({});
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [instructionsModalOpen, setInstructionsModalOpen] = useState<boolean>(false);
  const [questionPaperModalOpen, setQuestionPaperModalOpen] = useState<boolean>(false);
  const [selectedCutoffCategory, setSelectedCutoffCategory] = useState<'general' | 'obc' | 'sc_st' | 'ews'>('general');

  // Timer interval
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitTestAuto();
          return 0;
        }
        return prev - 1;
      });

      // Track time on active question
      const currentQ = activeQuestions[currentQuestionIndex];
      if (currentQ) {
        setTimeSpentPerQuestion((prev) => ({
          ...prev,
          [currentQ.id]: (prev[currentQ.id] || 0) + 1
        }));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestionIndex, activeQuestions]);

  const currentQ = activeQuestions[currentQuestionIndex] || activeQuestions[0];
  const isBookmarked = currentQ && bookmarkedQuestions.includes(currentQ.id);

  // Switch question
  const goToQuestion = (index: number) => {
    if (index < 0 || index >= activeQuestions.length) return;
    
    const targetQ = activeQuestions[index];
    if (targetQ && questionStatuses[targetQ.id] === 'not_visited') {
      setQuestionStatuses(prev => ({ ...prev, [targetQ.id]: 'not_answered' }));
    }
    setCurrentQuestionIndex(index);
  };

  // Select Option
  const handleSelectOption = (optionIndex: number) => {
    setUserAnswers(prev => ({
      ...prev,
      [currentQ.id]: optionIndex
    }));
  };

  // TCS iON Actions
  const handleSaveAndNext = () => {
    const hasAnswer = userAnswers[currentQ.id] !== undefined && userAnswers[currentQ.id] !== -1;
    setQuestionStatuses(prev => ({
      ...prev,
      [currentQ.id]: hasAnswer ? 'answered' : 'not_answered'
    }));
    goToQuestion(currentQuestionIndex + 1);
  };

  const handleMarkForReviewAndNext = () => {
    const hasAnswer = userAnswers[currentQ.id] !== undefined && userAnswers[currentQ.id] !== -1;
    setQuestionStatuses(prev => ({
      ...prev,
      [currentQ.id]: hasAnswer ? 'answered_and_marked' : 'marked_for_review'
    }));
    goToQuestion(currentQuestionIndex + 1);
  };

  const handleClearResponse = () => {
    setUserAnswers(prev => {
      const updated = { ...prev };
      delete updated[currentQ.id];
      return updated;
    });
    setQuestionStatuses(prev => ({
      ...prev,
      [currentQ.id]: 'not_answered'
    }));
  };

  // Format Time
  const formatTime = (secs: number) => {
    const hours = Math.floor(secs / 3600);
    const minutes = Math.floor((secs % 3600) / 60);
    const seconds = secs % 60;
    if (hours > 0) {
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  // Question counts by TCS status
  const countAnswered = activeQuestions.filter(q => questionStatuses[q.id] === 'answered').length;
  const countNotAnswered = activeQuestions.filter(q => questionStatuses[q.id] === 'not_answered').length;
  const countNotVisited = activeQuestions.filter(q => questionStatuses[q.id] === 'not_visited').length;
  const countMarked = activeQuestions.filter(q => questionStatuses[q.id] === 'marked_for_review').length;
  const countAnsweredAndMarked = activeQuestions.filter(q => questionStatuses[q.id] === 'answered_and_marked').length;

  // Calculate score and finish attempt
  const calculateAndFinishAttempt = () => {
    let score = 0;
    let correctCount = 0;
    let incorrectCount = 0;
    let unattemptedCount = 0;

    const sectionScores: Record<string, {
      score: number;
      totalPossible: number;
      correct: number;
      incorrect: number;
      unattempted: number;
      accuracy: number;
      timeSeconds: number;
    }> = {};

    activeQuestions.forEach(q => {
      if (!sectionScores[q.section]) {
        sectionScores[q.section] = {
          score: 0,
          totalPossible: 0,
          correct: 0,
          incorrect: 0,
          unattempted: 0,
          accuracy: 0,
          timeSeconds: 0
        };
      }

      sectionScores[q.section].totalPossible += q.marksPositive;
      sectionScores[q.section].timeSeconds += timeSpentPerQuestion[q.id] || 0;

      const userAns = userAnswers[q.id];
      if (userAns !== undefined && userAns !== -1) {
        if (userAns === q.correctAnswerIndex) {
          score += q.marksPositive;
          correctCount++;
          sectionScores[q.section].correct++;
          sectionScores[q.section].score += q.marksPositive;
        } else {
          score -= q.marksNegative;
          incorrectCount++;
          sectionScores[q.section].incorrect++;
          sectionScores[q.section].score -= q.marksNegative;
        }
      } else {
        unattemptedCount++;
        sectionScores[q.section].unattempted++;
      }
    });

    Object.keys(sectionScores).forEach(sec => {
      const secData = sectionScores[sec];
      const attempted = secData.correct + secData.incorrect;
      secData.accuracy = attempted > 0 ? Math.round((secData.correct / attempted) * 100) : 0;
    });

    const attemptedTotal = correctCount + incorrectCount;
    const accuracy = attemptedTotal > 0 ? Math.round((correctCount / attemptedTotal) * 100) : 0;
    const totalPossibleMarks = activeQuestions.reduce((acc, q) => acc + q.marksPositive, 0);

    const totalParticipants = test.attemptsCount ? test.attemptsCount + 1 : 28400;
    const scoreRatio = Math.max(0, score) / Math.max(1, totalPossibleMarks);
    const percentile = Math.min(99.9, Math.max(15.0, Number((scoreRatio * 100 * 0.95 + 4.5).toFixed(1))));
    const rank = Math.max(1, Math.round(totalParticipants * (1 - percentile / 100)));

    const weakTopics = Array.from(new Set(
      activeQuestions
        .filter(q => userAnswers[q.id] !== undefined && userAnswers[q.id] !== q.correctAnswerIndex)
        .map(q => q.topic)
    ));

    const strongTopics = Array.from(new Set(
      activeQuestions
        .filter(q => userAnswers[q.id] === q.correctAnswerIndex)
        .map(q => q.topic)
    ));

    const activeCutoff = test.cutoffMarks?.[selectedCutoffCategory] || test.cutoffMarks?.general || totalPossibleMarks * 0.65;
    const clearedCutoff = score >= activeCutoff;
    const earnedTier = (accuracy >= 80 && scoreRatio >= 0.75) ? 'Gold' : (accuracy >= 60) ? 'Silver' : 'Bronze';

    const attempt: ExamAttempt = {
      id: 'att_' + Date.now(),
      mockId: test.id,
      mockTitle: test.title,
      examName: test.examName,
      category: test.category,
      date: new Date().toISOString().split('T')[0],
      totalTimeSeconds: initialDurationSeconds - timeRemainingSeconds,
      userAnswers,
      questionStatus: questionStatuses,
      timeSpentPerQuestion,
      score: Math.max(0, Number(score.toFixed(2))),
      totalMarks: totalPossibleMarks,
      accuracy,
      percentile,
      rank,
      totalParticipants,
      correctCount,
      incorrectCount,
      unattemptedCount,
      sectionScores,
      weakTopics: weakTopics.slice(0, 4),
      strongTopics: strongTopics.slice(0, 4),
      clearedCutoff,
      earnedTier,
      isSegmentedSession: !!segmentConfig?.enabled,
      segmentQuestionRange: segmentConfig?.enabled ? `Q${segmentConfig.startIndex + 1} - Q${segmentConfig.endIndex}` : undefined,
      topperComparison: {
        topperScore: Math.round(totalPossibleMarks * 0.94),
        topperAccuracy: 96,
        topperTimeMinutes: Math.round(test.durationMinutes * 0.75),
        averageScore: Math.round(totalPossibleMarks * 0.48),
        averageAccuracy: 62
      },
      speedMetrics: {
        avgTimeCorrectSec: 42,
        avgTimeIncorrectSec: 68,
        fastestAnswerSec: 14,
        slowestAnswerSec: 110
      }
    };

    recordAttempt(attempt);
    setCurrentView('analytics');
  };

  const handleSubmitTestAuto = () => {
    calculateAndFinishAttempt();
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Distinct sections in this test
  const testSections = Array.from(new Set(activeQuestions.map(q => q.section)));
  const currentSection = currentQ?.section || testSections[0];

  // Localized question content for 10 Indian Languages
  const localizedQ = getLocalizedQuestion(currentQ, selectedLanguage);

  // Dynamic font sizing classes for easy accessibility
  const questionFontSizeClass = fontSize === 'xlarge' 
    ? 'text-xl sm:text-2xl leading-relaxed' 
    : fontSize === 'large' 
    ? 'text-lg sm:text-xl leading-relaxed' 
    : 'text-base sm:text-lg leading-normal';

  const optionFontSizeClass = fontSize === 'xlarge'
    ? 'text-base sm:text-lg font-medium'
    : fontSize === 'large'
    ? 'text-sm sm:text-base font-medium'
    : 'text-xs sm:text-sm font-normal';

  const activeLangInfo = INDIAN_LANGUAGES.find(l => l.code === selectedLanguage) || INDIAN_LANGUAGES[0];

  return (
    <div className={`flex flex-col min-h-screen font-sans select-none transition-colors ${
      highContrast 
        ? 'bg-black text-yellow-300' 
        : 'bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100'
    }`}>
      
      {/* 1. TCS iON Authentic Examination Top Bar (Accessibility-Optimized) */}
      <header className="bg-slate-900 text-white px-4 py-2 flex flex-wrap items-center justify-between border-b border-slate-800 shadow-md shrink-0 gap-3">
        
        {/* Left: System Identification & Exam Name */}
        <div className="flex items-center gap-3">
          <div className="px-2.5 py-1 rounded bg-blue-700 text-white text-[11px] font-black tracking-tight flex items-center gap-1.5 shadow-sm">
            <Monitor className="w-3.5 h-3.5 text-blue-200" />
            <span>System: C-004</span>
          </div>

          <div>
            <h1 className="text-xs sm:text-sm font-bold text-slate-100 tracking-tight flex items-center gap-2">
              <span className="truncate max-w-[200px] sm:max-w-md">{test.title}</span>
              {segmentConfig?.enabled && (
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono border border-emerald-500/40">
                  Custom Segment ({segmentConfig.segmentSize} Qs)
                </span>
              )}
            </h1>
            <p className="text-[11px] text-slate-400">
              Exam: <span className="text-blue-400 font-semibold">{test.examName}</span> • Right: +{currentQ.marksPositive} | Wrong: -{currentQ.marksNegative}
            </p>
          </div>
        </div>

        {/* Right: Accessibility Controls (10 Indian Languages, Font Zoom, High Contrast, Timer) */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          
          {/* Category Choose for Cutoff Box */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs shadow-sm">
            <Target className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="text-[11px] text-slate-300 font-bold whitespace-nowrap hidden sm:inline">Category:</span>
            <select
              value={selectedCutoffCategory}
              onChange={(e) => setSelectedCutoffCategory(e.target.value as any)}
              className="bg-slate-900 text-emerald-300 font-black text-[11px] px-1.5 py-0.5 rounded border border-slate-700 outline-none cursor-pointer"
            >
              <option value="general">General / UR ({test.cutoffMarks?.general || 135})</option>
              <option value="obc">OBC ({test.cutoffMarks?.obc || 128})</option>
              <option value="sc_st">SC / ST ({test.cutoffMarks?.sc_st || 115})</option>
              <option value="ews">EWS ({test.cutoffMarks?.ews || 124})</option>
            </select>
          </div>

          {/* Read Attached Lesson PDF Note */}
          <button
            onClick={() => openPdfReader(test)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-blue-600/30 hover:bg-blue-600/50 text-blue-200 text-xs font-semibold border border-blue-500/40 transition-colors cursor-pointer"
            title="Read attached lesson PDF note"
          >
            <BookOpen className="w-3.5 h-3.5 text-blue-300" />
            <span className="hidden md:inline">{t('attached_pdf')}</span>
          </button>

          {/* View Full Question Paper */}
          <button
            onClick={() => setQuestionPaperModalOpen(true)}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
            title="View complete question paper"
          >
            <FileText className="w-3.5 h-3.5 text-blue-400" />
            <span>{t('view_question_paper')}</span>
          </button>

          {/* Instructions */}
          <button
            onClick={() => setInstructionsModalOpen(true)}
            className="hidden sm:flex items-center gap-1 px-2 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
            title="View examination instructions"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{t('view_instructions')}</span>
          </button>

          {/* 10 Indian Languages Dropdown Selector */}
          <div className="relative">
            <button
              onClick={() => setLangDropdownOpen(prev => !prev)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-colors cursor-pointer"
              title="Change examination language (10 Indian Languages)"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[11px] font-extrabold">{activeLangInfo.nativeName}</span>
              <span className="text-[10px] text-slate-400">({activeLangInfo.name})</span>
            </button>

            {langDropdownOpen && (
              <div 
                className="absolute right-0 mt-1 w-52 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-1 z-50 max-h-72 overflow-y-auto"
                onClick={() => setLangDropdownOpen(false)}
              >
                <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                  Select Language (10 Indian Languages)
                </div>
                {INDIAN_LANGUAGES.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between transition-colors cursor-pointer ${
                      selectedLanguage === lang.code 
                        ? 'bg-blue-600 text-white font-bold' 
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <span>{lang.nativeName}</span>
                    <span className="text-[10px] opacity-70">{lang.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Accessibility Font Size Zoom Controls (A-, A, A+) */}
          <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700 text-xs">
            <button
              onClick={() => setFontSize('normal')}
              className={`px-2 py-0.5 rounded font-bold transition-colors cursor-pointer text-xs ${
                fontSize === 'normal' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
              title="Standard Font Size"
            >
              A-
            </button>
            <button
              onClick={() => setFontSize('large')}
              className={`px-2 py-0.5 rounded font-bold transition-colors cursor-pointer text-xs ${
                fontSize === 'large' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
              title="Large Font Size"
            >
              A
            </button>
            <button
              onClick={() => setFontSize('xlarge')}
              className={`px-2 py-0.5 rounded font-bold transition-colors cursor-pointer text-xs ${
                fontSize === 'xlarge' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
              title="Extra Large Font Size"
            >
              A+
            </button>
          </div>

          {/* High Contrast Mode Toggle */}
          <button
            onClick={() => setHighContrast(!highContrast)}
            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
              highContrast 
                ? 'bg-yellow-400 text-black border-yellow-500 font-bold' 
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
            title="Toggle TCS High-Contrast Accessibility Mode"
          >
            {highContrast ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Realtime Countdown Timer */}
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono font-bold text-sm border ${
            timeRemainingSeconds < 300 
              ? 'bg-rose-950/90 text-rose-300 border-rose-600 animate-pulse' 
              : 'bg-slate-800 text-blue-400 border-slate-700'
          }`}>
            <Clock className="w-4 h-4" />
            <span>{formatTime(timeRemainingSeconds)}</span>
          </div>

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* 2. TCS iON Sections Navigation Bar */}
      <div className="bg-slate-800 text-slate-300 px-4 py-1.5 flex items-center justify-between text-xs border-b border-slate-700 overflow-x-auto shrink-0">
        <div className="flex items-center gap-1">
          <span className="text-slate-400 font-bold mr-2 uppercase text-[10px] tracking-wider">Sections:</span>
          {testSections.map((secName) => {
            const isSecActive = currentSection === secName;
            const secQuestions = activeQuestions.filter(q => q.section === secName);
            const secAnswered = secQuestions.filter(q => questionStatuses[q.id] === 'answered' || questionStatuses[q.id] === 'answered_and_marked').length;

            return (
              <button
                key={secName}
                onClick={() => {
                  const firstIdx = activeQuestions.findIndex(q => q.section === secName);
                  if (firstIdx !== -1) goToQuestion(firstIdx);
                }}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  isSecActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-700/60 hover:bg-slate-700 text-slate-300'
                }`}
              >
                <span>{secName}</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/40 text-blue-200">
                  {secAnswered}/{secQuestions.length}
                </span>
              </button>
            );
          })}
        </div>

        <div className="hidden md:flex items-center gap-3 text-slate-400">
          <span>{t('question_no')} <strong className="text-white text-sm">{currentQuestionIndex + 1}</strong> of {activeQuestions.length}</span>
        </div>
      </div>

      {/* 3. Main Workspace Area: Left (Question Area) + Right (TCS Question Palette) */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* Left Column: Question & Options */}
        <div className={`flex-1 flex flex-col border-r overflow-y-auto ${
          highContrast 
            ? 'bg-zinc-950 border-zinc-800 text-yellow-300' 
            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100'
        }`}>
          
          {/* Question Subheader */}
          <div className="px-6 py-2.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-800/40">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm text-slate-800 dark:text-slate-100">
                {t('question_no')} {currentQuestionIndex + 1}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium">
                {currentQ.section}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-semibold">
                +{currentQ.marksPositive} {t('marks')}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-md bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 font-semibold">
                -{currentQ.marksNegative} {t('negative_marks')}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Show / Hide Question Numbers Toggle Button */}
              <button
                type="button"
                onClick={() => setShowQuestionPalette(prev => !prev)}
                className={`p-1.5 sm:px-2.5 sm:py-1 rounded-lg border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  !showQuestionPalette
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 shadow-sm'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                title={showQuestionPalette ? "Hide Question Numbers (1 2 3 4...)" : "Show Question Numbers (1 2 3 4...)"}
              >
                {showQuestionPalette ? (
                  <>
                    <EyeOff className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                    <span className="hidden sm:inline">Hide Numbers (1 2 3 4)</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    <span className="hidden sm:inline">Show Numbers (1 2 3 4)</span>
                  </>
                )}
              </button>

              <button
                onClick={() => toggleBookmarkQuestion(currentQ.id)}
                className={`p-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                  isBookmarked 
                    ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400' 
                    : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Flag className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-emerald-400' : ''}`} />
                <span className="hidden sm:inline">{isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
              </button>
            </div>
          </div>

          {/* Question Body */}
          <div className="p-6 flex-1 overflow-y-auto space-y-6">
            
            {/* Question Statement in Selected Indian Language */}
            <div className={`${questionFontSizeClass} font-semibold leading-relaxed whitespace-pre-line ${
              highContrast ? 'text-yellow-300 font-mono' : 'text-slate-900 dark:text-slate-100'
            }`}>
              {localizedQ.questionText}
            </div>

            {/* Options list (TCS Radio Style with Accessible scaling) */}
            <div className="space-y-3 pt-2">
              {currentQ.options.map((optionText, optIdx) => {
                const isSelected = userAnswers[currentQ.id] === optIdx;
                const optionLabel = String.fromCharCode(65 + optIdx); // A, B, C, D
                const displayOptionText = localizedQ.options[optIdx] || optionText;

                return (
                  <button
                    key={optIdx}
                    type="button"
                    onClick={() => handleSelectOption(optIdx)}
                    className={`w-full p-4 rounded-2xl border text-left flex items-start gap-3.5 transition-all cursor-pointer ${
                      isSelected
                        ? highContrast
                          ? 'border-yellow-400 bg-yellow-400/20 text-yellow-200'
                          : 'border-blue-500 bg-blue-50/70 dark:bg-blue-950/40 text-blue-950 dark:text-blue-100 shadow-sm ring-1 ring-blue-500'
                        : highContrast
                          ? 'border-zinc-800 hover:border-yellow-500/50 text-yellow-300'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-50/50 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                      isSelected
                        ? highContrast
                          ? 'bg-yellow-400 text-black'
                          : 'bg-blue-600 text-white'
                        : highContrast
                          ? 'bg-zinc-900 text-yellow-300 border border-zinc-700'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}>
                      {optionLabel}
                    </div>
                    <span className={`${optionFontSizeClass} pt-0.5 leading-snug`}>
                      {displayOptionText}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom Action Footer (TCS Controls: Save & Next, Clear Response, Mark for Review & Next) */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/70 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
            
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleMarkForReviewAndNext}
                className="px-3.5 py-2.5 rounded-xl bg-purple-100 hover:bg-purple-200 dark:bg-purple-950/50 dark:hover:bg-purple-900/60 text-purple-700 dark:text-purple-300 font-bold text-xs sm:text-sm border border-purple-300 dark:border-purple-800 transition-colors cursor-pointer"
              >
                {t('mark_for_review_next')}
              </button>

              <button
                type="button"
                onClick={handleClearResponse}
                className="px-3.5 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 font-bold text-xs sm:text-sm transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{t('clear_response')}</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={currentQuestionIndex === 0}
                onClick={() => goToQuestion(currentQuestionIndex - 1)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold text-xs sm:text-sm transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>{t('previous')}</span>
              </button>

              {/* Primary Action in TCS Blue: Save & Next */}
              <button
                type="button"
                onClick={handleSaveAndNext}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-blue-600/30 flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
              >
                <span>{t('save_and_next')}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>

        {/* Right Column: Candidate Profile & TCS Question Palette */}
        {showQuestionPalette ? (
          <div className="w-full lg:w-80 bg-slate-50 dark:bg-slate-900/90 flex flex-col border-t lg:border-t-0 border-slate-200 dark:border-slate-800 shrink-0">
            
            {/* Candidate Profile Card */}
            <div className="p-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-sm flex items-center justify-center shadow-md">
                  {currentUser.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-xs text-slate-900 dark:text-white leading-tight">
                    {currentUser.name}
                  </h3>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                    {t('roll_no')}: TCS-ION-2026-9814
                  </p>
                  <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-1 mt-0.5">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" /> TCS iON Candidate Verified
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowQuestionPalette(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                title="Hide Question Numbers (1 2 3 4...)"
              >
                <EyeOff className="w-4 h-4" />
              </button>
            </div>

          {/* TCS iON Palette Legend Indicators (5 States) */}
          <div className="p-3 bg-slate-100 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] space-y-1.5 font-medium">
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-md bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px] shadow-sm">
                  {countAnswered}
                </span>
                <span className="text-slate-700 dark:text-slate-300 text-[11px] font-semibold">{t('legend_answered')}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-md bg-rose-600 text-white flex items-center justify-center font-bold text-[10px] shadow-sm">
                  {countNotAnswered}
                </span>
                <span className="text-slate-700 dark:text-slate-300 text-[11px] font-semibold">{t('legend_not_answered')}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-md bg-slate-300 dark:bg-slate-700 text-slate-800 dark:text-slate-200 flex items-center justify-center font-bold text-[10px]">
                  {countNotVisited}
                </span>
                <span className="text-slate-700 dark:text-slate-300 text-[11px]">{t('legend_not_visited')}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-[10px]">
                  {countMarked}
                </span>
                <span className="text-slate-700 dark:text-slate-300 text-[11px]">{t('legend_marked')}</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 pt-1">
              <div className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-[10px] relative">
                <span className="w-2 h-2 rounded-full bg-emerald-400 absolute -top-0.5 -right-0.5 border border-white" />
                {countAnsweredAndMarked}
              </div>
              <span className="text-slate-700 dark:text-slate-300 text-[10px] leading-tight">
                {t('legend_answered_marked')}
              </span>
            </div>
          </div>

          {/* TCS Question Palette Grid */}
          <div className="p-3.5 flex-1 overflow-y-auto">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2.5">
              {t('question_palette')} ({activeQuestions.length} Qs)
            </h4>
            
            <div className="grid grid-cols-5 gap-2">
              {activeQuestions.map((q, idx) => {
                const status = questionStatuses[q.id] || 'not_visited';
                const isCurrent = idx === currentQuestionIndex;

                let colorClasses = 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300';
                let shapeClass = 'rounded-md';
                
                if (status === 'answered') {
                  colorClasses = 'bg-emerald-600 text-white font-bold hover:bg-emerald-500 shadow-sm';
                  shapeClass = 'rounded-md';
                } else if (status === 'not_answered') {
                  colorClasses = 'bg-rose-600 text-white font-bold hover:bg-rose-500';
                  shapeClass = 'rounded-md';
                } else if (status === 'marked_for_review') {
                  colorClasses = 'bg-purple-600 text-white font-bold hover:bg-purple-500';
                  shapeClass = 'rounded-full';
                } else if (status === 'answered_and_marked') {
                  colorClasses = 'bg-purple-600 text-white font-bold relative hover:bg-purple-500';
                  shapeClass = 'rounded-full';
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => goToQuestion(idx)}
                    className={`h-9 ${shapeClass} text-xs font-bold transition-all cursor-pointer flex items-center justify-center relative ${colorClasses} ${
                      isCurrent ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-white dark:ring-offset-slate-900 scale-105 z-10' : ''
                    }`}
                  >
                    {idx + 1}
                    {status === 'answered_and_marked' && (
                      <span className="w-2 h-2 rounded-full bg-emerald-400 absolute top-0.5 right-0.5 border border-white" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* TCS Prominent Submit Button */}
          <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 space-y-2">
            <button
              onClick={() => setIsSubmitModalOpen(true)}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-blue-600/30 transition-all cursor-pointer active:scale-95"
            >
              {t('submit_exam')}
            </button>
            <p className="text-[10px] text-center text-slate-400">
              Auto-submits when countdown timer reaches 00:00
            </p>
          </div>

        </div>
        ) : (
          /* Collapsed strip when question numbers (1 2 3 4) are hidden */
          <div className="hidden lg:flex flex-col items-center justify-between py-4 px-2 bg-slate-100 dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 w-12 shrink-0">
            <button
              type="button"
              onClick={() => setShowQuestionPalette(true)}
              className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-md cursor-pointer transition-transform active:scale-95"
              title="Show Question Numbers (1 2 3 4...)"
            >
              <Eye className="w-4 h-4" />
            </button>
            <div className="text-[10px] font-extrabold tracking-widest text-slate-400 dark:text-slate-500 uppercase select-none [writing-mode:vertical-lr] rotate-180">
              Numbers 1 2 3 4
            </div>
            <button
              onClick={() => setIsSubmitModalOpen(true)}
              className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-md cursor-pointer"
              title="Submit Test"
            >
              <Check className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Confirmation Submit Modal (TCS Exam Summary Breakdown) */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5 animate-in zoom-in-95 duration-150">
            <div className="text-center space-y-1">
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                {t('confirm_submit_title')}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t('confirm_submit_msg')}
              </p>
            </div>

            {/* TCS Summary Statistics */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2.5 text-xs">
              <div className="font-bold text-slate-700 dark:text-slate-300 pb-1 border-b border-slate-200 dark:border-slate-700">
                {t('exam_summary')}
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>{t('total_questions')}:</span>
                <strong>{activeQuestions.length}</strong>
              </div>
              <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                <span>{t('legend_answered')}:</span>
                <span>{countAnswered + countAnsweredAndMarked}</span>
              </div>
              <div className="flex justify-between text-rose-600 dark:text-rose-400 font-bold">
                <span>{t('legend_not_answered')}:</span>
                <span>{countNotAnswered}</span>
              </div>
              <div className="flex justify-between text-purple-600 dark:text-purple-400 font-bold">
                <span>{t('legend_marked')}:</span>
                <span>{countMarked}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>{t('time_left')}:</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{formatTime(timeRemainingSeconds)}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsSubmitModalOpen(false)}
                className="flex-1 py-3 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                {t('cancel')}
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsSubmitModalOpen(false);
                  calculateAndFinishAttempt();
                }}
                className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs shadow-md shadow-blue-600/30 cursor-pointer active:scale-95"
              >
                {t('confirm_submit_btn')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Question Paper Full Sheet Modal */}
      {questionPaperModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-sm">Full Question Paper Sheet ({activeQuestions.length} Questions) - {activeLangInfo.nativeName}</h3>
              </div>
              <button onClick={() => setQuestionPaperModalOpen(false)} className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs sm:text-sm">
              {activeQuestions.map((q, idx) => {
                const loc = getLocalizedQuestion(q, selectedLanguage);
                return (
                  <div key={q.id} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                    <div className="flex items-center justify-between font-bold text-blue-600">
                      <span>Q{idx + 1}. {q.section}</span>
                      <span className="text-[11px] text-slate-500">+{q.marksPositive} / -{q.marksNegative}</span>
                    </div>
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {loc.questionText}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-600 dark:text-slate-300 pt-1">
                      {q.options.map((opt, optIdx) => (
                        <span key={optIdx} className="p-1.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                          ({String.fromCharCode(65 + optIdx)}) {loc.options[optIdx] || opt}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Instructions Modal (TCS CBT Guidelines) */}
      {instructionsModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-600" />
                <span>TCS iON CBT Exam Guidelines</span>
              </h3>
              <button onClick={() => setInstructionsModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              <p>1. The countdown timer in the top right corner indicates the remaining examination time.</p>
              <p>2. Green palette items indicate questions you have answered and saved.</p>
              <p>3. Red palette items are questions you have visited but not answered.</p>
              <p>4. Purple circle items are marked for review and have not been answered.</p>
              <p>5. Purple circle with small green dot items have been answered AND marked for review; they <strong>WILL be evaluated</strong> in your score.</p>
              <p>6. Switch between 10 Indian Languages anytime using the Language dropdown.</p>
              <p>7. Adjust font size with A-, A, A+ or toggle High-Contrast mode for accessibility.</p>
              <p>8. Click "Attached PDF Note" anytime to revise formulas before attempting.</p>
            </div>

            <button
              onClick={() => setInstructionsModalOpen(false)}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs cursor-pointer shadow-md"
            >
              Close & Return to Test
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
