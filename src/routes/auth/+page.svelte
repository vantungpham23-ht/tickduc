<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { supabase } from '$lib/supabase';

	let showPassword = $state(false);
	let email = $state('');
	let password = $state('');
	let isLoading = $state(false);
	let errorMessage = $state('');
	let successMessage = $state('');
	let showGuestToast = $state(false);
	let isSignUp = $state(false);
	let mounted = $state(false);

	function handleGuestLogin() {
		showGuestToast = true;
		localStorage.setItem('isGuest', 'true');
		localStorage.setItem('guestJoinedAt', new Date().toISOString());
		setTimeout(() => { goto('/setup-profile'); }, 2500);
	}

	async function handleSubmit(e: Event) {
		e.preventDefault();
		errorMessage = '';
		successMessage = '';
		isLoading = true;
		if (!email || !password) { errorMessage = 'Vui lòng điền đầy đủ thông tin'; isLoading = false; return; }
		if (password.length < 6) { errorMessage = 'Mật khẩu phải có ít nhất 6 ký tự'; isLoading = false; return; }
		try {
			if (isSignUp) {
				const { data, error } = await supabase.auth.signUp({
					email, password,
					options: { data: { dharma_name: 'Tân Viên' } }
				});
				if (error) throw error;
				successMessage = 'Đăng ký thành công! Vui lòng kiểm tra email để xác thực.';
				localStorage.setItem('isGuest', 'false');
				if (data.user && data.session) setTimeout(() => goto('/setup-profile'), 1500);
			} else {
				const { data, error } = await supabase.auth.signInWithPassword({ email, password });
				if (error) throw error;
				successMessage = 'Đăng nhập thành công! Đang chuyển hướng...';
				localStorage.setItem('isGuest', 'false');
				setTimeout(() => goto('/dashboard'), 1500);
			}
		} catch (error: any) {
			if (error.message?.includes('Invalid login credentials')) errorMessage = 'Sai email hoặc mật khẩu';
			else if (error.message?.includes('User already registered')) errorMessage = 'Email này đã được đăng ký. Hãy đăng nhập hoặc dùng email khác.';
			else if (error.message?.includes('Email not confirmed')) errorMessage = 'Email chưa được xác thực. Vui lòng kiểm tra hộp thư.';
			else errorMessage = error.message || 'Đã xảy ra lỗi. Vui lòng thử lại.';
		}
		isLoading = false;
	}

	function toggleSignUp() { isSignUp = !isSignUp; errorMessage = ''; successMessage = ''; }

	onMount(() => {
		mounted = true;
		if (localStorage.getItem('isGuest') === 'true') localStorage.removeItem('isGuest');
	});
</script>

