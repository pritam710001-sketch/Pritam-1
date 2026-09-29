import { 
  MockTest, 
  SubscriptionPlan, 
  StudentUser, 
  AdminExam, 
  ExamNotificationTimeline, 
  EBook, 
  PaymentGatewayConfig,
  TeachWithUsApplication,
  CurrentAffairsItem,
  BroadcastNotification,
  LiveTest
} from '../types';
import { MASTER_ADMIN_EXAMS, MASTER_NOTIFICATIONS_TIMELINE } from './examMasterDatabase';

const BASE_ADMIN_EXAMS: AdminExam[] = [
  {
    id: 'exam-ssc-cgl',
    name: 'SSC CGL 2026 Tier-1',
    category: 'SSC',
    scope: 'Central',
    description: 'Staff Selection Commission Combined Graduate Level Examination for Group B & C Central Ministries posts.',
    freeLimits: {
      chapterWiseFree: 1,
      fullMockFree: 1,
      sectionWiseFree: 1
    },
    cutoffMarks: {
      general: 135,
      obc: 128,
      sc_st: 115,
      ews: 124
    }
  },
  {
    id: 'exam-rrb-ntpc',
    name: 'RRB NTPC CEN 2026',
    category: 'Railways',
    scope: 'Central',
    description: 'Railway Recruitment Boards Non-Technical Popular Categories Stage 1 & 2 CBT exams.',
    freeLimits: {
      chapterWiseFree: 1,
      fullMockFree: 1,
      sectionWiseFree: 1
    },
    cutoffMarks: {
      general: 72,
      obc: 68,
      sc_st: 60,
      ews: 65
    }
  },
  {
    id: 'exam-ibps-po',
    name: 'IBPS PO Prelims 2026',
    category: 'Banking',
    scope: 'Central',
    description: 'Institute of Banking Personnel Selection Probationary Officer / Management Trainee recruitment.',
    freeLimits: {
      chapterWiseFree: 1,
      fullMockFree: 1,
      sectionWiseFree: 1
    },
    cutoffMarks: {
      general: 58,
      obc: 55,
      sc_st: 48,
      ews: 54
    }
  },
  {
    id: 'exam-wbpsc-clerk',
    name: 'WBPSC Clerkship 2026',
    category: 'State PSC',
    scope: 'State',
    stateName: 'West Bengal',
    description: 'West Bengal Public Service Commission Lower Division Clerk & Secretariat Assistant Examination.',
    freeLimits: {
      chapterWiseFree: 1,
      fullMockFree: 1,
      sectionWiseFree: 1
    },
    cutoffMarks: {
      general: 65,
      obc: 60,
      sc_st: 52,
      ews: 58
    }
  },
  {
    id: 'exam-bpsc-cce',
    name: 'BPSC Combined Competitive Exam',
    category: 'State PSC',
    scope: 'State',
    stateName: 'Bihar',
    description: 'Bihar Public Service Commission Deputy Collector, DSP & Revenue Officer Exam.',
    freeLimits: {
      chapterWiseFree: 1,
      fullMockFree: 1,
      sectionWiseFree: 1
    },
    cutoffMarks: {
      general: 91,
      obc: 86,
      sc_st: 75,
      ews: 84
    }
  },
  {
    id: 'exam-uppsc-ro',
    name: 'UPPSC Review Officer (RO/ARO)',
    category: 'State PSC',
    scope: 'State',
    stateName: 'Uttar Pradesh',
    description: 'Uttar Pradesh Public Service Commission Samiksha Adhikari recruitment test.',
    freeLimits: {
      chapterWiseFree: 1,
      fullMockFree: 1,
      sectionWiseFree: 1
    },
    cutoffMarks: {
      general: 125,
      obc: 120,
      sc_st: 108,
      ews: 118
    }
  }
];

// Merge BASE_ADMIN_EXAMS with all MASTER_ADMIN_EXAMS from the official PDF database
const baseExamNames = new Set(BASE_ADMIN_EXAMS.map(e => e.name.toLowerCase()));
export const INITIAL_ADMIN_EXAMS: AdminExam[] = [
  ...BASE_ADMIN_EXAMS,
  ...MASTER_ADMIN_EXAMS.filter(e => !baseExamNames.has(e.name.toLowerCase()))
];

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'day1',
    name: '7-Day Trial Pass (₹2 Only)',
    durationLabel: '7 Days Full Access (1 Device in 3 Months)',
    durationDays: 7,
    price: 2,
    originalPrice: 99,
    description: 'Special ₹2 Trial for 7 Days: Unrestricted access to all mock tests, attached PDFs & full CBT simulator. Strictly limited to 1 trial per device in 3 months (90 days) with Device Authentication.',
    features: [
      '₹2 Only for 7 Days Full Access to All Exams',
      'Max 1 Trial Per Device in 3 Months (90 Days)',
      'Device Authentication Permission Verified at Trial Time',
      'Read All Attached Study Lesson PDFs',
      'Customized 10 to 50 Qs Segments & Full Mocks',
      'TCS iON Real Exam Pattern Simulator & Analytics'
    ]
  },
  {
    id: 'single_exam',
    name: '1-Month All Exams Free Pass',
    durationLabel: '30 Days Full Access (All Exams Free)',
    durationDays: 30,
    price: 49,
    originalPrice: 299,
    description: 'Special ₹49 pass: All exams completely free and unlocked for 1 full month (30 days)!',
    features: [
      'ALL Exams Unlocked (SSC, Railways, Banking, State PSC)',
      '1 Month (30 Days) Full Unrestricted Access',
      'All Chapterwise, Section-wise & Full Length Mocks',
      'Complete Study Lesson PDF Guides for All Exams',
      'Performance Analytics & Cutoff Benchmarking'
    ]
  },
  {
    id: 'month6',
    name: '6-Month All Exams Pass (Most Recommended)',
    durationLabel: '180 Days Access (All Exams)',
    durationDays: 180,
    price: 199,
    originalPrice: 599,
    popular: true,
    description: '★ Highly Recommended: 6 Months complete access across all central and state exams. Best value for upcoming recruitment cycles.',
    features: [
      'All Exams (SSC, Railways, Banking, State PSC)',
      '180 Days Unlimited Live & Chapter Mocks',
      'Eligibility for Gold & Silver Level Gifts (Laptops & Phones)',
      'Teach With Us Opportunity (Earn up to ₹1 Lakh/month)',
      'State-wise & Central Exam Timelines Alerts'
    ]
  },
  {
    id: 'year1',
    name: '1-Year Full Selection Pass (365 Days)',
    durationLabel: 'Full 365 Days Access (Best Value)',
    durationDays: 365,
    price: 399,
    originalPrice: 1299,
    popular: true,
    description: '★ Top Choice for Serious Aspirants: Full 365 days guarantee preparation across 500+ mock tests & lesson notes.',
    features: [
      'Full 365 Days (1 Year) Complete Access',
      'All Central & State Exams Included',
      'Highest Priority in "Teach With Us" Hiring Program',
      'Eligible for Laptops, Phones & Topper Trophies in Gold Tier',
      'Permanent Access to 5000+ Question Bank'
    ]
  }
];

