export type ExamCategory = 
  | 'SSC' 
  | 'Railways' 
  | 'Banking' 
  | 'State PSC' 
  | 'Defence' 
  | 'Teaching'
  | string;

export type MockTestType = 'full_mock' | 'section_wise' | 'chapter_wise';

export type UserLevelTier = 'Bronze' | 'Silver' | 'Gold';

export interface Question {
  id: string;
  questionNumber: number;
  questionText: string;
  questionTextHindi?: string;
  options: string[];
  optionsHindi?: string[];
  correctAnswerIndex: number; // 0, 1, 2, 3
  explanation: string;
  explanationHindi?: string;
  section: string;
  topic: string;
  marksPositive: number;
  marksNegative: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  idealTimeSeconds?: number;
  translations?: Record<string, {
    questionText: string;
    options: string[];
    explanation?: string;
  }>;
  subsection?: string; // Subsection or subtopic facility configured by admin
}

export interface AttachedPdf {
  title: string;
  pagesCount: number;
  summary: string;
  contentMarkdown: string;
  readTimeMinutes: number;
  pdfDataUrl?: string; // Original uploaded PDF file data URL for native device reading
  fileName?: string;
}

export interface MockTest {
  id: string;
  category: string;
  examName: string;
  title: string;
  description: string;
  type: MockTestType;
  chapterOrSectionName?: string;
  subsection?: string; // Subsection / sub-tier name configured by admin
  parentMockId?: string; // ID of parent mock test if this is a sub-mock
  isSubMock?: boolean;
  durationMinutes: number;
  totalMarks: number;
  totalQuestions: number;
  sections: string[];
  subsections?: string[];
  attachedPdf: AttachedPdf;
  questions: Question[];
  cutoffMarks: {
    general: number;
    obc: number;
    sc_st: number;
    ews: number;
  };
  attemptsCount: number;
  avgScore: number;
  isFree?: boolean;
}

export interface WebsiteBannerConfig {
  enabled: boolean;
  badgeText: string;
  headingText: string;
  subheadingText: string;
  imageUrl?: string;
  textDesign: 'gradient_modern' | 'neon_glow' | 'cyber_gold' | 'bold_clean' | 'royal_ruby';
  textAlignment: 'left' | 'center' | 'right';
  ctaButtonText: string;
  ctaButtonAction: 'trial' | 'mocks' | 'ebooks' | 'tracker';
}

export interface AdminExam {
  id: string;
  name: string;
  category: string;
  scope: 'Central' | 'State' | 'None'; // 'None' option included
  stateName?: string;
  description: string;
  freeLimits: {
    chapterWiseFree: number;
    fullMockFree: number;
    sectionWiseFree: number;
  };
  cutoffMarks?: {
    general: number;
    obc: number;
    sc_st: number;
    ews: number;
  };
}

export interface ExamAttempt {
  id: string;
  mockId: string;
  mockTitle: string;
  examName: string;
  category: string;
  userCategory?: 'general' | 'obc' | 'sc_st' | 'ews';
  targetCutoff?: number;
  date: string;
  totalTimeSeconds: number;
  userAnswers: Record<string, number>;
  questionStatus: Record<string, 'not_visited' | 'not_answered' | 'answered' | 'marked_for_review' | 'answered_and_marked'>;
  timeSpentPerQuestion: Record<string, number>;
  score: number;
  totalMarks: number;
  accuracy: number;
  percentile: number;
  rank: number;
  totalParticipants: number;
  correctCount: number;
  incorrectCount: number;
  unattemptedCount: number;
  sectionScores: Record<string, {
    score: number;
    totalPossible: number;
    correct: number;
    incorrect: number;
    unattempted: number;
    accuracy: number;
    timeSeconds: number;
  }>;
  weakTopics: string[];
  strongTopics: string[];
  clearedCutoff: boolean;
  earnedTier: UserLevelTier;
  isSegmentedSession?: boolean;
  segmentQuestionRange?: string;
  
  // Advanced 7-Part Analytics Data
  topperComparison?: {
    topperScore: number;
    topperAccuracy: number;
    topperTimeMinutes: number;
    averageScore: number;
    averageAccuracy: number;
  };
  speedMetrics?: {
    avgTimeCorrectSec: number;
    avgTimeIncorrectSec: number;
    fastestAnswerSec: number;
    slowestAnswerSec: number;
  };
}

export interface SubscriptionPlan {
  id: 'day1' | 'single_exam' | 'month6' | 'year1';
  name: string;
  durationLabel: string;
  durationDays: number;
  price: number;
  originalPrice: number;
  popular?: boolean;
  description: string;
  features: string[];
  targetExamName?: string;
}