<div class="min-h-screen flex flex-col relative overflow-hidden">
	<!-- Ambient backgrounds -->
	<div class="fixed inset-0 overflow-hidden pointer-events-none">
		<div class="absolute top-0 right-0 w-80 h-80 bg-[#C5A059]/3 rounded-full blur-3xl animate-float-drift"></div>
		<div class="absolute bottom-0 left-0 w-64 h-64 bg-[#93B1A7]/2 rounded-full blur-3xl animate-float-drift" style="animation-delay: -4s;"></div>
	</div>

	{#if showGuestToast}
		<div class="fixed top-6 left-1/2 -translate-x-1/2 right-6 z-50 animate-slide-in-top">
			<div class="bg-[#242018] backdrop-blur-2xl border border-[#C5A059]/15 text-[#F5F0E8] rounded-2xl px-5 py-3.5 shadow-2xl shadow-black/30 max-w-sm mx-auto">
				<div class="flex items-start gap-3">
					<svg class="w-4 h-4 text-[#C5A059] flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
						<circle cx="12" cy="12" r="10"/>
						<path d="M12 8v4M12 16h.01"/>
					</svg>
					<p class="text-[#F5F0E8]/70 text-xs leading-relaxed">Lưu ý: Bạn đang dùng tài khoản Khách. Công đức sẽ chỉ lưu trên thiết bị này.</p>
				</div>
			</div>
		</div>
	{/if}

	<header class="px-5 py-5 relative z-10">
		<button onclick={() => goto('/onboarding')} class="p-2 -ml-2 rounded-full hover:bg-white/5 transition-colors animate-fade-in">
			<svg class="w-5 h-5 text-[#8A8070]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
				<path d="M19 12H5M12 19l-7-7 7-7"/>
			</svg>
		</button>
	</header>

	<main class="flex-1 flex flex-col items-center justify-center px-6 py-4 relative z-10">
		<div class="w-full max-w-sm">
			<!-- Logo -->
			<div class="text-center mb-8 animate-fade-in-scale">
				<svg class="w-14 h-14 mx-auto text-[#C5A059]/60" viewBox="0 0 80 80" fill="none">
					<defs>
						<linearGradient id="authLotus2" x1="0%" y1="100%" x2="0%" y2="0%">
							<stop offset="0%" stop-color="#C5A059" stop-opacity="0.6"/>
							<stop offset="100%" stop-color="#D4B896" stop-opacity="1"/>
						</linearGradient>
					</defs>
					<ellipse cx="40" cy="22" rx="7" ry="14" fill="url(#authLotus2)" transform="rotate(0 40 48)" opacity="0.7"/>
					<ellipse cx="40" cy="22" rx="7" ry="14" fill="url(#authLotus2)" transform="rotate(60 40 48)" opacity="0.7"/>
					<ellipse cx="40" cy="22" rx="7" ry="14" fill="url(#authLotus2)" transform="rotate(120 40 48)" opacity="0.7"/>
					<ellipse cx="40" cy="22" rx="7" ry="14" fill="url(#authLotus2)" transform="rotate(180 40 48)" opacity="0.7"/>
					<ellipse cx="40" cy="22" rx="7" ry="14" fill="url(#authLotus2)" transform="rotate(240 40 48)" opacity="0.7"/>
					<ellipse cx="40" cy="22" rx="7" ry="14" fill="url(#authLotus2)" transform="rotate(300 40 48)" opacity="0.7"/>
					<circle cx="40" cy="48" r="5" fill="#C5A059" opacity="0.8"/>
				</svg>
			</div>

			<!-- Heading -->
			<div class="text-center mb-8">
				<h1 class="font-serif text-2xl font-light text-[#F5F0E8] mb-2 tracking-wide">
					{isSignUp ? 'Tạo tài khoản' : 'Đăng nhập'}
				</h1>
				<p class="text-[#8A8070] text-sm font-light">
					{isSignUp ? 'Bắt đầu hành trình tích đức của bạn' : 'Chào mừng trở lại'}
				</p>
			</div>

			<form class="space-y-4" onsubmit={handleSubmit}>
				<!-- Email -->
				<div class="relative animate-fade-in-up" style="animation-delay: 0.1s;">
					<input type="email" placeholder="Email" bind:value={email}
						class="w-full px-4 py-3.5 pl-11 bg-[#242018]/80 border border-[#C5A059]/10 rounded-2xl text-[#F5F0E8] placeholder:text-[#8A8070]/30 focus:outline-none focus:border-[#C5A059]/30 focus:ring-1 focus:ring-[#C5A059]/10 transition-all text-sm"/>
					<svg class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8070]/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
						<rect x="2" y="4" width="20" height="16" rx="2"/>
						<path d="M22 6l-10 7L2 6"/>
					</svg>
				</div>

				<!-- Password -->
				<div class="relative animate-fade-in-up" style="animation-delay: 0.18s;">
					<input type={showPassword ? 'text' : 'password'} placeholder="Mật khẩu" bind:value={password}
						class="w-full px-4 py-3.5 pl-11 pr-11 bg-[#242018]/80 border border-[#C5A059]/10 rounded-2xl text-[#F5F0E8] placeholder:text-[#8A8070]/30 focus:outline-none focus:border-[#C5A059]/30 focus:ring-1 focus:ring-[#C5A059]/10 transition-all text-sm"/>
					<svg class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8070]/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
						<rect x="3" y="11" width="18" height="11" rx="2"/>
						<path d="M7 11V7a5 5 0 0110 0v4"/>
					</svg>
					<button type="button" onclick={() => showPassword = !showPassword}
						class="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8A8070]/30 hover:text-[#8A8070]/50 transition-colors">
						{#if showPassword}
							<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
								<path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
								<line x1="1" y1="1" x2="23" y2="23"/>
							</svg>
						{:else}
							<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
								<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
								<circle cx="12" cy="12" r="3"/>
							</svg>
						{/if}
					</button>
				</div>

				{#if errorMessage}
					<div class="bg-[#C4A89C]/10 border border-[#C4A89C]/20 text-[#C4A89C] px-4 py-3 rounded-xl text-xs animate-fade-in">
						{errorMessage}
					</div>
				{/if}

				{#if successMessage}
					<div class="bg-[#93B1A7]/10 border border-[#93B1A7]/20 text-[#93B1A7] px-4 py-3 rounded-xl text-xs animate-fade-in">
						{successMessage}
					</div>
				{/if}

				<button type="submit" disabled={isLoading}
					class="w-full py-3.5 mt-5 bg-[#C5A059]/15 border border-[#C5A059]/25 text-[#D4B896] rounded-2xl font-light text-sm tracking-wide transition-all duration-300 hover:bg-[#C5A059]/22 hover:border-[#C5A059]/35 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2">
					{#if isLoading}
						<div class="w-4 h-4 border border-[#C5A059]/30 border-t-[#C5A059] rounded-full animate-spin"></div>
						<span>Đang xử lý...</span>
					{:else}
						<span>{isSignUp ? 'Đăng ký' : 'Đăng nhập'}</span>
					{/if}
				</button>
			</form>

			<!-- Toggle sign up -->
			<div class="mt-5 text-center animate-fade-in-up" style="animation-delay: 0.25s;">
				<button type="button" onclick={toggleSignUp} class="text-[#8A8070]/40 hover:text-[#8A8070]/70 text-xs transition-colors">
					{isSignUp ? 'Đã có tài khoản? ' : 'Chưa có tài khoản? '}
					<span class="text-[#C5A059]/50">{isSignUp ? 'Đăng nhập' : 'Đăng ký'}</span>
				</button>
			</div>

			<!-- Divider -->
			<div class="flex items-center gap-3 my-6 animate-fade-in-up" style="animation-delay: 0.3s;">
				<div class="flex-1 h-px bg-gradient-to-r from-transparent via-[#C5A059]/10 to-transparent"></div>
				<span class="text-[#8A8070]/20 text-[10px] uppercase tracking-widest">hoặc</span>
				<div class="flex-1 h-px bg-gradient-to-r from-transparent via-[#C5A059]/10 to-transparent"></div>
			</div>

			<!-- Guest button -->
			<button type="button" onclick={handleGuestLogin}
				class="w-full py-3.5 bg-[#242018]/60 border border-[#C5A059]/8 text-[#8A8070]/60 rounded-2xl text-sm transition-all duration-300 hover:bg-[#242018]/80 hover:border-[#C5A059]/15 animate-fade-in-up"
				style="animation-delay: 0.35s;">
				Tiếp tục với tài khoản Khách
			</button>

			<!-- Quote -->
			<div class="mt-10 text-center animate-fade-in" style="animation-delay: 0.5s;">
				<p class="text-[#8A8070]/15 text-xs italic font-serif-alt">"Vô vi thành, vô vi được"</p>
			</div>
		</div>
	</main>
</div>

<style>
	@keyframes slide-in-top {
		from { opacity: 0; transform: translateX(-50%) translateY(-20px); }
		to { opacity: 1; transform: translateX(-50%) translateY(0); }
	}
	.animate-slide-in-top { animation: slide-in-top 0.4s ease-out forwards; }
</style>
