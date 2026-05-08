<script lang="ts">
	import { goto } from '$app/navigation';
	import { Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-svelte';
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

	function handleGuestLogin() {
		showGuestToast = true;
		localStorage.setItem('isGuest', 'true');
		localStorage.setItem('guestJoinedAt', new Date().toISOString());

		setTimeout(() => {
			goto('/setup-profile');
		}, 3000);
	}

	async function handleSubmit(e: Event) {
		e.preventDefault();
		errorMessage = '';
		successMessage = '';
		isLoading = true;

		if (!email || !password) {
			errorMessage = 'Vui lòng điền đầy đủ thông tin';
			isLoading = false;
			return;
		}

		if (password.length < 6) {
			errorMessage = 'Mật khẩu phải có ít nhất 6 ký tự';
			isLoading = false;
			return;
		}

		try {
			if (isSignUp) {
				// Sign up new user
				console.log('🔄 Đang đăng ký với:', { email, passwordLength: password.length });
				
				const { data, error } = await supabase.auth.signUp({
					email,
					password,
					options: {
						data: {
							dharma_name: 'Tân Viên' // Default, will be updated in setup
						}
					}
				});

				console.log('📦 Supabase response:', { data, error });

				if (error) throw error;

				successMessage = 'Đăng ký thành công! Vui lòng kiểm tra email để xác thực.';
				localStorage.setItem('isGuest', 'false');
				
				// If email confirmation is disabled, redirect to setup
				if (data.user && data.session) {
					setTimeout(() => goto('/setup-profile'), 1500);
				}
			} else {
				// Sign in existing user
				console.log('🔄 Đang đăng nhập với:', { email });
				
				const { data, error } = await supabase.auth.signInWithPassword({
					email,
					password
				});

				console.log('📦 Supabase response:', { data, error });

				if (error) throw error;

				successMessage = 'Đăng nhập thành công! Đang chuyển hướng...';
				localStorage.setItem('isGuest', 'false');
				setTimeout(() => goto('/dashboard'), 1500);
			}
		} catch (error: any) {
			console.error('❌ Lỗi đăng nhập/đăng ký:', error);
			console.error('   error.message:', error.message);
			console.error('   error.status:', error.status);
			console.error('   error.code:', error.code);
			
			// Hiển thị lỗi chi tiết hơn
			if (error.message?.includes('Invalid login credentials')) {
				errorMessage = 'Sai email hoặc mật khẩu';
			} else if (error.message?.includes('User already registered')) {
				errorMessage = 'Email này đã được đăng ký. Hãy đăng nhập hoặc dùng email khác.';
			} else if (error.message?.includes('Email not confirmed')) {
				errorMessage = 'Email chưa được xác thực. Vui lòng kiểm tra hộp thư.';
			} else {
				errorMessage = error.message || 'Đã xảy ra lỗi. Vui lòng thử lại.';
			}
		}

		isLoading = false;
	}

	function toggleSignUp() {
		isSignUp = !isSignUp;
		errorMessage = '';
		successMessage = '';
	}

	onMount(() => {
		// Clear any existing guest flag if user comes back to login
		if (localStorage.getItem('isGuest') === 'true') {
			localStorage.removeItem('isGuest');
		}
	});
</script>

<div class="min-h-screen bg-zen-beige flex flex-col relative">
	<!-- Guest Toast Notification -->
	{#if showGuestToast}
		<div class="fixed top-6 left-1/2 -translate-x-1/2 right-6 z-50 animate-fadeInUp">
			<div class="bg-zen-brown text-zen-beige rounded-2xl px-5 py-4 shadow-xl max-w-md mx-auto">
				<div class="flex items-start gap-3">
					<svg class="w-6 h-6 text-zen-gold flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
						<circle cx="12" cy="12" r="10"/>
						<path d="M12 8v4M12 16h.01"/>
					</svg>
					<div>
						<p class="font-medium text-sm">Lưu ý: Bạn đang dùng tài khoản Khách. Công đức sẽ chỉ lưu trên thiết bị này và không được xếp hạng.</p>
					</div>
				</div>
			</div>
		</div>
	{/if}

	<!-- Header -->
	<header class="px-4 py-4">
		<button onclick={() => goto('/')} class="p-2 rounded-full hover:bg-zen-brown/5 transition-colors">
			<ArrowLeft class="w-6 h-6 text-zen-brown" />
		</button>
	</header>

	<!-- Main Content -->
	<main class="flex-1 flex flex-col items-center justify-center px-6 py-8">
		<div class="w-full max-w-md stagger-children">
			<!-- Title -->
			<div class="text-center mb-10">
				<h1 class="font-serif text-3xl md:text-4xl font-semibold text-zen-brown mb-2">
					Chào mừng
				</h1>
				<p class="text-zen-brown/60">
					Tích lũy công đức mỗi ngày
				</p>
			</div>

			<!-- Form -->
			<form class="space-y-4" onsubmit={handleSubmit}>
				<!-- Email Input -->
				<div class="relative">
					<input
						type="email"
						placeholder="Email"
						bind:value={email}
						class="w-full px-4 py-4 pl-12 bg-zen-white border border-zen-brown/10 rounded-2xl text-zen-brown placeholder:text-zen-brown/40 focus:outline-none focus:border-zen-gold focus:ring-2 focus:ring-zen-gold/20 transition-all"
					/>
					<Mail class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zen-brown/30" />
				</div>

				<!-- Password Input -->
				<div class="relative">
					<input
						type={showPassword ? 'text' : 'password'}
						placeholder="Mật khẩu"
						bind:value={password}
						class="w-full px-4 py-4 pl-12 pr-12 bg-zen-white border border-zen-brown/10 rounded-2xl text-zen-brown placeholder:text-zen-brown/40 focus:outline-none focus:border-zen-gold focus:ring-2 focus:ring-zen-gold/20 transition-all"
					/>
					<Lock class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zen-brown/30" />
					<button
						type="button"
						onclick={() => showPassword = !showPassword}
						class="absolute right-4 top-1/2 -translate-y-1/2 text-zen-brown/40 hover:text-zen-brown/60 transition-colors"
					>
						{#if showPassword}
							<EyeOff class="w-5 h-5" />
						{:else}
							<Eye class="w-5 h-5" />
						{/if}
					</button>
				</div>

				<!-- Error Message -->
				{#if errorMessage}
					<div class="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm animate-fadeIn">
						{errorMessage}
					</div>
				{/if}

				<!-- Success Message -->
				{#if successMessage}
					<div class="bg-green-50 text-green-600 px-4 py-3 rounded-xl text-sm animate-fadeIn">
						{successMessage}
					</div>
				{/if}

				<!-- Submit Button -->
				<button
					type="submit"
					disabled={isLoading}
					class="w-full py-4 bg-zen-brown text-zen-white rounded-2xl font-medium text-lg transition-all duration-300 hover:bg-zen-brown/90 hover:shadow-lg hover:shadow-zen-brown/20 mt-6 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
				>
					{#if isLoading}
						<svg class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
							<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
							<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
						</svg>
						Đang xử lý...
					{:else}
						{isSignUp ? 'Đăng ký' : 'Đăng nhập'}
					{/if}
				</button>
			</form>

			<!-- Toggle Sign Up / Sign In -->
			<div class="mt-4 text-center">
				<button
					type="button"
					onclick={toggleSignUp}
					class="text-zen-brown/60 hover:text-zen-brown text-sm transition-colors"
				>
					{isSignUp ? 'Đã có tài khoản? Đăng nhập' : 'Chưa có tài khoản? Đăng ký'}
				</button>
			</div>

			<!-- Guest Mode -->
			<div class="mt-6 text-center">
				<button
					type="button"
					onclick={handleGuestLogin}
					class="text-zen-brown/50 hover:text-zen-brown/70 text-sm transition-colors"
				>
					Tiếp tục với tư cách Khách
				</button>
			</div>

			<!-- App tagline -->
			<div class="mt-12 text-center">
				<p class="text-zen-brown/30 text-xs">
					Tích Công Đức v1.0.0
				</p>
			</div>
		</div>
	</main>
</div>

<style>
	.font-serif {
		font-family: 'Playfair Display', Georgia, serif;
	}

	@keyframes fadeInUp {
		from {
			opacity: 0;
			transform: translateX(-50%) translateY(-10px);
		}
		to {
			opacity: 1;
			transform: translateX(-50%) translateY(0);
		}
	}

	.animate-fadeInUp {
		animation: fadeInUp 0.3s ease-out forwards;
	}
</style>
