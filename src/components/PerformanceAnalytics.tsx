import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Award, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Clock, 
  TrendingUp, 
  BarChart3, 
  Flame, 
  Check, 
  X, 
  Filter, 
  BookOpen, 
  ChevronRight, 
  ArrowLeft,
  Sparkles,
  Zap,
  Target,
  Flag,
  Layers,
  PieChart,
  Users,
  Compass,
  AlertTriangle,
  Lightbulb,
  Share2,
  RotateCcw
} from 'lucide-react';
import {
  ScorecardImageChart,
  SectionalCutoffImageChart,
  TimeSpeedometerImageChart,
  NegativeLossImageChart,
  DifficultyMatrixImageChart,
  TopicMasteryImageChart,
  TopperPeerCurveImageChart,
  ReattemptModal
} from './AnalyticsImageCharts';

export const PerformanceAnalytics: React.FC = () => {
  const { 
    activeAttemptResult, 
    setCurrentView, 
    mockTests, 
    attempts, 
    openPdfReader,
    toggleBookmarkQuestion,
    bookmarkedQuestions,
    startFullMockTest,
    setActiveTest
  } = useApp();

  // 7-Part Analytics tab switcher
  const [activeAnalysisPart, setActiveAnalysisPart] = useState<
    'part1_scorecard' | 
    'part2_sections' | 
    'part3_time' | 
    'part4_accuracy' | 
    'part5_difficulty' | 
    'part6_topics' | 
    'part7_topper' | 
    'solutions'
  >('part1_scorecard');

  const [questionFilter, setQuestionFilter] = useState<'ALL' | 'INCORRECT' | 'CORRECT' | 'SKIPPED'>('ALL');
  const [bilingualLang, setBilingualLang] = useState<'english' | 'hindi'>('english');
  const [topicFilter, setTopicFilter] = useState<'ALL' | 'MASTERED' | 'MODERATE' | 'WEAK'>('ALL');
  const [topicSortBy, setTopicSortBy] = useState<'accuracy' | 'questions' | 'score'>('accuracy');
  const [reattemptModalOpen, setReattemptModalOpen] = useState(false);
  const [userCategory, setUserCategory] = useState<'general' | 'obc' | 'sc_st' | 'ews'>('general');

  // Fallback to most recent attempt if none active
  const attempt = activeAttemptResult || attempts[0];

  if (!attempt) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center">
        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-3xl flex items-center justify-center mx-auto mb-4 text-slate-400">
          <BarChart3 className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">No Mock Test Attempts Yet</h2>
        <p className="text-sm text-slate-500 mt-1 mb-6">
          Attempt your first mock test to unlock comprehensive 7-part personalized performance analytics, topper comparison & detailed solutions!
        </p>
        <button
          onClick={() => setCurrentView('mock_tests')}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-600/20 cursor-pointer"
        >
          Explore Available Mock Tests →
        </button>
      </div>
    );
  }

  const currentMock = mockTests.find(m => m.id === attempt.mockId);
  const questions = currentMock?.questions || [];

  // Filtered questions for the solution browser
  const filteredQuestions = questions.filter(q => {
    const userAnswer = attempt.userAnswers[q.id];
    const isAnswered = userAnswer !== undefined && userAnswer !== -1;
    const isCorrect = isAnswered && userAnswer === q.correctAnswerIndex;

    if (questionFilter === 'INCORRECT') return isAnswered && !isCorrect;
    if (questionFilter === 'CORRECT') return isCorrect;
    if (questionFilter === 'SKIPPED') return !isAnswered;
    return true;
  });

  // Calculate advanced 7-part metrics
  const totalQuestionsCount = questions.length || 1;
  const avgSpeedSec = Math.round(attempt.totalTimeSeconds / totalQuestionsCount);
  
  // Difficulty metrics
  const easyQs = questions.filter(q => q.difficulty === 'Easy');
  const medQs = questions.filter(q => q.difficulty === 'Medium');
  const hardQs = questions.filter(q => q.difficulty === 'Hard');

  const getDifficultyStats = (qList: typeof questions) => {
    const attempted = qList.filter(q => attempt.userAnswers[q.id] !== undefined && attempt.userAnswers[q.id] !== -1);
    const correct = attempted.filter(q => attempt.userAnswers[q.id] === q.correctAnswerIndex);
    return {
      total: qList.length,
      attempted: attempted.length,
      correct: correct.length,
      accuracy: attempted.length > 0 ? Math.round((correct.length / attempted.length) * 100) : 0
    };
  };

  const easyStats = getDifficultyStats(easyQs);
  const medStats = getDifficultyStats(medQs);
  const hardStats = getDifficultyStats(hardQs);

  // Time pace categorization
  let fastCount = 0;
  let idealCount = 0;
  let overtimeCount = 0;
  let timeWastedWrongSec = 0;

  questions.forEach(q => {
    const timeSpent = attempt.timeSpentPerQuestion[q.id] || 0;
    const userAns = attempt.userAnswers[q.id];
    const isAnswered = userAns !== undefined && userAns !== -1;
    const isCorrect = isAnswered && userAns === q.correctAnswerIndex;

    if (timeSpent < 45) fastCount++;
    else if (timeSpent <= 90) idealCount++;
    else overtimeCount++;

    if (isAnswered && !isCorrect) {
      timeWastedWrongSec += timeSpent;
    }
  });

  // Speed vs Accuracy 4-Quadrant calculations
  let rapidAccurateCount = 0; // <=60s and correct
  let slowAccurateCount = 0;  // >60s and correct
  let rushedWrongCount = 0;   // <=60s and incorrect
  let slowWrongCount = 0;     // >60s and incorrect

  questions.forEach(q => {
    const timeSpent = attempt.timeSpentPerQuestion[q.id] || 0;
    const userAns = attempt.userAnswers[q.id];
    const isAnswered = userAns !== undefined && userAns !== -1;
    if (isAnswered) {
      const isCorrect = userAns === q.correctAnswerIndex;
      if (isCorrect) {
        if (timeSpent <= 60) rapidAccurateCount++;
        else slowAccurateCount++;
      } else {
        if (timeSpent <= 60) rushedWrongCount++;
        else slowWrongCount++;
      }
    }
  });

  const totalAttemptedCount = attempt.correctCount + attempt.incorrectCount;
  const netAccuracyPercent = totalAttemptedCount > 0 ? Math.round((attempt.correctCount / totalAttemptedCount) * 100) : 0;
  const negativePenaltyTotal = attempt.incorrectCount * (questions[0]?.marksNegative || 0.5);
  const grossMarks = attempt.score + negativePenaltyTotal;

  const activeCutoff = currentMock?.cutoffMarks?.[userCategory] || (
    userCategory === 'general' ? (currentMock?.cutoffMarks.general || 135) :
    userCategory === 'obc' ? (currentMock?.cutoffMarks.obc || 128) :
    userCategory === 'sc_st' ? (currentMock?.cutoffMarks.sc_st || 115) :
    (currentMock?.cutoffMarks.ews || 124)
  );
  const isCutoffCleared = attempt ? attempt.score >= activeCutoff : false;

  // Topic-wise analysis calculations (Round Chart & Chart Form together)
  const [topicSectionFilter, setTopicSectionFilter] = useState<string>('ALL');

  const allTopicStats = React.useMemo(() => {
    const map: Record<string, {
      topic: string;
      section: string;
      total: number;
      correct: number;
      incorrect: number;
      skipped: number;
      accuracy: number;
      timeSpent: number;
      score: number;
      positiveMarks: number;
      negativeMarks: number;
    }> = {};

    questions.forEach((q) => {
      const topName = q.topic || 'General Aptitude';
      if (!map[topName]) {
        map[topName] = {
          topic: topName,
          section: q.section || 'General',
          total: 0,
          correct: 0,
          incorrect: 0,
          skipped: 0,
          accuracy: 0,
          timeSpent: 0,
          score: 0,
          positiveMarks: q.marksPositive,
          negativeMarks: q.marksNegative,
        };
      }
      map[topName].total += 1;
      const userAns = attempt.userAnswers[q.id];
      const timeOnQ = attempt.timeSpentPerQuestion[q.id] || 0;
      map[topName].timeSpent += timeOnQ;

      if (userAns !== undefined && userAns !== -1) {
        if (userAns === q.correctAnswerIndex) {
          map[topName].correct += 1;
          map[topName].score += q.marksPositive;
        } else {
          map[topName].incorrect += 1;
          map[topName].score -= q.marksNegative;
        }
      } else {
        map[topName].skipped += 1;
      }
    });

    const list = Object.values(map).map((t) => {
      const attempted = t.correct + t.incorrect;
      const accuracy = attempted > 0 ? Math.round((t.correct / attempted) * 100) : 0;
      return {
        ...t,
        accuracy,
        avgTimeSec: Math.round(t.timeSpent / Math.max(1, t.total)),
        mastery: accuracy >= 75 ? 'Mastered' : accuracy >= 40 ? 'Average' : 'Needs Practice'
      };
    });

    return list.sort((a, b) => b.total - a.total);
  }, [questions, attempt]);

  const filteredTopics = topicSectionFilter === 'ALL'
    ? allTopicStats
    : allTopicStats.filter(t => t.section === topicSectionFilter);

  const distinctTopicSections = Array.from(new Set(allTopicStats.map(t => t.section)));

  // Round chart aggregated statistics
  const totalTopicsCount = allTopicStats.length || 1;
  const masteredTopics = allTopicStats.filter(t => t.accuracy >= 75);
  const averageTopics = allTopicStats.filter(t => t.accuracy >= 40 && t.accuracy < 75);
  const weakTopicsList = allTopicStats.filter(t => t.accuracy < 40 && (t.correct + t.incorrect) > 0);
  const unattemptedTopics = allTopicStats.filter(t => (t.correct + t.incorrect) === 0);

  const masteredPercent = Math.round((masteredTopics.length / totalTopicsCount) * 100);
  const averagePercent = Math.round((averageTopics.length / totalTopicsCount) * 100);
  const weakPercent = Math.round((weakTopicsList.length / totalTopicsCount) * 100);
  const unattemptedPercent = Math.max(0, 100 - masteredPercent - averagePercent - weakPercent);

  // SVG Round Donut circumference constants (r = 38 => circumference ≈ 238.76)
  const donutC = 238.76;
  const seg1Dash = (masteredPercent / 100) * donutC;
  const seg2Dash = (averagePercent / 100) * donutC;
  const seg3Dash = (weakPercent / 100) * donutC;
  const seg4Dash = (unattemptedPercent / 100) * donutC;

  const seg1Offset = 0;
  const seg2Offset = -seg1Dash;
  const seg3Offset = -(seg1Dash + seg2Dash);
  const seg4Offset = -(seg1Dash + seg2Dash + seg3Dash);

  // Reattempt Test Handlers
  const handleReattemptFull = () => {
    if (!currentMock) return;
    setReattemptModalOpen(false);
    startFullMockTest(currentMock);
  };

  const handleReattemptMistakes = () => {
    if (!currentMock) return;
    setReattemptModalOpen(false);
    const mistakeQuestions = currentMock.questions.filter(q => {
      const userAns = attempt.userAnswers[q.id];
      return userAns === undefined || userAns === -1 || userAns !== q.correctAnswerIndex;
    });

    if (mistakeQuestions.length === 0) {
      startFullMockTest(currentMock);
      return;
    }

    const recoveryTest = {
      ...currentMock,
      id: `${currentMock.id}-recovery-${Date.now()}`,
      title: `${currentMock.title} (Mistakes Recovery Drill)`,
      questions: mistakeQuestions,
      totalQuestions: mistakeQuestions.length,
      durationMinutes: Math.max(5, Math.round((currentMock.durationMinutes / Math.max(1, currentMock.totalQuestions)) * mistakeQuestions.length)),
      totalMarks: mistakeQuestions.reduce((acc, q) => acc + q.marksPositive, 0)
    };

    startFullMockTest(recoveryTest);
  };

  const handleReattemptSpeedDrill = () => {
    if (!currentMock) return;
    setReattemptModalOpen(false);
    const speedTest = {
      ...currentMock,
      id: `${currentMock.id}-speed-${Date.now()}`,
      title: `${currentMock.title} (Speed Booster Drill - 45s/Q)`,
      durationMinutes: Math.max(5, Math.round((currentMock.questions.length * 45) / 60)),
    };
    startFullMockTest(speedTest);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={() => setCurrentView('mock_tests')}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Mock Tests</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Reattempt Mock Test Button */}
          {currentMock && (
            <button
              onClick={() => setReattemptModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all cursor-pointer active:scale-95"
              title="Reattempt this mock test to improve your score"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reattempt Test</span>
            </button>
          )}

          {currentMock && (
            <button
              onClick={() => openPdfReader(currentMock)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:border-blue-500 cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-blue-500" />
              <span>Review Lesson PDF</span>
            </button>
          )}

          <div className="flex items-center bg-slate-200 dark:bg-slate-800 rounded-xl p-1 text-xs font-bold">
            <button
              onClick={() => setBilingualLang('english')}
              className={`px-2.5 py-1 rounded-lg cursor-pointer ${bilingualLang === 'english' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-500'}`}
            >
              English
            </button>
            <button
              onClick={() => setBilingualLang('hindi')}
              className={`px-2.5 py-1 rounded-lg cursor-pointer ${bilingualLang === 'hindi' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-500'}`}
            >
              हिन्दी
            </button>
          </div>
        </div>
      </div>

      {/* Main Scorecard Banner with Blue Theme */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-6 sm:p-8 border border-slate-800 shadow-2xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-bold text-xs uppercase tracking-wider border border-blue-500/40">
                Official Result & 7-Part Analytics
              </span>
              <span className="text-xs text-slate-400 font-medium">
                Attempted on {attempt.date}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              {attempt.mockTitle}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
              Exam: {attempt.examName} • Compared against {attempt.totalParticipants.toLocaleString()} All-India candidates.
            </p>

            {/* Cutoff pill with category chooser & Reattempt Button */}
            <div className="mt-4 flex flex-wrap items-center gap-2.5">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-xs">
                <Target className="w-4 h-4 text-emerald-400" />
                <span className="text-slate-300 font-semibold">Cutoff Category:</span>
                <select
                  value={userCategory}
                  onChange={(e) => setUserCategory(e.target.value as any)}
                  className="bg-slate-900/90 text-white font-extrabold text-xs px-2 py-1 rounded-lg border border-white/30 outline-none cursor-pointer"
                >
                  <option value="general">General / UR (Cutoff: {currentMock?.cutoffMarks.general || 135})</option>
                  <option value="obc">OBC (Cutoff: {currentMock?.cutoffMarks.obc || 128})</option>
                  <option value="sc_st">SC / ST (Cutoff: {currentMock?.cutoffMarks.sc_st || 115})</option>
                  <option value="ews">EWS (Cutoff: {currentMock?.cutoffMarks.ews || 124})</option>
                </select>
                <span className={`font-black px-2 py-0.5 rounded text-[11px] ${
                  isCutoffCleared ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
                }`}>
                  {isCutoffCleared ? '🎉 Cutoff Cleared!' : '⚠️ Below Cutoff'}
                </span>
              </div>

              {currentMock && (
                <button
                  onClick={() => setReattemptModalOpen(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-extrabold text-xs shadow-md shadow-emerald-500/20 flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reattempt Test Now</span>
                </button>
              )}
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full lg:w-auto">
            
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 text-center backdrop-blur-sm">
              <span className="text-[11px] uppercase font-bold text-slate-400 block mb-1">Your Score</span>
              <span className="text-2xl font-black text-blue-400">
                {attempt.score}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">out of {attempt.totalMarks}</span>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 text-center backdrop-blur-sm">
              <span className="text-[11px] uppercase font-bold text-slate-400 block mb-1">AIR Rank</span>
              <span className="text-2xl font-black text-emerald-400">
                #{attempt.rank.toLocaleString()}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Top {Math.max(1, Math.round(100 - attempt.percentile))}%</span>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 text-center backdrop-blur-sm">
              <span className="text-[11px] uppercase font-bold text-slate-400 block mb-1">Percentile</span>
              <span className="text-2xl font-black text-purple-400">
                {attempt.percentile}%
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">All India Level</span>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 text-center backdrop-blur-sm">
              <span className="text-[11px] uppercase font-bold text-slate-400 block mb-1">Accuracy</span>
              <span className="text-2xl font-black text-blue-300">
                {attempt.accuracy}%
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">{attempt.correctCount} Correct</span>
            </div>

          </div>

        </div>
      </div>

      {/* TOP SECTION OF ANALYTICS: Topic Health & Mastery (Round Chart) */}
      <TopicMasteryImageChart
        allTopicStats={allTopicStats}
        masteredTopics={masteredTopics}
        averageTopics={averageTopics}
        weakTopicsList={weakTopicsList}
        unattemptedTopics={unattemptedTopics}
        masteredPercent={masteredPercent}
        averagePercent={averagePercent}
        weakPercent={weakPercent}
        unattemptedPercent={unattemptedPercent}
        openPdfReader={openPdfReader}
        currentMock={currentMock}
        isTopSection={true}
      />

      {/* 7-PART ANALYTICS NAVIGATOR (The Complete Diagnostic Framework) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800">
        {[
          { id: 'part1_scorecard', label: 'Part 1: Overall Scorecard', icon: Award },
          { id: 'part2_sections', label: 'Part 2: Sectional Cutoff', icon: Layers },
          { id: 'part3_time', label: 'Part 3: Time & Speedometer', icon: Clock },
          { id: 'part4_accuracy', label: 'Part 4: Negative Marking Loss', icon: AlertTriangle },
          { id: 'part5_difficulty', label: 'Part 5: Difficulty Matrix', icon: Compass },
          { id: 'part6_topics', label: 'Part 6: Topic Mastery & Gaps', icon: Lightbulb },
          { id: 'part7_topper', label: 'Part 7: Topper & Peer Curve', icon: Users },
          { id: 'solutions', label: 'Question Solutions', icon: CheckCircle2 }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeAnalysisPart === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveAnalysisPart(tab.id as any)}
              className={`px-4 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* PART 1: OVERALL SCORECARD & TIER EVALUATION */}
      {activeAnalysisPart === 'part1_scorecard' && (
        <div className="space-y-6">
          {/* Diagnostic Image Graph Chart for Part 1 */}
          <ScorecardImageChart
            attempt={attempt}
            currentMock={currentMock}
            grossMarks={grossMarks}
            negativePenaltyTotal={negativePenaltyTotal}
            userCategory={userCategory}
            onCategoryChange={setUserCategory}
            activeCutoff={activeCutoff}
            isCutoffCleared={isCutoffCleared}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-blue-600" />
              <span>Score Summary</span>
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                <span className="text-slate-500">Gross Marks (Before Penalty):</span>
                <strong className="text-slate-900 dark:text-white font-mono">{grossMarks.toFixed(1)}</strong>
              </div>
              <div className="flex justify-between p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300">
                <span>Negative Marks Incurred:</span>
                <strong className="font-mono">-{negativePenaltyTotal.toFixed(2)}</strong>
              </div>
              <div className="flex justify-between p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-bold">
                <span>Final Normalized Score:</span>
                <strong className="text-sm font-mono">{attempt.score}</strong>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-emerald-600" />
              <span>Cutoff Benchmark</span>
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between p-2.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">General Category Cutoff:</span>
                <strong>{currentMock?.cutoffMarks.general || 135}</strong>
              </div>
              <div className="flex justify-between p-2.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">OBC Category Cutoff:</span>
                <strong>{currentMock?.cutoffMarks.obc || 128}</strong>
              </div>
              <div className="flex justify-between p-2.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">SC/ST Category Cutoff:</span>
                <strong>{currentMock?.cutoffMarks.sc_st || 115}</strong>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-bold text-center">
                {attempt.clearedCutoff ? '✅ You have cleared the qualifying cutoff mark!' : '⚠️ Score is below general cutoff. Review recommended lesson PDF notes.'}
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-500" />
              <span>Earned Performance Tier</span>
            </h3>
            <div className="text-center p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl space-y-2">
              <span className="text-2xl font-black text-blue-600 dark:text-blue-400 block">
                {attempt.earnedTier} Level Ranker
              </span>
              <p className="text-xs text-slate-500 leading-relaxed">
                {attempt.earnedTier === 'Gold' 
                  ? 'Eligible for Laptop, Smartphone gifts and direct "Teach With Us" hiring contract up to ₹1,00,000/mo!'
                  : attempt.earnedTier === 'Silver'
                  ? 'Eligible to submit your phone number for "Teach With Us" educator hiring!'
                  : 'Practice more 10-50 question segments to advance to Silver & Gold tiers.'}
              </p>
              <button
                onClick={() => setCurrentView('teach_with_us')}
                className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs shadow-md cursor-pointer"
              >
                View Teacher Opportunities →
              </button>
            </div>
          </div>

          {/* TOPIC-WISE ANALYSIS PREVIEW (Round Chart & Chart Form Together) */}
          <div className="md:col-span-3 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                    <PieChart className="w-4 h-4" />
                  </span>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                    Topic-Wise Analysis (Round Chart & Chart Form Together)
                  </h3>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                    {allTopicStats.length} Exam Topics Tested
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Diagnostic breakdown of your strengths and weak areas across all individual syllabus topics.
                </p>
              </div>

              <button
                onClick={() => setActiveAnalysisPart('part6_topics')}
                className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>Full Topic Diagnostic (Part 6)</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Side-by-side: Round Chart on Left + Bar Chart Form on Right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Left Column: Round Chart (Donut Chart) */}
              <div className="lg:col-span-5 flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-2">
                  Topic Mastery Distribution (Round Chart)
                </span>
                
                <div className="relative w-44 h-44 flex items-center justify-center my-1">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    {/* Background Track */}
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      fill="transparent"
                      stroke="currentColor"
                      strokeWidth="11"
                      className="text-slate-200 dark:text-slate-700/60"
                    />
                    {/* Segment 1: Mastered (Emerald) */}
                    {masteredPercent > 0 && (
                      <circle
                        cx="50"
                        cy="50"
                        r="38"
                        fill="transparent"
                        stroke="#10b981"
                        strokeWidth="11"
                        strokeDasharray={`${seg1Dash} ${donutC - seg1Dash}`}
                        strokeDashoffset={seg1Offset}
                        strokeLinecap="round"
                        className="transition-all duration-700"
                      />
                    )}
                    {/* Segment 2: Average (Blue) */}
                    {averagePercent > 0 && (
                      <circle
                        cx="50"
                        cy="50"
                        r="38"
                        fill="transparent"
                        stroke="#3b82f6"
                        strokeWidth="11"
                        strokeDasharray={`${seg2Dash} ${donutC - seg2Dash}`}
                        strokeDashoffset={seg2Offset}
                        strokeLinecap="round"
                        className="transition-all duration-700"
                      />
                    )}
                    {/* Segment 3: Weak / Needs Revision (Rose) */}
                    {weakPercent > 0 && (
                      <circle
                        cx="50"
                        cy="50"
                        r="38"
                        fill="transparent"
                        stroke="#f43f5e"
                        strokeWidth="11"
                        strokeDasharray={`${seg3Dash} ${donutC - seg3Dash}`}
                        strokeDashoffset={seg3Offset}
                        strokeLinecap="round"
                        className="transition-all duration-700"
                      />
                    )}
                    {/* Segment 4: Skipped (Slate) */}
                    {unattemptedPercent > 0 && (
                      <circle
                        cx="50"
                        cy="50"
                        r="38"
                        fill="transparent"
                        stroke="#94a3b8"
                        strokeWidth="11"
                        strokeDasharray={`${seg4Dash} ${donutC - seg4Dash}`}
                        strokeDashoffset={seg4Offset}
                        strokeLinecap="round"
                        className="transition-all duration-700"
                      />
                    )}
                  </svg>

                  {/* Inside Center of Round Donut */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-2xl font-black font-mono text-slate-900 dark:text-white leading-tight">
                      {masteredPercent}%
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">
                      Topic Mastery
                    </span>
                    <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                      {masteredTopics.length}/{totalTopicsCount} Strong
                    </span>
                  </div>
                </div>

                {/* Round Chart Legend */}
                <div className="grid grid-cols-2 gap-2 w-full mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                    <span className="text-slate-600 dark:text-slate-300 font-semibold truncate">Mastered: {masteredTopics.length}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0" />
                    <span className="text-slate-600 dark:text-slate-300 font-semibold truncate">Average: {averageTopics.length}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0" />
                    <span className="text-slate-600 dark:text-slate-300 font-semibold truncate">Needs Work: {weakTopicsList.length}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-400 shrink-0" />
                    <span className="text-slate-600 dark:text-slate-300 font-semibold truncate">Skipped: {unattemptedTopics.length}</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Chart Form (Horizontal Multi-Topic Bars) */}
              <div className="lg:col-span-7 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    <BarChart3 className="w-3.5 h-3.5 text-blue-500" />
                    Topic Performance Bars (Chart Form)
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    Green = Correct • Red = Wrong • Gray = Skipped
                  </span>
                </div>

                <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                  {allTopicStats.slice(0, 5).map((topic) => {
                    const correctPct = (topic.correct / topic.total) * 100;
                    const incorrectPct = (topic.incorrect / topic.total) * 100;
                    const skippedPct = (topic.skipped / topic.total) * 100;

                    return (
                      <div key={topic.topic} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1.5 min-w-0 pr-2">
                            <span className="font-extrabold text-slate-800 dark:text-slate-100 truncate">
                              {topic.topic}
                            </span>
                            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 shrink-0">
                              {topic.section.split(' ')[0]}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-[11px] font-mono font-bold text-slate-500">
                              {topic.correct}/{topic.total} Qs
                            </span>
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-md font-mono ${
                              topic.accuracy >= 75
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                : topic.accuracy >= 40
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                                : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                            }`}>
                              {topic.accuracy}%
                            </span>
                          </div>
                        </div>

                        {/* Tri-colored Horizontal Segmented Bar */}
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 flex overflow-hidden">
                          {correctPct > 0 && (
                            <div 
                              className="bg-emerald-500 h-full transition-all duration-500" 
                              style={{ width: `${correctPct}%` }}
                              title={`${topic.correct} Correct`}
                            />
                          )}
                          {incorrectPct > 0 && (
                            <div 
                              className="bg-rose-500 h-full transition-all duration-500" 
                              style={{ width: `${incorrectPct}%` }}
                              title={`${topic.incorrect} Incorrect`}
                            />
                          )}
                          {skippedPct > 0 && (
                            <div 
                              className="bg-slate-400 dark:bg-slate-600 h-full transition-all duration-500" 
                              style={{ width: `${skippedPct}%` }}
                              title={`${topic.skipped} Skipped`}
                            />
                          )}
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-slate-400">
                          <span>Avg Time: {topic.avgTimeSec}s/Q</span>
                          <span className={topic.score >= 0 ? 'text-emerald-600 font-bold' : 'text-rose-600 font-bold'}>
                            Score: {topic.score >= 0 ? `+${topic.score.toFixed(1)}` : topic.score.toFixed(1)} Marks
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      )}

      {/* PART 2: SECTIONAL PERFORMANCE & CUTOFF BREAKDOWN */}
      {activeAnalysisPart === 'part2_sections' && (
        <div className="space-y-6">
          {/* Diagnostic Image Graph Chart for Part 2 */}
          <SectionalCutoffImageChart attempt={attempt} />

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white mb-4">
              Sectional Performance, Accuracy & Time Matrix Table
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="p-3 rounded-l-xl">Section Name</th>
                    <th className="p-3">Marks Scored</th>
                    <th className="p-3">Max Marks</th>
                    <th className="p-3">Accuracy</th>
                    <th className="p-3">Correct / Wrong</th>
                    <th className="p-3">Time Spent</th>
                    <th className="p-3 rounded-r-xl">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  {Object.entries(attempt.sectionScores).map(([secName, secData]) => {
                    const mins = Math.floor(secData.timeSeconds / 60);
                    const secs = secData.timeSeconds % 60;
                    return (
                      <tr key={secName} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="p-3 font-bold text-slate-900 dark:text-white">{secName}</td>
                        <td className="p-3 font-mono font-bold text-blue-600">{secData.score}</td>
                        <td className="p-3 font-mono text-slate-500">{secData.totalPossible}</td>
                        <td className="p-3">
                          <span className={`font-bold ${secData.accuracy >= 80 ? 'text-emerald-600' : secData.accuracy >= 60 ? 'text-blue-600' : 'text-rose-600'}`}>
                            {secData.accuracy}%
                          </span>
                        </td>
                        <td className="p-3 font-mono">
                          <span className="text-emerald-600 font-bold">{secData.correct}</span> / <span className="text-rose-600 font-bold">{secData.incorrect}</span>
                        </td>
                        <td className="p-3 font-mono text-slate-600 dark:text-slate-400">
                          {mins}m {secs}s
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            secData.score >= secData.totalPossible * 0.6
                              ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                              : 'bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                          }`}>
                            {secData.score >= secData.totalPossible * 0.6 ? 'Passed' : 'Needs Practice'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* PART 3: TIME MANAGEMENT & SPEEDOMETER */}
      {activeAnalysisPart === 'part3_time' && (
        <div className="space-y-6">
          {/* Diagnostic Image Graph Chart for Part 3 */}
          <TimeSpeedometerImageChart
            attempt={attempt}
            questions={questions}
            avgSpeedSec={avgSpeedSec}
            fastCount={fastCount}
            idealCount={idealCount}
            overtimeCount={overtimeCount}
            timeWastedWrongSec={timeWastedWrongSec}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <span>Speed & Pace Breakdown</span>
            </h3>
            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400">Average Time / Question:</span>
                <span className="text-base font-bold font-mono text-blue-600">{avgSpeedSec} Seconds</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400">Total Test Duration Taken:</span>
                <span className="text-base font-bold font-mono text-slate-800 dark:text-white">
                  {Math.floor(attempt.totalTimeSeconds / 60)}m {attempt.totalTimeSeconds % 60}s
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              <span>Pace Distribution</span>
            </h3>
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between items-center p-2 rounded-xl bg-blue-50 dark:bg-blue-950/40">
                <span>⚡ Rapid Answered (&lt;45s):</span>
                <strong className="font-mono font-bold text-blue-700 dark:text-blue-300">{fastCount} Qs</strong>
              </div>
              <div className="flex justify-between items-center p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40">
                <span>⏱️ Optimal Timing (45s - 90s):</span>
                <strong className="font-mono font-bold text-emerald-700 dark:text-emerald-300">{idealCount} Qs</strong>
              </div>
              <div className="flex justify-between items-center p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40">
                <span>⏳ Overtime (&gt;90s spent):</span>
                <strong className="font-mono font-bold text-rose-700 dark:text-rose-300">{overtimeCount} Qs</strong>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
              <span>Time Wasted on Wrong Answers</span>
            </h3>
            <div className="p-4 bg-rose-50 dark:bg-rose-950/40 rounded-2xl border border-rose-500/20 text-center space-y-2">
              <span className="text-2xl font-black font-mono text-rose-600 dark:text-rose-400">
                {Math.round(timeWastedWrongSec / 60)} Mins {timeWastedWrongSec % 60}s
              </span>
              <p className="text-xs text-rose-800 dark:text-rose-300">
                You spent this time on questions that resulted in negative penalties. If reallocated, your score could increase by +14 to +22 marks!
              </p>
            </div>
          </div>
        </div>
        </div>
      )}

      {/* PART 4: ACCURACY & SPEED-ACCURACY MATRIX */}
      {activeAnalysisPart === 'part4_accuracy' && (
        <div className="space-y-6">
          {/* Diagnostic Image Graph Chart for Part 4 */}
          <NegativeLossImageChart
            attempt={attempt}
            questions={questions}
            negativePenaltyTotal={negativePenaltyTotal}
            grossMarks={grossMarks}
            rapidAccurateCount={rapidAccurateCount}
            slowAccurateCount={slowAccurateCount}
            rushedWrongCount={rushedWrongCount}
            slowWrongCount={slowWrongCount}
          />

          {/* Top 4 Accuracy Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                Net Overall Accuracy
              </span>
              <div className="text-3xl font-black font-mono text-blue-600 dark:text-blue-400">
                {netAccuracyPercent}%
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 mt-2">
                <div 
                  className={`h-2 rounded-full ${netAccuracyPercent >= 80 ? 'bg-emerald-500' : netAccuracyPercent >= 60 ? 'bg-blue-500' : 'bg-rose-500'}`}
                  style={{ width: `${netAccuracyPercent}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-500 block pt-1">
                {attempt.correctCount} correct of {totalAttemptedCount} attempted
              </span>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Correct Attempts
              </span>
              <div className="text-3xl font-black font-mono text-emerald-600 dark:text-emerald-400">
                {attempt.correctCount} <span className="text-xs text-slate-400 font-normal">Qs</span>
              </div>
              <p className="text-[11px] text-slate-500 pt-1">
                +{(attempt.correctCount * 2).toFixed(1)} raw marks earned
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                Unforced Errors
              </span>
              <div className="text-3xl font-black font-mono text-rose-600 dark:text-rose-400">
                {attempt.incorrectCount} <span className="text-xs text-slate-400 font-normal">Qs</span>
              </div>
              <p className="text-[11px] text-rose-600 font-semibold pt-1">
                -{negativePenaltyTotal.toFixed(2)} marks lost in negative
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                Selection Readiness
              </span>
              <div className="text-3xl font-black font-mono text-indigo-600 dark:text-indigo-400">
                {netAccuracyPercent >= 80 ? '92%' : netAccuracyPercent >= 65 ? '74%' : '51%'}
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mt-1 ${
                netAccuracyPercent >= 80 
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
              }`}>
                {netAccuracyPercent >= 80 ? 'Tier-1 Cutoff Safe' : 'Borderline Zone'}
              </span>
            </div>
          </div>

          {/* Speed vs Accuracy 4-Quadrant Analysis */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <Compass className="w-5 h-5 text-indigo-600" />
                  <span>Speed vs Accuracy Matrix (4 Quadrants)</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Categorization of every attempted question based on time threshold (60s) vs correctness.
                </p>
              </div>
              <span className="text-[10px] px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 font-mono font-bold text-slate-600 dark:text-slate-400">
                Total Attempted: {totalAttemptedCount} Qs
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Quadrant 1: Rapid & Accurate (Ideal) */}
              <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Q1: Rapid & Accurate (&le;60s)
                  </span>
                  <span className="text-xl font-black font-mono text-emerald-700 dark:text-emerald-300">
                    {rapidAccurateCount} Qs
                  </span>
                </div>
                <p className="text-[11px] text-emerald-700 dark:text-emerald-300 leading-snug">
                  High-speed mastery questions. You answered quickly and accurately. This is your core scoring strength!
                </p>
              </div>

              {/* Quadrant 2: Slow but Accurate */}
              <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-300 dark:border-blue-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-blue-800 dark:text-blue-300 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-blue-600" />
                    Q2: Accurate but Slow (&gt;60s)
                  </span>
                  <span className="text-xl font-black font-mono text-blue-700 dark:text-blue-300">
                    {slowAccurateCount} Qs
                  </span>
                </div>
                <p className="text-[11px] text-blue-700 dark:text-blue-300 leading-snug">
                  Accurate, but consumed excessive seconds. Practice shortcut formulas and trick elimination to save time here.
                </p>
              </div>

              {/* Quadrant 3: Rushed & Wrong (High Hazard) */}
              <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    Q3: Rushed & Wrong (&le;60s)
                  </span>
                  <span className="text-xl font-black font-mono text-amber-700 dark:text-amber-300">
                    {rushedWrongCount} Qs
                  </span>
                </div>
                <p className="text-[11px] text-amber-700 dark:text-amber-300 leading-snug">
                  Careless unforced errors! You jumped to options without reading completely. Slow down slightly to verify options.
                </p>
              </div>

              {/* Quadrant 4: Slow & Wrong (Time Sink & Negative Penalty) */}
              <div className="p-4 rounded-2xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-300 dark:border-rose-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-rose-800 dark:text-rose-300 flex items-center gap-1.5">
                    <XCircle className="w-4 h-4 text-rose-600" />
                    Q4: Slow & Wrong (&gt;60s)
                  </span>
                  <span className="text-xl font-black font-mono text-rose-700 dark:text-rose-300">
                    {slowWrongCount} Qs
                  </span>
                </div>
                <p className="text-[11px] text-rose-700 dark:text-rose-300 leading-snug">
                  Worst-case scenario: heavy time wasted PLUS -0.50 negative penalty. Learn the art of skipping these early!
                </p>
              </div>
            </div>
          </div>

          {/* Section-wise Accuracy Comparison Bars */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              <span>Section-wise Accuracy Breakdown</span>
            </h3>

            <div className="space-y-4">
              {Object.entries(attempt.sectionScores).map(([secName, secData]) => {
                const totalAtt = secData.correct + secData.incorrect;
                const acc = totalAtt > 0 ? Math.round((secData.correct / totalAtt) * 100) : 0;
                return (
                  <div key={secName} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 space-y-2 border border-slate-200/60 dark:border-slate-700/60">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-800 dark:text-slate-200">
                        {secName}
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono text-slate-500">
                          {secData.correct} Correct / {secData.incorrect} Wrong
                        </span>
                        <span className={`text-xs font-black font-mono px-2 py-0.5 rounded-lg ${
                          acc >= 80 
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : acc >= 60
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        }`}>
                          {acc}% Accuracy
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          acc >= 80 ? 'bg-emerald-500' : acc >= 60 ? 'bg-blue-500' : 'bg-rose-500'
                        }`}
                        style={{ width: `${acc}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Negative Penalty & Recommendations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Negative Marking Penalty Impact
              </h3>
              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl space-y-3 text-xs">
                <div className="flex justify-between">
                  <span>Gross Score Earned:</span>
                  <strong className="text-emerald-600 font-mono font-bold">+{attempt.correctCount * 2} Marks</strong>
                </div>
                <div className="flex justify-between">
                  <span>Negative Penalty Incurred:</span>
                  <strong className="text-rose-600 font-mono font-bold">-{negativePenaltyTotal.toFixed(2)} Marks</strong>
                </div>
                <div className="flex justify-between">
                  <span>Unattempted Question Impact:</span>
                  <strong className="text-slate-500 font-mono">{attempt.unattemptedCount} Skipped (0 Deduction)</strong>
                </div>
                <div className="border-t border-slate-200 dark:border-slate-700 pt-2 flex justify-between font-bold text-sm">
                  <span>Final Net Score:</span>
                  <span className="text-blue-600 font-mono">{attempt.score} Marks</span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Tactical Exam Recommendation
              </h3>
              <div className="p-4 bg-blue-50 dark:bg-blue-950/40 rounded-2xl border border-blue-500/20 text-xs text-blue-950 dark:text-blue-200 space-y-2">
                <p>
                  <strong>Eliminate Unforced Errors:</strong> You took {attempt.incorrectCount} incorrect attempts. At TCS iON exams, leaving an unsure question unattempted protects your rank by preventing deductions.
                </p>
                <p>
                  <strong>Accuracy Rule:</strong> Aim for 90%+ accuracy in your strongest sections (Reasoning & English) before gambling on difficult Quantitative problems.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PART 5: DIFFICULTY-LEVEL PERFORMANCE MATRIX */}
      {activeAnalysisPart === 'part5_difficulty' && (
        <div className="space-y-6">
          {/* Diagnostic Image Graph Chart for Part 5 */}
          <DifficultyMatrixImageChart
            easyStats={easyStats}
            medStats={medStats}
            hardStats={hardStats}
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-xs uppercase">
              Easy Questions
            </span>
            <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
              {easyStats.accuracy}%
            </div>
            <p className="text-xs text-slate-500">
              {easyStats.correct} Correct out of {easyStats.attempted} Attempted ({easyStats.total} Total Easy Qs in paper)
            </p>
            <div className="text-[11px] font-semibold text-emerald-600">
              Benchmark Target: 95%+ Accuracy
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold text-xs uppercase">
              Medium Questions
            </span>
            <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
              {medStats.accuracy}%
            </div>
            <p className="text-xs text-slate-500">
              {medStats.correct} Correct out of {medStats.attempted} Attempted ({medStats.total} Total Med Qs in paper)
            </p>
            <div className="text-[11px] font-semibold text-blue-600">
              Benchmark Target: 75%+ Accuracy
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold text-xs uppercase">
              Hard Questions
            </span>
            <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
              {hardStats.accuracy}%
            </div>
            <p className="text-xs text-slate-500">
              {hardStats.correct} Correct out of {hardStats.attempted} Attempted ({hardStats.total} Total Hard Qs in paper)
            </p>
            <div className="text-[11px] font-semibold text-purple-600">
              Benchmark Target: 50%+ Accuracy
            </div>
          </div>
        </div>
        </div>
      )}

      {/* PART 6: TOPIC-WISE ANALYSIS (CHART FORM & ROUND CHART TOGETHER) */}
      {activeAnalysisPart === 'part6_topics' && (
        <div className="space-y-6">
          {/* Diagnostic Image Graph Chart for Part 6 */}
          <TopicMasteryImageChart
            allTopicStats={allTopicStats}
            masteredTopics={masteredTopics}
            averageTopics={averageTopics}
            weakTopicsList={weakTopicsList}
            unattemptedTopics={unattemptedTopics}
            masteredPercent={masteredPercent}
            averagePercent={averagePercent}
            weakPercent={weakPercent}
            unattemptedPercent={unattemptedPercent}
            openPdfReader={openPdfReader}
            currentMock={currentMock}
          />

          {/* Header & Section Filter Tabs */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-blue-600" />
                  <span>Topic-Wise Performance Diagnostic (Chart Form & Round Chart Together)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Complete chapter-by-chapter diagnostic: Identify which specific syllabus areas drive your score and where negative marking was lost.
                </p>
              </div>

              {/* Filter by Section */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-bold scrollbar-thin">
                <button
                  onClick={() => setTopicSectionFilter('ALL')}
                  className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                    topicSectionFilter === 'ALL'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  All Sections ({allTopicStats.length})
                </button>
                {distinctTopicSections.map(sec => (
                  <button
                    key={sec}
                    onClick={() => setTopicSectionFilter(sec)}
                    className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                      topicSectionFilter === sec
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    {sec}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* DUAL CHARTS TOGETHER: ROUND CHART (LEFT) & CHART FORM (RIGHT) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* 1. ROUND CHART (DONUT MASTERY & DISTRIBUTION) */}
            <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <PieChart className="w-4 h-4 text-emerald-500" />
                  <span>Topic Health & Mastery (Round Chart)</span>
                </h4>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  {masteredTopics.length} Strong
                </span>
              </div>

              {/* Round Donut Chart SVG */}
              <div className="flex flex-col items-center justify-center">
                <div className="relative w-52 h-52 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    {/* Background Track */}
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      fill="transparent"
                      stroke="currentColor"
                      strokeWidth="12"
                      className="text-slate-100 dark:text-slate-800"
                    />
                    {/* Segment 1: Mastered (Emerald) */}
                    {masteredPercent > 0 && (
                      <circle
                        cx="50"
                        cy="50"
                        r="38"
                        fill="transparent"
                        stroke="#10b981"
                        strokeWidth="12"
                        strokeDasharray={`${seg1Dash} ${donutC - seg1Dash}`}
                        strokeDashoffset={seg1Offset}
                        strokeLinecap="round"
                        className="transition-all duration-700"
                      />
                    )}
                    {/* Segment 2: Average (Blue) */}
                    {averagePercent > 0 && (
                      <circle
                        cx="50"
                        cy="50"
                        r="38"
                        fill="transparent"
                        stroke="#3b82f6"
                        strokeWidth="12"
                        strokeDasharray={`${seg2Dash} ${donutC - seg2Dash}`}
                        strokeDashoffset={seg2Offset}
                        strokeLinecap="round"
                        className="transition-all duration-700"
                      />
                    )}
                    {/* Segment 3: Weak / Needs Revision (Rose) */}
                    {weakPercent > 0 && (
                      <circle
                        cx="50"
                        cy="50"
                        r="38"
                        fill="transparent"
                        stroke="#f43f5e"
                        strokeWidth="12"
                        strokeDasharray={`${seg3Dash} ${donutC - seg3Dash}`}
                        strokeDashoffset={seg3Offset}
                        strokeLinecap="round"
                        className="transition-all duration-700"
                      />
                    )}
                    {/* Segment 4: Skipped (Slate) */}
                    {unattemptedPercent > 0 && (
                      <circle
                        cx="50"
                        cy="50"
                        r="38"
                        fill="transparent"
                        stroke="#94a3b8"
                        strokeWidth="12"
                        strokeDasharray={`${seg4Dash} ${donutC - seg4Dash}`}
                        strokeDashoffset={seg4Offset}
                        strokeLinecap="round"
                        className="transition-all duration-700"
                      />
                    )}
                  </svg>

                  {/* Inside Center of Round Donut */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-3xl font-black font-mono text-slate-900 dark:text-white leading-tight">
                      {masteredPercent}%
                    </span>
                    <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-tight">
                      Topic Mastery
                    </span>
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                      {masteredTopics.length} of {totalTopicsCount} Topics Mastered
                    </span>
                  </div>
                </div>

                {/* Round Chart Segment Breakdown Legend */}
                <div className="grid grid-cols-2 gap-2.5 w-full mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <div className="p-2.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40">
                    <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300 font-bold mb-0.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                      <span>Mastered (&ge;75%)</span>
                    </div>
                    <div className="text-lg font-black font-mono text-emerald-800 dark:text-emerald-200">
                      {masteredTopics.length} <span className="text-xs font-normal text-slate-400">({masteredPercent}%)</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/40">
                    <div className="flex items-center gap-1.5 text-blue-700 dark:text-blue-300 font-bold mb-0.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0" />
                      <span>Average (40-74%)</span>
                    </div>
                    <div className="text-lg font-black font-mono text-blue-800 dark:text-blue-200">
                      {averageTopics.length} <span className="text-xs font-normal text-slate-400">({averagePercent}%)</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/40">
                    <div className="flex items-center gap-1.5 text-rose-700 dark:text-rose-300 font-bold mb-0.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0" />
                      <span>Needs Work (&lt;40%)</span>
                    </div>
                    <div className="text-lg font-black font-mono text-rose-800 dark:text-rose-200">
                      {weakTopicsList.length} <span className="text-xs font-normal text-slate-400">({weakPercent}%)</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-bold mb-0.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-400 shrink-0" />
                      <span>Skipped / Unvisited</span>
                    </div>
                    <div className="text-lg font-black font-mono text-slate-700 dark:text-slate-200">
                      {unattemptedTopics.length} <span className="text-xs font-normal text-slate-400">({unattemptedPercent}%)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. CHART FORM (TOPIC-WISE HORIZONTAL PROGRESS BARS) */}
            <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-blue-600" />
                    <span>Topic Performance Bars (Chart Form)</span>
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Showing {filteredTopics.length} topics • Visual accuracy & score breakdown
                  </p>
                </div>

                <div className="flex items-center gap-2 text-[10px] font-bold">
                  <span className="flex items-center gap-1 text-emerald-600">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" /> Correct
                  </span>
                  <span className="flex items-center gap-1 text-rose-600">
                    <span className="w-2 h-2 rounded-full bg-rose-500" /> Incorrect
                  </span>
                  <span className="flex items-center gap-1 text-slate-400">
                    <span className="w-2 h-2 rounded-full bg-slate-400" /> Skipped
                  </span>
                </div>
              </div>

              {/* Topic Bars List */}
              <div className="space-y-3.5 max-h-[520px] overflow-y-auto pr-1.5 scrollbar-thin">
                {filteredTopics.map((topic) => {
                  const correctPct = (topic.correct / topic.total) * 100;
                  const incorrectPct = (topic.incorrect / topic.total) * 100;
                  const skippedPct = (topic.skipped / topic.total) * 100;
                  const isWeak = topic.accuracy < 40 && (topic.correct + topic.incorrect) > 0;

                  return (
                    <div 
                      key={topic.topic} 
                      className={`p-3.5 rounded-2xl border transition-all ${
                        isWeak
                          ? 'bg-rose-50/30 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/40'
                          : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-700/60'
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="font-extrabold text-xs text-slate-900 dark:text-white truncate">
                            {topic.topic}
                          </span>
                          <span className="text-[9px] font-mono px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 shrink-0">
                            {topic.section}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-xs font-mono font-bold text-slate-500">
                            {topic.correct} Right • {topic.incorrect} Wrong
                          </span>
                          <span className={`text-xs font-black font-mono px-2 py-0.5 rounded-lg ${
                            topic.accuracy >= 75
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : topic.accuracy >= 40
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                              : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          }`}>
                            {topic.accuracy}% Acc
                          </span>
                        </div>
                      </div>

                      {/* Tri-colored Stacked Segmented Progress Bar */}
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 flex overflow-hidden shadow-inner my-1.5">
                        {correctPct > 0 && (
                          <div 
                            className="bg-emerald-500 h-full transition-all duration-500 flex items-center justify-center text-[9px] font-black text-white" 
                            style={{ width: `${correctPct}%` }}
                            title={`${topic.correct} Correct (${Math.round(correctPct)}%)`}
                          >
                            {correctPct >= 20 ? `${Math.round(correctPct)}%` : ''}
                          </div>
                        )}
                        {incorrectPct > 0 && (
                          <div 
                            className="bg-rose-500 h-full transition-all duration-500 flex items-center justify-center text-[9px] font-black text-white" 
                            style={{ width: `${incorrectPct}%` }}
                            title={`${topic.incorrect} Incorrect (${Math.round(incorrectPct)}%)`}
                          >
                            {incorrectPct >= 20 ? `${Math.round(incorrectPct)}%` : ''}
                          </div>
                        )}
                        {skippedPct > 0 && (
                          <div 
                            className="bg-slate-400 dark:bg-slate-600 h-full transition-all duration-500 flex items-center justify-center text-[9px] font-black text-white/80" 
                            style={{ width: `${skippedPct}%` }}
                            title={`${topic.skipped} Skipped (${Math.round(skippedPct)}%)`}
                          >
                            {skippedPct >= 25 ? `${topic.skipped} Skip` : ''}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                        <span>Avg Speed: <strong>{topic.avgTimeSec}s</strong> per question</span>
                        <div className="flex items-center gap-3">
                          <span className={topic.score >= 0 ? 'text-emerald-600 font-bold' : 'text-rose-600 font-bold'}>
                            Net Marks: {topic.score >= 0 ? `+${topic.score.toFixed(1)}` : topic.score.toFixed(1)}
                          </span>
                          {currentMock && (
                            <button
                              onClick={() => openPdfReader(currentMock)}
                              className="text-[10px] text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-bold cursor-pointer"
                            >
                              <BookOpen className="w-3 h-3" />
                              <span>Lesson PDF</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Actionable Topic Revision Guides */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="font-extrabold text-base text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                <span>Mastered Topics ({masteredTopics.length} Chapters)</span>
              </h3>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {masteredTopics.length > 0 ? (
                  masteredTopics.map((top, idx) => (
                    <div key={idx} className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl text-xs font-semibold text-emerald-900 dark:text-emerald-200 flex items-center justify-between">
                      <div>
                        <span className="font-bold">{top.topic}</span>
                        <span className="text-[10px] text-slate-400 block">{top.section}</span>
                      </div>
                      <span className="text-[10px] bg-emerald-200 dark:bg-emerald-900 px-2.5 py-1 rounded-lg font-bold font-mono">
                        {top.accuracy}% Accuracy
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500">Attempt more mock test segments to identify 75%+ mastery topics.</p>
                )}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="font-extrabold text-base text-rose-600 dark:text-rose-400 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                <span>Weak Topics Requiring Revision ({weakTopicsList.length} Chapters)</span>
              </h3>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {weakTopicsList.length > 0 ? (
                  weakTopicsList.map((top, idx) => (
                    <div key={idx} className="p-3 bg-rose-50 dark:bg-rose-950/40 rounded-xl text-xs font-semibold text-rose-900 dark:text-rose-200 flex items-center justify-between">
                      <div>
                        <span className="font-bold">{top.topic}</span>
                        <span className="text-[10px] text-slate-400 block">{top.section} • {top.incorrect} mistakes</span>
                      </div>
                      {currentMock && (
                        <button
                          onClick={() => openPdfReader(currentMock)}
                          className="px-2.5 py-1 rounded-lg bg-rose-600 text-white font-bold text-[10px] hover:bg-rose-500 cursor-pointer shadow-sm shrink-0"
                        >
                          Revise in PDF →
                        </button>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500">No major recurring topic errors detected in this attempt!</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PART 7: TOPPER PEER BENCHMARK & PERCENTILE CURVE */}
      {activeAnalysisPart === 'part7_topper' && (
        <div className="space-y-6">
          {/* Diagnostic Image Graph Chart for Part 7 */}
          <TopperPeerCurveImageChart attempt={attempt} currentMock={currentMock} />

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              Comparative Benchmark: You vs Average Candidate vs AIR 1 Topper
            </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 space-y-1">
              <span className="text-xs font-bold text-blue-600 block uppercase">You</span>
              <span className="text-2xl font-black text-blue-600 font-mono">{attempt.score}</span>
              <span className="text-[11px] text-slate-500 block">Accuracy: {attempt.accuracy}%</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
              <span className="text-xs font-bold text-slate-500 block uppercase">Average Aspirant</span>
              <span className="text-2xl font-black text-slate-700 dark:text-slate-300 font-mono">
                {attempt.topperComparison?.averageScore || 92}
              </span>
              <span className="text-[11px] text-slate-500 block">Accuracy: 64%</span>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-1">
              <span className="text-xs font-bold text-emerald-600 block uppercase">Rank 1 Topper</span>
              <span className="text-2xl font-black text-emerald-600 font-mono">
                {attempt.topperComparison?.topperScore || 188}
              </span>
              <span className="text-[11px] text-slate-500 block">Accuracy: 96%</span>
            </div>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-400 space-y-2">
            <span className="font-bold text-slate-800 dark:text-white block">Key Topper Insights:</span>
            <p>1. The Rank 1 topper achieved 96% accuracy by skipping 4 high-risk tricky questions rather than taking negative penalties.</p>
            <p>2. Topper finished Quantitative Aptitude in 22 minutes (1.4x faster), leaving 12 minutes for double-checking calculations.</p>
          </div>
        </div>
        </div>
      )}

      {/* SOLUTIONS BROWSER */}
      {activeAnalysisPart === 'solutions' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-bold">
              {[
                { id: 'ALL', label: `All Questions (${questions.length})` },
                { id: 'INCORRECT', label: `Incorrect (${attempt.incorrectCount})` },
                { id: 'CORRECT', label: `Correct (${attempt.correctCount})` },
                { id: 'SKIPPED', label: `Skipped (${attempt.unattemptedCount})` }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setQuestionFilter(f.id as any)}
                  className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                    questionFilter === f.id
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {filteredQuestions.map((q, idx) => {
              const userAns = attempt.userAnswers[q.id];
              const isAnswered = userAns !== undefined && userAns !== -1;
              const isCorrect = isAnswered && userAns === q.correctAnswerIndex;
              const isBookmarked = bookmarkedQuestions.includes(q.id);

              return (
                <div
                  key={q.id}
                  className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                        Q{idx + 1}. {q.section}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold">
                        {q.difficulty}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                        isCorrect
                          ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                          : isAnswered
                          ? 'bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                      }`}>
                        {isCorrect ? 'Correct (+2)' : isAnswered ? 'Incorrect (-0.5)' : 'Skipped (0)'}
                      </span>

                      <button
                        onClick={() => toggleBookmarkQuestion(q.id)}
                        className="p-1 rounded text-slate-400 hover:text-emerald-500 cursor-pointer"
                        title="Bookmark question"
                      >
                        <Flag className={`w-4 h-4 ${isBookmarked ? 'fill-emerald-500 text-emerald-500' : ''}`} />
                      </button>
                    </div>
                  </div>

                  <p className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white">
                    {bilingualLang === 'hindi' && q.questionTextHindi ? q.questionTextHindi : q.questionText}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {q.options.map((opt, optIdx) => {
                      const isCorrectChoice = optIdx === q.correctAnswerIndex;
                      const isUserChoice = userAns === optIdx;

                      let style = 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300';
                      if (isCorrectChoice) {
                        style = 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500/50 text-emerald-900 dark:text-emerald-200 font-bold';
                      } else if (isUserChoice && !isCorrectChoice) {
                        style = 'bg-rose-50 dark:bg-rose-950/60 border-rose-500/50 text-rose-900 dark:text-rose-200 line-through';
                      }

                      return (
                        <div key={optIdx} className={`p-3 rounded-xl border flex items-center justify-between ${style}`}>
                          <span>({String.fromCharCode(65 + optIdx)}) {opt}</span>
                          {isCorrectChoice && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
                          {isUserChoice && !isCorrectChoice && <X className="w-4 h-4 text-rose-600 shrink-0" />}
                        </div>
                      );
                    })}
                  </div>

                  {/* Detailed Explanation */}
                  <div className="p-4 bg-blue-50/60 dark:bg-blue-950/30 rounded-2xl border border-blue-200 dark:border-blue-800/60 text-xs space-y-1">
                    <span className="font-extrabold text-blue-700 dark:text-blue-300 block">
                      Detailed Solution & Step-by-Step Derivation:
                    </span>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                      {bilingualLang === 'hindi' && q.explanationHindi ? q.explanationHindi : q.explanation}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Reattempt Facility Modal with 3 booster modes */}
      <ReattemptModal
        isOpen={reattemptModalOpen}
        onClose={() => setReattemptModalOpen(false)}
        currentMock={currentMock}
        attempt={attempt}
        allAttemptsForThisMock={attempts.filter(a => a.mockId === attempt.mockId)}
        onStartFull={handleReattemptFull}
        onStartMistakes={handleReattemptMistakes}
        onStartSpeedDrill={handleReattemptSpeedDrill}
      />

    </div>
  );
};
