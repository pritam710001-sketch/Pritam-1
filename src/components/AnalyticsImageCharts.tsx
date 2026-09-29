import React, { useState } from 'react';
import { 
  Award, 
  Target, 
  Zap, 
  Clock, 
  AlertTriangle, 
  Compass, 
  BarChart3, 
  PieChart, 
  Users, 
  TrendingUp, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  BookOpen, 
  ChevronRight, 
  Flame, 
  Layers, 
  Sparkles,
  Trophy,
  Gauge,
  Activity,
  ArrowRight,
  Info
} from 'lucide-react';
import { MockTest, ExamAttempt, Question } from '../types';

/* =========================================================================
   PART 1: OVERALL SCORECARD IMAGE GRAPH CHART (WHITE THEME)
   ========================================================================= */
interface ScorecardImageChartProps {
  attempt: ExamAttempt;
  currentMock?: MockTest;
  grossMarks: number;
  negativePenaltyTotal: number;
  userCategory?: 'general' | 'obc' | 'sc_st' | 'ews';
  onCategoryChange?: (category: 'general' | 'obc' | 'sc_st' | 'ews') => void;
  activeCutoff?: number;
  isCutoffCleared?: boolean;
}

export const ScorecardImageChart: React.FC<ScorecardImageChartProps> = ({
  attempt,
  currentMock,
  grossMarks,
  negativePenaltyTotal,
  userCategory = 'general',
  onCategoryChange,
  activeCutoff,
  isCutoffCleared,
}) => {
  const totalPossible = attempt.totalMarks || 200;
  const cutoffGeneral = currentMock?.cutoffMarks?.general || 135;
  const cutoffObc = currentMock?.cutoffMarks?.obc || 128;
  const cutoffScSt = currentMock?.cutoffMarks?.sc_st || 115;
  const cutoffEws = currentMock?.cutoffMarks?.ews || 124;

  const currentCutoff = activeCutoff !== undefined 
    ? activeCutoff 
    : (userCategory === 'general' ? cutoffGeneral : userCategory === 'obc' ? cutoffObc : userCategory === 'sc_st' ? cutoffScSt : cutoffEws);

  const cleared = isCutoffCleared !== undefined ? isCutoffCleared : (attempt.score >= currentCutoff);

  const scorePct = Math.min(100, Math.max(0, (attempt.score / totalPossible) * 100));
  const cutoffPct = Math.min(100, Math.max(0, (currentCutoff / totalPossible) * 100));
  const grossPct = Math.min(100, Math.max(0, (grossMarks / totalPossible) * 100));
  const penaltyPct = Math.min(100, Math.max(0, (negativePenaltyTotal / totalPossible) * 100));

  // Circular Dial calculation (r=75 => C = 2 * PI * 75 ≈ 471.24)
  const radius = 75;
  const circ = 2 * Math.PI * radius;
  const scoreStrokeDash = (scorePct / 100) * circ;
  const cutoffStrokeDash = (cutoffPct / 100) * circ;

  return (
    <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
              <Award className="w-5 h-5" />
            </span>
            <h3 className="font-black text-lg text-slate-900 dark:text-white tracking-tight">
              Part 1: Overall Scorecard & Diagnostic Image Graph Chart
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Visual vector decomposition of gross marks, negative penalty impact, and qualifying cutoff clearance.
          </p>
        </div>

        {/* Category Chooser Little Box for Cutoff */}
        <div className="flex items-center gap-2">
          {onCategoryChange && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
              <Target className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
              <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">Category:</span>
              <select
                value={userCategory}
                onChange={(e) => onCategoryChange(e.target.value as any)}
                className="bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-extrabold text-[11px] px-2 py-0.5 rounded border border-slate-300 dark:border-slate-600 outline-none cursor-pointer"
              >
                <option value="general">General / UR (Cutoff: {cutoffGeneral})</option>
                <option value="obc">OBC (Cutoff: {cutoffObc})</option>
                <option value="sc_st">SC / ST (Cutoff: {cutoffScSt})</option>
                <option value="ews">EWS (Cutoff: {cutoffEws})</option>
              </select>
            </div>
          )}

          <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${
            cleared
              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
              : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800'
          }`}>
            {cleared ? '🎉 Cutoff Cleared' : `⚠️ Below ${userCategory.toUpperCase()} Cutoff`}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left: Dual Radial Score Dial Gauge */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200/80 dark:border-slate-700">
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3">
            Score Achievement Gauge
          </span>

          <div className="relative w-56 h-56 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
              <defs>
                <linearGradient id="scoreGradLight" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#2563eb" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
                <linearGradient id="cutoffGradLight" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#ef4444" />
                </linearGradient>
              </defs>

              {/* Background Track Circle (Light Gray) */}
              <circle
                cx="100"
                cy="100"
                r={radius}
                fill="transparent"
                stroke="#e2e8f0"
                strokeWidth="14"
                className="dark:stroke-slate-700"
              />

              {/* Target Cutoff Reference Arc */}
              <circle
                cx="100"
                cy="100"
                r={radius}
                fill="transparent"
                stroke="url(#cutoffGradLight)"
                strokeWidth="14"
                strokeDasharray={`${cutoffStrokeDash} ${circ}`}
                strokeDashoffset="0"
                strokeLinecap="round"
                opacity="0.3"
              />

              {/* User Score Arc */}
              <circle
                cx="100"
                cy="100"
                r={radius}
                fill="transparent"
                stroke="url(#scoreGradLight)"
                strokeWidth="14"
                strokeDasharray={`${scoreStrokeDash} ${circ}`}
                strokeDashoffset="0"
                strokeLinecap="round"
                className="transition-all duration-1000"
              />
            </svg>

            {/* Inner Center Display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-3xl sm:text-4xl font-black font-mono text-slate-900 dark:text-white tracking-tight">
                {attempt.score}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                out of {totalPossible}
              </span>
              <div className="mt-1 flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                <span>{scorePct.toFixed(1)}% Marks</span>
              </div>
            </div>
          </div>

          {/* Dial Legend */}
          <div className="grid grid-cols-2 gap-3 w-full mt-4 pt-3 border-t border-slate-200 dark:border-slate-700 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-600 to-emerald-500 shrink-0" />
              <span className="text-slate-600 dark:text-slate-300">Your Score: <strong>{attempt.score}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-500 shrink-0" />
              <span className="text-slate-600 dark:text-slate-300">Cutoff ({userCategory.toUpperCase()}): <strong>{currentCutoff}</strong></span>
            </div>
          </div>
        </div>

        {/* Right: Score Breakdown Stacked Bar Graph & Cutoff Scale */}
        <div className="lg:col-span-7 space-y-5">
          {/* 1. Score Composition Horizontal Bar Graph */}
          <div className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-700 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-extrabold uppercase text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                Score Decomposition Graph Chart
              </span>
              <span className="font-mono text-slate-500 dark:text-slate-400 text-[11px]">
                Net = Gross ({grossMarks.toFixed(1)}) - Negative ({negativePenaltyTotal.toFixed(1)})
              </span>
            </div>

            {/* Visual Horizontal Stacked Graph */}
            <div className="space-y-1.5">
              <div className="h-7 w-full bg-slate-200 dark:bg-slate-700 rounded-xl overflow-hidden flex relative shadow-inner">
                {/* Gross Positive Marks Portion */}
                <div 
                  className="bg-gradient-to-r from-blue-600 to-emerald-500 h-full flex items-center justify-center text-[11px] font-black text-white px-2 transition-all duration-700"
                  style={{ width: `${Math.max(10, grossPct)}%` }}
                  title={`Gross Positive Marks: +${grossMarks.toFixed(1)}`}
                >
                  +{grossMarks.toFixed(1)} Gross
                </div>
                {/* Negative Marks Deducted Portion */}
                {negativePenaltyTotal > 0 && (
                  <div 
                    className="bg-rose-500 h-full flex items-center justify-center text-[10px] font-black text-white px-1 transition-all duration-700"
                    style={{ width: `${Math.max(5, penaltyPct)}%` }}
                    title={`Negative Penalty: -${negativePenaltyTotal.toFixed(1)}`}
                  >
                    -{negativePenaltyTotal.toFixed(1)}
                  </div>
                )}
                {/* Target Cutoff Vertical Marker Line */}
                <div 
                  className="absolute top-0 bottom-0 w-0.5 bg-amber-500 z-10 shadow"
                  style={{ left: `${cutoffPct}%` }}
                >
                  <div className="absolute -top-5 -translate-x-1/2 bg-amber-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow">
                    Cutoff: {currentCutoff}
                  </div>
                </div>
              </div>

              <div className="flex justify-between text-[10px] text-slate-400 font-mono pt-1">
                <span>0</span>
                <span>50</span>
                <span>100</span>
                <span>150</span>
                <span>{totalPossible} Max Marks</span>
              </div>
            </div>

            {/* 3 Metric Chips */}
            <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs">
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-semibold">Gross Earned</span>
                <strong className="text-emerald-600 dark:text-emerald-400 font-mono text-sm">+{grossMarks.toFixed(1)}</strong>
              </div>
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-semibold">Negative Penalty</span>
                <strong className="text-rose-600 dark:text-rose-400 font-mono text-sm">-{negativePenaltyTotal.toFixed(1)}</strong>
              </div>
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-semibold">Final Net Score</span>
                <strong className="text-blue-600 dark:text-blue-400 font-mono text-sm">{attempt.score}</strong>
              </div>
            </div>
          </div>

          {/* 2. Category Cutoffs Comparative Scale */}
          <div className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-700 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                <Target className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                Category Cutoff Benchmarks Comparison
              </span>
              <span className="text-[10px] font-bold text-slate-400">Target Score: {currentCutoff}</span>
            </div>

            <div className="space-y-2">
              {[
                { key: 'general', cat: 'General / UR', val: cutoffGeneral },
                { key: 'obc', cat: 'OBC Category', val: cutoffObc },
                { key: 'sc_st', cat: 'SC / ST Category', val: cutoffScSt },
                { key: 'ews', cat: 'EWS Category', val: cutoffEws },
              ].map(c => {
                const diff = (attempt.score - c.val).toFixed(1);
                const isAhead = Number(diff) >= 0;
                const widthPct = Math.min(100, Math.max(0, (c.val / totalPossible) * 100));
                const isCurrentChoice = userCategory === c.key;

                return (
                  <div key={c.cat} className={`p-2 rounded-xl transition-all ${isCurrentChoice ? 'bg-white dark:bg-slate-800 border border-blue-500/40 shadow-sm' : ''}`}>
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                        {isCurrentChoice && <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />}
                        <span>{c.cat} (Cutoff: {c.val})</span>
                      </span>
                      <span className={`font-mono font-bold ${isAhead ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                        {isAhead ? `+${diff} Above Cutoff` : `${diff} Below`}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden relative mt-1">
                      <div 
                        className={`h-full rounded-full ${isAhead ? 'bg-emerald-500' : 'bg-rose-500'}`}
                        style={{ width: `${scorePct}%` }}
                      />
                      {/* Cutoff Tick */}
                      <div 
                        className="absolute top-0 bottom-0 w-0.5 bg-slate-900 dark:bg-white z-10" 
                        style={{ left: `${widthPct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


/* =========================================================================
   PART 2: SECTIONAL CUTOFF IMAGE GRAPH CHART (WHITE THEME)
   ========================================================================= */
interface SectionalCutoffImageChartProps {
  attempt: ExamAttempt;
}

export const SectionalCutoffImageChart: React.FC<SectionalCutoffImageChartProps> = ({ attempt }) => {
  const sections = Object.entries(attempt.sectionScores || {});

  return (
    <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
              <Layers className="w-5 h-5" />
            </span>
            <h3 className="font-black text-lg text-slate-900 dark:text-white tracking-tight">
              Part 2: Sectional Cutoff Comparative Column Graph Chart
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Visual column comparison of scored marks vs sectional cutoff baseline across each subject section.
          </p>
        </div>

        <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
          Sectional Cutoff Baseline: 60% of Max Marks
        </span>
      </div>

      {/* Clustered Column Graph Chart */}
      <div className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700 space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-500 pb-2 border-b border-slate-200 dark:border-slate-700">
          <span className="font-extrabold uppercase">Section Performance Columns</span>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-semibold">
              <span className="w-2.5 h-2.5 rounded-sm bg-blue-500" /> Scored Marks
            </span>
            <span className="flex items-center gap-1.5 text-amber-500 font-semibold">
              <span className="w-2.5 h-0.5 bg-amber-500" /> Cutoff Threshold (60%)
            </span>
            <span className="flex items-center gap-1.5 text-slate-400 font-semibold">
              <span className="w-2.5 h-2.5 rounded-sm bg-slate-300 dark:bg-slate-600" /> Total Marks
            </span>
          </div>
        </div>

        {/* Responsive Column Bars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {sections.map(([secName, secData]) => {
            const cutoffMark = Math.round(secData.totalPossible * 0.6);
            const isCleared = secData.score >= cutoffMark;
            const scorePct = Math.min(100, Math.max(0, (secData.score / secData.totalPossible) * 100));
            const cutoffPct = 60; // 60%
            const mins = Math.floor(secData.timeSeconds / 60);
            const secs = secData.timeSeconds % 60;

            return (
              <div 
                key={secName} 
                className={`p-4 rounded-2xl border transition-all ${
                  isCleared 
                    ? 'bg-white dark:bg-slate-900 border-emerald-300 dark:border-emerald-800 shadow-sm' 
                    : 'bg-white dark:bg-slate-900 border-rose-300 dark:border-rose-800 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold text-xs text-slate-900 dark:text-white truncate max-w-[130px]" title={secName}>
                    {secName}
                  </span>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                    isCleared 
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800' 
                      : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800'
                  }`}>
                    {isCleared ? 'Cleared' : 'Missed'}
                  </span>
                </div>

                {/* Vertical Column Graph Representation */}
                <div className="relative h-36 bg-slate-100 dark:bg-slate-950 rounded-xl p-3 flex items-end justify-center border border-slate-200 dark:border-slate-800 overflow-hidden">
                  {/* Dashed Horizontal Cutoff Line */}
                  <div 
                    className="absolute left-0 right-0 border-b-2 border-dashed border-amber-500 z-10"
                    style={{ bottom: `${cutoffPct}%` }}
                  >
                    <span className="absolute -top-3.5 right-1 text-[8.5px] font-mono text-amber-600 dark:text-amber-400 font-bold">
                      Cutoff: {cutoffMark}
                    </span>
                  </div>

                  {/* Scored Bar */}
                  <div className="w-14 relative flex flex-col items-center justify-end h-full">
                    <div 
                      className={`w-full rounded-t-lg transition-all duration-700 flex flex-col items-center justify-start pt-1.5 ${
                        isCleared
                          ? 'bg-gradient-to-t from-emerald-600 to-teal-500 shadow-md shadow-emerald-500/20'
                          : 'bg-gradient-to-t from-rose-600 to-pink-500 shadow-md shadow-rose-500/20'
                      }`}
                      style={{ height: `${scorePct}%` }}
                    >
                      <span className="text-[11px] font-black font-mono text-white drop-shadow">
                        {secData.score}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Meta stats below column */}
                <div className="mt-3 space-y-1 text-xs">
                  <div className="flex justify-between text-slate-500 text-[11px]">
                    <span>Accuracy:</span>
                    <strong className={secData.accuracy >= 75 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}>
                      {secData.accuracy}%
                    </strong>
                  </div>
                  <div className="flex justify-between text-slate-500 text-[11px]">
                    <span>Questions:</span>
                    <strong className="text-slate-800 dark:text-slate-200 font-mono">{secData.correct} Right / {secData.incorrect} Wrong</strong>
                  </div>
                  <div className="flex justify-between text-slate-500 text-[11px]">
                    <span>Time Spent:</span>
                    <strong className="text-blue-600 dark:text-blue-400 font-mono">{mins}m {secs}s</strong>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};


/* =========================================================================
   PART 3: TIME & SPEEDOMETER IMAGE GRAPH CHART (WHITE THEME)
   ========================================================================= */
interface TimeSpeedometerImageChartProps {
  attempt: ExamAttempt;
  questions: Question[];
  avgSpeedSec: number;
  fastCount: number;
  idealCount: number;
  overtimeCount: number;
  timeWastedWrongSec: number;
}

export const TimeSpeedometerImageChart: React.FC<TimeSpeedometerImageChartProps> = ({
  attempt,
  questions,
  avgSpeedSec,
  fastCount,
  idealCount,
  overtimeCount,
  timeWastedWrongSec,
}) => {
  const clampedSec = Math.min(120, Math.max(0, avgSpeedSec));
  const needleAngle = -90 + (clampedSec / 120) * 180;

  const totalAttemptSeconds = attempt.totalTimeSeconds || 3600;
  const minsTaken = Math.floor(totalAttemptSeconds / 60);
  const secsTaken = totalAttemptSeconds % 60;

  return (
    <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
              <Gauge className="w-5 h-5" />
            </span>
            <h3 className="font-black text-lg text-slate-900 dark:text-white tracking-tight">
              Part 3: Time & Speedometer Analog Gauge Graph Chart
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time speedometer velocity dial, question pace breakdown, and time wasted in negative marks.
          </p>
        </div>

        <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-300 border border-slate-200 dark:border-slate-700">
          Total Test Time: {minsTaken}m {secsTaken}s
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left: Semi-Circular Speedometer Dial Gauge */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200/80 dark:border-slate-700">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2">
            Average Speed Dial Gauge
          </span>

          <div className="relative w-64 h-36 flex items-center justify-center overflow-hidden">
            <svg viewBox="0 0 200 115" className="w-full h-full">
              {/* Background Arc */}
              <path
                d="M 20 100 A 80 80 0 0 1 180 100"
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="16"
                strokeLinecap="round"
                className="dark:stroke-slate-700"
              />

              {/* Colored Speedometer Velocity Zones */}
              {/* 1. Rapid Zone (0-45s) */}
              <path
                d="M 20 100 A 80 80 0 0 1 70 33"
                fill="none"
                stroke="#10b981"
                strokeWidth="16"
                strokeLinecap="round"
              />
              {/* 2. Optimal Zone (45-90s) */}
              <path
                d="M 70 33 A 80 80 0 0 1 130 33"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="16"
              />
              {/* 3. Overtime Zone (>90s) */}
              <path
                d="M 130 33 A 80 80 0 0 1 180 100"
                fill="none"
                stroke="#ef4444"
                strokeWidth="16"
                strokeLinecap="round"
              />

              {/* Scale Ticks & Numbers */}
              <text x="18" y="112" fill="#64748b" fontSize="8" fontWeight="bold">0s</text>
              <text x="55" y="24" fill="#10b981" fontSize="8" fontWeight="bold">45s</text>
              <text x="96" y="16" fill="#3b82f6" fontSize="8" fontWeight="bold">60s</text>
              <text x="135" y="24" fill="#ef4444" fontSize="8" fontWeight="bold">90s</text>
              <text x="172" y="112" fill="#ef4444" fontSize="8" fontWeight="bold">120s+</text>

              {/* Rotating Speed Needle */}
              <g transform={`translate(100, 100) rotate(${needleAngle})`}>
                <line x1="0" y1="0" x2="0" y2="-72" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" className="dark:stroke-white" />
                <polygon points="-4,-62 4,-62 0,-76" fill="#f59e0b" />
                <circle cx="0" cy="0" r="7" fill="#f59e0b" stroke="#0f172a" strokeWidth="2" className="dark:stroke-white" />
              </g>
            </svg>
          </div>

          {/* Speedometer Digital Readout */}
          <div className="text-center mt-2 space-y-0.5">
            <div className="text-3xl font-black font-mono text-slate-900 dark:text-white tracking-tight">
              {avgSpeedSec} <span className="text-sm font-bold text-slate-500">sec / Q</span>
            </div>
            <span className={`text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full inline-block ${
              avgSpeedSec < 45 
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' 
                : avgSpeedSec <= 90 
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' 
                : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
            }`}>
              {avgSpeedSec < 45 ? '⚡ Rapid Pace' : avgSpeedSec <= 90 ? '⏱️ Optimal Exam Pace' : '⏳ Overtime Pace'}
            </span>
          </div>

          {/* Speed Bands Legend */}
          <div className="grid grid-cols-3 gap-1.5 w-full mt-4 pt-3 border-t border-slate-200 dark:border-slate-700 text-[10px] text-center">
            <div className="p-1 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block mr-1" />
              <strong className="text-slate-700 dark:text-slate-300">&lt;45s Rapid</strong>
            </div>
            <div className="p-1 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="w-2 h-2 rounded-full bg-blue-500 inline-block mr-1" />
              <strong className="text-slate-700 dark:text-slate-300">45-90s Ideal</strong>
            </div>
            <div className="p-1 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="w-2 h-2 rounded-full bg-rose-500 inline-block mr-1" />
              <strong className="text-slate-700 dark:text-slate-300">&gt;90s Overtime</strong>
            </div>
          </div>
        </div>

        {/* Right: Question Pace Distribution */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-700 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-extrabold uppercase text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                Pace Category Distribution Bar Chart
              </span>
              <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                {questions.length} Total Questions
              </span>
            </div>

            {/* Tri-Colored Horizontal Pace Bar */}
            <div className="space-y-1.5">
              <div className="h-6 w-full bg-slate-200 dark:bg-slate-700 rounded-xl overflow-hidden flex shadow-inner">
                {fastCount > 0 && (
                  <div 
                    className="bg-emerald-500 h-full flex items-center justify-center text-[10px] font-black text-white px-2 transition-all duration-500"
                    style={{ width: `${(fastCount / Math.max(1, questions.length)) * 100}%` }}
                    title={`${fastCount} Questions under 45 seconds`}
                  >
                    {fastCount} Rapid
                  </div>
                )}
                {idealCount > 0 && (
                  <div 
                    className="bg-blue-500 h-full flex items-center justify-center text-[10px] font-black text-white px-2 transition-all duration-500"
                    style={{ width: `${(idealCount / Math.max(1, questions.length)) * 100}%` }}
                    title={`${idealCount} Questions between 45s and 90s`}
                  >
                    {idealCount} Optimal
                  </div>
                )}
                {overtimeCount > 0 && (
                  <div 
                    className="bg-rose-500 h-full flex items-center justify-center text-[10px] font-black text-white px-2 transition-all duration-500"
                    style={{ width: `${(overtimeCount / Math.max(1, questions.length)) * 100}%` }}
                    title={`${overtimeCount} Questions took over 90 seconds`}
                  >
                    {overtimeCount} Overtime
                  </div>
                )}
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
                <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold block">Rapid (&lt;45s)</span>
                  <strong className="font-mono text-slate-900 dark:text-white text-sm">{fastCount} Qs</strong>
                </div>
                <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
                  <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold block">Optimal (45-90s)</span>
                  <strong className="font-mono text-slate-900 dark:text-white text-sm">{idealCount} Qs</strong>
                </div>
                <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
                  <span className="text-[10px] text-rose-600 dark:text-rose-400 font-bold block">Overtime (&gt;90s)</span>
                  <strong className="font-mono text-slate-900 dark:text-white text-sm">{overtimeCount} Qs</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Time Wasted on Wrong Answers Graphic Card */}
          <div className="bg-rose-50 dark:bg-rose-950/40 rounded-2xl p-5 border border-rose-200 dark:border-rose-900/60 space-y-2">
            <div className="flex items-center justify-between text-xs text-rose-700 dark:text-rose-300 font-extrabold uppercase">
              <span className="flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                Time Wasted on Wrong Answers Penalty Loss
              </span>
              <span className="font-mono text-rose-700 dark:text-rose-300">
                {Math.round(timeWastedWrongSec / 60)} Mins {timeWastedWrongSec % 60}s
              </span>
            </div>
            <p className="text-xs text-rose-800 dark:text-rose-200 leading-relaxed">
              You spent <strong>{Math.round(timeWastedWrongSec / 60)} minutes</strong> grappling with questions that ultimately led to incorrect answers and negative penalty deductions. Reallocating this time to double-checking high-accuracy questions would yield an estimated <strong>+16 to +24 mark boost</strong>!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};


/* =========================================================================
   PART 4: NEGATIVE MARKING LOSS IMAGE GRAPH CHART (WHITE THEME)
   ========================================================================= */
interface NegativeLossImageChartProps {
  attempt: ExamAttempt;
  questions: Question[];
  negativePenaltyTotal: number;
  grossMarks: number;
  rapidAccurateCount: number;
  slowAccurateCount: number;
  rushedWrongCount: number;
  slowWrongCount: number;
}

export const NegativeLossImageChart: React.FC<NegativeLossImageChartProps> = ({
  attempt,
  negativePenaltyTotal,
  grossMarks,
  rapidAccurateCount,
  slowAccurateCount,
  rushedWrongCount,
  slowWrongCount,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
              <AlertTriangle className="w-5 h-5" />
            </span>
            <h3 className="font-black text-lg text-slate-900 dark:text-white tracking-tight">
              Part 4: Negative Marking Loss & 4-Quadrant Graph Chart
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Visual penalty waterfall deduction graph and 4-quadrant speed vs accuracy matrix.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
            Total Penalty: -{negativePenaltyTotal.toFixed(2)} Marks
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Waterfall Loss Graph Chart */}
        <div className="lg:col-span-5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-700 space-y-4">
          <span className="text-xs font-extrabold uppercase text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
            <BarChart3 className="w-4 h-4 text-rose-600 dark:text-rose-400" />
            Negative Penalty Waterfall Loss Graph
          </span>

          <div className="relative h-56 bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 flex items-end justify-between gap-3 shadow-inner">
            {/* Column 1: Gross Positive Marks */}
            <div className="flex-1 flex flex-col items-center justify-end h-full">
              <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold mb-1">
                +{grossMarks.toFixed(1)}
              </span>
              <div 
                className="w-full bg-emerald-500 rounded-t-lg transition-all duration-700 shadow-md shadow-emerald-500/20"
                style={{ height: '85%' }}
              />
              <span className="text-[9.5px] font-bold text-slate-600 dark:text-slate-300 mt-2 text-center">Gross Marks</span>
            </div>

            {/* Column 2: Negative Deduction Step Down */}
            <div className="flex-1 flex flex-col items-center justify-end h-full">
              <span className="text-[10px] font-mono text-rose-600 dark:text-rose-400 font-bold mb-1">
                -{negativePenaltyTotal.toFixed(1)}
              </span>
              <div 
                className="w-full bg-rose-500 rounded-t-lg transition-all duration-700 shadow-md shadow-rose-500/20"
                style={{ height: `${Math.max(15, (negativePenaltyTotal / Math.max(1, grossMarks)) * 85)}%` }}
              />
              <span className="text-[9.5px] font-bold text-rose-600 dark:text-rose-400 mt-2 text-center">Penalty Loss</span>
            </div>

            {/* Column 3: Net Realized Score */}
            <div className="flex-1 flex flex-col items-center justify-end h-full">
              <span className="text-[10px] font-mono text-blue-600 dark:text-blue-400 font-bold mb-1">
                ={attempt.score}
              </span>
              <div 
                className="w-full bg-blue-600 rounded-t-lg transition-all duration-700 shadow-md shadow-blue-500/20"
                style={{ height: `${Math.max(20, (attempt.score / Math.max(1, grossMarks)) * 85)}%` }}
              />
              <span className="text-[9.5px] font-bold text-blue-600 dark:text-blue-300 mt-2 text-center">Net Score</span>
            </div>
          </div>

          <div className="p-3 bg-white dark:bg-slate-850 rounded-xl text-xs space-y-1 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            <div className="flex justify-between">
              <span>Unforced Errors:</span>
              <strong className="text-rose-600 dark:text-rose-400 font-mono">{attempt.incorrectCount} Questions</strong>
            </div>
            <div className="flex justify-between">
              <span>Skipped Questions:</span>
              <strong className="text-slate-500 font-mono">{attempt.unattemptedCount} (0 Deduction)</strong>
            </div>
          </div>
        </div>

        {/* Right: 4-Quadrant Speed vs Accuracy Matrix Graph Chart */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-700 space-y-4">
            <div className="flex items-center justify-between text-xs">
              <span className="font-extrabold uppercase text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                Speed vs Accuracy 4-Quadrant Matrix Graph
              </span>
              <span className="text-[11px] font-mono text-slate-500">
                Threshold: 60s Pace Benchmark
              </span>
            </div>

            {/* 4 Quadrants Visual Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Q1: Rapid & Accurate (Green) */}
              <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800 space-y-1.5 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Q1: Rapid & Accurate (&le;60s)
                  </span>
                  <span className="text-xl font-black font-mono text-emerald-700 dark:text-emerald-300">
                    {rapidAccurateCount} Qs
                  </span>
                </div>
                <p className="text-[11px] text-emerald-800/90 dark:text-emerald-300/90 leading-snug">
                  High-velocity mastery zone. Quick reflex & correct derivation. Core scoring engine!
                </p>
              </div>

              {/* Q2: Slow & Accurate (Blue) */}
              <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-300 dark:border-blue-800 space-y-1.5 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-blue-800 dark:text-blue-300 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-blue-600" />
                    Q2: Accurate but Slow (&gt;60s)
                  </span>
                  <span className="text-xl font-black font-mono text-blue-700 dark:text-blue-300">
                    {slowAccurateCount} Qs
                  </span>
                </div>
                <p className="text-[11px] text-blue-800/90 dark:text-blue-300/90 leading-snug">
                  Solid concepts but consumed excessive time. Learn shortcut formulas to save minutes.
                </p>
              </div>

              {/* Q3: Rushed & Wrong (Amber Hazard) */}
              <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800 space-y-1.5 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    Q3: Rushed & Wrong (&le;60s)
                  </span>
                  <span className="text-xl font-black font-mono text-amber-700 dark:text-amber-300">
                    {rushedWrongCount} Qs
                  </span>
                </div>
                <p className="text-[11px] text-amber-800/90 dark:text-amber-300/90 leading-snug">
                  Careless unforced errors! You jumped to conclusions without reading all options carefully.
                </p>
              </div>

              {/* Q4: Slow & Wrong (Red Disaster) */}
              <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-300 dark:border-rose-800 space-y-1.5 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-rose-800 dark:text-rose-300 flex items-center gap-1.5">
                    <XCircle className="w-4 h-4 text-rose-600" />
                    Q4: Slow & Wrong (&gt;60s)
                  </span>
                  <span className="text-xl font-black font-mono text-rose-700 dark:text-rose-300">
                    {slowWrongCount} Qs
                  </span>
                </div>
                <p className="text-[11px] text-rose-800/90 dark:text-rose-300/90 leading-snug">
                  Worst-case trap: Heavy time lost PLUS negative mark penalty! Practice early skipping.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


/* =========================================================================
   PART 5: DIFFICULTY MATRIX IMAGE GRAPH CHART (WHITE THEME)
   ========================================================================= */
interface DifficultyMatrixImageChartProps {
  easyStats: { total: number; attempted: number; correct: number; accuracy: number };
  medStats: { total: number; attempted: number; correct: number; accuracy: number };
  hardStats: { total: number; attempted: number; correct: number; accuracy: number };
}

export const DifficultyMatrixImageChart: React.FC<DifficultyMatrixImageChartProps> = ({
  easyStats,
  medStats,
  hardStats,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
              <Compass className="w-5 h-5" />
            </span>
            <h3 className="font-black text-lg text-slate-900 dark:text-white tracking-tight">
              Part 5: Difficulty Matrix Clustered Bar & Accuracy Curve Graph Chart
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Comparative analysis across Easy, Medium, and Hard tiers: Questions Attempted vs Conversion Accuracy.
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-semibold">
          <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
            <span className="w-2.5 h-2.5 rounded-sm bg-slate-300 dark:bg-slate-600" /> Total Paper Qs
          </span>
          <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
            <span className="w-2.5 h-2.5 rounded-sm bg-blue-500" /> Attempted
          </span>
          <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" /> Correct
          </span>
        </div>
      </div>

      {/* Clustered Columns & Accuracy Trend Graph */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Easy Questions', stats: easyStats, target: '95%+', color: 'emerald', badge: 'Tier-1 High Yield' },
          { label: 'Medium Questions', stats: medStats, target: '75%+', color: 'blue', badge: 'Cutoff Decider' },
          { label: 'Hard Questions', stats: hardStats, target: '50%+', color: 'purple', badge: 'Merit Rank Maker' },
        ].map((tier) => {
          const s = tier.stats;
          const maxQ = Math.max(1, s.total);
          const attPct = (s.attempted / maxQ) * 100;
          const corrPct = (s.correct / maxQ) * 100;

          return (
            <div key={tier.label} className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-700 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-black text-sm text-slate-900 dark:text-white">{tier.label}</h4>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">{tier.badge}</span>
                </div>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                  s.accuracy >= 75 ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : s.accuracy >= 45 ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                }`}>
                  {s.accuracy}% Accuracy
                </span>
              </div>

              {/* Clustered Mini Vertical Column Chart */}
              <div className="h-40 bg-white dark:bg-slate-900 rounded-xl p-3 border border-slate-200 dark:border-slate-800 flex items-end justify-center gap-4 shadow-sm">
                {/* Bar 1: Total */}
                <div className="flex flex-col items-center justify-end h-full w-8">
                  <span className="text-[9px] font-mono text-slate-500 font-bold mb-1">{s.total}</span>
                  <div className="w-full bg-slate-300 dark:bg-slate-700 rounded-t-md h-full" />
                  <span className="text-[8.5px] text-slate-500 mt-1">Total</span>
                </div>
                {/* Bar 2: Attempted */}
                <div className="flex flex-col items-center justify-end h-full w-8">
                  <span className="text-[9px] font-mono text-blue-600 dark:text-blue-400 font-bold mb-1">{s.attempted}</span>
                  <div 
                    className="w-full bg-blue-500 rounded-t-md transition-all duration-500 shadow-sm"
                    style={{ height: `${attPct}%` }}
                  />
                  <span className="text-[8.5px] text-blue-600 dark:text-blue-300 mt-1">Att</span>
                </div>
                {/* Bar 3: Correct */}
                <div className="flex flex-col items-center justify-end h-full w-8">
                  <span className="text-[9px] font-mono text-emerald-600 dark:text-emerald-400 font-bold mb-1">{s.correct}</span>
                  <div 
                    className="w-full bg-emerald-500 rounded-t-md transition-all duration-500 shadow-sm shadow-emerald-500/20"
                    style={{ height: `${corrPct}%` }}
                  />
                  <span className="text-[8.5px] text-emerald-600 dark:text-emerald-300 mt-1">Right</span>
                </div>
              </div>

              {/* Conversion Efficiency Gauge */}
              <div className="space-y-1.5 text-xs pt-1">
                <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400">
                  <span>Target Benchmark:</span>
                  <strong className="text-slate-800 dark:text-white font-mono">{tier.target}</strong>
                </div>
                <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400">
                  <span>Questions Converted:</span>
                  <strong className="text-emerald-600 dark:text-emerald-400 font-mono">{s.correct} of {s.total} Qs</strong>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};


/* =========================================================================
   PART 6: TOPIC MASTERY & GAPS IMAGE GRAPH CHART (WHITE THEME)
   ========================================================================= */
interface TopicMasteryImageChartProps {
  allTopicStats: any[];
  masteredTopics: any[];
  averageTopics: any[];
  weakTopicsList: any[];
  unattemptedTopics: any[];
  masteredPercent: number;
  averagePercent: number;
  weakPercent: number;
  unattemptedPercent: number;
  openPdfReader?: (mock: MockTest) => void;
  currentMock?: MockTest;
  isTopSection?: boolean; // When rendered in top section of analytics!
}

export const TopicMasteryImageChart: React.FC<TopicMasteryImageChartProps> = ({
  allTopicStats,
  masteredTopics,
  averageTopics,
  weakTopicsList,
  unattemptedTopics,
  masteredPercent,
  averagePercent,
  weakPercent,
  unattemptedPercent,
  openPdfReader,
  currentMock,
  isTopSection = false,
}) => {
  const [topicFilter, setTopicFilter] = useState<'ALL' | 'MASTERED' | 'WEAK'>('ALL');

  const displayedTopics = topicFilter === 'ALL' 
    ? allTopicStats 
    : topicFilter === 'MASTERED'
    ? masteredTopics
    : weakTopicsList;

  // Donut circumference
  const donutC = 238.76;
  const seg1Dash = (masteredPercent / 100) * donutC;
  const seg2Dash = (averagePercent / 100) * donutC;
  const seg3Dash = (weakPercent / 100) * donutC;
  const seg4Dash = (unattemptedPercent / 100) * donutC;

  const seg1Offset = 0;
  const seg2Offset = -seg1Dash;
  const seg3Offset = -(seg1Dash + seg2Dash);
  const seg4Offset = -(seg1Dash + seg2Dash + seg3Dash);

  return (
    <div className={`bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-3xl p-6 sm:p-8 border ${
      isTopSection 
        ? 'border-blue-300 dark:border-blue-800 shadow-xl shadow-blue-500/10' 
        : 'border-slate-200/90 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none'
    } space-y-6`}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
              <PieChart className="w-5 h-5" />
            </span>
            <h3 className="font-black text-lg text-slate-900 dark:text-white tracking-tight">
              Topic Health & Mastery (Round Chart)
            </h3>
            {isTopSection && (
              <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-300">
                Top Priority Diagnostic
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Round donut health distribution and multi-topic segmented performance bars side-by-side.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold">
          <button
            onClick={() => setTopicFilter('ALL')}
            className={`px-3 py-1 rounded-lg cursor-pointer ${topicFilter === 'ALL' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'}`}
          >
            All Topics ({allTopicStats.length})
          </button>
          <button
            onClick={() => setTopicFilter('MASTERED')}
            className={`px-3 py-1 rounded-lg cursor-pointer ${topicFilter === 'MASTERED' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'}`}
          >
            Mastered ({masteredTopics.length})
          </button>
          <button
            onClick={() => setTopicFilter('WEAK')}
            className={`px-3 py-1 rounded-lg cursor-pointer ${topicFilter === 'WEAK' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'}`}
          >
            Weak ({weakTopicsList.length})
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Round Donut Chart */}
        <div className="lg:col-span-5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700 flex flex-col items-center justify-center space-y-4">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-400">
            Topic Health & Mastery (Round Chart)
          </span>

          <div className="relative w-48 h-48 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="38" fill="transparent" stroke="#e2e8f0" strokeWidth="12" className="dark:stroke-slate-700" />
              {masteredPercent > 0 && (
                <circle
                  cx="50" cy="50" r="38" fill="transparent" stroke="#10b981" strokeWidth="12"
                  strokeDasharray={`${seg1Dash} ${donutC - seg1Dash}`}
                  strokeDashoffset={seg1Offset} strokeLinecap="round"
                />
              )}
              {averagePercent > 0 && (
                <circle
                  cx="50" cy="50" r="38" fill="transparent" stroke="#3b82f6" strokeWidth="12"
                  strokeDasharray={`${seg2Dash} ${donutC - seg2Dash}`}
                  strokeDashoffset={seg2Offset} strokeLinecap="round"
                />
              )}
              {weakPercent > 0 && (
                <circle
                  cx="50" cy="50" r="38" fill="transparent" stroke="#f43f5e" strokeWidth="12"
                  strokeDasharray={`${seg3Dash} ${donutC - seg3Dash}`}
                  strokeDashoffset={seg3Offset} strokeLinecap="round"
                />
              )}
              {unattemptedPercent > 0 && (
                <circle
                  cx="50" cy="50" r="38" fill="transparent" stroke="#94a3b8" strokeWidth="12"
                  strokeDasharray={`${seg4Dash} ${donutC - seg4Dash}`}
                  strokeDashoffset={seg4Offset} strokeLinecap="round"
                />
              )}
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-black font-mono text-slate-900 dark:text-white leading-tight">
                {masteredPercent}%
              </span>
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tight">
                Mastery Rate
              </span>
              <span className="text-[9.5px] font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                {masteredTopics.length} Strong Chapters
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 w-full pt-3 border-t border-slate-200 dark:border-slate-700 text-[11px]">
            <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
              <span>Mastered: <strong>{masteredTopics.length}</strong></span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0" />
              <span>Average: <strong>{averageTopics.length}</strong></span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0" />
              <span>Needs Work: <strong>{weakTopicsList.length}</strong></span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-400 shrink-0" />
              <span>Skipped: <strong>{unattemptedTopics.length}</strong></span>
            </div>
          </div>
        </div>

        {/* Right: Topic-Wise Progress Bar Graph Chart */}
        <div className="lg:col-span-7 bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-700 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 pb-2 border-b border-slate-200 dark:border-slate-700">
            <span className="font-extrabold uppercase">Chapter Diagnostic Bars</span>
            <span className="text-[10px]">Showing {displayedTopics.length} Topics</span>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto pr-1 scrollbar-thin">
            {displayedTopics.map((topic) => {
              const correctPct = (topic.correct / topic.total) * 100;
              const incorrectPct = (topic.incorrect / topic.total) * 100;
              const skippedPct = (topic.skipped / topic.total) * 100;

              return (
                <div key={topic.topic} className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900 dark:text-white truncate max-w-[200px]">{topic.topic}</span>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded font-mono ${
                      topic.accuracy >= 75 ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : topic.accuracy >= 40 ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                    }`}>
                      {topic.accuracy}% Accuracy
                    </span>
                  </div>

                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full flex overflow-hidden">
                    {correctPct > 0 && <div className="bg-emerald-500 h-full" style={{ width: `${correctPct}%` }} />}
                    {incorrectPct > 0 && <div className="bg-rose-500 h-full" style={{ width: `${incorrectPct}%` }} />}
                    {skippedPct > 0 && <div className="bg-slate-400 dark:bg-slate-500 h-full" style={{ width: `${skippedPct}%` }} />}
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
                    <span>{topic.correct} Correct • {topic.incorrect} Wrong • {topic.skipped} Skipped</span>
                    {currentMock && openPdfReader && (
                      <button
                        onClick={() => openPdfReader(currentMock)}
                        className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                      >
                        <BookOpen className="w-3 h-3" />
                        <span>Revise in PDF</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};


/* =========================================================================
   PART 7: TOPPER & PEER CURVE IMAGE GRAPH CHART (WHITE THEME)
   ========================================================================= */
interface TopperPeerCurveImageChartProps {
  attempt: ExamAttempt;
  currentMock?: MockTest;
}

export const TopperPeerCurveImageChart: React.FC<TopperPeerCurveImageChartProps> = ({
  attempt,
  currentMock,
}) => {
  const avgScore = attempt.topperComparison?.averageScore || 92;
  const topperScore = attempt.topperComparison?.topperScore || 188;
  const userScore = attempt.score;
  const cutoffScore = currentMock?.cutoffMarks?.general || 135;
  const maxScore = attempt.totalMarks || 200;

  const mapX = (score: number) => {
    const clamped = Math.min(maxScore, Math.max(0, score));
    return 20 + (clamped / maxScore) * 360;
  };

  const userX = mapX(userScore);
  const avgX = mapX(avgScore);
  const cutoffX = mapX(cutoffScore);
  const topperX = mapX(topperScore);

  const curvePoints: [number, number][] = [];
  const svgWidth = 400;
  const svgHeight = 160;
  const mean = avgScore;
  const sigma = 32;

  for (let s = 0; s <= maxScore; s += 4) {
    const x = mapX(s);
    const exponent = -0.5 * Math.pow((s - mean) / sigma, 2);
    const yVal = Math.exp(exponent);
    const y = svgHeight - 20 - (yVal * 115);
    curvePoints.push([x, y]);
  }

  const pathD = curvePoints.reduce((acc, [x, y], idx) => {
    return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
  }, '');

  const userCurvePoints = curvePoints.filter(([x]) => x <= userX);
  const areaD = userCurvePoints.length > 0
    ? `${userCurvePoints.reduce((acc, [x, y], idx) => idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`, '')} L ${userX} ${svgHeight - 20} L ${curvePoints[0][0]} ${svgHeight - 20} Z`
    : '';

  return (
    <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
              <Users className="w-5 h-5" />
            </span>
            <h3 className="font-black text-lg text-slate-900 dark:text-white tracking-tight">
              Part 7: Topper & Peer Percentile Bell Curve Graph Chart
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Gaussian normal distribution curve comparing your score vs 1 Lakh+ All-India candidates and Rank 1 topper.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-black px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
            Your Percentile: {attempt.percentile}% (AIR #{attempt.rank.toLocaleString()})
          </span>
        </div>
      </div>

      {/* Gaussian Bell Curve SVG Chart */}
      <div className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700 space-y-4">
        <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pb-2 border-b border-slate-200 dark:border-slate-700">
          <span className="font-extrabold uppercase">All-India Candidate Score Distribution</span>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> You ({userScore})
            </span>
            <span className="flex items-center gap-1.5 text-slate-500 font-bold">
              <span className="w-2.5 h-0.5 bg-slate-400" /> Average ({avgScore})
            </span>
            <span className="flex items-center gap-1.5 text-amber-600 font-bold">
              <span className="w-2.5 h-0.5 bg-amber-500" /> Cutoff ({cutoffScore})
            </span>
            <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Rank 1 ({topperScore})
            </span>
          </div>
        </div>

        {/* SVG Bell Curve Container */}
        <div className="w-full overflow-x-auto">
          <svg viewBox="0 0 400 170" className="w-full h-auto min-w-[340px]">
            <defs>
              <linearGradient id="curveShadeLight" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.03" />
              </linearGradient>
            </defs>

            {/* Baseline X Axis */}
            <line x1="20" y1="140" x2="380" y2="140" stroke="#cbd5e1" strokeWidth="1.5" className="dark:stroke-slate-700" />

            {/* Shaded Percentile Area Under Curve */}
            {areaD && (
              <path d={areaD} fill="url(#curveShadeLight)" />
            )}

            {/* Smooth Normal Distribution Line */}
            <path d={pathD} fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" />

            {/* Marker 1: Average Aspirant */}
            <line x1={avgX} y1="35" x2={avgX} y2="140" stroke="#64748b" strokeWidth="1" strokeDasharray="3 3" />
            <text x={avgX} y="30" fill="#64748b" fontSize="7.5" textAnchor="middle" fontWeight="bold">
              Avg: {avgScore}
            </text>

            {/* Marker 2: Target Cutoff */}
            <line x1={cutoffX} y1="35" x2={cutoffX} y2="140" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3 3" />
            <text x={cutoffX} y="25" fill="#d97706" fontSize="8" textAnchor="middle" fontWeight="bold">
              Cutoff: {cutoffScore}
            </text>

            {/* Marker 3: Candidate's Score */}
            <line x1={userX} y1="15" x2={userX} y2="140" stroke="#2563eb" strokeWidth="2.5" />
            <circle cx={userX} cy="140" r="4.5" fill="#2563eb" stroke="#ffffff" strokeWidth="1.5" />
            <g transform={`translate(${userX}, 12)`}>
              <rect x="-24" y="-12" width="48" height="15" rx="3" fill="#2563eb" />
              <text x="0" y="-2" fill="#ffffff" fontSize="7.5" textAnchor="middle" fontWeight="900">
                You: {userScore}
              </text>
            </g>

            {/* Marker 4: AIR 1 Topper */}
            <line x1={topperX} y1="35" x2={topperX} y2="140" stroke="#10b981" strokeWidth="1.5" strokeDasharray="2 2" />
            <circle cx={topperX} cy="140" r="3.5" fill="#10b981" />
            <text x={topperX} y="30" fill="#059669" fontSize="8" textAnchor="middle" fontWeight="bold">
              👑 AIR 1: {topperScore}
            </text>

            {/* X-Axis Tick Labels */}
            <text x="20" y="155" fill="#64748b" fontSize="8">0 Marks</text>
            <text x="110" y="155" fill="#64748b" fontSize="8">50</text>
            <text x="200" y="155" fill="#64748b" fontSize="8">100</text>
            <text x="290" y="155" fill="#64748b" fontSize="8">150</text>
            <text x="380" y="155" fill="#64748b" fontSize="8" textAnchor="end">{maxScore} Marks</text>
          </svg>
        </div>

        {/* 3-Way Comparative Benchmark Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-center text-xs">
          <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 space-y-1">
            <span className="text-[10px] text-blue-700 dark:text-blue-300 font-extrabold uppercase">Your Performance</span>
            <div className="text-2xl font-black font-mono text-blue-700 dark:text-blue-400">{userScore} Marks</div>
            <span className="text-[11px] text-slate-600 dark:text-slate-300 block">{attempt.accuracy}% Accuracy</span>
          </div>

          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1 shadow-sm">
            <span className="text-[10px] text-slate-500 font-extrabold uppercase">Average Aspirant</span>
            <div className="text-2xl font-black font-mono text-slate-700 dark:text-slate-300">{avgScore} Marks</div>
            <span className="text-[11px] text-slate-500 block">64% Accuracy</span>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-1">
            <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-extrabold uppercase">AIR 1 Topper</span>
            <div className="text-2xl font-black font-mono text-emerald-700 dark:text-emerald-400">{topperScore} Marks</div>
            <span className="text-[11px] text-slate-600 dark:text-slate-300 block">96% Accuracy</span>
          </div>
        </div>
      </div>
    </div>
  );
};


/* =========================================================================
   REATTEMPT FACILITY MODAL (WHITE THEME)
   ========================================================================= */
interface ReattemptModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentMock?: MockTest;
  attempt?: ExamAttempt;
  allAttemptsForThisMock: ExamAttempt[];
  onStartFull: () => void;
  onStartMistakes: () => void;
  onStartSpeedDrill: () => void;
}

export const ReattemptModal: React.FC<ReattemptModalProps> = ({
  isOpen,
  onClose,
  currentMock,
  attempt,
  allAttemptsForThisMock,
  onStartFull,
  onStartMistakes,
  onStartSpeedDrill,
}) => {
  if (!isOpen || !currentMock) return null;

  const mistakesCount = attempt?.incorrectCount || 0;
  const skippedCount = attempt?.unattemptedCount || 0;
  const recoveryQsCount = mistakesCount + skippedCount;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto scrollbar-thin">
        
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                <RotateCcw className="w-5 h-5" />
              </span>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                Reattempt Facility & Score Booster
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Reattempt <span className="text-blue-600 dark:text-blue-400 font-bold">{currentMock.title}</span> to improve accuracy, eliminate negative penalties, and boost rank.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Previous Attempt Summary Bar */}
        {attempt && (
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div>
              <span className="text-slate-500 dark:text-slate-400 text-[11px] block">Previous Result:</span>
              <strong className="text-blue-600 dark:text-blue-400 font-mono text-base">{attempt.score} / {attempt.totalMarks} Marks</strong>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400 text-[11px] block">Accuracy:</span>
              <strong className="text-emerald-600 dark:text-emerald-400 font-mono text-base">{attempt.accuracy}%</strong>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400 text-[11px] block">Mistakes to Fix:</span>
              <strong className="text-rose-600 dark:text-rose-400 font-mono text-base">{mistakesCount} Incorrect Qs</strong>
            </div>
          </div>
        )}

        {/* 3 Distinct Reattempt Modes */}
        <div className="space-y-3">
          <span className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
            Select Your Reattempt Practice Mode:
          </span>

          {/* Option 1: Full Mock Reattempt */}
          <div 
            onClick={onStartFull}
            className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 hover:bg-blue-50/70 dark:hover:bg-blue-950/40 border border-slate-200 dark:border-slate-700 hover:border-blue-400 transition-all cursor-pointer group space-y-2 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="p-2.5 rounded-xl bg-blue-600 text-white font-black text-sm group-hover:scale-105 transition-transform shadow-md shadow-blue-500/20">
                  <RotateCcw className="w-5 h-5" />
                </span>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors">
                    1. Complete Fresh Reattempt (Real Exam Simulation)
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Re-attempt all {currentMock.questions.length} questions from scratch under full timer ({currentMock.durationMinutes} mins) and TCS iON pattern.
                  </p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all shrink-0" />
            </div>
          </div>

          {/* Option 2: Mistakes & Skipped Recovery Drill */}
          <div 
            onClick={onStartMistakes}
            className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 hover:bg-emerald-50/70 dark:hover:bg-emerald-950/40 border border-slate-200 dark:border-slate-700 hover:border-emerald-400 transition-all cursor-pointer group space-y-2 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="p-2.5 rounded-xl bg-emerald-600 text-white font-black text-sm group-hover:scale-105 transition-transform shadow-md shadow-emerald-500/20">
                  <Target className="w-5 h-5" />
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition-colors">
                      2. Weakness & Mistakes Drill (Targeted Recovery)
                    </h4>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold">
                      {recoveryQsCount} Questions
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Filters ONLY questions where you lost marks (incorrect + skipped). Master your weak spots in a focused drill!
                  </p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all shrink-0" />
            </div>
          </div>

          {/* Option 3: Speed Sprint Drill */}
          <div 
            onClick={onStartSpeedDrill}
            className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 hover:bg-amber-50/70 dark:hover:bg-amber-950/40 border border-slate-200 dark:border-slate-700 hover:border-amber-400 transition-all cursor-pointer group space-y-2 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="p-2.5 rounded-xl bg-amber-500 text-white font-black text-sm group-hover:scale-105 transition-transform shadow-md shadow-amber-500/20">
                  <Zap className="w-5 h-5" />
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-300 transition-colors">
                      3. Speed Booster Drill (1.5x Fast Velocity)
                    </h4>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-bold">
                      High Pressure
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    45 seconds per question challenge mode! Eliminates exam hesitation and builds high-speed instinct.
                  </p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-1 transition-all shrink-0" />
            </div>
          </div>
        </div>

        {/* Previous Attempts History for this Test */}
        {allAttemptsForThisMock.length > 0 && (
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
              Attempt History ({allAttemptsForThisMock.length} Attempts):
            </span>
            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1 text-xs">
              {allAttemptsForThisMock.map((att, idx) => (
                <div key={att.id} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-600 dark:text-slate-300">Attempt #{allAttemptsForThisMock.length - idx}</span>
                    <span className="text-slate-400 text-[11px]">{att.date}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{att.score} Marks</span>
                    <span className="font-mono text-emerald-600 dark:text-emerald-400">{att.accuracy}% Acc</span>
                    <span className="font-mono text-slate-400">AIR #{att.rank}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold cursor-pointer"
          >
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
};
