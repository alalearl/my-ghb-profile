<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	let accountNumber = $state('');
	let loading = $state(true);
	let generating = $state(false);
	let error = $state('');
	
	// ข้อมูลจาก loan details
	let customerNameTH = $state('');
	let customerNameEN = $state('');
	let defaultAmount = $state('');
	
	// ฟอร์มข้อมูล
	let amount = $state('');
	let selectedName = $state<'TH' | 'EN'>('TH');
	
	// QR Code result
	let qrCodeUrl = $state('');
	let showQR = $state(false);

	onMount(async () => {
		// เช็คว่ามี cookie accountNumber หรือไม่
		const cookie = document.cookie
			.split('; ')
			.find(row => row.startsWith('accountNumber='))
			?.split('=')[1];

		if (!cookie) {
			goto('/access');
			return;
		}

		accountNumber = cookie;
		
		// ดึงข้อมูล loan details
		await fetchLoanDetails();
	});

	async function fetchLoanDetails() {
		try {
			const response = await fetch('/api/loan-details', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					account: accountNumber
				})
			});

			if (!response.ok) {
				throw new Error('ไม่สามารถดึงข้อมูลได้');
			}

			const data = await response.json();
			
			if (data.error) {
				throw new Error(data.error);
			}
			
			// เก็บข้อมูลสำหรับใช้ในการเจน QR
			if (data.loanPaymentInfo) {
				customerNameTH = data.loanPaymentInfo.customerNameTH || '';
				customerNameEN = data.loanPaymentInfo.customerNameEN || '';
				defaultAmount = data.loanPaymentInfo.paymentAmount || '';
				
				// Autofill จำนวนเงิน
				amount = defaultAmount;
			}
			
			loading = false;
		} catch (err) {
			error = err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการดึงข้อมูล';
			loading = false;
		}
	}

	async function handleGenerateQR() {
		if (!amount || parseFloat(amount) <= 0) {
			error = 'กรุณากรอกจำนวนเงินที่ถูกต้อง';
			return;
		}

		generating = true;
		error = '';
		qrCodeUrl = '';

		try {
			const nameToUse = selectedName === 'TH' ? customerNameTH : customerNameEN;
			
			const response = await fetch('/api/generate-qr', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					account_to: accountNumber,
					value: amount,
					name: nameToUse
				})
			});

			if (!response.ok) {
				throw new Error('ไม่สามารถสร้าง QR Code ได้');
			}
			const data = await response.json();

			
			if (data.error) {
				throw new Error(data.error);
			}
			
			qrCodeUrl = data.qrCodeUrl;
			console.log('QR Code HTML:', qrCodeUrl.substring(0, 200) + '...');
			showQR = true;
		} catch (err) {
			error = err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการสร้าง QR Code';
		} finally {
			generating = false;
		}
	}

	function handleBack() {
		if (showQR) {
			showQR = false;
			qrCodeUrl = '';
		} else {
			goto('/home');
		}
	}

	function formatNumber(num: string) {
		if (!num) return '';
		return Number(num).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
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
		<div class="max-w-2xl mx-auto">
			<!-- Header -->
			<div class="mb-6">
				<button
					onclick={handleBack}
					class="btn bg-white hover:bg-gray-50 border-2 border-orange-300 text-orange-500 font-semibold px-4 py-2 h-auto min-h-0 rounded-lg transition-all duration-200 mb-4"
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
							d="M10 19l-7-7m0 0l7-7m-7 7h18" 
						/>
					</svg>
					{showQR ? 'กลับไปกรอกใหม่' : 'กลับ'}
				</button>

				<div class="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-orange-100">
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
									d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" 
								/>
							</svg>
						</div>
						<div>
							<h1 class="text-xl sm:text-2xl font-bold text-gray-800">
								สร้าง QR Code
							</h1>
							<p class="text-sm text-gray-500">
								บัญชี: <span class="font-mono text-orange-500 font-semibold">{accountNumber}</span>
							</p>
						</div>
					</div>
				</div>
			</div>

			{#if !showQR}
				<!-- Form Section -->
				<div class="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-orange-100">
					<h2 class="text-lg font-bold text-gray-800 mb-6">กรอกข้อมูลสำหรับสร้าง QR Code</h2>

					{#if error}
						<div class="alert bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
							<div class="flex items-center gap-2">
								<svg 
									xmlns="http://www.w3.org/2000/svg" 
									class="h-5 w-5 text-red-500" 
									fill="none" 
									viewBox="0 0 24 24" 
									stroke="currentColor"
								>
									<path 
										stroke-linecap="round" 
										stroke-linejoin="round" 
										stroke-width="2" 
										d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
									/>
								</svg>
								<span class="text-red-700">{error}</span>
							</div>
						</div>
					{/if}

					<form onsubmit={(e) => { e.preventDefault(); handleGenerateQR(); }} class="space-y-6">
						<!-- ชื่อผู้รับ -->
						<div class="form-control">
							<div class="mb-2">
								<span class="text-gray-700 font-medium">ชื่อผู้รับ</span>
							</div>
							<div class="grid grid-cols-2 gap-3">
								<button
									type="button"
									onclick={() => selectedName = 'TH'}
									class="btn {selectedName === 'TH' ? 'bg-gradient-to-r from-orange-300 to-orange-400 text-white border-none' : 'bg-white border-2 border-gray-200 text-gray-700'} h-auto min-h-0 py-3 rounded-lg transition-all duration-200"
								>
									<div class="text-left w-full">
										<div class="text-xs opacity-70 mb-1">ชื่อภาษาไทย</div>
										<div class="font-semibold truncate">{customerNameTH || '-'}</div>
									</div>
								</button>
								<button
									type="button"
									onclick={() => selectedName = 'EN'}
									class="btn {selectedName === 'EN' ? 'bg-gradient-to-r from-orange-300 to-orange-400 text-white border-none' : 'bg-white border-2 border-gray-200 text-gray-700'} h-auto min-h-0 py-3 rounded-lg transition-all duration-200"
								>
									<div class="text-left w-full">
										<div class="text-xs opacity-70 mb-1">English Name</div>
										<div class="font-semibold truncate">{customerNameEN || '-'}</div>
									</div>
								</button>
							</div>
						</div>

						<!-- จำนวนเงิน -->
						<div class="form-control">
							<label for="amount" class="label">
								<span class="label-text text-gray-700 font-medium">จำนวนเงิน (บาท)</span>
							</label>
							<input
								id="amount"
								type="number"
								bind:value={amount}
								placeholder="0.00"
								step="0.01"
								min="0.01"
								class="input input-bordered w-full bg-white border-2 border-gray-200 focus:border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-200 transition-all duration-200 text-lg font-semibold"
								required
								disabled={generating}
							/>
							{#if defaultAmount && amount === defaultAmount}
								<div class="mt-2 text-sm text-gray-500 flex items-center gap-2">
									<svg 
										xmlns="http://www.w3.org/2000/svg" 
										class="h-4 w-4 text-orange-400" 
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
									จำนวนเงินที่ต้องชำระ: ฿{formatNumber(defaultAmount)}
								</div>
							{/if}
						</div>

						<!-- Preview Info -->
						<div class="bg-orange-50 rounded-lg p-4 border border-orange-200">
							<h3 class="font-semibold text-gray-800 mb-3 text-sm">ข้อมูลที่จะใช้สร้าง QR Code</h3>
							<div class="space-y-2 text-sm">
								<div class="flex justify-between">
									<span class="text-gray-600">บัญชีปลายทาง:</span>
									<span class="font-mono font-semibold text-gray-800">{accountNumber}</span>
								</div>
								<div class="flex justify-between">
									<span class="text-gray-600">ชื่อผู้รับ:</span>
									<span class="font-semibold text-gray-800">{selectedName === 'TH' ? customerNameTH : customerNameEN}</span>
								</div>
								<div class="flex justify-between">
									<span class="text-gray-600">จำนวนเงิน:</span>
									<span class="font-semibold text-orange-600">฿{amount ? formatNumber(amount) : '0.00'}</span>
								</div>
							</div>
						</div>

						<!-- Submit Button -->
						<button
							type="submit"
							disabled={generating || !amount}
							class="btn w-full bg-gradient-to-r from-orange-300 to-orange-400 hover:from-orange-400 hover:to-orange-500 border-none text-white font-semibold text-base sm:text-lg py-3 h-auto min-h-0 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
						>
							{#if generating}
								<span class="inline-flex items-center gap-2">
									<span class="inline-block animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></span>
									กำลังสร้าง QR Code...
								</span>
							{:else}
								<span class="inline-flex items-center gap-2">
									<svg 
										xmlns="http://www.w3.org/2000/svg" 
										class="h-6 w-6" 
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
									สร้าง QR Code
								</span>
							{/if}
						</button>
					</form>
				</div>
			{:else}
				<!-- QR Code Display - Compact Version -->
				<div class="bg-white rounded-2xl shadow-xl p-4 sm:p-6 border border-orange-100 animate-fade-in">
					<div class="text-center space-y-3">
						<!-- Success Header - Compact -->
						<div class="flex items-center justify-center gap-3 pb-3 border-b border-gray-200">
							<div class="inline-block p-2 bg-green-50 rounded-full">
								<svg 
									xmlns="http://www.w3.org/2000/svg" 
									class="h-6 w-6 text-green-500" 
									fill="none" 
									viewBox="0 0 24 24" 
									stroke="currentColor"
								>
									<path 
										stroke-linecap="round" 
										stroke-linejoin="round" 
										stroke-width="2" 
										d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
									/>
								</svg>
							</div>
							<div class="text-left">
								<h2 class="text-lg sm:text-xl font-bold text-gray-800">สร้าง QR Code สำเร็จ!</h2>
								<p class="text-sm text-orange-600 font-semibold">฿{formatNumber(amount)}</p>
							</div>
						</div>

						<!-- QR Code Image - Compact -->
						{#if qrCodeUrl}
							<div class="bg-gradient-to-br from-orange-50 to-orange-100 p-3 rounded-xl border border-orange-200 qr-container">
								{@html qrCodeUrl}
							</div>
						{/if}

					<!-- Action Button -->
					<div class="flex justify-center pt-2">
						<button
							onclick={() => { showQR = false; qrCodeUrl = ''; }}
							class="btn bg-gradient-to-r from-orange-300 to-orange-400 hover:from-orange-400 hover:to-orange-500 border-none text-white font-semibold py-3 px-6 h-auto min-h-0 rounded-lg transition-all duration-200 w-full sm:w-auto"
						>
							สร้าง QR Code ใหม่
						</button>
					</div>
					</div>
				</div>
			{/if}
		</div>
	</div>
{/if}

<style>
	@keyframes fade-in {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.animate-fade-in {
		animation: fade-in 0.5s ease-out;
	}

	/* QR Code Container Styles */
	:global(.qr-container img) {
		display: block !important;
		width: 100% !important;
		max-width: 240px !important; /* ลดขนาดลงจาก 300px */
		height: auto !important;
		margin-left: auto !important;
		margin-right: auto !important;
		border-radius: 0.5rem !important;
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
	}

	/* สำหรับหน้าจอใหญ่ ให้ QR Code ใหญ่ขึ้น */
	@media (min-width: 640px) {
		:global(.qr-container img) {
			max-width: 280px !important;
		}
	}
</style>
