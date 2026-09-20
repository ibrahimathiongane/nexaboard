'use client';

import { useState, useEffect } from 'react';
import type { TeamSize, CurrentTool, Interest, LandingState } from '@/lib/types';
import { useAnalytics } from '@/lib/analytics';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import TrustBar from '@/components/TrustBar';
import PainVsGain from '@/components/PainVsGain';
import BentoGrid from '@/components/BentoGrid';
import RoiCalculator from '@/components/RoiCalculator';
import ComparisonTable from '@/components/ComparisonTable';
import Pricing from '@/components/Pricing';
import Roadmap from '@/components/Roadmap';
import Faq from '@/components/Faq';
import FinalCta from '@/components/FinalCta';
import Footer from '@/components/Footer';
import BetaModal from '@/components/BetaModal';

export default function LandingPage() {
  const [email, setEmail] = useState('');
  const [teamSize, setTeamSize] = useState<TeamSize>('6-10');
  const [currentTool, setCurrentTool] = useState<CurrentTool>('notion');
  const [interest, setInterest] = useState<Interest>('all_in_one');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const analytics = useAnalytics();

  useEffect(() => {
    analytics.track('landing_viewed', {
      referrer: document.referrer || 'direct',
      device: window.innerWidth > 768 ? 'desktop' : 'mobile',
    });
  }, []);

  function openModalWithEmail(initialEmail?: string) {
    if (initialEmail) setEmail(initialEmail);
    setErrorMessage('');
    setIsModalOpen(true);
    analytics.track('hero_email_submitted', {
      email_domain: initialEmail?.split('@')[1] || 'unknown',
    });
  }

  const state: LandingState = {
    email, setEmail,
    teamSize, setTeamSize,
    currentTool, setCurrentTool,
    interest, setInterest,
    isModalOpen, setIsModalOpen,
    status, setStatus,
    errorMessage, setErrorMessage,
    openModalWithEmail,
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-primary-100 selection:text-primary-700">
      <Header onOpenModal={() => openModalWithEmail()} />
      <Hero onOpenModal={openModalWithEmail} />
      <TrustBar />
      <PainVsGain />
      <BentoGrid />
      <RoiCalculator onOpenModal={() => openModalWithEmail()} />
      <ComparisonTable />
      <Pricing onOpenModal={() => openModalWithEmail()} />
      <Roadmap />
      <Faq />
      <FinalCta onOpenModal={() => openModalWithEmail()} />
      <Footer />
      <BetaModal state={state} />
    </div>
  );
}
