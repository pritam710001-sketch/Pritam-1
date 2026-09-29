/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { MockTestsList } from './components/MockTestsList';
import { MockTestPlayer } from './components/MockTestPlayer';
import { PerformanceAnalytics } from './components/PerformanceAnalytics';
import { EBooksLibrary } from './components/EBooksLibrary';
import { AdminPanel } from './components/AdminPanel';
import { TeachWithUs } from './components/TeachWithUs';
import { ExamTimelineSection } from './components/ExamTimelineSection';
import { SubscriptionModal } from './components/SubscriptionModal';
import { PaymentModal } from './components/PaymentModal';
import { PdfReaderModal } from './components/PdfReaderModal';
import { GoogleLoginModal } from './components/GoogleLoginModal';
import { ImageToPdfModal } from './components/ImageToPdfModal';
import { 
  ShieldCheck, 
  Award, 
  Crown, 
  BookOpen, 
  CheckCircle2, 
  Mail, 
  Phone,
  Layers,
  Laptop,
  Maximize,
  X
} from 'lucide-react';

const AppContent: React.FC = () => {
  const { currentView, activeTest, activeSegmentConfig, setSubscriptionModalOpen, setCurrentView } = useApp();

  // 5-second notification on website open for full screen facility
  const [showFullscreenNotice, setShowFullscreenNotice] = React.useState(true);
  const [fullscreenSecondsLeft, setFullscreenSecondsLeft] = React.useState(5);

  React.useEffect(() => {
    // If already in full screen, do not show notification
    if (typeof document !== 'undefined' && document.fullscreenElement) {
      setShowFullscreenNotice(false);
      return;
    }

    const interval = setInterval(() => {
      setFullscreenSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setShowFullscreenNotice(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleAdjustFullScreen = () => {
    try {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      }
    } catch (e) {
      console.log('Fullscreen error:', e);
    }
    setShowFullscreenNotice(false);
  };

  // If inside active mock test player, render the test in real exam fullscreen pattern
  if (currentView === 'active_test' && activeTest) {
    return (
      <main className="min-h-screen">
        <MockTestPlayer test={activeTest} segmentConfig={activeSegmentConfig} />
        <PdfReaderModal />
      </main>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* 5-Second Website Open Notification for Full Screen Facility (Compact & Little) */}
      {showFullscreenNotice && (
        <div className="fixed top-18 right-3 sm:right-6 z-50 animate-in slide-in-from-top-3 fade-in duration-300 max-w-sm sm:max-w-md shadow-2xl">
          <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-2.5 sm:p-3 rounded-2xl border border-blue-500/40 shadow-2xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-blue-600/30 text-blue-400 border border-blue-500/40 flex items-center justify-center shrink-0">
                <Maximize className="w-4 h-4 animate-pulse" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-extrabold text-white">
                    Full Screen Exam Mode
                  </span>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    {fullscreenSecondsLeft}s
                  </span>
                </div>
                <p className="text-[10px] text-slate-300 truncate">
                  Experience real TCS iON exam simulation in full screen.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={handleAdjustFullScreen}
                className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-black text-[11px] shadow-sm flex items-center gap-1 cursor-pointer transition-all active:scale-95 whitespace-nowrap"
                title="Adjust to Full Screen"
              >
                <Maximize className="w-3 h-3" />
                <span>Adjust to Full Screen</span>
              </button>
              <button
                type="button"
                onClick={() => setShowFullscreenNotice(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Dismiss"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Navigation */}
      <Navbar />

      {/* Main View Router */}
      <main className="flex-1">
        {currentView === 'dashboard' && <Dashboard />}
        {currentView === 'mock_tests' && <MockTestsList />}
        {currentView === 'analytics' && <PerformanceAnalytics />}
        {currentView === 'notifications' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-200">
            <ExamTimelineSection />
          </div>
        )}
        {currentView === 'teach_with_us' && <TeachWithUs />}
        {currentView === 'ebooks' && <EBooksLibrary />}
        {currentView === 'admin' && <AdminPanel />}
      </main>

      {/* Global Modals */}
      <SubscriptionModal />
      <PaymentModal />
      <PdfReaderModal />
      <GoogleLoginModal />
      <ImageToPdfModal />

      {/* Footer */}
      <footer className="mt-16 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 py-12 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white font-extrabold text-sm flex items-center justify-center">
                  US
                </div>
                <span className="font-extrabold text-base text-slate-900 dark:text-white">
                  UPTO <span className="text-blue-600 dark:text-blue-400">SELECTION</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                India's premier competitive examination preparation platform. Real TCS iON pattern mock tests, protected in-app PDF lesson notes, 10 to 50 Qs custom segments & 7-part deep analytics.
              </p>
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-xs">
                <Award className="w-4 h-4" />
                <span>1 Lakh+ Students Selected Across India</span>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-slate-800 dark:text-white mb-3 uppercase tracking-wider text-[11px]">
                Target Examinations
              </h4>
              <ul className="space-y-2">
                <li><span className="hover:text-blue-600 transition-colors">SSC CGL, CHSL, MTS & GD</span></li>
                <li><span className="hover:text-blue-600 transition-colors">Railway RRB NTPC, Group D & ALP</span></li>
                <li><span className="hover:text-blue-600 transition-colors">State PSC (WBPSC, BPSC, UPPSC)</span></li>
                <li><span className="hover:text-blue-600 transition-colors">Banking IBPS PO, Clerk, SBI PO</span></li>
                <li><span className="hover:text-blue-600 transition-colors">Defence NDA, CDS & AFCAT</span></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-800 dark:text-white mb-3 uppercase tracking-wider text-[11px]">
                Tier Rewards & Teaching
              </h4>
              <ul className="space-y-2">
                <li>
                  <button onClick={() => setCurrentView('teach_with_us')} className="hover:text-blue-600 text-left cursor-pointer">
                    🥉 Bronze, 🥈 Silver & 🥇 Gold Tiers
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentView('teach_with_us')} className="hover:text-blue-600 text-left font-bold text-emerald-500 cursor-pointer flex items-center gap-1">
                    <Laptop className="w-3.5 h-3.5" />
                    <span>Win Laptop & Phone Gifts</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentView('teach_with_us')} className="hover:text-blue-600 text-left font-bold text-emerald-600 cursor-pointer">
                    Teach With Us (Earn up to ₹1 Lakh/month)
                  </button>
                </li>
                <li><span className="text-slate-400">100+ Teachers Currently Earning</span></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-800 dark:text-white mb-3 uppercase tracking-wider text-[11px]">
                Subscription Pass (365 Days)
              </h4>
              <ul className="space-y-2">
                <li><span className="font-semibold text-blue-600">7-Day Free Trial (1 Device Allowed)</span></li>
                <li><span className="font-semibold text-blue-600">₹49 Single Exam Pass</span></li>
                <li><span className="font-semibold text-blue-600">₹199 All Exams (6 Months)</span></li>
                <li><span className="font-semibold text-blue-600">₹399 Full Year (365 Days)</span></li>
                <li className="pt-1 flex items-center gap-1.5 text-slate-400">
                  <Mail className="w-3.5 h-3.5" /> support@uptoselection.in
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <p className="text-slate-400 text-xs">
              © 2026 UPTO SELECTION. &ldquo;1 lakh+ students have already cleared their exams using this platform for last 5 years across India&rdquo;.
            </p>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1 text-blue-600">
                <ShieldCheck className="w-4 h-4" /> SSL Encrypted & Verified
              </span>
              <span>Made with dedication for Indian Aspirants 🇮🇳</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
