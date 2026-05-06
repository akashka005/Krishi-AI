import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, CreditCard, ShieldCheck, Sparkles, Loader2, ChevronRight } from 'lucide-react';

export default function UpgradeModal({ isOpen, onClose }) {
  const [step, setStep] = useState('plans');
  const [selectedPlan, setSelectedPlan] = useState(null);

  if (!isOpen) return null;

  const plans = [
    {
      name: "Free",
      price: "₹0",
      features: ["10 queries/day", "Basic crop advice", "Weather alerts"],
      highlight: false
    },
    {
      name: "Pro",
      price: "₹499/mo",
      features: ["100 queries/day", "Priority response", "Voice mode"],
      highlight: false
    },
    {
      name: "Pro+",
      price: "₹999/mo",
      features: ["Unlimited queries", "Disease Detection (Vision)", "24/7 Support"],
      highlight: true
    }
  ];

  const handleSelectPlan = (plan) => {
    if (plan.name === 'Free') return;
    setSelectedPlan(plan);
    setStep('checkout');
  };

  const handleConfirmPayment = async () => {
    setStep('processing');
    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/v1/usage/upgrade?tier=${selectedPlan.name}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        setStep('success');
      } else {
        alert("Payment failed. Please try again.");
        setStep('checkout');
      }
    } catch (err) {
      setStep('success');
    }
  };

  const resetAndClose = () => {
    setStep('plans');
    setSelectedPlan(null);
    onClose();
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-earth-900/60 backdrop-blur-md" onClick={onClose} />

      <motion.div
        layout
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-[2.5rem] w-full max-w-4xl relative z-10 shadow-2xl overflow-hidden flex flex-col md:flex-row"
      >
        <div className="md:w-1/3 bg-earth-50 p-8 border-r border-earth-100 flex flex-col justify-center">
          <div className="mb-6">
            <span className="text-4xl mb-4 block">🚜</span>
            <h3 className="text-xl font-bold text-earth-900">Empower Your Farm</h3>
            <p className="text-sm text-earth-500 mt-2">Join 10,000+ farmers using Smart Farmer AI to increase crop yields.</p>
          </div>

          <div className="space-y-4">
            {[
              { icon: ShieldCheck, text: "Secure Payments" },
              { icon: Sparkles, text: "AI Disease Detection" },
              { icon: Check, text: "Expert Support" }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-xs font-medium text-earth-600">
                <item.icon className="w-4 h-4 text-primary-500" />
                {item.text}
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 p-8 md:p-10 relative">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 text-earth-400 hover:text-earth-900 hover:bg-earth-100 rounded-full transition z-20"
          >
            <X className="w-5 h-5" />
          </button>

          <AnimatePresence mode="wait">
            {step === 'plans' && (
              <motion.div
                key="plans"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="mb-8">
                  <h2 className="text-3xl font-black text-earth-900 mb-2">Select Your Plan</h2>
                  <p className="text-earth-500">Choose the best tools for your agricultural journey.</p>
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  {plans.map((plan, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleSelectPlan(plan)}
                      className={`rounded-3xl p-5 border-2 cursor-pointer transition-all hover:shadow-lg ${plan.highlight ? 'border-primary-500 bg-primary-50/20' : 'border-earth-100 hover:border-primary-200'}`}
                    >
                      <h4 className="font-bold text-earth-900">{plan.name}</h4>
                      <div className="text-xl font-black text-primary-700 my-2">{plan.price}</div>
                      <ul className="space-y-2">
                        {plan.features.slice(0, 3).map((f, i) => (
                          <li key={i} className="text-[10px] text-earth-600 flex items-center gap-1">
                            <Check className="w-3 h-3 text-primary-500" /> {f}
                          </li>
                        ))}
                      </ul>
                      <button
                        className={`w-full mt-4 py-2 rounded-xl text-xs font-bold ${plan.highlight ? 'bg-primary-600 text-white' : 'bg-earth-100 text-earth-700'}`}
                      >
                        {plan.name === 'Free' ? 'Current' : 'Select'}
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 'checkout' && (
              <motion.div
                key="checkout"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <button onClick={() => setStep('plans')} className="text-primary-600 text-sm font-bold flex items-center gap-1 mb-6">
                  <ChevronRight className="w-4 h-4 rotate-180" /> Back to plans
                </button>

                <h2 className="text-3xl font-black text-earth-900 mb-2">Secure Checkout</h2>
                <div className="bg-earth-50 rounded-2xl p-4 mb-6 flex justify-between items-center">
                  <div>
                    <span className="text-xs uppercase font-bold text-earth-400">Plan</span>
                    <p className="font-bold text-earth-900">{selectedPlan.name}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs uppercase font-bold text-earth-400">Total</span>
                    <p className="font-black text-primary-700">{selectedPlan.price}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 relative">
                      <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-earth-400 w-5 h-5" />
                      <input className="w-full pl-12 pr-4 py-4 bg-earth-50 border border-earth-200 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500/50" placeholder="Card Number" defaultValue="4242 4242 4242 4242" />
                    </div>
                    <input className="pl-4 pr-4 py-4 bg-earth-50 border border-earth-200 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500/50" placeholder="MM/YY" defaultValue="12/26" />
                    <input className="pl-4 pr-4 py-4 bg-earth-50 border border-earth-200 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500/50" placeholder="CVC" defaultValue="123" />
                  </div>

                  <button
                    onClick={handleConfirmPayment}
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white py-5 rounded-2xl font-black text-lg transition-all shadow-xl shadow-primary-500/30 flex items-center justify-center gap-3"
                  >
                    Pay {selectedPlan.price}
                  </button>
                  <p className="text-center text-[10px] text-earth-400">This is a mock payment for demonstration purposes.</p>
                </div>
              </motion.div>
            )}

            {step === 'processing' && (
              <motion.div
                key="processing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center py-20"
              >
                <Loader2 className="w-16 h-16 text-primary-500 animate-spin mb-6" />
                <h2 className="text-2xl font-black text-earth-900">Processing Payment...</h2>
                <p className="text-earth-500">Please do not refresh the page.</p>
              </motion.div>
            )}

            {step === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full flex flex-col items-center justify-center text-center py-10"
              >
                <div className="w-24 h-24 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mb-6">
                  <Check className="w-12 h-12 stroke-[4]" />
                </div>
                <h2 className="text-4xl font-black text-earth-900 mb-2">Payment Successful!</h2>
                <p className="text-earth-500 mb-8 px-10">Welcome to <b>Smart Farmer {selectedPlan.name}</b>. Your advanced tools are now unlocked.</p>
                <button
                  onClick={resetAndClose}
                  className="bg-earth-900 text-white px-10 py-4 rounded-2xl font-bold hover:bg-black transition-all"
                >
                  Start Farming
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}