export const INITIAL_PAYMENT_CONFIG: PaymentGatewayConfig = {
  upiEnabled: true,
  upiId: 'uptoselection@okaxis',
  upiReceiverName: 'UPTO SELECTION Exam Prep Pvt Ltd',
  qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=upi://pay?pa=uptoselection@okaxis&pn=UPTO%20SELECTION&cu=INR',
  razorpayEnabled: true,
  razorpayKeyId: 'rzp_live_uptoselection_prod',
  testMode: true,
  couponCode: 'SELECTION50',
  couponDiscountPercent: 20,
  showDiscountCouponToStudents: true,
  internationalPriceUsd: 9.99,
  prices: {
    day1: 2,         // ₹2 for 7-Day Trial (Max 1 trial per device in 3 months)
    single_exam: 49, // 49 for all exams for 1 month
    month6: 199,     // 199 for all exams for 6 months
    year1: 399       // 399 for 1 year (365 days)
  }
};

export const INITIAL_CURRENT_AFFAIRS: CurrentAffairsItem[] = [
  {
    id: 'ca-01',
    title: 'Daily Current Affairs Capsule - National & International Exam Highlights',
    category: 'National & Economy',
    date: '2026-09-28',
    summary: 'Key exam-focused highlights: RBI Monetary Policy updates, India\'s new green hydrogen corridor launch, and G20 summit milestones.',
    bulletPoints: [
      'RBI maintains Repo Rate at 6.50% emphasizing inflation containment and steady GDP growth projection of 7.2%.',
      'Union Cabinet approves India-Middle East-Europe Economic Corridor (IMEC) infrastructure grid milestone.',
      'DRDO successfully flight-tests new Next-Gen VSHORADS air defence missile system in Odisha.',
      'Government announces 100% solar energization of 500 remote tribal villages under PM-JANMAN initiative.'
    ]
  },
  {
    id: 'ca-02',
    title: 'Science, Tech & Defence Monthly Roundup for SSC & Railways',
    category: 'Science & Defence',
    date: '2026-09-25',
    summary: 'ISRO Chandrayaan-4 sample return mission architecture finalized; Indian Navy commissions 5th stealth frigate.',
    bulletPoints: [
      'ISRO announces preliminary design freeze for Chandrayaan-4 lunar sample return mission slated for 2028.',
      'Indian Navy inducts INS Taragiri, stealth guided-missile frigate built under Project 17A.',
      'IIT Madras researchers synthesize biodegradable quantum dots for ultra-sensitive medical biosensors.',
      'Nobel Prize announcements preview: key discoveries in mRNA cellular signaling recognized.'
    ]
  },
  {
    id: 'ca-03',
    title: 'Sports & Awards Capsule: Major Tournaments & National Honors',
    category: 'Sports & Honors',
    date: '2026-09-22',
    summary: 'India bags 8 gold medals at Asian Athletics Championships; Dadasaheb Phalke Lifetime Award announced.',
    bulletPoints: [
      'Indian contingent records highest-ever tally of 24 medals including 8 Golds at the Asian Athletics meet.',
      'Dadasaheb Phalke Lifetime Achievement Award conferred for exceptional contributions to Indian Cinema.',
      'BCCI inaugurates state-of-the-art National Cricket Academy campus at Bengaluru with biomechanics labs.',
      'Neeraj Chopra clinches Diamond League title with an 89.45m javelin throw in Zurich.'
    ]
  }
];

export const INITIAL_BROADCAST_NOTIFICATIONS: BroadcastNotification[] = [
  {
    id: 'bnotif-1',
    title: '🚀 Big Update: ₹49 Pass Now Gives 1 Month All Exams Free!',
    message: 'We have upgraded the ₹49 pass to unlock ALL competitive examinations (SSC, Railways, Banking, State PSC) for a full 30 days!',
    date: '2026-09-28',
    type: 'Discount Offer'
  },
  {
    id: 'bnotif-2',
    title: '📋 SSC CGL Tier-1 Admit Card & Shift Schedule Out',
    message: 'Official SSC CGL Tier-1 city intimation slip and admit card dates released on official portal. Practice TCS iON CBT mocks now!',
    date: '2026-09-27',
    type: 'Admit Card',
    targetExam: 'SSC CGL 2026 Tier-1'
  },
  {
    id: 'bnotif-3',
    title: '📚 New Free Current Affairs & PDF Capsule Uploaded',
    message: 'September 2026 exam-oriented Current Affairs capsule with key MCQs and formula revisions is now live on the homepage.',
    date: '2026-09-26',
    type: 'New Mock Test'
  }
];

