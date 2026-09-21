'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import posthog from 'posthog-js';

if (typeof window !== 'undefined') {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (key) {
    posthog.init(key, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
      capture_pageview: false,
      capture_pageleave: false,
    });
  }
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname) {
      try {
        let url = window.origin + pathname;
        if (searchParams.toString()) {
          url = url + `?${searchParams.toString()}`;
        }
        posthog.capture('$pageview', { '$current_url': url });
      } catch {
        // Silently ignore analytics errors
      }
    }
  }, [pathname, searchParams]);

  return <>{children}</>;
}

export function useAnalytics() {
  return {
    track: (event: string, properties?: Record<string, unknown>) => {
      try {
        posthog.capture(event, properties);
      } catch {
        // Silently ignore analytics errors
      }
    },
    identify: (distinctId: string, properties?: Record<string, unknown>) => {
      try {
        posthog.identify(distinctId, properties);
      } catch {
        // Silently ignore analytics errors
      }
    },
  };
}
