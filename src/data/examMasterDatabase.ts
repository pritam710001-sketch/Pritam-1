import { AdminExam, ExamNotificationTimeline } from '../types';

export interface MasterExamEntry {
  idNum: string;
  name: string;
  stateOrCoverage: string;
  scope: 'Central' | 'State' | 'None';
  category: string;
  stateName?: string;
  qualification: string;
  expectedApplicants: string;
  vacancy2026: string;
  examDate: string;
  applicationStatus: string;
  month: string;
  department: string;
  applyLink: string;
  description: string;
  cutoffUR: number;
  cutoffOBC: number;
  cutoffSCST: number;
  cutoffEWS: number;
}

export const MASTER_EXAM_ENTRIES: MasterExamEntry[] = [
  {
    idNum: '001',
    name: 'SSC CGL 2026',
    stateOrCoverage: 'All India',
    scope: 'Central',
    category: 'SSC',
    qualification: 'Graduate',
    expectedApplicants: '~28.5L',
    vacancy2026: '12,256',
    examDate: '30 Sep–30 Oct',
    applicationStatus: 'Closed',
    month: 'Sep–Oct',
    department: 'Staff Selection Commission (SSC)',
    applyLink: 'https://ssc.gov.in',
    description: 'Staff Selection Commission Combined Graduate Level Examination for Group B & C central ministries posts.',
    cutoffUR: 135,
    cutoffOBC: 128,
    cutoffSCST: 115,
    cutoffEWS: 124
  },
  {
    idNum: '002',
    name: 'SSC MTS & Havaldar',
    stateOrCoverage: 'All India',
    scope: 'Central',
    category: 'SSC',
    qualification: '10th Pass',
    expectedApplicants: '~30–36L',
    vacancy2026: '8,326 (TBD)',
    examDate: 'Sep–Nov',
    applicationStatus: 'Closed',
    month: 'Sep–Nov',
    department: 'Staff Selection Commission (SSC)',
    applyLink: 'https://ssc.gov.in',
    description: 'Multi Tasking (Non-Technical) Staff, and Havaldar (CBIC & CBN) Examination across India.',
    cutoffUR: 125,
    cutoffOBC: 120,
    cutoffSCST: 108,
    cutoffEWS: 118
  },
  {
    idNum: '003',
    name: 'SSC CPO',
    stateOrCoverage: 'All India',
    scope: 'Central',
    category: 'SSC',
    qualification: 'Graduate',
    expectedApplicants: '~7–10L',
    vacancy2026: '2,018',
    examDate: 'Oct–Nov',
    applicationStatus: 'Closed',
    month: 'Oct–Nov',
    department: 'Staff Selection Commission (SSC)',
    applyLink: 'https://ssc.gov.in',
    description: 'Sub-Inspector in Delhi Police and Central Armed Police Forces (CAPFs) Examination.',
    cutoffUR: 115,
    cutoffOBC: 108,
    cutoffSCST: 92,
    cutoffEWS: 105
  },
  {
    idNum: '004',
    name: 'SSC CHSL',
    stateOrCoverage: 'All India',
    scope: 'Central',
    category: 'SSC',
    qualification: '12th Pass',
    expectedApplicants: '~25–32L',
    vacancy2026: '2,536',
    examDate: 'Dec*',
    applicationStatus: 'Closed',
    month: 'Dec',
    department: 'Staff Selection Commission (SSC)',
    applyLink: 'https://ssc.gov.in',
    description: 'Combined Higher Secondary (10+2) Level Examination for LDC, JSA and Data Entry Operators.',
    cutoffUR: 145,
    cutoffOBC: 140,
    cutoffSCST: 125,
    cutoffEWS: 136
  },
  {
    idNum: '005',
    name: 'SSC Selection Post XIV',
    stateOrCoverage: 'All India',
    scope: 'Central',
    category: 'SSC',
    qualification: '10th/12th/Graduate',
    expectedApplicants: '~10L+',
    vacancy2026: 'Post-wise (2,049)',
    examDate: '16–26 Sep',
    applicationStatus: 'Closed',
    month: 'Sep',
    department: 'Staff Selection Commission (SSC)',
    applyLink: 'https://ssc.gov.in',
    description: 'Phase Selection Posts across central government departments for Matric, Inter and Graduate levels.',
    cutoffUR: 130,
    cutoffOBC: 124,
    cutoffSCST: 110,
    cutoffEWS: 120
  },
  {
    idNum: '006',
    name: 'SBI PO',
    stateOrCoverage: 'All India',
    scope: 'Central',
    category: 'Banking',
    qualification: 'Graduate',
    expectedApplicants: '~10–12L',
    vacancy2026: '1,500',
    examDate: '2026 cycle',
    applicationStatus: 'Closed',
    month: '2026',
    department: 'State Bank of India (SBI)',
    applyLink: 'https://sbi.co.in/careers',
    description: 'Probationary Officers recruitment in State Bank of India premier public sector bank.',
    cutoffUR: 59,
    cutoffOBC: 56,
    cutoffSCST: 48,
    cutoffEWS: 55
  },
  {
    idNum: '007',
    name: 'SBI Clerk/JA',
    stateOrCoverage: 'All India',
    scope: 'Central',
    category: 'Banking',
    qualification: 'Graduate',
    expectedApplicants: '~9–12L',
    vacancy2026: '1,538',
    examDate: 'Sep',
    applicationStatus: 'Closed',
    month: 'Sep',
    department: 'State Bank of India (SBI)',
    applyLink: 'https://sbi.co.in/careers',
    description: 'Junior Associates (Customer Support & Sales) recruitment in State Bank of India.',
    cutoffUR: 72,
    cutoffOBC: 69,
    cutoffSCST: 60,
    cutoffEWS: 67
  },
  {
    idNum: '008',
    name: 'IBPS PO',
    stateOrCoverage: 'All India',
    scope: 'Central',
    category: 'Banking',
    qualification: 'Graduate',
    expectedApplicants: '~7–10L',
    vacancy2026: '4,455 (TBD)',
    examDate: '4 Oct – Mains',
    applicationStatus: 'Closed',
    month: 'Oct',
    department: 'Institute of Banking Personnel Selection',
    applyLink: 'https://ibps.in',
    description: 'Probationary Officers and Management Trainees recruitment across public sector banks.',
    cutoffUR: 58,
    cutoffOBC: 55,
    cutoffSCST: 48,
    cutoffEWS: 54
  },
  {
    idNum: '009',
    name: 'IBPS Clerk/CSA',
    stateOrCoverage: 'All India',
    scope: 'Central',
    category: 'Banking',
    qualification: 'Graduate',
    expectedApplicants: '~8–12L',
    vacancy2026: '11,403',
    examDate: '10–11 Oct',
    applicationStatus: 'Closed',
    month: 'Oct',
    department: 'Institute of Banking Personnel Selection',
    applyLink: 'https://ibps.in',
    description: 'Customer Service Associates and Clerical cadre recruitment across 11 nationalized banks.',
    cutoffUR: 78,
    cutoffOBC: 74,
    cutoffSCST: 65,
    cutoffEWS: 72
  },
  {
    idNum: '010',
    name: 'IBPS SO',
    stateOrCoverage: 'All India',
    scope: 'Central',
    category: 'Banking',
    qualification: 'Graduate + specialist',
    expectedApplicants: '~1–3L',
    vacancy2026: '1,402 (TBD)',
    examDate: '1 Nov – Mains',
    applicationStatus: 'Closed',
    month: 'Nov',
    department: 'Institute of Banking Personnel Selection',
    applyLink: 'https://ibps.in',
    description: 'Specialist Officers (IT, Agricultural, Rajbhasha, Law, HR, Marketing) in Participating Banks.',
    cutoffUR: 65,
    cutoffOBC: 60,
    cutoffSCST: 52,
    cutoffEWS: 58
  },
  {
    idNum: '011',
    name: 'IBPS RRB PO',
    stateOrCoverage: 'All India',
    scope: 'Central',
    category: 'Banking',
    qualification: 'Graduate',
    expectedApplicants: '~5–8L',
    vacancy2026: '4,256',
    examDate: '21–22 Nov',
    applicationStatus: 'Open till 21 Sep',
    month: 'Nov',
    department: 'Institute of Banking Personnel Selection',
    applyLink: 'https://ibps.in',
    description: 'Officers Scale I, II, and III recruitment in Regional Rural Banks across India.',
    cutoffUR: 54,
    cutoffOBC: 51,
    cutoffSCST: 43,
    cutoffEWS: 50
  },
  {
    idNum: '012',
    name: 'IBPS RRB Clerk',
    stateOrCoverage: 'All India',
    scope: 'Central',
    category: 'Banking',
    qualification: 'Graduate',
    expectedApplicants: '~8–12L',
    vacancy2026: '5,585 (TBD)',
    examDate: '6, 12, 13 Dec',
    applicationStatus: 'Open till 21 Sep',
    month: 'Dec',
    department: 'Institute of Banking Personnel Selection',
    applyLink: 'https://ibps.in',
    description: 'Office Assistants (Multipurpose) recruitment in 43 Regional Rural Banks across India.',
    cutoffUR: 75,
    cutoffOBC: 71,
    cutoffSCST: 62,
    cutoffEWS: 70
  },
  {
    idNum: '013',
    name: 'RRB NTPC Graduate',
    stateOrCoverage: 'All India',
    scope: 'Central',
    category: 'Railways',
    qualification: 'Graduate',
    expectedApplicants: '25.9L',
    vacancy2026: '8,113',
    examDate: '2026 stage',
    applicationStatus: 'Closed',
    month: '2026',
    department: 'Railway Recruitment Boards',
    applyLink: 'https://rrbapply.gov.in',
    description: 'Non-Technical Popular Categories Graduate level posts (Station Master, Goods Train Manager).',
    cutoffUR: 74,
    cutoffOBC: 70,
    cutoffSCST: 61,
    cutoffEWS: 67
  },
  {
    idNum: '014',
    name: 'RRB NTPC UG',
    stateOrCoverage: 'All India',
    scope: 'Central',
    category: 'Railways',
    qualification: '12th Pass',
    expectedApplicants: '~25L',
    vacancy2026: '3,445',
    examDate: '2026 stage',
    applicationStatus: 'Closed',
    month: '2026',
    department: 'Railway Recruitment Boards',
    applyLink: 'https://rrbapply.gov.in',
    description: 'Undergraduate Level NTPC posts (Junior Clerk cum Typist, Accounts Clerk cum Typist, Trains Clerk).',
    cutoffUR: 80,
    cutoffOBC: 76,
    cutoffSCST: 68,
    cutoffEWS: 74
  },
  {
    idNum: '015',
    name: 'BPSC 72nd CCE',
    stateOrCoverage: 'Bihar',
    scope: 'State',
    category: 'State PSC',
    stateName: 'Bihar',
    qualification: 'Graduate',
    expectedApplicants: '~5–7L',
    vacancy2026: '1,189',
    examDate: '25 Oct',
    applicationStatus: 'Closed',
    month: 'Oct',
    department: 'Bihar Public Service Commission',
    applyLink: 'https://bpsc.bih.nic.in',
    description: 'Bihar Combined Competitive Examination for Deputy Collector, DSP, and Block Officers.',
    cutoffUR: 91,
    cutoffOBC: 86,
    cutoffSCST: 75,
    cutoffEWS: 84
  },
  {
    idNum: '016',
    name: 'BPSC Project Manager',
    stateOrCoverage: 'Bihar',
    scope: 'State',
    category: 'State PSC',
    stateName: 'Bihar',
    qualification: 'Graduate',
    expectedApplicants: '~1–2L',
    vacancy2026: '9',
    examDate: '4 Oct',
    applicationStatus: 'Closed',
    month: 'Oct',
    department: 'Bihar Public Service Commission',
    applyLink: 'https://bpsc.bih.nic.in',
    description: 'Project Manager recruitment in District Industry Centres under Department of Industries, Bihar.',
    cutoffUR: 85,
    cutoffOBC: 80,
    cutoffSCST: 72,
    cutoffEWS: 79
  },
  {
    idNum: '017',
    name: 'BPSC ACF',
    stateOrCoverage: 'Bihar',
    scope: 'State',
    category: 'State PSC',
    stateName: 'Bihar',
    qualification: 'Graduate in Science/Eng',
    expectedApplicants: '~20–50K',
    vacancy2026: '12',
    examDate: '25–30 Nov',
    applicationStatus: 'Closed',
    month: 'Nov',
    department: 'Bihar Public Service Commission',
    applyLink: 'https://bpsc.bih.nic.in',
    description: 'Assistant Conservator of Forests in Environment, Forest and Climate Change Department, Bihar.',
    cutoffUR: 120,
    cutoffOBC: 114,
    cutoffSCST: 98,
    cutoffEWS: 110
  },
  {
    idNum: '018',
    name: 'WBCS',
    stateOrCoverage: 'West Bengal',
    scope: 'State',
    category: 'State PSC',
    stateName: 'West Bengal',
    qualification: 'Graduate',
    expectedApplicants: '~2–3L',
    vacancy2026: '800 (TBD)',
    examDate: 'TBD',
    applicationStatus: 'Check WBPSC',
    month: 'TBD',
    department: 'West Bengal Public Service Commission',
    applyLink: 'https://psc.wb.gov.in',
    description: 'West Bengal Civil Service (Executive) & Allied Services Examination (Group A, B, C, D).',
    cutoffUR: 130,
    cutoffOBC: 122,
    cutoffSCST: 112,
    cutoffEWS: 118
  },
  {
    idNum: '019',
    name: 'WBPSC Miscellaneous',
    stateOrCoverage: 'West Bengal',
    scope: 'State',
    category: 'State PSC',
    stateName: 'West Bengal',
    qualification: 'Graduate',
    expectedApplicants: '~1–2L',
    vacancy2026: '1,200 (TBD)',
    examDate: 'TBD',
    applicationStatus: 'Check WBPSC',
    month: 'TBD',
    department: 'West Bengal Public Service Commission',
    applyLink: 'https://psc.wb.gov.in',
    description: 'Miscellaneous Services Recruitment Examination for Assistant Programme Officers and Inspectors.',
    cutoffUR: 98,
    cutoffOBC: 92,
    cutoffSCST: 80,
    cutoffEWS: 88
  },
  {
    idNum: '020',
    name: 'WBPSC Clerkship',
    stateOrCoverage: 'West Bengal',
    scope: 'State',
    category: 'State PSC',
    stateName: 'West Bengal',
    qualification: '12th Pass / Madhyamik',
    expectedApplicants: '~5–10L',
    vacancy2026: '6,400 (TBD)',
    examDate: '26 Oct (TBD)',
    applicationStatus: 'Check WBPSC',
    month: 'Oct',
    department: 'West Bengal Public Service Commission',
    applyLink: 'https://psc.wb.gov.in',
    description: 'Clerkship Examination for Lower Division Assistants in State Secretariat and District Offices.',
    cutoffUR: 65,
    cutoffOBC: 60,
    cutoffSCST: 52,
    cutoffEWS: 58
  },
  {
    idNum: '021',
    name: 'WB Police Constable',
    stateOrCoverage: 'West Bengal',
    scope: 'State',
    category: 'Police',
    stateName: 'West Bengal',
    qualification: '10th/12th Pass',
    expectedApplicants: '~5–10L',
    vacancy2026: '10,255 (TBD)',
    examDate: 'TBD',
    applicationStatus: 'Recruitment-specific',
    month: 'TBD',
    department: 'West Bengal Police Recruitment Board',
    applyLink: 'https://prb.wb.gov.in',
    description: 'Constables and Lady Constables in West Bengal Police recruitment.',
    cutoffUR: 55,
    cutoffOBC: 50,
    cutoffSCST: 42,
    cutoffEWS: 48
  },
  {
    idNum: '022',
    name: 'WB Police SI',
    stateOrCoverage: 'West Bengal',
    scope: 'State',
    category: 'Police',
    stateName: 'West Bengal',
    qualification: 'Graduate',
    expectedApplicants: '~1–3L',
    vacancy2026: '1,131 (TBD)',
    examDate: 'TBD',
    applicationStatus: 'Recruitment-specific',
    month: 'TBD',
    department: 'West Bengal Police Recruitment Board',
    applyLink: 'https://prb.wb.gov.in',
    description: 'Sub-Inspector / Sub-Inspectress (UB & AB) in West Bengal Police.',
    cutoffUR: 122,
    cutoffOBC: 115,
    cutoffSCST: 102,
    cutoffEWS: 110
  },
  {
    idNum: '023',
    name: 'UPPSC PCS',
    stateOrCoverage: 'Uttar Pradesh',
    scope: 'State',
    category: 'State PSC',
    stateName: 'Uttar Pradesh',
    qualification: 'Graduate',
    expectedApplicants: '~5–7L',
    vacancy2026: '220 (TBD)',
    examDate: 'TBD',
    applicationStatus: 'Check UPPSC',
    month: 'TBD',
    department: 'Uttar Pradesh Public Service Commission',
    applyLink: 'https://uppsc.up.nic.in',
    description: 'Combined State / Upper Subordinate Services (PCS) Examination for SDM and DSP posts.',
    cutoffUR: 126,
    cutoffOBC: 122,
    cutoffSCST: 108,
    cutoffEWS: 120
  },
  {
    idNum: '024',
    name: 'UPPSC RO/ARO',
    stateOrCoverage: 'Uttar Pradesh',
    scope: 'State',
    category: 'State PSC',
    stateName: 'Uttar Pradesh',
    qualification: 'Graduate',
    expectedApplicants: '~5–10L',
    vacancy2026: '411 (TBD)',
    examDate: 'TBD',
    applicationStatus: 'Check UPPSC',
    month: 'TBD',
    department: 'Uttar Pradesh Public Service Commission',
    applyLink: 'https://uppsc.up.nic.in',
    description: 'Review Officer (Samiksha Adhikari) and Assistant Review Officer examination.',
    cutoffUR: 125,
    cutoffOBC: 120,
    cutoffSCST: 108,
    cutoffEWS: 118
  },
  {
    idNum: '025',
    name: 'UPSSSC PET',
    stateOrCoverage: 'Uttar Pradesh',
    scope: 'State',
    category: 'State PSC',
    stateName: 'Uttar Pradesh',
    qualification: '10th/12th Pass',
    expectedApplicants: '~20L+',
    vacancy2026: 'Qualifying',
    examDate: 'TBD',
    applicationStatus: 'Recruitment-specific',
    month: 'TBD',
    department: 'Uttar Pradesh Subordinate Services Selection Commission',
    applyLink: 'https://upsssc.gov.in',
    description: 'Preliminary Eligibility Test (PET) for Group C subordinate recruitment.',
    cutoffUR: 62,
    cutoffOBC: 58,
    cutoffSCST: 49,
    cutoffEWS: 56
  },
  {
    idNum: '026',
    name: 'UP Police',
    stateOrCoverage: 'Uttar Pradesh',
    scope: 'State',
    category: 'Police',
    stateName: 'Uttar Pradesh',
    qualification: '12th/Graduate',
    expectedApplicants: '~10L+',
    vacancy2026: '60,244 (TBD)',
    examDate: 'TBD',
    applicationStatus: 'Recruitment-specific',
    month: 'TBD',
    department: 'UP Police Recruitment & Promotion Board',
    applyLink: 'https://uppbpb.gov.in',
    description: 'Direct Recruitment for Constable Civil Police and Provincial Armed Constabulary.',
    cutoffUR: 215,
    cutoffOBC: 202,
    cutoffSCST: 178,
    cutoffEWS: 195
  },
  {
    idNum: '027',
    name: 'RAS',
    stateOrCoverage: 'Rajasthan',
    scope: 'State',
    category: 'State PSC',
    stateName: 'Rajasthan',
    qualification: 'Graduate',
    expectedApplicants: '~5–7L',
    vacancy2026: '905 (TBD)',
    examDate: 'TBD',
    applicationStatus: 'Check RPSC',
    month: 'TBD',
    department: 'Rajasthan Public Service Commission',
    applyLink: 'https://rpsc.rajasthan.gov.in',
    description: 'Rajasthan Administrative Services & Subordinate Services Combined Competitive Exam.',
    cutoffUR: 100,
    cutoffOBC: 97,
    cutoffSCST: 85,
    cutoffEWS: 95
  },
  {
    idNum: '028',
    name: 'RSSB CET',
    stateOrCoverage: 'Rajasthan',
    scope: 'State',
    category: 'State PSC',
    stateName: 'Rajasthan',
    qualification: '12th/Graduate',
    expectedApplicants: '~10L+',
    vacancy2026: 'Qualifying',
    examDate: 'TBD',
    applicationStatus: 'Recruitment-specific',
    month: 'TBD',
    department: 'Rajasthan Staff Selection Board',
    applyLink: 'https://rsmssb.rajasthan.gov.in',
    description: 'Common Eligibility Test (Graduate & Senior Secondary Level) in Rajasthan.',
    cutoffUR: 155,
    cutoffOBC: 148,
    cutoffSCST: 132,
    cutoffEWS: 142
  },
  {
    idNum: '029',
    name: 'MPPSC State Service',
    stateOrCoverage: 'Madhya Pradesh',
    scope: 'State',
    category: 'State PSC',
    stateName: 'Madhya Pradesh',
    qualification: 'Graduate',
    expectedApplicants: '~3–5L',
    vacancy2026: '110 (TBD)',
    examDate: 'TBD',
    applicationStatus: 'Check MPPSC',
    month: 'TBD',
    department: 'Madhya Pradesh Public Service Commission',
    applyLink: 'https://mppsc.mp.gov.in',
    description: 'State Services Examination for Deputy Collector, DSP and Chief Municipal Officer.',
    cutoffUR: 156,
    cutoffOBC: 150,
    cutoffSCST: 138,
    cutoffEWS: 148
  },
  {
    idNum: '030',
    name: 'MPESB Group Exams',
    stateOrCoverage: 'Madhya Pradesh',
    scope: 'State',
    category: 'State PSC',
    stateName: 'Madhya Pradesh',
    qualification: '10th/12th/Graduate',
    expectedApplicants: '~5–10L combined',
    vacancy2026: 'Various (4,500+)',
    examDate: 'Various',
    applicationStatus: 'Recruitment-specific',
    month: 'Various',
    department: 'MP Employees Selection Board',
    applyLink: 'https://esb.mp.gov.in',
    description: 'Group 1, 2, 3, 4, 5 Combined Recruitment tests for Patwari, Forest Guard, and Jail Prahari.',
    cutoffUR: 135,
    cutoffOBC: 128,
    cutoffSCST: 114,
    cutoffEWS: 122
  },
  {
    idNum: '031',
    name: 'MPSC State Services',
    stateOrCoverage: 'Maharashtra',
    scope: 'State',
    category: 'State PSC',
    stateName: 'Maharashtra',
    qualification: 'Graduate',
    expectedApplicants: '~3–5L',
    vacancy2026: '274 (TBD)',
    examDate: 'TBD',
    applicationStatus: 'Check MPSC',
    month: 'TBD',
    department: 'Maharashtra Public Service Commission',
    applyLink: 'https://mpsc.gov.in',
    description: 'Maharashtra Civil Services Gazetted Combined Preliminary Examination.',
    cutoffUR: 110,
    cutoffOBC: 104,
    cutoffSCST: 92,
    cutoffEWS: 102
  },
  {
    idNum: '032',
    name: 'TNPSC Group I',
    stateOrCoverage: 'Tamil Nadu',
    scope: 'State',
    category: 'State PSC',
    stateName: 'Tamil Nadu',
    qualification: 'Graduate',
    expectedApplicants: '~1–3L',
    vacancy2026: '90 (TBD)',
    examDate: 'TBD',
    applicationStatus: 'Check TNPSC',
    month: 'TBD',
    department: 'Tamil Nadu Public Service Commission',
    applyLink: 'https://tnpsc.gov.in',
    description: 'Group I Services Combined Civil Services Examination for Deputy Collector and DSP.',
    cutoffUR: 135,
    cutoffOBC: 130,
    cutoffSCST: 118,
    cutoffEWS: 125
  },
  {
    idNum: '033',
    name: 'TNPSC Group II/IIA',
    stateOrCoverage: 'Tamil Nadu',
    scope: 'State',
    category: 'State PSC',
    stateName: 'Tamil Nadu',
    qualification: 'Graduate',
    expectedApplicants: '~5–10L',
    vacancy2026: '2,327 (TBD)',
    examDate: 'TBD',
    applicationStatus: 'Check TNPSC',
    month: 'TBD',
    department: 'Tamil Nadu Public Service Commission',
    applyLink: 'https://tnpsc.gov.in',
    description: 'Combined Civil Services Examination-II (Interview & Non-Interview Posts).',
    cutoffUR: 160,
    cutoffOBC: 154,
    cutoffSCST: 140,
    cutoffEWS: 148
  },
  {
    idNum: '034',
    name: 'TNPSC Group IV',
    stateOrCoverage: 'Tamil Nadu',
    scope: 'State',
    category: 'State PSC',
    stateName: 'Tamil Nadu',
    qualification: '10th/12th Pass',
    expectedApplicants: '~10–20L',
    vacancy2026: '6,244 (TBD)',
    examDate: 'Various',
    applicationStatus: 'Recruitment-specific',
    month: 'Various',
    department: 'Tamil Nadu Public Service Commission',
    applyLink: 'https://tnpsc.gov.in',
    description: 'Village Administrative Officer (VAO), Junior Assistant, Bill Collector and Typist posts.',
    cutoffUR: 165,
    cutoffOBC: 160,
    cutoffSCST: 148,
    cutoffEWS: 155
  },
  {
    idNum: '035',
    name: 'KPSC KAS',
    stateOrCoverage: 'Karnataka',
    scope: 'State',
    category: 'State PSC',
    stateName: 'Karnataka',
    qualification: 'Graduate',
    expectedApplicants: '~1–3L',
    vacancy2026: '384 (TBD)',
    examDate: 'TBD',
    applicationStatus: 'Check KPSC',
    month: 'TBD',
    department: 'Karnataka Public Service Commission',
    applyLink: 'https://kpsc.kar.nic.in',
    description: 'Karnataka Administrative Services (Gazetted Probationers) Group A and B Examination.',
    cutoffUR: 122,
    cutoffOBC: 116,
    cutoffSCST: 104,
    cutoffEWS: 112
  },
  {
    idNum: '036',
    name: 'KPSC PDO/FDA/SDA',
    stateOrCoverage: 'Karnataka',
    scope: 'State',
    category: 'State PSC',
    stateName: 'Karnataka',
    qualification: '12th/Graduate',
    expectedApplicants: '~3–8L',
    vacancy2026: '2,100 (TBD)',
    examDate: 'Various',
    applicationStatus: 'Recruitment-specific',
    month: 'Various',
    department: 'Karnataka Public Service Commission',
    applyLink: 'https://kpsc.kar.nic.in',
    description: 'Panchayat Development Officer, First Division Assistant, and Second Division Assistant.',
    cutoffUR: 78,
    cutoffOBC: 72,
    cutoffSCST: 62,
    cutoffEWS: 68
  },
  {
    idNum: '037',
    name: 'GPSC',
    stateOrCoverage: 'Gujarat',
    scope: 'State',
    category: 'State PSC',
    stateName: 'Gujarat',
    qualification: 'Graduate',
    expectedApplicants: '~1–3L',
    vacancy2026: '185 (TBD)',
    examDate: 'Various',
    applicationStatus: 'Check GPSC',
    month: 'Various',
    department: 'Gujarat Public Service Commission',
    applyLink: 'https://gpsc.gujarat.gov.in',
    description: 'Gujarat Administrative Service Class-1 and Gujarat Civil Services Class-1 & Class-2.',
    cutoffUR: 120,
    cutoffOBC: 115,
    cutoffSCST: 102,
    cutoffEWS: 112
  },
  {
    idNum: '038',
    name: 'GSSSB/Talati',
    stateOrCoverage: 'Gujarat',
    scope: 'State',
    category: 'State PSC',
    stateName: 'Gujarat',
    qualification: '10th/12th/Graduate',
    expectedApplicants: '~5–10L',
    vacancy2026: '3,437 (TBD)',
    examDate: 'Various',
    applicationStatus: 'Recruitment-specific',
    month: 'Various',
    department: 'Gujarat Subordinate Service Selection Board',
    applyLink: 'https://gsssb.gujarat.gov.in',
    description: 'Talati cum Mantri, Junior Clerk, and Senior Clerk examinations.',
    cutoffUR: 72,
    cutoffOBC: 67,
    cutoffSCST: 58,
    cutoffEWS: 65
  },
  {
    idNum: '039',
    name: 'APPSC Group I',
    stateOrCoverage: 'Andhra Pradesh',
    scope: 'State',
    category: 'State PSC',
    stateName: 'Andhra Pradesh',
    qualification: 'Graduate',
    expectedApplicants: '~1–3L',
    vacancy2026: '81 (TBD)',
    examDate: 'TBD',
    applicationStatus: 'Check APPSC',
    month: 'TBD',
    department: 'Andhra Pradesh Public Service Commission',
    applyLink: 'https://psc.ap.gov.in',
    description: 'Deputy Collectors, Commercial Tax Officers and DSP recruitment in Andhra Pradesh.',
    cutoffUR: 88,
    cutoffOBC: 82,
    cutoffSCST: 71,
    cutoffEWS: 79
  },
  {
    idNum: '040',
    name: 'APPSC Group II',
    stateOrCoverage: 'Andhra Pradesh',
    scope: 'State',
    category: 'State PSC',
    stateName: 'Andhra Pradesh',
    qualification: 'Graduate',
    expectedApplicants: '~2–5L',
    vacancy2026: '897 (TBD)',
    examDate: 'Various',
    applicationStatus: 'Recruitment-specific',
    month: 'Various',
    department: 'Andhra Pradesh Public Service Commission',
    applyLink: 'https://psc.ap.gov.in',
    description: 'Executive & Non-Executive posts: Municipal Commissioner, Sub-Registrar, and ACTO.',
    cutoffUR: 94,
    cutoffOBC: 89,
    cutoffSCST: 78,
    cutoffEWS: 86
  },
  {
    idNum: '041',
    name: 'TGPSC Group I',
    stateOrCoverage: 'Telangana',
    scope: 'State',
    category: 'State PSC',
    stateName: 'Telangana',
    qualification: 'Graduate',
    expectedApplicants: '~1–3L',
    vacancy2026: '563 (TBD)',
    examDate: 'TBD',
    applicationStatus: 'Check TGPSC',
    month: 'TBD',
    department: 'Telangana Public Service Commission',
    applyLink: 'https://tspsc.gov.in',
    description: 'Deputy Collector, DSP, Commercial Tax Officer, and RDO posts in Telangana State.',
    cutoffUR: 95,
    cutoffOBC: 90,
    cutoffSCST: 80,
    cutoffEWS: 88
  },
  {
    idNum: '042',
    name: 'TGPSC Group II/III/IV',
    stateOrCoverage: 'Telangana',
    scope: 'State',
    category: 'State PSC',
    stateName: 'Telangana',
    qualification: '10th/12th/Graduate',
    expectedApplicants: '~5–10L combined',
    vacancy2026: 'Various (9,168+)',
    examDate: 'Various',
    applicationStatus: 'Recruitment-specific',
    month: 'Various',
    department: 'Telangana Public Service Commission',
    applyLink: 'https://tspsc.gov.in',
    description: 'Municipal Commissioner, Prohibition & Excise Sub Inspector, and Junior Assistant cadres.',
    cutoffUR: 110,
    cutoffOBC: 104,
    cutoffSCST: 92,
    cutoffEWS: 101
  },
  {
    idNum: '043',
    name: 'OPSC OAS',
    stateOrCoverage: 'Odisha',
    scope: 'State',
    category: 'State PSC',
    stateName: 'Odisha',
    qualification: 'Graduate',
    expectedApplicants: '~1–2L',
    vacancy2026: '399 (TBD)',
    examDate: 'TBD',
    applicationStatus: 'Check OPSC',
    month: 'TBD',
    department: 'Odisha Public Service Commission',
    applyLink: 'https://opsc.gov.in',
    description: 'Odisha Civil Services (OAS, OPS, OFS) Examination for Class I & II state administrative posts.',
    cutoffUR: 120,
    cutoffOBC: 114,
    cutoffSCST: 98,
    cutoffEWS: 108
  },
  {
    idNum: '044',
    name: 'OSSC/OSSSC',
    stateOrCoverage: 'Odisha',
    scope: 'State',
    category: 'State PSC',
    stateName: 'Odisha',
    qualification: '10th/12th/Graduate',
    expectedApplicants: '~3–8L',
    vacancy2026: 'Various (3,850+)',
    examDate: 'Various',
    applicationStatus: 'Recruitment-specific',
    month: 'Various',
    department: 'Odisha Subordinate Staff Selection Commission',
    applyLink: 'https://osssc.gov.in',
    description: 'Combined Recruitment Examination for Revenue Inspector (RI), ARI, Amin, and Forest Guard.',
    cutoffUR: 130,
    cutoffOBC: 124,
    cutoffSCST: 110,
    cutoffEWS: 120
  },
  {
    idNum: '045',
    name: 'JPSC CCE',
    stateOrCoverage: 'Jharkhand',
    scope: 'State',
    category: 'State PSC',
    stateName: 'Jharkhand',
    qualification: 'Graduate',
    expectedApplicants: '~1–3L',
    vacancy2026: '342 (TBD)',
    examDate: 'TBD',
    applicationStatus: 'Check JPSC',
    month: 'TBD',
    department: 'Jharkhand Public Service Commission',
    applyLink: 'https://jpsc.gov.in',
    description: 'Combined Civil Services Examination for Jharkhand Administrative & Police Service.',
    cutoffUR: 236,
    cutoffOBC: 228,
    cutoffSCST: 210,
    cutoffEWS: 220
  },
  {
    idNum: '046',
    name: 'JSSC CGL',
    stateOrCoverage: 'Jharkhand',
    scope: 'State',
    category: 'State PSC',
    stateName: 'Jharkhand',
    qualification: 'Graduate',
    expectedApplicants: '~3–5L',
    vacancy2026: '2,017 (TBD)',
    examDate: 'TBD',
    applicationStatus: 'Recruitment-specific',
    month: 'TBD',
    department: 'Jharkhand Staff Selection Commission',
    applyLink: 'https://jssc.nic.in',
    description: 'Jharkhand General Graduate Level Combined Competitive Examination (JGGLCCE).',
    cutoffUR: 320,
    cutoffOBC: 308,
    cutoffSCST: 280,
    cutoffEWS: 298
  },
  {
    idNum: '047',
    name: 'CGPSC State Service',
    stateOrCoverage: 'Chhattisgarh',
    scope: 'State',
    category: 'State PSC',
    stateName: 'Chhattisgarh',
    qualification: 'Graduate',
    expectedApplicants: '~1–2L',
    vacancy2026: '242 (TBD)',
    examDate: 'TBD',
    applicationStatus: 'Check CGPSC',
    month: 'TBD',
    department: 'Chhattisgarh Public Service Commission',
    applyLink: 'https://psc.cg.gov.in',
    description: 'State Service Examination for Deputy Collector, DSP, and State Tax Assistant Commissioner.',
    cutoffUR: 130,
    cutoffOBC: 124,
    cutoffSCST: 112,
    cutoffEWS: 120
  },
  {
    idNum: '048',
    name: 'PPSC',
    stateOrCoverage: 'Punjab',
    scope: 'State',
    category: 'State PSC',
    stateName: 'Punjab',
    qualification: 'Graduate',
    expectedApplicants: '~1–3L',
    vacancy2026: '310 (TBD)',
    examDate: 'Various',
    applicationStatus: 'Recruitment-specific',
    month: 'Various',
    department: 'Punjab Public Service Commission',
    applyLink: 'https://ppsc.gov.in',
    description: 'Punjab State Civil Services Combined Competitive Examination.',
    cutoffUR: 280,
    cutoffOBC: 268,
    cutoffSCST: 245,
    cutoffEWS: 260
  },
  {
    idNum: '049',
    name: 'HPSC HCS',
    stateOrCoverage: 'Haryana',
    scope: 'State',
    category: 'State PSC',
    stateName: 'Haryana',
    qualification: 'Graduate',
    expectedApplicants: '~2–4L',
    vacancy2026: '121 (TBD)',
    examDate: 'TBD',
    applicationStatus: 'Check HPSC',
    month: 'TBD',
    department: 'Haryana Public Service Commission',
    applyLink: 'https://hpsc.gov.in',
    description: 'Haryana Civil Services (Executive Branch) and other Allied Services examination.',
    cutoffUR: 68,
    cutoffOBC: 64,
    cutoffSCST: 55,
    cutoffEWS: 63
  },
  {
    idNum: '050',
    name: 'HSSC CET',
    stateOrCoverage: 'Haryana',
    scope: 'State',
    category: 'State PSC',
    stateName: 'Haryana',
    qualification: '10th/12th/Graduate',
    expectedApplicants: '~10L+',
    vacancy2026: 'Qualifying (13,536)',
    examDate: 'TBD',
    applicationStatus: 'Recruitment-specific',
    month: 'TBD',
    department: 'Haryana Staff Selection Commission',
    applyLink: 'https://hssc.gov.in',
    description: 'Common Eligibility Test for Group C and Group D government posts in Haryana.',
    cutoffUR: 65,
    cutoffOBC: 61,
    cutoffSCST: 52,
    cutoffEWS: 60
  },
  {
    idNum: '051',
    name: 'UKPSC PCS',
    stateOrCoverage: 'Uttarakhand',
    scope: 'State',
    category: 'State PSC',
    stateName: 'Uttarakhand',
    qualification: 'Graduate',
    expectedApplicants: '~1–2L',
    vacancy2026: '189 (TBD)',
    examDate: 'TBD',
    applicationStatus: 'Check UKPSC',
    month: 'TBD',
    department: 'Uttarakhand Public Service Commission',
    applyLink: 'https://psc.uk.gov.in',
    description: 'Uttarakhand Combined State Civil / Upper Subordinate Services Examination.',
    cutoffUR: 110,
    cutoffOBC: 104,
    cutoffSCST: 92,
    cutoffEWS: 100
  },
  {
    idNum: '052',
    name: 'APPSC/APSSB',
    stateOrCoverage: 'Arunachal Pradesh',
    scope: 'State',
    category: 'State PSC',
    stateName: 'Arunachal Pradesh',
    qualification: '12th/Graduate',
    expectedApplicants: '~20–50K',
    vacancy2026: 'Various (450+)',
    examDate: 'Various',
    applicationStatus: 'Recruitment-specific',
    month: 'Various',
    department: 'Arunachal Pradesh Staff Selection Board',
    applyLink: 'https://apssb.nic.in',
    description: 'Combined Graduate Level and Secondary Level examinations in Arunachal Pradesh.',
    cutoffUR: 105,
    cutoffOBC: 98,
    cutoffSCST: 85,
    cutoffEWS: 92
  },
  {
    idNum: '053',
    name: 'APSC CCE',
    stateOrCoverage: 'Assam',
    scope: 'State',
    category: 'State PSC',
    stateName: 'Assam',
    qualification: 'Graduate',
    expectedApplicants: '~1–3L',
    vacancy2026: '235 (TBD)',
    examDate: 'Various',
    applicationStatus: 'Check APSC',
    month: 'Various',
    department: 'Assam Public Service Commission',
    applyLink: 'https://apsc.nic.in',
    description: 'Combined Competitive Examination for Assam Civil Service (Junior Grade) & Police Service.',
    cutoffUR: 118,
    cutoffOBC: 110,
    cutoffSCST: 98,
    cutoffEWS: 105
  },
  {
    idNum: '054',
    name: 'ADRE',
    stateOrCoverage: 'Assam',
    scope: 'State',
    category: 'State PSC',
    stateName: 'Assam',
    qualification: '10th/12th/Graduate',
    expectedApplicants: '~5–10L',
    vacancy2026: '12,600 (TBD)',
    examDate: 'Various',
    applicationStatus: 'Recruitment-specific',
    month: 'Various',
    department: 'State Level Recruitment Commission Assam',
    applyLink: 'https://slrc.assam.gov.in',
    description: 'Assam Direct Recruitment Examination for Grade III and Grade IV categories.',
    cutoffUR: 65,
    cutoffOBC: 60,
    cutoffSCST: 52,
    cutoffEWS: 58
  },
  {
    idNum: '055',
    name: 'Kerala PSC',
    stateOrCoverage: 'Kerala',
    scope: 'State',
    category: 'State PSC',
    stateName: 'Kerala',
    qualification: 'SSLC/12th/Graduate',
    expectedApplicants: '10L+ combined',
    vacancy2026: 'Various (8,000+)',
    examDate: 'Various',
    applicationStatus: 'Recruitment-specific',
    month: 'Various',
    department: 'Kerala Public Service Commission',
    applyLink: 'https://keralapsc.gov.in',
    description: 'Kerala Administrative Service, Secretariat Assistant, and University Assistant examinations.',
    cutoffUR: 72,
    cutoffOBC: 68,
    cutoffSCST: 58,
    cutoffEWS: 65
  },
  {
    idNum: '056',
    name: 'TPSC',
    stateOrCoverage: 'Tripura',
    scope: 'State',
    category: 'State PSC',
    stateName: 'Tripura',
    qualification: '12th/Graduate',
    expectedApplicants: '~50K–1L',
    vacancy2026: '150 (TBD)',
    examDate: 'Various',
    applicationStatus: 'Recruitment-specific',
    month: 'Various',
    department: 'Tripura Public Service Commission',
    applyLink: 'https://tpsc.tripura.gov.in',
    description: 'Tripura Civil Service and Tripura Police Service Combined Competitive Examination.',
    cutoffUR: 115,
    cutoffOBC: 108,
    cutoffSCST: 96,
    cutoffEWS: 104
  },
  {
    idNum: '057',
    name: 'SPSC',
    stateOrCoverage: 'Sikkim',
    scope: 'State',
    category: 'State PSC',
    stateName: 'Sikkim',
    qualification: 'Graduate',
    expectedApplicants: '~10–30K',
    vacancy2026: '85 (TBD)',
    examDate: 'Various',
    applicationStatus: 'Recruitment-specific',
    month: 'Various',
    department: 'Sikkim Public Service Commission',
    applyLink: 'https://spsc.sikkim.gov.in',
    description: 'Sikkim State Civil Services and allied department recruitment exams.',
    cutoffUR: 110,
    cutoffOBC: 104,
    cutoffSCST: 90,
    cutoffEWS: 98
  },
  {
    idNum: '058',
    name: 'JKPSC CCE',
    stateOrCoverage: 'Jammu & Kashmir',
    scope: 'State',
    category: 'State PSC',
    stateName: 'Jammu & Kashmir',
    qualification: 'Graduate',
    expectedApplicants: '~1–2L',
    vacancy2026: '90 (TBD)',
    examDate: 'Various',
    applicationStatus: 'Check JKPSC',
    month: 'Various',
    department: 'Jammu & Kashmir Public Service Commission',
    applyLink: 'https://jkpsc.nic.in',
    description: 'Combined Competitive (Preliminary) Examination for Junior Scale Administrative Services.',
    cutoffUR: 120,
    cutoffOBC: 112,
    cutoffSCST: 98,
    cutoffEWS: 108
  },
  {
    idNum: '059',
    name: 'JKSSB',
    stateOrCoverage: 'Jammu & Kashmir',
    scope: 'State',
    category: 'State PSC',
    stateName: 'Jammu & Kashmir',
    qualification: '10th/12th/Graduate',
    expectedApplicants: '~2–5L',
    vacancy2026: 'Various (1,850+)',
    examDate: 'Various',
    applicationStatus: 'Recruitment-specific',
    month: 'Various',
    department: 'J&K Services Selection Board',
    applyLink: 'https://jkssb.nic.in',
    description: 'Panchayat Secretary, Junior Assistant, Sub-Inspector and Forester recruitment.',
    cutoffUR: 82,
    cutoffOBC: 76,
    cutoffSCST: 65,
    cutoffEWS: 72
  },
  {
    idNum: '060',
    name: 'IOB Local Bank Officer',
    stateOrCoverage: 'All India',
    scope: 'Central',
    category: 'Banking',
    qualification: 'Graduate',
    expectedApplicants: '— (~3L)',
    vacancy2026: '250',
    examDate: '24 & 29 Sep',
    applicationStatus: 'Closed/near close',
    month: 'Sep',
    department: 'Indian Overseas Bank (IOB)',
    applyLink: 'https://iob.in',
    description: 'Recruitment of Local Bank Officers (Scale I) in Indian Overseas Bank.',
    cutoffUR: 68,
    cutoffOBC: 64,
    cutoffSCST: 55,
    cutoffEWS: 62
  },
  {
    idNum: '061',
    name: 'Bank of Baroda SO',
    stateOrCoverage: 'All India',
    scope: 'Central',
    category: 'Banking',
    qualification: 'Graduate/Specialist',
    expectedApplicants: '— (~2.5L)',
    vacancy2026: '1,100',
    examDate: 'TBD',
    applicationStatus: 'Open till 24 Sep',
    month: 'Sep',
    department: 'Bank of Baroda',
    applyLink: 'https://bankofbaroda.in/careers',
    description: 'Specialist Officers in Wealth Management, Analytics, IT, and Credit in Bank of Baroda.',
    cutoffUR: 70,
    cutoffOBC: 65,
    cutoffSCST: 56,
    cutoffEWS: 64
  },
  {
    idNum: '062',
    name: 'PSSSB Group D',
    stateOrCoverage: 'Punjab',
    scope: 'State',
    category: 'State PSC',
    stateName: 'Punjab',
    qualification: '10th Pass',
    expectedApplicants: '— (~4L)',
    vacancy2026: '2,007',
    examDate: 'TBD',
    applicationStatus: 'Recruitment-specific',
    month: 'TBD',
    department: 'Punjab Subordinate Services Selection Board',
    applyLink: 'https://sssb.punjab.gov.in',
    description: 'Group D multiskilled workers, Peon, and Chowkidar recruitment in Punjab.',
    cutoffUR: 65,
    cutoffOBC: 60,
    cutoffSCST: 52,
    cutoffEWS: 58
  },
  {
    idNum: '063',
    name: 'PSSSB Clerk',
    stateOrCoverage: 'Punjab',
    scope: 'State',
    category: 'State PSC',
    stateName: 'Punjab',
    qualification: 'Graduate',
    expectedApplicants: '— (~3.5L)',
    vacancy2026: '531',
    examDate: 'TBD',
    applicationStatus: 'Recruitment-specific',
    month: 'TBD',
    department: 'Punjab Subordinate Services Selection Board',
    applyLink: 'https://sssb.punjab.gov.in',
    description: 'Clerk, Clerk IT, and Clerk Accounts recruitment in Punjab Government departments.',
    cutoffUR: 72,
    cutoffOBC: 67,
    cutoffSCST: 58,
    cutoffEWS: 65
  },
  {
    idNum: '064',
    name: 'UPSC CSE 2026 (Civil Services Prelims)',
    stateOrCoverage: 'All India',
    scope: 'Central',
    category: 'UPSC',
    qualification: 'Graduate',
    expectedApplicants: '~11.5L',
    vacancy2026: '1,056',
    examDate: '24 May 2026',
    applicationStatus: 'Notification Out',
    month: 'May',
    department: 'Union Public Service Commission (UPSC)',
    applyLink: 'https://upsc.gov.in',
    description: 'Indian Administrative Service (IAS), Indian Police Service (IPS), IFS and Central Civil Services Group A.',
    cutoffUR: 88,
    cutoffOBC: 84,
    cutoffSCST: 72,
    cutoffEWS: 82
  },
  {
    idNum: '065',
    name: 'SSC GD Constable 2026',
    stateOrCoverage: 'All India',
    scope: 'Central',
    category: 'SSC',
    qualification: '10th Pass',
    expectedApplicants: '~45–50L',
    vacancy2026: '39,481',
    examDate: 'Jan–Feb 2026',
    applicationStatus: 'Exam Scheduled',
    month: 'Jan–Feb',
    department: 'Staff Selection Commission (SSC)',
    applyLink: 'https://ssc.gov.in',
    description: 'Constable (GD) in BSF, CISF, CRPF, SSB, ITBP, AR, SSF and NCB examination.',
    cutoffUR: 132,
    cutoffOBC: 128,
    cutoffSCST: 114,
    cutoffEWS: 125
  },
  {
    idNum: '066',
    name: 'RRB ALP (Assistant Loco Pilot) 2026',
    stateOrCoverage: 'All India',
    scope: 'Central',
    category: 'Railways',
    qualification: 'Matriculation + ITI / Diploma',
    expectedApplicants: '~22L',
    vacancy2026: '18,799',
    examDate: '25 Nov–29 Nov',
    applicationStatus: 'Exam Scheduled',
    month: 'Nov',
    department: 'Railway Recruitment Boards (RRB)',
    applyLink: 'https://rrbapply.gov.in',
    description: 'Assistant Loco Pilot CBT-1 and CBT-2 across 21 Railway Recruitment Boards.',
    cutoffUR: 55,
    cutoffOBC: 50,
    cutoffSCST: 42,
    cutoffEWS: 48
  },
  {
    idNum: '067',
    name: 'RRB Group D (Level-1 Track Maintainer)',
    stateOrCoverage: 'All India',
    scope: 'Central',
    category: 'Railways',
    qualification: '10th Pass / ITI',
    expectedApplicants: '~1.1 Crore',
    vacancy2026: '32,000 (TBD)',
    examDate: 'Dec–Jan 2026',
    applicationStatus: 'Upcoming',
    month: 'Dec',
    department: 'Railway Recruitment Boards (RRB)',
    applyLink: 'https://rrbapply.gov.in',
    description: 'Track Maintainer Grade IV, Helper/Assistant in Electrical/Mechanical departments.',
    cutoffUR: 68,
    cutoffOBC: 63,
    cutoffSCST: 54,
    cutoffEWS: 61
  },
  {
    idNum: '068',
    name: 'UPSC NDA & NA (I & II) 2026',
    stateOrCoverage: 'All India',
    scope: 'Central',
    category: 'Defence',
    qualification: '12th Pass',
    expectedApplicants: '~6.5L',
    vacancy2026: '400',
    examDate: '13 Apr / 06 Sep',
    applicationStatus: 'Notification Out',
    month: 'Apr & Sep',
    department: 'Union Public Service Commission (UPSC)',
    applyLink: 'https://upsc.gov.in',
    description: 'National Defence Academy and Naval Academy examination for Army, Navy and Air Force wings.',
    cutoffUR: 355,
    cutoffOBC: 355,
    cutoffSCST: 355,
    cutoffEWS: 355
  },
  {
    idNum: '069',
    name: 'UPSC CDS (Combined Defence Services)',
    stateOrCoverage: 'All India',
    scope: 'Central',
    category: 'Defence',
    qualification: 'Graduate',
    expectedApplicants: '~4.2L',
    vacancy2026: '459',
    examDate: 'Apr / Sep 2026',
    applicationStatus: 'Notification Out',
    month: 'Apr',
    department: 'Union Public Service Commission (UPSC)',
    applyLink: 'https://upsc.gov.in',
    description: 'IMA, INA, AFA, and OTA officers training recruitment through UPSC.',
    cutoffUR: 142,
    cutoffOBC: 138,
    cutoffSCST: 120,
    cutoffEWS: 135
  },
  {
    idNum: '070',
    name: 'AFCAT (Air Force Common Admission Test)',
    stateOrCoverage: 'All India',
    scope: 'Central',
    category: 'Defence',
    qualification: 'Graduate',
    expectedApplicants: '~3.8L',
    vacancy2026: '317',
    examDate: 'Feb & Aug 2026',
    applicationStatus: 'Notification Out',
    month: 'Feb',
    department: 'Indian Air Force',
    applyLink: 'https://afcat.cdac.in',
    description: 'Flying Branch and Ground Duty (Technical & Non-Technical) branches of the IAF.',
    cutoffUR: 155,
    cutoffOBC: 155,
    cutoffSCST: 155,
    cutoffEWS: 155
  },
  {
    idNum: '071',
    name: 'UGC NET 2026 (Assistant Professor & JRF)',
    stateOrCoverage: 'All India',
    scope: 'Central',
    category: 'Teaching',
    qualification: 'Master’s Degree (55%)',
    expectedApplicants: '~9.5L',
    vacancy2026: 'Eligibility / JRF Award',
    examDate: 'Jun & Dec 2026',
    applicationStatus: 'Notification Out',
    month: 'Jun',
    department: 'National Testing Agency (NTA)',
    applyLink: 'https://ugcnet.nta.ac.in',
    description: 'National Eligibility Test for Assistant Professorship and Junior Research Fellowship across 83 subjects.',
    cutoffUR: 180,
    cutoffOBC: 165,
    cutoffSCST: 150,
    cutoffEWS: 162
  },
  {
    idNum: '072',
    name: 'CTET (Central Teacher Eligibility Test)',
    stateOrCoverage: 'All India',
    scope: 'Central',
    category: 'Teaching',
    qualification: 'D.El.Ed / B.Ed',
    expectedApplicants: '~25L',
    vacancy2026: 'Eligibility Certification',
    examDate: '07 Jul / 14 Dec',
    applicationStatus: 'Notification Out',
    month: 'Jul',
    department: 'Central Board of Secondary Education (CBSE)',
    applyLink: 'https://ctet.nic.in',
    description: 'Paper 1 (Classes I to V) and Paper 2 (Classes VI to VIII) teacher recruitment test for KVS, NVS & Central Schools.',
    cutoffUR: 90,
    cutoffOBC: 82,
    cutoffSCST: 82,
    cutoffEWS: 82
  }
];

