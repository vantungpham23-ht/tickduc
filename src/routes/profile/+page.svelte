<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import BottomNav from '$lib/components/BottomNav.svelte';
	import LevelAvatar from '$lib/components/LevelAvatar.svelte';
	import { supabase } from '$lib/supabase';
	import { getLevelInfo, type LevelInfo } from '$lib/components/levels/index';
	import { setLevel, currentTheme } from '$lib/stores/theme';

	let dharmaName = $state('Tân Viên');
	let totalMerits = $state(0);
	let isGuest = $state(false);
	let isLoading = $state(true);
	let currentLevel = $state<LevelInfo | null>(null);
	let isEditingName = $state(false);
	let editedName = $state('');
	let isSavingName = $state(false);

	async function fetchUserData() {
		isLoading = true;
		isGuest = localStorage.getItem('isGuest') === 'true';
		if (isGuest) {
			dharmaName = localStorage.getItem('guestDharmaName') || 'Khách';
			totalMerits = parseInt(localStorage.getItem('guestMerit') || '0');
			isLoading = false; currentLevel = getLevelInfo(totalMerits);
			setLevel(currentLevel!.level, totalMerits, true);
			return;
		}
		try {
			const { data: { user } } = await supabase.auth.getUser();
			if (!user) { isLoading = false; return; }
			const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
			if (profile) { dharmaName = profile.dharma_name || 'Tân Viên'; totalMerits = profile.total_merits || 0; }
		} catch (error) { console.error('Error:', error); }
		isLoading = false; currentLevel = getLevelInfo(totalMerits);
		setLevel(currentLevel!.level, totalMerits, true);
	}

	function startEditName() { editedName = dharmaName; isEditingName = true; }

	async function saveName() {
		if (!editedName.trim()) return;
		isSavingName = true; dharmaName = editedName.trim();
		if (isGuest) { localStorage.setItem('guestDharmaName', dharmaName); }
		else {
			const { data: { user } } = await supabase.auth.getUser();
			if (user) await supabase.from('profiles').update({ dharma_name: dharmaName }).eq('id', user.id);
		}
		isSavingName = false; isEditingName = false;
	}

	function cancelEdit() { isEditingName = false; editedName = ''; }
	function handleKeydown(e: KeyboardEvent) { if (e.key === 'Enter') saveName(); else if (e.key === 'Escape') cancelEdit(); }

	async function handleLogout() {
		try { await supabase.auth.signOut(); } catch (e) {}
		localStorage.removeItem('isGuest'); localStorage.removeItem('guestMerit');
		localStorage.removeItem('guestDharmaName'); localStorage.removeItem('guestAvatarEmoji');
		localStorage.removeItem('hasOnboarded'); goto('/');
	}

	onMount(() => { fetchUserData(); });
</script>

