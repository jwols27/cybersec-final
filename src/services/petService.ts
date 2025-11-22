export type Pet = {
	id: number;
	name: string;
	sex: 'M' | 'F';
	species: string;
	breed: string;
};

export class PetService {
	getPets(): ReadonlyArray<Pet> {
		return [
			{
				id: 1,
				name: 'Mel',
				sex: 'F',
				species: 'Felino',
				breed: 'Sphynx'
			},
			{
				id: 2,
				name: 'Café',
				sex: 'M',
				species: 'Felino',
				breed: 'Sphynx'
			},
			{
				id: 3,
				name: 'Tino',
				sex: 'M',
				species: 'Felino',
				breed: 'Vira-lata'
			},
			{
				id: 3,
				name: 'Nagito',
				sex: 'M',
				species: 'Felino',
				breed: 'Vira-lata'
			}
		];
	}
}
