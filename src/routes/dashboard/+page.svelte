<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import BottomNav from '$lib/components/BottomNav.svelte';
	import LevelAvatar from '$lib/components/LevelAvatar.svelte';
	import { supabase } from '$lib/supabase';
	import { getLevelInfo, type LevelInfo } from '$lib/components/levels/index';

	// User data
	let meritPoints = $state(0);
	let streak = $state(0);
	let dharmaName = $state('Tân Viên');
	let isGuest = $state(false);
	let isLoading = $state(true);
	let greeting = $state('');
	let greetingTimeOfDay = $state<'morning' | 'afternoon' | 'evening' | 'night'>('morning');
	let mounted = $state(false);
	let currentLevel = $state<LevelInfo | null>(null);

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
			currentLevel = getLevelInfo(meritPoints);
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
		currentLevel = getLevelInfo(meritPoints);
	}

	onMount(() => {
		mounted = true;
		getGreeting();
		fetchUserData();
	});
</script>

<div class="min-h-screen bg-[#F7F3F0] pb-24 relative overflow-hidden">
	<!-- Background decorations -->
	<div class="fixed inset-0 overflow-hidden pointer-events-none">
		<div class="absolute top-0 right-0 w-64 h-64 bg-[#C5A059]/5 rounded-full blur-3xl animate-float-drift"></div>
		<div class="absolute bottom-1/3 left-0 w-48 h-48 bg-[#9CAF88]/5 rounded-full blur-3xl animate-float-drift" style="animation-delay: -5s;"></div>
	</div>

	<!-- Header -->
	<header class="relative px-6 pt-10 pb-8 z-10">
		<div class="flex items-center justify-between animate-fade-in-up">
			<div>
				<div class="flex items-center gap-2 mb-2">
					<!-- Time of Day Icon -->
					{#if greetingTimeOfDay === 'morning'}
						<svg class="w-5 h-5 text-[#C5A059] animate-gentle-glow" viewBox="0 0 24 24" fill="none">
							<circle cx="12" cy="16" r="5" fill="currentColor" opacity="0.8"/>
							<path d="M12 9 L12 6 M8 11 L6 9 M16 11 L18 9 M12 16 L12 19 M7 14 L5 13 M17 14 L19 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
						</svg>
					{:else if greetingTimeOfDay === 'afternoon'}
						<svg class="w-5 h-5 text-[#C5A059] animate-gentle-glow" viewBox="0 0 24 24" fill="none">
							<circle cx="12" cy="12" r="5" fill="currentColor" opacity="0.8"/>
							<path d="M12 4 L12 6 M12 18 L12 20 M4 12 L6 12 M18 12 L20 12 M6.34 6.34 L7.76 7.76 M16.24 16.24 L17.66 17.66 M6.34 17.66 L7.76 16.24 M16.24 7.76 L17.66 6.34" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
						</svg>
					{:else if greetingTimeOfDay === 'evening'}
						<svg class="w-5 h-5 text-[#93B1A7] animate-gentle-glow" viewBox="0 0 24 24" fill="none">
							<path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" fill="currentColor" opacity="0.8"/>
						</svg>
					{:else}
						<svg class="w-5 h-5 text-[#A69070] animate-gentle-glow" viewBox="0 0 24 24" fill="none">
							<path d="M12 3 L13 5 L15 5 L13.5 6.5 L14 9 L12 7.5 L10 9 L10.5 6.5 L9 5 L11 5 Z" fill="currentColor" opacity="0.9"/>
							<path d="M18 8 L18.5 9.5 L20 9.5 L19 10.5 L19.5 12 L18 11 L16.5 12 L17 10.5 L16 9.5 L17.5 9.5 Z" fill="currentColor" opacity="0.6"/>
							<path d="M6 14 L6.3 14.8 L7 15 L6.5 15.6 L6.8 16.4 L6 16 L5.2 16.4 L5.5 15.6 L5 15 L5.7 14.8 Z" fill="currentColor" opacity="0.7"/>
						</svg>
					{/if}
					<p class="text-[#7A6B5A] text-sm font-light">{greeting}</p>
				</div>
				<h1 class="font-serif text-2xl font-light text-[#3D3229] tracking-wide">
					{dharmaName}
				</h1>
			</div>

			<!-- Profile button with level avatar -->
			<button onclick={() => goto('/profile')} class="relative">
				<!-- Small level indicator -->
				{#if currentLevel && !isLoading}
					<div class="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#FAF8F5] border-2 border-[#C5A059] flex items-center justify-center shadow-md z-10">
						<LevelAvatar level={currentLevel.level} size="sm" showGlow={false} class="w-3 h-3 [&>div]:w-3 [&>div]:h-3" />
					</div>
				{/if}

				<div class="w-12 h-12 rounded-full bg-gradient-to-br from-[#C5A059] to-[#A69070] p-0.5 shadow-lg shadow-[#C5A059]/20">
					<div class="w-full h-full rounded-full bg-[#FAF8F5] flex items-center justify-center overflow-hidden">
						{#if isLoading}
							<div class="w-6 h-6 border-2 border-[#C5A059]/30 border-t-[#C5A059] rounded-full animate-spin"></div>
						{:else}
							<LevelAvatar level={currentLevel?.level || 1} size="md" showGlow={false} class="w-10 h-10" />
						{/if}
					</div>
				</div>
			</button>
		</div>
	</header>

	<main class="px-6 space-y-5 relative z-10">
		<!-- Main Card: Tổng công đức -->
		<div class="relative bg-gradient-to-br from-[#F2EDE6] to-[#FAF8F5] rounded-3xl p-6 overflow-hidden shadow-sm border border-[#E8E0D8]/50 animate-fade-in-up" style="animation-delay: 0.1s;">
			<!-- Static Lotus decoration -->
			<div class="absolute -right-8 -bottom-8 w-44 h-44 opacity-20">
				<svg viewBox="0 0 120 120" class="w-full h-full">
					<defs>
						<linearGradient id="dashLotus" x1="0%" y1="100%" x2="0%" y2="0%">
							<stop offset="0%" stop-color="#C9B896" stop-opacity="0.6"/>
							<stop offset="100%" stop-color="#E8DCC8" stop-opacity="0.8"/>
						</linearGradient>
					</defs>
					<ellipse cx="60" cy="105" rx="30" ry="8" fill="#C9B896" opacity="0.2"/>
					<ellipse cx="60" cy="50" rx="10" ry="22" fill="url(#dashLotus)" transform="rotate(0 60 70)" opacity="0.6"/>
					<ellipse cx="60" cy="50" rx="10" ry="22" fill="url(#dashLotus)" transform="rotate(60 60 70)" opacity="0.6"/>
					<ellipse cx="60" cy="50" rx="10" ry="22" fill="url(#dashLotus)" transform="rotate(120 60 70)" opacity="0.6"/>
					<ellipse cx="60" cy="50" rx="10" ry="22" fill="url(#dashLotus)" transform="rotate(180 60 70)" opacity="0.6"/>
					<ellipse cx="60" cy="50" rx="10" ry="22" fill="url(#dashLotus)" transform="rotate(240 60 70)" opacity="0.6"/>
					<ellipse cx="60" cy="50" rx="10" ry="22" fill="url(#dashLotus)" transform="rotate(300 60 70)" opacity="0.6"/>
					<circle cx="60" cy="70" r="8" fill="#C9B896" opacity="0.7"/>
				</svg>
			</div>

			<div class="relative">
				<div class="flex items-center justify-between">
					<p class="text-[#7A6B5A] text-sm font-light tracking-wide">Tổng công đức</p>
					
					<!-- Level badge -->
					{#if currentLevel && !isLoading}
						<button onclick={() => goto('/profile/level')} class="flex items-center gap-1.5 px-3 py-1 bg-[#C5A059]/10 rounded-full border border-[#C5A059]/20 hover:bg-[#C5A059]/20 transition-colors">
							<div class="w-4 h-4">
								<LevelAvatar level={currentLevel.level} size="sm" showGlow={false} />
							</div>
							<span class="text-[#C5A059] text-xs font-medium">{currentLevel.name}</span>
						</button>
					{/if}
				</div>

				<div class="flex items-end justify-between mt-3">
					<div>
						<p class="font-serif text-5xl font-light text-[#3D3229] tracking-tight">
							{#if isLoading}
								<span class="opacity-30">...</span>
							{:else}
								{meritPoints.toLocaleString()}
							{/if}
						</p>
						<p class="text-[#7A6B5A]/40 text-sm mt-1">điểm công đức</p>
					</div>

					<!-- Breathing lotus -->
					<div class="w-16 h-16 animate-breathe-subtle">
						<svg class="w-full h-full text-[#C5A059]" viewBox="0 0 60 60" fill="none">
							<ellipse cx="30" cy="18" rx="6" ry="12" fill="currentColor" opacity="0.5" transform="rotate(0 30 38)"/>
							<ellipse cx="30" cy="18" rx="6" ry="12" fill="currentColor" opacity="0.5" transform="rotate(60 30 38)"/>
							<ellipse cx="30" cy="18" rx="6" ry="12" fill="currentColor" opacity="0.5" transform="rotate(120 30 38)"/>
							<ellipse cx="30" cy="18" rx="6" ry="12" fill="currentColor" opacity="0.5" transform="rotate(180 30 38)"/>
							<ellipse cx="30" cy="18" rx="6" ry="12" fill="currentColor" opacity="0.5" transform="rotate(240 30 38)"/>
							<ellipse cx="30" cy="18" rx="6" ry="12" fill="currentColor" opacity="0.5" transform="rotate(300 30 38)"/>
							<circle cx="30" cy="38" r="4" fill="currentColor" opacity="0.6"/>
						</svg>
					</div>
				</div>
			</div>
		</div>

		<!-- Streak Card -->
		{#if streak > 0}
		<div class="bg-[#9CAF88]/10 rounded-2xl p-4 flex items-center gap-4 animate-fade-in-up border border-[#9CAF88]/10" style="animation-delay: 0.2s;">
			<div class="w-12 h-12 rounded-full bg-[#9CAF88]/15 flex items-center justify-center">
				<svg class="w-6 h-6 text-[#9CAF88]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
					<path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
				</svg>
			</div>
			<div>
				<p class="text-[#9CAF88] font-medium">{streak} ngày</p>
				<p class="text-[#7A6B5A]/50 text-sm">Chuỗi tích tụ</p>
			</div>
		</div>
		{/if}

		<!-- Action Cards -->
		<div class="grid grid-cols-3 gap-3">
			<!-- Thiền Card -->
			<button
				onclick={() => goto('/meditate')}
				class="relative bg-gradient-to-b from-[#F2EDE6] to-[#EDE8E3] rounded-2xl p-4 text-left overflow-hidden border border-[#E8E0D8]/50 hover:border-[#C5A059]/30 transition-all duration-300 animate-fade-in-up group"
				style="animation-delay: 0.3s;"
			>
				<div class="relative">
					<div class="w-11 h-11 rounded-xl bg-[#C5A059]/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
						<svg class="w-5 h-5 text-[#C5A059]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
							<circle cx="12" cy="8" r="4"/>
							<path d="M6 20v-2a4 4 0 014-4h4a4 4 0 014 4v2"/>
						</svg>
					</div>
					<h3 class="font-serif text-sm text-[#3D3028] mb-0.5">Thiền</h3>
					<p class="text-[#7A6B5A]/40 text-xs">10 phút</p>
				</div>
			</button>

			<!-- Hành Đạo Card -->
			<button
				onclick={() => goto('/praying')}
				class="relative bg-gradient-to-b from-[#F2EDE6] to-[#EDE8E3] rounded-2xl p-4 text-left overflow-hidden border border-[#E8E0D8]/50 hover:border-[#C5A059]/30 transition-all duration-300 animate-fade-in-up group"
				style="animation-delay: 0.4s;"
			>
				<div class="relative">
					<div class="w-11 h-11 rounded-xl bg-[#C5A059]/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
						<svg class="w-5 h-5 text-[#C5A059]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
							<path d="M12 2L12 6"/>
							<path d="M12 18L12 22"/>
							<circle cx="12" cy="12" r="4"/>
							<path d="M4.93 4.93L7.76 7.76"/>
							<path d="M16.24 16.24L19.07 19.07"/>
							<path d="M2 12L6 12"/>
							<path d="M18 12L22 12"/>
							<path d="M4.93 19.07L7.76 16.24"/>
							<path d="M16.24 7.76L19.07 4.93"/>
						</svg>
					</div>
					<h3 class="font-serif text-sm text-[#3D3028] mb-0.5">Hành Đạo</h3>
					<p class="text-[#7A6B5A]/40 text-xs">10 giây</p>
				</div>
			</button>

			<!-- Gõ Mõ Card -->
			<button
				onclick={() => goto('/mokugyo')}
				class="relative bg-gradient-to-b from-[#F2EDE6] to-[#EDE8E3] rounded-2xl p-4 text-left overflow-hidden border border-[#E8E0D8]/50 hover:border-[#93B1A7]/30 transition-all duration-300 animate-fade-in-up group"
				style="animation-delay: 0.5s;"
			>
				<div class="relative">
					<div class="w-11 h-11 rounded-xl bg-[#93B1A7]/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
						<svg class="w-5 h-5 text-[#93B1A7]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
							<ellipse cx="12" cy="14" rx="8" ry="6"/>
							<path d="M12 8V6"/>
							<ellipse cx="12" cy="5" rx="3" ry="2"/>
						</svg>
					</div>
					<h3 class="font-serif text-sm text-[#3D3028] mb-0.5">Gõ Mõ</h3>
					<p class="text-[#7A6B5A]/40 text-xs">Tích điểm</p>
				</div>
			</button>
		</div>

		<!-- Quick Actions -->
		<div class="grid grid-cols-2 gap-3 animate-fade-in-up" style="animation-delay: 0.6s;">
			<button
				onclick={() => goto('/guide')}
				class="bg-gradient-to-b from-[#F2EDE6] to-[#EDE8E3] rounded-2xl p-5 text-left border border-[#E8E0D8]/50 hover:border-[#C5A059]/30 transition-all duration-300"
			>
				<div class="w-10 h-10 rounded-xl bg-[#C5A059]/15 flex items-center justify-center mb-3">
					<svg class="w-5 h-5 text-[#C5A059]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
						<circle cx="12" cy="12" r="10"/>
						<path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/>
						<path d="M12 17h.01"/>
					</svg>
				</div>
				<p class="font-medium text-[#3D3229] text-sm">Hướng dẫn</p>
				<p class="text-[#7A6B5A]/50 text-xs mt-0.5">Tìm hiểu cách tu tập</p>
			</button>

			<button
				onclick={() => goto('/buddhist')}
				class="bg-gradient-to-b from-[#F2EDE6] to-[#EDE8E3] rounded-2xl p-5 text-left border border-[#E8E0D8]/50 hover:border-[#9CAF88]/30 transition-all duration-300"
			>
				<div class="w-10 h-10 rounded-xl bg-[#9CAF88]/15 flex items-center justify-center mb-3">
					<svg class="w-5 h-5 text-[#9CAF88]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
						<path d="M4 19.5A2.5 2.5 0 016.5 17H20"/>
						<path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
					</svg>
				</div>
				<p class="font-medium text-[#3D3229] text-sm">Kinh Phật</p>
				<p class="text-[#7A6B5A]/50 text-xs mt-0.5">Lời vàng mỗi ngày</p>
			</button>
		</div>

		<!-- Daily Quote -->
		<div class="text-center py-6 animate-fade-in-up" style="animation-delay: 0.7s;">
			<p class="text-[#3D3028]/20 text-xs italic leading-relaxed">
				"Những điều tốt đẹp nhất trong cuộc sống là những điều chúng ta không thể thấy bằng mắt"
			</p>
		</div>
	</main>
</div>

<!-- Bottom Navigation -->
<BottomNav currentRoute="/dashboard" />

<style>
	.font-serif {
		font-family: 'Playfair Display', Georgia, serif;
	}
</style>
