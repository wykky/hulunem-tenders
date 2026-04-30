'use client'

import posthog from 'posthog-js'
import { PostHogProvider as PHProvider, usePostHog } from 'posthog-js/react'
import { Suspense, useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

const POSTHOG_KEY = 'phc_YbgVjkYnZTc8SCMcWNP4dXmHpvdWoa7uTfGR8L69HAt'
const POSTHOG_HOST = 'https://us.i.posthog.com'

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (posthog.__loaded) return
    posthog.init(POSTHOG_KEY, {
      api_host: POSTHOG_HOST,
      person_profiles: 'identified_only',
      cross_subdomain_cookie: true,
      capture_pageview: false, // handled manually below for SPA navigation
      capture_pageleave: true,
      session_recording: { maskAllInputs: true },
      autocapture: true,
      loaded: (ph) => {
        if (process.env.NODE_ENV === 'development') ph.debug()
      },
    })
  }, [])

  return (
    <PHProvider client={posthog}>
      <SuspendedPostHogPageView />
      {children}
    </PHProvider>
  )
}

function PostHogPageView() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const ph = usePostHog()

  useEffect(() => {
    if (!pathname || !ph) return
    let url = window.location.origin + pathname
    const qs = searchParams?.toString()
    if (qs) url += '?' + qs
    ph.capture('$pageview', { $current_url: url })
  }, [pathname, searchParams, ph])

  return null
}

function SuspendedPostHogPageView() {
  // Wrap in Suspense — useSearchParams requires it in App Router
  return (
    <Suspense fallback={null}>
      <PostHogPageView />
    </Suspense>
  )
}
