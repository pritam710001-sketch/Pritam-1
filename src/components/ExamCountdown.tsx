import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Clock, 
  Calendar, 
  Flame, 
  Sparkles, 
  ArrowRight, 
  Target, 
  Bell, 
  CheckCircle2, 
  ChevronRight,
  Radio,
  Timer
} from 'lucide-react';

interface ExamCountdownProps {
  compact?: boolean;
}

export const ExamCountdown: React.FC<ExamCountdownProps> = ({ compact = false }) => {
  const { 
    selectedExamName, 
    setSelectedExamName, 
    adminExams, 
    notificationsTimeline, 
    setCurrentView 
  } = useApp();

  // Known exam dates mapping (defaults to accurate 2026 upcoming schedule)
  const examDatesMap: Record<string, string> = useMemo(() => {
    const map: Record<string, string> = {
      'SSC CGL 2026 Tier-1': '2026-10-18T09:00:00',
      'RRB NTPC CEN 2026': '2026-11-05T09:00:00',
      'IBPS PO Prelims 2026': '2026-10-24T09:00:00',
      'WBPSC Clerkship 2026': '2026-10-26T10:00:00',
      'BPSC Combined Competitive Exam': '2026-12-14T10:00:00',
      'UPPSC Review Officer (RO/ARO)': '2026-11-15T09:30:00'
    };

    // Also pull from notificationsTimeline if matches
    notificationsTimeline.forEach(notif => {
      if (notif.examDate) {
        map[notif.examName] = `${notif.examDate}T09:00:00`;
      }
    });

    return map;
  }, [notificationsTimeline]);

  // Target exam date calculation with robust fallback for non-ISO strings
  const targetDate = useMemo(() => {
    const raw = examDatesMap[selectedExamName];
    if (raw) {
      const parsed = new Date(raw);
      if (!isNaN(parsed.getTime())) return parsed;
      // Try appending 2026 if year is missing
      const withYear = new Date(`${raw} 2026`);
      if (!isNaN(withYear.getTime())) return withYear;
    }
    // Safe fallback: 42 days from now
    return new Date(Date.now() + 42 * 24 * 60 * 60 * 1000);
  }, [selectedExamName, examDatesMap]);

  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    totalMs: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0, totalMs: 0 });

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date().getTime();
      const difference = targetDate.getTime() - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, totalMs: 0 });
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds, totalMs: difference });
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const formattedDate = useMemo(() => {
    return targetDate.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }, [targetDate]);

  if (compact) {
    return (
      <div className="flex items-center gap-2 bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 px-3 py-1.5 rounded-xl border border-blue-500/30 text-white text-xs shadow-md">
        <Radio className="w-3.5 h-3.5 text-rose-500 animate-pulse shrink-0" />
        <span className="font-extrabold text-[11px] text-blue-200">
          {selectedExamName} in:
        </span>
        <div className="flex items-center gap-1 font-mono font-black text-amber-300">
          <span className="bg-white/10 px-1.5 py-0.5 rounded text-[11px]">{timeLeft.days}d</span>:
          <span className="bg-white/10 px-1.5 py-0.5 rounded text-[11px]">{String(timeLeft.hours).padStart(2, '0')}h</span>:
          <span className="bg-white/10 px-1.5 py-0.5 rounded text-[11px]">{String(timeLeft.minutes).padStart(2, '0')}m</span>:
          <span className="bg-white/10 px-1.5 py-0.5 rounded text-[11px] text-rose-400">{String(timeLeft.seconds).padStart(2, '0')}s</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 text-white p-5 sm:p-7 border border-blue-500/30 shadow-2xl">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        
        {/* Left Side: Exam Target Details & Switcher */}
        <div className="space-y-3 max-w-xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-black tracking-wider uppercase">
              <Radio className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
              Official Exam Countdown
            </span>
            <span className="text-xs font-bold text-blue-200/90 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-blue-400" />
              Target Date: <strong className="text-white underline decoration-blue-400 underline-offset-4">{formattedDate}</strong>
            </span>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight leading-tight flex items-center gap-2">
              <Timer className="w-6 h-6 text-sky-400 shrink-0" />
              <span>Countdown to <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-300 to-indigo-200">{selectedExamName}</span></span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
              Every second counts! Prepare with real TCS iON pattern CBT mock tests, sectional quizzes and attached study notes.
            </p>
          </div>

          {/* Quick Exam Switcher Pills for Countdown */}
          <div className="pt-1">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 shrink-0 mr-1">
                Switch Timer:
              </span>
              {adminExams.slice(0, 5).map(ex => {
                const isSelected = selectedExamName === ex.name;
                return (
                  <button
                    key={ex.id}
                    type="button"
                    onClick={() => setSelectedExamName(ex.name)}
                    className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1 ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-md ring-1 ring-blue-300'
                        : 'bg-white/10 hover:bg-white/20 text-slate-300 border border-white/10'
                    }`}
                  >
                    <Target className={`w-3 h-3 ${isSelected ? 'text-white' : 'text-blue-400'}`} />
                    <span>{ex.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side: Big Digital Countdown Clock Display */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="grid grid-cols-4 gap-2 sm:gap-3 text-center w-full sm:w-auto">
            
            {/* Days Box */}
            <div className="bg-slate-900/90 border border-blue-500/30 rounded-2xl p-2.5 sm:p-3.5 min-w-[70px] sm:min-w-[85px] shadow-lg relative overflow-hidden group">
              <div className="text-2xl sm:text-4xl font-black font-mono text-white tracking-tight group-hover:scale-105 transition-transform">
                {String(timeLeft.days).padStart(2, '0')}
              </div>
              <div className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-sky-400 mt-1">
                Days
              </div>
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-500 to-blue-500" />
            </div>

            {/* Hours Box */}
            <div className="bg-slate-900/90 border border-blue-500/30 rounded-2xl p-2.5 sm:p-3.5 min-w-[70px] sm:min-w-[85px] shadow-lg relative overflow-hidden group">
              <div className="text-2xl sm:text-4xl font-black font-mono text-white tracking-tight group-hover:scale-105 transition-transform">
                {String(timeLeft.hours).padStart(2, '0')}
              </div>
              <div className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-sky-400 mt-1">
                Hours
              </div>
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
            </div>

            {/* Minutes Box */}
            <div className="bg-slate-900/90 border border-blue-500/30 rounded-2xl p-2.5 sm:p-3.5 min-w-[70px] sm:min-w-[85px] shadow-lg relative overflow-hidden group">
              <div className="text-2xl sm:text-4xl font-black font-mono text-white tracking-tight group-hover:scale-105 transition-transform">
                {String(timeLeft.minutes).padStart(2, '0')}
              </div>
              <div className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-sky-400 mt-1">
                Minutes
              </div>
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500" />
            </div>

            {/* Seconds Box with Pulsing Glow */}
            <div className="bg-slate-900/90 border border-rose-500/40 rounded-2xl p-2.5 sm:p-3.5 min-w-[70px] sm:min-w-[85px] shadow-lg relative overflow-hidden group">
              <div className="text-2xl sm:text-4xl font-black font-mono text-rose-400 tracking-tight animate-pulse">
                {String(timeLeft.seconds).padStart(2, '0')}
              </div>
              <div className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-rose-400 mt-1">
                Seconds
              </div>
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 to-amber-500" />
            </div>
          </div>

          {/* Action Button */}
          <div className="flex sm:flex-col gap-2 w-full sm:w-auto">
            <button
              onClick={() => setCurrentView('mock_tests')}
              className="flex-1 sm:flex-none px-4 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 whitespace-nowrap"
            >
              <span>Practice Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentView('notifications')}
              className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/15 flex items-center justify-center gap-1 cursor-pointer transition-colors"
              title="View full official exam calendar and notifications"
            >
              <Calendar className="w-3.5 h-3.5 text-blue-300" />
              <span>Full Dates</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
