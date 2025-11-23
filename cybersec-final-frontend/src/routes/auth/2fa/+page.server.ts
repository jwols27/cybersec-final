import { fail, redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";

export const actions: Actions = {
    verify: async ({ request, fetch, cookies }) => {
        const form = await request.formData();
        const token = form.get('token');

        if (!token) {
            return fail(400, { token, missing: true })
        }

        const response = await fetch('https://localhost:3443/auth/2fa/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ token })
        });

        const data = await response.json();

        if (!response.ok) {
            if (data.error === 'Pending token expired or invalid' || data.error === 'Missing pending token cookie') {
                return redirect(303, '/auth/login');
            }

            return { error: data.error ?? 'Erro ao entrar' };
        }

        if (data.authToken) {
            cookies.set('auth', data.authToken, {
                path: '/',
                httpOnly: true,
                sameSite: 'lax',
                secure: true,
                maxAge: 60 * 60
            });
        }

        return redirect(303, '/');
    },
};
