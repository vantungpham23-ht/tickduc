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
		currentLevelStore.set(levelInfo!.level);
	}

	$effect(() => {
		if (!isLoading && meritPoints > 0 && meritPoints !== previousMeritPoints) {
			const newLevel = getLevelInfo(meritPoints);
			const oldLevel = getLevelInfo(previousMeritPoints);

			if (hasShownInitialLevelUp && newLevel.level > oldLevel.level) {
				setLevel(newLevel.level, meritPoints);
			} else {
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

<div class="min-h-screen pb-24 relative overflow-hidden" style="background-color: var(--color-bg-primary, #F9F8F6);">
	<!-- Ambient backgrounds -->
	<div class="fixed inset-0 overflow-hidden pointer-events-none">
		<div
			class="absolute top-0 left-1/4 w-80 h-80 rounded-full blur-3xl animate-float-drift"
			style="background: {$currentTheme.primary}10;"
		></div>
		<div
			class="absolute bottom-1/4 right-0 w-64 h-64 rounded-full blur-3xl animate-float-drift"
			style="background: {$currentTheme.secondary}08; animation-delay: -4s;"
		></div>
	</div>

	<!-- Header -->
	<header class="relative px-6 pt-10 pb-6 z-10">
		<div class="flex items-start justify-between animate-fade-in-up">
			<div class="flex-1">
				<!-- Greeting -->
				<div class="flex items-center gap-2 mb-3">
					<span class="text-sm font-medium" style="color: {$currentTheme.primary};">{greeting}</span>
				</div>

				<!-- Dharma name -->
				<h1 class="font-serif text-3xl font-medium leading-none" style="color: {$currentTheme.textPrimary};">
					{dharmaName}
				</h1>
			</div>

			<!-- Avatar button -->
			<button onclick={() => goto('/profile')} class="relative flex-shrink-0 ml-4">
				{#if levelInfo && !isLoading}
					<div
						class="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center z-10 shadow-md"
						style="background: {$currentTheme.bgCard}; border: 1px solid {$currentTheme.primary}20;"
					>
						<LevelAvatar level={levelInfo.level} size="xs" showGlow={false} />
					</div>
				{/if}
				<div
					class="w-14 h-14 rounded-full flex items-center justify-center shadow-lg"
					style="background: linear-gradient(135deg, var(--color-bg-card), var(--color-bg-surface)); border: 1px solid var(--color-border-default);"
				>
					{#if isLoading}
						<div class="w-6 h-6 rounded-full animate-spin" style="border: 2px solid {$currentTheme.primary}20; border-top-color: {$currentTheme.primary};"></div>
					{:else}
						<LevelAvatar level={levelInfo?.level || 1} size="lg" showGlow={true} />
					{/if}
				</div>
			</button>
		</div>
	</header>

	<main class="px-5 space-y-5 relative z-10">

		<!-- Main Merit Card -->
		<div class="relative rounded-2xl overflow-hidden animate-fade-in-up shadow-lg" style="animation-delay: 0.08s; background: {$currentTheme.bgCard};">
			<!-- Top accent bar -->
			<div class="h-1" style="background: linear-gradient(90deg, {$currentTheme.primary}, {$currentTheme.primaryLight});"></div>

			<div class="p-6">
				<div class="flex items-center justify-between mb-4">
					<div class="flex items-center gap-2">
						<svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" style="color: {$currentTheme.primary};">
							<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
						</svg>
						<span class="text-xs font-medium uppercase tracking-wider" style="color: {$currentTheme.textMuted};">Tổng công đức</span>
					</div>
					{#if levelInfo && !isLoading}
						<button onclick={() => goto('/profile/level')} class="flex items-center gap-2 px-3 py-1.5 rounded-full transition-all hover:scale-105"
							style="background: {$currentTheme.primary}10; border: 1px solid {$currentTheme.primary}20;"
						>
							<div class="w-5 h-5">
								<LevelAvatar level={levelInfo.level} size="xs" showGlow={false} />
							</div>
							<span class="text-sm font-medium" style="color: {$currentTheme.primary};">{levelInfo.name}</span>
							<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: {$currentTheme.primary}; opacity: 0.6;">
								<path d="M9 18l6-6-6-6"/>
							</svg>
						</button>
					{/if}
				</div>

				<div class="flex items-end justify-between">
					<div>
						<div class="flex items-baseline gap-2">
							{#if isLoading}
								<span class="font-serif text-6xl font-medium opacity-30">...</span>
							{:else}
								<span class="font-serif text-6xl font-medium tabular-nums" style="color: {$currentTheme.textPrimary};">{meritPoints.toLocaleString()}</span>
							{/if}
						</div>
						<p class="text-base mt-2" style="color: {$currentTheme.textMuted};">điểm công đức</p>
					</div>

					<!-- Breathing lotus icon -->
					<div class="w-16 h-16 animate-breathe-subtle">
						<svg class="w-full h-full" viewBox="0 0 60 60" fill="none" style="color: {$currentTheme.primary};">
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
		<div class="rounded-2xl p-5 animate-fade-in-up shadow-sm" style="animation-delay: 0.15s; background: {$currentTheme.bgCard}; border: 1px solid {$currentTheme.secondary}20;">
			<div class="flex items-center gap-4">
				<div class="w-12 h-12 rounded-full flex items-center justify-center" style="background: {$currentTheme.secondary}15;">
					<svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" style="color: {$currentTheme.secondary};">
						<path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
					</svg>
				</div>
				<div class="flex-1">
					<p class="text-lg font-medium" style="color: {$currentTheme.secondary};">
						{streak} ngày liên tục
					</p>
					<p class="text-sm" style="color: {$currentTheme.textMuted};">Chuỗi tích tụ của bạn</p>
				</div>
			</div>
		</div>
		{/if}

		<!-- Practice Cards - 3 Column Grid -->
		<div class="grid grid-cols-3 gap-4 stagger-children">
			<!-- Meditation -->
			<button onclick={() => goto('/meditate')} class="group relative rounded-2xl p-5 text-center transition-all hover:scale-[1.02] shadow-sm" style="background: {$currentTheme.bgCard}; border: 1px solid var(--color-border-default);">
				<div class="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 transition-transform group-hover:scale-110" style="background: {$currentTheme.primary}10;">
					<svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" style="color: {$currentTheme.primary};">
						<circle cx="12" cy="8" r="4"/>
						<path d="M6 20v-2a4 4 0 014-4h4a4 4 0 014 4v2"/>
					</svg>
				</div>
				<span class="font-medium text-base" style="color: {$currentTheme.textPrimary};">Thiền</span>
				<span class="block text-sm mt-1" style="color: {$currentTheme.textMuted};">10 phút</span>
			</button>

			<!-- Prayer -->
			<button onclick={() => goto('/praying')} class="group relative rounded-2xl p-5 text-center transition-all hover:scale-[1.02] shadow-sm" style="background: {$currentTheme.bgCard}; border: 1px solid var(--color-border-default);">
				<div class="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 transition-transform group-hover:scale-110" style="background: {$currentTheme.primary}10;">
					<svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" style="color: {$currentTheme.primary};">
						<path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4"/>
					</svg>
				</div>
				<span class="font-medium text-base" style="color: {$currentTheme.textPrimary};">Hành Đạo</span>
				<span class="block text-sm mt-1" style="color: {$currentTheme.textMuted};">10 giây</span>
			</button>

			<!-- Mokugyo -->
			<button onclick={() => goto('/mokugyo')} class="group relative rounded-2xl p-5 text-center transition-all hover:scale-[1.02] shadow-sm" style="background: {$currentTheme.bgCard}; border: 1px solid var(--color-border-default);">
				<div class="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 transition-transform group-hover:scale-110" style="background: {$currentTheme.secondary}15;">
					<svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" style="color: {$currentTheme.secondary};">
						<ellipse cx="12" cy="14" rx="8" ry="6"/>
						<path d="M12 8V6"/>
						<ellipse cx="12" cy="5" rx="3" ry="2"/>
					</svg>
				</div>
				<span class="font-medium text-base" style="color: {$currentTheme.textPrimary};">Gõ Mõ</span>
				<span class="block text-sm mt-1" style="color: {$currentTheme.textMuted};">108 lần</span>
			</button>
		</div>

		<!-- Quick Actions -->
		<div class="grid grid-cols-2 gap-4 stagger-children">
			<button onclick={() => goto('/guide')} class="group relative rounded-2xl p-5 text-left transition-all hover:scale-[1.02] shadow-sm" style="background: {$currentTheme.bgCard}; border: 1px solid var(--color-border-default);">
				<div class="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style="background: {$currentTheme.primary}10;">
					<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" style="color: {$currentTheme.primary};">
						<circle cx="12" cy="12" r="10"/>
						<path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/>
						<path d="M12 17h.01"/>
					</svg>
				</div>
				<p class="font-medium" style="color: {$currentTheme.textPrimary};">Hướng dẫn</p>
				<p class="text-sm mt-1" style="color: {$currentTheme.textMuted};">Cách tu tập</p>
			</button>

			<button onclick={() => goto('/buddhist')} class="group relative rounded-2xl p-5 text-left transition-all hover:scale-[1.02] shadow-sm" style="background: {$currentTheme.bgCard}; border: 1px solid var(--color-border-default);">
				<div class="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style="background: {$currentTheme.secondary}15;">
					<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" style="color: {$currentTheme.secondary};">
						<path d="M4 19.5A2.5 2.5 0 016.5 17H20"/>
						<path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
					</svg>
				</div>
				<p class="font-medium" style="color: {$currentTheme.textPrimary};">Kinh Phật</p>
				<p class="text-sm mt-1" style="color: {$currentTheme.textMuted};">Lịch & lời kinh</p>
			</button>
		</div>

		<!-- Daily quote -->
		<div class="py-6 animate-fade-in-up text-center" style="animation-delay: 0.5s;">
			<p class="text-base italic px-4" style="color: {$currentTheme.textMuted};">
				"Những điều tốt đẹp nhất trong cuộc sống là những điều chúng ta không thể thấy bằng mắt"
			</p>
		</div>
	</main>
</div>

<BottomNav currentRoute="/dashboard" />
