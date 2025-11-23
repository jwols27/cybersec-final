import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	server: {
		https: {
			key: '../certs/client.key',
			cert: '../certs/client.crt',
		}
	},
	plugins: [sveltekit()]
});
