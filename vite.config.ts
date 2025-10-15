import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	server: {
		allowedHosts: ['.vercel.app', '.ngrok-free.app', 'localhost', 'my-ghb-profile.vercel.app']
	}
});