const BASE_NOTIFICATIONS_TIMELINE: ExamNotificationTimeline[] = [
  {
    id: 'timeline-01',
    examName: 'SSC CGL 2026 Tier-1',
    department: 'Staff Selection Commission (SSC)',
    category: 'SSC',
    scope: 'Central',
    notificationOutDate: '2026-06-15',
    examDate: '2026-10-18',
    resultDate: '2026-12-10',
    postsCount: '17,727 Posts',
    eligibility: 'Graduation in any discipline',
    status: 'Exam Scheduled',
    applyLink: 'https://ssc.gov.in',
    officialNotificationText: 'Admit cards are expected 7 days prior to exam. CBT Tier-1 will be held in 4 shifts across all major cities.'
  },
  {
    id: 'timeline-02',
    examName: 'RRB NTPC CEN 2026',
    department: 'Railway Recruitment Boards',
    category: 'Railways',
    scope: 'Central',
    notificationOutDate: '2026-07-01',
    examDate: '2026-11-05',
    resultDate: '2027-01-20',
    postsCount: '11,558 Posts',
    eligibility: '12th Pass / Graduate',
    status: 'Exam Scheduled',
    applyLink: 'https://rrbapply.gov.in',
    officialNotificationText: 'Stage-1 CBT exam schedule finalized. E-Call letters will be uploaded 4 days before exam date.'
  },
  {
    id: 'timeline-03',
    examName: 'WBPSC Clerkship 2026',
    department: 'West Bengal Public Service Commission',
    category: 'State PSC',
    scope: 'State',
    stateName: 'West Bengal',
    notificationOutDate: '2026-05-10',
    examDate: '2026-10-26',
    resultDate: '2026-12-30',
    postsCount: '6,400 Posts',
    eligibility: 'Madhyamik (10th) with basic computer knowledge',
    status: 'Admit Card Released',
    applyLink: 'https://psc.wb.gov.in',
    officialNotificationText: 'Part-1 Objective Exam will be conducted on 26th October in two shifts. Hall tickets are now available for download.'
  },
  {
    id: 'timeline-04',
    examName: 'BPSC 70th CCE Prelims',
    department: 'Bihar Public Service Commission',
    category: 'State PSC',
    scope: 'State',
    stateName: 'Bihar',
    notificationOutDate: '2026-08-01',
    examDate: '2026-12-14',
    resultDate: '2027-02-15',
    postsCount: '1,957 Posts',
    eligibility: 'Any Graduate Degree',
    status: 'Notification Out',
    applyLink: 'https://bpsc.bih.nic.in',
    officialNotificationText: 'Combined Competitive Examination preliminary test scheduled across all 38 districts of Bihar.'
  },
  {
    id: 'timeline-05',
    examName: 'UPPSC RO/ARO Review Officer',
    department: 'Uttar Pradesh Public Service Commission',
    category: 'State PSC',
    scope: 'State',
    stateName: 'Uttar Pradesh',
    notificationOutDate: '2026-04-12',
    examDate: '2026-09-15',
    resultDate: '2026-11-20',
    postsCount: '411 Posts',
    eligibility: 'Graduate Degree + Hindi Typing',
    status: 'Result Declared',
    applyLink: 'https://uppsc.up.nic.in',
    officialNotificationText: 'Preliminary exam answer key released. Cutoff marks and scorecard declared on official website.'
  }
];

const baseTimelineNames = new Set(BASE_NOTIFICATIONS_TIMELINE.map(t => t.examName.toLowerCase()));
export const INITIAL_NOTIFICATIONS_TIMELINE: ExamNotificationTimeline[] = [
  ...BASE_NOTIFICATIONS_TIMELINE,
  ...MASTER_NOTIFICATIONS_TIMELINE.filter(t => !baseTimelineNames.has(t.examName.toLowerCase()))
];

