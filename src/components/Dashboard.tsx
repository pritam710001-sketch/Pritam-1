import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { MockTest } from '../types';
import { SUBSCRIPTION_PLANS } from '../data/mockData';
import { SegmentModal } from './SegmentModal';
import { ExamTimelineSection } from './ExamTimelineSection';
import { ExamCountdown } from './ExamCountdown';
import { ExamScheduleTrackerModal } from './ExamScheduleTrackerModal';
import { 
  Zap, 
  Award, 
  Crown, 
  FileText, 
  BookOpen, 
  Bell, 
  BarChart2, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  Layers, 
  Sparkles,
  Flame,
  ShieldCheck,
  Target,
  Laptop,
  Lock,
  ChevronDown,
  Globe,
  Radio,
  FileCheck,
  Calendar,
  ExternalLink,
  ChevronRight,
  Check,
  FileUp,
  Maximize,
  Minimize,
  Search,
  Bookmark
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { 
    currentUser, 
    setCurrentView, 
    mockTests, 
    adminExams,
    selectedExamName,
    setSelectedExamName,
    startFullMockTest, 
    openPdfReader, 
    setSubscriptionModalOpen,
    openPaymentCheckout,
    isTestFreeForStudent,
    userTier,
    currentAffairs,
    liveTests,
    setImageToPdfModalOpen,
    openConverter,
    paymentConfig,
    ebooks,
    bookmarkedMockTestIds,
    toggleBookmarkMockTest,
    isMockTestBookmarked,
    websiteBannerConfig,
    t
  } = useApp();

  const [segmentTargetTest, setSegmentTargetTest] = useState<MockTest | null>(null);
  const [examDropdownOpen, setExamDropdownOpen] = useState(false);
  const [examSearchQuery, setExamSearchQuery] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [scheduleTrackerOpen, setScheduleTrackerOpen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  // Filter ONLY mocks belonging to the chosen exam on the homepage!
  const examMocks = mockTests.filter(t => t.examName === selectedExamName);

  // Fallback to all mocks if none found for current selected exam
  const displayMocks = examMocks.length > 0 ? examMocks : mockTests.slice(0, 3);

  const selectedExamData = adminExams.find(e => e.name === selectedExamName);

  const filteredExams = adminExams.filter(e =>
    e.name.toLowerCase().includes(examSearchQuery.toLowerCase()) ||
    e.category.toLowerCase().includes(examSearchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      
      {/* International User Notice Banner */}
      {currentUser.country && currentUser.country !== 'India' && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-amber-900 dark:text-amber-200">
          <div className="flex items-center gap-2.5">
            <Globe className="w-5 h-5 text-amber-500 shrink-0" />
            <div>
              <p className="text-xs font-bold leading-tight">
                International Aspirant Mode: <strong>{currentUser.country}</strong>
              </p>
              <p className="text-[11px] text-amber-800 dark:text-amber-300">
                You have unrestricted access to all official E-Books & lesson PDFs. International Pass price: <strong>${paymentConfig.internationalPriceUsd || 9.99} USD</strong>.
              </p>
            </div>
          </div>
          <button
            onClick={() => setCurrentView('ebooks')}
            className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-xs shadow-md shrink-0 cursor-pointer"
          >
            Access E-Books & Study PDFs →
          </button>
        </div>
      )}

      {/* Top Utility Bar Directly on top of Choose My Exam Bar */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white rounded-xl py-1 sm:py-1.5 px-3 sm:px-4 border border-blue-500/30 shadow-md flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-sky-400 shrink-0" />
          <span className="font-bold text-xs text-white tracking-wide">
            Document Tools & Exam Facility
          </span>
          <span className="hidden sm:inline-block text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            Free
          </span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          {/* Facility 1: Language Converter Box */}
          <button
            type="button"
            onClick={() => openConverter('documents')}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-[11px] shadow-sm transition-all cursor-pointer active:scale-95"
            title="Translate PDFs & Images into 10 Indian Languages"
          >
            <Globe className="w-3 h-3 text-white" />
            <span>Language Converter Global</span>
          </button>

          {/* Facility 2: Image to PDF Facility */}
          <button
            type="button"
            onClick={() => openConverter('image_to_pdf')}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-[11px] shadow-sm border border-white/20 transition-all cursor-pointer active:scale-95"
            title="Convert photos, study notes & screenshots into high quality PDF"
          >
            <FileUp className="w-3 h-3 text-white" />
            <span>Image to PDF</span>
          </button>
        </div>
      </div>

      {/* Middle Little Banner of Exam Schedule Tracker Option */}
      <div className="bg-gradient-to-r from-amber-950/80 via-slate-900 to-orange-950/80 text-white rounded-xl py-1.5 px-3 sm:px-4 border border-amber-500/30 shadow-md flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-400/30 flex items-center justify-center shrink-0">
            <Calendar className="w-3.5 h-3.5" />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-extrabold text-xs text-white tracking-wide">
              Official Exam Schedule & Dates Tracker
            </span>
            <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
              72+ Active Central & State Exams
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setScheduleTrackerOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-black text-xs shadow-sm border border-amber-400/30 transition-all cursor-pointer active:scale-95"
          title="Open Official Exam Schedule & Dates Tracker"
        >
          <Calendar className="w-3.5 h-3.5 text-amber-200" />
          <span>Open Exam Schedule Tracker →</span>
        </button>
      </div>

      {/* 1. Hero & Exam Selection Bar with Blue Theme */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-6 sm:p-10 border border-blue-500/30 shadow-2xl">
        <div className="absolute -right-16 -top-16 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        
        {/* Modern Stylish Exam Selection Row: Formatted Like the Top Bar Exam Select Option */}
        <div className="relative z-10 flex flex-col gap-3 pb-5 mb-5 border-b border-white/15">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-black uppercase tracking-wider">
                <Target className="w-3.5 h-3.5 text-blue-400" />
                <span>{t('choose_target_exam')}:</span>
              </div>
              
              {/* Selected Target Exam Option Styled Like Top Bar Exam Select */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setExamDropdownOpen(prev => !prev)}
                  className="flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-xl bg-blue-50/90 dark:bg-blue-950/70 hover:bg-blue-100 dark:hover:bg-blue-900/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 shadow-sm transition-all cursor-pointer group active:scale-95"
                  title="Target Examination (Click to switch)"
                >
                  <div className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
                    <Target className="w-3.5 h-3.5 group-hover:rotate-45 transition-transform" />
                  </div>
                  <div className="text-left flex flex-col justify-center">
                    <span className="text-[8px] font-black uppercase text-blue-600/80 dark:text-blue-400/80 leading-none">
                      Target Exam
                    </span>
                    <span className="font-black text-xs sm:text-sm text-slate-900 dark:text-white leading-tight">
                      {selectedExamName}
                    </span>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-blue-500 ml-1 transition-transform duration-200 shrink-0 ${examDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Stylish Floating Exam Dropdown Exactly Like Top Bar */}
                {examDropdownOpen && (
                  <div 
                    className="absolute left-0 mt-2 w-72 sm:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-2.5 z-50 animate-in fade-in zoom-in-95 duration-100 text-slate-800 dark:text-slate-100"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800 text-xs">
                      <span className="font-black uppercase tracking-wider text-[10px] text-slate-400">
                        Select Target Examination
                      </span>
                      <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded-full">
                        {adminExams.length} Exams
                      </span>
                    </div>

                    {/* Search box inside exam dropdown */}
                    <div className="relative mb-2">
                      <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search exam name (SSC, RRB, PSC...)"
                        value={examSearchQuery}
                        onChange={(e) => setExamSearchQuery(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    <div className="max-h-64 overflow-y-auto space-y-1 scrollbar-thin">
                      {filteredExams.map((ex) => {
                        const isSelected = selectedExamName === ex.name;
                        return (
                          <button
                            key={ex.id}
                            type="button"
                            onClick={() => {
                              setSelectedExamName(ex.name);
                              setExamDropdownOpen(false);
                              setExamSearchQuery('');
                            }}
                            className={`w-full text-left p-2 rounded-xl transition-all cursor-pointer flex items-center justify-between ${
                              isSelected
                                ? 'bg-blue-600 text-white font-extrabold shadow-md'
                                : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'
                            }`}
                          >
                            <div className="flex items-center gap-2 truncate pr-2">
                              <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 font-bold text-xs ${
                                isSelected ? 'bg-white/20 text-white' : 'bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400'
                              }`}>
                                <Target className="w-4 h-4" />
                              </div>
                              <div className="truncate text-left">
                                <div className="text-xs font-bold truncate leading-tight">
                                  {ex.name}
                                </div>
                                <div className={`text-[10px] mt-0.5 truncate ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                                  {ex.category} • {ex.scope === 'State' ? ex.stateName || 'State PSC' : 'Central All-India'}
                                </div>
                              </div>
                            </div>
                            {isSelected && <Check className="w-4 h-4 text-white shrink-0 ml-1" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <span className="text-[11px] text-blue-200 font-medium hidden lg:inline">
              ⚡ Tests & syllabus lesson notes automatically adapt to your chosen exam
            </span>
          </div>

          {/* Quick Clickable Exam Pills Bar with Stylish Contrast & Badges */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-thin">
            <span className="text-[10px] font-black uppercase tracking-wider text-blue-300 shrink-0 mr-1 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-sky-400" /> Quick Select:
            </span>
            {adminExams.map((ex) => {
              const isSelected = selectedExamName === ex.name;
              return (
                <button
                  key={ex.id}
                  type="button"
                  onClick={() => setSelectedExamName(ex.name)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1.5 border ${
                    isSelected
                      ? 'bg-white text-blue-950 shadow-lg shadow-white/10 ring-2 ring-blue-300 border-white font-black scale-[1.02]'
                      : 'bg-white/10 hover:bg-white/20 text-white/95 border-white/20 hover:border-white/40'
                  }`}
                >
                  <Target className={`w-3.5 h-3.5 ${isSelected ? 'text-blue-600' : 'text-blue-300'}`} />
                  <span className="font-extrabold">{ex.name}</span>
                  <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${
                    isSelected ? 'bg-blue-100 text-blue-800' : 'bg-white/15 text-blue-200'
                  }`}>
                    {ex.category}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-4">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
              {t('targeting')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">{selectedExamName}</span>
            </h1>
            
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Official CBT pattern mock tests and attached study lesson notes curated specifically for <strong>{selectedExamName}</strong>. Read the attached study lesson first before taking tests.
            </p>

            {/* Quick Actions & Tier Pill */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => setCurrentView('mock_tests')}
                className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-blue-600/30 flex items-center gap-2 transition-all cursor-pointer active:scale-95"
              >
                <FileText className="w-4 h-4" />
                <span>{selectedExamName} {t('mock_tests')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setCurrentView('teach_with_us')}
                className="px-4 py-3 rounded-2xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 border border-emerald-400/30 font-bold text-xs sm:text-sm flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Laptop className="w-4 h-4 text-emerald-400" />
                <span>Earn ₹1 Lakh/mo & Win Laptops</span>
              </button>

              <button
                onClick={() => setCurrentView('ebooks')}
                className="px-4 py-3 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-400/30 font-bold text-xs sm:text-sm flex items-center gap-2 transition-colors cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-amber-400" />
                <span>Study E-Books & Notes ({ebooks.length})</span>
              </button>
            </div>
          </div>

          {/* Visual CBT Interface Preview Image */}
          <div className="hidden xl:flex flex-col items-center justify-center shrink-0">
            <div className="relative w-48 h-44 rounded-2xl overflow-hidden border border-white/20 shadow-2xl group">
              <img 
                src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=400&q=80" 
                alt="Real Exam CBT Simulator" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent flex flex-col justify-end p-2.5">
                <span className="text-[10px] font-black text-emerald-300 bg-emerald-950/90 px-2 py-0.5 rounded-full inline-flex items-center gap-1 border border-emerald-500/30 w-fit mb-1">
                  <Radio className="w-2.5 h-2.5 text-emerald-400 animate-pulse" /> TCS iON Pattern
                </span>
                <span className="text-xs font-extrabold text-white leading-tight">
                  Real Exam Simulator
                </span>
              </div>
            </div>
          </div>

          {/* Pass Status Card */}
          <div className="w-full lg:w-80 bg-white/10 dark:bg-slate-900/80 backdrop-blur-md rounded-3xl p-5 border border-white/20 shadow-xl space-y-4 shrink-0">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Crown className="w-4 h-4 text-emerald-400" /> Pass Status
              </span>
              <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold border ${
                currentUser.subscription.active
                  ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              }`}>
                {currentUser.subscription.active ? 'Pass Active' : 'Free Mode'}
              </span>
            </div>

            {currentUser.subscription.active ? (
              <div>
                <span className="text-2xl font-black text-white block">
                  {currentUser.subscription.daysRemaining} Days
                </span>
                <span className="text-xs text-blue-300 font-medium">
                  {currentUser.subscription.planName}
                </span>
                <p className="text-[11px] text-slate-300 mt-2">
                  Unrestricted access to all tests & study lesson notes.
                </p>
              </div>
            ) : (
              <div>
                <span className="text-2xl font-black text-emerald-300 block">
                  7-Day Trial (₹2)
                </span>
                <span className="text-xs text-slate-300 font-medium">
                  Max 1 Trial per Device in 3 Months • All Exams
                </span>
                <p className="text-[11px] text-slate-300 mt-2">
                  Device authentication permission required at trial activation!
                </p>
              </div>
            )}

            <button
              onClick={() => setSubscriptionModalOpen(true)}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-blue-600/30 cursor-pointer transition-all active:scale-95"
            >
              <Crown className="w-3.5 h-3.5" />
              <span>{currentUser.subscription.active ? 'Extend Pass (365 Days)' : 'Start 7-Day Trial (₹2 Only)'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* OFFICIAL LIVE EXAM COUNTDOWN COMPONENT */}
      <ExamCountdown />

      {/* MODERN PROMINENT BANNER: BE SMART FOLLOW THE PATTERN AND GET SELECTED (Made Little Big) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 border-2 border-blue-500/40 shadow-xl text-white py-3 sm:py-4 px-4 sm:px-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-3.5 sm:gap-4">
        <div className="flex items-center gap-3 z-10 min-w-0">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shrink-0 shadow-inner">
            <Sparkles className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-0.5">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-black uppercase tracking-wider">
                TOPPER STRATEGY & SUCCESS FORMULA
              </span>
              <span className="text-[11px] text-blue-200 hidden sm:inline font-medium opacity-90">
                • 100% Real TCS iON CBT Exam Pattern
              </span>
            </div>
            <h2 className="text-sm sm:text-base lg:text-lg font-black tracking-tight text-white uppercase leading-snug drop-shadow-sm">
              &ldquo;BE SMART FOLLOW THE PATTERN AND GET SELECTED&rdquo;
            </h2>
          </div>
        </div>

        <button
          onClick={() => setCurrentView('mock_tests')}
          className="z-10 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-emerald-500/25 flex items-center gap-2 cursor-pointer transition-all active:scale-95 whitespace-nowrap shrink-0 self-end md:self-center"
        >
          <span>Start Pattern Mocks</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* SINGLE BOX CONTAINER FOR ALL PLANS IN PURCHASING SECTION */}
      <div className="bg-slate-50 dark:bg-slate-800/60 rounded-3xl p-4 sm:p-5 border-2 border-blue-500/30 dark:border-blue-500/20 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-blue-600/10 text-blue-600 dark:text-blue-400 rounded-lg">
              <Zap className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white leading-tight">
                All Exam Pass Plans (All Plans in One Box)
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Choose any pass to unlock 500+ mock tests & lesson notes instantly.
              </p>
            </div>
          </div>
          <button
            onClick={() => setSubscriptionModalOpen(true)}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Compare Details</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {SUBSCRIPTION_PLANS.map((plan) => {
            const price = plan.id === 'day1' ? paymentConfig.prices.day1
              : plan.id === 'single_exam' ? paymentConfig.prices.single_exam
              : plan.id === 'month6' ? paymentConfig.prices.month6
              : paymentConfig.prices.year1;

            const isDay1 = plan.id === 'day1';
            const isMonth1 = plan.id === 'single_exam';
            const is6Month = plan.id === 'month6';
            const is1Year = plan.id === 'year1';

            return (
              <div
                key={plan.id}
                onClick={() => openPaymentCheckout(plan)}
                className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-2 hover:shadow-lg hover:-translate-y-0.5 active:scale-95 ${
                  isDay1
                    ? 'border-emerald-500 bg-white dark:bg-slate-800 shadow-sm'
                    : is6Month
                    ? 'border-blue-500 bg-white dark:bg-slate-800 ring-2 ring-blue-500/20 shadow-md'
                    : is1Year
                    ? 'border-indigo-500 bg-white dark:bg-slate-800 shadow-md'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                      isDay1 ? 'bg-emerald-600 text-white' : is6Month ? 'bg-blue-600 text-white' : is1Year ? 'bg-indigo-600 text-white' : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                    }`}>
                      {isDay1 ? '⚡ 7-Day Trial' : isMonth1 ? '🎯 30 Days' : is6Month ? '★ RECOMMENDED' : '👑 365 DAYS'}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold line-through">
                      ₹{plan.originalPrice}
                    </span>
                  </div>
                  <h4 className="font-extrabold text-xs text-slate-900 dark:text-white leading-tight">
                    {isDay1 ? '7-Day Trial (₹2)' : isMonth1 ? '1-Month All Exams' : is6Month ? '6-Month Pass' : '1-Year Full Pass'}
                  </h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {isDay1 ? '1 Trial / Device in 3 Months' : isMonth1 ? '30 Days All Exams Free' : is6Month ? '180 Days Unlimited' : 'Full 365 Days Access'}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
                  <span className="text-xl font-black text-slate-900 dark:text-white">
                    ₹{price || 2}
                  </span>
                  <span className={`px-2.5 py-1 rounded-lg font-bold text-[11px] text-white shadow-sm flex items-center gap-0.5 ${
                    isDay1 ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-blue-600 hover:bg-blue-500'
                  }`}>
                    <span>Unlock</span>
                    <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Visual Exam Categories Showcase with Images */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              Target Government Examination Streams
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Exam-oriented mock tests, previous year papers, and lesson formula guides
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          {[
            {
              name: 'Staff Selection (SSC)',
              exams: 'CGL, CHSL, MTS, CPO, GD',
              img: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=400&q=80',
              badge: '180+ Tests',
              color: 'from-blue-600/90 to-blue-900/95'
            },
            {
              name: 'Railways Recruitment',
              exams: 'RRB NTPC, Group D, ALP',
              img: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=400&q=80',
              badge: '120+ Tests',
              color: 'from-emerald-600/90 to-emerald-900/95'
            },
            {
              name: 'Banking & Insurance',
              exams: 'SBI PO, IBPS Clerk, RBI',
              img: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=400&q=80',
              badge: '95+ Tests',
              color: 'from-indigo-600/90 to-indigo-900/95'
            },
            {
              name: 'State PSC & Police',
              exams: 'WB, Bihar, UP, Rajasthan',
              img: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=400&q=80',
              badge: '140+ Tests',
              color: 'from-amber-600/90 to-amber-900/95'
            }
          ].map((cat, idx) => (
            <div
              key={idx}
              onClick={() => setCurrentView('mock_tests')}
              className="relative rounded-2xl overflow-hidden shadow-md group cursor-pointer h-36 border border-slate-200 dark:border-slate-800 transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              <img
                src={cat.img}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${cat.color} opacity-85 group-hover:opacity-95 transition-opacity flex flex-col justify-between p-3.5 text-white`} />
              <div className="relative z-10 flex items-center justify-between">
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-white/25 text-white backdrop-blur-sm">
                  {cat.badge}
                </span>
                <ChevronRight className="w-4 h-4 text-white/80 group-hover:translate-x-1 transition-transform" />
              </div>
              <div className="relative z-10">
                <h4 className="font-extrabold text-sm text-white leading-tight">
                  {cat.name}
                </h4>
                <p className="text-[10px] text-white/80 mt-0.5 truncate">
                  {cat.exams}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Mandatory Quote Banner */}
      <div className="bg-gradient-to-r from-blue-500/10 via-emerald-500/10 to-indigo-500/10 rounded-2xl p-4 sm:p-5 border border-blue-500/30 flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-500 flex items-center justify-center shrink-0">
          <Award className="w-7 h-7" />
        </div>
        <div>
          <h2 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-slate-100">
            &ldquo;1 lakh+ students have already cleared their exams using this platform for last 5 years across India&rdquo;
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Top selections in SSC CGL, Railway NTPC, SBI/IBPS Banking and State PSCs.
          </p>
        </div>
      </div>

      {/* 3. Side-by-Side: Teach With Us Program & E-Books Section on Home Page */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: Teach With Us & Tier Gifts Card */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/70 text-white rounded-3xl p-5 border border-emerald-500/30 shadow-md flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                <Laptop className="w-3 h-3 text-emerald-400" /> Teach With Us
              </span>
              <span className="text-xs font-bold text-emerald-400">
                Earn Up to ₹1,00,000/Month
              </span>
            </div>

            <div className="flex items-start gap-3">
              <div className="text-3xl shrink-0">
                {userTier === 'Gold' ? '🥇' : userTier === 'Silver' ? '🥈' : '🥉'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-base text-white">Your Live Tier: {userTier} Level</span>
                  <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold">
                    Accuracy: {currentUser.avgAccuracy}%
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {userTier === 'Gold'
                    ? 'Eligible to win Laptop & Smartphone gifts + earn up to ₹1,00,000/month teaching!'
                    : userTier === 'Silver'
                    ? 'You qualify to submit request to Teach With Us with your mobile number.'
                    : 'Score 60%+ accuracy on live mocks to unlock Silver Level & teaching contracts.'}
                </p>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-emerald-500/20 flex flex-wrap items-center justify-between gap-2">
            <span className="text-[11px] text-emerald-300/90 font-medium">
              🎁 Win Laptops, Phones & Monthly Teaching
            </span>
            <button
              onClick={() => setCurrentView('teach_with_us')}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-extrabold text-xs cursor-pointer shadow-md transition-all active:scale-95"
            >
              Teach With Us Details →
            </button>
          </div>
        </div>

        {/* Right: E-Books Section (Side of Teach) */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/70 text-white rounded-3xl p-5 border border-amber-500/30 shadow-md flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                <BookOpen className="w-3 h-3 text-amber-400" /> Official E-Books
              </span>
              <span className="text-xs font-bold text-amber-400">
                {ebooks.length} Study Books & Notes
              </span>
            </div>

            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-white">
                Exam Formula Handbooks & GK Capsules
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Curated syllabus notes, speed calculation formulas, and static GK summaries.
              </p>
            </div>

            {/* Quick mini-list of 2 featured ebooks */}
            <div className="mt-2.5 space-y-2">
              {ebooks.slice(0, 2).map((book) => (
                <div 
                  key={book.id}
                  onClick={() => {
                    openPdfReader({
                      id: `ebook-${book.id}`,
                      title: book.title,
                      category: book.category,
                      examName: `${book.category} E-Book Capsule`,
                      description: book.description,
                      type: 'section_wise',
                      durationMinutes: 15,
                      totalMarks: 30,
                      totalQuestions: 10,
                      sections: [book.subject],
                      attachedPdf: {
                        title: book.title,
                        pagesCount: book.pages,
                        readTimeMinutes: Math.ceil(book.pages * 1.5),
                        summary: book.description,
                        contentMarkdown: `# ${book.title}\n\n**Subject**: ${book.subject} | **Category**: ${book.category}\n\n### Chapters:\n${book.chapters.map(c => `- ${c}`).join('\n')}\n\n### Syllabus & Summary Notes:\n${book.contentSummary}`,
                        pdfDataUrl: book.pdfDataUrl,
                        fileName: `${book.title.replace(/\s+/g, '_')}.pdf`
                      },
                      questions: [],
                      cutoffMarks: { general: 20, obc: 18, sc_st: 15, ews: 17 },
                      attemptsCount: 3500,
                      avgScore: 22
                    });
                  }}
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-between gap-3 cursor-pointer transition-colors group"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0">
                      <BookOpen className="w-3.5 h-3.5" />
                    </span>
                    <div className="min-w-0">
                      <div className="font-bold text-xs truncate text-white group-hover:text-amber-300 transition-colors">{book.title}</div>
                      <div className="text-[10px] text-slate-400">{book.subject} • {book.pages} Pages</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-amber-400 group-hover:underline shrink-0">Read PDF →</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-amber-500/20 flex flex-wrap items-center justify-between gap-2">
            <span className="text-[11px] text-amber-300/90 font-medium">
              ⚡ In-App PDF Reader with Full Syllabus Notes
            </span>
            <button
              onClick={() => setCurrentView('ebooks')}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-xs cursor-pointer shadow-md transition-all active:scale-95"
            >
              Browse All E-Books ({ebooks.length}) →
            </button>
          </div>
        </div>
      </div>

      {/* 4. Exam-Specific Mock Tests & Attached Lesson PDFs */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
              {t('official_mocks')} <span className="text-blue-600 dark:text-blue-400">{selectedExamName}</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Curated official CBT practice series for {selectedExamName}. Practice full-length mocks, chapter quizzes, and comprehensive study notes.
            </p>
          </div>
          <button
            onClick={() => setCurrentView('mock_tests')}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>{selectedExamName} {t('mock_tests')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {displayMocks.map((test) => {
            const isFree = isTestFreeForStudent(test);

            return (
              <div
                key={test.id}
                className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4 hover:border-blue-500/40 transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300">
                      {test.type === 'chapter_wise' ? t('chapterwise') : test.type === 'section_wise' ? t('sectional') : t('full_length')}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400 font-mono">
                        {test.durationMinutes} mins • {test.questions.length} Qs
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleBookmarkMockTest(test.id);
                        }}
                        className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                          isMockTestBookmarked(test.id)
                            ? 'bg-amber-500/15 text-amber-500 border-amber-500/40'
                            : 'text-slate-400 hover:text-amber-500 border-slate-200 dark:border-slate-800'
                        }`}
                        title={isMockTestBookmarked(test.id) ? "Saved in Bookmarks" : "Bookmark for later practice"}
                      >
                        <Bookmark className={`w-3.5 h-3.5 ${isMockTestBookmarked(test.id) ? 'fill-amber-500 text-amber-500' : ''}`} />
                      </button>
                    </div>
                  </div>

                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white line-clamp-1 group-hover:text-blue-600 transition-colors">
                    {test.title}
                  </h3>
                  
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {test.description}
                  </p>

                  {/* Attached Lesson PDF button banner */}
                  <div className="mt-4 p-2.5 rounded-2xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-500/20 text-xs flex items-center justify-between text-blue-950 dark:text-blue-200">
                    <div className="flex items-center gap-1.5 truncate pr-2">
                      <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                      <span className="truncate font-semibold">{test.attachedPdf.title}</span>
                    </div>
                    <button
                      onClick={() => openPdfReader(test)}
                      className="shrink-0 px-2 py-1 rounded-lg bg-blue-600 text-white font-bold text-[10px] hover:bg-blue-500 cursor-pointer"
                    >
                      {t('read_pdf_first')}
                    </button>
                  </div>
                </div>

                {/* Action Buttons: START TEST IN BLUE */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                  <button
                    onClick={() => setSegmentTargetTest(test)}
                    className="flex-1 py-2 px-3 rounded-xl border border-blue-500/40 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>{t('custom_segment')}</span>
                  </button>

                  <button
                    onClick={() => {
                      if (isFree || currentUser.subscription.active) {
                        setSegmentTargetTest(test);
                      } else {
                        setSubscriptionModalOpen(true);
                      }
                    }}
                    className="flex-1 py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-md bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/25 transition-all cursor-pointer active:scale-95"
                  >
                    {isFree || currentUser.subscription.active ? (
                      <>
                        <Zap className="w-3.5 h-3.5" />
                        <span>{t('start_test')}</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5" />
                        <span>{t('unlock_pass')}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Live Scheduled Tests Section (All-India Live CBT with Timings) */}
      {liveTests && liveTests.length > 0 && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
                </span>
                <span className="text-xs font-black uppercase tracking-wider text-rose-600 dark:text-rose-400">
                  All-India Live CBT Tests
                </span>
              </div>
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white mt-0.5">
                Scheduled Live Tests & All-India Rankings
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Compete live with thousands of aspirants nationwide. Real TCS iON interface & instantaneous national percentile ranking.
              </p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-bold border border-rose-300 dark:border-rose-800">
              🔴 Live Window Active
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {liveTests.map((lt) => {
              const startDate = new Date(lt.scheduledStartTime);
              const formattedTime = startDate.toLocaleString('en-IN', {
                dateStyle: 'medium',
                timeStyle: 'short'
              });

              return (
                <div
                  key={lt.id}
                  className="bg-white dark:bg-slate-900 rounded-3xl p-5 border-2 border-rose-500/20 shadow-lg shadow-rose-500/5 hover:border-rose-500/50 transition-all space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-extrabold px-2.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 flex items-center gap-1">
                      <Radio className="w-3 h-3 text-rose-600 animate-pulse" /> {lt.status}
                    </span>
                    <span className="text-xs font-mono text-slate-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-blue-500" /> {lt.durationMinutes} Mins • {lt.totalMarks} Marks
                    </span>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white leading-snug">
                      {lt.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                      {lt.description}
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-medium">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      <span>Scheduled: <strong>{formattedTime}</strong></span>
                    </div>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold text-[11px]">
                      👥 {lt.participantsCount.toLocaleString()} Candidates Registered
                    </span>
                  </div>

                  <div className="pt-2 flex items-center gap-2">
                    <button
                      onClick={() => {
                        const matchingMock = mockTests.find(m => m.examName === lt.examName) || mockTests[0];
                        if (matchingMock) {
                          startFullMockTest(matchingMock);
                        }
                      }}
                      className="w-full py-2.5 px-4 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white rounded-xl font-extrabold text-xs shadow-md shadow-rose-600/25 flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-95"
                    >
                      <Zap className="w-4 h-4" />
                      <span>Enter Live Test Arena</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Free Daily Current Affairs Section (In Short, Written by Admin or with Attached PDF) */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                100% Free
              </span>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                Daily & Monthly Capsules
              </span>
            </div>
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white mt-0.5">
              Free Current Affairs in Short (Written & Curated by Admin)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Exam-oriented short bullet points and downloadable PDF capsules for SSC, Railway, State PSC & Banking exams.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {currentAffairs && currentAffairs.map(item => (
            <div 
              key={item.id}
              className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-3 hover:border-blue-400/50 transition-colors"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                    {item.category}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {item.date}
                  </span>
                </div>

                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white line-clamp-2">
                  {item.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                  {item.summary}
                </p>

                {/* Short bullet points */}
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Key Highlights in Short:
                  </span>
                  {item.bulletPoints.slice(0, 3).map((bp, i) => (
                    <div key={i} className="flex items-start gap-1.5 leading-snug">
                      <span className="text-blue-500 font-bold shrink-0">•</span>
                      <span className="line-clamp-2 text-[11px]">{bp}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> High-Yield Fact
                </span>

                <button
                  type="button"
                  onClick={() => {
                    const genericPdf = mockTests[0]?.attachedPdf;
                    if (genericPdf) {
                      openPdfReader({
                        id: item.id,
                        title: item.title,
                        category: item.category,
                        examName: 'Current Affairs Capsule',
                        description: item.summary,
                        type: 'section_wise',
                        durationMinutes: 10,
                        totalMarks: 20,
                        totalQuestions: 5,
                        sections: ['Current Affairs'],
                        attachedPdf: {
                          title: item.title + ' (PDF Capsule)',
                          pagesCount: 6,
                          readTimeMinutes: 5,
                          summary: item.summary,
                          contentMarkdown: `# ${item.title}\n\n${item.summary}\n\n### Key Exam Facts:\n${item.bulletPoints.map(b => `- ${b}`).join('\n')}`,
                          pdfDataUrl: item.pdfDataUrl,
                          fileName: item.fileName
                        },
                        questions: [],
                        cutoffMarks: { general: 15, obc: 13, sc_st: 10, ews: 12 },
                        attemptsCount: 1500,
                        avgScore: 16
                      });
                    }
                  }}
                  className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Read Capsule PDF</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Exam Notifications Timeline Section (State-wise & Central-wise by Dates) */}
      <ExamTimelineSection />

      {/* Official Exam Schedule Dates Tracker Facility Modal */}
      <ExamScheduleTrackerModal
        isOpen={scheduleTrackerOpen}
        onClose={() => setScheduleTrackerOpen(false)}
      />

      {/* Segment Customizer Modal */}
      <SegmentModal
        test={segmentTargetTest}
        isOpen={!!segmentTargetTest}
        onClose={() => setSegmentTargetTest(null)}
      />

    </div>
  );
};
