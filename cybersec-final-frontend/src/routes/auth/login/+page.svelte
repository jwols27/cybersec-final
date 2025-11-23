<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageProps } from './$types';

	let { form }: PageProps = $props();
</script>

<form method="POST" action="?/login" use:enhance>
	{#if form?.missingEmail}<p class="error">E-mail não preenchido</p>{/if}
	<label for="email"> Email </label>
	<input name="email" autocomplete="email" type="email" value={form?.email ?? ''} />

	{#if form?.missingPassword}<p class="error">Senha não preenchida</p>{/if}
	<label for="password"> Senha </label>
	<input name="password" type="password" />

	<button>Entrar</button>
	<button formaction="?/register">Registrar</button>
</form>

{#if form?.error}
	<p>Erro: {form?.error}</p>
{/if}
