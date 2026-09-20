'use client';

import { Suspense } from 'react';
import { PostHogProvider } from '@/lib/analytics';
import CookieConsent from '@/components/CookieConsent';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={null}>
      <PostHogProvider>
        {children}
        <CookieConsent />
      </PostHogProvider>
    </Suspense>
  );
}