<div class="min-h-screen pb-28 relative overflow-hidden" style="background-color: var(--color-bg-primary);">
	<div class="fixed inset-0 overflow-hidden pointer-events-none">
		<div class="absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl animate-float-drift" style="background: {$currentTheme.primary}08;"></div>
		<div class="absolute bottom-0 left-0 w-64 h-64 rounded-full blur-3xl animate-float-drift" style="background: {$currentTheme.secondary}05; animation-delay: -4s;"></div>
	</div>

	<header class="relative px-6 py-6 z-10 flex items-center justify-between">
		<h1 class="font-serif text-xl font-medium" style="color: {$currentTheme.textPrimary};">Cá Nhân</h1>
		<button onclick={() => goto('/settings')} class="p-2 -mr-2 rounded-full transition-colors" style="background: {$currentTheme.bgCard}; border-color: {$currentTheme['border-default']};">
			<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="color: {$currentTheme.textSecondary};"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-1.82-.33l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
		</button>
	</header>

	<main class="px-5 relative z-10">
		<!-- Profile Card -->
		<div class="text-center mb-6 rounded-2xl p-6 shadow-lg animate-fade-in-up" style="animation-delay: 0.08s; background: {$currentTheme.bgCard};">
			<button onclick={() => goto('/profile/level')} class="relative inline-block group">
				<div class="relative w-24 h-24 rounded-full overflow-hidden shadow-lg mx-auto" style="background: {$currentTheme.bgSecondary}; border: 2px solid {$currentTheme.primary}20;">
					{#if isLoading}
						<div class="w-full h-full flex items-center justify-center"><div class="w-6 h-6 rounded-full animate-spin" style="border: 2px solid {$currentTheme.primary}20; border-top-color: {$currentTheme.primary};"></div></div>
					{:else}
						<LevelAvatar level={currentLevel?.level || 1} size="2xl" showGlow={false} />
					{/if}
				</div>
				<div class="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md" style="background: {$currentTheme.bgCard}; color: {$currentTheme.textSecondary}; border-color: {$currentTheme['border-default']};">Xem cấp bậc</div>
			</button>

			<div class="mt-5">
				{#if isEditingName}
					<div class="flex items-center justify-center gap-2">
						<input type="text" bind:value={editedName} onkeydown={handleKeydown} maxlength="20"
							class="px-4 py-2 rounded-xl text-center font-serif text-xl w-44 text-sm focus:outline-none"
							style="background: {$currentTheme.bgSecondary}; border: 1px solid {$currentTheme.primary}20; color: {$currentTheme.textPrimary};"
						/>
						<button onclick={saveName} disabled={isSavingName} class="p-2 rounded-xl transition-colors" style="background: {$currentTheme.primary}15; border: 1px solid {$currentTheme.primary}20; color: {$currentTheme.primary};">
							{#if isSavingName}<div class="w-4 h-4 rounded-full animate-spin" style="border: 2px solid {$currentTheme.primary}30; border-top-color: {$currentTheme.primary};"></div>{:else}<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20,6 9,17 4,12"/></svg>{/if}
						</button>
						<button onclick={cancelEdit} class="p-2 rounded-xl transition-colors" style="background: {$currentTheme.bgSecondary}; border-color: {$currentTheme['border-default']}; color: {$currentTheme.textSecondary};">
							<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
						</button>
					</div>
				{:else}
					<button onclick={startEditName} class="group inline-flex items-center gap-2 px-4 py-2 rounded-full transition-colors">
						<h2 class="font-serif text-xl font-medium" style="color: {$currentTheme.textPrimary};">{#if isLoading}<span style="opacity: 0.3;">...</span>{:else}{dharmaName}{/if}</h2>
						<svg class="w-4 h-4 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: {$currentTheme.textMuted}; opacity: 0.4;"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
					</button>
				{/if}
			</div>

			{#if currentLevel && !isLoading}
				<button onclick={() => goto('/profile/level')} class="mt-3 inline-flex items-center gap-2 px-4 py-1.5 rounded-full transition-all" style="background: {$currentTheme.primary}10; border: 1px solid {$currentTheme.primary}20;">
					<div class="w-5 h-5"><LevelAvatar level={currentLevel.level} size="xs" showGlow={false} /></div>
					<span class="text-sm font-medium" style="color: {$currentTheme.primary};">{currentLevel.name}</span>
					<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: {$currentTheme.primary}; opacity: 0.6;"><polyline points="9,18 15,12 9,6"/></svg>
				</button>
			{/if}

			<div class="flex items-center justify-center gap-2 mt-4">
				<svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" style="color: {$currentTheme.primary};"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
				<span class="text-base font-medium" style="color: {$currentTheme.textPrimary};">{#if isLoading}<span style="opacity: 0.3;">...</span>{:else}{totalMerits.toLocaleString()}{/if}</span>
				<span class="text-sm" style="color: {$currentTheme.textMuted};">công đức</span>
			</div>

			{#if isGuest}
				<div class="mt-4 px-4 py-2 rounded-full inline-block" style="background: {$currentTheme.secondary}10; border: 1px solid {$currentTheme.secondary}20;">
					<span class="text-sm" style="color: {$currentTheme.secondary};">Chế độ Khách</span>
				</div>
			{/if}
		</div>

		<!-- Quick Actions -->
		<div class="rounded-2xl p-5 shadow-sm animate-fade-in-up" style="animation-delay: 0.16s; background: {$currentTheme.bgCard}; border-color: {$currentTheme['border-default']};">
			<h3 class="font-serif text-base font-medium mb-4 text-center" style="color: {$currentTheme.textPrimary}; opacity: 0.7;">Hành Trình</h3>
			<div class="space-y-3">
				<button onclick={() => goto('/profile/level')} class="w-full flex items-center gap-4 p-4 rounded-xl transition-colors" style="background: {$currentTheme.bgSecondary};">
					<div class="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style="background: {$currentTheme.primary}10;">
						<svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="color: {$currentTheme.primary};"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
					</div>
					<div class="flex-1 text-left"><p class="text-base font-medium" style="color: {$currentTheme.textPrimary};">Cấp Bậc Tu Tập</p><p class="text-sm" style="color: {$currentTheme.textMuted};">Xem tiến trình của bạn</p></div>
					<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: {$currentTheme.textMuted}; opacity: 0.5;"><polyline points="9,18 15,12 9,6"/></svg>
				</button>
				<button onclick={() => goto('/guide')} class="w-full flex items-center gap-4 p-4 rounded-xl transition-colors" style="background: {$currentTheme.bgSecondary};">
					<div class="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style="background: {$currentTheme.secondary}10;">
						<svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="color: {$currentTheme.secondary};"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
					</div>
					<div class="flex-1 text-left"><p class="text-base font-medium" style="color: {$currentTheme.textPrimary};">Hướng Dẫn</p><p class="text-sm" style="color: {$currentTheme.textMuted};">Tìm hiểu cách tu tập</p></div>
					<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: {$currentTheme.textMuted}; opacity: 0.5;"><polyline points="9,18 15,12 9,6"/></svg>
				</button>
			</div>
		</div>

		{#if isGuest}
			<div class="mt-6 text-center animate-fade-in-up" style="animation-delay: 0.24s;">
				<p class="text-base" style="color: {$currentTheme.textMuted};">Đăng nhập để đồng bộ dữ liệu</p>
				<button onclick={() => goto('/auth')} class="mt-3 px-8 py-3 rounded-full text-base font-medium transition-all" style="background: {$currentTheme.primary}; color: white; box-shadow: 0 4px 12px {$currentTheme.primary}30;">Đăng nhập</button>
			</div>
		{:else}
			<button onclick={handleLogout} class="mt-6 w-full py-4 rounded-xl transition-all flex items-center justify-center gap-3 text-base font-medium" style="background: {$currentTheme.bgSecondary}; border-color: {$currentTheme['border-default']}; color: {$currentTheme.textSecondary};">
				<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16,17 21,12 16,7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
				Đăng xuất
			</button>
		{/if}

		<div class="text-center mt-10 animate-fade-in" style="animation-delay: 0.4s;">
			<p class="text-sm" style="color: {$currentTheme.textMuted}; opacity: 0.5;">Tích Công Đức v1.0.0</p>
		</div>
	</main>
</div>

<BottomNav currentRoute="/profile" />
