<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();
</script>

<h1 style="margin-bottom: 1em;">2FA</h1>

{#if data.qr}
	<img src={data.qr} alt="2FA QR Code" />
	<hr />
{/if}

<form method="POST" action="?/verify" use:enhance>
	{#if form?.missing}<p class="error">Código não preenchido</p>{/if}
	<label for="token"> Código: </label>
	<div>
		<input name="token" value={form?.token ?? ''} />
		<button>Verificar</button>
	</div>
</form>

{#if form?.error}
	<p>Erro: {form?.error}</p>
{/if}

<style>
	img {
		width: 75%;
		margin: 0 auto;
	}

	form {
		margin: 1em auto;
	}

	form > label {
		display: block;
		font-size: 0.9em;
		margin-bottom: 0.5em;
		font-weight: 500;
	}
</style>
