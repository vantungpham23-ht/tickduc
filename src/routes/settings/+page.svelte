<script lang="ts">
	import BottomNav from '$lib/components/BottomNav.svelte';
	import { goto } from '$app/navigation';

	// Avatar options - Buddhist/Dharma themed
	let avatarOptions = $state([
		{ id: 'buddha', emoji: '🧘', label: 'Phật tổ', color: 'bg-amber-100' },
		{ id: 'lotus', emoji: '🪷', label: 'Hoa sen', color: 'bg-pink-100' },
		{ id: 'wheel', emoji: '☸️', label: 'Bánh xe', color: 'bg-orange-100' },
		{ id: 'pray', emoji: '🙏', label: 'Cầu nguyện', color: 'bg-red-100' },
		{ id: 'flower', emoji: '🌸', label: 'Hoa anh đào', color: 'bg-rose-100' },
		{ id: 'sparkle', emoji: '✨', label: 'Tỏa sáng', color: 'bg-yellow-100' },
		{ id: 'star', emoji: '⭐', label: 'Sao', color: 'bg-blue-100' },
		{ id: 'moon', emoji: '🌙', label: 'Trăng tròn', color: 'bg-indigo-100' },
		{ id: 'wave', emoji: '🌊', label: 'Sóng biển', color: 'bg-cyan-100' },
		{ id: 'leaf', emoji: '🍃', label: 'Lá xanh', color: 'bg-green-100' }
	]);

	let selectedAvatar = $state(avatarOptions[0]);

	// Password form state
	let showCurrentPassword = $state(false);
	let showNewPassword = $state(false);
	let showConfirmPassword = $state(false);
	let currentPassword = $state('');
	let newPassword = $state('');
	let confirmPassword = $state('');
	let passwordError = $state('');
	let passwordSuccess = $state(false);
	let isChangingPassword = $state(false);

	// Avatar selection
	let showAvatarPicker = $state(false);
	let avatarSuccess = $state(false);

	function selectAvatar(avatar: typeof avatarOptions[0]) {
		selectedAvatar = avatar;
		showAvatarPicker = false;
		avatarSuccess = true;
		setTimeout(() => avatarSuccess = false, 2000);
	}

	async function handlePasswordChange(e: Event) {
		e.preventDefault();
		passwordError = '';
		passwordSuccess = false;

		if (!currentPassword || !newPassword || !confirmPassword) {
			passwordError = 'Vui lòng điền đầy đủ thông tin';
			return;
		}

		if (newPassword.length < 6) {
			passwordError = 'Mật khẩu mới phải có ít nhất 6 ký tự';
			return;
		}

		if (newPassword !== confirmPassword) {
			passwordError = 'Mật khẩu xác nhận không khớp';
			return;
		}

		isChangingPassword = true;

		// Simulate API call
		await new Promise(resolve => setTimeout(resolve, 1000));

		isChangingPassword = false;
		passwordSuccess = true;
		currentPassword = '';
		newPassword = '';
		confirmPassword = '';

		setTimeout(() => passwordSuccess = false, 3000);
	}
</script>

