import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ExamNotificationTimeline } from '../types';
import { 
  Calendar, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  ExternalLink, 
  Search, 
  Filter, 
  Building, 
  Sparkles,
  ArrowRight,
  Globe,
  BookOpen,
  X,
  GraduationCap,
  Layers,
  ShieldCheck,
  Target
} from 'lucide-react';

export const ExamTimelineSection: React.FC = () => {
  const { notificationsTimeline, setSelectedExamName } = useApp();
  const [scopeFilter, setScopeFilter] = useState<'ALL' | 'Central' | 'State' | 'None'>('ALL');
  const [selectedState, setSelectedState] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDetailsExam, setActiveDetailsExam] = useState<ExamNotificationTimeline | null>(null);

  // Extract distinct state names from notifications
  const availableStates = Array.from(
    new Set(
      notificationsTimeline
        .filter(n => n.scope === 'State' && n.stateName)
        .map(n => n.stateName as string)
    )
  );

  const filteredTimeline = notificationsTimeline.filter(item => {
    const matchesScope = scopeFilter === 'ALL' || item.scope === scopeFilter;
    const matchesState = selectedState === 'ALL' || item.stateName === selectedState;
    const matchesSearch = item.examName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.stateName && item.stateName.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesScope && matchesState && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Exam Schedule & Dates Tracker (Central, State & Entrance)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Track notification dates, exam dates, admit cards and result declaration dates with direct Apply Online links.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search exams, boards, states..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-white"
          />
        </div>
      </div>

      {/* Scope Filter Tabs: Central vs State vs None/All */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <button
            onClick={() => {
              setScopeFilter('ALL');
              setSelectedState('ALL');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              scopeFilter === 'ALL'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            All Exams ({notificationsTimeline.length})
          </button>

          <button
            onClick={() => {
              setScopeFilter('Central');
              setSelectedState('ALL');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 whitespace-nowrap ${
              scopeFilter === 'Central'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            <Building className="w-3.5 h-3.5" />
            <span>Central Govt Exams</span>
          </button>

          <button
            onClick={() => {
              setScopeFilter('State');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 whitespace-nowrap ${
              scopeFilter === 'State'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>State Govt Exams</span>
          </button>

          <button
            onClick={() => {
              setScopeFilter('None');
              setSelectedState('ALL');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 whitespace-nowrap ${
              scopeFilter === 'None'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>General Entrance / Other</span>
          </button>
        </div>

        {/* State Dropdown (when State is selected or active) */}
        {scopeFilter === 'State' && (
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Select State:</span>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-white"
            >
              <option value="ALL">All States</option>
              {availableStates.map(st => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Timeline Cards - Short & Compact for easy scanning */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filteredTimeline.map((item) => (
          <div
            key={item.id}
            className="bg-white dark:bg-slate-900 rounded-2xl p-3.5 sm:p-4 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-500/50 hover:shadow-md transition-all flex flex-col justify-between space-y-2.5"
          >
            <div>
              {/* Scope & Status Badges */}
              <div className="flex items-center justify-between gap-1.5 mb-1.5">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-500/20 truncate">
                  {item.scope === 'State' ? (item.stateName || 'State') : item.scope === 'None' ? 'General' : 'Central'} • {item.category}
                </span>

                <span className={`text-[10px] font-bold px-2 py-0.5 rounded shrink-0 ${
                  item.status === 'Result Declared' 
                    ? 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300'
                    : item.status === 'Admit Card Released'
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                    : 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                }`}>
                  {item.status}
                </span>
              </div>

              {/* Exam Title & Vacancy */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white leading-tight">
                    {item.examName}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {item.department}
                  </p>
                </div>
                {/* Vacancy Badge */}
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-black bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800 shrink-0">
                  🎯 {item.postsCount || '5,000+ Posts'}
                </span>
              </div>

              {/* Compact 3-Dates Bar */}
              <div className="mt-2.5 grid grid-cols-3 gap-1.5 text-center text-[10px] bg-slate-50 dark:bg-slate-800/60 p-1.5 rounded-xl border border-slate-100 dark:border-slate-800">
                <div>
                  <span className="text-slate-400 block text-[9px] font-semibold">Notif Out</span>
                  <strong className="text-slate-700 dark:text-slate-200 font-mono text-[10px]">{item.notificationOutDate}</strong>
                </div>
                <div className="border-x border-slate-200 dark:border-slate-700/60">
                  <span className="text-blue-500 block text-[9px] font-bold">Exam Date</span>
                  <strong className="text-blue-700 dark:text-blue-300 font-mono text-[10px]">{item.examDate}</strong>
                </div>
                <div>
                  <span className="text-emerald-600 block text-[9px] font-bold">Result</span>
                  <strong className="text-emerald-700 dark:text-emerald-300 font-mono text-[10px]">{item.resultDate}</strong>
                </div>
              </div>
            </div>

            {/* Bottom Row: Detailed Syllabus & Eligibility + Official Apply Button */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <button
                type="button"
                onClick={() => setActiveDetailsExam(item)}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 font-extrabold text-[11px] transition-colors cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>Detailed Syllabus & Eligibility →</span>
              </button>

              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-[150px]" title={item.eligibility}>
                  Edu: {item.eligibility}
                </span>

                <a
                  href={item.applyLink}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold text-[11px] flex items-center gap-1 transition-all shadow-sm active:scale-95 shrink-0"
                >
                  <span>Apply Online</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Syllabus & Eligibility Modal */}
      {activeDetailsExam && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-150"
          onClick={() => setActiveDetailsExam(null)}
        >
          <div 
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 text-white p-5 border-b border-blue-500/30 flex items-start justify-between gap-3 shrink-0">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-blue-500/30 text-blue-200 border border-blue-400/30">
                    {activeDetailsExam.category}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/10 text-white">
                    {activeDetailsExam.scope === 'State' ? activeDetailsExam.stateName || 'State PSC' : 'Central Govt'}
                  </span>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-emerald-500/30 text-emerald-200">
                    {activeDetailsExam.postsCount}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {activeDetailsExam.examName}
                </h2>
                <p className="text-xs text-blue-200 font-medium">
                  {activeDetailsExam.department}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActiveDetailsExam(null)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content: Detailed Eligibility & Detailed Syllabus */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
              
              {/* Part 1: Detailed Eligibility Criteria */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
                  <GraduationCap className="w-5 h-5 text-blue-600" />
                  <h3 className="font-black text-base text-slate-900 dark:text-white">
                    Official Eligibility Criteria & Relaxation
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-900/60 space-y-1">
                    <span className="text-[10px] font-black uppercase text-blue-700 dark:text-blue-300">
                      🎓 Educational Qualification
                    </span>
                    <p className="font-bold text-slate-800 dark:text-slate-200 leading-relaxed">
                      {activeDetailsExam.detailedEligibility?.educationalQualification || activeDetailsExam.eligibility}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200/80 dark:border-indigo-900/60 space-y-1">
                    <span className="text-[10px] font-black uppercase text-indigo-700 dark:text-indigo-300">
                      ⏳ Age Limit & Criteria
                    </span>
                    <p className="font-bold text-slate-800 dark:text-slate-200 leading-relaxed">
                      {activeDetailsExam.detailedEligibility?.ageLimit || '18 to 30 Years (Crucial Date)'}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                    <span className="text-[10px] font-black uppercase text-slate-500">
                      📋 Category Age Relaxation
                    </span>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-semibold">
                      {activeDetailsExam.detailedEligibility?.ageRelaxation || 'OBC: +3 Yrs | SC/ST: +5 Yrs | PwD: +10 Yrs'}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                    <span className="text-[10px] font-black uppercase text-slate-500">
                      🩺 Physical & Medical Standards
                    </span>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-semibold">
                      {activeDetailsExam.detailedEligibility?.physicalStandards || 'Standard Vision and fitness as per official cadre guidelines.'}
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-900/60 space-y-1 text-xs">
                  <span className="text-[10px] font-black uppercase text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Selection Process Stages
                  </span>
                  <p className="font-bold text-slate-800 dark:text-slate-200 leading-relaxed">
                    {activeDetailsExam.detailedEligibility?.selectionProcess || 'Preliminary Examination (Tier 1) → Main Examination (Tier 2) → Skill / Typing Test → Document Verification.'}
                  </p>
                </div>
              </div>

              {/* Part 2: Detailed Syllabus Breakdown */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-indigo-600" />
                    <h3 className="font-black text-base text-slate-900 dark:text-white">
                      Official Detailed Syllabus & Topic Breakdown
                    </h3>
                  </div>
                  <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800">
                    Negative: {activeDetailsExam.detailedSyllabus?.negativeMarking || '0.50 / 0.33 Marks'}
                  </span>
                </div>

                <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <strong>Exam Pattern:</strong> {activeDetailsExam.detailedSyllabus?.examPattern || 'Computer Based Examination with Multiple Choice Questions.'}
                </div>

                {/* Phases / Tiers */}
                <div className="space-y-4">
                  {(activeDetailsExam.detailedSyllabus?.phases || [
                    {
                      phaseName: 'Tier 1 / Prelims CBT Exam',
                      duration: '60 Minutes',
                      marks: '100 - 200 Marks',
                      subjects: [
                        { name: 'General Intelligence & Reasoning', questionsCount: 25, marksCount: 50, topics: ['Analogies', 'Classification', 'Series', 'Coding-Decoding', 'Blood Relations', 'Venn Diagrams'] },
                        { name: 'General Awareness & Static GK', questionsCount: 25, marksCount: 50, topics: ['History', 'Geography', 'Indian Polity', 'Economy', 'General Science', 'Current Affairs'] },
                        { name: 'Quantitative Aptitude / Mathematics', questionsCount: 25, marksCount: 50, topics: ['Number Systems', 'Percentages', 'Ratio & Proportion', 'Time & Work', 'Algebra', 'Trigonometry'] },
                        { name: 'Language Comprehension (English/Hindi)', questionsCount: 25, marksCount: 50, topics: ['Reading Comprehension', 'Grammar', 'Vocabulary', 'Sentence Correction'] }
                      ]
                    },
                    {
                      phaseName: 'Tier 2 / Mains Written CBT',
                      duration: '120-150 Minutes',
                      marks: '300+ Marks',
                      subjects: [
                        { name: 'Advanced Domain Knowledge & Reasoning', questionsCount: 60, marksCount: 180, topics: ['Advanced Mathematics', 'Analytical Reasoning', 'Computer Proficiency'] }
                      ]
                    }
                  ]).map((phase, pIdx) => (
                    <div 
                      key={pIdx}
                      className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden bg-slate-50/50 dark:bg-slate-800/40"
                    >
                      <div className="bg-slate-100 dark:bg-slate-800 px-4 py-2.5 border-b border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-2">
                        <span className="font-black text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5 text-blue-600" />
                          <span>{phase.phaseName}</span>
                        </span>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
                          {phase.duration && <span>⏱️ {phase.duration}</span>}
                          {phase.marks && <span>• 🎯 {phase.marks}</span>}
                        </div>
                      </div>

                      <div className="p-4 space-y-3">
                        {phase.subjects.map((sub, sIdx) => (
                          <div key={sIdx} className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-black text-slate-900 dark:text-white">
                                {sub.name}
                              </span>
                              {(sub.questionsCount || sub.marksCount) && (
                                <span className="text-[10px] font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded-md">
                                  {sub.questionsCount ? `${sub.questionsCount} Qs` : ''} 
                                  {sub.marksCount ? ` • ${sub.marksCount} Marks` : ''}
                                </span>
                              )}
                            </div>

                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {sub.topics.map((t, tIdx) => (
                                <span 
                                  key={tIdx}
                                  className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                                >
                                  {t}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
              {activeDetailsExam.applyLink ? (
                <a
                  href={activeDetailsExam.applyLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:underline"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Visit Official Recruitment Portal</span>
                </a>
              ) : (
                <span className="text-xs text-slate-400">Portal link under release</span>
              )}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveDetailsExam(null)}
                  className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedExamName(activeDetailsExam.examName);
                    setActiveDetailsExam(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs shadow-md shadow-blue-600/25 flex items-center gap-1.5 cursor-pointer"
                >
                  <Target className="w-3.5 h-3.5" />
                  <span>Set as Target Exam</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
