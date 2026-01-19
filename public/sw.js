/**
 * Service Worker for Performance Optimization
 * Implements caching strategies for static assets and API responses
 */

const CACHE_VERSION = 'v1';
const STATIC_CACHE = `static-${CACHE_VERSION}`;
const API_CACHE = `api-${CACHE_VERSION}`;
const IMAGE_CACHE = `images-${CACHE_VERSION}`;

// Static assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/favicon.ico',
];

// API routes that can be cached
const CACHEABLE_API_ROUTES = [
  '/api/v1/dashboard_stats',
  '/api/v1/personal_stats',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => {
            return name.startsWith('static-') || 
                   name.startsWith('api-') || 
                   name.startsWith('images-');
          })
          .filter((name) => {
            return name !== STATIC_CACHE && 
                   name !== API_CACHE && 
                   name !== IMAGE_CACHE;
          })
          .map((name) => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    })
    .then(() => self.clients.claim())
  );
});

// Fetch event - handle requests
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension and other non-http requests
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // Handle API requests
  if (url.pathname.includes('/api/')) {
    event.respondWith(handleAPIRequest(request));
    return;
  }

  // Handle images
  if (request.destination === 'image' || url.pathname.match(/\.(jpg|jpeg|png|gif|webp|avif|svg)$/i)) {
    event.respondWith(handleImageRequest(request));
    return;
  }

  // Handle static assets (JS, CSS)
  if (isStaticAsset(url.pathname)) {
    event.respondWith(handleStaticRequest(request));
    return;
  }

  // Default: Network first with cache fallback
  event.respondWith(
    fetch(request)
      .then((response) => {
        // Cache successful responses
        if (response.ok) {
          const responseClone = response.clone();
          caches.open(STATIC_CACHE).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        return response;
      })
      .catch(() => caches.match(request))
  );
});

/**
 * Check if URL is a static asset
 */
function isStaticAsset(pathname) {
  return pathname.match(/\.(js|css|woff|woff2|ttf|eot)$/i) ||
         pathname.startsWith('/_next/static/') ||
         pathname.startsWith('/static/');
}

/**
 * Handle static assets - Cache First strategy
 * Returns cached version immediately, updates in background
 */
async function handleStaticRequest(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    // Update cache in background
    fetch(request)
      .then((response) => {
        if (response.ok) {
          const responseClone = response.clone();
          caches.open(STATIC_CACHE).then((cache) => {
            cache.put(request, responseClone);
          });
        }
      })
      .catch(() => {
        // Ignore fetch errors for background updates
      });
    
    return cachedResponse;
  }
  
  // Not in cache, fetch from network
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const responseClone = networkResponse.clone();
      caches.open(STATIC_CACHE).then((cache) => {
        cache.put(request, responseClone);
      });
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] Network failed for static asset:', request.url);
    return new Response('Offline', { status: 503 });
  }
}

/**
 * Handle API requests - Network First with Cache Fallback
 * Returns fresh data when possible, cached data when offline
 */
async function handleAPIRequest(request) {
  const url = new URL(request.url);
  
  // Check if this API route should be cached
  const isCacheable = CACHEABLE_API_ROUTES.some(route => 
    url.pathname.includes(route)
  );

  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok && isCacheable) {
      // Cache successful GET responses
      const cache = await caches.open(API_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] Network failed, trying cache:', url.pathname);
    
    // Network failed, try cache
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      // Add header to indicate this is cached data
      const headers = new Headers(cachedResponse.headers);
      headers.set('X-SW-Cache', 'true');
      
      return new Response(cachedResponse.body, {
        status: cachedResponse.status,
        statusText: cachedResponse.statusText,
        headers,
      });
    }
    
    // No cache, return error
    return new Response(
      JSON.stringify({ error: 'Offline', message: 'No cached data available' }),
      { 
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

/**
 * Handle image requests - Cache First with Network Fallback
 */
async function handleImageRequest(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const responseClone = networkResponse.clone();
      caches.open(IMAGE_CACHE).then((cache) => {
        cache.put(request, responseClone);
      });
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] Network failed for image:', request.url);
    // Return a placeholder or error image
    return new Response('Image unavailable', { status: 503 });
  }
}

