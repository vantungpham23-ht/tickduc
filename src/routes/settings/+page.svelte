<script lang="ts">
	import BottomNav from '$lib/components/BottomNav.svelte';
	import { goto } from '$app/navigation';

	const avatarOptions = [
		{ id: 'lotus', label: 'Hoa sen' },
		{ id: 'sun', label: 'Mặt trời' },
		{ id: 'moon', label: 'Trăng' },
		{ id: 'star', label: 'Sao' },
		{ id: 'leaf', label: 'Lá' },
		{ id: 'flame', label: 'Lửa' },
	];
	let selectedAvatar = $state(avatarOptions[0]);
	let showCurrentPassword = $state(false);
	let showNewPassword = $state(false);
	let showConfirmPassword = $state(false);
	let currentPassword = $state('');
	let newPassword = $state('');
	let confirmPassword = $state('');
	let passwordError = $state('');
	let passwordSuccess = $state(false);
	let isChangingPassword = $state(false);
	let showAvatarPicker = $state(false);
	let avatarSuccess = $state(false);

	function selectAvatar(avatar: typeof avatarOptions[0]) { selectedAvatar = avatar; showAvatarPicker = false; avatarSuccess = true; setTimeout(() => avatarSuccess = false, 2000); }

	async function handlePasswordChange(e: Event) {
		e.preventDefault(); passwordError = ''; passwordSuccess = false;
		if (!currentPassword || !newPassword || !confirmPassword) { passwordError = 'Vui lòng điền đầy đủ thông tin'; return; }
		if (newPassword.length < 6) { passwordError = 'Mật khẩu mới phải có ít nhất 6 ký tự'; return; }
		if (newPassword !== confirmPassword) { passwordError = 'Mật khẩu xác nhận không khớp'; return; }
		isChangingPassword = true;
		await new Promise(resolve => setTimeout(resolve, 1000));
		isChangingPassword = false; passwordSuccess = true;
		currentPassword = ''; newPassword = ''; confirmPassword = '';
		setTimeout(() => passwordSuccess = false, 3000);
	}
</script>

