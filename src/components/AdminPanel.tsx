import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { 
  MockTest, 
  Question, 
  ExamCategory, 
  MockTestType, 
  StudentUser, 
  AdminExam,
  ExamNotificationTimeline,
  EBook, 
  PaymentGatewayConfig,
  TeachWithUsApplication,
  LiveTest,
  BroadcastNotification
} from '../types';
import { 
  Plus, 
  Trash2, 
  Edit, 
  Upload, 
  QrCode,
  Image as ImageIcon,
  FileText, 
  Users, 
  CreditCard, 
  Settings, 
  Check, 
  Sparkles, 
  Bell,
  Send, 
  AlertCircle, 
  BookOpen, 
  Layers, 
  Search, 
  ShieldCheck, 
  Calendar, 
  Lock, 
  Mail, 
  Save, 
  Phone,
  Laptop,
  CheckCircle2,
  Eye,
  EyeOff,
  Key,
  ShieldAlert,
  LogOut,
  ExternalLink,
  Activity,
  Globe,
  Radio,
  FileCheck,
  RefreshCw,
  Copy,
  MessageCircle,
  HelpCircle,
  Clock,
  Target,
  Award,
  FileUp
} from 'lucide-react';
import { 
  extractTextFromPdf, 
  fileToDataUrl, 
  parseQuestionsFromText,
  MAX_PDF_SIZE_BYTES,
  MAX_PDF_SIZE_LABEL,
  formatFileSize
} from '../utils/pdfParser';