export const INITIAL_MOCK_TESTS: MockTest[] = [
  {
    id: 'mock-ssc-cgl-tier1-01',
    category: 'SSC',
    examName: 'SSC CGL 2026 Tier-1',
    title: 'SSC CGL Tier-1 All India Live Full Mock Test #1',
    description: 'Full length test based on latest SSC CGL TCS iON pattern with negative marking (0.50). Read attached PDF lesson notes first.',
    type: 'full_mock',
    durationMinutes: 60,
    totalMarks: 200,
    totalQuestions: 25,
    sections: ['General Intelligence & Reasoning', 'General Awareness', 'Quantitative Aptitude', 'English Comprehension'],
    cutoffMarks: {
      general: 142.5,
      obc: 136.0,
      sc_st: 118.5,
      ews: 131.0
    },
    attemptsCount: 38420,
    avgScore: 114.2,
    isFree: true, // Free test by default
    attachedPdf: {
      title: 'SSC CGL Tier-1 Master Revision Guide & Formula Booklet',
      pagesCount: 18,
      readTimeMinutes: 15,
      summary: 'Essential formulas for Percentage, Algebra, Geometry, Static GK quick charts, and top recurring reasoning patterns. Read carefully before starting the test!',
      contentMarkdown: `# SSC CGL Master Revision Notes (Must-Read Before Test)

### 1. Quantitative Aptitude Shortcuts
- **Successive Percentage Change:** If a value increases by $a\\%$ and then decreases by $b\\%$, net change $= a - b - \\frac{ab}{100}\\%$.
- **Speed, Distance, Time:** Average speed for equal distance at speeds $x$ and $y$: 
  $$\\text{Avg Speed} = \\frac{2xy}{x + y}$$
- **Algebra Identity:** 
  - If $x + \\frac{1}{x} = k$, then $x^2 + \\frac{1}{x^2} = k^2 - 2$
  - If $x + \\frac{1}{x} = k$, then $x^3 + \\frac{1}{x^3} = k^3 - 3k$

---

### 2. General Intelligence & Reasoning Key Rules
- **Syllogism 3-Golden Rules:**
  1. If all premises are affirmative, conclusion cannot be negative.
  2. "Some A are B" can be reversed to "Some B are A".
- **Alphabet Place Values (EJOTY trick):**
  - E=5, J=10, O=15, T=20, Y=25.
  - Reverse letter sum formula: Opposite Letter Value = $27 - \\text{Place Value}$.`
    },
    questions: [
      {
        id: 'q-cgl-01',
        questionNumber: 1,
        section: 'General Intelligence & Reasoning',
        topic: 'Analogy & Alphabet Series',
        difficulty: 'Easy',
        marksPositive: 2,
        marksNegative: 0.5,
        questionText: 'Select the option that is related to the third letter-cluster in the same way as the second letter-cluster is related to the first letter-cluster: BDFH : YWUS :: JLNP : ?',
        questionTextHindi: 'उस विकल्प का चयन करें जो तीसरे अक्षर-समूह से उसी प्रकार संबंधित है जैसे दूसरा अक्षर-समूह पहले अक्षर-समूह से संबंधित है: BDFH : YWUS :: JLNP : ?',
        options: ['QOMK', 'SQOM', 'TRPN', 'VTRP'],
        optionsHindi: ['QOMK', 'SQOM', 'TRPN', 'VTRP'],
        correctAnswerIndex: 0,
        explanation: 'Each letter is replaced by its opposite letter from the alphabet (Sum of reverse positions = 27): B<->Y, D<->W, F<->U, H<->S. Applying to JLNP: J(10)<->Q(17), L(12)<->O(15), N(14)<->M(13), P(16)<->K(11). Answer: QOMK.',
        explanationHindi: 'प्रत्येक अक्षर को उसके विपरीत अक्षर (विपरीत स्थानों का योग = 27) से प्रतिस्थापित किया गया है। सही उत्तर QOMK है।'
      },
      {
        id: 'q-cgl-02',
        questionNumber: 2,
        section: 'General Intelligence & Reasoning',
        topic: 'Number Series',
        difficulty: 'Medium',
        marksPositive: 2,
        marksNegative: 0.5,
        questionText: 'Which number will replace the question mark (?) in the following series? 7, 11, 20, 36, 61, ?',
        questionTextHindi: 'निम्नलिखित श्रृंखला में प्रश्न चिह्न (?) के स्थान पर कौन सी संख्या आएगी? 7, 11, 20, 36, 61, ?',
        options: ['93', '97', '102', '89'],
        optionsHindi: ['93', '97', '102', '89'],
        correctAnswerIndex: 1,
        explanation: 'Differences: 11-7=4 (2²), 20-11=9 (3²), 36-20=16 (4²), 61-36=25 (5²). Next difference = 6² = 36. Next term = 61 + 36 = 97.',
        explanationHindi: 'क्रमागत पदों का अंतर 2², 3², 4², 5² है। अगला अंतर 6² = 36 होगा। 61 + 36 = 97।'
      },
      {
        id: 'q-cgl-04',
        questionNumber: 3,
        section: 'General Awareness',
        topic: 'Indian Polity',
        difficulty: 'Easy',
        marksPositive: 2,
        marksNegative: 0.5,
        questionText: 'Which Article of the Indian Constitution empowers the Supreme Court to issue writs for the enforcement of Fundamental Rights?',
        questionTextHindi: 'भारतीय संविधान का कौन सा अनुच्छेद सर्वोच्च न्यायालय को मौलिक अधिकारों के प्रवर्तन के लिए रिट जारी करने का अधिकार देता है?',
        options: ['Article 32', 'Article 226', 'Article 131', 'Article 143'],
        optionsHindi: ['अनुच्छेद 32', 'अनुच्छेद 226', 'अनुच्छेद 131', 'अनुच्छेद 143'],
        correctAnswerIndex: 0,
        explanation: 'Article 32 gives the right to individuals to move the Supreme Court to seek justice for Fundamental Rights violations. Dr. B.R. Ambedkar called it the Heart and Soul of the Constitution.',
        explanationHindi: 'अनुच्छेद 32 के तहत सर्वोच्च न्यायालय मौलिक अधिकारों के उल्लंघन पर 5 प्रकार की रिट जारी कर सकता है।'
      }
    ]
  },
  {
    id: 'mock-ssc-cgl-chapter-01',
    category: 'SSC',
    examName: 'SSC CGL 2026 Tier-1',
    title: 'Chapter Test: Quantitative Aptitude - Percentage & Discount',
    description: 'Chapterwise practice test for SSC CGL. Read the formula notes in the attached PDF first.',
    type: 'chapter_wise',
    chapterOrSectionName: 'Percentage & Profit Loss',
    durationMinutes: 20,
    totalMarks: 30,
    totalQuestions: 15,
    sections: ['Quantitative Aptitude'],
    cutoffMarks: {
      general: 22.0,
      obc: 20.0,
      sc_st: 16.0,
      ews: 19.0
    },
    attemptsCount: 19800,
    avgScore: 21.4,
    isFree: true,
    attachedPdf: {
      title: 'Chapter Formula Sheet: Percentages, Profit, Loss & Dishonest Dealer',
      pagesCount: 8,
      readTimeMinutes: 7,
      summary: 'Formulae for successive discounts, MP to CP ratio, and dishonest shopkeeper shortcut rules.',
      contentMarkdown: `# Chapter: Percentage & Profit Loss Shortcuts\n\n1. Profit % = (SP - CP)/CP * 100\n2. Relation: MP/CP = (100 + P%) / (100 - D%)\n3. Dishonest Dealer: Gain % = [Error / (True Value - Error)] * 100%`
    },
    questions: [
      {
        id: 'q-ch-01',
        questionNumber: 1,
        section: 'Quantitative Aptitude',
        topic: 'Marked Price & Discount',
        difficulty: 'Medium',
        marksPositive: 2,
        marksNegative: 0.5,
        questionText: 'A trader marks his goods 40% above the cost price and allows a discount of 20% on the marked price. What is his overall profit percentage?',
        questionTextHindi: 'एक व्यापारी अपनी वस्तुओं का मूल्य क्रय मूल्य से 40% अधिक अंकित करता है और अंकित मूल्य पर 20% की छूट देता है। उसका कुल लाभ प्रतिशत क्या है?',
        options: ['12%', '15%', '20%', '10%'],
        optionsHindi: ['12%', '15%', '20%', '10%'],
        correctAnswerIndex: 0,
        explanation: 'Net % = 40 - 20 - (40*20)/100 = 20 - 8 = 12%.',
        explanationHindi: 'क्रय मूल्य 100, अंकित 140, 20% छूट = 28, विक्रय मूल्य 112। लाभ 12%।'
      }
    ]
  },
  {
    id: 'mock-ssc-cgl-sec-01',
    category: 'SSC',
    examName: 'SSC CGL 2026 Tier-1',
    title: 'Sectional Speed Test: General Intelligence & Reasoning',
    description: 'High-speed 25 questions reasoning test covering Coding-Decoding, Blood Relations, and Puzzles.',
    type: 'section_wise',
    chapterOrSectionName: 'General Intelligence & Reasoning',
    durationMinutes: 15,
    totalMarks: 50,
    totalQuestions: 25,
    sections: ['General Intelligence & Reasoning'],
    cutoffMarks: {
      general: 42.0,
      obc: 38.0,
      sc_st: 32.0,
      ews: 37.0
    },
    attemptsCount: 14200,
    avgScore: 36.2,
    isFree: true,
    attachedPdf: {
      title: 'Reasoning Sectional Speed Hacks & Coding Patterns',
      pagesCount: 6,
      readTimeMinutes: 5,
      summary: 'Clock & calendar odd days calculation, direction test vector method, and matrix coding table.',
      contentMarkdown: `# Reasoning Sectional Notes\n\n- Leap year = 366 days (2 odd days)\n- Normal year = 365 days (1 odd day)\n- Century leap years: 400, 800, 1200, 1600, 2000`
    },
    questions: [
      {
        id: 'q-sec-01',
        questionNumber: 1,
        section: 'General Intelligence & Reasoning',
        topic: 'Direction & Distance',
        difficulty: 'Easy',
        marksPositive: 2,
        marksNegative: 0.5,
        questionText: 'A person walks 10 km North, turns right and walks 6 km, then turns right again and walks 10 km. In which direction is he now from his starting point?',
        questionTextHindi: 'एक व्यक्ति 10 किमी उत्तर की ओर चलता है, दायें मुड़ता है और 6 किमी चलता है, फिर दायें मुड़ता है और 10 किमी चलता है। वह अपने प्रारंभिक बिंदु से किस दिशा में है?',
        options: ['East', 'West', 'North', 'South'],
        optionsHindi: ['पूर्व (East)', 'पश्चिम', 'उत्तर', 'दक्षिण'],
        correctAnswerIndex: 0,
        explanation: 'The person moves 10 km North and 10 km South which cancel out. He is 6 km to the East of starting position.',
        explanationHindi: 'उत्तर और दक्षिण की दूरी रद्द हो जाती है। वह प्रारंभिक बिंदु से पूर्व दिशा में 6 किमी दूरी पर है।'
      }
    ]
  },
  {
    id: 'mock-rrb-ntpc-01',
    category: 'Railways',
    examName: 'RRB NTPC CEN 2026',
    title: 'RRB NTPC CBT-1 Full Length All-India Practice Mock #1',
    description: 'Real RRB Railway exam pattern with 100 marks standard, 0.33 negative marking. Covers General Awareness, Mathematics & General Intelligence.',
    type: 'full_mock',
    durationMinutes: 90,
    totalMarks: 100,
    totalQuestions: 15,
    sections: ['General Awareness', 'Mathematics', 'General Intelligence & Reasoning'],
    cutoffMarks: {
      general: 76.5,
      obc: 72.0,
      sc_st: 64.0,
      ews: 69.5
    },
    attemptsCount: 52180,
    avgScore: 68.4,
    isFree: true,
    attachedPdf: {
      title: 'RRB NTPC Railway General Science & GK Quick Booster',
      pagesCount: 14,
      readTimeMinutes: 12,
      summary: 'Periodic table essentials, Newton laws, Railway zones and headquarters, UNESCO World Heritage sites in India, and Speed calculation tricks.',
      contentMarkdown: `# RRB NTPC General Science & Railway GK Booster\n\n### 1. Indian Railway Zones\n- Northern: New Delhi\n- Western: Mumbai Churchgate\n- Southern: Chennai\n- Eastern: Kolkata`
    },
    questions: [
      {
        id: 'q-rrb-01',
        questionNumber: 1,
        section: 'General Awareness',
        topic: 'Indian Railways & GK',
        difficulty: 'Easy',
        marksPositive: 1,
        marksNegative: 0.33,
        questionText: 'Where is the headquarters of the South Central Railway (SCR) zone located?',
        questionTextHindi: 'दक्षिण मध्य रेलवे (SCR) जोन का मुख्यालय कहाँ स्थित है?',
        options: ['Secunderabad', 'Chennai', 'Hubli', 'Bilaspur'],
        optionsHindi: ['सिकंदराबाद', 'चेन्नई', 'हुबली', 'बिलासपुर'],
        correctAnswerIndex: 0,
        explanation: 'South Central Railway was formed in 1966 with headquarters at Rail Nilayam, Secunderabad.',
        explanationHindi: 'दक्षिण मध्य रेलवे का मुख्यालय सिकंदराबाद में स्थित है।'
      }
    ]
  },
  {
    id: 'mock-wbpsc-01',
    category: 'State PSC',
    examName: 'WBPSC Clerkship 2026',
    title: 'WBPSC Clerkship Part-1 Full Mock Test #1',
    description: 'Based on official WBPSC syllabus. General Studies, Arithmetic and English with state-specific questions.',
    type: 'full_mock',
    durationMinutes: 90,
    totalMarks: 100,
    totalQuestions: 15,
    sections: ['English', 'General Studies', 'Arithmetic'],
    cutoffMarks: {
      general: 68.0,
      obc: 63.5,
      sc_st: 58.0,
      ews: 61.0
    },
    attemptsCount: 22100,
    avgScore: 62.5,
    isFree: true,
    attachedPdf: {
      title: 'West Bengal Geography, History & Clerkship Syllabus Capsule',
      pagesCount: 12,
      readTimeMinutes: 10,
      summary: 'Rivers of West Bengal (Teesta, Torsa, Damodar), Sundarbans mangrove biosphere, and colonial timeline.',
      contentMarkdown: `# WBPSC Clerkship Quick Revision Note\n\n### West Bengal High Yield Facts:\n- Highest peak: Sandakphu (3,636 m)\n- State Animal: Fishing Cat (Baghrol)\n- State Tree: Chatim`
    },
    questions: [
      {
        id: 'q-wb-01',
        questionNumber: 1,
        section: 'General Studies',
        topic: 'West Bengal Geography',
        difficulty: 'Easy',
        marksPositive: 1,
        marksNegative: 0.25,
        questionText: 'Which river is traditionally called the "Sorrow of Bengal" before modern dam projects?',
        questionTextHindi: 'आधुनिक बांध परियोजनाओं से पहले किस नदी को पारंपरिक रूप से "बंगाल का शोक" कहा जाता था?',
        options: ['Damodar River', 'Teesta River', 'Rupnarayan River', 'Ajay River'],
        optionsHindi: ['दामोदर नदी', 'तीस्ता नदी', 'रूपनारायण नदी', 'अजय नदी'],
        correctAnswerIndex: 0,
        explanation: 'The Damodar River was known as the Sorrow of Bengal because of its ravaging floods in the plains of West Bengal before the DVC (Damodar Valley Corporation) was set up in 1948.',
        explanationHindi: 'दामोदर नदी को विनाशकारी बाढ़ के कारण "बंगाल का शोक" कहा जाता था।'
      }
    ]
  }
];

