import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Award, 
  Crown, 
  Sparkles, 
  CheckCircle2, 
  Smartphone, 
  Laptop, 
  DollarSign, 
  Send, 
  Users, 
  Phone, 
  BookOpen, 
  Star, 
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const TeachWithUs: React.FC = () => {
  const { 
    currentUser, 
    userTier, 
    submitTeachWithUsApplication, 
    teachApplications,
    setSubscriptionModalOpen 
  } = useApp();

  const [mobileNumber, setMobileNumber] = useState(currentUser.phone || '+91 ');
  const [subjectExpertise, setSubjectExpertise] = useState('Quantitative Aptitude & Speed Math');
  const [experienceText, setExperienceText] = useState('Cleared SSC CGL 2024 Tier 1 with 150+ marks. Passionate about teaching shortcuts.');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // Is user eligible: Middle Silver or Gold tier
  const isEligibleToApply = userTier === 'Silver' || userTier === 'Gold';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobileNumber || mobileNumber.length < 10) {
      alert('Please enter a valid 10-digit mobile number.');
      return;
    }

    submitTeachWithUsApplication(mobileNumber, subjectExpertise);
    setSubmittedSuccess(true);
    confetti({
      particleCount: 100,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      
      {/* Top Hero Banner in Blue */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-800 to-slate-900 text-white p-6 sm:p-10 shadow-2xl border border-blue-400/30">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-emerald-200 font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5 border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-emerald-300" /> Performance Rewards & Educator Hiring
            </span>
            <span className="text-xs text-blue-100 font-bold">100+ Teachers Currently Earning</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            Earn Up To <span className="text-emerald-300">₹1,00,000 / Month</span> & Win Laptops & Phones!
          </h1>

          <p className="text-xs sm:text-sm text-slate-100 mt-2.5 leading-relaxed">
            Every live mock test automatically tracks your accuracy and score. Reach Silver or Gold Level to unlock educator contracts, win premium electronics, and teach lakhs of students across India.
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-6 text-xs font-bold text-emerald-200">
            <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-xl border border-white/10">
              <Laptop className="w-4 h-4 text-emerald-300" />
              <span>Gold Tier: Laptop & Smartphone Gifts</span>
            </div>
            <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-xl border border-white/10">
              <Users className="w-4 h-4 text-emerald-300" />
              <span>100+ Teachers are Earning ₹1 Lakh/mo</span>
            </div>
          </div>
        </div>
      </div>

      {/* Current User Tier Status Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shadow-lg ${
            userTier === 'Gold'
              ? 'bg-gradient-to-tr from-emerald-400 to-teal-500 text-slate-950 shadow-emerald-500/20'
              : userTier === 'Silver'
              ? 'bg-gradient-to-tr from-slate-300 to-slate-400 text-slate-900 shadow-slate-400/20'
              : 'bg-gradient-to-tr from-blue-700 to-blue-800 text-white shadow-blue-800/20'
          }`}>
            {userTier === 'Gold' ? '🥇' : userTier === 'Silver' ? '🥈' : '🥉'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
                Your Current Tier: <span className="text-blue-600 dark:text-blue-400">{userTier} Level</span>
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                Avg Accuracy: {currentUser.avgAccuracy}%
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {userTier === 'Gold' && '🎉 Congratulations! You qualify for Laptop/Phone rewards and ₹1 Lakh/month Teach With Us contracts.'}
              {userTier === 'Silver' && '✅ You qualify for Teach With Us! Submit your mobile number below.'}
              {userTier === 'Bronze' && '📈 Reach 60%+ accuracy on mock tests to achieve Silver Level and unlock educator applications.'}
            </p>
          </div>
        </div>

        {!isEligibleToApply && (
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-500/20">
            Need Silver (60%+ accuracy) to Apply
          </span>
        )}
      </div>

      {/* Bronze, Silver, Gold Tier Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Bronze Tier */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border-2 border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 flex items-center gap-1">
                🥉 Bronze Level
              </span>
              <span className="text-xs text-slate-400 font-bold">&lt; 60% Accuracy</span>
            </div>

            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Foundation Aspirant
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Standard tier for newly enrolled candidates beginning their mock test practice journey.
            </p>

            <ul className="mt-4 space-y-2 text-xs text-slate-600 dark:text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>1 Free Mock Test Per Exam Category</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>Read Lesson PDF Materials</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>Basic Cutoff Benchmarks</span>
              </li>
            </ul>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl text-[11px] text-slate-500 text-center">
            Attempt 2-3 mocks to climb to Silver!
          </div>
        </div>

        {/* Silver Tier */}
        <div className={`bg-white dark:bg-slate-900 rounded-3xl p-6 border-2 shadow-md flex flex-col justify-between space-y-4 ${
          userTier === 'Silver' ? 'border-slate-400 dark:border-slate-500 ring-2 ring-slate-400' : 'border-slate-200 dark:border-slate-800'
        }`}>
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 flex items-center gap-1">
                🥈 Silver Level
              </span>
              <span className="text-xs text-slate-500 font-bold">60% - 80% Accuracy</span>
            </div>

            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Proven Candidate (Eligible to Teach)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Achieved by steady performers. Unlocks direct educator hiring requests with your mobile number!
            </p>

            <ul className="mt-4 space-y-2 text-xs text-slate-600 dark:text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span className="font-bold text-slate-800 dark:text-slate-100">Teach With Us Request Enabled</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>Earn up to ₹40,000 - ₹60,000/month as Mentor</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>Customized 10 to 50 Qs Segments</span>
              </li>
            </ul>
          </div>

          <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-2xl text-[11px] text-blue-700 dark:text-blue-300 font-bold text-center border border-blue-500/20">
            Submit Mobile Number Below to Apply!
          </div>
        </div>

        {/* Gold Tier */}
        <div className={`bg-gradient-to-b from-blue-500/10 via-white to-white dark:from-blue-500/10 dark:via-slate-900 dark:to-slate-900 rounded-3xl p-6 border-2 shadow-xl flex flex-col justify-between space-y-4 ${
          userTier === 'Gold' ? 'border-blue-500 ring-2 ring-blue-500' : 'border-blue-400/50'
        }`}>
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-black px-3 py-1 rounded-full bg-emerald-600 text-white shadow-sm flex items-center gap-1 uppercase tracking-wider">
                👑 Gold Level Master
              </span>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-black">80%+ Accuracy</span>
            </div>

            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              Topper & Faculty Fast-Track
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Elite live exam performers. Eligible for physical prizes (Laptops, Phones) & Senior Educator contracts!
            </p>

            <ul className="mt-4 space-y-2 text-xs text-slate-700 dark:text-slate-200">
              <li className="flex items-center gap-2 font-bold text-emerald-700 dark:text-emerald-300">
                <Laptop className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Win Brand New Laptop & Smartphone</span>
              </li>
              <li className="flex items-center gap-2 font-bold text-blue-600 dark:text-blue-400">
                <DollarSign className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                <span>Earn up to ₹1,00,000 / Month Teaching</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Direct 1-on-1 Faculty Onboarding</span>
              </li>
            </ul>
          </div>

          <div className="p-3 bg-emerald-100 dark:bg-emerald-950/60 rounded-2xl text-[11px] text-emerald-900 dark:text-emerald-200 font-black text-center border border-emerald-400/30">
            Top Priority Selection Guaranteed!
          </div>
        </div>

      </div>

      {/* "Teach With Us" Application Form */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="border-b border-slate-200 dark:border-slate-800 pb-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Educator Recruitment Program
            </span>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
              Apply to Teach With Us (Available to Silver & Gold Level Candidates)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              100+ teachers are already earning up to ₹1,00,000 per month across India on UPTO SELECTION.
            </p>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Status</span>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold ${
              isEligibleToApply ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' : 'bg-slate-100 text-slate-600'
            }`}>
              {isEligibleToApply ? 'Eligible to Apply' : 'Requires Silver Tier'}
            </span>
          </div>
        </div>

        {submittedSuccess ? (
          <div className="p-6 bg-blue-50 dark:bg-blue-950/40 rounded-2xl border border-blue-500/30 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-extrabold text-blue-900 dark:text-blue-100">
              Request Submitted Successfully!
            </h3>
            <p className="text-xs text-blue-700 dark:text-blue-300 max-w-md mx-auto">
              Our academic hiring coordinator will contact you at <strong>{mobileNumber}</strong> within 48 hours for subject demo and contract finalizing.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Mobile Number (Required)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="tel"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 dark:text-white"
                    required
                  />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Our team calls eligible silver/gold candidates directly for briefing.
                </span>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Primary Teaching Subject
                </label>
                <select
                  value={subjectExpertise}
                  onChange={(e) => setSubjectExpertise(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 dark:text-white"
                >
                  <option value="Quantitative Aptitude & Speed Math">Quantitative Aptitude & Speed Math</option>
                  <option value="General Intelligence & Reasoning">General Intelligence & Reasoning</option>
                  <option value="General Awareness & Static GK">General Awareness & Static GK</option>
                  <option value="English Comprehension & Grammar">English Comprehension & Grammar</option>
                  <option value="State PSC Specific General Studies">State PSC Specific General Studies</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Exam Credentials & Experience
              </label>
              <textarea
                rows={3}
                value={experienceText}
                onChange={(e) => setExperienceText(e.target.value)}
                placeholder="Mention competitive exams cleared, percentiles, or prior mentoring experience..."
                className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
              />
            </div>

            <button
              type="submit"
              disabled={!isEligibleToApply}
              className={`w-full sm:w-auto px-8 py-3 rounded-xl font-extrabold text-xs sm:text-sm shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 ${
                isEligibleToApply
                  ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Send className="w-4 h-4" />
              <span>Submit Request to Teach With Us</span>
            </button>
          </form>
        )}
      </div>

    </div>
  );
};
