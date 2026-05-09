<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import BottomNav from '$lib/components/BottomNav.svelte';
	import LevelAvatar from '$lib/components/LevelAvatar.svelte';
	import { supabase } from '$lib/supabase';
	import { getLevelInfo, type LevelInfo } from '$lib/components/levels/index';

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
			isLoading = false; currentLevel = getLevelInfo(totalMerits); return;
		}
		try {
			const { data: { user } } = await supabase.auth.getUser();
			if (!user) { isLoading = false; return; }
			const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
			if (profile) { dharmaName = profile.dharma_name || 'Tân Viên'; totalMerits = profile.total_merits || 0; }
		} catch (error) { console.error('Error:', error); }
		isLoading = false; currentLevel = getLevelInfo(totalMerits);
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

<div class="min-h-screen pb-28 relative overflow-hidden">
	<div class="fixed inset-0 overflow-hidden pointer-events-none">
		<div class="absolute top-0 right-0 w-80 h-80 bg-[#C5A059]/3 rounded-full blur-3xl animate-float-drift"></div>
		<div class="absolute bottom-0 left-0 w-64 h-64 bg-[#93B1A7]/2 rounded-full blur-3xl animate-float-drift" style="animation-delay: -4s;"></div>
	</div>

	<header class="relative px-6 py-6 z-10 flex items-center justify-between">
		<h1 class="font-serif text-xl font-light text-[#F5F0E8] tracking-wide">Cá Nhân</h1>
		<button onclick={() => goto('/dashboard')} class="p-2 -mr-2 rounded-full hover:bg-white/5 transition-colors">
			<svg class="w-5 h-5 text-[#8A8070]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
		</button>
	</header>

	<main class="px-5 relative z-10">
		<!-- Profile Card -->
		<div class="text-center mb-6 rounded-3xl p-6 bg-[#242018]/80 border border-[#C5A059]/8 animate-fade-in-up" style="animation-delay: 0.08s;">
			<button onclick={() => goto('/profile/level')} class="relative inline-block group">
				<div class="absolute inset-0 -translate-x-1/2 -translate-y-1/2 left-1/2 top-0">
					<div class="w-32 h-32 rounded-full bg-gradient-to-br from-[#C5A059]/15 via-[#D4B896]/10 to-transparent blur-xl group-hover:scale-110 transition-transform duration-500"></div>
				</div>
				<div class="relative w-24 h-24 rounded-full overflow-hidden shadow-lg shadow-black/20 border-2 border-[#C5A059]/20 mx-auto bg-[#242018]">
					{#if isLoading}
						<div class="w-full h-full flex items-center justify-center"><div class="w-6 h-6 border border-[#C5A059]/20 border-t-[#C5A059]/50 rounded-full animate-spin"></div></div>
					{:else}
						<LevelAvatar level={currentLevel?.level || 1} size="2xl" showGlow={false} class="w-full h-full" />
					{/if}
				</div>
				<div class="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#242018]/90 text-[#8A8070]/40 text-[10px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity border border-[#C5A059]/10">Xem cấp bậc</div>
			</button>

			<div class="mt-5">
				{#if isEditingName}
					<div class="flex items-center justify-center gap-2">
						<input type="text" bind:value={editedName} onkeydown={handleKeydown} maxlength="20"
							class="px-4 py-2 bg-[#242018] border border-[#C5A059]/20 rounded-2xl text-[#F5F0E8] text-center font-serif text-xl focus:outline-none focus:border-[#C5A059]/40 w-44 text-sm"/>
						<button onclick={saveName} disabled={isSavingName} class="p-2 rounded-full bg-[#C5A059]/15 border border-[#C5A059]/20 text-[#C5A059] hover:bg-[#C5A059]/25 transition-colors disabled:opacity-40">
							{#if isSavingName}<div class="w-4 h-4 border border-[#C5A059]/30 border-t-[#C5A059] rounded-full animate-spin"></div>{:else}<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20,6 9,17 4,12"/></svg>{/if}
						</button>
						<button onclick={cancelEdit} class="p-2 rounded-full bg-[#242018] border border-[#8A8070]/10 text-[#8A8070]/60 hover:text-[#8A8070] transition-colors">
							<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
						</button>
					</div>
				{:else}
					<button onclick={startEditName} class="group inline-flex items-center gap-2 px-4 py-2 rounded-full hover:bg-[#C5A059]/5 transition-colors">
						<h2 class="font-serif text-xl font-light text-[#F5F0E8] tracking-wide">{#if isLoading}<span class="opacity-30">...</span>{:else}{dharmaName}{/if}</h2>
						<svg class="w-3.5 h-3.5 text-[#8A8070]/30 group-hover:text-[#8A8070]/60 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
					</button>
				{/if}
			</div>

			{#if currentLevel && !isLoading}
				<button onclick={() => goto('/profile/level')} class="mt-3 inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#C5A059]/8 border border-[#C5A059]/15 hover:border-[#C5A059]/25 transition-colors group">
					<div class="w-4 h-4"><LevelAvatar level={currentLevel.level} size="xs" showGlow={false} /></div>
					<span class="text-[#C5A059]/80 text-xs">{currentLevel.name}</span>
					<svg class="w-3.5 h-3.5 text-[#C5A059]/40 group-hover:text-[#C5A059]/70 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9,18 15,12 9,6"/></svg>
				</button>
			{/if}

			<div class="flex items-center justify-center gap-2 mt-4">
				<svg class="w-4 h-4 text-[#C5A059]/50" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/></svg>
				<span class="text-sm text-[#F5F0E8]/60 font-light">{#if isLoading}<span class="opacity-30">...</span>{:else}{totalMerits.toLocaleString()}{/if}</span>
				<span class="text-[#8A8070]/30 text-xs font-light">công đức</span>
			</div>

			{#if isGuest}
				<div class="mt-4 px-4 py-2 rounded-full bg-[#C4A89C]/8 border border-[#C4A89C]/10 inline-block animate-fade-in">
					<span class="text-[#C4A89C] text-xs">Chế độ Khách</span>
				</div>
			{/if}
		</div>

		<!-- Quick Actions -->
		<div class="rounded-3xl p-5 bg-[#242018]/80 border border-[#C5A059]/8 animate-fade-in-up" style="animation-delay: 0.16s;">
			<h3 class="font-serif text-base font-light text-[#F5F0E8]/60 mb-4 tracking-wide text-center">Hành Trình</h3>
			<div class="space-y-2">
				<button onclick={() => goto('/profile/level')} class="w-full flex items-center gap-4 p-4 rounded-2xl bg-[#242018] border border-[#C5A059]/8 hover:border-[#C5A059]/15 transition-colors group">
					<div class="w-10 h-10 rounded-xl bg-[#C5A059]/8 border border-[#C5A059]/10 flex items-center justify-center flex-shrink-0">
						<svg class="w-5 h-5 text-[#C5A059]/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
					</div>
					<div class="flex-1 text-left"><p class="text-[#F5F0E8]/70 text-sm font-light">Cấp Bậc Tu Tập</p><p class="text-[#8A8070]/30 text-xs mt-0.5">Xem tiến trình của bạn</p></div>
					<svg class="w-4 h-4 text-[#8A8070]/30 group-hover:text-[#8A8070]/50 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9,18 15,12 9,6"/></svg>
				</button>
				<button onclick={() => goto('/guide')} class="w-full flex items-center gap-4 p-4 rounded-2xl bg-[#242018] border border-[#93B1A7]/8 hover:border-[#93B1A7]/15 transition-colors group">
					<div class="w-10 h-10 rounded-xl bg-[#93B1A7]/8 border border-[#93B1A7]/10 flex items-center justify-center flex-shrink-0">
						<svg class="w-5 h-5 text-[#93B1A7]/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
					</div>
					<div class="flex-1 text-left"><p class="text-[#F5F0E8]/70 text-sm font-light">Hướng Dẫn</p><p class="text-[#8A8070]/30 text-xs mt-0.5">Tìm hiểu cách tu tập</p></div>
					<svg class="w-4 h-4 text-[#8A8070]/30 group-hover:text-[#8A8070]/50 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9,18 15,12 9,6"/></svg>
				</button>
			</div>
		</div>

		{#if isGuest}
			<div class="mt-6 text-center animate-fade-in-up" style="animation-delay: 0.24s;">
				<p class="text-[#8A8070]/30 text-sm font-light">Đăng nhập để đồng bộ dữ liệu</p>
				<button onclick={() => goto('/auth')} class="mt-3 px-8 py-3 bg-[#C5A059]/10 border border-[#C5A059]/20 text-[#C5A059] rounded-full text-sm font-light hover:bg-[#C5A059]/15 transition-all">Đăng nhập</button>
			</div>
		{:else}
			<button onclick={handleLogout} class="mt-6 w-full py-4 rounded-2xl bg-[#242018] border border-[#8A8070]/8 text-[#8A8070]/60 hover:text-[#8A8070] hover:border-[#8A8070]/15 transition-all duration-300 flex items-center justify-center gap-3 text-sm font-light">
				<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16,17 21,12 16,7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
				Đăng xuất
			</button>
		{/if}

		<div class="text-center mt-10 animate-fade-in" style="animation-delay: 0.4s;">
			<p class="text-[#8A8070]/15 text-xs font-light">Tích Công Đức v1.0.0</p>
		</div>
	</main>
</div>

<BottomNav currentRoute="/profile" />
