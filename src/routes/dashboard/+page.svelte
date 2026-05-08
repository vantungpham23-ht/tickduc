<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import BottomNav from '$lib/components/BottomNav.svelte';
	import { supabase } from '$lib/supabase';

	// User data
	let meritPoints = $state(0);
	let streak = $state(0);
	let dharmaName = $state('Tân Viên');
	let isGuest = $state(false);
	let isLoading = $state(true);
	let greeting = $state('');
	let greetingTimeOfDay = $state<'morning' | 'afternoon' | 'evening' | 'night'>('morning');

	function getGreeting() {
		const now = new Date();
		const vietnamTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' }));
		const hour = vietnamTime.getHours();

		if (hour >= 5 && hour < 12) {
			greeting = 'Chào buổi sáng';
			greetingTimeOfDay = 'morning';
		} else if (hour >= 12 && hour < 18) {
			greeting = 'Chào buổi chiều';
			greetingTimeOfDay = 'afternoon';
		} else if (hour >= 18 && hour < 22) {
			greeting = 'Chào buổi tối';
			greetingTimeOfDay = 'evening';
		} else {
			greeting = 'Chào đêm khuya';
			greetingTimeOfDay = 'night';
		}
	}

	async function fetchUserData() {
		isLoading = true;
		isGuest = localStorage.getItem('isGuest') === 'true';

		if (isGuest) {
			meritPoints = parseInt(localStorage.getItem('guestMerit') || '0');
			dharmaName = localStorage.getItem('guestDharmaName') || 'Khách';
			streak = 0;
			isLoading = false;
			return;
		}

		try {
			const { data: { user } } = await supabase.auth.getUser();
			if (!user) {
				isLoading = false;
				return;
			}

			const { data: profile } = await supabase
				.from('profiles')
				.select('*')
				.eq('id', user.id)
				.single();

			if (profile) {
				meritPoints = profile.total_merits || 0;
				streak = profile.current_streak || 0;
				dharmaName = profile.dharma_name || 'Tân Viên';
			}

		} catch (error) {
			console.error('Error fetching user data:', error);
		}

		isLoading = false;
	}

	onMount(() => {
		getGreeting();
		fetchUserData();
	});
</script>