export const INITIAL_STUDENTS: StudentUser[] = [
  {
    id: 'std-001',
    name: 'Rahul Sharma',
    email: 'rahul.sharma@example.com',
    phone: '+91 98765 43210',
    registeredDate: '2026-08-15',
    selectedExamName: 'SSC CGL 2026 Tier-1',
    userTier: 'Gold', // Gold level performer!
    subscription: {
      active: true,
      planId: 'year1',
      planName: '1-Year Selection Pass (365 Days)',
      expiresAt: '2027-08-15',
      purchasedAt: '2026-08-15',
      daysRemaining: 322,
      unlockedExams: ['ALL']
    },
    totalTestsGiven: 48,
    avgAccuracy: 88.5,
    avgScore: 154.2,
    bookmarkedQuestionIds: ['q-cgl-01']
  },
  {
    id: 'std-002',
    name: 'Pooja Verma',
    email: 'pooja.verma@example.com',
    phone: '+91 98112 34567',
    registeredDate: '2026-09-01',
    selectedExamName: 'RRB NTPC CEN 2026',
    userTier: 'Silver', // Silver level: eligible for teach with us
    subscription: {
      active: true,
      planId: 'month6',
      planName: '6-Month All Exams Pass',
      expiresAt: '2027-03-01',
      purchasedAt: '2026-09-01',
      daysRemaining: 155,
      unlockedExams: ['ALL']
    },
    totalTestsGiven: 26,
    avgAccuracy: 74.2,
    avgScore: 78.4,
    bookmarkedQuestionIds: ['q-rrb-01']
  },
  {
    id: 'std-003',
    name: 'Amit Patel',
    email: 'amit.patel@example.com',
    phone: '+91 99887 76655',
    registeredDate: '2026-09-20',
    selectedExamName: 'WBPSC Clerkship 2026',
    userTier: 'Bronze', // Bronze level
    subscription: {
      active: true,
      planId: 'day1',
      planName: '1-Day All Exam Pass',
      expiresAt: '2026-09-28',
      purchasedAt: '2026-09-27',
      daysRemaining: 1,
      unlockedExams: ['ALL']
    },
    totalTestsGiven: 6,
    avgAccuracy: 58.0,
    avgScore: 42.0,
    bookmarkedQuestionIds: []
  }
];

