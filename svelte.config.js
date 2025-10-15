import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter({
			// Vercel adapter options
			runtime: 'nodejs20.x',
			regions: ['sin1'], // Singapore region for better performance in Asia
			// Enable edge functions if needed
			// edge: false,
			// external: [],
			// split: false
		})
	}
};

export default config;
