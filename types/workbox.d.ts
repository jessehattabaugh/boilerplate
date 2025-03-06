/**
 * Type declarations for Workbox Service Worker
 */

interface WorkboxPlugin {
  cacheWillUpdate?: (options: {request: Request, response: Response}) => Promise<Response | null>;
  cacheDidUpdate?: (options: {cacheName: string, request: Request, response: Response}) => void;
  cachedResponseWillBeUsed?: (options: {cacheName: string, request: Request, cachedResponse: Response}) => Promise<Response | null>;
  requestWillFetch?: (options: {request: Request}) => Promise<Request>;
  fetchDidFail?: (options: {request: Request}) => void;
}

declare namespace workbox {
  namespace routing {
    function registerRoute(
      route: RegExp | string | ((options: {url: URL, request: Request}) => boolean),
      handler: workbox.strategies.Strategy | ((options: {url: URL, request: Request}) => Promise<Response>),
      method?: string
    ): void;
  }

  namespace strategies {
    class Strategy {
      constructor(options?: {cacheName?: string, plugins?: WorkboxPlugin[]});
      handle(options: {request: Request}): Promise<Response>;
    }

    class CacheFirst extends Strategy {}
    class NetworkFirst extends Strategy {}
    class StaleWhileRevalidate extends Strategy {}
    class NetworkOnly extends Strategy {}
    class CacheOnly extends Strategy {}
  }

  namespace expiration {
    class ExpirationPlugin implements WorkboxPlugin {
      constructor(options: {maxEntries?: number, maxAgeSeconds?: number});
    }
  }

  namespace precaching {
    function precacheAndRoute(entries: Array<string | {url: string, revision: string | null}>): void;
    function cleanupOutdatedCaches(): void;
  }

  namespace core {
    function skipWaiting(): void;
    function clientsClaim(): void;
  }

  namespace cacheableResponse {
    class CacheableResponsePlugin implements WorkboxPlugin {
      constructor(options: {statuses?: number[], headers?: {[key: string]: string}});
    }
  }

  namespace backgroundSync {
    class BackgroundSyncPlugin implements WorkboxPlugin {
      constructor(options: {maxRetentionTime?: number, queueName?: string});
    }
  }
}
