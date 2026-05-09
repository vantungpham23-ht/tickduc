<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	let mounted = $state(false);
	let showContent = $state(false);
	let progress = $state(0);

	async function checkAuthAndRedirect() {
		const isGuest = localStorage.getItem('isGuest') === 'true';
		const hasProfile = localStorage.getItem('guestDharmaName');
		const hasOnboarded = localStorage.getItem('hasOnboarded') === 'true';

		// Simulate loading for splash effect
		await new Promise(resolve => setTimeout(resolve, 800));

		// Check Supabase auth if available
		try {
			const { supabase } = await import('$lib/supabase');
			const { data: { user } } = await supabase.auth.getUser();

			if (user) {
				// Logged in user
				goto('/dashboard');
				return;
			}
		} catch (e) {
			// Supabase not available, continue with local check
		}

		// Guest user with profile
		if (isGuest && hasProfile) {
			goto('/dashboard');
			return;
		}

		// Guest user without profile
		if (isGuest && !hasProfile) {
			goto('/setup-profile');
			return;
		}

		// New user - go to onboarding
		goto('/onboarding');
	}

	onMount(() => {
		mounted = true;

		// Animate progress bar
		const interval = setInterval(() => {
			progress += 2;
			if (progress >= 100) {
				clearInterval(interval);
			}
		}, 30);

		// Start redirect logic after animation
		setTimeout(() => {
			showContent = true;
			setTimeout(checkAuthAndRedirect, 600);
		}, 500);
	});
</script>

<div class="min-h-screen bg-[#F7F3F0] flex flex-col items-center justify-center relative overflow-hidden">
	<!-- Background decorations -->
	<div class="fixed inset-0 overflow-hidden pointer-events-none">
		<!-- Soft gradient orbs -->
		<div class="absolute top-1/4 left-1/4 w-64 h-64 bg-[#C5A059]/5 rounded-full blur-3xl animate-float-drift"></div>
		<div class="absolute bottom-1/3 right-1/4 w-80 h-80 bg-[#9CAF88]/5 rounded-full blur-3xl animate-float-drift" style="animation-delay: -2s;"></div>
	</div>

	<!-- Content -->
	<div class="relative z-10 text-center">
		<!-- Animated Lotus Logo -->
		<div class="mb-8 animate-lotus-bloom" style="animation-delay: 0.2s;">
			<svg class="w-28 h-28 text-[#C5A059]" viewBox="0 0 100 100" fill="none">
				<defs>
					<linearGradient id="lotusGradSplash" x1="0%" y1="100%" x2="0%" y2="0%">
						<stop offset="0%" stop-color="#C9B896" stop-opacity="0.9"/>
						<stop offset="50%" stop-color="#E8DCC8" stop-opacity="1"/>
						<stop offset="100%" stop-color="#F5EEE0" stop-opacity="1"/>
					</linearGradient>
					<filter id="lotusGlow">
						<feGaussianBlur stdDeviation="2" result="coloredBlur"/>
						<feMerge>
							<feMergeNode in="coloredBlur"/>
							<feMergeNode in="SourceGraphic"/>
						</feMerge>
					</filter>
				</defs>

				<!-- Outer petals -->
				<ellipse cx="50" cy="35" rx="10" ry="22" fill="url(#lotusGradSplash)" transform="rotate(0 50 60)" opacity="0.8"/>
				<ellipse cx="50" cy="35" rx="10" ry="22" fill="url(#lotusGradSplash)" transform="rotate(60 50 60)" opacity="0.8"/>
				<ellipse cx="50" cy="35" rx="10" ry="22" fill="url(#lotusGradSplash)" transform="rotate(120 50 60)" opacity="0.8"/>
				<ellipse cx="50" cy="35" rx="10" ry="22" fill="url(#lotusGradSplash)" transform="rotate(180 50 60)" opacity="0.8"/>
				<ellipse cx="50" cy="35" rx="10" ry="22" fill="url(#lotusGradSplash)" transform="rotate(240 50 60)" opacity="0.8"/>
				<ellipse cx="50" cy="35" rx="10" ry="22" fill="url(#lotusGradSplash)" transform="rotate(300 50 60)" opacity="0.8"/>

				<!-- Inner petals -->
				<ellipse cx="50" cy="38" rx="7" ry="16" fill="url(#lotusGradSplash)" opacity="0.9" transform="rotate(30 50 60)"/>
				<ellipse cx="50" cy="38" rx="7" ry="16" fill="url(#lotusGradSplash)" opacity="0.9" transform="rotate(90 50 60)"/>
				<ellipse cx="50" cy="38" rx="7" ry="16" fill="url(#lotusGradSplash)" opacity="0.9" transform="rotate(150 50 60)"/>
				<ellipse cx="50" cy="38" rx="7" ry="16" fill="url(#lotusGradSplash)" opacity="0.9" transform="rotate(210 50 60)"/>
				<ellipse cx="50" cy="38" rx="7" ry="16" fill="url(#lotusGradSplash)" opacity="0.9" transform="rotate(270 50 60)"/>
				<ellipse cx="50" cy="38" rx="7" ry="16" fill="url(#lotusGradSplash)" opacity="0.9" transform="rotate(330 50 60)"/>

				<!-- Center with glow -->
				<circle cx="50" cy="60" r="8" fill="#C9B896" filter="url(#lotusGlow)"/>
				<circle cx="50" cy="60" r="5" fill="#E8DCC8"/>
			</svg>
		</div>

		<!-- App Name -->
		<div class="opacity-0" class:animate-fade-in={showContent} style="animation-delay: 0.3s; animation-fill-mode: forwards;">
			<h1 class="font-serif text-3xl font-light text-[#3D3028] tracking-wide mb-2">
				Tích Công Đức
			</h1>
			<p class="text-[#7A6B5A]/60 text-sm tracking-wider font-light">
				Nuôi dưỡng tâm hồn an lạc
			</p>
		</div>
	</div>

	<!-- Loading Progress -->
	<div class="absolute bottom-24 left-1/2 -translate-x-1/2 w-32 opacity-0" class:animate-fade-in={mounted} style="animation-delay: 0.5s; animation-fill-mode: forwards;">
		<div class="h-[2px] bg-[#E8E0D8] rounded-full overflow-hidden">
			<div
				class="h-full bg-gradient-to-r from-[#C9B896] to-[#C5A059] rounded-full transition-all duration-100"
				style="width: {progress}%;"
			></div>
		</div>
	</div>

	<!-- Quote at bottom -->
	<div class="absolute bottom-12 left-6 right-6 text-center opacity-0" class:animate-fade-in={showContent} style="animation-delay: 0.8s; animation-fill-mode: forwards;">
		<p class="text-[#3D3028]/20 text-xs italic tracking-wide">
			"Hành trình ngàn đăm bắt đầu từ một bước chân"
		</p>
	</div>
</div>

<style>
	.font-serif {
		font-family: 'Playfair Display', Georgia, serif;
	}
</style>