<div class="min-h-screen pb-24 relative overflow-hidden">
	<div class="fixed inset-0 overflow-hidden pointer-events-none">
		<div class="absolute top-0 right-0 w-80 h-80 bg-[#C5A059]/8 rounded-full blur-3xl animate-float-drift"></div>
		<div class="absolute bottom-0 left-0 w-64 h-64 bg-[#93B1A7]/8 rounded-full blur-3xl animate-float-drift" style="animation-delay: -4s;"></div>
	</div>

	<header class="relative px-5 py-4 z-10 flex items-center gap-3 border-b border-[#C5A059]/10">
		<button onclick={() => goto('/profile')} class="p-2 -ml-2 rounded-full hover:bg-[#C5A059]/5 transition-colors">
			<svg class="w-5 h-5 text-[#9A8E80]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
		</button>
		<h1 class="font-serif text-xl font-light text-[#4A3F35] tracking-wide">Cài đặt</h1>
	</header>

	<div class="px-4 pt-6 space-y-4 relative z-10">
		<!-- Avatar Section -->
		<div class="rounded-3xl overflow-hidden bg-white border border-[#E5DDD0]">
			<div class="px-4 py-4 border-b border-[#E5DDD0]">
				<h2 class="text-sm text-[#6B5D4D]/60 font-light tracking-wide">Avatar Phật pháp</h2>
			</div>
			<div class="p-4">
				<div class="flex items-center gap-4 mb-4">
					<button onclick={() => showAvatarPicker = !showAvatarPicker} class="relative">
						<div class="w-14 h-14 rounded-full bg-[#FAF7F2] border border-[#E5DDD0] flex items-center justify-center shadow-md hover:border-[#C5A059]/30 transition-colors">
							<svg class="w-7 h-7 text-[#9A8E80]/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><ellipse cx="12" cy="21" rx="3" ry="1.5"/><path d="M12 17 C12 17 8 13 8 9 C8 5 12 3 12 3 C12 3 16 5 16 9 C16 13 12 17 12 17"/></svg>
						</div>
						<span class="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white border border-[#E5DDD0] flex items-center justify-center">
							<svg class="w-2.5 h-2.5 text-[#C5A059]/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
						</span>
					</button>
					<div class="flex-1">
						<p class="text-sm text-[#4A3F35]/80 font-light">{selectedAvatar.label}</p>
						<p class="text-xs text-[#9A8E80]/50">Nhấn để thay đổi</p>
					</div>
					{#if avatarSuccess}<span class="text-[#7A9E7E] text-xs">Đã lưu</span>{/if}
				</div>
				{#if showAvatarPicker}
					<div class="grid grid-cols-6 gap-2 pt-4 border-t border-[#E5DDD0]">
						{#each avatarOptions as avatar}
							<button onclick={() => selectAvatar(avatar)}
								class="aspect-square rounded-xl bg-[#FAF7F2] border {selectedAvatar.id === avatar.id ? 'border-[#C5A059]/40 bg-[#C5A059]/10' : 'border-[#E5DDD0] hover:border-[#C5A059]/30'} flex items-center justify-center hover:scale-105 transition-all" title={avatar.label}>
								<svg class="w-5 h-5 text-[#9A8E80]/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><ellipse cx="12" cy="21" rx="3" ry="1.5"/><path d="M12 17 C12 17 8 13 8 9 C8 5 12 3 12 3 C12 3 16 5 16 9 C16 13 12 17 12 17"/></svg>
							</button>
						{/each}
					</div>
				{/if}
			</div>
		</div>

		<!-- Password Section -->
		<div class="rounded-3xl overflow-hidden bg-white border border-[#E5DDD0]">
			<div class="px-4 py-4 border-b border-[#E5DDD0]">
				<h2 class="text-sm text-[#6B5D4D]/60 font-light tracking-wide">Đổi mật khẩu</h2>
			</div>
			<form onsubmit={handlePasswordChange} class="p-4 space-y-4">
				<div>
					<label class="block text-xs text-[#9A8E80]/60 mb-1.5 font-light">Mật khẩu hiện tại</label>
					<div class="relative">
						<input type={showCurrentPassword ? 'text' : 'password'} bind:value={currentPassword} placeholder="Nhập mật khẩu hiện tại"
							class="w-full px-4 py-3 rounded-xl bg-[#FAF7F2] border border-[#E5DDD0] text-[#4A3F35] text-sm placeholder:text-[#9A8E80]/40 focus:outline-none focus:border-[#C5A059]/40 transition-all font-light"/>
						<button type="button" onclick={() => showCurrentPassword = !showCurrentPassword} class="absolute right-3 top-1/2 -translate-y-1/2 text-[#9A8E80]/50 hover:text-[#9A8E80]/70">
							<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">{@html showCurrentPassword ? '<path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>' : '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-8-11z"/><circle cx="12" cy="12" r="3"/>'}</svg>
						</button>
					</div>
				</div>
				<div>
					<label class="block text-xs text-[#9A8E80]/60 mb-1.5 font-light">Mật khẩu mới</label>
					<div class="relative">
						<input type={showNewPassword ? 'text' : 'password'} bind:value={newPassword} placeholder="Ít nhất 6 ký tự"
							class="w-full px-4 py-3 rounded-xl bg-[#FAF7F2] border border-[#E5DDD0] text-[#4A3F35] text-sm placeholder:text-[#9A8E80]/40 focus:outline-none focus:border-[#C5A059]/40 transition-all font-light"/>
						<button type="button" onclick={() => showNewPassword = !showNewPassword} class="absolute right-3 top-1/2 -translate-y-1/2 text-[#9A8E80]/50 hover:text-[#9A8E80]/70">
							<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">{@html showNewPassword ? '<path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>' : '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-8-11z"/><circle cx="12" cy="12" r="3"/>'}</svg>
						</button>
					</div>
				</div>
				<div>
					<label class="block text-xs text-[#9A8E80]/60 mb-1.5 font-light">Xác nhận mật khẩu mới</label>
					<input type={showConfirmPassword ? 'text' : 'password'} bind:value={confirmPassword} placeholder="Nhập lại mật khẩu mới"
						class="w-full px-4 py-3 rounded-xl bg-[#FAF7F2] border border-[#E5DDD0] text-[#4A3F35] text-sm placeholder:text-[#9A8E80]/40 focus:outline-none focus:border-[#C5A059]/40 transition-all font-light"/>
				</div>
				{#if passwordError}
					<div class="bg-[#C49080]/10 border border-[#C49080]/20 text-[#8B5D4D] px-4 py-3 rounded-xl text-xs animate-fade-in">{passwordError}</div>
				{/if}
				{#if passwordSuccess}
					<div class="bg-[#7A9E7E]/10 border border-[#7A9E7E]/20 text-[#5A7E5E] px-4 py-3 rounded-xl text-xs animate-fade-in">Đổi mật khẩu thành công</div>
				{/if}
				<button type="submit" disabled={isChangingPassword}
					class="w-full py-3.5 bg-[#C5A059] border border-[#B8944A] text-white rounded-xl text-sm font-light hover:bg-[#B8944A] transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2">
					{#if isChangingPassword}<div class="w-4 h-4 border border-white/30 border-t-white rounded-full animate-spin"></div><span>Đang xử lý...</span>{:else}<span>Cập nhật mật khẩu</span>{/if}
				</button>
			</form>
		</div>

		<div class="rounded-2xl p-4 bg-[#FAF7F2] border border-[#E5DDD0] text-center">
			<p class="text-xs text-[#9A8E80]/40 font-light">Các cài đặt khác sẽ sớm được cập nhật</p>
		</div>
	</div>
</div>

<BottomNav currentRoute="/profile" />