// Helper to convert master database into AdminExam list
export const MASTER_ADMIN_EXAMS: AdminExam[] = MASTER_EXAM_ENTRIES.map(entry => ({
  id: `exam-${entry.idNum}-${entry.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
  name: entry.name,
  category: entry.category,
  scope: entry.scope,
  stateName: entry.stateName,
  description: entry.description,
  freeLimits: {
    chapterWiseFree: 1,
    fullMockFree: 1,
    sectionWiseFree: 1
  },
  cutoffMarks: {
    general: entry.cutoffUR,
    obc: entry.cutoffOBC,
    sc_st: entry.cutoffSCST,
    ews: entry.cutoffEWS
  }
}));

// Helper to generate realistic, comprehensive eligibility and syllabus for every examination
function getDetailedExamData(entry: MasterExamEntry) {
  const cat = entry.category;
  const qual = entry.qualification;

  // 1. Eligibility computation
  let ageLimit = '18 to 30 Years (Crucial Date)';
  let ageRelaxation = 'OBC: +3 Years | SC/ST: +5 Years | PwD: +10 Years | Ex-Servicemen: As per Central/State norms';
  let selectionProcess = 'Computer Based Test (Tier 1) → Mains/Skill Test (Tier 2) → Document Verification & Medical';
  let physicalStandards = 'Standard vision (6/6 or 6/9) and physical fitness as per official service cadre regulations.';

  if (cat === 'SSC') {
    if (qual.toLowerCase().includes('10th')) {
      ageLimit = '18 to 25 / 27 Years';
      selectionProcess = 'Session 1: Numerical & Mathematical Ability, Reasoning → Session 2: General Awareness, English Comprehension → PET/PST (Havaldar) → DV';
    } else if (qual.toLowerCase().includes('12th')) {
      ageLimit = '18 to 27 Years';
      selectionProcess = 'Tier 1 (CBT) → Tier 2 (Mathematical, Reasoning, English, GA + Typing/Skill Test) → DV';
    } else {
      ageLimit = '18 to 32 Years (Post-wise varies between 18-30 and 20-32)';
      selectionProcess = 'Tier 1 (Computer Based Test) → Tier 2 (Paper 1: Math, Reasoning, English, GA, Computer + Data Entry Speed Test) → DV';
    }
  } else if (cat === 'Railways') {
    ageLimit = '18 to 33 / 36 Years (includes 3 years special age relaxation)';
    selectionProcess = '1st Stage CBT (Screening) → 2nd Stage CBT (Merit) → CBAT / Typing Skill Test (as per post) → Document Verification & Medical Fitness';
    physicalStandards = 'Strict Railway Medical Standards (A-2, A-3, B-1 or C-1 depending on safety/operational post category).';
  } else if (cat === 'Banking') {
    ageLimit = '20 to 28 / 30 Years';
    selectionProcess = 'Preliminary Examination (CBT) → Main Examination (Online + Descriptive) → Common Interview (for Officers/PO) → Final Allotment';
  } else if (cat === 'State PSC') {
    ageLimit = '21 to 37 / 40 Years (State domicile relaxations apply up to 45 years for reserved categories)';
    selectionProcess = 'Preliminary Examination (Objective OMR/CBT) → Main Written Examination (Descriptive Essay & GS Papers) → Personality Test / Interview → Cadre Allotment';
  } else if (cat === 'Defence') {
    ageLimit = '18 to 25 Years (NDA: 16.5–19.5 Years, CDS: 19–24 Years, AFCAT: 20–24 Years)';
    selectionProcess = 'Written Examination (CBT/Offline) → 5-Day SSB Interview (Screening, Psychological Tests, GTO, Conference) → Special Medical Board';
    physicalStandards = 'Strict military physical endurance: 1.6 km run, pull-ups, push-ups, height criteria (Men: 157cm+, Women: 152cm+).';
  } else if (cat === 'Teaching') {
    ageLimit = '18 to 38 / 40 Years';
    selectionProcess = 'Eligibility Test (Paper 1 & Paper 2, 150 MCQs) → Teaching Recruitment Exam (KVS/NVS/DSSSB/State) → Interview / Demo Class';
  }

  // 2. Syllabus & Phases computation
  let examPattern = 'Objective Multiple Choice CBT with negative marking.';
  let negativeMarking = '0.50 or 0.33 marks deducted per wrong answer.';
  let phases: { phaseName: string; duration?: string; marks?: string; subjects: { name: string; questionsCount?: number; marksCount?: number; topics: string[] }[] }[] = [];

  if (cat === 'SSC') {
    examPattern = 'Tier 1 (CBT): 100 Qs / 200 Marks / 60 Mins. Tier 2: Multi-module composite paper.';
    negativeMarking = '0.50 marks in Tier 1; 1.0 mark per wrong answer in Tier 2 Sectional modules.';
    phases = [
      {
        phaseName: 'Tier 1: Preliminary Computer Based Examination',
        duration: '60 Minutes (80 Minutes for PwD)',
        marks: '200 Marks (100 Questions)',
        subjects: [
          {
            name: 'General Intelligence & Reasoning',
            questionsCount: 25,
            marksCount: 50,
            topics: ['Analogies & Similarities', 'Spatial Orientation & Visualization', 'Venn Diagrams & Syllogisms', 'Number & Alphabet Series', 'Coding-Decoding', 'Blood Relations & Direction Sense', 'Paper Folding & Cutting', 'Non-Verbal Pattern Completion']
          },
          {
            name: 'General Awareness & Current Affairs',
            questionsCount: 25,
            marksCount: 50,
            topics: ['Indian History & Freedom Struggle', 'Indian Constitution & Fundamental Rights', 'Geography (Physical & Economic)', 'Economic Scenario & Budget Highlights', 'General Science (Physics, Chemistry, Biology)', 'Static GK & Indian Culture / Classical Dances', 'Awards, Books & National/International Sports', 'Current Affairs (Last 8-12 Months)']
          },
          {
            name: 'Quantitative Aptitude / Mathematics',
            questionsCount: 25,
            marksCount: 50,
            topics: ['Number Systems & Divisibility', 'Percentages, Profit & Loss, Discount', 'Ratio & Proportion, Partnership', 'Time & Work, Pipes & Cisterns', 'Speed, Time & Distance, Trains & Boats', 'Simple & Compound Interest', 'Basic Algebra & Linear Equations', 'Geometry, Triangles & Circles', 'Trigonometry & Heights & Distances', 'Mensuration 2D & 3D', 'Data Interpretation (Bar Graphs, Pie Charts)']
          },
          {
            name: 'English Comprehension',
            questionsCount: 25,
            marksCount: 50,
            topics: ['Spotting the Error in Sentences', 'Fill in the Blanks (Prepositions & Vocab)', 'Synonyms & Antonyms', 'Idioms & Phrases', 'One Word Substitution', 'Active & Passive Voice Transformation', 'Direct & Indirect Speech', 'Cloze Test & Passage Reading Comprehension']
          }
        ]
      },
      {
        phaseName: 'Tier 2: Mains Exam & Skill Test Modules',
        duration: '2 Hours 15 Minutes + 15 Mins Typing',
        marks: '390 Marks + Qualifying Modules',
        subjects: [
          {
            name: 'Section I: Mathematical Abilities & Reasoning',
            questionsCount: 60,
            marksCount: 180,
            topics: ['Advanced Quantitative Aptitude', 'Probability & Statistics', 'Critical & Logical Reasoning', 'Statement & Assumptions / Arguments']
          },
          {
            name: 'Section II: English Language & General Awareness',
            questionsCount: 70,
            marksCount: 210,
            topics: ['In-depth Reading Comprehension & Parajumbles', 'Vocabulary & Grammatical Mastery', 'Advanced General Knowledge & Current Economic Affairs']
          },
          {
            name: 'Section III: Computer Knowledge & DEST Typing',
            questionsCount: 20,
            marksCount: 60,
            topics: ['Basics of Computers, CPU, Memory & RAM/ROM', 'Windows OS, MS Office (Word, Excel, PowerPoint)', 'Working with Internet, E-mail & Web Browsing', 'Cyber Security Basics, Firewalls & Viruses', 'DEST Speed: 27–35 words per minute typing test']
          }
        ]
      }
    ];
  } else if (cat === 'Railways') {
    examPattern = 'CBT Stage 1: 100 Qs / 90 Minutes. CBT Stage 2: 120 Qs / 90 Minutes.';
    negativeMarking = '1/3rd (0.33) marks deducted per incorrect answer.';
    phases = [
      {
        phaseName: 'CBT Stage 1: All India Screening Examination',
        duration: '90 Minutes (120 Minutes for PwD)',
        marks: '100 Marks (100 Questions)',
        subjects: [
          {
            name: 'General Awareness (Science & Static GK)',
            questionsCount: 40,
            marksCount: 40,
            topics: ['Current Events of National & International Importance', 'Games and Sports, Art & Culture of India', 'Indian Literature, Monuments & Places of India', 'General Science & Life Science (up to 10th CBSE)', 'History of India & Freedom Struggle', 'Physical, Social & Economic Geography of India & World', 'Indian Polity & Governance, Constitution', 'Common Abbreviations, Transport Systems in India', 'Basic Computer Applications & Architecture']
          },
          {
            name: 'Mathematics (Arithmetic & Pure Maths)',
            questionsCount: 30,
            marksCount: 30,
            topics: ['Number System, Decimals, Fractions, LCM & HCF', 'Ratio and Proportions, Percentage, Mensuration', 'Time and Work, Time and Distance', 'Simple and Compound Interest, Profit and Loss', 'Elementary Algebra, Geometry and Trigonometry', 'Elementary Statistics (Mean, Median, Mode)']
          },
          {
            name: 'General Intelligence and Reasoning',
            questionsCount: 30,
            marksCount: 30,
            topics: ['Analogies, Completion of Number and Alphabetical Series', 'Coding and Decoding, Mathematical Operations', 'Relationships, Syllogism, Jumbling, Venn Diagrams', 'Data Interpretation and Sufficiency', 'Conclusions and Decision Making', 'Similarities and Differences, Analytical Reasoning', 'Classification, Directions, Statement-Arguments & Assumptions']
          }
        ]
      },
      {
        phaseName: 'CBT Stage 2: Final Rank Determining Examination',
        duration: '90 Minutes',
        marks: '120 Marks (120 Questions)',
        subjects: [
          {
            name: 'General Awareness',
            questionsCount: 50,
            marksCount: 50,
            topics: ['In-depth Science & Tech, Railway History & Budgets, Current Affairs']
          },
          {
            name: 'Mathematics',
            questionsCount: 35,
            marksCount: 35,
            topics: ['High-speed Arithmetic & Applied Algebra']
          },
          {
            name: 'General Intelligence & Reasoning',
            questionsCount: 35,
            marksCount: 35,
            topics: ['Puzzles, Seating Arrangements, Coding, Non-Verbal']
          }
        ]
      }
    ];
  } else if (cat === 'Banking') {
    examPattern = 'Prelims: 100 Qs / 60 Mins with 20 Mins sectional timer per subject.';
    negativeMarking = '0.25 (1/4th) marks deducted per wrong answer.';
    phases = [
      {
        phaseName: 'Preliminary Examination (Online CBT)',
        duration: '60 Minutes (20 Mins per section strictly timed)',
        marks: '100 Marks (100 Questions)',
        subjects: [
          {
            name: 'Quantitative Aptitude',
            questionsCount: 35,
            marksCount: 35,
            topics: ['Simplification & Approximation', 'Number Series (Missing & Wrong)', 'Quadratic Equations & Inequalities', 'Data Interpretation (Tabular, Line, Bar, Radar, Caselet)', 'Arithmetic Word Problems (Ages, Ratio, Work, Speed, SI/CI, Mixtures)']
          },
          {
            name: 'Reasoning Ability',
            questionsCount: 35,
            marksCount: 35,
            topics: ['Puzzles & Seating Arrangement (Circular, Linear, Floor, Box)', 'Syllogisms (Only a few / Possibility cases)', 'Inequalities & Blood Relations', 'Direction Sense & Order Ranking', 'Coding-Decoding (Chinese/New Pattern)']
          },
          {
            name: 'English Language',
            questionsCount: 30,
            marksCount: 30,
            topics: ['Reading Comprehension with Vocab questions', 'Cloze Test & Error Detection', 'Sentence Rearrangement / Parajumbles', 'Column Matching & Word Swapping']
          }
        ]
      },
      {
        phaseName: 'Main Examination & Descriptive Test',
        duration: '3 Hours 30 Minutes',
        marks: '200 Marks (Objective) + 25 Marks (Descriptive)',
        subjects: [
          {
            name: 'Reasoning & Computer Aptitude',
            questionsCount: 45,
            marksCount: 60,
            topics: ['High Level Puzzles, Input-Output, Critical Reasoning, Flowcharts']
          },
          {
            name: 'Data Analysis & Interpretation',
            questionsCount: 35,
            marksCount: 60,
            topics: ['Advanced Missing DI, Probability, Caselet & Data Sufficiency']
          },
          {
            name: 'General, Economy & Banking Awareness',
            questionsCount: 40,
            marksCount: 40,
            topics: ['RBI Monetary Policy, Banking Terms, Financial Sector News, Static GK']
          },
          {
            name: 'English Language & Descriptive Writing',
            questionsCount: 35,
            marksCount: 40,
            topics: ['Advanced Comprehension, Formal Letter Writing & Essay Writing']
          }
        ]
      }
    ];
  } else if (cat === 'State PSC') {
    examPattern = 'Prelims GS + CSAT (Objective), followed by Multi-paper Mains Descriptive & Interview.';
    negativeMarking = '0.33 or 0.25 marks per wrong answer in Prelims.';
    phases = [
      {
        phaseName: 'State PSC Preliminary Examination (Paper 1 & Paper 2)',
        duration: '2 Hours per Paper',
        marks: '200 or 150 Marks per Paper',
        subjects: [
          {
            name: 'General Studies Paper I',
            questionsCount: 100,
            marksCount: 200,
            topics: [`${entry.stateName || 'State'} History, Culture, Heritage & Geography`, 'National History of India & Indian National Movement', 'Indian and World Geography', 'Indian Polity & Governance, Panchayati Raj', 'Economic and Social Development, Sustainable Development', 'General Science & Environment Ecology', 'Current Events of National & International Importance']
          },
          {
            name: 'CSAT / Aptitude Paper II (Qualifying 33%)',
            questionsCount: 80,
            marksCount: 200,
            topics: ['Comprehension & Interpersonal Skills', 'Logical Reasoning & Analytical Ability', 'Decision Making & Problem Solving', 'General Mental Ability & Basic Numeracy (Class X level)', 'Data Interpretation (Charts, Graphs, Tables)']
          }
        ]
      },
      {
        phaseName: 'Mains Written (Descriptive) & Personality Interview',
        duration: '3 Hours per Paper',
        marks: '800 to 1400 Marks Total',
        subjects: [
          {
            name: 'General Studies Papers (GS I, GS II, GS III, GS IV)',
            topics: ['Indian Heritage, Society & History', 'Constitution, Governance, Social Justice & IR', 'Technology, Economic Development, Biodiversity & Security', 'Ethics, Integrity and Aptitude']
          },
          {
            name: `${entry.stateName || 'State'} Specific Paper & Compulsory Language`,
            topics: [`Special knowledge of ${entry.stateName || 'State'} language, literature, economy, and administrative history.`]
          }
        ]
      }
    ];
  } else {
    // Defence, Teaching & Others
    examPattern = 'Written Examination followed by physical/skill assessment.';
    negativeMarking = '0.25 to 0.50 marks per wrong answer.';
    phases = [
      {
        phaseName: 'Phase 1: Written Examination (Objective MCQ)',
        duration: '120 Minutes',
        marks: '100 to 200 Marks',
        subjects: [
          {
            name: 'General Awareness & Reasoning',
            questionsCount: 50,
            marksCount: 50,
            topics: ['National News, Science & Tech, Static GK, Analytical Reasoning, Logical Deductions']
          },
          {
            name: 'Domain Specific / Subject Knowledge & Maths',
            questionsCount: 50,
            marksCount: 50,
            topics: ['Core subject concepts, Pedagogical / Technical foundation, Numerical calculations']
          }
        ]
      }
    ];
  }

  return {
    detailedEligibility: {
      educationalQualification: qual.toLowerCase().includes('graduate') 
        ? "Bachelor's Degree in any discipline from a recognized University or equivalent institute."
        : qual.toLowerCase().includes('12th')
        ? "12th Standard / Higher Secondary or equivalent examination from a recognized Board."
        : qual.toLowerCase().includes('10th')
        ? "Matriculation (10th Class Pass) from a recognized Board or ITI certificate where applicable."
        : `${qual} from a recognized University or Institute with minimum qualifying marks.`,
      ageLimit,
      ageRelaxation,
      nationality: 'Candidate must be a citizen of India, or a subject of Nepal/Bhutan, or a Tibetan refugee settled in India prior to 1 Jan 1962.',
      physicalStandards,
      selectionProcess
    },
    detailedSyllabus: {
      examPattern,
      negativeMarking,
      phases,
      importantTopicsSummary: `Focus heavily on high-weightage topics: Arithmetic, Logical Reasoning, Current Affairs from the last 8 months, and Sectional speed tests.`
    }
  };
}

// Helper to convert master database into ExamNotificationTimeline list
export const MASTER_NOTIFICATIONS_TIMELINE: ExamNotificationTimeline[] = MASTER_EXAM_ENTRIES.map(entry => {
  let mappedStatus: 'Notification Out' | 'Admit Card Released' | 'Exam Scheduled' | 'Result Declared' = 'Notification Out';
  if (entry.applicationStatus.includes('Open')) {
    mappedStatus = 'Notification Out';
  } else if (entry.examDate !== 'TBD' && entry.examDate !== 'Various') {
    mappedStatus = 'Exam Scheduled';
  } else if (entry.applicationStatus.includes('Check') || entry.applicationStatus.includes('Closed')) {
    mappedStatus = 'Notification Out';
  }

  const { detailedEligibility, detailedSyllabus } = getDetailedExamData(entry);

  return {
    id: `timeline-${entry.idNum}`,
    examName: entry.name,
    department: entry.department,
    category: entry.category,
    scope: entry.scope,
    stateName: entry.stateName,
    notificationOutDate: '2026-08-15',
    examDate: entry.examDate,
    resultDate: '2026-12-20',
    postsCount: `${entry.vacancy2026} Posts`,
    eligibility: entry.qualification,
    status: mappedStatus,
    applyLink: entry.applyLink,
    officialNotificationText: `${entry.description} Expected applicants: ${entry.expectedApplicants}. Application status: ${entry.applicationStatus}.`,
    detailedEligibility,
    detailedSyllabus
  };
});
