import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  MockTest, 
  AdminExam, 
  ExamAttempt, 
  SubscriptionPlan, 
  StudentUser, 
  ExamNotificationTimeline, 
  EBook, 
  PaymentGatewayConfig,
  AttachedPdf,
  UserLevelTier,
  TeachWithUsApplication,
  CurrentAffairsItem,
  BroadcastNotification,
  LiveTest,
  WebsiteBannerConfig
} from '../types';
import { 
  INITIAL_MOCK_TESTS, 
  INITIAL_ADMIN_EXAMS, 
  SUBSCRIPTION_PLANS, 
  INITIAL_STUDENTS, 
  INITIAL_NOTIFICATIONS_TIMELINE, 
  INITIAL_EBOOKS, 
  INITIAL_PAYMENT_CONFIG,
  INITIAL_TEACH_APPLICATIONS,
  get15TeacherCandidates,
  INITIAL_WEBSITE_VISITOR_ACTIVITY,
  INITIAL_CURRENT_AFFAIRS,
  INITIAL_BROADCAST_NOTIFICATIONS,
  INITIAL_LIVE_TESTS
} from '../data/mockData';

import { LanguageCode, UI_TRANSLATIONS } from '../utils/languageData';

interface AppContextType {
  // Navigation & View
  currentView: 'dashboard' | 'mock_tests' | 'active_test' | 'analytics' | 'notifications' | 'ebooks' | 'admin' | 'teach_with_us';
  setCurrentView: (view: 'dashboard' | 'mock_tests' | 'active_test' | 'analytics' | 'notifications' | 'ebooks' | 'admin' | 'teach_with_us') => void;
  
