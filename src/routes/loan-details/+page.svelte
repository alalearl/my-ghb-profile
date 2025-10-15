<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	let accountNumber = $state('');
	let loading = $state(true);
	let fetchingDetails = $state(false);
	let error = $state('');
	let loanData = $state<any>(null);

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
			// โหลดข้อมูลทันที
			fetchLoanDetails();
		}
	});

	async function fetchLoanDetails() {
		fetchingDetails = true;
		error = '';
		loanData = null;

		try {
			// เรียก API ผ่าน internal endpoint เพื่อหลีกเลี่ยง CORS
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
			
			// ตรวจสอบว่ามี error จาก API หรือไม่
			if (data.error) {
				throw new Error(data.error);
			}
			
			loanData = data;
		} catch (err) {
			error = err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการดึงข้อมูล';
			console.error('Error fetching loan details:', err);
		} finally {
			fetchingDetails = false;
		}
	}

	function formatNumber(num: string | number) {
		if (!num) return '0';
		return Number(num).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
	}

	function handleBack() {
		goto('/home');
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
					กลับ
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
									d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
								/>
							</svg>
						</div>
						<div>
							<h1 class="text-xl sm:text-2xl font-bold text-gray-800">
								รายละเอียดบัญชีเงินกู้
							</h1>
							<p class="text-sm text-gray-500">
								บัญชีเลขที่: <span class="font-mono text-orange-500 font-semibold">{accountNumber}</span>
							</p>
						</div>
					</div>
				</div>
			</div>

			{#if fetchingDetails}
				<!-- Loading State -->
				<div class="bg-white rounded-2xl shadow-xl p-12 border border-orange-100 text-center">
					<div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-orange-300 border-t-orange-500 mb-4"></div>
					<p class="text-gray-500">กำลังดึงข้อมูล...</p>
				</div>
			{:else if error}
				<!-- Error State -->
				<div class="bg-white rounded-2xl shadow-xl p-8 border border-red-200">
					<div class="text-center">
						<div class="inline-block p-4 bg-red-50 rounded-full mb-4">
							<svg 
								xmlns="http://www.w3.org/2000/svg" 
								class="h-12 w-12 text-red-500" 
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
						</div>
						<h2 class="text-xl font-bold text-gray-800 mb-2">เกิดข้อผิดพลาด</h2>
						<p class="text-gray-600 mb-6">{error}</p>
						<button
							onclick={fetchLoanDetails}
							class="btn bg-gradient-to-r from-orange-300 to-orange-400 hover:from-orange-400 hover:to-orange-500 border-none text-white font-semibold px-6 py-3 h-auto min-h-0 rounded-lg"
						>
							ลองอีกครั้ง
						</button>
					</div>
				</div>
			{:else if loanData}
				<!-- Success State - Display Data -->
				<div class="space-y-6">
					<!-- ข้อมูลลูกค้า -->
					{#if loanData.loanPaymentInfo}
						<div class="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-orange-100">
							<h2 class="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
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
										d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
									/>
								</svg>
								ข้อมูลลูกค้า
							</h2>
							<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<div class="bg-orange-50 p-4 rounded-lg">
									<p class="text-sm text-gray-600 mb-1">ชื่อ (ไทย)</p>
									<p class="font-semibold text-gray-800">{loanData.loanPaymentInfo.customerNameTH || '-'}</p>
								</div>
								<div class="bg-orange-50 p-4 rounded-lg">
									<p class="text-sm text-gray-600 mb-1">ชื่อ (อังกฤษ)</p>
									<p class="font-semibold text-gray-800">{loanData.loanPaymentInfo.customerNameEN || '-'}</p>
								</div>
							</div>
						</div>

						<!-- ข้อมูลบัญชีเงินกู้ -->
						<div class="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-orange-100">
							<h2 class="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
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
										d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" 
									/>
								</svg>
								ข้อมูลบัญชีเงินกู้
							</h2>
							<div class="space-y-3">
								<div class="flex justify-between items-center py-2 border-b border-gray-100">
									<span class="text-gray-600">เลขที่บัญชีเงินกู้</span>
									<span class="font-mono font-semibold text-gray-800">{loanData.loanPaymentInfo.loanAccountNumber || '-'}</span>
								</div>
								<div class="flex justify-between items-center py-2 border-b border-gray-100">
									<span class="text-gray-600">รหัสผลิตภัณฑ์</span>
									<span class="font-semibold text-gray-800">{loanData.loanPaymentInfo.productCode || '-'}</span>
								</div>
								<div class="flex justify-between items-center py-2 border-b border-gray-100">
									<span class="text-gray-600">เลขอ้างอิง LRM</span>
									<span class="font-mono text-gray-800">{loanData.loanPaymentInfo.lrmReferenceNumber || '-'}</span>
								</div>
							</div>
						</div>

						<!-- ข้อมูลการชำระเงิน -->
						<div class="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl shadow-xl p-6 sm:p-8 border-2 border-orange-200">
							<h2 class="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
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
										d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
									/>
								</svg>
								ข้อมูลการชำระเงิน
							</h2>
							
							<!-- จำนวนเงินที่ต้องชำระ - Highlight -->
							<div class="bg-white rounded-xl p-6 mb-4 shadow-lg">
								<p class="text-sm text-gray-600 mb-2 text-center">จำนวนเงินที่ต้องชำระ</p>
								<p class="text-3xl sm:text-4xl font-bold text-orange-500 text-center">
									฿{loanData.amountDisplay || formatNumber(loanData.loanPaymentInfo.paymentAmount)}
								</p>
							</div>

							<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<div class="bg-white p-4 rounded-lg">
									<p class="text-sm text-gray-600 mb-1">เงินต้น</p>
									<p class="font-semibold text-gray-800">฿{formatNumber(loanData.loanPaymentInfo.principleAmount)}</p>
								</div>
								<div class="bg-white p-4 rounded-lg">
									<p class="text-sm text-gray-600 mb-1">ดอกเบี้ย</p>
									<p class="font-semibold text-gray-800">฿{formatNumber(loanData.loanPaymentInfo.interestAmount)}</p>
								</div>
								<div class="bg-white p-4 rounded-lg">
									<p class="text-sm text-gray-600 mb-1">ค่าธรรมเนียม</p>
									<p class="font-semibold text-gray-800">฿{formatNumber(loanData.loanPaymentInfo.chargeAmount)}</p>
								</div>
								<div class="bg-white p-4 rounded-lg">
									<p class="text-sm text-gray-600 mb-1">ยอดคงเหลือทั้งหมด</p>
									<p class="font-semibold text-orange-600">฿{formatNumber(loanData.loanPaymentInfo.totalOutStandingAmount)}</p>
								</div>
							</div>
						</div>

					<!-- Action Buttons -->
					<div class="flex justify-center">
						<button
							onclick={fetchLoanDetails}
							class="btn bg-white hover:bg-gray-50 border-2 border-orange-300 text-orange-500 font-semibold py-3 px-6 h-auto min-h-0 rounded-lg transition-all duration-200 w-full sm:w-auto"
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
										d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
									/>
								</svg>
								รีเฟรชข้อมูล
							</button>
						</div>
					{/if}
				</div>
			{/if}
		</div>
	</div>
{/if}
