import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SUBSCRIPTION_PLANS } from '../data/mockData';
import { SubscriptionPlan } from '../types';
import { 
  X, 
  ShieldCheck, 
  QrCode, 
  Smartphone, 
  CreditCard, 
  CheckCircle2, 
  Loader2, 
  Lock,
  ExternalLink,
  Sparkles,
  Check,
  Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const PaymentModal: React.FC = () => {
  const { 
    selectedPlanForPayment, 
    setSelectedPlanForPayment, 
    completePayment, 
    paymentConfig,
    currentUser,
    deviceAuthPermissionGranted,
    deviceFingerprintId,
    requestDeviceAuthenticationPermission,
    checkDeviceTrialStatus,
    claim7DayFreeTrial
  } = useApp();

  const [paymentMethod, setPaymentMethod] = useState<'upi_app' | 'upi_qr' | 'card'>('upi_app');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [utrInput, setUtrInput] = useState('');
  const [trialBlockError, setTrialBlockError] = useState<string | null>(null);
  
  // Coupon Code State
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);

  if (!selectedPlanForPayment) return null;

  const isTrialPlan = selectedPlanForPayment.id === 'day1';
  const deviceStatus = checkDeviceTrialStatus();

  const rawBasePrice = selectedPlanForPayment.id === 'day1' ? (paymentConfig.prices.day1 || 2)
    : selectedPlanForPayment.id === 'single_exam' ? paymentConfig.prices.single_exam
    : selectedPlanForPayment.id === 'month6' ? paymentConfig.prices.month6
    : paymentConfig.prices.year1;

  const discountPercent = appliedCoupon && paymentConfig.couponDiscountPercent ? paymentConfig.couponDiscountPercent : 0;
  const discountAmount = Math.round((rawBasePrice * discountPercent) / 100);
  const planPrice = Math.max(1, rawBasePrice - discountAmount);

  // Keep target UPI ID strictly for deep links in the background - NOT shown to visitors
  const receiverName = paymentConfig.upiReceiverName || 'UPTO SELECTION';
  const targetUpiId = paymentConfig.upiId || 'uptoselection@okaxis';
  const upiNote = `Pass: ${selectedPlanForPayment.name} - UPTO SELECTION`;
  
  // Standard UPI URI format accepted across all Indian UPI apps
  const standardUpiUri = `upi://pay?pa=${encodeURIComponent(targetUpiId)}&pn=${encodeURIComponent(receiverName)}&am=${planPrice}&cu=INR&tn=${encodeURIComponent(upiNote)}`;

  const handleApplyCoupon = () => {
    setCouponError(null);
    if (!couponInput.trim()) {
      setCouponError('Please enter a coupon code.');
      return;
    }
    const targetCode = (paymentConfig.couponCode || 'SELECTION50').trim().toUpperCase();
    if (couponInput.trim().toUpperCase() === targetCode) {
      setAppliedCoupon(targetCode);
      setCouponError(null);
    } else {
      setCouponError(`Invalid coupon code.`);
    }
  };

  const handleRedirectToUpiApp = (appType: 'any' | 'gpay' | 'phonepe' | 'paytm' = 'any') => {
    setIsRedirecting(true);

    let appUri = standardUpiUri;
    if (appType === 'gpay') {
      appUri = `tez://upi/pay?pa=${encodeURIComponent(targetUpiId)}&pn=${encodeURIComponent(receiverName)}&am=${planPrice}&cu=INR&tn=${encodeURIComponent(upiNote)}`;
    } else if (appType === 'phonepe') {
      appUri = `phonepe://pay?pa=${encodeURIComponent(targetUpiId)}&pn=${encodeURIComponent(receiverName)}&am=${planPrice}&cu=INR&tn=${encodeURIComponent(upiNote)}`;
    } else if (appType === 'paytm') {
      appUri = `paytmmp://pay?pa=${encodeURIComponent(targetUpiId)}&pn=${encodeURIComponent(receiverName)}&am=${planPrice}&cu=INR&tn=${encodeURIComponent(upiNote)}`;
    }

    try {
      window.location.href = appUri;
    } catch (e) {
      console.warn('Redirect failed, fallback:', e);
      window.location.href = standardUpiUri;
    }

    setTimeout(() => {
      setIsRedirecting(false);
    }, 1000);
  };

  const handleConfirmAndActivate = (source: string = 'UPI') => {
    setTrialBlockError(null);
    if (isTrialPlan) {
      if (!deviceAuthPermissionGranted) {
        setTrialBlockError('🔒 Device Authentication Permission Required: Please check the permission box below to authenticate your device before activating the ₹2 7-Day Trial.');
        return;
      }
      const status = checkDeviceTrialStatus();
      if (!status.eligible) {
        setTrialBlockError(`🚫 3-Month Device Restriction: Device [${status.deviceId}] already claimed a 7-Day Trial on ${status.lastClaimedDate}. Only 1 trial is available per device in 3 months (${status.cooldownDaysRemaining} days remaining).`);
        return;
      }
    }

    setIsProcessing(true);
    const generatedTxn = utrInput.trim() || ('UPI_REF_' + Math.floor(100000000000 + Math.random() * 900000000000));
    setTransactionId(generatedTxn);

    setTimeout(() => {
      if (isTrialPlan) {
        const claimRes = claim7DayFreeTrial(currentUser.email);
        if (!claimRes.success) {
          setIsProcessing(false);
          setTrialBlockError(claimRes.message);
          return;
        }
      }
      setIsProcessing(false);
      setIsSuccess(true);
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 }
      });
      completePayment(selectedPlanForPayment, source, generatedTxn);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div 
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Clean, secure */}
        <div className="bg-slate-900 dark:bg-slate-950 text-white p-4 sm:p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black">
              ₹
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">Secure Payment Checkout</h3>
              <p className="text-xs text-slate-400">Instant Pass Activation</p>
            </div>
          </div>
          <button 
            onClick={() => {
              if (!isProcessing) {
                setSelectedPlanForPayment(null);
                setIsSuccess(false);
              }
            }}
            disabled={isProcessing}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-4">
          {isSuccess ? (
            /* Success State Receipt */
            <div className="text-center py-3 space-y-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <div>
                <h4 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  Payment Confirmed!
                </h4>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">
                  Pass Activated & Questions Unlocked Instantly
                </p>
              </div>

              {/* Receipt card */}
              <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 text-left text-xs space-y-2 border border-slate-200 dark:border-slate-700">
                <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500">Plan Purchased</span>
                  <span className="font-bold text-slate-800 dark:text-white">{selectedPlanForPayment.name}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500">Amount Paid</span>
                  <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-sm">₹{planPrice}.00</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500">Transaction Ref / UTR</span>
                  <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{transactionId}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Status</span>
                  <span className="inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Confirmed & Active
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedPlanForPayment(null);
                  setIsSuccess(false);
                }}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-emerald-600/20 cursor-pointer transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Start Practicing Mock Tests Now</span>
              </button>
            </div>
          ) : (
            /* Payment Input State */
            <div className="space-y-4">

              {/* Quick Plan Switcher Chips */}
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Selected Pass Plan:
                </span>
                <div className="grid grid-cols-4 gap-1.5">
                  {SUBSCRIPTION_PLANS.map((p) => {
                    const price = p.id === 'day1' ? (paymentConfig.prices.day1 || 2)
                      : p.id === 'single_exam' ? paymentConfig.prices.single_exam
                      : p.id === 'month6' ? paymentConfig.prices.month6
                      : paymentConfig.prices.year1;
                    const isSelected = selectedPlanForPayment.id === p.id;

                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => {
                          setTrialBlockError(null);
                          setSelectedPlanForPayment(p);
                        }}
                        className={`p-1.5 rounded-xl border text-center transition-all cursor-pointer ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/60 ring-2 ring-blue-500/20 font-extrabold text-blue-700 dark:text-blue-300'
                            : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                        }`}
                      >
                        <span className="text-[10px] block font-bold truncate">
                          {p.id === 'day1' ? '7-Day' : p.id === 'single_exam' ? '1-Mo' : p.id === 'month6' ? '6-Mo' : '1-Year'}
                        </span>
                        <span className="text-xs font-black text-slate-900 dark:text-white block">
                          ₹{price}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Summary Bar */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">Plan Selected</span>
                  <span className="font-extrabold text-slate-900 dark:text-white text-xs">
                    {selectedPlanForPayment.name}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">Payable</span>
                  <div className="flex items-baseline gap-1 justify-end">
                    {appliedCoupon && (
                      <span className="text-xs line-through text-slate-400 font-bold">
                        ₹{rawBasePrice}
                      </span>
                    )}
                    <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                      ₹{planPrice}
                    </span>
                  </div>
                </div>
              </div>

              {/* Visitor Device Authentication Permission Box for 7-Day Trial (₹2) */}
              {isTrialPlan && (
                <div className={`p-3 rounded-2xl border-2 space-y-2 text-xs ${
                  !deviceStatus.eligible
                    ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800'
                    : deviceAuthPermissionGranted
                    ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800'
                    : 'bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800'
                }`}>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                      Device Authentication (1 Trial / Device in 3 Months)
                    </span>
                    <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-900 text-emerald-400">
                      {deviceFingerprintId}
                    </span>
                  </div>
                  {!deviceStatus.eligible ? (
                    <p className="text-[11px] font-bold text-rose-700 dark:text-rose-300">
                      🚫 This device already used a 7-Day Trial on {deviceStatus.lastClaimedDate}. Cooldown remaining: {deviceStatus.cooldownDaysRemaining} days (3-Month Policy). Please switch to 1-Mo (₹49) or 6-Mo (₹199).
                    </p>
                  ) : (
                    <label className="flex items-start gap-2 cursor-pointer select-none text-[11px] text-slate-700 dark:text-slate-300 font-medium">
                      <input
                        type="checkbox"
                        checked={deviceAuthPermissionGranted}
                        onChange={() => {
                          requestDeviceAuthenticationPermission();
                          setTrialBlockError(null);
                        }}
                        className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                      <span>
                        I grant <strong>Device Authentication Permission</strong> to verify device ID <strong>{deviceFingerprintId}</strong> for the ₹2 7-Day Trial (Max 1 trial per device in 90 days).
                      </span>
                    </label>
                  )}
                </div>
              )}

              {trialBlockError && (
                <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-bold">
                  {trialBlockError}
                </div>
              )}

              {/* Coupon Code Section - Only show to visitors if admin explicitly allows in admin panel */}
              {paymentConfig.showDiscountCouponToStudents === true && (
                <div className="p-2.5 bg-blue-50/60 dark:bg-blue-950/30 rounded-2xl border border-blue-200 dark:border-blue-900/60 space-y-1.5 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-900 dark:text-blue-200">
                      Have a Discount Coupon?
                    </span>
                    {paymentConfig.couponCode && (
                      <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold bg-blue-100 dark:bg-blue-900 px-2 py-0.5 rounded-full">
                        Use code &ldquo;{paymentConfig.couponCode}&rdquo;
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      placeholder="Enter coupon code"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      disabled={!!appliedCoupon}
                      className="flex-1 px-3 py-1.5 bg-white dark:bg-slate-900 border border-blue-300 dark:border-blue-800 rounded-xl text-xs font-mono font-bold uppercase text-slate-900 dark:text-white"
                    />
                    {appliedCoupon ? (
                      <button
                        type="button"
                        onClick={() => {
                          setAppliedCoupon(null);
                          setCouponInput('');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer hover:bg-slate-300"
                      >
                        Remove
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleApplyCoupon}
                        className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs shadow cursor-pointer transition-all active:scale-95"
                      >
                        Apply
                      </button>
                    )}
                  </div>

                  {couponError && (
                    <p className="text-[11px] text-rose-500 font-semibold">{couponError}</p>
                  )}
                  {appliedCoupon && (
                    <p className="text-[11px] text-emerald-600 font-semibold">
                      ✓ Coupon &ldquo;{appliedCoupon}&rdquo; applied: -{discountPercent}% OFF (Saved ₹{discountAmount})
                    </p>
                  )}
                </div>
              )}

              {/* Payment Method Selector Tabs */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi_app')}
                  className={`p-2.5 rounded-2xl border text-center flex flex-col items-center gap-1 text-xs font-bold transition-all cursor-pointer ${
                    paymentMethod === 'upi_app'
                      ? 'border-blue-500 bg-blue-50/70 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 ring-2 ring-blue-500/20'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <Smartphone className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>UPI App (Redirect)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi_qr')}
                  className={`p-2.5 rounded-2xl border text-center flex flex-col items-center gap-1 text-xs font-bold transition-all cursor-pointer ${
                    paymentMethod === 'upi_qr'
                      ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 ring-2 ring-emerald-500/20'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <QrCode className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>UPI QR Scanner</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-2.5 rounded-2xl border text-center flex flex-col items-center gap-1 text-xs font-bold transition-all cursor-pointer ${
                    paymentMethod === 'card'
                      ? 'border-indigo-500 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-500/20'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>Card / Netbanking</span>
                </button>
              </div>

              {/* TAB 1: UPI App (Direct Intent Redirect) - Strictly NO visible raw UPI ID string */}
              {paymentMethod === 'upi_app' && (
                <div className="space-y-3">
                  <div className="p-3 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-blue-950/40 dark:to-indigo-950/40 rounded-2xl border border-blue-200 dark:border-blue-800/80 text-center space-y-2">
                    <p className="text-xs font-bold text-slate-800 dark:text-white">
                      Tap below to open your installed UPI app and complete payment:
                    </p>

                    {/* Main Big Redirect Button */}
                    <button
                      type="button"
                      onClick={() => handleRedirectToUpiApp('any')}
                      disabled={isRedirecting}
                      className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-extrabold text-sm shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
                    >
                      {isRedirecting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Opening UPI App...</span>
                        </>
                      ) : (
                        <>
                          <Smartphone className="w-4 h-4" />
                          <span>Pay ₹{planPrice} via Any UPI App</span>
                          <ExternalLink className="w-3.5 h-3.5 ml-1 opacity-80" />
                        </>
                      )}
                    </button>
                  </div>

                  {/* Specific App Launch Buttons */}
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1 text-center">
                      Or Open Directly In:
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => handleRedirectToUpiApp('gpay')}
                        className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-blue-500 hover:bg-blue-50/50 flex flex-col items-center gap-0.5 cursor-pointer transition-all active:scale-95"
                      >
                        <span className="text-xs font-black text-slate-800 dark:text-white">
                          <span className="text-emerald-500 font-extrabold">BHIM</span> UPI
                        </span>
                        <span className="text-[9px] text-slate-400">Instant UPI</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleRedirectToUpiApp('phonepe')}
                        className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-purple-500 hover:bg-purple-50/50 flex flex-col items-center gap-0.5 cursor-pointer transition-all active:scale-95"
                      >
                        <span className="text-xs font-black text-purple-600 dark:text-purple-400">
                          PhonePe
                        </span>
                        <span className="text-[9px] text-slate-400">Direct Pay</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleRedirectToUpiApp('paytm')}
                        className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-cyan-500 hover:bg-cyan-50/50 flex flex-col items-center gap-0.5 cursor-pointer transition-all active:scale-95"
                      >
                        <span className="text-xs font-black text-cyan-600 dark:text-cyan-400">
                          Paytm
                        </span>
                        <span className="text-[9px] text-slate-400">UPI App</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: UPI QR Scanner - Strictly NO raw UPI ID text exposed */}
              {paymentMethod === 'upi_qr' && (
                <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700 text-center space-y-2.5">
                  <div className="flex items-center justify-center gap-1.5">
                    <QrCode className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-xs font-extrabold text-slate-800 dark:text-white">
                      Scan with any UPI App: PhonePe, GPay, Paytm, CRED
                    </span>
                  </div>

                  {/* QR Image Display */}
                  <div className="inline-block p-2.5 bg-white rounded-2xl shadow-md border border-slate-200 mx-auto">
                    {paymentConfig.qrCodeUrl ? (
                      <img 
                        src={paymentConfig.qrCodeUrl} 
                        alt="Official UPI QR Scanner" 
                        className="w-44 h-44 object-contain mx-auto rounded-lg"
                      />
                    ) : (
                      <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(standardUpiUri)}`} 
                        alt="Official UPI QR Code" 
                        className="w-44 h-44 mx-auto rounded-lg"
                      />
                    )}
                  </div>

                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Amount to Pay: <span className="font-black text-emerald-600 dark:text-emerald-400 text-sm">₹{planPrice}</span>
                    </div>
                    <span className="text-[11px] text-slate-400 block">
                      Scan using PhonePe, Paytm, BHIM, CRED or any bank UPI app
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRedirectToUpiApp('any')}
                    className="w-full py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-800 dark:text-slate-200 rounded-xl font-bold text-xs flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Or Tap Here to Open UPI App on This Device</span>
                  </button>
                </div>
              )}

              {/* TAB 3: Card / Netbanking */}
              {paymentMethod === 'card' && (
                <div className="space-y-2.5 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <div>
                    <label className="text-[11px] text-slate-600 dark:text-slate-400 font-medium mb-1 block">Card Number</label>
                    <input
                      type="text"
                      defaultValue="4111 •••• •••• 4444"
                      className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-800 dark:text-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] text-slate-600 dark:text-slate-400 font-medium mb-1 block">Expiry</label>
                      <input
                        type="text"
                        defaultValue="12/28"
                        className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-800 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-600 dark:text-slate-400 font-medium mb-1 block">CVV</label>
                      <input
                        type="password"
                        defaultValue="888"
                        maxLength={3}
                        className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-800 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Instant Verification & Activation */}
              <div className="p-3.5 bg-emerald-50/70 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200 dark:border-emerald-800/60 space-y-2.5">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <div>
                    <span className="text-xs font-extrabold text-slate-900 dark:text-white block">
                      Paid via UPI App or QR Scanner?
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">
                      Activate your pass immediately after completing the ₹{planPrice} payment.
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                    UPI Reference / UTR Number (Optional):
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 423871928371 (optional)"
                    value={utrInput}
                    onChange={(e) => setUtrInput(e.target.value.trim())}
                    className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-700 rounded-xl text-xs font-mono text-slate-900 dark:text-white placeholder:text-slate-400"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => handleConfirmAndActivate(paymentMethod === 'card' ? 'Card' : 'UPI')}
                  disabled={isProcessing}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-extrabold text-xs sm:text-sm shadow-md shadow-emerald-600/25 flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-95 disabled:opacity-60"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Activating Your Pass...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>I Have Paid ₹{planPrice} • Activate Pass Instantly</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 text-center">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Verified 256-bit encrypted transaction • Instant Pass Activation</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
