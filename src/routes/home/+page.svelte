<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	let accountNumber = $state('');
	let loading = $state(true);

	onMount(() => {
		// เช็คว่ามี cookie accountNumber หรือไม่
		const cookie = document.cookie
			.split('; ')
			.find(row => row.startsWith('accountNumber='))
			?.split('=')[1];

		if (!cookie) {
			// ถ้าไม่มี cookie ให้ไปหน้า access
			goto('/access');
		} else {
			accountNumber = cookie;
			loading = false;
		}
	});

	function handleLogout() {
		// ลบ cookie
		document.cookie = 'accountNumber=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
		goto('/access');
	}
</script>

{#if loading}
	<div class="min-h-screen flex items-center justify-center p-4">
		<div class="text-center">
			<div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-orange-300 border-t-orange-500"></div>
			<p class="mt-4 text-gray-500">กำลังโหลด...</p>
		</div>
	</div>
{:else}
	<div class="min-h-screen p-4 sm:p-6 md:p-8">
		<div class="max-w-4xl mx-auto">
			<!-- Header -->
			<div class="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-orange-100 mb-6">
				<div class="flex flex-col sm:flex-row items-center justify-between gap-4">
					<div class="flex items-center gap-4">
						<div class="p-3 bg-orange-50 rounded-full">
							<svg 
								xmlns="http://www.w3.org/2000/svg" 
								class="h-8 w-8 text-orange-400" 
								fill="none" 
								viewBox="0 0 24 24" 
								stroke="currentColor"
							>
								<path 
									stroke-linecap="round" 
									stroke-linejoin="round" 
									stroke-width="2" 
									d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
								/>
							</svg>
						</div>
						<div>
							<h1 class="text-xl sm:text-2xl font-bold text-gray-800">
								บัญชีเงินกู้
							</h1>
							<p class="text-sm text-gray-500">
								บัญชี: <span class="font-mono text-orange-500 font-semibold">{accountNumber}</span>
							</p>
						</div>
					</div>
					<button
						onclick={handleLogout}
						class="btn bg-white hover:bg-gray-50 border-2 border-orange-300 text-orange-500 font-semibold px-6 py-2 h-auto min-h-0 rounded-lg transition-all duration-200"
					>
						<svg 
							xmlns="http://www.w3.org/2000/svg" 
							class="h-5 w-5 mr-2" 
							fill="none" 
							viewBox="0 0 24 24" 
							stroke="currentColor"
						>
							<path 
								stroke-linecap="round" 
								stroke-linejoin="round" 
								stroke-width="2" 
								d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
							/>
						</svg>
						ออกจากระบบ
					</button>
				</div>
			</div>

			<!-- Main Content -->
			<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
				<!-- Card 1 - เช็ครายละเอียด/สถานะ -->
				<a href="/loan-details" class="bg-white rounded-2xl shadow-lg p-6 border border-orange-100 hover:shadow-xl transition-all duration-200 hover:scale-[1.02] cursor-pointer">
					<div class="flex items-center gap-4 mb-4">
						<div class="p-3 bg-orange-50 rounded-lg">
							<svg 
								xmlns="http://www.w3.org/2000/svg" 
								class="h-6 w-6 text-orange-400" 
								fill="none" 
								viewBox="0 0 24 24" 
								stroke="currentColor"
							>
								<path 
									stroke-linecap="round" 
									stroke-linejoin="round" 
									stroke-width="2" 
									d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
								/>
							</svg>
						</div>
						<h2 class="text-lg font-bold text-gray-800">เช็ครายละเอียด/สถานะ</h2>
					</div>
					<p class="text-gray-600 mb-4">
						ดูข้อมูลและสถานะบัญชีเงินกู้ของคุณ
					</p>
					<div class="flex items-center text-orange-500 font-semibold">
						<span>ดูรายละเอียด</span>
						<svg 
							xmlns="http://www.w3.org/2000/svg" 
							class="h-5 w-5 ml-2" 
							fill="none" 
							viewBox="0 0 24 24" 
							stroke="currentColor"
						>
							<path 
								stroke-linecap="round" 
								stroke-linejoin="round" 
								stroke-width="2" 
								d="M9 5l7 7-7 7" 
							/>
						</svg>
					</div>
				</a>

				<!-- Card 2 - เจน QR Code -->
				<a href="/generate-qr" class="bg-white rounded-2xl shadow-lg p-6 border border-orange-100 hover:shadow-xl transition-all duration-200 hover:scale-[1.02] cursor-pointer">
					<div class="flex items-center gap-4 mb-4">
						<div class="p-3 bg-orange-50 rounded-lg">
							<svg 
								xmlns="http://www.w3.org/2000/svg" 
								class="h-6 w-6 text-orange-400" 
								fill="none" 
								viewBox="0 0 24 24" 
								stroke="currentColor"
							>
								<path 
									stroke-linecap="round" 
									stroke-linejoin="round" 
									stroke-width="2" 
									d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" 
								/>
							</svg>
						</div>
						<h2 class="text-lg font-bold text-gray-800">สร้าง QR Code</h2>
					</div>
					<p class="text-gray-600 mb-4">
						สร้าง QR Code สำหรับชำระเงิน
					</p>
					<div class="flex items-center text-orange-500 font-semibold">
						<span>สร้าง QR Code</span>
						<svg 
							xmlns="http://www.w3.org/2000/svg" 
							class="h-5 w-5 ml-2" 
							fill="none" 
							viewBox="0 0 24 24" 
							stroke="currentColor"
						>
							<path 
								stroke-linecap="round" 
								stroke-linejoin="round" 
								stroke-width="2" 
								d="M9 5l7 7-7 7" 
							/>
						</svg>
					</div>
				</a>
			</div>

			<!-- Info Section -->
			<div class="mt-6 bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl p-6 border border-orange-200">
				<div class="flex items-start gap-4">
					<div class="p-2 bg-white rounded-lg">
						<svg 
							xmlns="http://www.w3.org/2000/svg" 
							class="h-6 w-6 text-orange-500" 
							fill="none" 
							viewBox="0 0 24 24" 
							stroke="currentColor"
						>
							<path 
								stroke-linecap="round" 
								stroke-linejoin="round" 
								stroke-width="2" 
								d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
							/>
						</svg>
					</div>
					<div>
						<h3 class="font-bold text-gray-800 mb-2">ข้อมูลสำคัญ</h3>
						<p class="text-sm text-gray-600">
							นี่คือบัญชีเงินกู้เลขที่ <span class="font-mono font-semibold text-orange-600">{accountNumber}</span> 
							คุณสามารถเช็คสถานะและสร้าง QR Code สำหรับชำระเงินได้
						</p>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}
