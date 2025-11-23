import { redirect } from '@sveltejs/kit';

export const handle = async ({ event, resolve }) => {
    const token = event.cookies.get('auth');

    const publicRoutes = ['/auth/login', '/auth/2fa'];
    if (publicRoutes.includes(event.url.pathname)) {
        return resolve(event);
    }

    if (!token) {
        throw redirect(303, '/auth/login');
    }

    try {
        const res = await event.fetch('https://localhost:3443/auth/me', {
            credentials: 'include'
        });

        if (!res.ok) {
            throw new Error('Not authenticated');
        }

        const data = await res.json();
    } catch {
        throw redirect(303, '/auth/login');
    }

    return resolve(event);
};