<div class="min-h-screen bg-zen-beige pb-24">
	<!-- Header -->
	<header class="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-10">
		<div class="px-6 py-4 flex items-center gap-3">
			<button onclick={() => goto('/profile')} class="w-10 h-10 rounded-full hover:bg-zen-brown/5 flex items-center justify-center transition-colors">
				<svg class="w-5 h-5 text-zen-brown" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
				</svg>
			</button>
			<h1 class="text-xl font-serif font-bold text-zen-brown">Cài đặt</h1>
		</div>
	</header>

	<div class="px-4 pt-6 space-y-4">
		<!-- Avatar Section -->
		<div class="bg-white rounded-2xl shadow-sm overflow-hidden">
			<div class="px-4 py-4 border-b border-zen-brown/10">
				<h2 class="font-semibold text-zen-brown">Avatar Phật pháp</h2>
			</div>
			
			<div class="p-4">
				<!-- Current Avatar -->
				<div class="flex items-center gap-4 mb-4">
					<button 
						onclick={() => showAvatarPicker = !showAvatarPicker}
						class="relative"
					>
						<div class="w-16 h-16 rounded-full {selectedAvatar.color} flex items-center justify-center text-3xl shadow-md border-2 border-zen-gold/50 hover:scale-105 transition-transform">
							{selectedAvatar.emoji}
						</div>
						<span class="absolute -bottom-1 -right-1 w-5 h-5 bg-zen-gold rounded-full flex items-center justify-center">
							<svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
							</svg>
						</span>
					</button>
					<div>
						<p class="font-medium text-zen-brown">{selectedAvatar.label}</p>
						<p class="text-sm text-zen-brown/50">Nhấn để thay đổi</p>
					</div>
					{#if avatarSuccess}
						<span class="ml-auto text-green-500 text-sm animate-fadeIn">✓ Đã lưu</span>
					{/if}
				</div>

				<!-- Avatar Picker -->
				{#if showAvatarPicker}
					<div class="grid grid-cols-5 gap-2 pt-4 border-t border-zen-brown/10 animate-fadeIn">
						{#each avatarOptions as avatar}
							<button
								onclick={() => selectAvatar(avatar)}
								class="aspect-square rounded-xl {avatar.color} flex items-center justify-center text-2xl hover:scale-110 transition-transform shadow-sm"
								title={avatar.label}
							>
								{avatar.emoji}
							</button>
						{/each}
					</div>
				{/if}
			</div>
		</div>

		<!-- Password Section -->
		<div class="bg-white rounded-2xl shadow-sm overflow-hidden">
			<div class="px-4 py-4 border-b border-zen-brown/10">
				<h2 class="font-semibold text-zen-brown">Đổi mật khẩu</h2>
			</div>
			
			<form onsubmit={handlePasswordChange} class="p-4 space-y-4">
				<!-- Current Password -->
				<div>
					<label class="block text-sm font-medium text-zen-brown/70 mb-1.5">Mật khẩu hiện tại</label>
					<div class="relative">
						<input
							type={showCurrentPassword ? 'text' : 'password'}
							bind:value={currentPassword}
							placeholder="Nhập mật khẩu hiện tại"
							class="w-full px-4 py-3 rounded-xl border border-zen-brown/20 bg-zen-beige/30 focus:outline-none focus:ring-2 focus:ring-zen-gold/50 focus:border-zen-gold transition-all text-zen-brown placeholder:text-zen-brown/30"
						/>
						<button
							type="button"
							onclick={() => showCurrentPassword = !showCurrentPassword}
							class="absolute right-3 top-1/2 -translate-y-1/2 text-zen-brown/40 hover:text-zen-brown/60"
						>
							{#if showCurrentPassword}
								<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
								</svg>
							{:else}
								<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
								</svg>
							{/if}
						</button>
					</div>
				</div>

				<!-- New Password -->
				<div>
					<label class="block text-sm font-medium text-zen-brown/70 mb-1.5">Mật khẩu mới</label>
					<div class="relative">
						<input
							type={showNewPassword ? 'text' : 'password'}
							bind:value={newPassword}
							placeholder="Ít nhất 6 ký tự"
							class="w-full px-4 py-3 rounded-xl border border-zen-brown/20 bg-zen-beige/30 focus:outline-none focus:ring-2 focus:ring-zen-gold/50 focus:border-zen-gold transition-all text-zen-brown placeholder:text-zen-brown/30"
						/>
						<button
							type="button"
							onclick={() => showNewPassword = !showNewPassword}
							class="absolute right-3 top-1/2 -translate-y-1/2 text-zen-brown/40 hover:text-zen-brown/60"
						>
							{#if showNewPassword}
								<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
								</svg>
							{:else}
								<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
								</svg>
							{/if}
						</button>
					</div>
				</div>

				<!-- Confirm Password -->
				<div>
					<label class="block text-sm font-medium text-zen-brown/70 mb-1.5">Xác nhận mật khẩu mới</label>
					<div class="relative">
						<input
							type={showConfirmPassword ? 'text' : 'password'}
							bind:value={confirmPassword}
							placeholder="Nhập lại mật khẩu mới"
							class="w-full px-4 py-3 rounded-xl border border-zen-brown/20 bg-zen-beige/30 focus:outline-none focus:ring-2 focus:ring-zen-gold/50 focus:border-zen-gold transition-all text-zen-brown placeholder:text-zen-brown/30"
						/>
						<button
							type="button"
							onclick={() => showConfirmPassword = !showConfirmPassword}
							class="absolute right-3 top-1/2 -translate-y-1/2 text-zen-brown/40 hover:text-zen-brown/60"
						>
							{#if showConfirmPassword}
								<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
								</svg>
							{:else}
								<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
								</svg>
							{/if}
						</button>
					</div>
				</div>

				<!-- Error Message -->
				{#if passwordError}
					<div class="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm animate-fadeIn">
						{passwordError}
					</div>
				{/if}

				<!-- Success Message -->
				{#if passwordSuccess}
					<div class="bg-green-50 text-green-600 px-4 py-3 rounded-xl text-sm animate-fadeIn">
						✓ Đổi mật khẩu thành công!
					</div>
				{/if}

				<!-- Submit Button -->
				<button
					type="submit"
					disabled={isChangingPassword}
					class="w-full py-3.5 bg-zen-gold text-white font-semibold rounded-xl hover:bg-zen-gold/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
				>
					{#if isChangingPassword}
						<svg class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
							<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
							<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
						</svg>
						Đang xử lý...
					{:else}
						Cập nhật mật khẩu
					{/if}
				</button>
			</form>
		</div>

		<!-- Info -->
		<div class="bg-zen-brown/5 rounded-2xl p-4">
			<p class="text-sm text-zen-brown/60 text-center">
				Các cài đặt khác sẽ sớm được cập nhật
			</p>
		</div>
	</div>

	<BottomNav currentRoute="/settings" />
</div>