export interface StudentUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  country?: string; // 'India' for all access, or international countries for eBooks/PDFs
  avatarUrl?: string;
  registeredDate: string;
  selectedExamName: string;
  userTier: UserLevelTier;
  isGoogleUser?: boolean;
  hasFreeTrialClaimed?: boolean;
  isSecurePassVisitor?: boolean;
  securePassToken?: string;
  subscription: {
    active: boolean;
    planId?: 'day1' | 'single_exam' | 'month6' | 'year1' | 'free_trial';
    planName?: string;
    expiresAt?: string;
    purchasedAt?: string;
    daysRemaining: number;
    unlockedExams: string[];
  };
  totalTestsGiven: number;
  avgAccuracy: number;
  avgScore: number;
  bookmarkedQuestionIds: string[];
  bookmarkedMockTestIds?: string[];
}

export interface CurrentAffairsItem {
  id: string;
  title: string;
  category: string;
  date: string;
  summary: string;
  bulletPoints: string[];
  pdfDataUrl?: string;
  fileName?: string;
}

export interface BroadcastNotification {
  id: string;
  title: string;
  message: string;
  date: string;
  type: 'Alert' | 'Admit Card' | 'New Mock Test' | 'Result' | 'Discount Offer';
  targetExam?: string;
}

export interface ExamDetailedSubject {
  name: string;
  questionsCount?: number;
  marksCount?: number;
  topics: string[];
}

export interface ExamDetailedPhase {
  phaseName: string;
  duration?: string;
  marks?: string;
  subjects: ExamDetailedSubject[];
}

export interface ExamNotificationTimeline {
  id: string;
  examName: string;
  department: string;
  category: string;
  scope: 'Central' | 'State' | 'None';
  stateName?: string;
  notificationOutDate: string;
  examDate: string;
  resultDate: string;
  postsCount: string;
  eligibility: string;
  status: 'Notification Out' | 'Admit Card Released' | 'Exam Scheduled' | 'Result Declared';
  applyLink: string; // Official apply link configured by admin
  officialNotificationText: string;
  detailedEligibility?: {
    educationalQualification: string;
    ageLimit: string;
    ageRelaxation?: string;
    nationality?: string;
    physicalStandards?: string;
    selectionProcess?: string;
  };
  detailedSyllabus?: {
    examPattern: string;
    negativeMarking: string;
    phases: ExamDetailedPhase[];
    importantTopicsSummary?: string;
  };
}

export interface EBook {
  id: string;
  title: string;
  category: string;
  subject: string;
  pages: number;
  fileSize: string;
  downloadsCount: number;
  description: string;
  chapters: string[];
  contentSummary: string;
  pdfDataUrl?: string; // Uploaded original PDF data URL for native viewing
  fileName?: string;
}

export interface TeachWithUsApplication {
  id: string;
  candidateName: string;
  candidateEmail?: string;
  mobileNumber: string; // Displayed clearly in admin panel
  phoneNumber?: string; // Alias
  subjectExpertise: string;
  userTier: UserLevelTier;
  highestAccuracy: number;
  appliedDate: string;
  status: 'Selected' | 'Interview Scheduled' | 'Under Review';
  notes?: string;
}

export type TeachWithUsCandidate = TeachWithUsApplication;

export interface WebsiteVisitorActivity {
  totalVisitors: number;
  liveVisitorsNow: number;
  testsRunningNow: number;
  recentActivities: {
    id: string;
    text: string;
    timestamp: string;
    type: 'test_start' | 'pdf_read' | 'pass_purchase' | 'high_score';
  }[];
}

export interface PaymentGatewayConfig {
  upiEnabled: boolean;
  upiId: string;
  upiReceiverName: string;
  qrCodeUrl?: string;
  razorpayEnabled: boolean;
  razorpayKeyId: string;
  testMode: boolean;
  couponCode?: string;
  couponDiscountPercent?: number; // e.g. 20 or 50%
  showDiscountCouponToStudents?: boolean; // Admin controls whether coupon code hint is displayed to visitors
  internationalPriceUsd?: number; // Price given by admin for international users (default $9.99)
  prices: {
    day1: number;
    single_exam: number;
    month6: number;
    year1: number;
  };
}

export interface LiveTest {
  id: string;
  examName: string;
  category: string;
  title: string;
  description: string;
  type: MockTestType; // 'full_mock' | 'section_wise' | 'chapter_wise'
  chapterOrSectionName?: string;
  classification?: string; // e.g. "All India National Championship", "Weekly Grand Prelims", written by admin
  scheduledStartTime: string; // ISO string e.g. "2026-09-29T10:00:00"
  durationMinutes: number;
  totalMarks: number;
  cutoffMarks?: {
    general: number;
    obc: number;
    sc_st: number;
    ews: number;
  };
  questions: Question[];
  status: 'Upcoming' | 'Live Now' | 'Completed';
  participantsCount: number;
}
