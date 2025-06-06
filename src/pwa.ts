// PWA utilities
export const registerServiceWorker = async () => {
    if ('serviceWorker' in navigator) {
        try {
            const registration = await navigator.serviceWorker.register('/sw.js', {
                updateViaCache: 'none' // Always check for updates
            });
            console.log('Service Worker registered successfully:', registration);

            // Check for updates immediately
            registration.update();

            // Check for updates
            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                console.log('New service worker found, installing...');

                if (newWorker) {
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed') {
                            if (navigator.serviceWorker.controller) {
                                // New content is available, notify user
                                console.log('New content available, please refresh.');
                                // Optionally auto-refresh or show notification
                                window.location.reload();
                            } else {
                                // Content is cached for the first time
                                console.log('Content is cached for offline use.');
                            }
                        }
                    });
                }
            });

            // Listen for messages from the service worker
            navigator.serviceWorker.addEventListener('message', (event) => {
                console.log('Message from SW:', event.data);
            });

        } catch (error) {
            console.error('Service Worker registration failed:', error);
        }
    }
};

export const checkForPWAInstall = () => {
    let deferredPrompt: any;

    window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent Chrome 67 and earlier from automatically showing the prompt
        e.preventDefault();
        // Stash the event so it can be triggered later
        deferredPrompt = e;

        // Show install button or banner
        showInstallPromotion();
    });

    const showInstallPromotion = () => {
        // You can create a custom install button here
        console.log('PWA install available');
    };

    // Handle the install prompt
    const handleInstallClick = async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            console.log(`User response to the install prompt: ${outcome}`);
            deferredPrompt = null;
        }
    }; return { handleInstallClick };
};

// Debug utility to clear all caches
export const clearAllCaches = async () => {
    if ('caches' in window) {
        const cacheNames = await caches.keys();
        console.log('Clearing caches:', cacheNames);
        await Promise.all(
            cacheNames.map(cacheName => caches.delete(cacheName))
        );
        console.log('All caches cleared');
    }

    // Also unregister service worker
    if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(
            registrations.map(registration => registration.unregister())
        );
        console.log('Service workers unregistered');
    }
};

// Add to window object for debugging
if (typeof window !== 'undefined') {
    (window as any).clearAllCaches = clearAllCaches;
}
