
/**
 * Utility functions for optimizing application loading and performance
 */

/**
 * Detects client device capabilities and network conditions
 */
export const detectClientCapabilities = () => {
  const capabilities = {
    connection: 'unknown',
    connectionSpeed: 'unknown',
    deviceMemory: 'unknown',
    deviceCPU: 'unknown',
    deviceType: 'unknown',
    isLowEndDevice: false,
    prefersPrefersReducedMotion: false,
    supportsPush: false
  };
  
  // Connection type detection
  if ('connection' in navigator) {
    const conn = (navigator as any).connection;
    if (conn) {
      capabilities.connection = conn.effectiveType || 'unknown';
      capabilities.connectionSpeed = conn.downlink ? `${conn.downlink} Mbps` : 'unknown';
    }
  }
  
  // Device memory detection
  if ('deviceMemory' in navigator) {
    capabilities.deviceMemory = `${(navigator as any).deviceMemory} GB`;
    capabilities.isLowEndDevice = (navigator as any).deviceMemory < 4;
  }
  
  // CPU detection
  if ('hardwareConcurrency' in navigator) {
    capabilities.deviceCPU = `${navigator.hardwareConcurrency} cores`;
    capabilities.isLowEndDevice = navigator.hardwareConcurrency < 4 || capabilities.isLowEndDevice;
  }
  
  // Device type detection
  if (typeof window !== 'undefined') {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
    capabilities.deviceType = isMobile ? 'mobile' : 'desktop';
  }
  
  // Check if user prefers reduced motion
  if (typeof window !== 'undefined' && window.matchMedia) {
    capabilities.prefersPrefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
  
  // Check if push notifications are supported
  if ('PushManager' in window) {
    capabilities.supportsPush = true;
  }
  
  return capabilities;
};

/**
 * Dynamically adjusts the application based on client capabilities
 */
export const optimizeForClient = () => {
  const capabilities = detectClientCapabilities();
  
  // Reduce animations for low-end devices or users who prefer reduced motion
  if (capabilities.isLowEndDevice || capabilities.prefersPrefersReducedMotion) {
    document.documentElement.classList.add('reduce-motion');
    
    // Disable non-essential animations
    const cssVars = {
      '--animation-duration': '0s',
      '--transition-duration': '0s'
    };
    
    Object.entries(cssVars).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value);
    });
  }
  
  // Load lighter images for low-end devices or slow connections
  if (capabilities.isLowEndDevice || capabilities.connection === '2g' || capabilities.connection === 'slow-2g') {
    document.documentElement.classList.add('low-bandwidth');
  }
  
  return capabilities;
};

/**
 * Load non-critical resources lazily
 */
export const lazyLoadResources = (resources: Array<{ type: 'script' | 'style', src: string, priority?: 'high' | 'low' }>) => {
  // Sort by priority
  const sortedResources = [...resources].sort((a, b) => {
    const aPriority = a.priority === 'high' ? 0 : 1;
    const bPriority = b.priority === 'high' ? 0 : 1;
    return aPriority - bPriority;
  });
  
  sortedResources.forEach(resource => {
    // For high-priority resources, load immediately
    if (resource.priority === 'high') {
      if (resource.type === 'script') {
        const script = document.createElement('script');
        script.src = resource.src;
        script.defer = true;
        document.body.appendChild(script);
      } else if (resource.type === 'style') {
        const link = document.createElement('link');
        link.href = resource.src;
        link.rel = 'stylesheet';
        link.type = 'text/css';
        document.head.appendChild(link);
      }
    } 
    // For low-priority, use Intersection Observer to load when in viewport
    else {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            if (resource.type === 'script') {
              const script = document.createElement('script');
              script.src = resource.src;
              script.defer = true;
              document.body.appendChild(script);
            } else if (resource.type === 'style') {
              const link = document.createElement('link');
              link.href = resource.src;
              link.rel = 'stylesheet';
              link.type = 'text/css';
              document.head.appendChild(link);
            }
            observer.disconnect();
          }
        });
      });
      
      // Observe the bottom of the page as a trigger for loading
      const footer = document.querySelector('footer') || document.body;
      observer.observe(footer);
    }
  });
};

/**
 * Apply idle-time optimizations when browser is idle
 */
export const runWhenIdle = (callback: () => void, timeout = 2000) => {
  if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(() => callback(), { timeout });
  } else {
    // Fallback for browsers that don't support requestIdleCallback
    setTimeout(callback, 1);
  }
};

/**
 * Precache critical resources for future navigations
 */
export const precacheResources = (urls: string[]) => {
  if ('caches' in window) {
    runWhenIdle(async () => {
      try {
        const cache = await caches.open('medisyync-precache');
        await cache.addAll(urls);
      } catch (error) {
        console.error('Precaching failed:', error);
      }
    });
  }
};
