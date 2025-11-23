import { redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";
import type { PageServerLoad } from './$types';

export type Pet = {
    id: number;
    name: string;
    sex: 'M' | 'F';
    species: string;
    breed: string;
};

export const load: PageServerLoad = async ({ fetch, locals }) => {
    const res = await fetch('https://localhost:3443/user/data');
    const json = await res.json();

    return { pets: json.data as ReadonlyArray<Pet>, user: locals.user };
};



export const actions: Actions = {
    logout: async ({ fetch, cookies }) => {
        await fetch(`https://localhost:3443/auth/logout`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        });

        cookies.delete("auth", { path: '/' });

        return redirect(303, `/auth/login`);
    }
}