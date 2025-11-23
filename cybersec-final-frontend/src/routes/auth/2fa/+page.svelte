<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();
</script>

<h1>2FA</h1>

{#if data.qr}
	<img src={data.qr} alt="2FA QR Code" />
	<hr />
{/if}

<form method="POST" action="?/verify" use:enhance>
	{#if form?.missing}<p class="error">Código não preenchido</p>{/if}
	<label for="token"> Código </label>
	<input name="token" value={form?.token ?? ''} />

	<button>Verificar</button>
</form>

{#if form?.error}
	<p>Error: {form?.error}</p>
{/if}
