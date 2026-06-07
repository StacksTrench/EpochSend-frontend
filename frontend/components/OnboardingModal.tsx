"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, ShieldCheck, Clock, CheckCircle2, X } from "lucide-react";

const slides = [
  {
    id: 1,
    title: "Welcome to EpochSend",
    description: "The next generation of intent-based conditional payments built securely on the Stellar network.",
    icon: <Zap size={48} className="text-[#8FA828]" />,
  },
  {
    id: 2,
    title: "Time-Locked Escrows",
    description: "Easily lock digital assets on-chain. Funds are automatically released to the recipient only when the exact timestamp is reached.",
    icon: <Clock size={48} className="text-[#8FA828]" />,
  },
  {
    id: 3,
    title: "Trusted Arbiters",
    description: "Need human intervention? Assign a trusted third-party arbiter to manually release or refund payments when conditions are met.",
    icon: <ShieldCheck size={48} className="text-[#8FA828]" />,
  },
  {
    id: 4,
    title: "Fully Decentralized",
    description: "Powered entirely by Soroban smart contracts. No middlemen, no hidden fees, and complete transparency.",
    icon: <CheckCircle2 size={48} className="text-[#8FA828]" />,
  },
];

export default function OnboardingModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    // Check local storage to see if user has seen onboarding
    const hasSeenOnboarding = localStorage.getItem("hasSeenEpochSendOnboarding");
    if (!hasSeenOnboarding) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem("hasSeenEpochSendOnboarding", "true");
    setIsOpen(false);
  };

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-[#0A0E05] border border-white/10 shadow-2xl shadow-[#8FA828]/10 rounded-3xl p-8 max-w-md w-full relative overflow-hidden"
          >
            {/* Background Glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#8FA828]/20 rounded-full blur-3xl pointer-events-none" />
            
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 text-gray-500 hover:text-white transition-colors rounded-full hover:bg-white/5"
            >
              <X size={20} />
            </button>

            {/* Slide Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col items-center text-center mt-4 mb-8 space-y-6"
              >
                <div className="p-4 bg-white/5 rounded-full border border-white/10 inline-flex shadow-lg shadow-[#8FA828]/5">
                  {slides[currentSlide].icon}
                </div>
                
                <div className="space-y-3">
                  <h2 className="text-2xl font-black text-white tracking-tight">
                    {slides[currentSlide].title}
                  </h2>
                  <p className="text-sm text-gray-400 leading-relaxed max-w-[280px] mx-auto">
                    {slides[currentSlide].description}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation & Progress */}
            <div className="flex flex-col space-y-6">
              {/* Dots */}
              <div className="flex justify-center space-x-2">
                {slides.map((_, index) => (
                  <div
                    key={index}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      index === currentSlide ? "w-6 bg-[#8FA828]" : "w-1.5 bg-white/20"
                    }`}
                  />
                ))}
              </div>

              {/* Action Button */}
              <button
                onClick={nextSlide}
                className="w-full py-3.5 bg-[#8FA828] text-black font-black text-xs uppercase tracking-widest rounded-xl hover:bg-[#a3c22e] active:scale-[0.99] transition-all shadow-lg shadow-[#8FA828]/20"
              >
                {currentSlide === slides.length - 1 ? "Get Started" : "Continue"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
