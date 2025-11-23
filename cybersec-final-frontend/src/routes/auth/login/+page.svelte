<script lang="ts">
	import { enhance } from '$app/forms';
	import { onMount } from 'svelte';
	import type { PageProps } from './$types';
	import { google } from '$lib/stores/google';

	let { form }: PageProps = $props();
	let authStatus = $state<{ success?: boolean; error?: string }>({});

	let formElement: HTMLFormElement;

	async function handleGoogleLogin() {
		await google.init((response) => {
			const credentialInput = formElement.querySelector('input[name="credential"]') as HTMLInputElement;
			if (credentialInput) {
				credentialInput.value = response.credential;
				formElement.requestSubmit();
			}
		});
	}

	onMount(() => {
		handleGoogleLogin();
	});
</script>

<h1 style="margin-bottom: 1em;">Login</h1>

<form method="POST" action="?/login" use:enhance>
	<label for="email"> Email </label>
	<input name="email" autocomplete="email" type="email" value={form?.email ?? ''} />
	{#if form?.missingEmail}<p class="error">E-mail não preenchido</p>{/if}

	<label for="password"> Senha </label>
	<input name="password" type="password" />
	{#if form?.missingPassword}<p class="error">Senha não preenchida</p>{/if}

	<div class="actions">
		<button>Entrar</button>
		<button formaction="?/register">Registrar</button>
	</div>
</form>

{#if form?.error}
	<p>Erro: {form?.error}</p>
{/if}

<div class="continue-with"><span>Ou continuar com</span></div>

<form method="POST" action="?/googleAuth" bind:this={formElement} use:enhance>
	<input type="hidden" name="credential" value="" />
	<button type="button" class="google-button" onclick={google.prompt}>Google</button>
</form>
{#if authStatus.success}
	<p>Autenticado com sucesso!</p>
{:else if authStatus.error}
	<p>Erro: {authStatus.error}</p>
{/if}

<style>
	form {
		display: flex;
		flex-direction: column;
		gap: 0.5em;
	}

	form > label {
		font-size: 0.9em;
		margin-top: 1em;
		font-weight: 500;
	}

	form > .actions {
		gap: 0.5em;
		display: flex;
		margin-top: 2em;

		> button {
			flex: 1;
		}
	}

	.continue-with {
		margin: 2em 0;
		position: relative;
		text-align: center;

		> span {
			display: inline-block;
			position: relative;
			background-color: #24273a;
			padding: 0 0.5em;
		}

		&::before {
			left: 0;
			top: 50%;
			height: 1px;
			width: 100%;
			position: absolute;
			content: '';
			background-color: #a5adcb;
			z-index: 0;
		}
	}

	.google-button {
		margin: 0 auto;
		width: max-content;
	}
</style>
