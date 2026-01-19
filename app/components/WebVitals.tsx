'use client'

import { useEffect } from 'react'
import { reportWebVitals } from '../lib/analytics'

export default function WebVitals() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      // Track Core Web Vitals
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          // Handle different metric types
          const metric = {
            name: entry.name,
            value: (entry as any).value || (entry as any).duration || 0,
            id: (entry as any).id || '',
            delta: (entry as any).delta || (entry as any).duration || 0,
            rating: (entry as any).rating || 'unknown',
          }
          
          // Only report Core Web Vitals
          if (['LCP', 'FID', 'CLS', 'FCP', 'TTFB'].includes(metric.name)) {
            reportWebVitals(metric)
          }
        }
      })

      try {
        // Observe all performance entries
        observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift', 'paint', 'navigation'] })
      } catch (e) {
        // Fallback for browsers that don't support all entry types
        console.warn('PerformanceObserver not fully supported', e)
      }

      return () => {
        observer.disconnect()
      }
    }
  }, [])

  return null
}

