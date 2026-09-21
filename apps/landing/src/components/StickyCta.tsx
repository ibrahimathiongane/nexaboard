'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface StickyCtaProps {
  onOpenModal: () => void;
}

export default function StickyCta({ onOpenModal }: StickyCtaProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    function onScroll() {
      setShow(window.scrollY > 600);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -60, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed top-0 left-0 right-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-md shadow-sm"
        >
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-2.5 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2">
              <span className="text-sm font-extrabold text-slate-900">nexaBoard</span>
              <span className="hidden sm:inline text-xs text-slate-500">— Espace de travail unifié pour équipes de 5 à 20 pers.</span>
            </div>
            <button
              type="button"
              onClick={onOpenModal}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary-600 px-4 py-2 text-xs font-bold text-white shadow transition hover:bg-primary-700"
            >
              Rejoindre la Bêta
              <span className="hidden sm:inline">→</span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
