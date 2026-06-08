"use client";

import { motion } from "framer-motion";

export default function HeroIllustration() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-white/[0.02]"
    >
      <img
        src="/epochsend-banner.png"
        alt="EpochSend Brand Banner"
        className="w-full h-auto object-cover aspect-[16/10] rounded-2xl hover:scale-[1.01] transition-transform duration-300 ease-out"
      />
    </motion.div>
  );
}
