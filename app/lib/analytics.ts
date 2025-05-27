export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

declare global {
  interface Window {
    gtag: (...args: any[]) => void
    dataLayer: any[]
  }
}

// Initialize Google Analytics
export const initGA = (): void => {
  if (!GA_MEASUREMENT_ID) {
    console.warn('Google Analytics Measurement ID is not defined')
    return
  }

  window.dataLayer = window.dataLayer || []
  window.gtag = function gtag() {
    window.dataLayer.push(arguments)
  }
  
  window.gtag('js', new Date())
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: window.location.pathname,
  })
}

// Track page views
export const trackPageView = (url: string): void => {
  console.log("page url", url, GA_MEASUREMENT_ID, typeof window.gtag);
  
  if (!GA_MEASUREMENT_ID || typeof window.gtag === 'undefined') return
  
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: url,
  })
}

// Track custom events
interface EventParameters {
  action: string
  category: string
  label?: string
  value?: number
}

export const trackEvent = ({ action, category, label, value }: EventParameters): void => {
  if (!GA_MEASUREMENT_ID || typeof window.gtag === 'undefined') return

  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  })
}

// Track conversions
export const trackConversion = (eventName: string, parameters?: Record<string, any>): void => {
  if (!GA_MEASUREMENT_ID || typeof window.gtag === 'undefined') return

  window.gtag('event', eventName, parameters)
}