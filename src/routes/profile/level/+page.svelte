<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import BottomNav from '$lib/components/BottomNav.svelte';
	import LevelAvatar from '$lib/components/LevelAvatar.svelte';
	import { supabase } from '$lib/supabase';
	import { LEVELS, getLevelInfo, getProgress, type LevelInfo } from '$lib/components/levels/index';

	let dharmaName = $state('Tân Viên');
	let totalMerits = $state(0);
	let isGuest = $state(false);
	let isLoading = $state(true);
	let currentLevel = $state<LevelInfo>(LEVELS[0]);
	let progressData = $state({ percentage: 0, pointsToNext: 0, nextLevelName: '' });
	let isEditingName = $state(false);
	let editedName = $state('');
	let isSavingName = $state(false);

	async function fetchUserData() {
		isLoading = true;
		isGuest = localStorage.getItem('isGuest') === 'true';
		if (isGuest) { dharmaName = localStorage.getItem('guestDharmaName') || 'Khách'; totalMerits = parseInt(localStorage.getItem('guestMerit') || '0'); isLoading = false; updateLevelData(); return; }
		try {
			const { data: { user } } = await supabase.auth.getUser();
			if (!user) { isLoading = false; return; }
			const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
			if (profile) { dharmaName = profile.dharma_name || 'Tân Viên'; totalMerits = profile.total_merits || 0; }
		} catch (error) { console.error('Error:', error); }
		isLoading = false; updateLevelData();
	}

	function updateLevelData() { currentLevel = getLevelInfo(totalMerits); progressData = getProgress(totalMerits, currentLevel); }
	function startEditName() { editedName = dharmaName; isEditingName = true; }
	async function saveName() {
		if (!editedName.trim()) return;
		isSavingName = true; dharmaName = editedName.trim();
		if (isGuest) { localStorage.setItem('guestDharmaName', dharmaName); }
		else { const { data: { user } } = await supabase.auth.getUser(); if (user) await supabase.from('profiles').update({ dharma_name: dharmaName }).eq('id', user.id); }
		isSavingName = false; isEditingName = false;
	}
	function cancelEdit() { isEditingName = false; editedName = ''; }
	function handleKeydown(e: KeyboardEvent) { if (e.key === 'Enter') saveName(); else if (e.key === 'Escape') cancelEdit(); }

	onMount(() => { fetchUserData(); });
</script>

