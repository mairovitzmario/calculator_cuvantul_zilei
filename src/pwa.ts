// PWA utilities
export const registerServiceWorker = async () => {
    if ('serviceWorker' in navigator) {
        try {
            const registration = await navigator.serviceWorker.register('/sw.js');
            console.log('Service Worker registered successfully:', registration);

            // Check for updates
            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                if (newWorker) {
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            // New content is available, notify user
                            console.log('New content available, please refresh.');
                        }
                    });
                }
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
    };

    return { handleInstallClick };
};
