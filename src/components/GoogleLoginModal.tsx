import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  ShieldCheck, 
  CheckCircle2, 
  Lock, 
  Mail, 
  User, 
  Sparkles, 
  ArrowRight 
} from 'lucide-react';

export const GoogleLoginModal: React.FC = () => {
  const { 
    googleLoginModalOpen, 
    setGoogleLoginModalOpen, 
    loginWithGoogle, 
    adminGmail,
    currentUser,
    paymentConfig
  } = useApp();

  const [inputEmail, setInputEmail] = useState('paronaskar8@gmail.com');
  const [inputName, setInputName] = useState('Paron Askar');
  const [inputCountry, setInputCountry] = useState(currentUser.country || 'India');
  const [selectedRole, setSelectedRole] = useState<'admin' | 'student'>('admin');

  if (!googleLoginModalOpen) return null;

  const handleQuickSelect = (email: string, name: string, role: 'admin' | 'student') => {
    setInputEmail(email);
    setInputName(name);
    setSelectedRole(role);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputEmail.trim()) return;
    loginWithGoogle(inputEmail.trim(), inputName.trim() || 'Candidate User', inputCountry);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div 
        className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center shadow text-white">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-base leading-tight">Student Portal Sign-In</h3>
              <p className="text-[11px] text-slate-400">UPTO SELECTION Verified Access</p>
            </div>
          </div>
          <button 
            onClick={() => setGoogleLoginModalOpen(false)}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Quick Profiles Switcher */}
          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
              Choose Profile or Sign In:
            </label>
            <div className="space-y-2">
              {/* Admin Owner Account */}
              <button
                type="button"
                onClick={() => handleQuickSelect('paronaskar8@gmail.com', 'Paron Askar (Admin Owner)', 'admin')}
                className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                  inputEmail === 'paronaskar8@gmail.com'
                    ? 'border-indigo-500 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-950 dark:text-indigo-200'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                    PA
                  </div>
                  <div>
                    <div className="font-bold text-xs flex items-center gap-1.5">
                      <span>paronaskar8@gmail.com</span>
                      <span className="text-[9px] bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 px-1.5 py-0.2 rounded font-extrabold">
                        ADMIN OWNER
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400">Full admin controls & exam management</span>
                  </div>
                </div>
                {inputEmail === 'paronaskar8@gmail.com' && <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />}
              </button>

              {/* Student Candidate Account */}
              <button
                type="button"
                onClick={() => handleQuickSelect('rahul.aspirant@gmail.com', 'Rahul Sharma', 'student')}
                className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                  inputEmail === 'rahul.aspirant@gmail.com'
                    ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
                    RS
                  </div>
                  <div>
                    <div className="font-bold text-xs flex items-center gap-1.5">
                      <span>rahul.aspirant@gmail.com</span>
                      <span className="text-[9px] bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 px-1.5 py-0.2 rounded font-bold">
                        STUDENT
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400">Gold tier candidate • Mock tests & Analytics</span>
                  </div>
                </div>
                {inputEmail === 'rahul.aspirant@gmail.com' && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
              </button>
            </div>
          </div>

          {/* Custom Student Email Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
            <div>
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                Student Account Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={inputEmail}
                  onChange={(e) => setInputEmail(e.target.value)}
                  placeholder="yourname@gmail.com"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-900 dark:text-white"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={inputName}
                  onChange={(e) => setInputName(e.target.value)}
                  placeholder="Candidate Name"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                  required
                />
              </div>
            </div>

            {/* Country Selection Option */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                  Select Country / Region
                </label>
                <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold">
                  {inputCountry === 'India' ? '🇮🇳 All Access' : '🌍 eBooks & PDFs Access'}
                </span>
              </div>
              <select
                value={inputCountry}
                onChange={(e) => setInputCountry(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
              >
                <option value="India">🇮🇳 India (All Access: All Mocks, Tests & PDFs)</option>
                <option value="Other Countries">🌍 Other Countries / International (E-Books & PDFs Only - Price by Admin)</option>
                <option value="United States">🇺🇸 United States (E-Books & PDFs Only)</option>
                <option value="United Kingdom">🇬🇧 United Kingdom (E-Books & PDFs Only)</option>
                <option value="Canada">🇨🇦 Canada (E-Books & PDFs Only)</option>
                <option value="Australia">🇦🇺 Australia (E-Books & PDFs Only)</option>
                <option value="UAE">🇦🇪 United Arab Emirates (E-Books & PDFs Only)</option>
                <option value="Nepal">🇳🇵 Nepal (E-Books & PDFs Only)</option>
                <option value="Bangladesh">🇧🇩 Bangladesh (E-Books & PDFs Only)</option>
              </select>

              <div className="mt-1.5 p-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-[10px] leading-relaxed text-slate-500 dark:text-slate-400">
                {inputCountry === 'India' ? (
                  <span className="text-emerald-700 dark:text-emerald-300 font-medium">
                    ✓ Full unrestricted access to TCS iON mock tests, chapterwise quizzes, study PDFs, and teacher applications across India.
                  </span>
                ) : (
                  <span className="text-amber-700 dark:text-amber-300 font-medium">
                    ✓ International Access: Unlimited access to all downloadable & readable E-Books and lesson PDFs at special international pricing (${paymentConfig.internationalPriceUsd || 9.99} USD).
                  </span>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
            >
              <span>Continue to Student Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 text-center">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Admin panel is strictly protected and unlocks only for {adminGmail}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