<div class="min-h-screen pb-28 relative overflow-hidden">
	<div class="fixed inset-0 overflow-hidden pointer-events-none">
		<div class="absolute top-0 right-0 w-96 h-96 bg-[#C5A059]/3 rounded-full blur-3xl animate-float-drift"></div>
		<div class="absolute bottom-0 left-0 w-64 h-64 bg-[#93B1A7]/2 rounded-full blur-3xl animate-float-drift" style="animation-delay: -4s;"></div>
	</div>

	<header class="relative px-5 pt-8 pb-4 z-10 flex items-center gap-3">
		<button onclick={() => goto('/profile')} class="p-2 -ml-2 rounded-full hover:bg-white/5 transition-colors">
			<svg class="w-5 h-5 text-[#8A8070]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
		</button>
		<h1 class="font-serif text-xl font-light text-[#F5F0E8] tracking-wide">Cấp Bậc</h1>
	</header>

	<main class="px-5 relative z-10 space-y-6">
		<!-- Avatar Section -->
		<div class="text-center animate-scale-in" style="animation-delay: 0.08s;">
			<div class="relative inline-flex items-center justify-center">
				<div class="absolute inset-0 flex items-center justify-center">
					<div class="w-48 h-48 rounded-full bg-gradient-to-br from-[#C5A059]/20 via-[#D4B896]/10 to-transparent blur-2xl animate-pulse-soft"></div>
				</div>
				<div class="relative w-36 h-36 rounded-full overflow-hidden shadow-2xl shadow-black/20 border-2 border-[#C5A059]/15">
					<LevelAvatar level={currentLevel.level} size="2xl" showGlow={false} class="w-full h-full" />
				</div>
			</div>

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
						<h2 class="font-serif text-xl font-light text-[#F5F0E8] tracking-wide">{dharmaName}</h2>
						<svg class="w-3.5 h-3.5 text-[#8A8070]/30 group-hover:text-[#8A8070]/60 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
					</button>
				{/if}
			</div>

			<p class="mt-2 text-[#C5A059]/70 text-sm font-light tracking-wide">{currentLevel.name}</p>
			<p class="mt-1 text-[#8A8070]/40 text-sm font-light">{totalMerits.toLocaleString()} điểm công đức</p>
		</div>

		<!-- Progress -->
		{#if currentLevel.level < 5}
			<div class="rounded-3xl p-5 bg-[#242018]/80 border border-[#C5A059]/8 animate-fade-in-up" style="animation-delay: 0.16s;">
				<div class="text-center mb-4">
					<p class="text-[#8A8070]/40 text-xs mb-1 font-light">Tiến trình đến cấp tiếp theo</p>
					<p class="text-[#F5F0E8]/70 text-sm font-light">{progressData.pointsToNext.toLocaleString()} điểm nữa</p>
				</div>
				<div class="relative">
					<div class="h-[3px] bg-[#8A8070]/10 rounded-full overflow-hidden">
						<div class="h-full bg-gradient-to-r from-[#C5A059]/50 to-[#D4B896]/70 rounded-full transition-all duration-1000 ease-out" style="width: {progressData.percentage}%;"></div>
					</div>
					<div class="flex justify-between mt-2">
						<span class="text-[#8A8070]/30 text-[10px]">{Math.round(progressData.percentage)}%</span>
						<span class="text-[#8A8070]/30 text-[10px]">100%</span>
					</div>
				</div>
				<div class="mt-4 pt-4 border-t border-[#C5A059]/5 text-center">
					<p class="text-[#8A8070]/40 text-xs font-light">Cấp tiếp theo: <span class="text-[#C5A059]/70">{progressData.nextLevelName}</span></p>
				</div>
			</div>
		{:else}
			<div class="rounded-3xl p-5 bg-gradient-to-br from-[#C5A059]/5 to-[#D4B896]/5 border border-[#C5A059]/15 text-center animate-fade-in-up" style="animation-delay: 0.16s;">
				<svg class="w-10 h-10 mx-auto text-[#C5A059]/50 mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
				<p class="text-[#F5F0E8]/70 text-sm font-light">Bạn đã đạt cấp tối đa!</p>
				<p class="text-[#8A8070]/30 text-xs mt-1 font-light">Tòa Sen Tỏa Sáng - Giác ngộ viên mãn</p>
			</div>
		{/if}

		<!-- Level Timeline -->
		<div class="animate-fade-in-up" style="animation-delay: 0.24s;">
			<h3 class="font-serif text-base font-light text-[#F5F0E8]/60 mb-5 tracking-wide text-center">Hành Trình Tu Tập</h3>
			<div class="space-y-3">
				{#each LEVELS as level, i}
					{@const isUnlocked = totalMerits >= level.minPoints}
					{@const isCurrent = currentLevel.level === level.level}
					<div class="relative {i < LEVELS.length - 1 ? 'pb-5' : ''}">
						{#if i < LEVELS.length - 1}
							<div class="absolute left-[27px] top-14 bottom-0 w-px {isUnlocked ? 'bg-[#C5A059]/20' : 'bg-[#8A8070]/5'}"></div>
						{/if}
						<div class="relative flex items-center gap-4 p-4 rounded-2xl transition-all duration-500 {isUnlocked ? 'bg-[#242018]/80 border border-[#C5A059]/8' : 'bg-[#242018]/40 border border-[#8A8070]/5 grayscale opacity-50'}">
							<div class="relative flex-shrink-0">
								{#if isUnlocked}
									<div class="w-12 h-12 rounded-full bg-gradient-to-br from-[#C5A059] to-[#A07840] flex items-center justify-center shadow-lg shadow-[#C5A059]/20">
										<span class="text-white font-medium text-base">{level.level}</span>
									</div>
									{#if isCurrent}
										<div class="absolute -inset-1 rounded-full border border-[#C5A059]/30 animate-ping"></div>
									{/if}
								{:else}
									<div class="w-12 h-12 rounded-full bg-[#242018] border border-[#8A8070]/10 flex items-center justify-center">
										<svg class="w-5 h-5 text-[#8A8070]/20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
									</div>
								{/if}
							</div>
							<div class="flex-1 min-w-0">
								<div class="flex items-center gap-2">
									<h4 class="font-serif text-sm {isUnlocked ? 'text-[#F5F0E8]/80' : 'text-[#8A8070]/40'} font-light">{level.name}</h4>
									{#if isCurrent}<span class="px-2 py-0.5 bg-[#C5A059]/8 text-[#C5A059]/70 text-[10px] rounded-full font-light">Hiện tại</span>{/if}
								</div>
								<p class="text-[#8A8070]/30 text-xs mt-0.5 font-light">{level.description}</p>
								<p class="text-[#8A8070]/20 text-[10px] mt-1 font-light">
									{level.maxPoints ? `${level.minPoints.toLocaleString()} - ${level.maxPoints.toLocaleString()} điểm` : `${level.minPoints.toLocaleString()}+ điểm`}
								</p>
							</div>
							{#if !isUnlocked}
								<div class="text-right flex-shrink-0">
									<p class="text-[#C5A059]/60 text-sm font-light">{(level.minPoints - totalMerits).toLocaleString()}</p>
									<p class="text-[#8A8070]/20 text-[10px] font-light">điểm nữa</p>
								</div>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		</div>

		<div class="text-center py-8 animate-fade-in" style="animation-delay: 0.4s;">
			<p class="text-[#8A8070]/15 text-xs italic font-serif-alt leading-relaxed">"Mỗi ngày tích lũy một điều tốt, ta đang vun trồng hạt giống Bồ Đề trong tâm"</p>
		</div>
	</main>
</div>

<BottomNav currentRoute="/profile" />