  // 10 Indian Languages & Localization
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string) => string;

  // Accessibility (TCS Style font size and contrast)
  fontSize: 'normal' | 'large' | 'xlarge';
  setFontSize: (size: 'normal' | 'large' | 'xlarge') => void;
  highContrast: boolean;
  setHighContrast: (val: boolean) => void;

  // Selected Exam on Home Page (Controls what mocks & PDFs are shown)
  selectedExamName: string;
  setSelectedExamName: (name: string) => void;

  // Admin Exams List (Added & strictly deleted only by admin in Admin Panel)
  adminExams: AdminExam[];
  addAdminExam: (exam: AdminExam) => void;
  updateAdminExam: (exam: AdminExam) => void;
  deleteAdminExam: (examId: string) => void;

  // Dark Mode (fixed and verified)
  darkMode: boolean;
  toggleDarkMode: () => void;

  // Authentication & Student Portal Login (with Country choice: India = all access, Other = eBooks & PDFs)
  currentUser: StudentUser;
  googleLoginModalOpen: boolean;
  setGoogleLoginModalOpen: (open: boolean) => void;
  loginWithGoogle: (email: string, name: string, country?: string) => void;
  logoutUser: () => void;

  // Language Converter & PDF Maker Facility
  imageToPdfModalOpen: boolean;
  setImageToPdfModalOpen: (open: boolean) => void;
  converterTab: 'documents' | 'images' | 'text' | 'translator' | 'image_to_pdf' | 'pdf_to_image' | 'pdf_maker';
  setConverterTab: (tab: 'documents' | 'images' | 'text' | 'translator' | 'image_to_pdf' | 'pdf_to_image' | 'pdf_maker') => void;
  openConverter: (tab?: 'documents' | 'images' | 'text' | 'translator' | 'image_to_pdf' | 'pdf_to_image' | 'pdf_maker') => void;

  // Coupon Code & Discount System
  appliedCoupon: { code: string; discountPercent: number } | null;
  applyCoupon: (code: string) => { success: boolean; message: string; discountPercent: number };
  removeCoupon: () => void;

  // Daily / Monthly Current Affairs (Short capsules & PDFs)
  currentAffairs: CurrentAffairsItem[];
  addCurrentAffairs: (item: CurrentAffairsItem) => void;
  deleteCurrentAffairs: (id: string) => void;

  // Admin Broadcast Notifications System
  broadcastNotifications: BroadcastNotification[];
  sendBroadcastNotification: (notif: BroadcastNotification) => void;
  deleteBroadcastNotification: (id: string) => void;

  // Secure Admin Authentication & Credentials (Password, Phone, Email)
  adminGmail: string;
  adminPhone: string;
  setAdminGmail: (gmail: string) => void;
  setAdminPhone: (phone: string) => void;
  isAdminAuthenticated: boolean;
  adminLoginError: string | null;
  loginAsAdmin: (email: string, password: string) => boolean;
  loginAsAdminWithGmail: (email: string, password?: string) => boolean;
  updateAdminProfile: (updates: { email?: string; phone?: string; currentPassword?: string; newPassword?: string }) => { success: boolean; message: string };
  logoutAdmin: () => void;

  // Free Test Evaluation
  isTestFreeForStudent: (test: MockTest) => boolean;
  updateExamFreeLimits: (examId: string, limits: { chapterWiseFree: number; fullMockFree: number; sectionWiseFree: number }) => void;

  // Mock Tests (Added & deleted by admin)
  mockTests: MockTest[];
  addMockTest: (test: MockTest) => void;
  deleteMockTest: (testId: string) => void;
  updateMockTest: (test: MockTest) => void;
  activeTest: MockTest | null;
  setActiveTest: (test: MockTest | null) => void;

  // Live Tests
  liveTests: LiveTest[];
  addLiveTest: (test: LiveTest) => void;
  deleteLiveTest: (testId: string) => void;
  updateLiveTest: (test: LiveTest) => void;

  // Segmented Practice (10 to 50 Qs)
  activeSegmentConfig: {
    enabled: boolean;
    segmentSize: number;
    startIndex: number;
    endIndex: number;
  } | null;
  startCustomSegmentTest: (test: MockTest, segmentSize: number, startIndex?: number) => void;
  startFullMockTest: (test: MockTest) => void;

  // Attached PDF Reading Modal (Protected reader - no direct download)
  activeReadingPdf: {
    pdf: AttachedPdf;
    testTitle: string;
    testId: string;
    examName: string;
  } | null;
  openPdfReader: (test: MockTest) => void;
  closePdfReader: () => void;

  // Attempts & Analytics
  attempts: ExamAttempt[];
  recordAttempt: (attempt: ExamAttempt) => void;
  activeAttemptResult: ExamAttempt | null;
  setActiveAttemptResult: (attempt: ExamAttempt | null) => void;
  viewAttemptAnalytics: (attemptId: string) => void;

  // Tier System (Bronze, Silver, Gold) & Teach With Us
  userTier: UserLevelTier;
  teachApplications: TeachWithUsApplication[];
  submitTeachWithUsApplication: (mobile: string, subject: string) => void;

  // Website Live Activity & Visitor Analytics (for Admin Panel)
  websiteVisitorActivity: {
    totalVisitors: number;
    liveVisitorsNow: number;
    testsRunningNow: number;
    todaySignups: number;
    recentActivities: {
      id: string;
      text: string;
      timestamp: string;
      type: 'test_start' | 'pdf_read' | 'pass_purchase' | 'high_score';
    }[];
  };

  // Subscription & Payment
  subscriptionModalOpen: boolean;
  setSubscriptionModalOpen: (open: boolean) => void;
  selectedPlanForPayment: SubscriptionPlan | null;
  setSelectedPlanForPayment: (plan: SubscriptionPlan | null) => void;
  openPaymentCheckout: (plan: SubscriptionPlan) => void;
  completePayment: (plan: SubscriptionPlan, paymentMethod: string, transactionId: string) => void;

  // Admin Data Management
  students: StudentUser[];
  updateStudent: (student: StudentUser) => void;
  deleteStudent: (studentId: string) => void;
  extendStudentSubscription: (studentId: string, days: number) => void;
  
  paymentConfig: PaymentGatewayConfig;
  updatePaymentConfig: (config: PaymentGatewayConfig) => void;

  // Notifications Timeline (Central & State wise)
  notificationsTimeline: ExamNotificationTimeline[];
  addNotificationTimeline: (item: ExamNotificationTimeline) => void;
  updateNotificationTimeline: (item: ExamNotificationTimeline) => void;
  deleteNotificationTimeline: (id: string) => void;

  // Free E-Books (Added and deleted by admin)
  ebooks: EBook[];
  addEBook: (ebook: EBook) => void;
  deleteEBook: (id: string) => void;

  // Bookmarking
  bookmarkedQuestions: string[];
  toggleBookmarkQuestion: (questionId: string) => void;
  bookmarkedMockTestIds: string[];
  toggleBookmarkMockTest: (mockTestId: string) => void;
  isMockTestBookmarked: (mockTestId: string) => boolean;

  // 7-Day ₹2 Trial (Max 1 Trial Allowed per Device in 3 Months with Visitor Device Authentication Permission)
  claim7DayFreeTrial: (targetEmail?: string) => { success: boolean; message: string; blocked?: boolean };
  deviceAuthPermissionGranted: boolean;
  deviceFingerprintId: string;
  requestDeviceAuthenticationPermission: () => {
    granted: boolean;
    deviceId: string;
    eligible: boolean;
    message: string;
    cooldownDaysRemaining: number;
    lastClaimedDate?: string;
  };
  checkDeviceTrialStatus: () => {
    eligible: boolean;
    claimed: boolean;
    deviceId: string;
    cooldownDaysRemaining: number;
    lastClaimedDate?: string;
    claimedEmail?: string;
    permissionGranted: boolean;
  };

  // Website Custom Promotional Banner & Text Design (Configured by Admin)
  websiteBannerConfig: WebsiteBannerConfig;
  updateWebsiteBannerConfig: (config: WebsiteBannerConfig) => void;

  // Subsection & Sub-mock Facility
  addSubMockTest: (parentTestId: string, subMockData: Partial<MockTest>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEYS = {
  DARK_MODE: 'upto_selection_dark_mode_v2',
  ADMIN_EXAMS: 'upto_selection_admin_exams',
  SELECTED_EXAM: 'upto_selection_selected_exam',
  TESTS: 'upto_selection_tests_v2',
  ATTEMPTS: 'upto_selection_attempts_v2',
  CURRENT_USER: 'upto_selection_user_v2',
  STUDENTS: 'upto_selection_students_v2',
  PAYMENT_CONFIG: 'upto_selection_payment_cfg_v2',
  EBOOKS: 'upto_selection_ebooks_v2',
  TIMELINE: 'upto_selection_timeline_v2',
  BOOKMARKS: 'upto_selection_bookmarks_v2',
  BOOKMARKED_MOCKS: 'upto_selection_bookmarked_mocks_v2',
  ADMIN_GMAIL: 'upto_selection_admin_gmail',
  ADMIN_PHONE: 'upto_selection_admin_phone',
  ADMIN_PASSWORD: 'upto_selection_admin_password',
  IS_ADMIN_AUTH: 'upto_selection_is_admin_auth',
  TEACH_APPS: 'upto_selection_teach_apps',
  WEBSITE_BANNER: 'upto_selection_website_banner_v1',
  DEVICE_TRIAL: 'upto_device_trial_record_v1'
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Dark Mode (properly applied to html element)
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.DARK_MODE);
    return saved !== null ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.DARK_MODE, JSON.stringify(darkMode));
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  // 10 Indian Languages State
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    const saved = localStorage.getItem('upto_selection_lang_v1');
    return (saved as LanguageCode) || 'en';
  });

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    localStorage.setItem('upto_selection_lang_v1', lang);
  };

  const t = (key: string): string => {
    return UI_TRANSLATIONS[language]?.[key] || UI_TRANSLATIONS.en[key] || key;
  };

  // Accessibility: Font Size (Normal, Large, Extra Large) & High Contrast (TCS Standard)
  const [fontSize, setFontSizeState] = useState<'normal' | 'large' | 'xlarge'>(() => {
    const saved = localStorage.getItem('upto_selection_font_size');
    return (saved as any) || 'normal';
  });

  const setFontSize = (size: 'normal' | 'large' | 'xlarge') => {
    setFontSizeState(size);
    localStorage.setItem('upto_selection_font_size', size);
  };

  const [highContrast, setHighContrastState] = useState<boolean>(() => {
    return localStorage.getItem('upto_selection_high_contrast') === 'true';
  });

  const setHighContrast = (val: boolean) => {
    setHighContrastState(val);
    localStorage.setItem('upto_selection_high_contrast', val ? 'true' : 'false');
  };

  // 2. Admin Exams (Added and deleted strictly by admin in Admin Panel)
  const [adminExams, setAdminExams] = useState<AdminExam[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.ADMIN_EXAMS);
    if (saved) {
      try {
        const parsed: AdminExam[] = JSON.parse(saved);
        const existingNames = new Set(parsed.map(e => e.name.toLowerCase()));
        const missing = INITIAL_ADMIN_EXAMS.filter(e => !existingNames.has(e.name.toLowerCase()));
        return [...parsed, ...missing];
      } catch (err) {
        return INITIAL_ADMIN_EXAMS;
      }
    }
    return INITIAL_ADMIN_EXAMS;
  });

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.ADMIN_EXAMS, JSON.stringify(adminExams));
  }, [adminExams]);

  const addAdminExam = (exam: AdminExam) => {
    setAdminExams(prev => [exam, ...prev]);
  };

  const updateAdminExam = (updatedExam: AdminExam) => {
    setAdminExams(prev => prev.map(e => e.id === updatedExam.id ? updatedExam : e));
  };

  const deleteAdminExam = (examId: string) => {
    // Security enforcement: All exams cannot be deleted freely; only admin in admin panel can delete
    if (!isAdminAuthenticated) {
      console.warn('Security Block: Examinations can only be deleted by an authorized administrator in the Admin Panel.');
      alert('Security Notice: Only an authorized Administrator can delete examinations inside the Admin Panel.');
      return;
    }
    setAdminExams(prev => prev.filter(e => e.id !== examId));
  };

  // 3. Selected Exam Name on Homepage (determines which mocks & PDFs show)
  const [selectedExamName, setSelectedExamName] = useState<string>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.SELECTED_EXAM);
    return saved || INITIAL_ADMIN_EXAMS[0]?.name || 'SSC CGL 2026 Tier-1';
  });

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.SELECTED_EXAM, selectedExamName);
  }, [selectedExamName]);

  // 4. View Router
  const [currentView, setCurrentView] = useState<'dashboard' | 'mock_tests' | 'active_test' | 'analytics' | 'notifications' | 'ebooks' | 'admin' | 'teach_with_us'>('dashboard');

  // 5. Current Student User & Portal Login (with Country selection: India = all access, Other = eBooks & PDFs)
  const [currentUser, setCurrentUser] = useState<StudentUser>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.CURRENT_USER);
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS[0];
  });

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
  }, [currentUser]);

  const [googleLoginModalOpen, setGoogleLoginModalOpen] = useState(false);

  const loginWithGoogle = (email: string, name: string, country: string = 'India') => {
    const isOwner = email.toLowerCase() === adminGmail.toLowerCase();
    setCurrentUser(prev => ({
      ...prev,
      name,
      email,
      country: country || 'India',
      phone: prev.phone || '+91 98765 00000',
    }));
    if (isOwner) {
      setIsAdminAuthenticated(true);
      localStorage.setItem(LOCAL_STORAGE_KEYS.IS_ADMIN_AUTH, 'true');
    }
    setGoogleLoginModalOpen(false);
  };

  // Language Converter & PDF Maker State (Documents / Images / Text / PDF Maker)
  const [imageToPdfModalOpen, setImageToPdfModalOpen] = useState(false);
  const [converterTab, setConverterTab] = useState<'documents' | 'images' | 'text' | 'translator' | 'image_to_pdf' | 'pdf_to_image' | 'pdf_maker'>('documents');

  const openConverter = (tab: 'documents' | 'images' | 'text' | 'translator' | 'image_to_pdf' | 'pdf_to_image' | 'pdf_maker' = 'documents') => {
    setConverterTab(tab);
    setImageToPdfModalOpen(true);
  };

  // Daily / Monthly Free Current Affairs State
  const [currentAffairs, setCurrentAffairs] = useState<CurrentAffairsItem[]>(() => {
    const saved = localStorage.getItem('upto_selection_current_affairs_v1');
    return saved ? JSON.parse(saved) : INITIAL_CURRENT_AFFAIRS;
  });

  useEffect(() => {
    localStorage.setItem('upto_selection_current_affairs_v1', JSON.stringify(currentAffairs));
  }, [currentAffairs]);

  const addCurrentAffairs = (item: CurrentAffairsItem) => {
    setCurrentAffairs(prev => [item, ...prev]);
  };

  const deleteCurrentAffairs = (id: string) => {
    setCurrentAffairs(prev => prev.filter(c => c.id !== id));
  };

  // Broadcast Notifications State
  const [broadcastNotifications, setBroadcastNotifications] = useState<BroadcastNotification[]>(() => {
    const saved = localStorage.getItem('upto_selection_broadcast_notifs_v1');
    return saved ? JSON.parse(saved) : INITIAL_BROADCAST_NOTIFICATIONS;
  });

  useEffect(() => {
    localStorage.setItem('upto_selection_broadcast_notifs_v1', JSON.stringify(broadcastNotifications));
  }, [broadcastNotifications]);

  const sendBroadcastNotification = (notif: BroadcastNotification) => {
    setBroadcastNotifications(prev => [notif, ...prev]);
  };

  const deleteBroadcastNotification = (id: string) => {
    setBroadcastNotifications(prev => prev.filter(b => b.id !== id));
  };

  // Coupon Code & Discount System
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discountPercent: number } | null>(null);

  const applyCoupon = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    const targetCode = (paymentConfig.couponCode || 'SELECTION50').trim().toUpperCase();
    if (cleanCode === targetCode) {
      const discountPercent = paymentConfig.couponDiscountPercent || 20;
      setAppliedCoupon({ code: cleanCode, discountPercent });
      return { 
        success: true, 
        message: `🎉 Coupon "${cleanCode}" successfully applied! ${discountPercent}% discount activated!`, 
        discountPercent 
      };
    }
    return { 
      success: false, 
      message: `Invalid coupon code. Try "${targetCode}" or view active offers.`, 
      discountPercent: 0 
    };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const logoutUser = () => {
    setIsAdminAuthenticated(false);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.IS_ADMIN_AUTH);
  };

  // 6. Secure Admin Authentication & Profile (Password, Phone Number & Email)
  // Default authorized email: paronaskar8@gmail.com, default password: upto@2026
  const [adminGmail, setAdminGmailState] = useState<string>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.ADMIN_GMAIL);
    return saved || 'paronaskar8@gmail.com';
  });

  const [adminPhone, setAdminPhoneState] = useState<string>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.ADMIN_PHONE);
    return saved || '+91 98765 43210';
  });

  const [adminPassword, setAdminPasswordState] = useState<string>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.ADMIN_PASSWORD);
    return saved || 'upto@2026';
  });

  const setAdminGmail = (email: string) => {
    const cleaned = email.trim();
    setAdminGmailState(cleaned);
    localStorage.setItem(LOCAL_STORAGE_KEYS.ADMIN_GMAIL, cleaned);
  };

  const setAdminPhone = (phone: string) => {
    const cleaned = phone.trim();
    setAdminPhoneState(cleaned);
    localStorage.setItem(LOCAL_STORAGE_KEYS.ADMIN_PHONE, cleaned);
  };

  const setAdminPassword = (password: string) => {
    setAdminPasswordState(password);
    localStorage.setItem(LOCAL_STORAGE_KEYS.ADMIN_PASSWORD, password);
  };

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.IS_ADMIN_AUTH);
    return saved === 'true';
  });

  const [adminLoginError, setAdminLoginError] = useState<string | null>(null);

  const loginAsAdmin = (email: string, pass: string): boolean => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanAdmin = adminGmail.trim().toLowerCase();

    if (cleanEmail !== cleanAdmin) {
      setAdminLoginError(`Access Denied: Unrecognized Admin Email. Only registered admin account (${adminGmail}) is permitted.`);
      return false;
    }

    if (pass !== adminPassword) {
      setAdminLoginError('Access Denied: Incorrect Admin Password. Please enter the valid administrator password.');
      return false;
    }

    setIsAdminAuthenticated(true);
    localStorage.setItem(LOCAL_STORAGE_KEYS.IS_ADMIN_AUTH, 'true');
    setAdminLoginError(null);
    setCurrentUser(prev => ({ ...prev, email: cleanEmail, name: 'Admin Master', phone: adminPhone }));
    return true;
  };

  // Backwards compatible login
  const loginAsAdminWithGmail = (email: string, password?: string): boolean => {
    if (password !== undefined) {
      return loginAsAdmin(email, password);
    }
    return loginAsAdmin(email, adminPassword);
  };

  // Admin Profile Update: Phone, Email, Password
  const updateAdminProfile = (updates: {
    email?: string;
    phone?: string;
    currentPassword?: string;
    newPassword?: string;
  }): { success: boolean; message: string } => {
    // If requesting password change, must verify current password
    if (updates.newPassword) {
      if (!updates.currentPassword || updates.currentPassword !== adminPassword) {
        return { 
          success: false, 
          message: 'Current password is incorrect. Please verify your current administrator password.' 
        };
      }
      if (updates.newPassword.length < 5) {
        return { 
          success: false, 
          message: 'New password must be at least 5 characters long.' 
        };
      }
      setAdminPassword(updates.newPassword);
    }

    if (updates.phone && updates.phone.trim()) {
      setAdminPhone(updates.phone.trim());
    }

    if (updates.email && updates.email.trim()) {
      setAdminGmail(updates.email.trim());
      setCurrentUser(prev => ({ ...prev, email: updates.email!.trim() }));
    }

    return {
      success: true,
      message: 'Admin security credentials updated and saved permanently!'
    };
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.IS_ADMIN_AUTH);
    setCurrentView('dashboard');
  };

  // 7. Mock Tests (Added and deleted by admin)
  const [mockTests, setMockTests] = useState<MockTest[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.TESTS);
    return saved ? JSON.parse(saved) : INITIAL_MOCK_TESTS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.TESTS, JSON.stringify(mockTests));
    } catch (err) {
      console.warn('LocalStorage quota limit reached for tests, saving lightweight records:', err);
      try {
        const lightweightTests = mockTests.map(t => ({
          ...t,
          attachedPdf: {
            ...t.attachedPdf,
            pdfDataUrl: (t.attachedPdf?.pdfDataUrl && t.attachedPdf.pdfDataUrl.length > 50000)
              ? undefined
              : t.attachedPdf?.pdfDataUrl
          }
        }));
        localStorage.setItem(LOCAL_STORAGE_KEYS.TESTS, JSON.stringify(lightweightTests));
      } catch (err2) {
        console.error('Failed to store tests:', err2);
      }
    }
  }, [mockTests]);

  const addMockTest = (test: MockTest) => {
    setMockTests(prev => [test, ...prev]);
  };

  const updateMockTest = (updatedTest: MockTest) => {
    setMockTests(prev => prev.map(t => t.id === updatedTest.id ? updatedTest : t));
  };

  const deleteMockTest = (testId: string) => {
    setMockTests(prev => prev.filter(t => t.id !== testId));
  };

  // Live Tests State (Add live tests with scheduled time by admin)
  const [liveTests, setLiveTests] = useState<LiveTest[]>(() => {
    const saved = localStorage.getItem('upto_selection_live_tests_v1');
    return saved ? JSON.parse(saved) : INITIAL_LIVE_TESTS;
  });

  useEffect(() => {
    localStorage.setItem('upto_selection_live_tests_v1', JSON.stringify(liveTests));
  }, [liveTests]);

  const addLiveTest = (test: LiveTest) => {
    setLiveTests(prev => [test, ...prev]);
  };

  const deleteLiveTest = (testId: string) => {
    setLiveTests(prev => prev.filter(t => t.id !== testId));
  };

  const updateLiveTest = (updated: LiveTest) => {
    setLiveTests(prev => prev.map(t => t.id === updated.id ? updated : t));
  };

  // 8. Free Test Evaluation: 1 free chapterwise, 1 free full mock, 1 free sectional per exam (or admin configured)
  const isTestFreeForStudent = (test: MockTest): boolean => {
    // If user has active pass covering this exam or ALL exams, it's unlocked
    if (currentUser.subscription.active) {
      if (currentUser.subscription.unlockedExams?.includes('ALL') || 
          currentUser.subscription.unlockedExams?.includes(test.examName)) {
        return true;
      }
    }

    const examConfig = adminExams.find(e => e.name === test.examName);
    const limits = examConfig?.freeLimits || { chapterWiseFree: 1, fullMockFree: 1, sectionWiseFree: 1 };

    // Find tests of same exam & type
    const sameExamAndTypeTests = mockTests.filter(t => t.examName === test.examName && t.type === test.type);
    const testIndex = sameExamAndTypeTests.findIndex(t => t.id === test.id);

    const allowedFree = test.type === 'chapter_wise' ? limits.chapterWiseFree
      : test.type === 'section_wise' ? limits.sectionWiseFree
      : limits.fullMockFree;

    return testIndex >= 0 && testIndex < allowedFree;
  };

  const updateExamFreeLimits = (examId: string, limits: { chapterWiseFree: number; fullMockFree: number; sectionWiseFree: number }) => {
    setAdminExams(prev => prev.map(e => e.id === examId ? { ...e, freeLimits: limits } : e));
  };

  // 9. Payment Config (Ensure day1 trial plan is ₹2 for 7 days)
  const [paymentConfig, setPaymentConfig] = useState<PaymentGatewayConfig>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.PAYMENT_CONFIG);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (!parsed.prices) parsed.prices = { ...INITIAL_PAYMENT_CONFIG.prices };
        // Ensure trial plan is ₹2 as requested
        if (parsed.prices.day1 === 0 || parsed.prices.day1 === 5 || parsed.prices.day1 === undefined) {
          parsed.prices.day1 = 2;
        }
        return parsed;
      } catch (e) {
        return INITIAL_PAYMENT_CONFIG;
      }
    }
    return INITIAL_PAYMENT_CONFIG;
  });

  const updatePaymentConfig = (config: PaymentGatewayConfig) => {
    setPaymentConfig(config);
    localStorage.setItem(LOCAL_STORAGE_KEYS.PAYMENT_CONFIG, JSON.stringify(config));
  };

  // 10. Notifications Timeline (State-wise & Central-wise with Dates)
  const [notificationsTimeline, setNotificationsTimeline] = useState<ExamNotificationTimeline[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.TIMELINE);
    if (saved) {
      try {
        const parsed: ExamNotificationTimeline[] = JSON.parse(saved);
        const existingNames = new Set(parsed.map(t => t.examName.toLowerCase()));
        const missing = INITIAL_NOTIFICATIONS_TIMELINE.filter(t => !existingNames.has(t.examName.toLowerCase()));
        return [...parsed, ...missing];
      } catch (err) {
        return INITIAL_NOTIFICATIONS_TIMELINE;
      }
    }
    return INITIAL_NOTIFICATIONS_TIMELINE;
  });

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.TIMELINE, JSON.stringify(notificationsTimeline));
  }, [notificationsTimeline]);

  const addNotificationTimeline = (item: ExamNotificationTimeline) => {
    setNotificationsTimeline(prev => [item, ...prev]);
  };

  const updateNotificationTimeline = (item: ExamNotificationTimeline) => {
    setNotificationsTimeline(prev => prev.map(n => n.id === item.id ? item : n));
  };

  const deleteNotificationTimeline = (id: string) => {
    setNotificationsTimeline(prev => prev.filter(n => n.id !== id));
  };

  // 11. Free E-Books (Added & deleted by admin)
  const [ebooks, setEbooks] = useState<EBook[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.EBOOKS);
    return saved ? JSON.parse(saved) : INITIAL_EBOOKS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.EBOOKS, JSON.stringify(ebooks));
    } catch (err) {
      console.warn('LocalStorage quota limit reached for ebooks, saving lightweight records:', err);
      try {
        const lightweightEbooks = ebooks.map(b => ({
          ...b,
          pdfDataUrl: (b.pdfDataUrl && b.pdfDataUrl.length > 50000) ? undefined : b.pdfDataUrl
        }));
        localStorage.setItem(LOCAL_STORAGE_KEYS.EBOOKS, JSON.stringify(lightweightEbooks));
      } catch (err2) {
        console.error('Failed to store ebooks:', err2);
      }
    }
  }, [ebooks]);

  const addEBook = (ebook: EBook) => {
    setEbooks(prev => [ebook, ...prev]);
  };

  const deleteEBook = (id: string) => {
    setEbooks(prev => prev.filter(b => b.id !== id));
  };

  // 12. Students List for Admin
  const [students, setStudents] = useState<StudentUser[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.STUDENTS);
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  }, [students]);

  const updateStudent = (updated: StudentUser) => {
    setStudents(prev => prev.map(s => s.id === updated.id ? updated : s));
    if (currentUser.id === updated.id) {
      setCurrentUser(updated);
    }
  };

  const deleteStudent = (studentId: string) => {
    setStudents(prev => prev.filter(s => s.id !== studentId));
  };

  const extendStudentSubscription = (studentId: string, days: number) => {
    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        const currentDays = s.subscription.active ? s.subscription.daysRemaining : 0;
        return {
          ...s,
          subscription: {
            ...s.subscription,
            active: true,
            planName: s.subscription.planName || 'Extended Pass',
            daysRemaining: currentDays + days,
            unlockedExams: ['ALL']
          }
        };
      }
      return s;
    }));
  };

  // 13. Attempts & Automated Tier Evaluation (Bronze, Silver, Gold)
  const [attempts, setAttempts] = useState<ExamAttempt[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.ATTEMPTS);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.ATTEMPTS, JSON.stringify(attempts));
  }, [attempts]);

  const [activeAttemptResult, setActiveAttemptResult] = useState<ExamAttempt | null>(null);

  // Compute User Tier dynamically
  const userTier: UserLevelTier = (() => {
    if (currentUser.avgAccuracy >= 80 && currentUser.totalTestsGiven >= 3) return 'Gold';
    if (currentUser.avgAccuracy >= 60 && currentUser.totalTestsGiven >= 1) return 'Silver';
    return 'Bronze';
  })();

  const recordAttempt = (attempt: ExamAttempt) => {
    setAttempts(prev => [attempt, ...prev]);
    setActiveAttemptResult(attempt);
    
    // Update user stats and auto tier
    setCurrentUser(prev => {
      const newTotal = prev.totalTestsGiven + 1;
      const newAvgScore = Math.round(((prev.avgScore * prev.totalTestsGiven) + attempt.score) / newTotal);
      const newAccuracy = Math.round(((prev.avgAccuracy * prev.totalTestsGiven) + attempt.accuracy) / newTotal);
      const newTier: UserLevelTier = (newAccuracy >= 80 && newTotal >= 3) ? 'Gold' : (newAccuracy >= 60) ? 'Silver' : 'Bronze';

      return {
        ...prev,
        totalTestsGiven: newTotal,
        avgScore: newAvgScore,
        avgAccuracy: newAccuracy,
        userTier: newTier
      };
    });
  };

  const viewAttemptAnalytics = (attemptId: string) => {
    const found = attempts.find(a => a.id === attemptId);
    if (found) {
      setActiveAttemptResult(found);
      setCurrentView('analytics');
    }
  };

  // 14. "Teach With Us" Applications (Dynamic 15 teacher candidates cycling every 5 days + live user submissions)
  const [userSubmittedTeachApps, setUserSubmittedTeachApps] = useState<TeachWithUsApplication[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.TEACH_APPS);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.TEACH_APPS, JSON.stringify(userSubmittedTeachApps));
  }, [userSubmittedTeachApps]);

  // Combine live user submissions with the rotating pool of 15 candidates
  const teachApplications: TeachWithUsApplication[] = [
    ...userSubmittedTeachApps,
    ...get15TeacherCandidates()
  ];

  const submitTeachWithUsApplication = (mobile: string, subject: string) => {
    const newApp: TeachWithUsApplication = {
      id: 'tapp-' + Date.now(),
      candidateName: currentUser.name,
      candidateEmail: currentUser.email,
      mobileNumber: mobile,
      phoneNumber: mobile,
      subjectExpertise: subject,
      userTier,
      highestAccuracy: currentUser.avgAccuracy || 88,
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'Interview Scheduled',
      notes: `Direct application submitted by student with mobile ${mobile}.`
    };
    setUserSubmittedTeachApps(prev => [newApp, ...prev]);
  };

  // Website Live Visitors & Activity (for Admin Panel)
  const [websiteVisitorActivity, setWebsiteVisitorActivity] = useState(INITIAL_WEBSITE_VISITOR_ACTIVITY);

  // Live simulation ticker for visitor numbers
  useEffect(() => {
    const timer = setInterval(() => {
      setWebsiteVisitorActivity(prev => {
        const delta = Math.floor(Math.random() * 5) - 2; // -2 to +2
        const newLive = Math.max(1200, prev.liveVisitorsNow + delta);
        const newTotal = prev.totalVisitors + (Math.random() > 0.5 ? 1 : 0);
        return {
          ...prev,
          totalVisitors: newTotal,
          liveVisitorsNow: newLive
        };
      });
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // 15. Active Test Player & Segment Configuration
  const [activeTest, setActiveTest] = useState<MockTest | null>(null);
  const [activeSegmentConfig, setActiveSegmentConfig] = useState<{
    enabled: boolean;
    segmentSize: number;
    startIndex: number;
    endIndex: number;
  } | null>(null);

  const startFullMockTest = (test: MockTest) => {
    setActiveTest(test);
    setActiveSegmentConfig(null);
    setCurrentView('active_test');
  };

  const startCustomSegmentTest = (test: MockTest, segmentSize: number, startIndex: number = 0) => {
    setActiveTest(test);
    const endIndex = Math.min(startIndex + segmentSize, test.questions.length);
    setActiveSegmentConfig({
      enabled: true,
      segmentSize,
      startIndex,
      endIndex
    });
    setCurrentView('active_test');
  };

  // 16. PDF Reader (Read Only, No Student File Download)
  const [activeReadingPdf, setActiveReadingPdf] = useState<{
    pdf: AttachedPdf;
    testTitle: string;
    testId: string;
    examName: string;
  } | null>(null);

  const openPdfReader = (test: MockTest) => {
    setActiveReadingPdf({
      pdf: test.attachedPdf,
      testTitle: test.title,
      testId: test.id,
      examName: test.examName
    });
  };

  const closePdfReader = () => {
    setActiveReadingPdf(null);
  };

  // 17. Bookmarking
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState<string[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.BOOKMARKS);
    return saved ? JSON.parse(saved) : ['q-cgl-01'];
  });

  const toggleBookmarkQuestion = (qId: string) => {
    setBookmarkedQuestions(prev => {
      const updated = prev.includes(qId) ? prev.filter(id => id !== qId) : [...prev, qId];
      localStorage.setItem(LOCAL_STORAGE_KEYS.BOOKMARKS, JSON.stringify(updated));
      return updated;
    });
  };

  // Mock Test Bookmarking (Saved for Later Practice)
  const [bookmarkedMockTestIds, setBookmarkedMockTestIds] = useState<string[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.BOOKMARKED_MOCKS);
    return saved ? JSON.parse(saved) : ['cgl-mock-01'];
  });

  const toggleBookmarkMockTest = (mockTestId: string) => {
    setBookmarkedMockTestIds(prev => {
      const exists = prev.includes(mockTestId);
      const updated = exists ? prev.filter(id => id !== mockTestId) : [...prev, mockTestId];
      localStorage.setItem(LOCAL_STORAGE_KEYS.BOOKMARKED_MOCKS, JSON.stringify(updated));
      return updated;
    });
  };

  const isMockTestBookmarked = (mockTestId: string) => {
    return bookmarkedMockTestIds.includes(mockTestId);
  };

  // 18. Subscription Modal & Checkout
  const [subscriptionModalOpen, setSubscriptionModalOpen] = useState<boolean>(false);
  const [selectedPlanForPayment, setSelectedPlanForPayment] = useState<SubscriptionPlan | null>(null);

  const openPaymentCheckout = (plan: SubscriptionPlan) => {
    setSelectedPlanForPayment(plan);
    setSubscriptionModalOpen(false);
  };

  // Generate or retrieve deterministic Hardware/Browser Device Fingerprint ID
  const [deviceFingerprintId] = useState<string>(() => {
    const savedFp = localStorage.getItem('upto_hardware_device_fp_v2');
    if (savedFp) return savedFp;
    const rawSig = typeof window !== 'undefined'
      ? [
          navigator.userAgent || '',
          navigator.language || '',
          screen?.width || 1920,
          screen?.height || 1080,
          screen?.colorDepth || 24,
          navigator.hardwareConcurrency || 4,
          Intl?.DateTimeFormat()?.resolvedOptions()?.timeZone || 'Asia/Kolkata'
        ].join('|')
      : 'default-device';
    let hash = 0;
    for (let i = 0; i < rawSig.length; i++) {
      hash = ((hash << 5) - hash) + rawSig.charCodeAt(i);
      hash |= 0;
    }
    const fp = `DEV-AUTH-${Math.abs(hash).toString(16).toUpperCase().padStart(8, '0')}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    try {
      localStorage.setItem('upto_hardware_device_fp_v2', fp);
    } catch (e) {
      console.error(e);
    }
    return fp;
  });

  const [deviceAuthPermissionGranted, setDeviceAuthPermissionGranted] = useState<boolean>(() => {
    return localStorage.getItem('upto_device_auth_permission_v2') === 'true';
  });

  const THREE_MONTHS_MS = 90 * 24 * 60 * 60 * 1000; // 90 Days (3 Months)

  const checkDeviceTrialStatus = () => {
    let deviceRecord: {
      claimed: boolean;
      claimedEmail: string;
      deviceId: string;
      date: string;
      timestampMs?: number;
    } | null = null;

    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEYS.DEVICE_TRIAL);
      if (stored) {
        deviceRecord = JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error reading device trial info', e);
    }

    if (deviceRecord && deviceRecord.claimed) {
      const claimedTimeMs = deviceRecord.timestampMs || new Date(deviceRecord.date).getTime();
      const elapsedMs = Date.now() - claimedTimeMs;
      if (elapsedMs < THREE_MONTHS_MS) {
        const remainingMs = THREE_MONTHS_MS - elapsedMs;
        const cooldownDaysRemaining = Math.max(1, Math.ceil(remainingMs / (1000 * 60 * 60 * 24)));
        return {
          eligible: false,
          claimed: true,
          deviceId: deviceRecord.deviceId || deviceFingerprintId,
          cooldownDaysRemaining,
          lastClaimedDate: new Date(claimedTimeMs).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
          claimedEmail: deviceRecord.claimedEmail,
          permissionGranted: deviceAuthPermissionGranted
        };
      }
    }

    return {
      eligible: true,
      claimed: false,
      deviceId: deviceFingerprintId,
      cooldownDaysRemaining: 0,
      permissionGranted: deviceAuthPermissionGranted
    };
  };

  const requestDeviceAuthenticationPermission = () => {
    setDeviceAuthPermissionGranted(true);
    try {
      localStorage.setItem('upto_device_auth_permission_v2', 'true');
    } catch (e) {
      console.error(e);
    }

    const status = checkDeviceTrialStatus();
    if (!status.eligible) {
      return {
        granted: true,
        deviceId: status.deviceId,
        eligible: false,
        cooldownDaysRemaining: status.cooldownDaysRemaining,
        lastClaimedDate: status.lastClaimedDate,
        message: `Device Restriction (1 Trial Per 3 Months): Device [${status.deviceId}] already used a 7-Day Trial on ${status.lastClaimedDate} (${status.claimedEmail || 'Registered Account'}). Another trial on this device is blocked for ${status.cooldownDaysRemaining} more days. Please select a 1-Month (₹49), 6-Month (₹199), or 1-Year (₹399) Pass.`
      };
    }

    return {
      granted: true,
      deviceId: status.deviceId,
      eligible: true,
      cooldownDaysRemaining: 0,
      message: `✓ Device Authentication Verified (${status.deviceId}). This device is eligible for the ₹2 for 7 Days Trial Pass!`
    };
  };

  const completePayment = (plan: SubscriptionPlan, paymentMethod: string = 'UPI', transactionId: string = '') => {
    const expiresDate = new Date();
    expiresDate.setDate(expiresDate.getDate() + plan.durationDays);

    const unlockedExams = plan.id === 'single_exam' ? [selectedExamName] : ['ALL'];

    // If completing the ₹2 7-Day Trial plan ('day1'), record the 3-month (90-day) device lock
    if (plan.id === 'day1') {
      const newRecord = {
        claimed: true,
        claimedEmail: (currentUser.email || 'student@gmail.com').trim().toLowerCase(),
        deviceId: deviceFingerprintId,
        date: new Date().toISOString(),
        timestampMs: Date.now()
      };
      try {
        localStorage.setItem(LOCAL_STORAGE_KEYS.DEVICE_TRIAL, JSON.stringify(newRecord));
        localStorage.setItem('upto_device_auth_permission_v2', 'true');
        setDeviceAuthPermissionGranted(true);
      } catch (e) {
        console.error(e);
      }
    }

    setCurrentUser(prev => ({
      ...prev,
      hasFreeTrialClaimed: plan.id === 'day1' ? true : prev.hasFreeTrialClaimed,
      subscription: {
        active: true,
        planId: plan.id,
        planName: plan.name,
        expiresAt: expiresDate.toISOString().split('T')[0],
        purchasedAt: new Date().toISOString().split('T')[0],
        daysRemaining: plan.durationDays,
        unlockedExams
      }
    }));

    // Add activity record
    setWebsiteVisitorActivity(prev => ({
      ...prev,
      recentActivities: [
        {
          id: 'act-' + Date.now(),
          text: `${currentUser.name} purchased ${plan.name} via ${paymentMethod} (${transactionId || 'Confirmed'})`,
          timestamp: 'Just now',
          type: 'pass_purchase'
        },
        ...prev.recentActivities.slice(0, 15)
      ]
    }));
  };

  // 19. 7-Day ₹2 Trial Logic with Strict 3-Month (90-Day) 1-Device Restriction & Device Auth Permission
  const claim7DayFreeTrial = (targetEmail?: string): { success: boolean; message: string; blocked?: boolean } => {
    const userEmail = (targetEmail || currentUser.email || 'student@gmail.com').trim().toLowerCase();

    if (!deviceAuthPermissionGranted) {
      return {
        success: false,
        blocked: false,
        message: 'Device Authentication Permission Required: Please grant device authentication permission to verify your 1-device-per-3-months trial eligibility.'
      };
    }

    const status = checkDeviceTrialStatus();
    if (!status.eligible) {
      return {
        success: false,
        blocked: true,
        message: `3-Month Device Trial Restriction: Only 1 trial is allowed per device in 3 months (90 days). This device (${status.deviceId}) already claimed a 7-Day Trial on ${status.lastClaimedDate} with account (${status.claimedEmail}). Cooldown remaining: ${status.cooldownDaysRemaining} days. Please choose the ₹49 (1-Month), ₹199 (6-Month), or ₹399 (1-Year) Pass.`
      };
    }

    const newRecord = {
      claimed: true,
      claimedEmail: userEmail,
      deviceId: deviceFingerprintId,
      date: new Date().toISOString(),
      timestampMs: Date.now()
    };

    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.DEVICE_TRIAL, JSON.stringify(newRecord));
    } catch (e) {
      console.error(e);
    }

    const expiresDate = new Date();
    expiresDate.setDate(expiresDate.getDate() + 7);

    setCurrentUser(prev => ({
      ...prev,
      hasFreeTrialClaimed: true,
      subscription: {
        active: true,
        planId: 'day1',
        planName: '7-Day Trial Pass (₹2)',
        expiresAt: expiresDate.toISOString().split('T')[0],
        purchasedAt: new Date().toISOString().split('T')[0],
        daysRemaining: 7,
        unlockedExams: ['ALL']
      }
    }));

    setWebsiteVisitorActivity(prev => ({
      ...prev,
      recentActivities: [
        {
          id: 'act-' + Date.now(),
          text: `${currentUser.name} activated ₹2 7-Day Trial Pass (Device ${deviceFingerprintId} Authenticated)`,
          timestamp: 'Just now',
          type: 'pass_purchase'
        },
        ...prev.recentActivities.slice(0, 15)
      ]
    }));

    return {
      success: true,
      message: `🎉 7-Day Trial Pass (₹2) activated on Device [${deviceFingerprintId}]! All exams, CBT mock tests & attached PDFs are unlocked for 7 days.`
    };
  };

  // 20. Website Promotional Banner & Text Design State (Admin Controlled)
  const [websiteBannerConfig, setWebsiteBannerConfig] = useState<WebsiteBannerConfig>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.WEBSITE_BANNER);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return {
      enabled: true,
      badgeText: '🔥 OFFICIAL 7-DAY FREE TRIAL ACTIVE',
      headingText: 'Targeting Real CBT Exams Across India',
      subheadingText: 'Official CBT pattern mock tests, chapter quizzes, and attached study lesson notes curated by top faculty.',
      imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80',
      textDesign: 'gradient_modern',
      textAlignment: 'left',
      ctaButtonText: 'Start 7-Day Free Trial',
      ctaButtonAction: 'trial'
    };
  });

  const updateWebsiteBannerConfig = (config: WebsiteBannerConfig) => {
    setWebsiteBannerConfig(config);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.WEBSITE_BANNER, JSON.stringify(config));
    } catch (e) {
      console.error(e);
    }
  };

  // 21. Subsection & Sub-mock Facility
  const addSubMockTest = (parentTestId: string, subMockData: Partial<MockTest>) => {
    const parent = mockTests.find(m => m.id === parentTestId);
    const newSubMock: MockTest = {
      id: `mock-sub-${Date.now()}`,
      category: subMockData.category || parent?.category || 'SSC',
      examName: subMockData.examName || parent?.examName || selectedExamName,
      title: subMockData.title || `${parent?.title || 'Mock'} - Sub-section Test`,
      description: subMockData.description || `Specialized subsection mock test linked to ${parent?.title || 'Exam series'}.`,
      type: subMockData.type || 'section_wise',
      chapterOrSectionName: subMockData.chapterOrSectionName || parent?.chapterOrSectionName || 'General',
      subsection: subMockData.subsection || 'Sub-tier Module',
      parentMockId: parentTestId,
      isSubMock: true,
      durationMinutes: subMockData.durationMinutes || 30,
      totalMarks: subMockData.totalMarks || 50,
      totalQuestions: subMockData.questions?.length || 25,
      sections: subMockData.sections || (parent ? parent.sections : ['General']),
      subsections: subMockData.subsections || [subMockData.subsection || 'Module 1'],
      attachedPdf: subMockData.attachedPdf || (parent ? parent.attachedPdf : {
        title: 'Attached Subsection Study Guide',
        pagesCount: 5,
        summary: 'Focused notes for this subsection.',
        contentMarkdown: '# Subsection Lesson Notes',
        readTimeMinutes: 5
      }),
      questions: subMockData.questions || (parent ? parent.questions.slice(0, 15) : []),
      cutoffMarks: subMockData.cutoffMarks || (parent ? parent.cutoffMarks : { general: 35, obc: 32, sc_st: 28, ews: 30 }),
      attemptsCount: 0,
      avgScore: 0,
      isFree: subMockData.isFree ?? true
    };

    setMockTests(prev => [newSubMock, ...prev]);
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        language,
        setLanguage,
        t,
        fontSize,
        setFontSize,
        highContrast,
        setHighContrast,
        selectedExamName,
        setSelectedExamName,
        adminExams,
        addAdminExam,
        updateAdminExam,
        deleteAdminExam,
        darkMode,
        toggleDarkMode,
        currentUser,
        googleLoginModalOpen,
        setGoogleLoginModalOpen,
        loginWithGoogle,
        logoutUser,
        adminGmail,
        adminPhone,
        setAdminGmail,
        setAdminPhone,
        isAdminAuthenticated,
        adminLoginError,
        loginAsAdmin,
        loginAsAdminWithGmail,
        updateAdminProfile,
        logoutAdmin,
        isTestFreeForStudent,
        updateExamFreeLimits,
        mockTests,
        addMockTest,
        deleteMockTest,
        updateMockTest,
        liveTests,
        addLiveTest,
        deleteLiveTest,
        updateLiveTest,
        activeTest,
        setActiveTest,
        activeSegmentConfig,
        startCustomSegmentTest,
        startFullMockTest,
        activeReadingPdf,
        openPdfReader,
        closePdfReader,
        imageToPdfModalOpen,
        setImageToPdfModalOpen,
        converterTab,
        setConverterTab,
        openConverter,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        currentAffairs,
        addCurrentAffairs,
        deleteCurrentAffairs,
        broadcastNotifications,
        sendBroadcastNotification,
        deleteBroadcastNotification,
        attempts,
        recordAttempt,
        activeAttemptResult,
        setActiveAttemptResult,
        viewAttemptAnalytics,
        userTier,
        teachApplications,
        submitTeachWithUsApplication,
        websiteVisitorActivity,
        subscriptionModalOpen,
        setSubscriptionModalOpen,
        selectedPlanForPayment,
        setSelectedPlanForPayment,
        openPaymentCheckout,
        completePayment,
        students,
        updateStudent,
        deleteStudent,
        extendStudentSubscription,
        paymentConfig,
        updatePaymentConfig,
        notificationsTimeline,
        addNotificationTimeline,
        updateNotificationTimeline,
        deleteNotificationTimeline,
        ebooks,
        addEBook,
        deleteEBook,
        bookmarkedQuestions,
        toggleBookmarkQuestion,
        bookmarkedMockTestIds,
        toggleBookmarkMockTest,
        isMockTestBookmarked,
        claim7DayFreeTrial,
        deviceAuthPermissionGranted,
        deviceFingerprintId,
        requestDeviceAuthenticationPermission,
        checkDeviceTrialStatus,
        websiteBannerConfig,
        updateWebsiteBannerConfig,
        addSubMockTest
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