export const INITIAL_EBOOKS: EBook[] = [
  {
    id: 'ebook-01',
    title: '5000+ TCS Static GK & Current Affairs Master Capsule',
    category: 'SSC',
    subject: 'General Awareness',
    pages: 240,
    fileSize: '14.2 MB',
    downloadsCount: 84320,
    description: 'Comprehensive static GK containing Art & Culture, Modern History timelines, Polity articles, River systems & Dams, and 12-month current affairs highlights.',
    chapters: [
      '1. Indian Constitution & Important Articles',
      '2. Folk Dances & Classical Music Gharanas',
      '3. Indian Geography: Rivers, Peaks & National Parks',
      '4. Science & Tech Innovations',
      '5. Previous 5-Year TCS Asked Questions'
    ],
    contentSummary: 'Curated by top educators specifically targeting SSC CGL, CHSL, MTS, and RRB exams. Contains color coded mind maps and rapid-fire memory mnemonics.'
  },
  {
    id: 'ebook-02',
    title: 'Vedic Math & Quantitative Shortcuts Handbook 2026',
    category: 'Banking',
    subject: 'Quantitative Aptitude',
    pages: 180,
    fileSize: '9.8 MB',
    downloadsCount: 67190,
    description: 'Boost your calculation speed 5x without touching pen and paper. Covers cross multiplication, base 100 tricks, cube roots, and DI approximation.',
    chapters: [
      '1. Fast Multiplication and Square Roots',
      '2. Percentage & Fraction Equivalence',
      '3. Ratio & Proportions Master Techniques',
      '4. High Speed DI Table Analysis',
      '5. 100 Solved Exam Problems with Speed Timers'
    ],
    contentSummary: 'The ultimate survival handbook for Banking (SBI PO/IBPS) and SSC speed tests where every second counts.'
  }
];

export const INITIAL_TEACH_APPLICATIONS: TeachWithUsApplication[] = [
  {
    id: 'tapp-01',
    candidateName: 'Rahul Sharma',
    candidateEmail: 'rahul.sharma@example.com',
    mobileNumber: '+91 98765 43210',
    subjectExpertise: 'Quantitative Aptitude & Algebra Shortcuts',
    userTier: 'Gold',
    highestAccuracy: 92,
    appliedDate: '2026-09-25',
    status: 'Interview Scheduled',
    notes: 'Gold ranker with 88.5% average accuracy across 48 mocks.'
  }
];