export const AdminPanel: React.FC = () => {
  const { 
    mockTests, 
    addMockTest, 
    deleteMockTest, 
    adminExams,
    addAdminExam,
    updateAdminExam,
    deleteAdminExam,
    students, 
    extendStudentSubscription,
    paymentConfig, 
    updatePaymentConfig,
    notificationsTimeline,
    addNotificationTimeline,
    deleteNotificationTimeline,
    ebooks,
    addEBook,
    deleteEBook,
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
    currentUser,
    teachApplications,
    websiteVisitorActivity,
    liveTests,
    addLiveTest,
    deleteLiveTest,
    broadcastNotifications,
    sendBroadcastNotification,
    deleteBroadcastNotification,
    setCurrentView
  } = useApp();

  // Login Form State
  const [loginInputEmail, setLoginInputEmail] = useState(adminGmail);
  const [loginInputPassword, setLoginInputPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  const [activeTab, setActiveTab] = useState<
    'exams' | 
    'tests' | 
    'live_tests' |
    'pdf_importer' | 
    'timelines' | 
    'send_notifications' |
    'ebooks' | 
    'teach_apps' | 
    'students' | 
    'payments' | 
    'admin_security'
  >('exams');

  // Admin Profile & Security Form State (Change Phone, Email, Password)
  const [profilePhoneInput, setProfilePhoneInput] = useState(adminPhone);
  const [profileEmailInput, setProfileEmailInput] = useState(adminGmail);
  const [currentPassInput, setCurrentPassInput] = useState('');
  const [newPassInput, setNewPassInput] = useState('');
  const [confirmNewPassInput, setConfirmNewPassInput] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [profileSuccessMsg, setProfileSuccessMsg] = useState<string | null>(null);
  const [profileErrorMsg, setProfileErrorMsg] = useState<string | null>(null);

  // Exam Form State (All written by admin)
  const [examNameInput, setExamNameInput] = useState('');
  const [examCatInput, setExamCatInput] = useState('SSC');
  const [examScopeInput, setExamScopeInput] = useState<'Central' | 'State' | 'None'>('Central');
  const [examStateInput, setExamStateInput] = useState('');
  const [examDescInput, setExamDescInput] = useState('');
  const [freeChapterLimit, setFreeChapterLimit] = useState(1);
  const [freeFullMockLimit, setFreeFullMockLimit] = useState(1);
  const [freeSectionalLimit, setFreeSectionalLimit] = useState(1);
  // Cutoff marks written by admin when adding exams for all categories
  const [cutoffGeneralInput, setCutoffGeneralInput] = useState<number>(135);
  const [cutoffObcInput, setCutoffObcInput] = useState<number>(128);
  const [cutoffScStInput, setCutoffScStInput] = useState<number>(115);
  const [cutoffEwsInput, setCutoffEwsInput] = useState<number>(124);
  const [examToDelete, setExamToDelete] = useState<AdminExam | null>(null);

  // Add Exam Questions State (Section-wise / Topic-wise / Full Exam)
  const [addExamQuestionsEnabled, setAddExamQuestionsEnabled] = useState(true);
  const [examQuestionStructureMode, setExamQuestionStructureMode] = useState<'section_wise' | 'topic_wise' | 'full_exam'>('full_exam');
  const [examQuestionsList, setExamQuestionsList] = useState<Question[]>([]);
  const [examActiveSection, setExamActiveSection] = useState('Quantitative Aptitude');
  const [examActiveTopic, setExamActiveTopic] = useState('Percentage & Ratio');
  const [customSectionsList, setCustomSectionsList] = useState<string[]>([
    'Quantitative Aptitude', 
    'General Intelligence & Reasoning', 
    'English Comprehension', 
    'General Awareness'
  ]);
  const [newSectionInput, setNewSectionInput] = useState('');
  
  // Question Builder Form inside Add Exam
  const [builderQText, setBuilderQText] = useState('');
  const [builderQTextHindi, setBuilderQTextHindi] = useState('');
  const [builderQOptA, setBuilderQOptA] = useState('');
  const [builderQOptB, setBuilderQOptB] = useState('');
  const [builderQOptC, setBuilderQOptC] = useState('');
  const [builderQOptD, setBuilderQOptD] = useState('');
  const [builderQCorrectIdx, setBuilderQCorrectIdx] = useState(0);
  const [builderQMarksPos, setBuilderQMarksPos] = useState(2);
  const [builderQMarksNeg, setBuilderQMarksNeg] = useState(0.5);
  const [builderQExplanation, setBuilderQExplanation] = useState('');
  const [builderQDifficulty, setBuilderQDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');

  // Live Test Form State (Add Live Tests with Scheduled Time & Questions by Admin)
  const [liveExamName, setLiveExamName] = useState(adminExams[0]?.name || 'SSC CGL 2026 Tier-1');
  const [liveTestCat, setLiveTestCat] = useState('SSC');
  const [liveTestTitle, setLiveTestTitle] = useState('');
  const [liveTestDesc, setLiveTestDesc] = useState('');
  const [liveTestType, setLiveTestType] = useState<MockTestType>('full_mock');
  const [liveTestClassification, setLiveTestClassification] = useState('All-India National Championship Live CBT');
  const [liveTestChapterOrSec, setLiveTestChapterOrSec] = useState('');
  const [liveStartTime, setLiveStartTime] = useState(new Date(Date.now() + 86400000).toISOString().slice(0, 16));
  const [liveDurationMins, setLiveDurationMins] = useState(60);
  const [liveTotalMarks, setLiveTotalMarks] = useState(200);

  // Category-wise Cutoffs configured by Admin
  const [liveCutoffUR, setLiveCutoffUR] = useState(135);
  const [liveCutoffOBC, setLiveCutoffOBC] = useState(128);
  const [liveCutoffEWS, setLiveCutoffEWS] = useState(124);
  const [liveCutoffSC, setLiveCutoffSC] = useState(112);
  const [liveCutoffST, setLiveCutoffST] = useState(104);

  // Live Test Questions List & Upload via PDF
  const [liveQuestionsList, setLiveQuestionsList] = useState<Question[]>([]);
  const [liveSuccessMsg, setLiveSuccessMsg] = useState<string | null>(null);
  const livePdfQuestionFileInputRef = useRef<HTMLInputElement>(null);
  const [isLiveExtractingPdf, setIsLiveExtractingPdf] = useState(false);
  const [livePdfExtractProgress, setLivePdfExtractProgress] = useState<{ percent: number; stage: string } | null>(null);
  const [livePdfSuccessMsg, setLivePdfSuccessMsg] = useState<string | null>(null);

  // Live Test Question Addition Form
  const [liveQStem, setLiveQStem] = useState('');
  const [liveQOptA, setLiveQOptA] = useState('');
  const [liveQOptB, setLiveQOptB] = useState('');
  const [liveQOptC, setLiveQOptC] = useState('');
  const [liveQOptD, setLiveQOptD] = useState('');
  const [liveQCorrectIdx, setLiveQCorrectIdx] = useState(0);
  const [liveQSection, setLiveQSection] = useState('General Awareness');
  const [liveQMarksPos, setLiveQMarksPos] = useState(2);
  const [liveQMarksNeg, setLiveQMarksNeg] = useState(0.5);
  const [liveQExplanation, setLiveQExplanation] = useState('');

  // Send Broadcast Notification State (Admin notification sent option)
  const [notifTitle, setNotifTitle] = useState('');
  const [notifMessage, setNotifMessage] = useState('');
  const [notifType, setNotifType] = useState<'Alert' | 'Admit Card' | 'New Mock Test' | 'Result' | 'Discount Offer'>('Alert');
  const [notifTargetExam, setNotifTargetExam] = useState('ALL');
  const [notifSuccessMsg, setNotifSuccessMsg] = useState<string | null>(null);

  // PDF to Mock Test Importer State (All written by admin)
  const [pdfRawText, setPdfRawText] = useState('');
  const [parsedQuestions, setParsedQuestions] = useState<Question[]>([]);
  const [isExtractingPdf, setIsExtractingPdf] = useState(false);
  const [pdfExtractProgress, setPdfExtractProgress] = useState<{
    percent: number;
    stage: string;
    loadedBytes: number;
    totalBytes: number;
  } | null>(null);
  const [uploadedFileSizeStr, setUploadedFileSizeStr] = useState<string | null>(null);
  const [pdfUploadSuccessMsg, setPdfUploadSuccessMsg] = useState<string | null>(null);
  const [importSelectedExamName, setImportSelectedExamName] = useState(adminExams[0]?.name || 'SSC CGL 2026 Tier-1');
  const [importCustomCategory, setImportCustomCategory] = useState('SSC');
  const [importTestTitle, setImportTestTitle] = useState('Comprehensive Practice Mock Test');
  const [importTestType, setImportTestType] = useState<MockTestType>('full_mock');
  const [importTestTypeCustom, setImportTestTypeCustom] = useState('Full Length Mock Test');
  const [importDurationMins, setImportDurationMins] = useState(60);
  const [importPositiveMarks, setImportPositiveMarks] = useState(2);
  const [importNegativeMarks, setImportNegativeMarks] = useState(0.5);
  
  // Attached PDF for newly created test (Uploaded real PDF or custom content)
  const [pdfTitle, setPdfTitle] = useState('Mandatory Lesson Formulas & Key Concepts Guide');
  const [pdfPages, setPdfPages] = useState(12);
  const [pdfSummary, setPdfSummary] = useState('Comprehensive lesson guide with formulas, static facts, and speed tricks. Read thoroughly before taking this mock test.');
  const [pdfMarkdown, setPdfMarkdown] = useState(`# Comprehensive Lesson Guide\n\n### Key Concepts & Shortcuts\n- Revise all basic formulas before attempting the test.\n- Manage time according to the exam duration.`);
  const [attachedPdfDataUrl, setAttachedPdfDataUrl] = useState<string | undefined>(undefined);
  const [attachedPdfFileName, setAttachedPdfFileName] = useState<string | undefined>(undefined);

  // Notification Timeline Form State
  const [tlExamName, setTlExamName] = useState('');
  const [tlDept, setTlDept] = useState('');
  const [tlCategory, setTlCategory] = useState('SSC');
  const [tlScope, setTlScope] = useState<'Central' | 'State' | 'None'>('Central');
  const [tlStateName, setTlStateName] = useState('');
  const [tlNotifDate, setTlNotifDate] = useState('2026-09-01');
  const [tlExamDate, setTlExamDate] = useState('2026-11-20');
  const [tlResultDate, setTlResultDate] = useState('2027-01-15');
  const [tlPosts, setTlPosts] = useState('5,000 Posts');
  const [tlEligibility, setTlEligibility] = useState('Graduation in any discipline');
  const [tlStatus, setTlStatus] = useState<'Notification Out' | 'Admit Card Released' | 'Exam Scheduled' | 'Result Declared'>('Notification Out');
  const [tlApplyLink, setTlApplyLink] = useState('https://ssc.gov.in');

  // E-Book Form State
  const [newBookTitle, setNewBookTitle] = useState('');
  const [newBookCat, setNewBookCat] = useState('SSC');
  const [newBookSub, setNewBookSub] = useState('General Awareness');
  const [newBookPages, setNewBookPages] = useState(150);
  const [newBookSize, setNewBookSize] = useState('10.5 MB');
  const [newBookDesc, setNewBookDesc] = useState('Complete exam-focused preparation capsule.');
  const [newBookPdfDataUrl, setNewBookPdfDataUrl] = useState<string | undefined>(undefined);
  const [newBookFileName, setNewBookFileName] = useState<string | undefined>(undefined);

  // Payments Config Form State
  const [payForm, setPayForm] = useState<PaymentGatewayConfig>({ ...paymentConfig });
  const [paySaved, setPaySaved] = useState(false);
  const qrFileInputRef = useRef<HTMLInputElement>(null);

  // Admin Gmail change state
  const [newAdminEmailInput, setNewAdminEmailInput] = useState(adminGmail);

  const questionFileInputRef = useRef<HTMLInputElement>(null);
  const attachedPdfInputRef = useRef<HTMLInputElement>(null);
  const ebookPdfInputRef = useRef<HTMLInputElement>(null);

  const handleQrImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (PNG, JPG, JPEG, WEBP).');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setPayForm(prev => ({ ...prev, qrCodeUrl: dataUrl }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveUploadedQr = () => {
    setPayForm(prev => ({ ...prev, qrCodeUrl: undefined }));
    if (qrFileInputRef.current) {
      qrFileInputRef.current.value = '';
    }
  };

  // --- SECURITY CHECK: If not logged in as Admin, prompt secure login with Email & Password ---
  if (!isAdminAuthenticated) {
    return (
      <div className="max-w-md mx-auto py-16 px-4">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-2xl text-center space-y-5">
          <div className="w-16 h-16 rounded-3xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto shadow-inner">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Restricted Area
            </span>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              Admin Owner Portal
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              Protected administration interface. Enter registered Admin Gmail and administrator password to proceed.
            </p>
          </div>

          {adminLoginError && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/60 border border-rose-500/30 rounded-2xl text-xs text-rose-700 dark:text-rose-300 font-semibold flex items-center gap-1.5 text-left">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{adminLoginError}</span>
            </div>
          )}

          <div className="p-3.5 bg-blue-50/50 dark:bg-blue-950/30 rounded-2xl border border-blue-500/20 text-xs text-blue-950 dark:text-blue-200 text-left space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold">Authorized Admin Gmail:</span>
              <span className="font-mono font-bold text-xs text-blue-700 dark:text-blue-300">{adminGmail}</span>
            </div>
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-slate-500 dark:text-slate-400">Initial Password:</span>
              <span className="font-mono bg-blue-100 dark:bg-blue-900/60 px-2 py-0.5 rounded text-blue-800 dark:text-blue-200 font-bold">upto@2026</span>
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              loginAsAdmin(loginInputEmail, loginInputPassword);
            }}
            className="space-y-3.5 text-left"
          >
            <div>
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 block mb-1">
                Admin Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={loginInputEmail}
                  onChange={(e) => setLoginInputEmail(e.target.value)}
                  placeholder="Enter admin email..."
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 block mb-1">
                Admin Password
              </label>
              <div className="relative">
                <Key className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  value={loginInputPassword}
                  onChange={(e) => setLoginInputPassword(e.target.value)}
                  placeholder="Enter admin password..."
                  className="w-full pl-9 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(prev => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer"
                >
                  {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs sm:text-sm shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 mt-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Authorize Admin Login</span>
            </button>
          </form>

          <button
            onClick={() => setCurrentView('dashboard')}
            className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 underline cursor-pointer"
          >
            ← Back to Student Dashboard
          </button>
        </div>
      </div>
    );
  }

  // --- PDF Question Paper Upload Handler (Supports PDF file size up to 1 GB) ---
  const handlePdfQuestionFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check 1 GB maximum limit
    if (file.size > MAX_PDF_SIZE_BYTES) {
      alert(`File size (${formatFileSize(file.size)}) exceeds the maximum supported PDF size of 1 GB (${MAX_PDF_SIZE_LABEL}). Please upload a PDF up to 1 GB.`);
      return;
    }

    setIsExtractingPdf(true);
    setPdfUploadSuccessMsg(null);
    setUploadedFileSizeStr(formatFileSize(file.size));
    setPdfExtractProgress({
      percent: 5,
      stage: `Initializing chunked extraction for "${file.name}" (${formatFileSize(file.size)} / up to 1 GB)...`,
      loadedBytes: 0,
      totalBytes: file.size
    });

    try {
      let extractedText = '';
      if (file.name.endsWith('.pdf')) {
        extractedText = await extractTextFromPdf(file, (progress) => {
          setPdfExtractProgress(progress);
        });
      } else {
        extractedText = await file.text();
      }

      setPdfRawText(extractedText);
      const parsed = parseQuestionsFromText(extractedText, importPositiveMarks, importNegativeMarks);
      setParsedQuestions(parsed);
      
      if (parsed.length > 0) {
        setPdfUploadSuccessMsg(`✅ Successfully processed "${file.name}" (${formatFileSize(file.size)}) and extracted ${parsed.length} questions! Ready to publish.`);
      } else {
        setPdfUploadSuccessMsg(`⚠️ File "${file.name}" (${formatFileSize(file.size)}) was scanned. If no standard question stems matched, you can inspect or edit the extracted text in the editor below or click "Load Sample Format".`);
      }
    } catch (err: any) {
      console.error('Error reading question PDF:', err);
      alert(`Error reading PDF: ${err.message || 'Please check file format or paste the text content.'}`);
    } finally {
      setIsExtractingPdf(false);
      setPdfExtractProgress(null);
    }
  };

  // --- Live Test Question Paper PDF Upload Handler (Supports PDF up to 1 GB) ---
  const handleLivePdfQuestionFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_PDF_SIZE_BYTES) {
      alert(`File size (${formatFileSize(file.size)}) exceeds the maximum supported PDF size of 1 GB (${MAX_PDF_SIZE_LABEL}).`);
      return;
    }

    setIsLiveExtractingPdf(true);
    setLivePdfSuccessMsg(null);
    setLivePdfExtractProgress({
      percent: 15,
      stage: `Extracting questions from "${file.name}" (${formatFileSize(file.size)}) for Live Test...`
    });

    try {
      let extractedText = '';
      if (file.name.endsWith('.pdf')) {
        extractedText = await extractTextFromPdf(file, (p) => {
          setLivePdfExtractProgress({ percent: p.percent, stage: p.stage });
        });
      } else {
        extractedText = await file.text();
      }

      const marksPos = Math.max(1, Math.round(liveTotalMarks / 50)) || 2;
      const parsed = parseQuestionsFromText(extractedText, marksPos, 0.5);
      if (parsed.length > 0) {
        setLiveQuestionsList(prev => [...prev, ...parsed]);
        setLivePdfSuccessMsg(`✅ Successfully processed "${file.name}" (${formatFileSize(file.size)}) and extracted ${parsed.length} questions directly into Live Test queue!`);
      } else {
        setLivePdfSuccessMsg(`⚠️ Scanned "${file.name}" (${formatFileSize(file.size)}). If questions weren't detected automatically, you can add questions manually or load sample questions.`);
      }
    } catch (err: any) {
      console.error('Error extracting live test questions from PDF:', err);
      alert(`Could not extract questions: ${err.message || 'Check file format or upload valid PDF'}`);
    } finally {
      setIsLiveExtractingPdf(false);
      setLivePdfExtractProgress(null);
    }
  };

  const handleLoadSampleLiveQuestions = () => {
    const sampleQuestions: Question[] = [
      {
        id: `live-q-${Date.now()}-1`,
        questionNumber: liveQuestionsList.length + 1,
        questionText: 'Under which Article of the Indian Constitution is the Union Public Service Commission established?',
        questionTextHindi: 'भारतीय संविधान के किस अनुच्छेद के तहत संघ लोक सेवा आयोग की स्थापना की गई है?',
        options: ['Article 315', 'Article 324', 'Article 280', 'Article 352'],
        optionsHindi: ['अनुच्छेद 315', 'अनुच्छेद 324', 'अनुच्छेद 280', 'अनुच्छेद 352'],
        correctAnswerIndex: 0,
        explanation: 'Article 315 of the Constitution provides for a Public Service Commission for the Union and for each State.',
        section: 'General Awareness',
        topic: 'Indian Polity & Constitution',
        marksPositive: 2,
        marksNegative: 0.5,
        difficulty: 'Medium',
        idealTimeSeconds: 45
      },
      {
        id: `live-q-${Date.now()}-2`,
        questionNumber: liveQuestionsList.length + 2,
        questionText: 'Find the next term in the series: 4, 9, 25, 49, 121, ?',
        questionTextHindi: 'दी गई श्रृंखला में अगला पद ज्ञात कीजिए: 4, 9, 25, 49, 121, ?',
        options: ['169', '144', '196', '225'],
        optionsHindi: ['169', '144', '196', '225'],
        correctAnswerIndex: 0,
        explanation: 'The series consists of squares of consecutive prime numbers: 2²=4, 3²=9, 5²=25, 7²=49, 11²=121, 13²=169.',
        section: 'Reasoning',
        topic: 'Number Series',
        marksPositive: 2,
        marksNegative: 0.5,
        difficulty: 'Medium',
        idealTimeSeconds: 45
      },
      {
        id: `live-q-${Date.now()}-3`,
        questionNumber: liveQuestionsList.length + 3,
        questionText: 'If 15 men can complete a work in 12 days, in how many days can 18 men complete the same work?',
        questionTextHindi: 'यदि 15 पुरुष किसी कार्य को 12 दिनों में पूरा कर सकते हैं, तो 18 पुरुष उसी कार्य को कितने दिनों में पूरा करेंगे?',
        options: ['10 days', '8 days', '12 days', '14 days'],
        optionsHindi: ['10 दिन', '8 दिन', '12 दिन', '14 दिन'],
        correctAnswerIndex: 0,
        explanation: 'Total work = 15 * 12 = 180 man-days. Days required by 18 men = 180 / 18 = 10 days.',
        section: 'Quantitative Aptitude',
        topic: 'Time and Work',
        marksPositive: 2,
        marksNegative: 0.5,
        difficulty: 'Easy',
        idealTimeSeconds: 50
      },
      {
        id: `live-q-${Date.now()}-4`,
        questionNumber: liveQuestionsList.length + 4,
        questionText: 'Select the most appropriate antonym of the given word: "OBSTINATE"',
        questionTextHindi: 'दिए गए शब्द "OBSTINATE" का सर्वाधिक उपयुक्त विलोम शब्द चुनें:',
        options: ['Flexible', 'Stubborn', 'Rigid', 'Resolute'],
        optionsHindi: ['लचीला / नम्र', 'हठी', 'कठोर', 'दृढ़'],
        correctAnswerIndex: 0,
        explanation: 'Obstinate means stubbornly refusing to change one’s opinion. Its antonym is Flexible.',
        section: 'English Comprehension',
        topic: 'Antonyms',
        marksPositive: 2,
        marksNegative: 0.5,
        difficulty: 'Easy',
        idealTimeSeconds: 30
      },
      {
        id: `live-q-${Date.now()}-5`,
        questionNumber: liveQuestionsList.length + 5,
        questionText: 'What is the full form of UPI in Indian digital banking infrastructure?',
        questionTextHindi: 'भारतीय डिजिटल बैंकिंग में UPI का पूर्ण रूप क्या है?',
        options: ['Unified Payments Interface', 'Universal Payments India', 'United Processing Interface', 'Unified Provider Identification'],
        optionsHindi: ['यूनिफाइड पेमेंट्स इंटरफेस', 'यूनिवर्सल पेमेंट्स इंडिया', 'यूनाइटेड प्रोसेसिंग इंटरफेस', 'यूनिफाइड प्रोवाइडर आइडेंटिफिकेशन'],
        correctAnswerIndex: 0,
        explanation: 'UPI stands for Unified Payments Interface, developed by National Payments Corporation of India (NPCI).',
        section: 'General Awareness',
        topic: 'Banking & Financial Awareness',
        marksPositive: 2,
        marksNegative: 0.5,
        difficulty: 'Easy',
        idealTimeSeconds: 30
      }
    ];

    setLiveQuestionsList(prev => [...prev, ...sampleQuestions]);
    setLivePdfSuccessMsg(`Loaded 5 verified sample questions into Live Test queue!`);
  };

  // --- Attached Lesson PDF File Upload Handler (Supports PDF up to 1 GB) ---
  const handleAttachedPdfFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_PDF_SIZE_BYTES) {
      alert(`File size (${formatFileSize(file.size)}) exceeds 1 GB. Please upload a PDF up to 1 GB.`);
      return;
    }

    try {
      const dataUrl = await fileToDataUrl(file);
      setAttachedPdfDataUrl(dataUrl);
      setAttachedPdfFileName(file.name);
      setPdfTitle(file.name.replace(/\.[^/.]+$/, ''));
      setPdfPages(Math.max(5, Math.round(file.size / (100 * 1024)))); // Estimate pages
      alert(`Lesson PDF "${file.name}" (${formatFileSize(file.size)}) attached successfully! Students can read this in original format before taking the mock.`);
    } catch (err) {
      console.error('Failed to upload lesson PDF:', err);
      alert('Failed to load PDF file.');
    }
  };

  // --- E-Book PDF File Upload Handler (Supports PDF up to 1 GB) ---
  const handleEbookPdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_PDF_SIZE_BYTES) {
      alert(`File size (${formatFileSize(file.size)}) exceeds 1 GB. Please upload an E-Book PDF up to 1 GB.`);
      return;
    }

    try {
      const dataUrl = await fileToDataUrl(file);
      setNewBookPdfDataUrl(dataUrl);
      setNewBookFileName(file.name);
      setNewBookTitle(file.name.replace(/\.[^/.]+$/, ''));
      setNewBookSize(formatFileSize(file.size));
      setNewBookPages(Math.max(10, Math.round(file.size / (80 * 1024))));
      alert(`E-Book PDF "${file.name}" (${formatFileSize(file.size)}) attached successfully!`);
    } catch (err) {
      console.error('Failed to upload E-book PDF:', err);
      alert('Failed to upload E-book PDF.');
    }
  };

  // Quick sample loader
  const handleLoadSamplePdfText = () => {
    const sample = `Q1. Who is known as the Father of the Indian Constitution?
(A) Dr. B.R. Ambedkar
(B) Mahatma Gandhi
(C) Sardar Vallabhbhai Patel
(D) Dr. Rajendra Prasad
Ans: A
Exp: Dr. B.R. Ambedkar was the Chairman of the Drafting Committee of the Constituent Assembly.

Q2. What is the simple interest on Rs 5000 at 10% per annum for 3 years?
(A) Rs 1500
(B) Rs 1200
(C) Rs 1800
(D) Rs 2000
Ans: A
Exp: SI = (P * R * T)/100 = (5000 * 10 * 3)/100 = 1500.

Q3. What is the chemical symbol for Gold?
(A) Au
(B) Ag
(C) Fe
(D) Pb
Ans: A
Exp: Au comes from the Latin word 'Aurum', meaning shining dawn.

Q4. In which year was the Reserve Bank of India (RBI) established?
(A) 1935
(B) 1947
(C) 1950
(D) 1921
Ans: A
Exp: RBI was established on April 1, 1935 under the Reserve Bank of India Act.

Q5. Which atmospheric layer contains the ozone layer that absorbs harmful UV rays?
(A) Stratosphere
(B) Troposphere
(C) Mesosphere
(D) Thermosphere
Ans: A
Exp: The ozone layer is found in the lower portion of the stratosphere from approximately 15 to 35 kilometers above Earth.`;
    setPdfRawText(sample);
    const parsed = parseQuestionsFromText(sample, importPositiveMarks, importNegativeMarks);
    setParsedQuestions(parsed);
    setPdfUploadSuccessMsg(`Loaded sample 5-question exam paper.`);
  };

  // Question editing helpers
  const handleUpdateParsedQuestion = (index: number, field: keyof Question, value: any) => {
    setParsedQuestions(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleUpdateOption = (qIndex: number, optIndex: number, value: string) => {
    setParsedQuestions(prev => {
      const updated = [...prev];
      const opts = [...updated[qIndex].options];
      opts[optIndex] = value;
      updated[qIndex] = { ...updated[qIndex], options: opts };
      return updated;
    });
  };

  const handleDeleteParsedQuestion = (index: number) => {
    setParsedQuestions(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleAddManualQuestion = () => {
    const newIdx = parsedQuestions.length + 1;
    const newQ: Question = {
      id: `gen-manual-${Date.now()}-${newIdx}`,
      questionNumber: newIdx,
      questionText: 'Enter question text here...',
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      correctAnswerIndex: 0,
      explanation: 'Explanation for correct answer.',
      section: 'General Section',
      topic: 'Core Concept',
      marksPositive: importPositiveMarks,
      marksNegative: importNegativeMarks,
      difficulty: 'Medium'
    };
    setParsedQuestions(prev => [...prev, newQ]);
  };

  const handleAutoCleanAndReparse = () => {
    if (!pdfRawText.trim()) {
      alert('Please upload a PDF or enter question text first.');
      return;
    }
    const parsed = parseQuestionsFromText(pdfRawText, importPositiveMarks, importNegativeMarks);
    setParsedQuestions(parsed);
    if (parsed.length > 0) {
      setPdfUploadSuccessMsg(`✨ Cleaned & detected ${parsed.length} questions! Review each question below before publishing.`);
    } else {
      setPdfUploadSuccessMsg('⚠️ No standard questions could be matched. You can inspect the extracted text above, load the sample format, or add questions manually.');
    }
  };

  // Admin Profile Handlers (Change Phone, Email, Password)
  const handleUpdateAdminContact = (e: React.FormEvent) => {
    e.preventDefault();
    const res = updateAdminProfile({ phone: profilePhoneInput, email: profileEmailInput });
    if (res.success) {
      setProfileSuccessMsg(res.message);
      setProfileErrorMsg(null);
    } else {
      setProfileErrorMsg(res.message);
      setProfileSuccessMsg(null);
    }
  };

  const handleChangeAdminPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassInput) {
      setProfileErrorMsg('Please enter your current administrator password.');
      return;
    }
    if (newPassInput !== confirmNewPassInput) {
      setProfileErrorMsg('New password and confirmation password do not match.');
      return;
    }
    if (newPassInput.length < 5) {
      setProfileErrorMsg('New password must be at least 5 characters long.');
      return;
    }

    const res = updateAdminProfile({ currentPassword: currentPassInput, newPassword: newPassInput });
    if (res.success) {
      setProfileSuccessMsg('🎉 Admin password successfully updated! Keep your credentials safe.');
      setProfileErrorMsg(null);
      setCurrentPassInput('');
      setNewPassInput('');
      setConfirmNewPassInput('');
    } else {
      setProfileErrorMsg(res.message);
      setProfileSuccessMsg(null);
    }
  };

  const handleAddQuestionToExamList = () => {
    if (!builderQText.trim()) {
      alert('Please enter question text.');
      return;
    }
    if (!builderQOptA.trim() || !builderQOptB.trim() || !builderQOptC.trim() || !builderQOptD.trim()) {
      alert('Please provide all 4 options (A, B, C, and D).');
      return;
    }

    const newQuestion: Question = {
      id: `q-exam-${Date.now()}-${examQuestionsList.length + 1}`,
      questionNumber: examQuestionsList.length + 1,
      questionText: builderQText.trim(),
      questionTextHindi: builderQTextHindi.trim() || undefined,
      options: [builderQOptA.trim(), builderQOptB.trim(), builderQOptC.trim(), builderQOptD.trim()],
      correctAnswerIndex: builderQCorrectIdx,
      explanation: builderQExplanation.trim() || 'Official solution verified by exam administration.',
      section: examQuestionStructureMode === 'section_wise' ? examActiveSection : examActiveSection || 'General Awareness',
      topic: examQuestionStructureMode === 'topic_wise' ? examActiveTopic : 'Core Concepts',
      marksPositive: Number(builderQMarksPos) || 2,
      marksNegative: Number(builderQMarksNeg) || 0.5,
      difficulty: builderQDifficulty
    };

    setExamQuestionsList(prev => [...prev, newQuestion]);
    setBuilderQText('');
    setBuilderQTextHindi('');
    setBuilderQOptA('');
    setBuilderQOptB('');
    setBuilderQOptC('');
    setBuilderQOptD('');
    setBuilderQExplanation('');
  };

  const handleAutoGenerateExamQuestions = () => {
    const examTitle = examNameInput.trim() || 'Official Exam';
    const sampleQuestions: Question[] = [
      {
        id: `q-auto-${Date.now()}-1`,
        questionNumber: examQuestionsList.length + 1,
        questionText: `Under which Constitutional Article is the Election Commission of India established?`,
        questionTextHindi: `भारत के चुनाव आयोग की स्थापना किस संवैधानिक अनुच्छेद के तहत की गई है?`,
        options: ['Article 324', 'Article 280', 'Article 352', 'Article 370'],
        optionsHindi: ['अनुच्छेद 324', 'अनुच्छेद 280', 'अनुच्छेद 352', 'अनुच्छेद 370'],
        correctAnswerIndex: 0,
        explanation: 'Article 324 of the Constitution provides for the superintendence, direction, and control of elections to be vested in an Election Commission.',
        section: examQuestionStructureMode === 'section_wise' ? examActiveSection : 'General Awareness',
        topic: examQuestionStructureMode === 'topic_wise' ? examActiveTopic : 'Indian Constitution & Polity',
        marksPositive: 2,
        marksNegative: 0.5,
        difficulty: 'Easy'
      },
      {
        id: `q-auto-${Date.now()}-2`,
        questionNumber: examQuestionsList.length + 2,
        questionText: 'A train 180 meters long is travelling at 54 km/hr. In how many seconds will it cross a platform of length 120 meters?',
        questionTextHindi: '180 मीटर लंबी एक ट्रेन 54 किमी/घंटा की गति से चल रही है। 120 मीटर लंबे प्लेटफॉर्म को पार करने में इसे कितने सेकंड लगेंगे?',
        options: ['15 seconds', '20 seconds', '25 seconds', '18 seconds'],
        optionsHindi: ['15 सेकंड', '20 सेकंड', '25 सेकंड', '18 सेकंड'],
        correctAnswerIndex: 1,
        explanation: 'Speed = 54 * (5/18) = 15 m/s. Total distance = 180 + 120 = 300 m. Time = Distance / Speed = 300 / 15 = 20 seconds.',
        section: examQuestionStructureMode === 'section_wise' ? examActiveSection : 'Quantitative Aptitude',
        topic: examQuestionStructureMode === 'topic_wise' ? examActiveTopic : 'Time, Speed and Distance',
        marksPositive: 2,
        marksNegative: 0.5,
        difficulty: 'Medium'
      },
      {
        id: `q-auto-${Date.now()}-3`,
        questionNumber: examQuestionsList.length + 3,
        questionText: 'Find the missing number in the series: 3, 7, 15, 31, 63, ?',
        questionTextHindi: 'दी गई श्रृंखला में लुप्त संख्या ज्ञात कीजिए: 3, 7, 15, 31, 63, ?',
        options: ['127', '125', '120', '131'],
        optionsHindi: ['127', '125', '120', '131'],
        correctAnswerIndex: 0,
        explanation: 'Pattern: (3*2)+1 = 7; (7*2)+1 = 15; (15*2)+1 = 31; (31*2)+1 = 63; (63*2)+1 = 127.',
        section: examQuestionStructureMode === 'section_wise' ? examActiveSection : 'General Intelligence & Reasoning',
        topic: examQuestionStructureMode === 'topic_wise' ? examActiveTopic : 'Number Series',
        marksPositive: 2,
        marksNegative: 0.5,
        difficulty: 'Easy'
      },
      {
        id: `q-auto-${Date.now()}-4`,
        questionNumber: examQuestionsList.length + 4,
        questionText: 'Choose the word which is closest in meaning to "CANDID":',
        questionTextHindi: '"CANDID" के अर्थ के सबसे निकट का शब्द चुनिए:',
        options: ['Secretive', 'Frank and Outspoken', 'Greedy', 'Cruel'],
        optionsHindi: ['गुप्त', 'स्पष्टवादी और सच्चा', 'लालची', 'क्रूर'],
        correctAnswerIndex: 1,
        explanation: 'Candid means truthful, straightforward, and frank.',
        section: examQuestionStructureMode === 'section_wise' ? examActiveSection : 'English Comprehension',
        topic: examQuestionStructureMode === 'topic_wise' ? examActiveTopic : 'Synonyms & Antonyms',
        marksPositive: 2,
        marksNegative: 0.5,
        difficulty: 'Easy'
      }
    ];

    setExamQuestionsList(prev => [...prev, ...sampleQuestions]);
  };

  const handleCreateExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!examNameInput.trim()) return;

    const newEx: AdminExam = {
      id: 'exam-' + Date.now(),
      name: examNameInput.trim(),
      category: examCatInput.trim(),
      scope: examScopeInput, // 'Central' | 'State' | 'None'
      stateName: examScopeInput === 'State' ? examStateInput.trim() : undefined,
      description: examDescInput || `Official preparation for ${examNameInput}`,
      freeLimits: {
        chapterWiseFree: freeChapterLimit,
        fullMockFree: freeFullMockLimit,
        sectionWiseFree: freeSectionalLimit
      },
      cutoffMarks: {
        general: Number(cutoffGeneralInput) || 135,
        obc: Number(cutoffObcInput) || 128,
        sc_st: Number(cutoffScStInput) || 115,
        ews: Number(cutoffEwsInput) || 124
      }
    };

    addAdminExam(newEx);

    // If admin added questions by Section-wise, Topic-wise, or Full Exam
    if (examQuestionsList.length > 0) {
      const mockType: MockTestType = 
        examQuestionStructureMode === 'full_exam' ? 'full_mock'
        : examQuestionStructureMode === 'section_wise' ? 'section_wise'
        : 'chapter_wise';

      const mockTitle = 
        examQuestionStructureMode === 'full_exam' ? `${newEx.name} Full Official Mock Test`
        : examQuestionStructureMode === 'section_wise' ? `${newEx.name} - ${examActiveSection} Sectional Mock`
        : `${newEx.name} - ${examActiveTopic} Topic Master Test`;

      const newTest: MockTest = {
        id: `mock-admin-${Date.now()}`,
        category: newEx.category,
        examName: newEx.name,
        title: mockTitle,
        description: `Official ${examQuestionStructureMode.replace('_', ' ')} exam test prepared by Admin with ${examQuestionsList.length} verified questions.`,
        type: mockType,
        chapterOrSectionName: examQuestionStructureMode === 'section_wise' ? examActiveSection : examQuestionStructureMode === 'topic_wise' ? examActiveTopic : undefined,
        durationMinutes: examQuestionStructureMode === 'full_exam' ? 60 : 30,
        totalQuestions: examQuestionsList.length,
        totalMarks: examQuestionsList.reduce((sum, q) => sum + (q.marksPositive || 2), 0),
        sections: Array.from(new Set(examQuestionsList.map(q => q.section || examActiveSection || 'General'))),
        attachedPdf: {
          title: `${newEx.name} Study Lesson & Question Guide`,
          pagesCount: 8,
          readTimeMinutes: 10,
          summary: `Comprehensive study guide and syllabus questions for ${newEx.name}.`,
          contentMarkdown: `# ${newEx.name}\n\nOfficial syllabus notes and mock test solutions provided by platform administration.`
        },
        questions: examQuestionsList,
        cutoffMarks: newEx.cutoffMarks || {
          general: Number(cutoffGeneralInput) || 135,
          obc: Number(cutoffObcInput) || 128,
          sc_st: Number(cutoffScStInput) || 115,
          ews: Number(cutoffEwsInput) || 124
        },
        attemptsCount: 0,
        avgScore: 0,
        isFree: true
      };

      addMockTest(newTest);
    }

    const questionCount = examQuestionsList.length;
    setExamQuestionsList([]);
    setExamNameInput('');
    setExamDescInput('');
    alert(`Success! Exam "${newEx.name}" added to platform! ${questionCount > 0 ? `Created test with ${questionCount} questions organized ${examQuestionStructureMode.replace('_', ' ')}.` : ''}`);
  };

  const handleSaveImportedMockTest = () => {
    if (parsedQuestions.length === 0) {
      alert('Please upload a PDF or parse at least one question.');
      return;
    }

    const matchingAdminExam = adminExams.find(e => e.name === importSelectedExamName);

    const newTest: MockTest = {
      id: `mock-admin-${Date.now()}`,
      category: importCustomCategory,
      examName: importSelectedExamName,
      title: importTestTitle,
      description: `Mock Test for ${importSelectedExamName} containing ${parsedQuestions.length} verified questions. Read attached PDF lesson first.`,
      type: importTestType,
      durationMinutes: importDurationMins,
      totalMarks: parsedQuestions.length * importPositiveMarks,
      totalQuestions: parsedQuestions.length,
      sections: Array.from(new Set(parsedQuestions.map(q => q.section))),
      attachedPdf: {
        title: pdfTitle,
        pagesCount: pdfPages,
        readTimeMinutes: Math.max(5, Math.round(pdfPages * 1.2)),
        summary: pdfSummary,
        contentMarkdown: pdfMarkdown,
        pdfDataUrl: attachedPdfDataUrl,
        fileName: attachedPdfFileName
      },
      questions: parsedQuestions,
      cutoffMarks: {
        general: matchingAdminExam?.cutoffMarks?.general || Math.round(parsedQuestions.length * importPositiveMarks * 0.7),
        obc: matchingAdminExam?.cutoffMarks?.obc || Math.round(parsedQuestions.length * importPositiveMarks * 0.65),
        sc_st: matchingAdminExam?.cutoffMarks?.sc_st || Math.round(parsedQuestions.length * importPositiveMarks * 0.55),
        ews: matchingAdminExam?.cutoffMarks?.ews || Math.round(parsedQuestions.length * importPositiveMarks * 0.63)
      },
      attemptsCount: 0,
      avgScore: 0,
      isFree: true
    };

    addMockTest(newTest);
    alert(`Success! Mock Test "${importTestTitle}" with ${parsedQuestions.length} questions & attached study PDF has been added!`);
    setActiveTab('tests');
  };

  const handleAddTimeline = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tlExamName.trim()) return;

    const newTl: ExamNotificationTimeline = {
      id: 'tl-' + Date.now(),
      examName: tlExamName.trim(),
      department: tlDept.trim() || 'Exam Board',
      category: tlCategory,
      scope: tlScope,
      stateName: tlScope === 'State' ? tlStateName.trim() : undefined,
      notificationOutDate: tlNotifDate,
      examDate: tlExamDate,
      resultDate: tlResultDate,
      postsCount: tlPosts,
      eligibility: tlEligibility,
      status: tlStatus,
      applyLink: tlApplyLink.trim() || 'https://ssc.gov.in',
      officialNotificationText: 'Official exam schedule announced by the examination board.'
    };

    addNotificationTimeline(newTl);
    setTlExamName('');
    alert('Timeline event added successfully with official Apply Online link!');
  };

  const handleAddEbook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBookTitle.trim()) return;

    const newBook: EBook = {
      id: 'eb-' + Date.now(),
      title: newBookTitle.trim(),
      category: newBookCat,
      subject: newBookSub,
      pages: newBookPages,
      fileSize: newBookSize,
      downloadsCount: 0,
      description: newBookDesc,
      chapters: ['1. Fundamental Overview', '2. Solved Question Sets', '3. Formula Summary'],
      contentSummary: newBookDesc,
      pdfDataUrl: newBookPdfDataUrl,
      fileName: newBookFileName
    };

    addEBook(newBook);
    setNewBookTitle('');
    setNewBookPdfDataUrl(undefined);
    setNewBookFileName(undefined);
    alert(`E-Book "${newBook.title}" added to free library with original PDF!`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      
      {/* Top Banner with Admin Auth Status */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-slate-800 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-bold text-xs uppercase tracking-wider border border-blue-500/30 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" /> Admin Secured Session
            </span>
            <span className="text-xs text-slate-400">Owner: {adminGmail}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Master Administration Console
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Complete management of exams, mock tests, PDF parser up to 1000 Qs, free limits, timelines & payments.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentView('dashboard')}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 cursor-pointer"
          >
            Student Dashboard
          </button>
          <button
            onClick={logoutAdmin}
            className="px-4 py-2 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Lock Admin</span>
          </button>
        </div>
      </div>

      {/* Website Visitor & Live Activity Stats */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500 animate-ping" />
            <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-600" />
              <span>Real-Time Website Activity & Visitor Traffic</span>
            </h3>
          </div>
          <span className="text-xs text-slate-500 flex items-center gap-1">
            <Radio className="w-3.5 h-3.5 text-emerald-500 animate-pulse" /> Live Metrics Ticker
          </span>
        </div>

        {/* 4 Counter Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <span className="text-[11px] font-bold text-slate-400 block uppercase">Total Website Visitors</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl sm:text-2xl font-black text-blue-600 dark:text-blue-400 font-mono">
                {websiteVisitorActivity.totalVisitors.toLocaleString()}
              </span>
              <span className="text-[10px] text-emerald-600 font-bold">+12%</span>
            </div>
            <span className="text-[10px] text-slate-500 block mt-0.5">Across India</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <span className="text-[11px] font-bold text-slate-400 block uppercase">Live Active Right Now</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                {websiteVisitorActivity.liveVisitorsNow.toLocaleString()}
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse ml-1" />
            </div>
            <span className="text-[10px] text-slate-500 block mt-0.5">Students studying now</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <span className="text-[11px] font-bold text-slate-400 block uppercase">CBT Tests Running</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl sm:text-2xl font-black text-purple-600 dark:text-purple-400 font-mono">
                {websiteVisitorActivity.testsRunningNow}
              </span>
              <span className="text-[10px] text-purple-500 font-semibold">Active CBTs</span>
            </div>
            <span className="text-[10px] text-slate-500 block mt-0.5">Live timer sessions</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <span className="text-[11px] font-bold text-slate-400 block uppercase">Today's New Signups</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl sm:text-2xl font-black text-amber-500 font-mono">
                {websiteVisitorActivity.todaySignups}
              </span>
              <span className="text-[10px] text-amber-500 font-bold">New</span>
            </div>
            <span className="text-[10px] text-slate-500 block mt-0.5">Daily registered aspirants</span>
          </div>
        </div>

        {/* Live Activity Stream Ticker */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1.5">
            Live Platform Activity Feed:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {websiteVisitorActivity.recentActivities.slice(0, 6).map(act => (
              <div key={act.id} className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-[11px]">
                <span className="truncate text-slate-700 dark:text-slate-300 font-medium">{act.text}</span>
                <span className="text-[10px] text-slate-400 shrink-0 ml-2">{act.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800">
        {[
          { id: 'exams', label: '1. Exams & Scope', icon: Layers },
          { id: 'tests', label: '2. All Mock Tests', icon: FileText },
          { id: 'live_tests', label: '3. Live Tests with Time & Qs', icon: Radio },
          { id: 'pdf_importer', label: '4. PDF to Mock Test (Up to 1 GB)', icon: Upload },
          { id: 'timelines', label: '5. Exam Dates Tracker', icon: Calendar },
          { id: 'send_notifications', label: '6. Send Notifications', icon: Bell },
          { id: 'ebooks', label: '7. E-Books Management', icon: BookOpen },
          { id: 'teach_apps', label: '8. Teach With Us (15 Active)', icon: Phone },
          { id: 'students', label: '9. Student Management', icon: Users },
          { id: 'payments', label: '10. Payment & Coupons', icon: CreditCard },
          { id: 'admin_security', label: '11. Admin Credentials & Settings', icon: Key }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
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

      {/* Tab 1: Exam Management (Add/Delete/Scope: Central, State, None) */}
      {activeTab === 'exams' && (
        <div className="space-y-6">
          <form onSubmit={handleCreateExam} className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Exam Manager</span>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white mt-0.5">
                Add New Exam to Platform (With None / General Scope Option)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                All exams appearing across the website are controlled here. Choose Central, State, or None / General.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1">Exam Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. SSC CGL 2026 Tier-1 or CUET UG 2026"
                  value={examNameInput}
                  onChange={(e) => setExamNameInput(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-400">
                    Category (Type custom or select)
                  </label>
                  <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold">Admin Writable</span>
                </div>
                <input
                  type="text"
                  placeholder="e.g. SSC, Railways, State PSC, Police, Civil Services, Entrance..."
                  value={examCatInput}
                  onChange={(e) => setExamCatInput(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                  required
                />
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {['SSC', 'Railways', 'Banking', 'State PSC', 'Defence', 'Police', 'Teaching', 'Civil Services', 'Technical', 'General Entrance'].map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setExamCatInput(cat)}
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold border transition-colors cursor-pointer ${
                        examCatInput.toLowerCase() === cat.toLowerCase()
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1">
                  Scope (Central / State / None)
                </label>
                <select
                  value={examScopeInput}
                  onChange={(e) => setExamScopeInput(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                >
                  <option value="Central">Central Govt Exam</option>
                  <option value="State">State Govt Exam</option>
                  <option value="None">None (General / All India Entrance)</option>
                </select>
              </div>

              {examScopeInput === 'State' && (
                <div className="sm:col-span-3">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1">State Name</label>
                  <input
                    type="text"
                    placeholder="e.g. West Bengal, Bihar, UP, Rajasthan"
                    value={examStateInput}
                    onChange={(e) => setExamStateInput(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white"
                  />
                </div>
              )}
            </div>

            {/* Free Limits for this Exam */}
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
              <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 block uppercase tracking-wider">
                Configurable Free Test Limit for this Exam:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">Free Chapterwise Tests</label>
                  <input
                    type="number"
                    min={0}
                    value={freeChapterLimit}
                    onChange={(e) => setFreeChapterLimit(parseInt(e.target.value, 10) || 0)}
                    className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">Free Full Mock Tests</label>
                  <input
                    type="number"
                    min={0}
                    value={freeFullMockLimit}
                    onChange={(e) => setFreeFullMockLimit(parseInt(e.target.value, 10) || 0)}
                    className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">Free Section-wise Tests</label>
                  <input
                    type="number"
                    min={0}
                    value={freeSectionalLimit}
                    onChange={(e) => setFreeSectionalLimit(parseInt(e.target.value, 10) || 0)}
                    className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Category Cutoff Marks (Written by Admin for All Categories) */}
            <div className="p-3.5 bg-blue-50/60 dark:bg-blue-950/40 rounded-2xl border border-blue-200 dark:border-blue-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold text-blue-900 dark:text-blue-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  Qualifying Cutoff Marks (Written by Admin for All Categories):
                </span>
                <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold bg-white dark:bg-slate-800 px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-700">
                  Mandatory for All 4 Categories
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    General / UR Cutoff
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={cutoffGeneralInput}
                    onChange={(e) => setCutoffGeneralInput(parseFloat(e.target.value) || 0)}
                    placeholder="e.g. 135"
                    className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-blue-300 dark:border-blue-700 rounded-xl text-xs font-black text-slate-900 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    OBC Cutoff
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={cutoffObcInput}
                    onChange={(e) => setCutoffObcInput(parseFloat(e.target.value) || 0)}
                    placeholder="e.g. 128"
                    className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-blue-300 dark:border-blue-700 rounded-xl text-xs font-black text-slate-900 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    SC / ST Cutoff
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={cutoffScStInput}
                    onChange={(e) => setCutoffScStInput(parseFloat(e.target.value) || 0)}
                    placeholder="e.g. 115"
                    className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-blue-300 dark:border-blue-700 rounded-xl text-xs font-black text-slate-900 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    EWS Cutoff
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={cutoffEwsInput}
                    onChange={(e) => setCutoffEwsInput(parseFloat(e.target.value) || 0)}
                    placeholder="e.g. 124"
                    className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-blue-300 dark:border-blue-700 rounded-xl text-xs font-black text-slate-900 dark:text-white"
                    required
                  />
                </div>
              </div>
            </div>

            {/* ============================================================ */}
            {/* ADD EXAM QUESTIONS FACILITY (SECTION-WISE, TOPIC-WISE, FULL EXAM) */}
            {/* ============================================================ */}
            <div className="p-4 sm:p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border-2 border-blue-500/30 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-700 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/30 shrink-0">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-black text-sm sm:text-base text-slate-900 dark:text-white">
                        Add Exam Questions Facility
                      </h4>
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                        {examQuestionsList.length} {examQuestionsList.length === 1 ? 'Question' : 'Questions'} Added
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Admin can add questions Section-Wise, Topic-Wise, or for a Full Exam to publish with this exam.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleAutoGenerateExamQuestions}
                    className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-xs shadow-md shadow-orange-500/20 flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
                    title="Auto generate 4 realistic exam questions"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>⚡ Auto-Generate Sample Qs</span>
                  </button>

                  {examQuestionsList.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setExamQuestionsList([])}
                      className="px-2.5 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-rose-100 dark:hover:bg-rose-950 hover:text-rose-600 text-slate-600 dark:text-slate-300 text-xs font-bold transition-colors cursor-pointer"
                    >
                      Clear ({examQuestionsList.length})
                    </button>
                  )}
                </div>
              </div>

              {/* Mode Selector Tabs: Section-wise vs Topic-wise vs Full Exam */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                  Select Question Addition Mode:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setExamQuestionStructureMode('full_exam')}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      examQuestionStructureMode === 'full_exam'
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/60 ring-2 ring-blue-500/20 shadow-sm'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-extrabold text-xs text-blue-700 dark:text-blue-300">🎯 Full Exam Mode</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-bold">Mock</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      All sections combined into one full-length exam mock test.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setExamQuestionStructureMode('section_wise')}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      examQuestionStructureMode === 'section_wise'
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/60 ring-2 ring-blue-500/20 shadow-sm'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-extrabold text-xs text-blue-700 dark:text-blue-300">📑 Section-Wise Mode</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 font-bold">Sectional</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Categorized by specific sections (Quant, Reasoning, English, GA).
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setExamQuestionStructureMode('topic_wise')}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      examQuestionStructureMode === 'topic_wise'
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/60 ring-2 ring-blue-500/20 shadow-sm'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-extrabold text-xs text-blue-700 dark:text-blue-300">🏷️ Topic-Wise Mode</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 font-bold">Chapter</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Categorized by syllabus chapters (Percentage, Syllogism, History).
                    </p>
                  </button>
                </div>
              </div>

              {/* Section & Topic Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Target Section:
                  </label>
                  <select
                    value={examActiveSection}
                    onChange={(e) => setExamActiveSection(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white cursor-pointer"
                  >
                    {customSectionsList.map(sec => (
                      <option key={sec} value={sec}>{sec}</option>
                    ))}
                  </select>
                </div>

                {examQuestionStructureMode === 'topic_wise' ? (
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Chapter / Topic Name:
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Percentage & Ratio, Syllogism, Modern History..."
                      value={examActiveTopic}
                      onChange={(e) => setExamActiveTopic(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Add Custom Section Name:
                    </label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        placeholder="e.g. Computer Aptitude, Data Interpretation"
                        value={newSectionInput}
                        onChange={(e) => setNewSectionInput(e.target.value)}
                        className="flex-1 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (newSectionInput.trim()) {
                            setCustomSectionsList(prev => [...prev, newSectionInput.trim()]);
                            setExamActiveSection(newSectionInput.trim());
                            setNewSectionInput('');
                          }
                        }}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold cursor-pointer"
                      >
                        + Add
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Interactive Question Builder Box */}
              <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-blue-600" />
                    Enter Question #{examQuestionsList.length + 1}:
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400 font-bold">Difficulty:</span>
                    <select
                      value={builderQDifficulty}
                      onChange={(e) => setBuilderQDifficulty(e.target.value as any)}
                      className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-[11px] font-bold text-slate-800 dark:text-slate-200 cursor-pointer"
                    >
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>
                </div>

                {/* Question Text (English) */}
                <div>
                  <textarea
                    rows={2}
                    placeholder="Enter question text in English (e.g. Which river is known as Sorrow of Bihar?)..."
                    value={builderQText}
                    onChange={(e) => setBuilderQText(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                {/* Question Text (Hindi - Optional) */}
                <div>
                  <input
                    type="text"
                    placeholder="वैकल्पिक: प्रश्न हिंदी में लिखें (Optional Hindi translation)..."
                    value={builderQTextHindi}
                    onChange={(e) => setBuilderQTextHindi(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                </div>

                {/* 4 Options Grid */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block">
                    Options & Select Correct Answer:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      { label: 'Option A', val: builderQOptA, setVal: setBuilderQOptA, idx: 0 },
                      { label: 'Option B', val: builderQOptB, setVal: setBuilderQOptB, idx: 1 },
                      { label: 'Option C', val: builderQOptC, setVal: setBuilderQOptC, idx: 2 },
                      { label: 'Option D', val: builderQOptD, setVal: setBuilderQOptD, idx: 3 }
                    ].map(opt => (
                      <div 
                        key={opt.idx}
                        className={`flex items-center gap-2 p-2 rounded-xl border transition-all ${
                          builderQCorrectIdx === opt.idx 
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 ring-1 ring-emerald-500/30' 
                            : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        <input
                          type="radio"
                          name="builderCorrectAnswer"
                          checked={builderQCorrectIdx === opt.idx}
                          onChange={() => setBuilderQCorrectIdx(opt.idx)}
                          className="accent-emerald-600 cursor-pointer"
                          title="Click to mark as Correct Answer"
                        />
                        <span className="text-xs font-black text-slate-700 dark:text-slate-300 w-4">
                          {String.fromCharCode(65 + opt.idx)}.
                        </span>
                        <input
                          type="text"
                          placeholder={`${opt.label} text...`}
                          value={opt.val}
                          onChange={(e) => opt.setVal(e.target.value)}
                          className="flex-1 bg-transparent text-xs font-medium text-slate-900 dark:text-white focus:outline-none"
                        />
                        {builderQCorrectIdx === opt.idx && (
                          <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/60 shrink-0">
                            Correct ✓
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Marks & Explanation */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-1">Marks (+)</label>
                    <input
                      type="number"
                      step={0.5}
                      min={0.5}
                      value={builderQMarksPos}
                      onChange={(e) => setBuilderQMarksPos(parseFloat(e.target.value) || 2)}
                      className="w-full px-2.5 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-black text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-1">Negative Marks (-)</label>
                    <input
                      type="number"
                      step={0.25}
                      min={0}
                      value={builderQMarksNeg}
                      onChange={(e) => setBuilderQMarksNeg(parseFloat(e.target.value) || 0.5)}
                      className="w-full px-2.5 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-black text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-1">Explanation / Solution</label>
                    <input
                      type="text"
                      placeholder="Why this answer is correct..."
                      value={builderQExplanation}
                      onChange={(e) => setBuilderQExplanation(e.target.value)}
                      className="w-full px-2.5 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end">
                  <button
                    type="button"
                    onClick={handleAddQuestionToExamList}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md shadow-emerald-600/20 flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Save Question to List</span>
                  </button>
                </div>
              </div>

              {/* List of Added Questions */}
              {examQuestionsList.length > 0 && (
                <div className="space-y-2 pt-1">
                  <span className="text-[11px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                    Questions Ready for Publish ({examQuestionsList.length}):
                  </span>
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                    {examQuestionsList.map((q, idx) => (
                      <div
                        key={q.id}
                        className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 flex items-start justify-between gap-3 text-xs"
                      >
                        <div className="flex-1 space-y-1">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="font-black text-blue-600 dark:text-blue-400">
                              Q{idx + 1}.
                            </span>
                            <span className="font-semibold text-slate-800 dark:text-slate-200">
                              {q.questionText}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-2 text-[10px]">
                            <span className="px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold">
                              {q.section}
                            </span>
                            {q.topic && (
                              <span className="px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold">
                                {q.topic}
                              </span>
                            )}
                            <span className="text-emerald-600 font-bold">
                              Correct: {String.fromCharCode(65 + q.correctAnswerIndex)} ({q.options[q.correctAnswerIndex]})
                            </span>
                            <span className="text-slate-400">
                              (+{q.marksPositive}, -{q.marksNegative})
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => setExamQuestionsList(prev => prev.filter((_, i) => i !== idx))}
                          className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer shrink-0"
                          title="Remove Question"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-extrabold text-sm cursor-pointer shadow-lg shadow-blue-600/25 active:scale-95 transition-all flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>
                Add Exam & Publish {examQuestionsList.length > 0 ? `with ${examQuestionsList.length} Questions` : ''} to Platform
              </span>
            </button>
          </form>

          {/* Existing Exams List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {adminExams.map(ex => (
              <div
                key={ex.id}
                className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                      {ex.scope === 'State' ? ex.stateName || 'State' : ex.scope === 'None' ? 'None (General)' : 'Central'} • {ex.category}
                    </span>
                    <button
                      onClick={() => setExamToDelete(ex)}
                      className="text-rose-500 hover:text-rose-700 p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer flex items-center gap-1 text-[11px] font-bold"
                      title="Admin-only delete examination"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                  <h4 className="font-bold text-sm text-slate-800 dark:text-white">{ex.name}</h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{ex.description}</p>
                </div>

                <div className="p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-[11px] text-slate-600 dark:text-slate-300 space-y-1.5">
                  <div className="flex justify-between">
                    <span>Free Chapterwise:</span>
                    <strong>{ex.freeLimits?.chapterWiseFree ?? 1} Free</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Free Full Mock:</span>
                    <strong>{ex.freeLimits?.fullMockFree ?? 1} Free</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Free Section-wise:</span>
                    <strong>{ex.freeLimits?.sectionWiseFree ?? 1} Free</strong>
                  </div>
                  
                  {/* Category Cutoffs written by Admin */}
                  <div className="pt-1.5 border-t border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400 block mb-0.5">
                      Category Cutoff Marks (By Admin):
                    </span>
                    <div className="grid grid-cols-2 gap-1 text-[10px] font-mono">
                      <span className="text-slate-500">UR: <strong className="text-slate-900 dark:text-white">{ex.cutoffMarks?.general || 135}</strong></span>
                      <span className="text-slate-500">OBC: <strong className="text-slate-900 dark:text-white">{ex.cutoffMarks?.obc || 128}</strong></span>
                      <span className="text-slate-500">SC/ST: <strong className="text-slate-900 dark:text-white">{ex.cutoffMarks?.sc_st || 115}</strong></span>
                      <span className="text-slate-500">EWS: <strong className="text-slate-900 dark:text-white">{ex.cutoffMarks?.ews || 124}</strong></span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Admin Protected Deletion Confirmation Modal */}
          {examToDelete && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-rose-500/30 space-y-4 animate-in zoom-in-95 duration-150">
                <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-500 flex items-center justify-center mx-auto">
                  <Trash2 className="w-6 h-6" />
                </div>
                <div className="text-center space-y-1.5">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-rose-600 bg-rose-100 dark:bg-rose-950 px-2 py-0.5 rounded">
                    Admin Authorization Required
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white pt-1">
                    Delete Examination?
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Are you sure you want to permanently delete <strong>&ldquo;{examToDelete.name}&rdquo;</strong>?
                  </p>
                  <p className="text-[11px] text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 p-2.5 rounded-xl border border-amber-500/20 text-left mt-2">
                    🛡️ Security Rule: All exams can&apos;t be deleted freely by students. They can only be deleted by an authorized administrator inside the Admin Panel.
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setExamToDelete(null)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      deleteAdminExam(examToDelete.id);
                      setExamToDelete(null);
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow-md shadow-rose-600/30 cursor-pointer"
                  >
                    Yes, Delete Exam
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Existing Mock Tests */}
      {activeTab === 'tests' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              All Platform Mock Tests ({mockTests.length})
            </h3>
            <button
              onClick={() => setActiveTab('pdf_importer')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md shadow-blue-600/20"
            >
              <Upload className="w-4 h-4" />
              <span>Import Questions from PDF (Up to 1 GB)</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockTests.map(test => (
              <div
                key={test.id}
                className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                      {test.examName} • {test.type.replace('_', ' ')}
                    </span>
                    <button
                      onClick={() => {
                        if (confirm(`Delete mock test "${test.title}"?`)) {
                          deleteMockTest(test.id);
                        }
                      }}
                      className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <h4 className="font-bold text-sm text-slate-800 dark:text-white">{test.title}</h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{test.description}</p>
                  
                  <div className="mt-3 p-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs flex items-center justify-between text-slate-600 dark:text-slate-300">
                    <span className="truncate">{test.attachedPdf.title}</span>
                    <span className="text-[10px] font-bold text-blue-600 shrink-0 ml-1">{test.questions.length} Qs</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Live Tests with Scheduled Time & Live Question Add */}
      {activeTab === 'live_tests' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">Live CBT Arena</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-300 dark:border-rose-700 flex items-center gap-1">
                  <Radio className="w-3 h-3 text-rose-600 animate-pulse" /> Scheduled Start Time
                </span>
              </div>
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white mt-0.5">
                Add Live Test & Questions with Scheduled Time
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Configure All-India Mega Live Mock Tests with scheduled date & time, duration, and add exam questions with options, answer keys, and timer.
              </p>
            </div>

            {liveSuccessMsg && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-500/30 rounded-2xl text-xs text-emerald-800 dark:text-emerald-300 font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{liveSuccessMsg}</span>
              </div>
            )}

            {/* Live Test Metadata Form */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1">
                    Target Exam
                  </label>
                  <select
                    value={liveExamName}
                    onChange={(e) => setLiveExamName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                  >
                    {adminExams.map(ex => (
                      <option key={ex.id} value={ex.name}>{ex.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1">
                    Category (Admin Writable)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. SSC, Railways, State PSC"
                    value={liveTestCat}
                    onChange={(e) => setLiveTestCat(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                    required
                  />
                </div>

                {/* Test Classification (Admin Writable) */}
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1">
                    Test Classification (Admin Writable)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. All-India National Championship, Weekend Grand Mock..."
                    value={liveTestClassification}
                    onChange={(e) => setLiveTestClassification(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                  />
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {['All-India Championship', 'Mega Scholarship CBT', 'Weekend Grand Mock', 'Previous Year Simulator'].map(preset => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setLiveTestClassification(preset)}
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-md border cursor-pointer transition-colors ${
                          liveTestClassification === preset
                            ? 'bg-rose-600 text-white border-rose-600'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1">
                    Test Format
                  </label>
                  <select
                    value={liveTestType}
                    onChange={(e) => setLiveTestType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                  >
                    <option value="full_mock">Full Length Mock Test</option>
                    <option value="section_wise">Section-wise Test</option>
                    <option value="chapter_wise">Chapterwise Test</option>
                  </select>
                </div>

                {liveTestType !== 'full_mock' && (
                  <div>
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1">
                      {liveTestType === 'chapter_wise' ? 'Chapter Name' : 'Section Name'}
                    </label>
                    <input
                      type="text"
                      placeholder={liveTestType === 'chapter_wise' ? 'e.g. Percentage & Profit' : 'e.g. General Awareness'}
                      value={liveTestChapterOrSec}
                      onChange={(e) => setLiveTestChapterOrSec(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1">
                    Live Test Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. All-India Mega Live Mock Test #1 (With Live Ranking)"
                    value={liveTestTitle}
                    onChange={(e) => setLiveTestTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-rose-600 dark:text-rose-400 block mb-1">
                    Scheduled Start Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={liveStartTime}
                    onChange={(e) => setLiveStartTime(e.target.value)}
                    className="w-full px-3 py-2 bg-rose-50/50 dark:bg-rose-950/30 border border-rose-300 dark:border-rose-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Duration (Admin Writable) */}
                <div>
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1">
                    Duration (Minutes - Admin Writable)
                  </label>
                  <input
                    type="number"
                    min={5}
                    value={liveDurationMins}
                    onChange={(e) => setLiveDurationMins(parseInt(e.target.value, 10) || 60)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                  />
                  <div className="flex flex-wrap gap-1 mt-1">
                    {[30, 45, 60, 90, 120, 180].map(m => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setLiveDurationMins(m)}
                        className={`text-[9px] font-mono px-1.5 py-0.5 rounded border cursor-pointer ${
                          liveDurationMins === m
                            ? 'bg-rose-600 text-white border-rose-600'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {m}m
                      </button>
                    ))}
                  </div>
                </div>

                {/* Total Marks (Admin Writable) */}
                <div>
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1">
                    Total Marks (Admin Writable)
                  </label>
                  <input
                    type="number"
                    min={10}
                    value={liveTotalMarks}
                    onChange={(e) => setLiveTotalMarks(parseInt(e.target.value, 10) || 100)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                  />
                  <div className="flex flex-wrap gap-1 mt-1">
                    {[50, 100, 200, 300].map(tm => (
                      <button
                        key={tm}
                        type="button"
                        onClick={() => setLiveTotalMarks(tm)}
                        className={`text-[9px] font-mono px-1.5 py-0.5 rounded border cursor-pointer ${
                          liveTotalMarks === tm
                            ? 'bg-rose-600 text-white border-rose-600'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {tm}M
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    placeholder="Short description for students..."
                    value={liveTestDesc}
                    onChange={(e) => setLiveTestDesc(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Category-Wise Cut Off Configuration (Admin Writable in Admin Panel) */}
              <div className="p-3.5 bg-rose-50/40 dark:bg-rose-950/20 rounded-2xl border border-rose-200 dark:border-rose-900/40 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-rose-600" />
                    <span className="text-xs font-black text-rose-950 dark:text-rose-200 uppercase tracking-wide">
                      Category-Wise Cut Off Marks (Written by Admin Owner)
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500">Benchmark minimum qualifying cut-offs</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 block mb-0.5">
                      UR / General Cut-off
                    </label>
                    <input
                      type="number"
                      value={liveCutoffUR}
                      onChange={(e) => setLiveCutoffUR(Number(e.target.value) || 0)}
                      className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 block mb-0.5">
                      OBC Cut-off
                    </label>
                    <input
                      type="number"
                      value={liveCutoffOBC}
                      onChange={(e) => setLiveCutoffOBC(Number(e.target.value) || 0)}
                      className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 block mb-0.5">
                      EWS Cut-off
                    </label>
                    <input
                      type="number"
                      value={liveCutoffEWS}
                      onChange={(e) => setLiveCutoffEWS(Number(e.target.value) || 0)}
                      className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 block mb-0.5">
                      SC Cut-off
                    </label>
                    <input
                      type="number"
                      value={liveCutoffSC}
                      onChange={(e) => setLiveCutoffSC(Number(e.target.value) || 0)}
                      className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 block mb-0.5">
                      ST Cut-off
                    </label>
                    <input
                      type="number"
                      value={liveCutoffST}
                      onChange={(e) => setLiveCutoffST(Number(e.target.value) || 0)}
                      className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* PDF Question Importer Section for Live Tests */}
              <div className="p-4 bg-rose-50/40 dark:bg-rose-950/20 rounded-2xl border-2 border-dashed border-rose-300 dark:border-rose-800 space-y-3">
                <input
                  type="file"
                  ref={livePdfQuestionFileInputRef}
                  accept=".pdf,.txt"
                  onChange={handleLivePdfQuestionFileUpload}
                  className="hidden"
                />

                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-md shrink-0">
                      <FileUp className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-xs text-slate-900 dark:text-white">
                        Add Live Test Questions via Question Paper PDF (Up to 1 GB)
                      </h4>
                      <p className="text-[10px] text-slate-500">
                        Upload official CBT question paper PDF or load sample questions directly into this Live Test.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() => livePdfQuestionFileInputRef.current?.click()}
                      disabled={isLiveExtractingPdf}
                      className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      {isLiveExtractingPdf ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                      <span>{isLiveExtractingPdf ? 'Extracting PDF...' : 'Upload Question Paper PDF'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleLoadSampleLiveQuestions}
                      className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 rounded-xl font-bold text-xs cursor-pointer flex items-center gap-1"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>Load Sample 5-Q Paper</span>
                    </button>
                  </div>
                </div>

                {isLiveExtractingPdf && livePdfExtractProgress && (
                  <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-rose-200 dark:border-rose-900 space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-white">
                      <span className="flex items-center gap-1 text-rose-600">
                        <RefreshCw className="w-3 h-3 animate-spin" />
                        <span>Extracting questions for Live Test...</span>
                      </span>
                      <span className="font-mono text-rose-600">{livePdfExtractProgress.percent}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-rose-600 to-red-600 rounded-full transition-all duration-200"
                        style={{ width: `${livePdfExtractProgress.percent}%` }}
                      />
                    </div>
                  </div>
                )}

                {livePdfSuccessMsg && (
                  <div className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-rose-300 dark:border-rose-800 text-xs font-semibold text-rose-700 dark:text-rose-300">
                    {livePdfSuccessMsg}
                  </div>
                )}
              </div>

              {/* Live Question Builder Panel */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Plus className="w-4 h-4 text-blue-600" />
                      <span>Add Live Test Question</span>
                    </h4>
                    <span className="text-[11px] text-slate-500">
                      Total questions queued for this live test: <strong>{liveQuestionsList.length} Qs</strong>
                    </span>
                  </div>

                  {liveQuestionsList.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setLiveQuestionsList([])}
                      className="text-xs text-rose-500 hover:underline font-semibold cursor-pointer"
                    >
                      Clear Queued ({liveQuestionsList.length})
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                      Question Statement / Stem
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Type the question text here..."
                      value={liveQStem}
                      onChange={(e) => setLiveQStem(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                    />
                  </div>

                  {/* 4 Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <button
                          type="button"
                          onClick={() => setLiveQCorrectIdx(0)}
                          className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center cursor-pointer ${
                            liveQCorrectIdx === 0 ? 'bg-emerald-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600'
                          }`}
                        >
                          A
                        </button>
                        <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Option A {liveQCorrectIdx === 0 && '(Correct)'}</span>
                      </div>
                      <input
                        type="text"
                        placeholder="Option A text..."
                        value={liveQOptA}
                        onChange={(e) => setLiveQOptA(e.target.value)}
                        className={`w-full px-3 py-1.5 bg-white dark:bg-slate-900 border rounded-xl text-xs ${liveQCorrectIdx === 0 ? 'border-emerald-500 ring-1 ring-emerald-500' : 'border-slate-200 dark:border-slate-700'}`}
                      />
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <button
                          type="button"
                          onClick={() => setLiveQCorrectIdx(1)}
                          className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center cursor-pointer ${
                            liveQCorrectIdx === 1 ? 'bg-emerald-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600'
                          }`}
                        >
                          B
                        </button>
                        <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Option B {liveQCorrectIdx === 1 && '(Correct)'}</span>
                      </div>
                      <input
                        type="text"
                        placeholder="Option B text..."
                        value={liveQOptB}
                        onChange={(e) => setLiveQOptB(e.target.value)}
                        className={`w-full px-3 py-1.5 bg-white dark:bg-slate-900 border rounded-xl text-xs ${liveQCorrectIdx === 1 ? 'border-emerald-500 ring-1 ring-emerald-500' : 'border-slate-200 dark:border-slate-700'}`}
                      />
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <button
                          type="button"
                          onClick={() => setLiveQCorrectIdx(2)}
                          className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center cursor-pointer ${
                            liveQCorrectIdx === 2 ? 'bg-emerald-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600'
                          }`}
                        >
                          C
                        </button>
                        <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Option C {liveQCorrectIdx === 2 && '(Correct)'}</span>
                      </div>
                      <input
                        type="text"
                        placeholder="Option C text..."
                        value={liveQOptC}
                        onChange={(e) => setLiveQOptC(e.target.value)}
                        className={`w-full px-3 py-1.5 bg-white dark:bg-slate-900 border rounded-xl text-xs ${liveQCorrectIdx === 2 ? 'border-emerald-500 ring-1 ring-emerald-500' : 'border-slate-200 dark:border-slate-700'}`}
                      />
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <button
                          type="button"
                          onClick={() => setLiveQCorrectIdx(3)}
                          className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center cursor-pointer ${
                            liveQCorrectIdx === 3 ? 'bg-emerald-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600'
                          }`}
                        >
                          D
                        </button>
                        <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Option D {liveQCorrectIdx === 3 && '(Correct)'}</span>
                      </div>
                      <input
                        type="text"
                        placeholder="Option D text..."
                        value={liveQOptD}
                        onChange={(e) => setLiveQOptD(e.target.value)}
                        className={`w-full px-3 py-1.5 bg-white dark:bg-slate-900 border rounded-xl text-xs ${liveQCorrectIdx === 3 ? 'border-emerald-500 ring-1 ring-emerald-500' : 'border-slate-200 dark:border-slate-700'}`}
                      />
                    </div>
                  </div>

                  {/* Section, Marks and Explanation */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 pt-1">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 block mb-1">Section</label>
                      <input
                        type="text"
                        value={liveQSection}
                        onChange={(e) => setLiveQSection(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 block mb-1">+ Marks</label>
                      <input
                        type="number"
                        step="0.5"
                        value={liveQMarksPos}
                        onChange={(e) => setLiveQMarksPos(parseFloat(e.target.value) || 2)}
                        className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 block mb-1">- Negative</label>
                      <input
                        type="number"
                        step="0.25"
                        value={liveQMarksNeg}
                        onChange={(e) => setLiveQMarksNeg(parseFloat(e.target.value) || 0.5)}
                        className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 block mb-1">Explanation</label>
                      <input
                        type="text"
                        placeholder="Solution note..."
                        value={liveQExplanation}
                        onChange={(e) => setLiveQExplanation(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        if (!liveQStem.trim() || !liveQOptA.trim() || !liveQOptB.trim()) {
                          alert('Please enter at least question text and Options A & B.');
                          return;
                        }
                        const newQ: Question = {
                          id: 'lq-' + Date.now() + '-' + Math.random().toString(36).substring(2, 5),
                          questionNumber: liveQuestionsList.length + 1,
                          section: liveQSection || 'General Awareness',
                          topic: 'Live Test Special',
                          difficulty: 'Medium',
                          questionText: liveQStem,
                          options: [
                            liveQOptA,
                            liveQOptB,
                            liveQOptC || 'None of the above',
                            liveQOptD || 'All of the above'
                          ],
                          correctAnswerIndex: liveQCorrectIdx,
                          explanation: liveQExplanation || 'Verified live examination solution key.',
                          marksPositive: liveQMarksPos,
                          marksNegative: liveQMarksNeg,
                          idealTimeSeconds: 60
                        };
                        setLiveQuestionsList(prev => [...prev, newQ]);
                        setLiveQStem('');
                        setLiveQOptA('');
                        setLiveQOptB('');
                        setLiveQOptC('');
                        setLiveQOptD('');
                        setLiveQExplanation('');
                      }}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Question to Queue</span>
                    </button>
                  </div>
                </div>

                {/* Queued questions preview list */}
                {liveQuestionsList.length > 0 && (
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-700 space-y-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                      Queued Questions ({liveQuestionsList.length}):
                    </span>
                    <div className="max-h-48 overflow-y-auto space-y-1.5">
                      {liveQuestionsList.map((q, idx) => (
                        <div key={q.id} className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                          <div className="truncate pr-2">
                            <span className="font-bold text-blue-600 mr-2">Q{idx + 1}.</span>
                            <span className="text-slate-800 dark:text-slate-200">{q.questionText}</span>
                            <span className="text-[10px] text-slate-400 ml-2 font-mono">({q.section} • Correct: {String.fromCharCode(65 + q.correctAnswerIndex)})</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setLiveQuestionsList(prev => prev.filter(item => item.id !== q.id))}
                            className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer shrink-0"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Submit / Publish Scheduled Live Test */}
              <button
                type="button"
                onClick={() => {
                  const title = liveTestTitle.trim() || `${liveExamName} All-India Mega Live Mock Test`;
                  const fallbackQuestions: Question[] = liveQuestionsList.length > 0 ? liveQuestionsList : [
                    {
                      id: 'lq-sample-1',
                      questionNumber: 1,
                      section: 'General Awareness',
                      topic: 'Current Affairs',
                      difficulty: 'Medium',
                      questionText: 'Which platform is pioneering real TCS iON pattern live national mock tests with timing countdown across India?',
                      options: ['UPTO SELECTION', 'Random Test Portal', 'Old Paper Archive', 'Unverified Forum'],
                      correctAnswerIndex: 0,
                      explanation: 'UPTO SELECTION provides real TCS iON interface and scheduled live tests with national percentile ranking.',
                      marksPositive: 2,
                      marksNegative: 0.5,
                      idealTimeSeconds: 45
                    },
                    {
                      id: 'lq-sample-2',
                      questionNumber: 2,
                      section: 'General Awareness',
                      topic: 'Constitution',
                      difficulty: 'Easy',
                      questionText: 'Under which Article of the Indian Constitution is the Staff Selection Commission established?',
                      options: ['Executive Resolution', 'Article 315', 'Article 324', 'Article 280'],
                      correctAnswerIndex: 0,
                      explanation: 'SSC was constituted via Department of Personnel & Administrative Reforms resolution in 1975.',
                      marksPositive: 2,
                      marksNegative: 0.5,
                      idealTimeSeconds: 45
                    }
                  ];

                  const newLiveTest: LiveTest = {
                    id: 'live-' + Date.now(),
                    examName: liveExamName,
                    category: liveTestCat,
                    title,
                    description: liveTestDesc || 'National-level scheduled live examination with live timer, question-level tracking and all-India percentile ranking.',
                    type: liveTestType,
                    classification: liveTestClassification,
                    chapterOrSectionName: liveTestChapterOrSec || undefined,
                    scheduledStartTime: liveStartTime,
                    durationMinutes: liveDurationMins,
                    totalMarks: liveTotalMarks,
                    cutoffMarks: {
                      general: Number(liveCutoffUR) || 135,
                      obc: Number(liveCutoffOBC) || 128,
                      ews: Number(liveCutoffEWS) || 124,
                      sc_st: Number(liveCutoffSC) || 112
                    },
                    questions: fallbackQuestions,
                    status: 'Upcoming',
                    participantsCount: Math.floor(800 + Math.random() * 1500)
                  };

                  addLiveTest(newLiveTest);
                  setLiveSuccessMsg(`Live Test "${newLiveTest.title}" scheduled successfully with ${fallbackQuestions.length} questions!`);
                  setLiveTestTitle('');
                  setLiveQuestionsList([]);
                  setTimeout(() => setLiveSuccessMsg(null), 4000);
                }}
                className="w-full py-3 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-rose-600/25 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
              >
                <Radio className="w-4 h-4 animate-pulse" />
                <span>Publish Scheduled Live Test ({liveQuestionsList.length > 0 ? `${liveQuestionsList.length} Questions` : 'Ready to Launch'})</span>
              </button>
            </div>
          </div>

          {/* Existing Scheduled Live Tests */}
          <div className="space-y-3">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center justify-between">
              <span>All Scheduled Live Tests ({liveTests.length})</span>
              <span className="text-xs text-slate-400 font-mono">Live on Student Dashboard</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {liveTests.map(lt => {
                const startDate = new Date(lt.scheduledStartTime);
                const formattedTime = startDate.toLocaleString('en-IN', {
                  dateStyle: 'medium',
                  timeStyle: 'short'
                });

                return (
                  <div
                    key={lt.id}
                    className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] uppercase font-extrabold px-2.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300">
                            {lt.category} • {lt.type.replace('_', ' ')}
                          </span>
                          {lt.classification && (
                            <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                              {lt.classification}
                            </span>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Delete scheduled live test "${lt.title}"?`)) {
                              deleteLiveTest(lt.id);
                            }
                          }}
                          className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-snug">
                        {lt.title}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">{lt.description}</p>

                      <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs space-y-1.5">
                        <div className="flex justify-between text-slate-700 dark:text-slate-300">
                          <span>Scheduled Start:</span>
                          <strong className="text-blue-600 dark:text-blue-400">{formattedTime}</strong>
                        </div>
                        <div className="flex justify-between text-slate-500">
                          <span>Duration & Marks:</span>
                          <span className="font-mono text-slate-800 dark:text-slate-200 font-bold">{lt.durationMinutes} Mins • {lt.totalMarks} Marks</span>
                        </div>
                        {lt.cutoffMarks && (
                          <div className="flex justify-between text-slate-500 text-[11px]">
                            <span>Category Cut-offs:</span>
                            <span className="font-mono text-slate-700 dark:text-slate-300 font-semibold">
                              UR: {lt.cutoffMarks.general} | OBC: {lt.cutoffMarks.obc} | EWS: {lt.cutoffMarks.ews} | SC: {lt.cutoffMarks.sc_st}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between text-slate-500">
                          <span>Questions Configured:</span>
                          <strong className="text-emerald-600">{lt.questions.length} Questions</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: PDF to Mock Test Importer (Direct File Upload & Supports PDF Size Up to 1 GB) */}
      {activeTab === 'pdf_importer' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">PDF Importer Engine</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-300 dark:border-blue-700">
                PDF Size Up to 1 GB
              </span>
            </div>
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white mt-0.5">
              Add Mock Test from PDF File (Supports PDF File Size up to 1 GB)
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Upload your question paper PDF file up to 1 GB (1,024 MB). High-capacity chunked streaming engine automatically extracts question stems, 4 options, answer keys, and explanations with no question count limits!
            </p>
          </div>

          {/* Test Metadata Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1">Target Exam (From Admin Exams)</label>
              <select
                value={importSelectedExamName}
                onChange={(e) => setImportSelectedExamName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
              >
                {adminExams.map(ex => (
                  <option key={ex.id} value={ex.name}>{ex.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1">
                Category (Admin Writable)
              </label>
              <input
                type="text"
                placeholder="e.g. SSC, Railways, State PSC, Police..."
                value={importCustomCategory}
                onChange={(e) => setImportCustomCategory(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1">
                Test Type (Admin Writable)
              </label>
              <input
                type="text"
                placeholder="e.g. Full Length Mock, Section-wise, Chapterwise..."
                value={importTestTypeCustom}
                onChange={(e) => {
                  setImportTestTypeCustom(e.target.value);
                  const lower = e.target.value.toLowerCase();
                  if (lower.includes('chapter')) setImportTestType('chapter_wise');
                  else if (lower.includes('section')) setImportTestType('section_wise');
                  else setImportTestType('full_mock');
                }}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
              />
              <div className="flex flex-wrap gap-1 mt-1">
                {['Full Length Mock Test', 'Section-wise Test', 'Chapterwise Test', 'Previous Year Paper', 'Mega Live Test'].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => {
                      setImportTestTypeCustom(t);
                      const lower = t.toLowerCase();
                      if (lower.includes('chapter')) setImportTestType('chapter_wise');
                      else if (lower.includes('section')) setImportTestType('section_wise');
                      else setImportTestType('full_mock');
                    }}
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-md border cursor-pointer ${
                      importTestTypeCustom === t
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1">
                Duration (Minutes - Admin Writable)
              </label>
              <input
                type="number"
                min={1}
                value={importDurationMins}
                onChange={(e) => setImportDurationMins(parseInt(e.target.value, 10) || 60)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
              />
              <div className="flex flex-wrap gap-1 mt-1">
                {[15, 30, 45, 60, 90, 120, 180].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setImportDurationMins(mins)}
                    className={`text-[9px] font-mono px-2 py-0.5 rounded-md border cursor-pointer ${
                      importDurationMins === mins
                        ? 'bg-blue-600 text-white border-blue-600 font-bold'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {mins}m
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1">Mock Test Title</label>
            <input
              type="text"
              value={importTestTitle}
              onChange={(e) => setImportTestTitle(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
            />
          </div>

          {/* Section: Upload Question Paper File (.pdf / .txt) up to 1 GB */}
          <div className="p-6 bg-blue-50/50 dark:bg-blue-950/20 rounded-2xl border-2 border-dashed border-blue-400/40 space-y-4 text-center">
            <input
              type="file"
              ref={questionFileInputRef}
              accept=".pdf,.txt"
              onChange={handlePdfQuestionFileUpload}
              className="hidden"
            />

            <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto shadow-md shadow-blue-600/30">
              <Upload className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
                Upload Question Paper PDF File (Size up to 1 GB Supported)
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 max-w-xl mx-auto leading-relaxed">
                Upload your questions in PDF format. Supports PDF files <strong>up to 1 GB (1,024 MB)</strong> with streaming extraction for comprehensive question banks, year-wise papers, and multi-subject series without question count caps!
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-700">
                  ⚡ Max PDF Size: 1 GB (1,024 MB)
                </span>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                  ✨ No Question Count Limits
                </span>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
                  📁 Chunked Memory Streaming
                </span>
              </div>
            </div>

            {/* Live Progress Bar for large PDF extraction */}
            {isExtractingPdf && pdfExtractProgress && (
              <div className="max-w-md mx-auto p-4 bg-white dark:bg-slate-800 rounded-2xl border border-blue-300 dark:border-blue-800 shadow-md text-left space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-white">
                  <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Extracting PDF Content...</span>
                  </span>
                  <span className="font-mono text-blue-600 dark:text-blue-400">{pdfExtractProgress.percent}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-200"
                    style={{ width: `${pdfExtractProgress.percent}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  {pdfExtractProgress.stage}
                </p>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => questionFileInputRef.current?.click()}
                disabled={isExtractingPdf}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs shadow-md shadow-blue-600/20 flex items-center gap-2 cursor-pointer disabled:opacity-50 active:scale-95 transition-all"
              >
                {isExtractingPdf ? <RefreshCw className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
                <span>{isExtractingPdf ? 'Extracting Questions (Up to 1 GB)...' : 'Select PDF File (Up to 1 GB)'}</span>
              </button>

              <button
                type="button"
                onClick={handleLoadSamplePdfText}
                className="px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 rounded-xl font-bold text-xs cursor-pointer flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                <span>Load Sample 5-Q Paper</span>
              </button>
            </div>

            {pdfUploadSuccessMsg && (
              <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-blue-300 dark:border-blue-800 text-xs font-semibold text-blue-700 dark:text-blue-300 text-left">
                {pdfUploadSuccessMsg}
              </div>
            )}
          </div>

          {/* Section: Attached Study Lesson PDF (Read before mock test) */}
          <div className="p-5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
                  Attached Study Lesson PDF (Mandatory Reading Before Mock)
                </span>
                <p className="text-[11px] text-slate-500">
                  Upload the original PDF lesson file so students can read it directly on their phone before taking the mock test.
                </p>
              </div>

              <input
                type="file"
                ref={attachedPdfInputRef}
                accept=".pdf"
                onChange={handleAttachedPdfFileUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => attachedPdfInputRef.current?.click()}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Lesson PDF File</span>
              </button>
            </div>

            {attachedPdfFileName && (
              <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 font-bold flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Attached File: {attachedPdfFileName} ({pdfPages} estimated pages)</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-slate-500 block mb-1">PDF Document Title</label>
                <input
                  type="text"
                  value={pdfTitle}
                  onChange={(e) => setPdfTitle(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-500 block mb-1">Total Pages</label>
                <input
                  type="number"
                  value={pdfPages}
                  onChange={(e) => setPdfPages(parseInt(e.target.value, 10) || 10)}
                  className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] text-slate-500 block mb-1">Summary & Key Formulas (Markdown & Formulas)</label>
              <textarea
                rows={3}
                value={pdfMarkdown}
                onChange={(e) => setPdfMarkdown(e.target.value)}
                className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Raw Text Question Input and Editor */}
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Question Text Editor (Extracted from PDF / Paste directly):
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleAutoCleanAndReparse}
                  className="px-3 py-1 bg-blue-100 hover:bg-blue-200 dark:bg-blue-950 dark:hover:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-lg font-bold text-[11px] cursor-pointer flex items-center gap-1 transition-colors"
                  title="Remove watermarks & auto-detect questions and horizontal options"
                >
                  <Sparkles className="w-3 h-3 text-emerald-500" />
                  <span>Auto-Clean & Detect Questions</span>
                </button>
                <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
                  {parsedQuestions.length} Questions Detected
                </span>
              </div>
            </div>

            <textarea
              rows={8}
              value={pdfRawText}
              onChange={(e) => {
                setPdfRawText(e.target.value);
                setParsedQuestions(parseQuestionsFromText(e.target.value, importPositiveMarks, importNegativeMarks));
              }}
              placeholder="Q1. Question text here...&#10;(A) Option 1  (B) Option 2  (C) Option 3  (D) Option 4&#10;Ans: A&#10;Exp: Detailed explanation here..."
              className="w-full p-4 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-mono text-slate-900 dark:text-white"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Supports inline horizontal options <code>(A) ... (B) ... (C) ... (D) ...</code>, separate answer keys at the bottom, and bilingual Hindi/English questions.
            </p>
          </div>

          {/* Actions Bar */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleAutoCleanAndReparse}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs cursor-pointer shadow-md shadow-blue-600/20 flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reparse & Detect Questions ({parsedQuestions.length} Found)</span>
            </button>

            <button
              type="button"
              onClick={handleAddManualQuestion}
              className="px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 rounded-xl font-bold text-xs cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 text-blue-600" />
              <span>+ Add Question Manually</span>
            </button>

            {parsedQuestions.length > 0 && (
              <button
                type="button"
                onClick={handleSaveImportedMockTest}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs cursor-pointer shadow-md shadow-emerald-600/20 flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Save & Publish Mock Test ({parsedQuestions.length} Questions)</span>
              </button>
            )}
          </div>

          {/* Interactive Parsed Questions Editor & Preview Table */}
          {parsedQuestions.length > 0 ? (
            <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                    Interactive Questions Review & Editor ({parsedQuestions.length} Questions)
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Click any option badge (A, B, C, D) to set the correct answer, or edit question text directly.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddManualQuestion}
                  className="px-3 py-1.5 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 rounded-lg font-bold text-xs hover:bg-blue-100 cursor-pointer"
                >
                  + Add Question
                </button>
              </div>

              <div className="max-h-96 overflow-y-auto space-y-3 pr-2">
                {parsedQuestions.map((q, qIdx) => (
                  <div key={q.id || qIdx} className="p-4 bg-slate-50 dark:bg-slate-800/70 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs space-y-3">
                    {/* Question Header & Stem */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-blue-600 dark:text-blue-400 font-mono text-xs">
                            Q{qIdx + 1}.
                          </span>
                          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                            {q.section || 'General Section'} • {q.difficulty}
                          </span>
                        </div>
                        <input
                          type="text"
                          value={q.questionText}
                          onChange={(e) => handleUpdateParsedQuestion(qIdx, 'questionText', e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-900 dark:text-white"
                          placeholder="Question stem..."
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteParsedQuestion(qIdx)}
                        className="text-rose-500 hover:text-rose-700 p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                        title="Delete this question"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* 4 Options with click-to-set Correct Answer */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Choices (Click A, B, C, or D pill to mark as Correct Answer):
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {q.options.map((opt, optIdx) => {
                          const isCorrect = q.correctAnswerIndex === optIdx;
                          const optLetter = String.fromCharCode(65 + optIdx);
                          return (
                            <div 
                              key={optIdx} 
                              className={`flex items-center gap-2 p-1.5 rounded-xl border transition-colors ${
                                isCorrect 
                                  ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/40' 
                                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900'
                              }`}
                            >
                              <button
                                type="button"
                                onClick={() => handleUpdateParsedQuestion(qIdx, 'correctAnswerIndex', optIdx)}
                                className={`w-6 h-6 rounded-lg font-bold text-xs flex items-center justify-center shrink-0 cursor-pointer transition-all ${
                                  isCorrect 
                                    ? 'bg-emerald-600 text-white shadow-sm' 
                                    : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300'
                                }`}
                                title={`Click to set Option ${optLetter} as correct answer`}
                              >
                                {optLetter}
                              </button>
                              <input
                                type="text"
                                value={opt}
                                onChange={(e) => handleUpdateOption(qIdx, optIdx, e.target.value)}
                                className="w-full bg-transparent border-0 text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
                                placeholder={`Option ${optLetter}...`}
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Explanation */}
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                        Solution / Explanation:
                      </span>
                      <input
                        type="text"
                        value={q.explanation}
                        onChange={(e) => handleUpdateParsedQuestion(qIdx, 'explanation', e.target.value)}
                        placeholder="Detailed concept explanation..."
                        className="w-full px-2.5 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-600 dark:text-slate-300"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-6 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 text-center space-y-2">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                No questions detected yet. Select your PDF file above (supports up to 1 GB), or click below to load a sample paper.
              </p>
              <div className="flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={handleLoadSamplePdfText}
                  className="px-3 py-1.5 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 rounded-lg font-bold text-xs cursor-pointer"
                >
                  Load 5-Question Sample Paper
                </button>
                <button
                  type="button"
                  onClick={handleAddManualQuestion}
                  className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-bold text-xs cursor-pointer"
                >
                  + Add First Question Manually
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Exam Dates Tracker (State, Central, None & Official Apply Online Link) */}
      {activeTab === 'timelines' && (
        <div className="space-y-6">
          <form onSubmit={handleAddTimeline} className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Date Timeline Publisher</span>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white mt-0.5">
                Add Exam Notification & Schedule (With Official Apply Online Link)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Students can see notification out date, exam date, result date and click Apply Online directly on their dashboard.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1">Exam Name</label>
                <input
                  type="text"
                  placeholder="e.g. SSC CGL 2026 Tier-1"
                  value={tlExamName}
                  onChange={(e) => setTlExamName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1">Department / Board</label>
                <input
                  type="text"
                  placeholder="e.g. Staff Selection Commission"
                  value={tlDept}
                  onChange={(e) => setTlDept(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1">
                  Vacancy No. / Total Posts (Admin Configured)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 17,727 Posts or 5,000 Vacancies"
                  value={tlPosts}
                  onChange={(e) => setTlPosts(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-blue-300 dark:border-blue-700 rounded-xl text-xs font-bold text-blue-700 dark:text-blue-300 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1">Scope</label>
                <select
                  value={tlScope}
                  onChange={(e) => setTlScope(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                >
                  <option value="Central">Central Govt Exam</option>
                  <option value="State">State Govt Exam</option>
                  <option value="None">None (General / All India)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1">Exam Category</label>
                <select
                  value={tlCategory}
                  onChange={(e) => setTlCategory(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                >
                  <option value="SSC">SSC (CGL, CHSL, MTS, CPO, GD)</option>
                  <option value="Railways">Railways (RRB NTPC, Group D, ALP)</option>
                  <option value="Banking">Banking (IBPS, SBI PO, Clerk, RBI)</option>
                  <option value="State PSC">State PSC & Civil Services</option>
                  <option value="Police">Police SI & Constable</option>
                  <option value="Defence">Defence (NDA, CDS, AFCAT)</option>
                  <option value="Teaching">Teaching (CTET, State TET)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1">Notification Status</label>
                <select
                  value={tlStatus}
                  onChange={(e) => setTlStatus(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                >
                  <option value="Notification Out">Notification Out</option>
                  <option value="Admit Card Released">Admit Card Released</option>
                  <option value="Exam Scheduled">Exam Scheduled</option>
                  <option value="Result Declared">Result Declared</option>
                </select>
              </div>
            </div>

            {tlScope === 'State' && (
              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1">State Name</label>
                <input
                  type="text"
                  placeholder="e.g. West Bengal, Bihar, UP, Rajasthan"
                  value={tlStateName}
                  onChange={(e) => setTlStateName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1">Notification Out Date</label>
                <input
                  type="date"
                  value={tlNotifDate}
                  onChange={(e) => setTlNotifDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1">Exam Date</label>
                <input
                  type="date"
                  value={tlExamDate}
                  onChange={(e) => setTlExamDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1">Result Date</label>
                <input
                  type="date"
                  value={tlResultDate}
                  onChange={(e) => setTlResultDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1">Eligibility</label>
                <input
                  type="text"
                  placeholder="e.g. Graduation / 12th Pass"
                  value={tlEligibility}
                  onChange={(e) => setTlEligibility(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>
            </div>

            {/* Official Apply Online Link Input */}
            <div>
              <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1">
                Official Exam Apply Online Link (Given by Admin)
              </label>
              <div className="relative">
                <ExternalLink className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="url"
                  placeholder="https://ssc.gov.in or https://rrbapply.gov.in"
                  value={tlApplyLink}
                  onChange={(e) => setTlApplyLink(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-900 dark:text-white"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs cursor-pointer shadow-md shadow-blue-600/20"
            >
              Publish Notification & Schedule
            </button>
          </form>

          {/* Existing Timelines List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {notificationsTimeline.map(item => (
              <div
                key={item.id}
                className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                    {item.scope === 'State' ? item.stateName : item.scope === 'None' ? 'None (General)' : 'Central'} • {item.category}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-black px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                      🎯 {item.postsCount}
                    </span>
                    <button
                      onClick={() => deleteNotificationTimeline(item.id)}
                      className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h4 className="font-bold text-sm text-slate-900 dark:text-white">{item.examName}</h4>
                
                <div className="p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-xs space-y-1">
                  <div className="flex justify-between text-slate-500">
                    <span>Notification Out:</span>
                    <strong className="text-slate-800 dark:text-white">{item.notificationOutDate}</strong>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Exam Date:</span>
                    <strong className="text-blue-600 dark:text-blue-400">{item.examDate}</strong>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Result Date:</span>
                    <strong className="text-emerald-600 dark:text-emerald-400">{item.resultDate}</strong>
                  </div>
                </div>

                <div className="pt-1">
                  <a
                    href={item.applyLink}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                  >
                    <span>Apply Online</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 6: Send Broadcast Notifications to Students */}
      {activeTab === 'send_notifications' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Communication Center</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-300 dark:border-blue-700 flex items-center gap-1">
                  <Bell className="w-3 h-3 text-blue-600" /> Push Broadcast
                </span>
              </div>
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white mt-0.5">
                Send Notifications to Students & Candidates
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Broadcast instant alerts, exam admit card updates, new mock test launches, and discount announcements directly to candidates across India.
              </p>
            </div>

            {notifSuccessMsg && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-500/30 rounded-2xl text-xs text-emerald-800 dark:text-emerald-300 font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{notifSuccessMsg}</span>
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!notifTitle.trim() || !notifMessage.trim()) {
                  alert('Please provide notification title and message.');
                  return;
                }
                const newNotification: BroadcastNotification = {
                  id: 'notif-' + Date.now(),
                  title: notifTitle.trim(),
                  message: notifMessage.trim(),
                  date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
                  type: notifType,
                  targetExam: notifTargetExam === 'ALL' ? undefined : notifTargetExam
                };

                sendBroadcastNotification(newNotification);
                setNotifSuccessMsg(`Notification "${newNotification.title}" broadcasted successfully to all candidates!`);
                setNotifTitle('');
                setNotifMessage('');
                setTimeout(() => setNotifSuccessMsg(null), 4000);
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1">
                    Target Candidates Audience
                  </label>
                  <select
                    value={notifTargetExam}
                    onChange={(e) => setNotifTargetExam(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                  >
                    <option value="ALL">🌐 All Registered Candidates (India-Wide Broadcast)</option>
                    {adminExams.map(ex => (
                      <option key={ex.id} value={ex.name}>Target: {ex.name} Aspirants Only</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1">
                    Notification Category
                  </label>
                  <select
                    value={notifType}
                    onChange={(e) => setNotifType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                  >
                    <option value="Alert">⚠️ General Important Alert</option>
                    <option value="Admit Card">🎫 Admit Card / Hall Ticket Released</option>
                    <option value="New Mock Test">📝 New Mock Test Added</option>
                    <option value="Result">🏆 Exam Result / Answer Key Out</option>
                    <option value="Discount Offer">🏷️ Special Coupon Discount Offer</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1">
                  Notification Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. SSC CGL 2026 Tier-1 City Intimation Slip Released!"
                  value={notifTitle}
                  onChange={(e) => setNotifTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1">
                  Notification Message Body
                </label>
                <textarea
                  rows={3}
                  placeholder="Enter detailed alert body for students..."
                  value={notifMessage}
                  onChange={(e) => setNotifMessage(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-xl shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
              >
                <Send className="w-4 h-4" />
                <span>Send Broadcast Notification to Students</span>
              </button>
            </form>
          </div>

          {/* Sent Notifications History */}
          <div className="space-y-3">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center justify-between">
              <span>Dispatched Notifications History ({broadcastNotifications.length})</span>
              <span className="text-xs text-slate-400 font-mono">Live on Student Navbar & Alerts</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {broadcastNotifications.map(notif => (
                <div
                  key={notif.id}
                  className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-3"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] uppercase font-extrabold px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300">
                        {notif.type}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Delete notification "${notif.title}"?`)) {
                            deleteBroadcastNotification(notif.id);
                          }
                        }}
                        className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                      {notif.title}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-3">{notif.message}</p>

                    <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                      <span>Audience: <strong>{notif.targetExam || 'All Aspirants'}</strong></span>
                      <span className="font-mono">{notif.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 7: E-Books Management (With PDF file upload) */}
      {activeTab === 'ebooks' && (
        <div className="space-y-6">
          <form onSubmit={handleAddEbook} className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Free E-Books & Study Material</span>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white mt-0.5">
                Add E-Book (Upload Original PDF File)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Upload actual PDF files so students can read in the app or via their device's native PDF viewing system.
              </p>
            </div>

            {/* PDF File Upload Input */}
            <div className="p-4 bg-blue-50/50 dark:bg-blue-950/20 rounded-2xl border-2 border-dashed border-blue-400/40 text-center space-y-2">
              <input
                type="file"
                ref={ebookPdfInputRef}
                accept=".pdf"
                onChange={handleEbookPdfUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => ebookPdfInputRef.current?.click()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 mx-auto cursor-pointer shadow-sm"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload E-Book PDF File</span>
              </button>
              <p className="text-[11px] text-slate-500">
                {newBookFileName ? `✅ Attached PDF: ${newBookFileName} (${newBookSize})` : 'Supports standard PDF files with high-res text & diagrams.'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1">E-Book Title</label>
                <input
                  type="text"
                  placeholder="e.g. 5000+ TCS Static GK Master Capsule"
                  value={newBookTitle}
                  onChange={(e) => setNewBookTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1">Subject</label>
                <input
                  type="text"
                  placeholder="e.g. General Awareness, Math, Reasoning"
                  value={newBookSub}
                  onChange={(e) => setNewBookSub(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1">Description & Key Highlights</label>
              <textarea
                rows={2}
                value={newBookDesc}
                onChange={(e) => setNewBookDesc(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs cursor-pointer shadow-md shadow-blue-600/20"
            >
              Add E-Book to Library
            </button>
          </form>

          {/* Existing E-books */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ebooks.map(book => (
              <div
                key={book.id}
                className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                      {book.category} • {book.subject}
                    </span>
                    <button
                      onClick={() => deleteEBook(book.id)}
                      className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">{book.title}</h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{book.description}</p>
                </div>

                <div className="p-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-xs flex items-center justify-between text-slate-600 dark:text-slate-400">
                  <span>{book.pages} Pages • {book.fileSize}</span>
                  <span className="text-[10px] text-blue-600 font-bold">{book.pdfDataUrl ? 'PDF Attached' : 'Text'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 6: Teach With Us Applicants (Prominent Phone Numbers & Exactly 15 Candidates Cycling Every 5 Days) */}
      {activeTab === 'teach_apps' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Educator Recruitment Center</span>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white mt-0.5">
                  Teach With Us Applicants (15 Active Roster • Cycling Every 5 Days)
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  100+ teachers are currently earning up to ₹1,00,000/month across India. View phone numbers, subject specialties, and interview candidate status.
                </p>
              </div>

              <div className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold text-xs flex items-center gap-1.5 border border-blue-500/20">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                <span>Auto-changes every 5 days</span>
              </div>
            </div>
          </div>

          {/* Candidate Grid with Prominent Phone Numbers */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teachApplications.map((cand, idx) => (
              <div
                key={cand.id || idx}
                className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 hover:border-blue-500/40 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                    cand.userTier === 'Gold'
                      ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                  }`}>
                    {cand.userTier} Tier Ranker
                  </span>
                  
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                    cand.status === 'Selected'
                      ? 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                      : cand.status === 'Interview Scheduled'
                      ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                      : 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                  }`}>
                    {cand.status}
                  </span>
                </div>

                <div>
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center justify-between">
                    <span>{cand.candidateName}</span>
                    <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
                      {cand.highestAccuracy}% Acc
                    </span>
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Specialty: <strong className="text-slate-700 dark:text-slate-300">{cand.subjectExpertise}</strong>
                  </p>
                </div>

                {/* PROMINENT PHONE NUMBER BOX */}
                <div className="p-3 bg-blue-50/70 dark:bg-blue-950/40 rounded-2xl border border-blue-200 dark:border-blue-800/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1">
                      <Phone className="w-3 h-3 text-blue-600" /> Phone Number:
                    </span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold">
                      Verified
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono font-extrabold text-sm text-blue-950 dark:text-blue-200 tracking-wider">
                      {cand.mobileNumber || cand.phoneNumber || '+91 98765 43210'}
                    </span>

                    <div className="flex items-center gap-1">
                      <a
                        href={`tel:${cand.mobileNumber || cand.phoneNumber || '+919876543210'}`}
                        className="p-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white cursor-pointer"
                        title="Call Candidate"
                      >
                        <Phone className="w-3 h-3" />
                      </a>
                      <a
                        href={`https://wa.me/${(cand.mobileNumber || cand.phoneNumber || '919876543210').replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer"
                        title="Chat on WhatsApp"
                      >
                        <MessageCircle className="w-3 h-3" />
                      </a>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(cand.mobileNumber || cand.phoneNumber || '');
                          alert(`Copied ${cand.mobileNumber || cand.phoneNumber} to clipboard!`);
                        }}
                        className="p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 cursor-pointer"
                        title="Copy Phone Number"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
                  <span>Applied: {cand.appliedDate}</span>
                  {cand.notes && <span className="truncate max-w-[140px] text-[10px]">{cand.notes}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 7: Students Management */}
      {activeTab === 'students' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Registered Students & Subscribers ({students.length})
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Track subscription validity, pass extensions, and test performance.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {students.map(std => (
              <div
                key={std.id}
                className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">{std.name}</h4>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    std.subscription.active
                      ? 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  }`}>
                    {std.subscription.active ? `${std.subscription.daysRemaining} Days Left` : 'Expired'}
                  </span>
                </div>

                <p className="text-xs text-slate-500">{std.email} • {std.phone}</p>

                <div className="p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-xs space-y-1 text-slate-600 dark:text-slate-300">
                  <div className="flex justify-between">
                    <span>Plan:</span>
                    <strong>{std.subscription.planName || 'Free Tier'}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Tests Given:</span>
                    <strong>{std.totalTestsGiven} Tests</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Accuracy:</span>
                    <strong>{std.avgAccuracy}%</strong>
                  </div>
                </div>

                <button
                  onClick={() => {
                    extendStudentSubscription(std.id, 30);
                    alert(`Added +30 days to ${std.name}'s pass!`);
                  }}
                  className="w-full py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl font-bold text-xs cursor-pointer transition-colors"
                >
                  + Grant 30 Days Free Pass
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 8: Payment Gateway Config */}
      {activeTab === 'payments' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Financial Configuration</span>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white mt-0.5">
              Payment Gateway & Pass Pricing Settings
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Configure UPI ID, QR code, Razorpay keys, and live test mode.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Merchant UPI ID (Payment will go directly to this UPI ID)
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. uptoselection@okaxis or your-upi@upi"
                  value={payForm.upiId}
                  onChange={(e) => setPayForm({ ...payForm, upiId: e.target.value.trim() })}
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-mono font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 block">
                Customer payments via PhonePe, GPay, Paytm, BHIM, CRED will redirect to this UPI ID.
              </span>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Receiver Merchant Name (Shown on student UPI screen)
              </label>
              <input
                type="text"
                placeholder="e.g. UPTO SELECTION Exam Prep"
                value={payForm.upiReceiverName}
                onChange={(e) => setPayForm({ ...payForm, upiReceiverName: e.target.value })}
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 block">
                Official payee name verified during UPI checkout.
              </span>
            </div>
          </div>

          {/* Uploaded QR Scanner by Admin in Admin Panel */}
          <div className="p-5 bg-gradient-to-r from-emerald-50/70 via-slate-50 to-blue-50/70 dark:from-emerald-950/30 dark:via-slate-900 dark:to-blue-950/30 rounded-2xl border border-emerald-200 dark:border-emerald-800/60 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-200/80 dark:border-emerald-800/60 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-emerald-600 text-white rounded-lg shadow-sm">
                  <QrCode className="w-4 h-4" />
                </span>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                    Merchant UPI QR Scanner (Upload Admin QR Image)
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Upload your official PhonePe, Paytm, BharatPe, BHIM, or Bank QR scanner image so students can scan and pay directly to you.
                  </p>
                </div>
              </div>

              {payForm.qrCodeUrl ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                  <CheckCircle2 className="w-3 h-3" /> Custom QR Scanner Active
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                  Auto-Generated UPI QR
                </span>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
              {/* QR Preview Display */}
              <div className="shrink-0 text-center space-y-1.5">
                <div className="w-36 h-36 p-2 bg-white rounded-2xl border-2 border-dashed border-emerald-400/80 shadow-md flex items-center justify-center overflow-hidden mx-auto">
                  {payForm.qrCodeUrl ? (
                    <img 
                      src={payForm.qrCodeUrl} 
                      alt="Uploaded QR Scanner" 
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=upi://pay?pa=${encodeURIComponent(payForm.upiId || 'uptoselection@okaxis')}&pn=${encodeURIComponent(payForm.upiReceiverName || 'UPTO SELECTION')}&cu=INR`} 
                      alt="Dynamic UPI QR" 
                      className="w-full h-full object-contain"
                    />
                  )}
                </div>
                <span className="text-[10px] font-bold text-slate-500 block">
                  {payForm.qrCodeUrl ? 'Uploaded Scanner Preview' : 'Dynamic QR Preview'}
                </span>
              </div>

              {/* Upload Controls */}
              <div className="flex-1 space-y-3 w-full">
                <div>
                  <input
                    type="file"
                    ref={qrFileInputRef}
                    onChange={handleQrImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => qrFileInputRef.current?.click()}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/20 cursor-pointer transition-all active:scale-95"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{payForm.qrCodeUrl ? 'Replace Uploaded QR Scanner' : 'Upload QR Scanner Image'}</span>
                    </button>

                    {payForm.qrCodeUrl && (
                      <button
                        type="button"
                        onClick={handleRemoveUploadedQr}
                        className="px-3.5 py-2 bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove Custom QR</span>
                      </button>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">
                    Supports PNG, JPG, JPEG, WEBP. You can take a screenshot or photo of your PhonePe, Paytm, BHIM, or Bank QR code standee / scanner and upload it here.
                  </p>
                </div>

                {/* Direct Image URL fallback */}
                <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                    Or Enter Hosted QR Scanner Image URL:
                  </label>
                  <input
                    type="url"
                    placeholder="https://yourdomain.com/my-upi-qr.png"
                    value={payForm.qrCodeUrl?.startsWith('data:') ? '' : (payForm.qrCodeUrl || '')}
                    onChange={(e) => setPayForm({ ...payForm, qrCodeUrl: e.target.value.trim() || undefined })}
                    className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-800 dark:text-white placeholder:text-slate-400"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Coupon Code & Discount Settings (Admin Configurable) */}
          <div className="p-4 bg-gradient-to-r from-blue-50/60 to-indigo-50/60 dark:from-blue-950/40 dark:to-indigo-950/40 rounded-2xl border border-blue-200 dark:border-blue-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-blue-700 dark:text-blue-300">
                Coupon Code & Discount Settings
              </span>
              <span className="text-[10px] bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-0.5 rounded-full font-bold">
                Student Promotional Offers
              </span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Coupon Code Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. SELECTION50 or DIWALI2026"
                  value={payForm.couponCode || ''}
                  onChange={(e) => setPayForm({ ...payForm, couponCode: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono font-bold text-blue-600 dark:text-blue-400 uppercase"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Students enter this code during checkout</span>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Discount (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={0}
                    max={100}
                    placeholder="e.g. 20 for 20% OFF"
                    value={payForm.couponDiscountPercent ?? 20}
                    onChange={(e) => setPayForm({ ...payForm, couponDiscountPercent: Number(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono font-bold text-slate-900 dark:text-white"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">%</span>
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">Percentage discount applied to passes</span>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  International Price (USD $)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    min={1}
                    placeholder="9.99"
                    value={payForm.internationalPriceUsd ?? 9.99}
                    onChange={(e) => setPayForm({ ...payForm, internationalPriceUsd: parseFloat(e.target.value) || 9.99 })}
                    className="w-full pl-6 pr-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono font-bold text-slate-900 dark:text-white"
                  />
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">$</span>
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">Foreign candidates E-Books & PDF fee</span>
              </div>
            </div>

            {/* Admin control: Show / Hide Coupon Code to Visitors */}
            <div className="pt-3 border-t border-blue-200 dark:border-blue-900/60 flex items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-slate-800 dark:text-white block">
                  Display Coupon Code to Visitors / Students on Checkout
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                  When enabled, visitors will see the code hint (e.g. &ldquo;{payForm.couponCode || 'SELECTION50'}&rdquo;) during checkout. When disabled, the code hint is hidden from visitors.
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={payForm.showDiscountCouponToStudents !== false}
                  onChange={(e) => setPayForm({ ...payForm, showDiscountCouponToStudents: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
              Official Subscription Pricing (INR):
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-slate-500 block mb-1">7-Day Free Trial:</span>
                <span className="font-bold text-sm text-emerald-600 dark:text-emerald-400 font-mono">FREE (1 Device)</span>
              </div>
              <div>
                <span className="text-slate-500 block mb-1">Each Exam (1-Mo):</span>
                <span className="font-bold text-sm text-slate-900 dark:text-white font-mono">₹49</span>
              </div>
              <div>
                <span className="text-slate-500 block mb-1">6-Month All Exams:</span>
                <span className="font-bold text-sm text-slate-900 dark:text-white font-mono">₹199</span>
              </div>
              <div>
                <span className="text-slate-500 block mb-1">1-Year (365 Days):</span>
                <span className="font-bold text-sm text-slate-900 dark:text-white font-mono">₹399</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                updatePaymentConfig(payForm);
                setPaySaved(true);
                setTimeout(() => setPaySaved(false), 4000);
              }}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs cursor-pointer shadow-md shadow-blue-600/20 flex items-center gap-1.5 transition-all active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>{paySaved ? '✓ Payment Settings & QR Scanner Saved!' : 'Save Payment Settings'}</span>
            </button>
            {paySaved && (
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 animate-in fade-in flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Student payments will now redirect to {payForm.upiId} and display your uploaded QR scanner!
              </span>
            )}
          </div>
        </div>
      )}

      {/* Tab 9: Admin Profile, Phone Number & Password Change Settings */}
      {activeTab === 'admin_security' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-3 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Access Control</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  Secured with Password
                </span>
              </div>
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white mt-0.5">
                Admin Security & Profile Settings
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Update your administrator mobile number, email, and change your login password.
              </p>
            </div>

            <button
              type="button"
              onClick={logoutAdmin}
              className="px-4 py-2 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800 rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout Admin Session</span>
            </button>
          </div>

          {/* Feedback Messages */}
          {profileSuccessMsg && (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-500/30 rounded-2xl text-xs text-emerald-800 dark:text-emerald-300 font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
              <span>{profileSuccessMsg}</span>
            </div>
          )}

          {profileErrorMsg && (
            <div className="p-4 bg-rose-50 dark:bg-rose-950/60 border border-rose-500/30 rounded-2xl text-xs text-rose-700 dark:text-rose-300 font-semibold flex items-center gap-2">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
              <span>{profileErrorMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Card 1: Admin Contact Details (Phone & Email) */}
            <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                    Administrator Contact Profile
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Change admin phone number and registered admin email
                  </p>
                </div>
              </div>

              <form onSubmit={handleUpdateAdminContact} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Admin Mobile / Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="tel"
                      value={profilePhoneInput}
                      onChange={(e) => setProfilePhoneInput(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                      required
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-1">
                    Current saved phone: <strong>{adminPhone}</strong>
                  </span>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Registered Admin Gmail / Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      value={profileEmailInput}
                      onChange={(e) => setProfileEmailInput(e.target.value)}
                      placeholder="admin@uptoselection.in"
                      className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                      required
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-1">
                    Current authorized Gmail: <strong>{adminGmail}</strong>
                  </span>
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs shadow-md shadow-blue-600/20 flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>Update Phone & Email</span>
                </button>
              </form>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-700 text-xs space-y-1.5 text-slate-500">
                <div className="flex justify-between">
                  <span>Authorization:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">Master Owner</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">Active Session</span>
                </div>
              </div>
            </div>

            {/* Card 2: Change Administrator Password */}
            <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                    Change Administrator Password
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Verify current password to set a new admin password
                  </p>
                </div>
              </div>

              <form onSubmit={handleChangeAdminPassword} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Current Admin Password
                  </label>
                  <div className="relative">
                    <Key className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type={showCurrentPass ? 'text' : 'password'}
                      value={currentPassInput}
                      onChange={(e) => setCurrentPassInput(e.target.value)}
                      placeholder="Enter current password..."
                      className="w-full pl-9 pr-10 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPass(prev => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                    >
                      {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-1">
                    Initial default password is: <code>upto@2026</code>
                  </span>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type={showNewPass ? 'text' : 'password'}
                      value={newPassInput}
                      onChange={(e) => setNewPassInput(e.target.value)}
                      placeholder="Enter at least 5 characters..."
                      className="w-full pl-9 pr-10 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPass(prev => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                    >
                      {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type={showNewPass ? 'text' : 'password'}
                      value={confirmNewPassInput}
                      onChange={(e) => setConfirmNewPassInput(e.target.value)}
                      placeholder="Re-enter new password..."
                      className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
                >
                  <Key className="w-4 h-4" />
                  <span>Update Admin Password</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
