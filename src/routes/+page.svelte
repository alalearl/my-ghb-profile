<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	let loading = $state(true);

	onMount(() => {
		// เช็คว่ามี cookie accountNumber หรือไม่
		const accountNumber = document.cookie
			.split('; ')
			.find(row => row.startsWith('accountNumber='))
			?.split('=')[1];

		if (accountNumber) {
			// ถ้ามี cookie ให้ไปหน้า home
			goto('/home');
		} else {
			// ถ้าไม่มี cookie ให้ไปหน้า access
			goto('/access');
		}
	});
</script>

<div class="min-h-screen flex items-center justify-center p-4">
	<div class="text-center">
		<div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-orange-300 border-t-orange-500"></div>
		<p class="mt-4 text-gray-500">กำลังตรวจสอบ...</p>
	</div>
</div>