// Pool of 30 qualified teacher candidates across India.
// The active 15 automatically rotate every 5 days based on Math.floor(Date.now() / (5 * 24 * 60 * 60 * 1000)).
const TEACHER_CANDIDATE_POOL = [
  { name: 'Dr. Alok Verma', phone: '+91 98721 34560', subject: 'General Science & Physics', tier: 'Gold' as const, acc: 94.2 },
  { name: 'Pooja Bhattacharya', phone: '+91 98302 11984', subject: 'Indian Polity & Constitution', tier: 'Gold' as const, acc: 91.5 },
  { name: 'Vikramaditya Rathore', phone: '+91 94140 88231', subject: 'Arithmetic & Vedic Mathematics', tier: 'Silver' as const, acc: 86.4 },
  { name: 'Sneha Kulkarni', phone: '+91 98220 54192', subject: 'Reasoning & Syllogism Tricks', tier: 'Gold' as const, acc: 93.8 },
  { name: 'Manish Rawat', phone: '+91 97581 20491', subject: 'Modern Indian History Timelines', tier: 'Silver' as const, acc: 84.6 },
  { name: 'Ananya Mukherjee', phone: '+91 98319 77215', subject: 'English Grammar & Vocabulary Roots', tier: 'Gold' as const, acc: 95.0 },
  { name: 'Deepak Chaudhary', phone: '+91 99114 62890', subject: 'Data Interpretation & Quadratic Eq', tier: 'Gold' as const, acc: 89.7 },
  { name: 'Sunita Meena', phone: '+91 94602 33178', subject: 'Geography of India & River Basins', tier: 'Silver' as const, acc: 82.9 },
  { name: 'Abhishek Tripathi', phone: '+91 94520 91823', subject: 'Banking Awareness & RBI Monetary Policy', tier: 'Gold' as const, acc: 92.1 },
  { name: 'Ritika Sengupta', phone: '+91 98305 66412', subject: 'Current Affairs Monthly Capsules', tier: 'Silver' as const, acc: 87.5 },
  { name: 'Gaurav Yadav', phone: '+91 98188 45910', subject: 'SSC Advanced Math & Trigonometry', tier: 'Gold' as const, acc: 96.1 },
  { name: 'Kavita Sundaram', phone: '+91 94440 18274', subject: 'Static GK, Classical Dance & Art', tier: 'Gold' as const, acc: 90.4 },
  { name: 'Harpreet Singh', phone: '+91 98150 72619', subject: 'Coding-Decoding & Non-Verbal Reasoning', tier: 'Silver' as const, acc: 85.3 },
  { name: 'Tanvi Deshmukh', phone: '+91 98230 49182', subject: 'Economics & Five Year Plans', tier: 'Silver' as const, acc: 83.7 },
  { name: 'Arun Kumar Jha', phone: '+91 94312 88045', subject: 'Railway Technical & General Science', tier: 'Gold' as const, acc: 93.4 },
  { name: 'Megha Nair', phone: '+91 98470 23918', subject: 'Comprehension & Cloze Test Masterclass', tier: 'Silver' as const, acc: 88.2 },
  { name: 'Sanjay Bishnoi', phone: '+91 94142 55910', subject: 'Geometry & Mensuration 3D Shortcuts', tier: 'Gold' as const, acc: 91.8 },
  { name: 'Priyanka Goswami', phone: '+91 98640 19284', subject: 'Environmental Studies & Ecology', tier: 'Silver' as const, acc: 84.1 },
  { name: 'Tariq Anwar', phone: '+91 98390 41289', subject: 'General Mental Ability & Puzzles', tier: 'Gold' as const, acc: 94.7 },
  { name: 'Divya Khurana', phone: '+91 98711 63920', subject: 'English Error Detection & Idioms', tier: 'Silver' as const, acc: 86.8 },
  { name: 'Naveen Reddy', phone: '+91 98490 82194', subject: 'Quantitative Aptitude & Time-Work', tier: 'Gold' as const, acc: 95.3 },
  { name: 'Pallavi Joshi', phone: '+91 98224 71920', subject: 'Indian National Movement & Freedom Struggle', tier: 'Gold' as const, acc: 92.6 },
  { name: 'Rajesh Grewal', phone: '+91 98120 34819', subject: 'Speed Math & Number Systems', tier: 'Silver' as const, acc: 85.9 },
  { name: 'Ishita Banerjee', phone: '+91 98310 59281', subject: 'Static GK & Census 2011 Highlights', tier: 'Silver' as const, acc: 87.1 }
];

/**
 * Returns exactly 15 teacher candidate applicants that automatically cycle every 5 days
 */
export function get15TeacherCandidates(): TeachWithUsApplication[] {
  // 5-day cycle based on Unix timestamp (5 days in ms = 432,000,000)
  const fiveDaysMs = 5 * 24 * 60 * 60 * 1000;
  const cycleIndex = Math.floor(Date.now() / fiveDaysMs);
  const offset = (cycleIndex * 3) % TEACHER_CANDIDATE_POOL.length;

  const selectedCandidates: TeachWithUsApplication[] = [];
  const baseDate = new Date();

  for (let i = 0; i < 15; i++) {
    const poolItem = TEACHER_CANDIDATE_POOL[(offset + i) % TEACHER_CANDIDATE_POOL.length];
    const daysAgo = (i % 5) + 1;
    const applied = new Date(baseDate.getTime() - daysAgo * 24 * 60 * 60 * 1000);
    const dateStr = applied.toISOString().split('T')[0];

    const statuses: ('Selected' | 'Interview Scheduled' | 'Under Review')[] = [
      'Interview Scheduled',
      'Selected',
      'Under Review',
      'Interview Scheduled',
      'Under Review'
    ];

    selectedCandidates.push({
      id: `teach-cand-${cycleIndex}-${i + 1}`,
      candidateName: poolItem.name,
      mobileNumber: poolItem.phone,
      phoneNumber: poolItem.phone,
      subjectExpertise: poolItem.subject,
      userTier: poolItem.tier,
      highestAccuracy: poolItem.acc,
      appliedDate: dateStr,
      status: statuses[i % statuses.length],
      notes: `${poolItem.tier} Level ranker with ${poolItem.acc}% verified mock accuracy. Cleared official state & central cutoff.`
    });
  }

  return selectedCandidates;
}

