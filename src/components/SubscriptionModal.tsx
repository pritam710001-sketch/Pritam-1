import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SUBSCRIPTION_PLANS } from '../data/mockData';
import { SubscriptionPlan } from '../types';
import { 
  X, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  Flame, 
  Clock, 
  TrendingUp, 
  Zap,
  Globe,
  Award,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

export const SubscriptionModal: React.FC = () => {
  const { 
    subscriptionModalOpen, 
    setSubscriptionModalOpen, 
    openPaymentCheckout, 
    selectedExamName,
    currentUser,
    paymentConfig,
    deviceAuthPermissionGranted,
    deviceFingerprintId,
    requestDeviceAuthenticationPermission,
    checkDeviceTrialStatus
  } = useApp();

  const [selectedPlanId, setSelectedPlanId] = useState<string>('day1');
  const [trialNotice, setTrialNotice] = useState<{ type: 'error' | 'success'; message: string } | null>(null);
  const [deviceConsentChecked, setDeviceConsentChecked] = useState<boolean>(deviceAuthPermissionGranted);
  const [showPermissionPrompt, setShowPermissionPrompt] = useState<boolean>(false);

  if (!subscriptionModalOpen) return null;

  const isInternational = currentUser.country && currentUser.country !== 'India';

  // Get active selected plan
  const activePlan = SUBSCRIPTION_PLANS.find(p => p.id === selectedPlanId) || SUBSCRIPTION_PLANS[0];
  
  const getPlanPrice = (plan: SubscriptionPlan) => {
    return plan.id === 'day1' ? (paymentConfig.prices.day1 || 2)
      : plan.id === 'single_exam' ? paymentConfig.prices.single_exam
      : plan.id === 'month6' ? paymentConfig.prices.month6
      : paymentConfig.prices.year1;
  };

  const activePrice = getPlanPrice(activePlan);
  const deviceStatus = checkDeviceTrialStatus();

  const handleGrantDevicePermission = () => {
    if (!deviceConsentChecked) {
      setTrialNotice({
        type: 'error',
        message: 'Please check the consent box to allow Device Authentication for the ₹2 7-Day Trial.'
      });
      return;
    }
    const res = requestDeviceAuthenticationPermission();
    if (!res.eligible) {
      setTrialNotice({ type: 'error', message: res.message });
    } else {
      setTrialNotice({ type: 'success', message: res.message });
      setShowPermissionPrompt(false);
    }
  };

  const handleProceed = () => {
    if (activePlan.id === 'day1') {
      // Must take Device Authentication Permission from visitor at trial time
      if (!deviceAuthPermissionGranted || !deviceConsentChecked) {
        setShowPermissionPrompt(true);
        setTrialNotice({
          type: 'error',
          message: '🔒 Device Authentication Permission Required: Please grant device authentication permission below to verify the 1-Device per 3-Months (90 Days) rule before starting the ₹2 7-Day Trial.'
        });
        return;
      }

      const status = checkDeviceTrialStatus();
      if (!status.eligible) {
        setTrialNotice({
          type: 'error',
          message: `🚫 3-Month Device Restriction: Only 1 trial is available for 1 device in 3 months (90 days). Device [${status.deviceId}] already claimed a 7-Day Trial on ${status.lastClaimedDate}. (${status.cooldownDaysRemaining} days remaining in 3-month lock). Please select the 1-Month (₹49), 6-Month (₹199), or 1-Year (₹399) Pass.`
        });
        return;
      }

      // Device authenticated & eligible -> proceed to ₹2 payment checkout
      openPaymentCheckout({
        ...activePlan,
        price: activePrice
      });
      return;
    }
    openPaymentCheckout(activePlan);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-3"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Compact Header Ribbon */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 px-5 py-3 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-white/20 rounded-xl">
              <Zap className="w-4 h-4 text-emerald-300" />
            </span>
            <div>
              <h2 className="text-sm sm:text-base font-extrabold tracking-tight">UPTO SELECTION Pass Plans</h2>
              <p className="text-[11px] text-blue-100 font-medium">
                Target: <strong>{selectedExamName}</strong> & All Central / State Exams
              </p>
            </div>
          </div>
          <button 
            onClick={() => setSubscriptionModalOpen(false)}
            className="p-1 rounded-full hover:bg-white/20 transition-colors cursor-pointer text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Short Trust Strip */}
        <div className="bg-blue-50/80 dark:bg-blue-950/40 border-b border-blue-100 dark:border-blue-900/40 px-5 py-2 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-blue-900 dark:text-blue-200 font-semibold text-[11px] sm:text-xs">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>&ldquo;1 Lakh+ students cleared exams with this platform across India&rdquo;</span>
          </div>
          <span className="text-[10px] font-extrabold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800 shrink-0">
            94.6% Selection Rate
          </span>
        </div>

        {/* International User Notice if applicable */}
        {isInternational && (
          <div className="mx-4 mt-3 p-2 bg-amber-500/10 rounded-xl border border-amber-500/30 text-xs text-amber-900 dark:text-amber-200 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>{currentUser.country} Aspirant:</strong> Study PDFs for <strong>${paymentConfig.internationalPriceUsd || 9.99} USD</strong>.
              </span>
            </div>
            <button
              onClick={() => {
                openPaymentCheckout({
                  id: 'year1',
                  name: `International E-Books Pass (${currentUser.country})`,
                  durationLabel: '365 Days Access',
                  durationDays: 365,
                  price: Math.round((paymentConfig.internationalPriceUsd || 9.99) * 85),
                  originalPrice: 2499,
                  description: 'All E-Books & Study PDFs access.',
                  features: ['All Study PDFs', 'All E-Books', 'Static GK & Lesson Notes']
                });
              }}
              className="px-2 py-0.5 rounded-lg bg-amber-600 text-white font-bold text-xs shrink-0 cursor-pointer"
            >
              Get for ${paymentConfig.internationalPriceUsd || 9.99}
            </button>
          </div>
        )}

        {/* SINGLE BOX CONTAINER FOR ALL PLANS */}
        <div className="p-3 sm:p-4">
          <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-3.5 sm:p-4 border-2 border-blue-500/30 dark:border-blue-500/20 space-y-3 shadow-inner">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  Select Your Plan (All Plans in One Box)
                </span>
              </div>
              <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
                Tap to Select
              </span>
            </div>

            {/* All 4 Plans Inside One Single Unified Box Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {SUBSCRIPTION_PLANS.map((plan) => {
                const isSelected = plan.id === selectedPlanId;
                const price = getPlanPrice(plan);
                const isDay1 = plan.id === 'day1';
                const is1Year = plan.id === 'year1';
                const is6Month = plan.id === 'month6';

                return (
                  <button
                    key={plan.id}
                    type="button"
                    onClick={() => setSelectedPlanId(plan.id)}
                    className={`relative p-2.5 sm:p-3 rounded-xl text-left border-2 transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-blue-600 bg-white dark:bg-slate-900 shadow-md ring-2 ring-blue-500/30 -translate-y-0.5'
                        : 'border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/40 hover:border-slate-300'
                    }`}
                  >
                    {/* Badge */}
                    <div className="h-5 mb-1 flex items-center">
                      {is1Year && (
                        <span className="inline-flex items-center gap-0.5 text-[8.5px] font-black uppercase bg-indigo-600 text-white px-1.5 py-0.5 rounded-full">
                          ★ BEST VALUE
                        </span>
                      )}
                      {is6Month && (
                        <span className="inline-flex items-center gap-0.5 text-[8.5px] font-black uppercase bg-emerald-600 text-white px-1.5 py-0.5 rounded-full">
                          ★ RECOMMENDED
                        </span>
                      )}
                      {isDay1 && (
                        <span className="inline-flex items-center gap-0.5 text-[8.5px] font-black uppercase bg-emerald-600 text-white px-1.5 py-0.5 rounded-full">
                          ⚡ 7-DAY TRIAL
                        </span>
                      )}
                      {plan.id === 'single_exam' && (
                        <span className="inline-flex items-center gap-0.5 text-[8.5px] font-black uppercase bg-blue-600 text-white px-1.5 py-0.5 rounded-full">
                          🎯 30 DAYS
                        </span>
                      )}
                    </div>

                    <div>
                      <span className="text-xs font-extrabold text-slate-800 dark:text-white block leading-tight">
                        {plan.id === 'day1' ? '7-Day Trial (₹2)'
                          : plan.id === 'single_exam' ? '1-Month Pass'
                          : plan.id === 'month6' ? '6-Month Pass'
                          : '1-Year Full Pass'}
                      </span>
                      <span className="text-[10px] text-slate-400 block mt-0.5 truncate">
                        {plan.id === 'day1' ? '1 Device / 3 Months' : plan.durationLabel}
                      </span>
                    </div>

                    <div className="mt-2 pt-1.5 border-t border-slate-100 dark:border-slate-700/80 flex items-baseline justify-between">
                      <span className="text-base font-black text-blue-600 dark:text-blue-400">
                        ₹{price}
                      </span>
                      {plan.originalPrice > price && (
                        <span className="text-[10px] line-through text-slate-400">
                          ₹{plan.originalPrice}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected Plan Details & Benefits Inside the Same Box */}
            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-emerald-500" />
                    <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                      {activePlan.name}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                    {activePlan.description}
                  </span>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs line-through text-slate-400 mr-1.5">
                    ₹{activePlan.originalPrice}
                  </span>
                  <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                    ₹{activePrice}
                  </span>
                </div>
              </div>

              {/* Compact Feature Pills */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 pt-1 text-[11px] text-slate-600 dark:text-slate-300">
                <span className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-lg">
                  <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> All 500+ Mock Tests
                </span>
                <span className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-lg">
                  <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> Full Explanations & Notes
                </span>
                <span className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-lg">
                  <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> {activePlan.id === 'day1' ? 'Max 1 Trial / Device in 90 Days' : 'Teach With Us Priority'}
                </span>
              </div>
            </div>

            {/* Device Authentication Permission Box when 7-Day Trial (₹2) is selected */}
            {activePlan.id === 'day1' && (
              <div className={`p-3 rounded-xl border-2 transition-all space-y-2 ${
                !deviceStatus.eligible
                  ? 'bg-rose-50/90 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800'
                  : deviceAuthPermissionGranted && deviceConsentChecked
                  ? 'bg-emerald-50/90 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800'
                  : 'bg-amber-50/90 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800'
              }`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className={`w-4 h-4 shrink-0 ${
                      !deviceStatus.eligible ? 'text-rose-600' : deviceAuthPermissionGranted ? 'text-emerald-600' : 'text-amber-600'
                    }`} />
                    <div>
                      <h4 className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                        Visitor Device Authentication Permission (Required for ₹2 Trial)
                      </h4>
                      <p className="text-[10.5px] text-slate-600 dark:text-slate-300">
                        Policy: <strong>Only ₹2 for 7 Days</strong> • Maximum <strong>1 Trial per Device in 3 Months (90 Days)</strong>.
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-900 text-emerald-400 shrink-0">
                    ID: {deviceFingerprintId}
                  </span>
                </div>

                {!deviceStatus.eligible ? (
                  <div className="p-2 rounded-lg bg-rose-100/80 dark:bg-rose-900/40 border border-rose-200 dark:border-rose-800 text-[11px] text-rose-800 dark:text-rose-200 font-semibold">
                    🚫 This device (<strong>{deviceStatus.deviceId}</strong>) already claimed a 7-Day Trial on <strong>{deviceStatus.lastClaimedDate}</strong>. Next trial eligibility in <strong>{deviceStatus.cooldownDaysRemaining} days</strong> (3-Month Device Lock). Please choose the 1-Month (₹49) or 6-Month (₹199) Pass.
                  </div>
                ) : (
                  <div className="space-y-2 pt-1">
                    <label className="flex items-start gap-2 cursor-pointer select-none text-[11px] text-slate-700 dark:text-slate-200 font-medium">
                      <input
                        type="checkbox"
                        checked={deviceConsentChecked}
                        onChange={(e) => {
                          setDeviceConsentChecked(e.target.checked);
                          if (e.target.checked) {
                            const res = requestDeviceAuthenticationPermission();
                            setTrialNotice({
                              type: res.eligible ? 'success' : 'error',
                              message: res.message
                            });
                          }
                        }}
                        className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                      <span>
                        I grant <strong>Device Authentication Permission</strong> to verify my hardware/browser signature (<strong>{deviceFingerprintId}</strong>) and confirm I have not used a 7-Day Trial on this device in the last 3 months (90 days).
                      </span>
                    </label>

                    {(!deviceAuthPermissionGranted || showPermissionPrompt) && (
                      <button
                        type="button"
                        onClick={handleGrantDevicePermission}
                        className="w-full py-1.5 px-3 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-sm cursor-pointer transition-all"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Verify & Grant Device Permission for ₹2 Trial</span>
                      </button>
                    )}

                    {deviceAuthPermissionGranted && deviceConsentChecked && (
                      <div className="flex items-center justify-between text-[11px] text-emerald-700 dark:text-emerald-300 font-bold bg-emerald-100/70 dark:bg-emerald-900/30 px-2.5 py-1 rounded-lg">
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          Device Authenticated & Eligible for ₹2 (7-Day Trial)
                        </span>
                        <span className="text-[10px] font-mono">90-Day Lock Ready</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {trialNotice && (
              <div className={`p-2.5 rounded-xl text-xs font-bold border ${
                trialNotice.type === 'error'
                  ? 'bg-rose-50 dark:bg-rose-950/50 border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300'
                  : 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
              }`}>
                {trialNotice.message}
              </div>
            )}

            {/* Single Large Action Button Inside the Unified Box */}
            <button
              type="button"
              onClick={handleProceed}
              disabled={activePlan.id === 'day1' && !deviceStatus.eligible}
              className={`w-full py-3 rounded-xl font-extrabold text-sm shadow-lg flex items-center justify-center gap-2 transition-all ${
                activePlan.id === 'day1' && !deviceStatus.eligible
                  ? 'bg-slate-300 dark:bg-slate-800 text-slate-500 cursor-not-allowed shadow-none'
                  : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30 cursor-pointer active:scale-95'
              }`}
            >
              <span>
                {activePlan.id === 'day1'
                  ? (!deviceStatus.eligible
                      ? `Trial Locked on Device (${deviceStatus.cooldownDaysRemaining}d left in 3 Months)`
                      : 'Verify Device & Activate 7-Day Trial • Pay ₹2')
                  : `Proceed to Checkout • Pay ₹${activePrice}`}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-center gap-3 text-[11px] text-slate-400 text-center mt-2.5">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Instant Activation
            </span>
            <span>•</span>
            <span>All Central & State Exams Included</span>
          </div>
        </div>
      </div>
    </div>
  );
};
