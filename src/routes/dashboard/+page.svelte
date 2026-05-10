<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import BottomNav from '$lib/components/BottomNav.svelte';
	import LevelAvatar from '$lib/components/LevelAvatar.svelte';
	import { supabase } from '$lib/supabase';
	import { getLevelInfo, type LevelInfo } from '$lib/components/levels/index';
	import { setLevel, currentLevel as currentLevelStore, currentTheme } from '$lib/stores/theme';

	let meritPoints = $state(0);
	let streak = $state(0);
	let dharmaName = $state('Tân Viên');
	let isGuest = $state(false);
	let isLoading = $state(true);
	let greeting = $state('');
	let greetingTimeOfDay = $state<'morning' | 'afternoon' | 'evening' | 'night'>('morning');
	let mounted = $state(false);
	let levelInfo = $state<LevelInfo | null>(null);
	let previousMeritPoints = $state(0);
	let hasShownInitialLevelUp = $state(false);

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
			previousMeritPoints = parseInt(localStorage.getItem('guestMerit') || '0');
			meritPoints = previousMeritPoints;
			dharmaName = localStorage.getItem('guestDharmaName') || 'Khách';
			streak = 0;
			isLoading = false;
			levelInfo = getLevelInfo(meritPoints);
			// Initial load: just update store without notification
			currentLevelStore.set(levelInfo!.level);
			return;
		}
		try {
			const { data: { user } } = await supabase.auth.getUser();
			if (!user) { isLoading = false; return; }
			const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
			if (profile) {
				previousMeritPoints = profile.total_merits || 0;
				meritPoints = previousMeritPoints;
				streak = profile.current_streak || 0;
				dharmaName = profile.dharma_name || 'Tân Viên';
			}
		} catch (error) {
			console.error('Error fetching user data:', error);
		}
		isLoading = false;
		levelInfo = getLevelInfo(meritPoints);
		// Initial load: just update store without notification
		currentLevelStore.set(levelInfo!.level);
	}

	// Watch for merit points changes to detect level-up
	$effect(() => {
		if (!isLoading && meritPoints > 0 && meritPoints !== previousMeritPoints) {
			const newLevel = getLevelInfo(meritPoints);
			const oldLevel = getLevelInfo(previousMeritPoints);

			// Update theme - only show notification on actual level-up (not initial load)
			if (hasShownInitialLevelUp && newLevel.level > oldLevel.level) {
				setLevel(newLevel.level, meritPoints);
			} else {
				// Initial load or no level-up: just update store without notification
				currentLevelStore.set(newLevel.level);
				levelInfo = newLevel;
			}

			previousMeritPoints = meritPoints;
			hasShownInitialLevelUp = true;
		}
	});

	onMount(() => {
		mounted = true;
		getGreeting();
		fetchUserData();
	});
</script>

