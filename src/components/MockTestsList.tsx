import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MockTest, MockTestType } from '../types';
import { SegmentModal } from './SegmentModal';
import { 
  FileText, 
  BookOpen, 
  Layers, 
  Play, 
  Clock, 
  Sparkles, 
  Search, 
  Lock,
  ChevronDown,
  RotateCcw,
  BarChart3,
  CheckCircle2,
  Target,
  Check,
  Bookmark
} from 'lucide-react';

export const MockTestsList: React.FC = () => {
  const { 
    mockTests, 
    adminExams,
    selectedExamName,
    setSelectedExamName,
    startFullMockTest, 
    openPdfReader,
    setSubscriptionModalOpen,
    isTestFreeForStudent,
    currentUser,
    attempts,
    viewAttemptAnalytics,
    bookmarkedMockTestIds,
    toggleBookmarkMockTest,
    isMockTestBookmarked,
    t
  } = useApp();

  const [selectedType, setSelectedType] = useState<MockTestType | 'ALL' | 'BOOKMARKED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAllExams, setFilterAllExams] = useState(false);
  const [examDropdownOpen, setExamDropdownOpen] = useState(false);
  const [bookmarkToast, setBookmarkToast] = useState<string | null>(null);
  
  // Segment modal target test
  const [segmentTargetTest, setSegmentTargetTest] = useState<MockTest | null>(null);

  const handleToggleBookmark = (test: MockTest) => {
    const willBookmark = !isMockTestBookmarked(test.id);
    toggleBookmarkMockTest(test.id);
    setBookmarkToast(willBookmark ? `⭐ "${test.title}" saved to Bookmarks for later practice!` : `Removed from Bookmarked Tests`);
    setTimeout(() => setBookmarkToast(null), 2500);
  };

  const filteredTests = mockTests.filter(t => {
    const matchesExam = filterAllExams ? true : (selectedType === 'BOOKMARKED' ? true : t.examName === selectedExamName);
    const matchesType = selectedType === 'ALL' 
      ? true 
      : selectedType === 'BOOKMARKED'
      ? isMockTestBookmarked(t.id)
      : t.type === selectedType;
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.examName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesExam && matchesType && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      
      {/* Bookmark notification toast */}
      {bookmarkToast && (
        <div className="bg-amber-600 text-white px-4 py-2.5 rounded-2xl shadow-xl flex items-center justify-between text-xs font-bold animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2">
            <Bookmark className="w-4 h-4 fill-white text-white" />
            <span>{bookmarkToast}</span>
          </div>
          <button onClick={() => setBookmarkToast(null)} className="text-white hover:text-amber-200 font-extrabold cursor-pointer ml-3">✕</button>
        </div>
      )}
      
      {/* Top Banner with Modern Stylish Exam Chooser and Blue Theme */}
      <div className="bg-gradient-to-r from-blue-800 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-wrap items-center justify-between gap-6 border border-blue-500/20">
        <div className="max-w-2xl space-y-3">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-blue-200 font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-300" /> TCS iON CBT Pattern
            </span>
            <span className="text-xs text-blue-100">10 Indian Languages Supported</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
            Official Mock Tests for <span className="text-emerald-300 underline decoration-emerald-400/50 underline-offset-4">{selectedExamName}</span>
          </h1>

          <p className="text-xs sm:text-sm text-blue-100">
            Real TCS iON simulator with timer, question palette, and attached study lesson notes. 1 test free for chapterwise, full mock, and sectional practice.
          </p>

          {/* Modern Stylish Exam Chooser in Banner */}
          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            <span className="text-xs font-black uppercase text-blue-200 tracking-wider flex items-center gap-1">
              <Target className="w-3.5 h-3.5 text-blue-400" />
              Switch Target Exam:
            </span>
            
            <div className="relative">
              <button
                type="button"
                onClick={() => setExamDropdownOpen(prev => !prev)}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white text-blue-950 font-black text-xs sm:text-sm shadow-md border border-white transition-all cursor-pointer group active:scale-95"
              >
                <Target className="w-3.5 h-3.5 text-blue-600 group-hover:rotate-45 transition-transform" />
                <span className="max-w-[170px] sm:max-w-[240px] truncate">{selectedExamName}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-blue-800 transition-transform ${examDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {examDropdownOpen && (
                <div 
                  className="absolute left-0 mt-2 w-72 sm:w-88 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-2 z-50 text-slate-800 dark:text-slate-100 max-h-80 overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="px-2.5 py-1 text-[10px] font-black uppercase text-slate-400 border-b border-slate-100 dark:border-slate-800 mb-1">
                    Select Target Examination
                  </div>
                  {adminExams.map(ex => {
                    const isSelected = selectedExamName === ex.name;
                    return (
                      <button
                        key={ex.id}
                        type="button"
                        onClick={() => {
                          setSelectedExamName(ex.name);
                          setExamDropdownOpen(false);
                          setFilterAllExams(false);
                        }}
                        className={`w-full text-left p-2 rounded-xl text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-blue-600 text-white font-black'
                            : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <div className="truncate pr-2">
                          <div className="truncate">{ex.name}</div>
                          <div className={`text-[10px] font-normal ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                            {ex.category} • {ex.scope === 'State' ? ex.stateName || 'State PSC' : 'Central'}
                          </div>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-white shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <button
              onClick={() => setFilterAllExams(prev => !prev)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer border ${
                filterAllExams
                  ? 'bg-emerald-500 text-white border-emerald-500 font-black shadow-md'
                  : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
              }`}
            >
              {filterAllExams ? '✓ Showing All Exams Mocks' : 'Show All Exams Mocks'}
            </button>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-center min-w-[170px]">
          <span className="text-2xl font-black text-emerald-300 block">
            {filteredTests.length} Tests
          </span>
          <span className="text-xs text-blue-200 font-semibold">Available for Practice</span>
        </div>
      </div>

      {/* Sub-Filters: Full / Chapter / Section / Bookmarked */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs font-bold overflow-x-auto max-w-full">
          {[
            { id: 'ALL', label: 'All Types' },
            { id: 'chapter_wise', label: 'Chapterwise' },
            { id: 'full_mock', label: 'Full Length Mocks' },
            { id: 'section_wise', label: 'Section-wise' },
            { id: 'BOOKMARKED', label: `⭐ Saved Bookmarks (${bookmarkedMockTestIds.length})` }
          ].map(type => (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id as any)}
              className={`px-3 py-1.5 rounded-xl transition-colors cursor-pointer whitespace-nowrap ${
                selectedType === type.id
                  ? 'bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search questions, lessons, topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-white"
          />
        </div>
      </div>

      {/* Tests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTests.map((test) => {
          const isFree = isTestFreeForStudent(test);
          const userAttemptsForTest = attempts.filter(a => a.mockId === test.id);
          const hasAttempted = userAttemptsForTest.length > 0;
          const lastAttempt = userAttemptsForTest[0];
          const isBookmarked = isMockTestBookmarked(test.id);

          return (
            <div
              key={test.id}
              className={`bg-white dark:bg-slate-900 rounded-3xl p-6 border shadow-sm flex flex-col justify-between space-y-4 hover:border-blue-500/40 transition-all group ${
                isBookmarked ? 'border-amber-400/50 dark:border-amber-500/30' : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-500/20">
                      {test.type === 'full_mock' ? 'Full Mock' : test.type === 'section_wise' ? 'Sectional' : 'Chapterwise'}
                    </span>
                    {isFree && (
                      <span className="text-[10px] font-black px-2 py-0.5 rounded bg-blue-600 text-white uppercase">
                        Free Test
                      </span>
                    )}
                    {hasAttempted && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-1 border border-emerald-500/30">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Attempted ({lastAttempt.score} M)</span>
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {test.durationMinutes} mins
                    </span>

                    {/* Bookmark Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleBookmark(test);
                      }}
                      className={`p-1.5 rounded-xl border transition-all cursor-pointer ${
                        isBookmarked
                          ? 'bg-amber-500/15 text-amber-500 border-amber-500/40 shadow-xs'
                          : 'text-slate-400 hover:text-amber-500 hover:border-amber-300 dark:hover:border-slate-700 border-slate-200 dark:border-slate-800'
                      }`}
                      title={isBookmarked ? "Saved in Bookmarks (Click to remove)" : "Bookmark mock test for later practice"}
                      aria-label="Bookmark mock test"
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-500 text-amber-500' : ''}`} />
                    </button>
                  </div>
                </div>

                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  {test.examName}
                </span>

                <h3 className="font-extrabold text-base text-slate-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {test.title}
                </h3>
                
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                  {test.description}
                </p>

                {/* Test Meta Info */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                    <span className="text-[10px] text-slate-400 block font-semibold">Questions</span>
                    <strong className="text-slate-800 dark:text-slate-200">{test.questions.length} Qs</strong>
                  </div>
                  <div className="p-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                    <span className="text-[10px] text-slate-400 block font-semibold">Marks</span>
                    <strong className="text-slate-800 dark:text-slate-200">{test.totalMarks}</strong>
                  </div>
                  <div className="p-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                    <span className="text-[10px] text-slate-400 block font-semibold">Cutoff</span>
                    <strong className="text-emerald-600 dark:text-emerald-400">{test.cutoffMarks.general}</strong>
                  </div>
                </div>

                {/* Attached PDF Notice Bar */}
                <div className="mt-3 p-2.5 rounded-2xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-500/20 text-xs flex items-center justify-between text-blue-950 dark:text-blue-200">
                  <div className="flex items-center gap-1.5 truncate pr-2">
                    <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                    <span className="truncate font-semibold">{test.attachedPdf.title}</span>
                  </div>
                  <button
                    onClick={() => openPdfReader(test)}
                    className="shrink-0 px-2 py-1 rounded-lg bg-blue-600 text-white font-bold text-[10px] hover:bg-blue-500 cursor-pointer"
                  >
                    Read PDF
                  </button>
                </div>
              </div>

              {/* Action Buttons: START TEST IN BLUE OR REATTEMPT IF ATTEMPTED */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                {hasAttempted ? (
                  <>
                    <button
                      onClick={() => viewAttemptAnalytics(lastAttempt.id)}
                      className="flex-1 py-2 px-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      title="View detailed scorecard and 7-part analytics"
                    >
                      <BarChart3 className="w-3.5 h-3.5 text-blue-500" />
                      <span>Result</span>
                    </button>

                    <button
                      onClick={() => {
                        if (isFree || currentUser.subscription.active) {
                          startFullMockTest(test);
                        } else {
                          setSubscriptionModalOpen(true);
                        }
                      }}
                      className="flex-1 py-2 px-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-md bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-600/20 transition-all cursor-pointer active:scale-95"
                      title="Reattempt this test to improve score"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reattempt</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setSegmentTargetTest(test)}
                      className="flex-1 py-2.5 px-3 rounded-xl border border-blue-500/40 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>10-100 Qs</span>
                    </button>

                    <button
                      onClick={() => {
                        if (isFree || currentUser.subscription.active) {
                          setSegmentTargetTest(test);
                        } else {
                          setSubscriptionModalOpen(true);
                        }
                      }}
                      className="flex-1 py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-md bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/25 transition-all cursor-pointer active:scale-95"
                    >
                      {isFree || currentUser.subscription.active ? (
                        <>
                          <Play className="w-3.5 h-3.5 fill-white" />
                          <span>Start Test</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-3.5 h-3.5" />
                          <span>7-Day Free Trial</span>
                        </>
                      )}
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State when no tests found */}
      {filteredTests.length === 0 && (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 p-8 space-y-3">
          <Bookmark className="w-12 h-12 text-amber-400 mx-auto opacity-75" />
          <h3 className="font-extrabold text-slate-800 dark:text-slate-200 text-base">
            {selectedType === 'BOOKMARKED' ? 'No bookmarked mock tests yet' : 'No matching mock tests found'}
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            {selectedType === 'BOOKMARKED' 
              ? 'Click the bookmark icon (⭐) on any mock test card to save it here for later practice and focused revision sessions.'
              : 'Try changing your search keywords or resetting the type filters to see all available tests.'}
          </p>
          {selectedType === 'BOOKMARKED' && (
            <button
              onClick={() => setSelectedType('ALL')}
              className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs cursor-pointer shadow-md"
            >
              Browse All Mock Tests
            </button>
          )}
        </div>
      )}

      {/* Segment Customizer Modal */}
      <SegmentModal
        test={segmentTargetTest}
        isOpen={!!segmentTargetTest}
        onClose={() => setSegmentTargetTest(null)}
      />

    </div>
  );
};
