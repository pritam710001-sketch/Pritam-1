import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { INDIAN_LANGUAGES } from '../utils/languageData';
import { 
  Award, 
  BookOpen, 
  BarChart2, 
  Bell, 
  FileText, 
  ShieldCheck, 
  Sun, 
  Moon, 
  Crown, 
  Zap, 
  UserCheck,
  Calendar,
  Sparkles,
  Laptop,
  ChevronDown,
  Globe,
  Maximize,
  Minimize,
  Target,
  Check,
  Search
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    currentView, 
    setCurrentView, 
    darkMode, 
    toggleDarkMode, 
    currentUser, 
    userTier,
    isAdminAuthenticated,
    adminGmail,
    setGoogleLoginModalOpen,
    setSubscriptionModalOpen,
    adminExams,
    selectedExamName,
    setSelectedExamName,
    language,
    setLanguage,
    t
  } = useApp();

  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [examMenuOpen, setExamMenuOpen] = useState(false);
  const [examSearchQuery, setExamSearchQuery] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);

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

  const filteredExams = adminExams.filter(e => 
    e.name.toLowerCase().includes(examSearchQuery.toLowerCase()) ||
    e.category.toLowerCase().includes(examSearchQuery.toLowerCase())
  );

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      
      {/* Top Banner Alert in Blue */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white text-xs font-medium py-1.5 px-4 text-center flex flex-wrap items-center justify-center gap-2 shadow-inner">
        <span className="flex h-2 w-2 relative shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-300 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
        </span>
        <span>
          🎯 <strong>Special Pass:</strong> ₹2 for 7-Day Trial (Max 1 Device in 3 Months) • ₹49 for All Exams (1 Month) • ₹199 for 6 Months (★ Most Popular) • ₹399 for 1-Year Pass!
        </span>
        <button 
          onClick={() => setSubscriptionModalOpen(true)}
          className="underline font-bold hover:text-blue-100 transition-colors cursor-pointer"
        >
          View Plans →
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Modern Stylish Exam Selector */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <button 
              onClick={() => setCurrentView('dashboard')}
              className="flex items-center gap-2.5 text-left focus:outline-none cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform text-white font-black text-xl tracking-tighter">
                US
              </div>
              <div className="hidden sm:block">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 dark:text-white">
                    UPTO <span className="text-blue-600 dark:text-blue-400">SELECTION</span>
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 border border-blue-300 dark:border-blue-700">
                    TCS iON
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                  Competitive Exam Mock Test Platform
                </p>
              </div>
            </button>

            {/* Modern Stylish Exam Chooser Pill & Dropdown (Visible on all screens) */}
            <div className="relative pl-1 sm:pl-2">
              <button
                type="button"
                onClick={() => {
                  setExamMenuOpen(prev => !prev);
                  setLangMenuOpen(false);
                }}
                className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-xl bg-blue-50/90 dark:bg-blue-950/70 hover:bg-blue-100 dark:hover:bg-blue-900/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 shadow-sm transition-all cursor-pointer group active:scale-95"
                title="Target Examination (Click to switch)"
              >
                <div className="w-5 h-5 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
                  <Target className="w-3 h-3 group-hover:rotate-45 transition-transform" />
                </div>
                <div className="text-left flex flex-col justify-center">
                  <span className="text-[8px] font-black uppercase text-blue-600/80 dark:text-blue-400/80 leading-none">
                    Target Exam
                  </span>
                  <span className="font-black text-xs text-slate-900 dark:text-white truncate max-w-[110px] sm:max-w-[170px] lg:max-w-[210px] leading-tight">
                    {selectedExamName}
                  </span>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-blue-500 ml-0.5 transition-transform duration-200 shrink-0 ${examMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Stylish Modern Floating Exam Dropdown */}
              {examMenuOpen && (
                <div 
                  className="absolute left-0 mt-2 w-72 sm:w-88 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-2.5 z-50 animate-in fade-in zoom-in-95 duration-100"
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
                            setExamMenuOpen(false);
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

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => setCurrentView('dashboard')}
              className={`px-3 py-1.5 rounded-lg text-xs lg:text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                currentView === 'dashboard'
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>{t('dashboard')}</span>
            </button>

            <button
              onClick={() => setCurrentView('mock_tests')}
              className={`px-3 py-1.5 rounded-lg text-xs lg:text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                currentView === 'mock_tests'
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>{t('mock_tests')}</span>
            </button>

            <button
              onClick={() => setCurrentView('analytics')}
              className={`px-3 py-1.5 rounded-lg text-xs lg:text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                currentView === 'analytics'
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <BarChart2 className="w-4 h-4" />
              <span>{t('analytics')}</span>
            </button>

            <button
              onClick={() => setCurrentView('notifications')}
              className={`px-3 py-1.5 rounded-lg text-xs lg:text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                currentView === 'notifications'
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>{t('notifications')}</span>
            </button>

            <button
              onClick={() => setCurrentView('teach_with_us')}
              className={`px-3 py-1.5 rounded-lg text-xs lg:text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                currentView === 'teach_with_us'
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                  : 'text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/30'
              }`}
              title="Teach with us and earn up to ₹1 Lakh/month + win laptops/phones"
            >
              <Laptop className="w-4 h-4" />
              <span>{t('teach_with_us')}</span>
            </button>

            <button
              onClick={() => setCurrentView('ebooks')}
              className={`px-3 py-1.5 rounded-lg text-xs lg:text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                currentView === 'ebooks'
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>{t('ebooks')}</span>
            </button>

            {/* Admin Panel Link */}
            <button
              onClick={() => setCurrentView('admin')}
              className={`px-3 py-1.5 rounded-lg text-xs lg:text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                currentView === 'admin'
                  ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-950/60 dark:border-blue-800 dark:text-blue-300'
                  : 'border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title="Admin Panel (Secured with Admin Credentials)"
            >
              <ShieldCheck className="w-4 h-4 text-blue-500" />
              <span>{t('admin_portal')}</span>
            </button>
          </nav>

          {/* Right Action buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* User Level Tier Badge (Green/Emerald for Gold) */}
            <button
              onClick={() => setCurrentView('teach_with_us')}
              className={`hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-black cursor-pointer border ${
                userTier === 'Gold'
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-700'
                  : userTier === 'Silver'
                  ? 'bg-slate-100 text-slate-800 border-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-600'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400'
              }`}
              title="Click to view Tier Rewards & Teach With Us program"
            >
              <span>{userTier === 'Gold' ? '🥇 Gold' : userTier === 'Silver' ? '🥈 Silver' : '🥉 Bronze'}</span>
            </button>

            {/* 10 Indian Languages Selector with Adjusted Full Screen Option */}
            <div className="flex items-center rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-0.5">
              <div className="relative">
                <button
                  onClick={() => setLangMenuOpen(prev => !prev)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors cursor-pointer"
                  title="Select from 10 Indian Languages"
                >
                  <Globe className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span className="font-extrabold text-[11px]">
                    {INDIAN_LANGUAGES.find(l => l.code === language)?.nativeName || 'English'}
                  </span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {langMenuOpen && (
                  <div 
                    className="absolute right-0 mt-1.5 w-52 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100 max-h-80 overflow-y-auto"
                    onClick={() => setLangMenuOpen(false)}
                  >
                    <div className="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800">
                      10 Indian Languages (भाषा)
                    </div>
                    {INDIAN_LANGUAGES.map(langItem => (
                      <button
                        key={langItem.code}
                        onClick={() => setLanguage(langItem.code)}
                        className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between transition-colors cursor-pointer ${
                          language === langItem.code
                            ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-extrabold'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold text-[10px] flex items-center justify-center">
                            {langItem.flagLetter}
                          </span>
                          <span>{langItem.nativeName}</span>
                        </div>
                        <span className="text-[10px] text-slate-400">{langItem.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Full Screen Option adjusted right to Language Box */}
              <button
                onClick={toggleFullscreen}
                className="p-1.5 rounded-lg text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer border-l border-slate-200 dark:border-slate-700"
                title={isFullscreen ? "Exit Full Screen" : "Adjusted Full Screen Mode"}
                aria-label="Toggle Full Screen"
              >
                {isFullscreen ? (
                  <Minimize className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                ) : (
                  <Maximize className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              title={darkMode ? "Switch to Light Mode" : "Switch to Night Mode"}
              aria-label="Toggle theme"
            >
              {darkMode ? <Sun className="w-4 h-4 text-emerald-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            {/* Pass Subscription Button */}
            {currentUser.subscription.active ? (
              <button
                onClick={() => setSubscriptionModalOpen(true)}
                className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-700 dark:text-blue-400 font-bold text-xs cursor-pointer"
              >
                <Crown className="w-3.5 h-3.5 text-emerald-500" />
                <span>{currentUser.subscription.daysRemaining}d Pass Left</span>
              </button>
            ) : (
              <button
                onClick={() => setSubscriptionModalOpen(true)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs cursor-pointer shadow-md shadow-blue-600/20 active:scale-95"
              >
                <Crown className="w-3.5 h-3.5" />
                <span>Start 7-Day Trial</span>
              </button>
            )}

            {/* Student Login / Account profile button */}
            <button
              onClick={() => setGoogleLoginModalOpen(true)}
              className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-800 dark:text-white transition-colors cursor-pointer"
              title="Student Sign In / Account Profile"
            >
              <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-[11px]">
                {currentUser.name.charAt(0)}
              </div>
              <span className="hidden sm:inline truncate max-w-[100px]">{currentUser.name.split(' ')[0]}</span>
            </button>

          </div>

        </div>

        {/* Mobile Navigation Bar */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-slate-200 dark:border-slate-800 text-[11px]">
          <button
            onClick={() => setCurrentView('dashboard')}
            className={`flex flex-col items-center ${currentView === 'dashboard' ? 'text-blue-600 font-bold' : 'text-slate-500'}`}
          >
            <Zap className="w-4 h-4" />
            <span>Home</span>
          </button>
          <button
            onClick={() => setCurrentView('mock_tests')}
            className={`flex flex-col items-center ${currentView === 'mock_tests' ? 'text-blue-600 font-bold' : 'text-slate-500'}`}
          >
            <FileText className="w-4 h-4" />
            <span>Mocks</span>
          </button>
          <button
            onClick={() => setCurrentView('notifications')}
            className={`flex flex-col items-center ${currentView === 'notifications' ? 'text-blue-600 font-bold' : 'text-slate-500'}`}
          >
            <Calendar className="w-4 h-4" />
            <span>Dates</span>
          </button>
          <button
            onClick={() => setCurrentView('teach_with_us')}
            className={`flex flex-col items-center ${currentView === 'teach_with_us' ? 'text-emerald-500 font-bold' : 'text-slate-500'}`}
          >
            <Laptop className="w-4 h-4" />
            <span>Teach</span>
          </button>
          <button
            onClick={() => setCurrentView('admin')}
            className={`flex flex-col items-center ${currentView === 'admin' ? 'text-blue-600 font-bold' : 'text-slate-500'}`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Admin</span>
          </button>
        </div>

      </div>
    </header>
  );
};