<div class="min-h-screen pb-24 relative overflow-hidden">
	<!-- Ambient backgrounds using theme colors -->
	<div class="fixed inset-0 overflow-hidden pointer-events-none">
		<div
			class="absolute top-0 left-1/4 w-80 h-80 rounded-full blur-3xl animate-float-drift"
			style="background: {$currentTheme.primary}20;"
		></div>
		<div
			class="absolute bottom-1/4 right-0 w-64 h-64 rounded-full blur-3xl animate-float-drift"
			style="background: {$currentTheme.secondary}15; animation-delay: -4s;"
		></div>
		<div
			class="absolute top-1/2 right-1/4 w-48 h-48 rounded-full blur-3xl animate-float-drift"
			style="background: {$currentTheme.primary}10; animation-delay: -8s;"
		></div>
	</div>

	<!-- Subtle grid pattern overlay -->
	<div class="fixed inset-0 opacity-[0.015] pointer-events-none" style="background-image: url('data:image/svg+xml,%3Csvg width=&quot;60&quot; height=&quot;60&quot; viewBox=&quot;0 0 60 60&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cg fill=&quot;none&quot; fill-rule=&quot;evenodd&quot;%3E%3Cg fill=&quot;%23C5A059&quot; fill-opacity=&quot;1&quot;%3E%3Cpath d=&quot;M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z&quot;/%3E%3C/g%3E%3C/g%3E%3C/svg%3E');"></div>

	<!-- Header -->
	<header class="relative px-6 pt-10 pb-6 z-10">
		<div class="flex items-start justify-between animate-fade-in-up">
			<div class="flex-1">
				<!-- Greeting row -->
				<div class="flex items-center gap-2.5 mb-3">
					{#if greetingTimeOfDay === 'morning'}
						<svg class="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" style="color: {$currentTheme.primary};">
							<circle cx="12" cy="16" r="5" fill="currentColor" opacity="0.7"/>
							<path d="M12 9 L12 6 M8 11 L6 9 M16 11 L18 9 M12 16 L12 19 M7 14 L5 13 M17 14 L19 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
						</svg>
					{:else if greetingTimeOfDay === 'afternoon'}
						<svg class="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" style="color: {$currentTheme.primaryLight};">
							<circle cx="12" cy="12" r="5" fill="currentColor" opacity="0.7"/>
							<path d="M12 4 L12 6 M12 18 L12 20 M4 12 L6 12 M18 12 L20 12 M6.34 6.34 L7.76 7.76 M16.24 16.24 L17.66 17.66 M6.34 17.66 L7.76 16.24 M16.24 7.76 L17.66 6.34" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
						</svg>
					{:else if greetingTimeOfDay === 'evening'}
						<svg class="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" style="color: {$currentTheme.secondary};">
							<path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" fill="currentColor" opacity="0.7"/>
						</svg>
					{:else}
						<svg class="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor" style="color: {$currentTheme.textMuted};">
							<path d="M12 3 L13 5 L15 5 L13.5 6.5 L14 9 L12 7.5 L10 9 L10.5 6.5 L9 5 L11 5 Z" opacity="0.9"/>
							<path d="M18 8 L18.5 9.5 L20 9.5 L19 10.5 L19.5 12 L18 11 L16.5 12 L17 10.5 L16 9.5 L17.5 9.5 Z" opacity="0.5"/>
							<path d="M6 14 L6.3 14.8 L7 15 L6.5 15.6 L6.8 16.4 L6 16 L5.2 16.4 L5.5 15.6 L5 15 L5.7 14.8 Z" opacity="0.6"/>
						</svg>
					{/if}
					<p class="text-sm font-light tracking-wide" style="color: {$currentTheme.textMuted};">{greeting}</p>
				</div>

				<!-- Dharma name -->
				<h1 class="font-serif text-3xl font-light tracking-wide leading-none" style="color: {$currentTheme.textPrimary};">
					{dharmaName}
				</h1>

				<!-- Decorative line -->
				<div class="flex items-center gap-3 mt-4">
					<div class="w-8 h-px" style="background: linear-gradient(to right, {$currentTheme.primary}40, transparent);"></div>
					<div class="w-1.5 h-1.5 rounded-full" style="background: {$currentTheme.primary}30;"></div>
				</div>
			</div>

			<!-- Avatar button -->
			<button onclick={() => goto('/profile')} class="relative flex-shrink-0 ml-4">
				{#if levelInfo && !isLoading}
					<div
						class="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center z-10 shadow-lg"
						style="background: {$currentTheme.bgDeep}; border: 1px solid {$currentTheme.primary}30;"
					>
						<LevelAvatar level={levelInfo.level} size="xs" showGlow={false} />
					</div>
				{/if}
				<div
					class="w-12 h-12 rounded-full border p-0.5 shadow-lg"
					style="
						background: linear-gradient(145deg, {$currentTheme.primary}20, {$currentTheme.primary}08);
						border-color: {$currentTheme.primary}20;
						box-shadow: 0 4px 20px {$currentTheme.glow};
					"
				>
					<div class="w-full h-full rounded-full flex items-center justify-center overflow-hidden" style="background: {$currentTheme.bgSurface};">
						{#if isLoading}
							<div class="w-5 h-5 rounded-full animate-spin" style="border: 1px solid {$currentTheme.primary}20; border-top-color: {$currentTheme.primary}60;"></div>
						{:else}
							<LevelAvatar level={levelInfo?.level || 1} size="md" showGlow={true} />
						{/if}
					</div>
				</div>
			</button>
		</div>
	</header>

	<main class="px-5 space-y-4 relative z-10">

		<!-- Main Merit Card -->
		<div class="relative rounded-3xl overflow-hidden animate-fade-in-up" style="animation-delay: 0.08s;">
			<!-- Background gradient -->
			<div class="absolute inset-0" style="background: linear-gradient(145deg, {$currentTheme.bgCard}, {$currentTheme.bgSurface}, {$currentTheme.bgDeep});"></div>
			<!-- Top accent line -->
			<div class="absolute top-0 left-0 right-0 h-px" style="background: linear-gradient(to right, transparent, {$currentTheme.primary}30, transparent);"></div>
			<!-- Corner ornaments -->
			<svg class="absolute top-4 left-4 w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.5" style="color: {$currentTheme.primary}10;">
				<path d="M3 3 L12 3 M3 3 L3 12" stroke-linecap="round"/>
			</svg>
			<svg class="absolute top-4 right-4 w-5 h-5 rotate-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.5" style="color: {$currentTheme.primary}10;">
				<path d="M3 3 L12 3 M3 3 L3 12" stroke-linecap="round"/>
			</svg>

			<!-- Decorative lotus silhouette -->
			<div class="absolute right-4 bottom-2 w-32 h-32 opacity-5">
				<svg viewBox="0 0 100 100" class="w-full h-full">
					<ellipse cx="50" cy="40" rx="12" ry="25" fill={$currentTheme.primary} transform="rotate(0 50 65)"/>
					<ellipse cx="50" cy="40" rx="12" ry="25" fill={$currentTheme.primary} transform="rotate(72 50 65)"/>
					<ellipse cx="50" cy="40" rx="12" ry="25" fill={$currentTheme.primary} transform="rotate(144 50 65)"/>
					<ellipse cx="50" cy="40" rx="12" ry="25" fill={$currentTheme.primary} transform="rotate(216 50 65)"/>
					<ellipse cx="50" cy="40" rx="12" ry="25" fill={$currentTheme.primary} transform="rotate(288 50 65)"/>
					<circle cx="50" cy="65" r="8" fill={$currentTheme.primary}/>
				</svg>
			</div>

			<div class="relative p-6">
				<div class="flex items-center justify-between mb-6">
					<div class="flex items-center gap-2">
						<svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor" style="color: {$currentTheme.primary}50;">
							<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
						</svg>
						<span class="text-xs tracking-[0.2em] uppercase" style="color: {$currentTheme.textMuted};">Tổng công đức</span>
					</div>
					{#if levelInfo && !isLoading}
						<button onclick={() => goto('/profile/level')} class="flex items-center gap-1.5 px-3 py-1 rounded-full border transition-all group hover:scale-105"
							style="
								background: {$currentTheme.primary}08;
								border-color: {$currentTheme.primary}15;
							"
						>
							<div class="w-4 h-4">
								<LevelAvatar level={levelInfo.level} size="xs" showGlow={false} />
							</div>
							<span class="text-xs font-medium" style="color: {$currentTheme.primary}80;">{levelInfo.name}</span>
							<svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: {$currentTheme.primary}40;">
								<path d="M9 18l6-6-6-6"/>
							</svg>
						</button>
					{/if}
				</div>

				<div class="flex items-end justify-between">
					<div>
						<div class="flex items-baseline gap-2">
							{#if isLoading}
								<span class="font-serif text-6xl font-light opacity-20">...</span>
							{:else}
								<span class="font-serif text-6xl font-light tracking-tight tabular-nums" style="color: {$currentTheme.textPrimary};">{meritPoints.toLocaleString()}</span>
							{/if}
						</div>
						<p class="text-sm mt-2 font-light tracking-wide" style="color: {$currentTheme.textMuted}; opacity: 0.4;">điểm công đức</p>
					</div>

					<!-- Breathing lotus icon -->
					<div class="w-14 h-14 animate-breathe-subtle">
						<svg class="w-full h-full" viewBox="0 0 60 60" fill="none" style="color: {$currentTheme.primary}60;">
							<ellipse cx="30" cy="18" rx="5" ry="13" fill="currentColor" opacity="0.6" transform="rotate(0 30 38)"/>
							<ellipse cx="30" cy="18" rx="5" ry="13" fill="currentColor" opacity="0.6" transform="rotate(60 30 38)"/>
							<ellipse cx="30" cy="18" rx="5" ry="13" fill="currentColor" opacity="0.6" transform="rotate(120 30 38)"/>
							<ellipse cx="30" cy="18" rx="5" ry="13" fill="currentColor" opacity="0.6" transform="rotate(180 30 38)"/>
							<ellipse cx="30" cy="18" rx="5" ry="13" fill="currentColor" opacity="0.6" transform="rotate(240 30 38)"/>
							<ellipse cx="30" cy="18" rx="5" ry="13" fill="currentColor" opacity="0.6" transform="rotate(300 30 38)"/>
							<circle cx="30" cy="38" r="5" fill="currentColor" opacity="0.8"/>
						</svg>
					</div>
				</div>
			</div>
		</div>

		<!-- Streak Card -->
		{#if streak > 0}
		<div class="rounded-2xl overflow-hidden animate-fade-in-up border animate-fade-in-up" style="animation-delay: 0.15s; border-color: {$currentTheme.secondary}10;">
			<div class="absolute inset-0" style="background: linear-gradient(to right, {$currentTheme.secondary}05, transparent);"></div>
			<div class="relative flex items-center gap-4 px-5 py-4">
				<div class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style="background: {$currentTheme.secondary}10; border: 1px solid {$currentTheme.secondary}15;">
					<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" style="color: {$currentTheme.secondary}70;">
						<path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
					</svg>
				</div>
				<div class="flex-1">
					<p class="font-light text-sm" style="color: {$currentTheme.secondary};">
						<span class="font-medium">{streak}</span> ngày liên tục
					</p>
					<p class="text-xs mt-0.5" style="color: {$currentTheme.textMuted}; opacity: 0.3;">Chuỗi tích tụ của bạn</p>
				</div>
				<div class="w-px h-8" style="background: linear-gradient(to bottom, transparent, {$currentTheme.secondary}10, transparent);"></div>
			</div>
		</div>
		{/if}

		<!-- Practice Cards - 3 Column Grid -->
		<div class="grid grid-cols-3 gap-3 stagger-children">
			<!-- Meditation -->
			<button onclick={() => goto('/meditate')} class="group relative rounded-2xl overflow-hidden aspect-square">
				<div class="absolute inset-0 border group-hover:border transition-colors" style="background: linear-gradient(to bottom, {$currentTheme.bgCard}, {$currentTheme.bgDeep}); border-color: {$currentTheme.primary}10;"></div>
				<!-- Top accent -->
				<div class="absolute top-0 left-0 right-0 h-px" style="background: linear-gradient(to right, transparent, {$currentTheme.primary}20, transparent);" class:group-hover:transition-colors={true}></div>

				<div class="relative h-full flex flex-col items-center justify-center p-3">
					<div class="w-11 h-11 rounded-1.5xl flex items-center justify-center mb-2.5 transition-all group-hover:scale-105" style="background: {$currentTheme.primary}08;">
						<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" style="color: {$currentTheme.primary}70;">
							<circle cx="12" cy="8" r="4"/>
							<path d="M6 20v-2a4 4 0 014-4h4a4 4 0 014 4v2"/>
						</svg>
					</div>
					<span class="font-serif text-sm tracking-wide leading-none mb-1" style="color: {$currentTheme.textPrimary}; opacity: 0.8;">Thiền</span>
					<span class="text-xs font-light" style="color: {$currentTheme.textMuted}; opacity: 0.3;">10 phút</span>
				</div>
			</button>

			<!-- Prayer -->
			<button onclick={() => goto('/praying')} class="group relative rounded-2xl overflow-hidden aspect-square">
				<div class="absolute inset-0 border group-hover:border transition-colors" style="background: linear-gradient(to bottom, {$currentTheme.bgCard}, {$currentTheme.bgDeep}); border-color: {$currentTheme.primary}10;"></div>
				<div class="absolute top-0 left-0 right-0 h-px" style="background: linear-gradient(to right, transparent, {$currentTheme.primary}20, transparent);"></div>

				<div class="relative h-full flex flex-col items-center justify-center p-3">
					<div class="w-11 h-11 rounded-1.5xl flex items-center justify-center mb-2.5 transition-all group-hover:scale-105" style="background: {$currentTheme.primary}08;">
						<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" style="color: {$currentTheme.primary}70;">
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
					<span class="font-serif text-sm tracking-wide leading-none mb-1" style="color: {$currentTheme.textPrimary}; opacity: 0.8;">Hành Đạo</span>
					<span class="text-xs font-light" style="color: {$currentTheme.textMuted}; opacity: 0.3;">10 giây</span>
				</div>
			</button>

			<!-- Mokugyo -->
			<button onclick={() => goto('/mokugyo')} class="group relative rounded-2xl overflow-hidden aspect-square">
				<div class="absolute inset-0 border group-hover:border transition-colors" style="background: linear-gradient(to bottom, {$currentTheme.bgCard}, {$currentTheme.bgDeep}); border-color: {$currentTheme.secondary}10;"></div>
				<div class="absolute top-0 left-0 right-0 h-px" style="background: linear-gradient(to right, transparent, {$currentTheme.secondary}20, transparent);"></div>

				<div class="relative h-full flex flex-col items-center justify-center p-3">
					<div class="w-11 h-11 rounded-1.5xl flex items-center justify-center mb-2.5 transition-all group-hover:scale-105" style="background: {$currentTheme.secondary}08;">
						<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" style="color: {$currentTheme.secondary}70;">
							<ellipse cx="12" cy="14" rx="8" ry="6"/>
							<path d="M12 8V6"/>
							<ellipse cx="12" cy="5" rx="3" ry="2"/>
						</svg>
					</div>
					<span class="font-serif text-sm tracking-wide leading-none mb-1" style="color: {$currentTheme.textPrimary}; opacity: 0.8;">Gõ Mõ</span>
					<span class="text-xs font-light" style="color: {$currentTheme.textMuted}; opacity: 0.3;">108 lần</span>
				</div>
			</button>
		</div>

		<!-- Quick Actions -->
		<div class="grid grid-cols-2 gap-3 stagger-children">
			<button onclick={() => goto('/guide')} class="group relative rounded-2xl overflow-hidden text-left">
				<div class="absolute inset-0 border group-hover:border transition-colors" style="background: linear-gradient(to bottom right, {$currentTheme.bgCard}, {$currentTheme.bgDeep}); border-color: {$currentTheme.primary}08;"></div>
				<div class="absolute top-0 left-0 right-0 h-px" style="background: linear-gradient(to right, transparent, {$currentTheme.primary}10, transparent);"></div>
				<div class="relative p-4 flex items-start gap-3">
					<div class="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors" style="background: {$currentTheme.primary}08;">
						<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" style="color: {$currentTheme.primary}60;">
							<circle cx="12" cy="12" r="10"/>
							<path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/>
							<path d="M12 17h.01"/>
						</svg>
					</div>
					<div>
						<p class="text-sm font-light tracking-wide leading-tight" style="color: {$currentTheme.textPrimary}; opacity: 0.8;">Hướng dẫn</p>
						<p class="text-xs mt-1 font-light" style="color: {$currentTheme.textMuted}; opacity: 0.3;">Cách tu tập</p>
					</div>
				</div>
			</button>

			<button onclick={() => goto('/buddhist')} class="group relative rounded-2xl overflow-hidden text-left">
				<div class="absolute inset-0 border group-hover:border transition-colors" style="background: linear-gradient(to bottom right, {$currentTheme.bgCard}, {$currentTheme.bgDeep}); border-color: {$currentTheme.secondary}08;"></div>
				<div class="absolute top-0 left-0 right-0 h-px" style="background: linear-gradient(to right, transparent, {$currentTheme.secondary}10, transparent);"></div>
				<div class="relative p-4 flex items-start gap-3">
					<div class="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors" style="background: {$currentTheme.secondary}08;">
						<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" style="color: {$currentTheme.secondary}60;">
							<path d="M4 19.5A2.5 2.5 0 016.5 17H20"/>
							<path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
						</svg>
					</div>
					<div>
						<p class="text-sm font-light tracking-wide leading-tight" style="color: {$currentTheme.textPrimary}; opacity: 0.8;">Kinh Phật</p>
						<p class="text-xs mt-1 font-light" style="color: {$currentTheme.textMuted}; opacity: 0.3;">Lịch & lời kinh</p>
					</div>
				</div>
			</button>
		</div>

		<!-- Daily quote -->
		<div class="relative py-6 animate-fade-in-up" style="animation-delay: 0.5s;">
			<div class="flex items-center gap-4">
				<div class="flex-shrink-0 w-8 h-px" style="background: linear-gradient(to right, transparent, {$currentTheme.primary}15);"></div>
				<p class="flex-1 text-center font-serif-alt text-sm italic font-light leading-relaxed px-2" style="color: {$currentTheme.textMuted}; opacity: 0.35;">
					"Những điều tốt đẹp nhất trong cuộc sống là những điều chúng ta không thể thấy bằng mắt"
				</p>
				<div class="flex-shrink-0 w-8 h-px" style="background: linear-gradient(to left, transparent, {$currentTheme.primary}15);"></div>
			</div>
		</div>
	</main>
</div>

<BottomNav currentRoute="/dashboard" />
