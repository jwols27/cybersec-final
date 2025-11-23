import { writable, readonly } from 'svelte/store';

interface GoogleInstance {
    accounts: {
        id: {
            initialize: (options: any) => void;
            prompt: () => void;
        };
    };
}

interface GoogleCredentialResponse {
    credential: string;
    select_by?: string;
    clientId?: string;
}

const SCRIPT_TIMEOUT = 10000;

function createGoogleStore() {
    let initPromise: Promise<GoogleInstance> | null = null;

    async function getClientId() {
        try {
            const response = await fetch('https://localhost:3443/auth/oauth-config');
            const config = await response.json();
            return config.GOOGLE_CLIENT_ID;
        } catch {
            throw new Error('Google client ID not configured');
        }
    }

    async function init(
        callback: (response: GoogleCredentialResponse) => void
    ): Promise<GoogleInstance> {
        const cid = await getClientId();

        if (!cid) {
            const errorMsg = 'Google client ID not configured';
            return Promise.reject(new Error(errorMsg));
        }

        if (initPromise) {
            return initPromise;
        }

        if (globalThis.google?.accounts?.id) {
            try {
                globalThis.google.accounts.id.initialize({
                    client_id: cid,
                    use_fedcm_for_prompt: true,
                    callback,
                });
                return Promise.resolve(globalThis.google);
            } catch (err) {
                return Promise.reject(err);
            }
        }

        initPromise = new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://accounts.google.com/gsi/client';
            script.async = true;
            script.defer = true;

            const timeout = setTimeout(() => {
                reject(new Error('Google auth timeout'));
                cleanup();
            }, SCRIPT_TIMEOUT);

            const cleanup = () => {
                clearTimeout(timeout);
                initPromise = null;
            };

            script.onload = () => {
                try {
                    if (!globalThis.google?.accounts?.id) {
                        throw new Error('Google auth SDK not loaded');
                    }

                    globalThis.google.accounts.id.initialize({
                        client_id: cid,
                        use_fedcm_for_prompt: true,
                        callback,
                    });

                    cleanup();
                    resolve(globalThis.google);
                } catch (err) {
                    cleanup();
                    reject(err);
                }
            };

            script.onerror = () => {
                cleanup();
                reject(new Error('Google script load failed'));
            };

            document.head.appendChild(script);
        });

        return initPromise;
    }

    function prompt() {
        try {
            globalThis.google?.accounts.id.prompt();
        } catch {
            throw new Error('Google prompt error')
        }
    }

    return {
        init,
        prompt,
    };
}

export const google = createGoogleStore();