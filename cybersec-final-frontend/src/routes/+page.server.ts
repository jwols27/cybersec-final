import type { PageServerLoad } from './$types';

export type Pet = {
    id: number;
    name: string;
    sex: 'M' | 'F';
    species: string;
    breed: string;
};

export const load: PageServerLoad = async ({ fetch }) => {
    const res = await fetch('https://localhost:3443/user/data');
    const json = await res.json();

    return { pets: json.data as ReadonlyArray<Pet> };
};