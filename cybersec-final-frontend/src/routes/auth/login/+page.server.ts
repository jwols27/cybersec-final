import { fail, redirect } from "@sveltejs/kit";
import type { Actions, RequestEvent } from "./$types";

async function handleAuthAction(endpoint: 'login' | 'register', event: RequestEvent) {
    const form = await event.request.formData();
    const email = form.get('email');
    const password = form.get('password');

    if (!email || !password) {
        return fail(400, { email, missingEmail: !email, missingPassword: !password });
    }

    const response = await event.fetch(`https://localhost:3443/auth/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
        return { error: data.error ?? 'Erro ao entrar' };
    }

    if (data.pendingToken) {
        event.cookies.set('pending', data.pendingToken, {
            path: '/',
            httpOnly: true,
            sameSite: 'lax',
            secure: true,
            maxAge: (endpoint === 'login' ? 2 : 5) * 60
        });
    }

    const qrParam = data.qrCodeDataURL ? `?qr=${encodeURIComponent(data.qrCodeDataURL)}` : '';
    return redirect(303, `/auth/2fa${qrParam}`);
}

export const actions: Actions = {
    login: (event) => handleAuthAction('login', event),
    register: (event) => handleAuthAction('register', event),
    googleAuth: async ({ request, cookies, fetch }) => {
        const form = await request.formData();
        const credential = form.get('credential');

        if (!credential) {
            return fail(400, { error: 'Missing credential' });
        }

        const response = await fetch('https://localhost:3443/auth/google', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ credential })
        });

        if (!response.ok) {
            return fail(response.status, { error: 'Authentication failed' });
        }

        const data = await response.json();

        cookies.set('auth', data.authToken, {
            path: '/',
            httpOnly: true,
            sameSite: 'lax',
            secure: true,
            maxAge: 60 * 60
        });

        return redirect(303, '/');
    }
};