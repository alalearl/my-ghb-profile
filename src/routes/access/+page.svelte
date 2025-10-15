<script lang="ts">
	import { goto } from '$app/navigation';

	let accountNumber = $state('');
	let isSubmitting = $state(false);

	function handleSubmit() {
		if (accountNumber.trim() && !isSubmitting) {
			isSubmitting = true;
			
			// บันทึก cookie (อายุ 30 วัน)
			const expiryDate = new Date();
			expiryDate.setDate(expiryDate.getDate() + 30);
			document.cookie = `accountNumber=${accountNumber}; expires=${expiryDate.toUTCString()}; path=/`;
			
			// รอเล็กน้อยแล้ว redirect ไปหน้า home
			setTimeout(() => {
				goto('/home');
			}, 500);
		}
	}
</script>

<div class="min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8">
	<div class="w-full max-w-md">
		<!-- Card Container -->
		<div class="bg-white rounded-2xl shadow-xl p-6 sm:p-8 md:p-10 border border-orange-100">
			<!-- Header -->
			<div class="text-center mb-8">
				<div class="inline-block p-3 bg-orange-50 rounded-full mb-4">
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
							d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" 
						/>
					</svg>
				</div>
				<h1 class="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
					เข้าสู่ระบบ
				</h1>
				<p class="text-sm sm:text-base text-gray-500">
					กรุณากรอกเลขที่บัญชีเพื่อดำเนินการต่อ
				</p>
			</div>

			<!-- Form -->
			<form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }} class="space-y-6">
				<div class="form-control">
					<label for="accountNumber" class="label">
						<span class="label-text text-gray-700 font-medium">เลขที่บัญชี</span>
					</label>
				<input
					id="accountNumber"
					type="text"
					bind:value={accountNumber}
					placeholder="กรอกเลขที่บัญชี 10-15 หลัก"
					class="input input-bordered w-full bg-white border-2 border-gray-200 focus:border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-200 transition-all duration-200 text-base sm:text-lg"
					required
					pattern="[0-9]{'{'}10,15{'}'}"
					title="กรุณากรอกเลขที่บัญชี 10-15 หลัก"
					disabled={isSubmitting}
				/>
				<div class="text-gray-400 text-xs sm:text-sm mt-1">
					ตัวเลข 10-15 หลักเท่านั้น
				</div>
				</div>

				<button
					type="submit"
					disabled={isSubmitting}
					class="btn w-full bg-gradient-to-r from-orange-300 to-orange-400 hover:from-orange-400 hover:to-orange-500 border-none text-white font-semibold text-base sm:text-lg py-3 h-auto min-h-0 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
				>
					{#if isSubmitting}
						<span class="inline-flex items-center gap-2">
							<span class="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
							กำลังดำเนินการ...
						</span>
					{:else}
						ยืนยัน
					{/if}
				</button>
			</form>
		</div>

		<!-- Footer -->
		<div class="text-center mt-6">
			<p class="text-xs sm:text-sm text-gray-400">
				ข้อมูลของคุณได้รับการปกป้องอย่างปลอดภัย 🔒
			</p>
		</div>
	</div>
</div>
