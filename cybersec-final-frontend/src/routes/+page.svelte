<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const getSpeciesLabel = (species: string, sex: 'M' | 'F') => {
		const possibilidades: Record<string, Record<'M' | 'F', string>> = {
			Felino: {
				M: 'Gato',
				F: 'Gata'
			},
			Canino: {
				M: 'Cachorro',
				F: 'Cachorra'
			}
		};
		return possibilidades[species][sex];
	};
</script>

{#if data.user}
	<form method="POST" action="?/logout" use:enhance>
		<button> Sair </button>
		<p>Logado como {data.user.email}</p>
	</form>
{/if}

<section class="pets-section">
	{#each data.pets as pet}
		<div class="card">
			<b>{pet.name}</b>
			<p>{getSpeciesLabel(pet.species, pet.sex)}, {pet.breed}</p>
		</div>
	{/each}
</section>

<style>
	form {
		gap: 0.5em;
		display: flex;
		margin-bottom: 2em;
		align-items: center;
	}

	.card {
		padding: 1em;
		border-radius: 12px;
		border: 1px solid #6e738d;
		background-color: #363a4f;
		transition: all 200ms ease;

		> b {
			display: block;
			margin-bottom: 0.25em;
		}

		> p {
			font-size: 0.9em;
		}

		&:hover {
			border-color: #b7bdf8;
		}
	}

	.pets-section {
		gap: 1em;
		display: grid;
		grid-template-columns: 1fr 1fr;
	}
</style>