export const INITIAL_WEBSITE_VISITOR_ACTIVITY = {
  totalVisitors: 284650,
  liveVisitorsNow: 1428,
  testsRunningNow: 384,
  todaySignups: 892,
  recentActivities: [
    {
      id: 'act-01',
      text: 'Vikram Singh (Jaipur) started SSC CGL 2026 Tier-1 Mock',
      timestamp: 'Just now',
      type: 'test_start' as const
    },
    {
      id: 'act-02',
      text: 'Ananya Roy (Kolkata) completed 15-Question Segment with 93% accuracy',
      timestamp: '1 min ago',
      type: 'high_score' as const
    },
    {
      id: 'act-03',
      text: 'Priya Sharma (Patna) purchased 6-Month Selection Pass (₹199)',
      timestamp: '3 mins ago',
      type: 'pass_purchase' as const
    },
    {
      id: 'act-04',
      text: 'Mohd. Tariq (Lucknow) submitted Teach With Us application (+91 98321 09876)',
      timestamp: '5 mins ago',
      type: 'high_score' as const
    },
    {
      id: 'act-05',
      text: 'Suresh Nair (Bengaluru) opened Static GK Master Capsule PDF',
      timestamp: '8 mins ago',
      type: 'pdf_read' as const
    },
    {
      id: 'act-06',
      text: 'Rohit Meena (Delhi) unlocked Gold Level Tier in RRB NTPC',
      timestamp: '12 mins ago',
      type: 'high_score' as const
    }
  ]
};

export const INITIAL_LIVE_TESTS: LiveTest[] = [
  {
    id: 'live-test-01',
    examName: 'SSC CGL 2026 Tier-1',
    category: 'SSC',
    title: 'All-India Mega Live Mock Test #1 (Live Ranking & Percentile)',
    description: 'National level live test conducted across India with thousands of aspirants competing simultaneously. Real TCS iON interface & all-India rank list.',
    type: 'full_mock',
    scheduledStartTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
    durationMinutes: 60,
    totalMarks: 200,
    status: 'Live Now',
    participantsCount: 4892,
    questions: [
      {
        id: 'q-live-01',
        questionNumber: 1,
        section: 'General Intelligence & Reasoning',
        topic: 'Analogy',
        difficulty: 'Medium',
        marksPositive: 2,
        marksNegative: 0.5,
        questionText: 'Select the option that is related to the third number in the same way as the second number is related to the first number: 14 : 210 :: 18 : ?',
        questionTextHindi: 'उस विकल्प का चयन करें जो तीसरी संख्या से उसी प्रकार संबंधित है जैसे दूसरी संख्या पहली संख्या से संबंधित है: 14 : 210 :: 18 : ?',
        options: ['342', '324', '360', '306'],
        optionsHindi: ['342', '324', '360', '306'],
        correctAnswerIndex: 0,
        explanation: 'Pattern: n * (n + 1). For 14: 14 * 15 = 210. For 18: 18 * 19 = 342.',
        explanationHindi: 'पैटर्न: n * (n + 1)। 14 * 15 = 210। 18 * 19 = 342।'
      },
      {
        id: 'q-live-02',
        questionNumber: 2,
        section: 'General Awareness',
        topic: 'Indian Economy',
        difficulty: 'Easy',
        marksPositive: 2,
        marksNegative: 0.5,
        questionText: 'Which organisation publishes the World Economic Outlook report?',
        questionTextHindi: 'विश्व आर्थिक परिदृश्य (World Economic Outlook) रिपोर्ट किस संगठन द्वारा प्रकाशित की जाती है?',
        options: ['International Monetary Fund (IMF)', 'World Bank', 'World Trade Organization (WTO)', 'United Nations (UN)'],
        optionsHindi: ['अंतर्राष्ट्रीय मुद्रा कोष (IMF)', 'विश्व बैंक', 'विश्व व्यापार संगठन (WTO)', 'संयुक्त राष्ट्र (UN)'],
        correctAnswerIndex: 0,
        explanation: 'The World Economic Outlook (WEO) is a survey by the International Monetary Fund (IMF) published usually twice a year.',
        explanationHindi: 'विश्व आर्थिक परिदृश्य (WEO) अंतर्राष्ट्रीय मुद्रा कोष (IMF) द्वारा प्रकाशित किया जाता है।'
      }
    ]
  },
  {
    id: 'live-test-02',
    examName: 'RRB NTPC CEN 2026',
    category: 'Railways',
    title: 'Railway CBT-1 Live Speed Challenge (Mathematics & General Science)',
    description: 'Scheduled all-India live test designed to test speed and accuracy under pressure. Instant result declaration after completion.',
    type: 'section_wise',
    chapterOrSectionName: 'Mathematics & Science',
    scheduledStartTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // tomorrow
    durationMinutes: 45,
    totalMarks: 60,
    status: 'Upcoming',
    participantsCount: 3120,
    questions: [
      {
        id: 'q-live-03',
        questionNumber: 1,
        section: 'Mathematics',
        topic: 'Time and Work',
        difficulty: 'Medium',
        marksPositive: 1,
        marksNegative: 0.33,
        questionText: 'A can do a piece of work in 12 days and B can do it in 18 days. They worked together for 4 days. What fraction of the work is left?',
        questionTextHindi: 'A किसी कार्य को 12 दिनों में और B उसे 18 दिनों में पूरा कर सकता है। उन्होंने 4 दिनों तक एक साथ काम किया। कार्य का कितना भाग शेष है?',
        options: ['4/9', '5/9', '7/9', '1/3'],
        optionsHindi: ['4/9', '5/9', '7/9', '1/3'],
        correctAnswerIndex: 0,
        explanation: '1 day work of (A + B) = 1/12 + 1/18 = 5/36. In 4 days, they complete 4 * (5/36) = 5/9. Work remaining = 1 - 5/9 = 4/9.',
        explanationHindi: '4 दिनों में किया गया कार्य = 20/36 = 5/9। शेष कार्य = 1 - 5/9 = 4/9।'
      }
    ]
  }
];