<div class="min-h-screen bg-zen-cream pb-20 overflow-hidden">
	<!-- Animated Background -->
	<div class="fixed inset-0 pointer-events-none overflow-hidden">
		<!-- Floating Petals -->
		<div class="absolute top-20 left-[10%] animate-float-petal" style="animation-delay: 0s;">
			<svg width="24" height="24" viewBox="0 0 24 24" fill="none" class="text-zen-gold opacity-20">
				<ellipse cx="12" cy="12" rx="6" ry="10" transform="rotate(30 12 12)" fill="currentColor"/>
			</svg>
		</div>
		<div class="absolute top-40 left-[80%] animate-float-petal" style="animation-delay: 2s;">
			<svg width="18" height="18" viewBox="0 0 24 24" fill="none" class="text-zen-rose opacity-15">
				<ellipse cx="12" cy="12" rx="6" ry="10" transform="rotate(-20 12 12)" fill="currentColor"/>
			</svg>
		</div>
		<div class="absolute top-60 left-[30%] animate-float-petal" style="animation-delay: 4s;">
			<svg width="20" height="20" viewBox="0 0 24 24" fill="none" class="text-zen-sage opacity-15">
				<ellipse cx="12" cy="12" rx="6" ry="10" transform="rotate(45 12 12)" fill="currentColor"/>
			</svg>
		</div>
		
		<!-- Ink Diffusion Circles -->
		<div class="absolute top-[20%] right-[5%]">
			<div class="w-32 h-32 rounded-full bg-zen-gold opacity-[0.03] animate-ink-diffuse"></div>
		</div>
		<div class="absolute bottom-[30%] left-[0%]">
			<div class="w-40 h-40 rounded-full bg-zen-rose opacity-[0.03] animate-ink-diffuse" style="animation-delay: 1s;"></div>
		</div>
		
		<!-- Water Ripple Effect -->
		<div class="absolute top-[60%] right-[10%]">
			<div class="w-16 h-16 rounded-full border border-zen-sage/10 animate-ripple"></div>
		</div>
	</div>

	<!-- Header -->
	<header class="relative px-5 pt-8 pb-6">
		<div class="flex items-center justify-between">
			<div>
				<div class="flex items-center gap-2 mb-1">
					<!-- Time of Day Icon - Quiet Luxury Style -->
					{#if greetingTimeOfDay === 'morning'}
						<!-- Morning Sun Rising -->
						<svg class="w-5 h-5 text-zen-gold" viewBox="0 0 24 24" fill="none">
							<defs>
								<linearGradient id="sunriseGlow" x1="0%" y1="100%" x2="0%" y2="0%">
									<stop offset="0%" stop-color="currentColor" stop-opacity="0.2"/>
									<stop offset="100%" stop-color="currentColor" stop-opacity="0"/>
								</linearGradient>
							</defs>
							<circle cx="12" cy="16" r="5" fill="currentColor" opacity="0.8"/>
							<path d="M12 9 L12 6 M8 11 L6 9 M16 11 L18 9 M12 16 L12 19 M7 14 L5 13 M17 14 L19 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
							<path d="M4 18 Q12 10 20 18" fill="url(#sunriseGlow)" stroke="none"/>
						</svg>
					{:else if greetingTimeOfDay === 'afternoon'}
						<!-- Afternoon Sun High -->
						<svg class="w-5 h-5 text-zen-gold" viewBox="0 0 24 24" fill="none">
							<circle cx="12" cy="12" r="5" fill="currentColor" opacity="0.8"/>
							<path d="M12 4 L12 6 M12 18 L12 20 M4 12 L6 12 M18 12 L20 12 M6.34 6.34 L7.76 7.76 M16.24 16.24 L17.66 17.66 M6.34 17.66 L7.76 16.24 M16.24 7.76 L17.66 6.34" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
						</svg>
					{:else if greetingTimeOfDay === 'evening'}
						<!-- Evening Moon Crescent -->
						<svg class="w-5 h-5 text-zen-sage" viewBox="0 0 24 24" fill="none">
							<defs>
								<linearGradient id="moonGlow" x1="0%" y1="0%" x2="100%" y2="100%">
									<stop offset="0%" stop-color="currentColor" stop-opacity="0.1"/>
									<stop offset="100%" stop-color="currentColor" stop-opacity="0"/>
								</linearGradient>
							</defs>
							<path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" fill="currentColor" opacity="0.8"/>
							<circle cx="8" cy="8" r="1" fill="currentColor" opacity="0.3"/>
							<circle cx="6" cy="12" r="0.5" fill="currentColor" opacity="0.2"/>
							<circle cx="9" cy="15" r="0.7" fill="currentColor" opacity="0.25"/>
						</svg>
					{:else}
						<!-- Night Stars -->
						<svg class="w-5 h-5 text-zen-gold-muted" viewBox="0 0 24 24" fill="none">
							<defs>
								<linearGradient id="nightSky" x1="0%" y1="0%" x2="0%" y2="100%">
									<stop offset="0%" stop-color="currentColor" stop-opacity="0"/>
									<stop offset="100%" stop-color="currentColor" stop-opacity="0.3"/>
								</linearGradient>
							</defs>
							<path d="M12 3 L13 5 L15 5 L13.5 6.5 L14 9 L12 7.5 L10 9 L10.5 6.5 L9 5 L11 5 Z" fill="currentColor" opacity="0.9"/>
							<path d="M18 8 L18.5 9.5 L20 9.5 L19 10.5 L19.5 12 L18 11 L16.5 12 L17 10.5 L16 9.5 L17.5 9.5 Z" fill="currentColor" opacity="0.6"/>
							<path d="M6 14 L6.3 14.8 L7 15 L6.5 15.6 L6.8 16.4 L6 16 L5.2 16.4 L5.5 15.6 L5 15 L5.7 14.8 Z" fill="currentColor" opacity="0.7"/>
							<path d="M3 8 Q12 4 21 8 Q12 6 3 8" fill="url(#nightSky)"/>
						</svg>
					{/if}
					<p class="text-zen-brown-warm/60 text-sm">{greeting}</p>
				</div>
				<h1 class="font-serif text-2xl font-medium text-zen-brown-deep tracking-wide">
					{dharmaName}
				</h1>
			</div>
		</div>
	</header>

	<main class="px-5 space-y-5">
		<!-- Main Card: Tổng công đức -->
		<div class="relative bg-zen-parchment/60 backdrop-blur-sm rounded-3xl p-6 overflow-hidden">
			<!-- Decorative SVG Pattern -->
			<div class="absolute top-0 right-0 w-40 h-40 opacity-[0.08]">
				<svg viewBox="0 0 100 100" class="w-full h-full animate-rotate-slow">
					<defs>
						<pattern id="dharmaWheel" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
							<circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" stroke-width="0.5"/>
							<circle cx="10" cy="10" r="3" fill="currentColor"/>
						</pattern>
					</defs>
					<rect width="100" height="100" fill="url(#dharmaWheel)"/>
				</svg>
			</div>
			
			<!-- Beautiful Blooming Lotus -->
			<div class="absolute -right-6 -bottom-6 w-36 h-36">
				<svg viewBox="0 0 120 120" class="w-full h-full animate-lotus-full">
					<!-- Outer glow -->
					<defs>
						<radialGradient id="lotusGlow" cx="50%" cy="50%" r="50%">
							<stop offset="0%" stop-color="#C9B896" stop-opacity="0.3"/>
							<stop offset="100%" stop-color="#C9B896" stop-opacity="0"/>
						</radialGradient>
						<linearGradient id="petalGradient1" x1="0%" y1="0%" x2="0%" y2="100%">
							<stop offset="0%" stop-color="#E8DCC8"/>
							<stop offset="100%" stop-color="#C9B896"/>
						</linearGradient>
						<linearGradient id="petalGradient2" x1="0%" y1="0%" x2="0%" y2="100%">
							<stop offset="0%" stop-color="#F5EEE0"/>
							<stop offset="100%" stop-color="#D4C4A8"/>
						</linearGradient>
						<linearGradient id="petalGradient3" x1="0%" y1="0%" x2="0%" y2="100%">
							<stop offset="0%" stop-color="#C9B896"/>
							<stop offset="100%" stop-color="#A89070"/>
						</linearGradient>
					</defs>
					
					<!-- Glow circle -->
					<circle cx="60" cy="65" r="55" fill="url(#lotusGlow)" class="animate-pulse-soft"/>
					
					<!-- Water base -->
					<ellipse cx="60" cy="105" rx="30" ry="8" fill="#C9B896" opacity="0.2"/>
					<ellipse cx="60" cy="105" rx="25" ry="6" fill="#A89070" opacity="0.15"/>
					
					<!-- Outer petals (8 petals) -->
					<g class="animate-petal-outer">
						<path d="M60 95 C50 85 35 70 35 55 C35 45 45 38 55 42 C50 55 52 72 60 85" fill="url(#petalGradient3)" opacity="0.7"/>
						<path d="M60 95 C70 85 85 70 85 55 C85 45 75 38 65 42 C70 55 68 72 60 85" fill="url(#petalGradient3)" opacity="0.7"/>
						<path d="M60 95 C45 82 25 72 20 55 C20 42 32 35 42 42 C38 55 44 72 55 88" fill="url(#petalGradient3)" opacity="0.65"/>
						<path d="M60 95 C75 82 95 72 100 55 C100 42 88 35 78 42 C82 55 76 72 65 88" fill="url(#petalGradient3)" opacity="0.65"/>
					</g>
					
					<!-- Middle petals (6 petals) -->
					<g class="animate-petal-middle">
						<path d="M60 88 C48 78 38 62 42 48 C46 38 56 38 60 48 C56 60 58 75 60 82" fill="url(#petalGradient1)" opacity="0.85"/>
						<path d="M60 88 C72 78 82 62 78 48 C74 38 64 38 60 48 C64 60 62 75 60 82" fill="url(#petalGradient1)" opacity="0.85"/>
						<path d="M60 88 C40 75 28 58 32 45 C38 32 52 35 58 48 C52 58 58 72 60 82" fill="url(#petalGradient1)" opacity="0.8"/>
						<path d="M60 88 C80 75 92 58 88 45 C82 32 68 35 62 48 C68 58 62 72 60 82" fill="url(#petalGradient1)" opacity="0.8"/>
						<path d="M60 88 C52 72 48 52 55 42 C62 32 72 38 72 50 C68 60 65 75 60 82" fill="url(#petalGradient1)" opacity="0.75"/>
						<path d="M60 88 C68 72 72 52 65 42 C58 32 48 38 48 50 C52 60 55 75 60 82" fill="url(#petalGradient1)" opacity="0.75"/>
					</g>
					
					<!-- Inner petals (5 petals) -->
					<g class="animate-petal-inner">
						<path d="M60 78 C52 68 48 52 55 45 C60 40 68 45 68 52 C64 58 62 68 60 74" fill="url(#petalGradient2)" opacity="0.95"/>
						<path d="M60 78 C68 68 72 52 65 45 C60 40 52 45 52 52 C56 58 58 68 60 74" fill="url(#petalGradient2)" opacity="0.95"/>
						<path d="M60 78 C46 68 42 52 50 44 C58 36 70 42 68 54 C64 60 62 70 60 74" fill="url(#petalGradient2)" opacity="0.9"/>
						<path d="M60 78 C74 68 78 52 70 44 C62 36 50 42 52 54 C56 60 58 70 60 74" fill="url(#petalGradient2)" opacity="0.9"/>
						<path d="M60 78 C54 62 56 45 62 40 C68 36 74 42 72 52 C68 60 65 70 60 74" fill="url(#petalGradient2)" opacity="0.88"/>
					</g>
					
					<!-- Center lotus bud -->
					<g class="animate-center-bloom">
						<ellipse cx="60" cy="62" rx="8" ry="10" fill="#F5EEE0"/>
						<ellipse cx="60" cy="60" rx="5" ry="7" fill="#E8DCC8"/>
						<ellipse cx="60" cy="58" rx="3" ry="5" fill="#D4C4A8"/>
						<!-- Stamen dots -->
						<circle cx="57" cy="56" r="1.5" fill="#C9B896"/>
						<circle cx="63" cy="56" r="1.5" fill="#C9B896"/>
						<circle cx="60" cy="54" r="1.5" fill="#C9B896"/>
						<circle cx="60" cy="60" r="1" fill="#A89070"/>
					</g>
					
					<!-- Sparkles -->
					<g class="animate-sparkle">
						<circle cx="45" cy="50" r="1" fill="#F5EEE0" opacity="0.8"/>
						<circle cx="75" cy="48" r="1.2" fill="#F5EEE0" opacity="0.7"/>
						<circle cx="60" cy="40" r="1" fill="#F5EEE0" opacity="0.9"/>
						<circle cx="48" cy="62" r="0.8" fill="#F5EEE0" opacity="0.6"/>
						<circle cx="72" cy="60" r="1" fill="#F5EEE0" opacity="0.7"/>
					</g>
				</svg>
			</div>

			<div class="relative">
				<p class="text-zen-brown-warm/50 text-sm font-light tracking-wide">Tổng công đức</p>
				
				<div class="flex items-end justify-between mt-3">
					<div>
						<p class="font-serif text-5xl font-light text-zen-brown-deep tracking-tight">
							{#if isLoading}
								<span class="opacity-30">...</span>
							{:else}
								<span class="text-shimmer">{meritPoints.toLocaleString()}</span>
							{/if}
						</p>
						<p class="text-zen-brown-warm/40 text-sm mt-1">điểm công đức</p>
					</div>
					
					<!-- Mini breathing indicator -->
					<div class="flex items-center gap-2 text-zen-gold/60">
						<div class="relative w-8 h-8">
							<div class="absolute inset-0 rounded-full border border-zen-gold/30 animate-ping"></div>
							<div class="absolute inset-2 rounded-full bg-zen-gold/20 animate-breathe-subtle"></div>
						</div>
						<span class="text-xs">đang tu tập</span>
					</div>
				</div>
			</div>
		</div>

		<!-- Streak Card -->
		{#if streak > 0}
		<div class="bg-zen-sage/10 rounded-2xl p-4 flex items-center gap-4">
			<div class="w-12 h-12 rounded-full bg-zen-sage/20 flex items-center justify-center">
				<svg class="w-6 h-6 text-zen-sage" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
					<path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
				</svg>
			</div>
			<div>
				<p class="text-zen-sage font-medium">{streak} ngày</p>
				<p class="text-zen-brown-warm/50 text-sm">Chuỗi tích tu</p>
			</div>
			<div class="ml-auto">
				<div class="flex -space-x-1">
					{#each Array(Math.min(streak, 7)) as _, i}
						<div class="w-2 h-2 rounded-full bg-zen-sage/60 animate-breathe-subtle" style="animation-delay: {i * 0.3}s;"></div>
					{/each}
				</div>
			</div>
		</div>
		{/if}

		<!-- Action Card: Tích công đức -->
		<button
			onclick={() => goto('/meditate')}
			class="w-full relative bg-gradient-to-br from-zen-gold-soft/20 to-zen-gold/10 rounded-3xl p-6 text-left overflow-hidden group"
		>
			<!-- Animated glow on hover -->
			<div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
				<div class="absolute inset-0 bg-gradient-to-br from-zen-gold/5 to-transparent"></div>
				<div class="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-zen-gold/10 blur-2xl group-hover:animate-pulse"></div>
			</div>
			
			<div class="relative flex items-start justify-between">
				<div>
					<h3 class="font-serif text-xl text-zen-brown-deep mb-2">Tích công đức</h3>
					<p class="text-zen-brown-warm/60 text-sm mb-4">Chấp tay và ngồi yên</p>
					
					<div class="inline-flex items-center gap-2 px-4 py-2 bg-zen-brown-deep text-zen-cream rounded-full text-sm font-medium group-hover:gap-3 transition-all">
						<span>Bắt đầu thiền</span>
						<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<path d="M5 12h14M12 5l7 7-7 7"/>
						</svg>
					</div>
				</div>
				
				<!-- Lotus Icon -->
				<div class="relative w-20 h-20">
					<!-- Outer glow ring -->
					<div class="absolute inset-0 rounded-full border border-zen-gold/20 animate-pulse"></div>
					<!-- Lotus SVG -->
					<svg viewBox="0 0 80 80" class="w-full h-full text-zen-gold group-hover:animate-breathe transition-transform">
						<ellipse cx="40" cy="68" rx="10" ry="4" fill="currentColor" opacity="0.3"/>
						<path d="M40 58 C40 58 28 46 28 36 C28 26 40 14 40 14 C40 14 52 26 52 36 C52 46 40 58 40 58" fill="currentColor" opacity="0.8"/>
						<path d="M28 52 C20 40 14 32 14 24 C14 16 26 12 34 16" fill="currentColor" opacity="0.6"/>
						<path d="M52 52 C60 40 66 32 66 24 C66 16 54 12 46 16" fill="currentColor" opacity="0.6"/>
						<path d="M18 56 C8 44 4 34 8 26 C12 18 26 16 34 22" fill="currentColor" opacity="0.4"/>
						<path d="M62 56 C72 44 76 34 72 26 C68 18 54 16 46 22" fill="currentColor" opacity="0.4"/>
					</svg>
				</div>
			</div>
		</button>

		<!-- Quick Actions -->
		<div class="grid grid-cols-2 gap-3">
			<button
				onclick={() => goto('/guide')}
				class="bg-zen-parchment/60 backdrop-blur-sm rounded-2xl p-4 text-left hover:bg-zen-parchment/80 transition-colors">
				<div class="w-10 h-10 rounded-xl bg-zen-gold/20 flex items-center justify-center mb-3">
					<svg class="w-5 h-5 text-zen-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
						<circle cx="12" cy="12" r="10"/>
						<path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/>
						<path d="M12 17h.01"/>
					</svg>
				</div>
				<p class="font-medium text-zen-brown-deep text-sm">Hướng dẫn</p>
				<p class="text-zen-brown-warm/50 text-xs mt-0.5">Tìm hiểu cách tu tập</p>
			</button>
			
			<button
				onclick={() => goto('/buddhist')}
				class="bg-zen-parchment/60 backdrop-blur-sm rounded-2xl p-4 text-left hover:bg-zen-parchment/80 transition-colors">
				<div class="w-10 h-10 rounded-xl bg-zen-sage/20 flex items-center justify-center mb-3">
					<svg class="w-5 h-5 text-zen-sage" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
						<path d="M4 19.5A2.5 2.5 0 016.5 17H20"/>
						<path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
					</svg>
				</div>
				<p class="font-medium text-zen-brown-deep text-sm">Kinh Phật</p>
				<p class="text-zen-brown-warm/50 text-xs mt-0.5">Lời vàng mỗi ngày</p>
			</button>
		</div>

		<!-- Spacer for bottom nav -->
		<div class="h-8"></div>
	</main>
</div>

<!-- Bottom Navigation -->
<BottomNav currentRoute="/dashboard" />

<style>
	.font-serif {
		font-family: 'Playfair Display', Georgia, serif;
	}
	
	/* Lotus Bloom Animations */
	@keyframes lotus-full {
		0% {
			transform: scale(0.5) translateY(20px);
			opacity: 0;
		}
		50% {
			opacity: 0.7;
		}
		100% {
			transform: scale(1) translateY(0);
			opacity: 1;
		}
	}
	
	@keyframes petal-outer {
		0% {
			transform: scale(0.8) translateY(10px);
			opacity: 0;
		}
		100% {
			transform: scale(1) translateY(0);
			opacity: 1;
		}
	}
	
	@keyframes petal-middle {
		0% {
			transform: scale(0.7) translateY(15px);
			opacity: 0;
		}
		100% {
			transform: scale(1) translateY(0);
			opacity: 1;
		}
	}
	
	@keyframes petal-inner {
		0% {
			transform: scale(0.6) translateY(20px);
			opacity: 0;
		}
		100% {
			transform: scale(1) translateY(0);
			opacity: 1;
		}
	}
	
	@keyframes center-bloom {
		0% {
			transform: scale(0) translateY(5px);
			opacity: 0;
		}
		100% {
			transform: scale(1) translateY(0);
			opacity: 1;
		}
	}
	
	@keyframes sparkle {
		0%, 100% {
			opacity: 0.3;
			transform: scale(1);
		}
		50% {
			opacity: 1;
			transform: scale(1.5);
		}
	}
	
	@keyframes pulse-soft {
		0%, 100% {
			opacity: 0.5;
			transform: scale(1);
		}
		50% {
			opacity: 0.8;
			transform: scale(1.05);
		}
	}
	
	.animate-lotus-full {
		animation: lotus-full 1.5s ease-out forwards;
		transform-origin: center bottom;
	}
	
	.animate-petal-outer {
		animation: petal-outer 1.2s ease-out forwards;
		transform-origin: center bottom;
		animation-delay: 0.2s;
	}
	
	.animate-petal-middle {
		animation: petal-middle 1s ease-out forwards;
		transform-origin: center bottom;
		animation-delay: 0.4s;
	}
	
	.animate-petal-inner {
		animation: petal-inner 0.8s ease-out forwards;
		transform-origin: center bottom;
		animation-delay: 0.6s;
	}
	
	.animate-center-bloom {
		animation: center-bloom 0.6s ease-out forwards;
		transform-origin: center;
		animation-delay: 0.8s;
	}
	
	.animate-sparkle {
		animation: sparkle 2s ease-in-out infinite;
	}
	
	.animate-sparkle circle:nth-child(1) { animation-delay: 0s; }
	.animate-sparkle circle:nth-child(2) { animation-delay: 0.3s; }
	.animate-sparkle circle:nth-child(3) { animation-delay: 0.6s; }
	.animate-sparkle circle:nth-child(4) { animation-delay: 0.9s; }
	.animate-sparkle circle:nth-child(5) { animation-delay: 1.2s; }
</style>
