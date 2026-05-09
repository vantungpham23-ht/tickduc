<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import BottomNav from '$lib/components/BottomNav.svelte';
	import LevelAvatar from '$lib/components/LevelAvatar.svelte';
	import { supabase } from '$lib/supabase';
	import { LEVELS, getLevelInfo, getProgress, type LevelInfo } from '$lib/components/levels/index';

	// User data
	let dharmaName = $state('Tân Viên');
	let totalMerits = $state(0);
	let isGuest = $state(false);
	let isLoading = $state(true);
	let mounted = $state(false);

	// Edit name state
	let isEditingName = $state(false);
	let editedName = $state('');
	let isSavingName = $state(false);

	// Level data
	let currentLevel = $state<LevelInfo>(LEVELS[0]);
	let progressData = $state({ percentage: 0, pointsToNext: 0, nextLevelName: '' });

	async function fetchUserData() {
		isLoading = true;
		isGuest = localStorage.getItem('isGuest') === 'true';

		if (isGuest) {
			dharmaName = localStorage.getItem('guestDharmaName') || 'Khách';
			totalMerits = parseInt(localStorage.getItem('guestMerit') || '0');
			isLoading = false;
			updateLevelData();
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
				dharmaName = profile.dharma_name || 'Tân Viên';
				totalMerits = profile.total_merits || 0;
			}
		} catch (error) {
			console.error('Error fetching profile:', error);
		}

		isLoading = false;
		updateLevelData();
	}

	function updateLevelData() {
		currentLevel = getLevelInfo(totalMerits);
		progressData = getProgress(totalMerits, currentLevel);
	}

	function startEditName() {
		editedName = dharmaName;
		isEditingName = true;
	}

	async function saveName() {
		if (!editedName.trim()) return;

		isSavingName = true;
		dharmaName = editedName.trim();

		if (isGuest) {
			localStorage.setItem('guestDharmaName', dharmaName);
		} else {
			try {
				const { data: { user } } = await supabase.auth.getUser();
				if (user) {
					await supabase
						.from('profiles')
						.update({ dharma_name: dharmaName })
						.eq('id', user.id);
				}
			} catch (error) {
				console.error('Error saving name:', error);
			}
		}

		isSavingName = false;
		isEditingName = false;
	}

	function cancelEdit() {
		isEditingName = false;
		editedName = '';
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			saveName();
		} else if (e.key === 'Escape') {
			cancelEdit();
		}
	}

	onMount(() => {
		mounted = true;
		fetchUserData();
	});
</script>

<div class="min-h-screen bg-[#F7F3F0] pb-28 relative overflow-hidden">
	<!-- Background decorations -->
	<div class="fixed inset-0 overflow-hidden pointer-events-none">
		<div class="absolute top-0 right-0 w-80 h-80 bg-[#C5A059]/5 rounded-full blur-3xl animate-float-drift"></div>
		<div class="absolute bottom-1/3 left-0 w-64 h-64 bg-[#9CAF88]/5 rounded-full blur-3xl animate-float-drift" style="animation-delay: -5s;"></div>
	</div>

	<!-- Header -->
	<header class="relative px-6 pt-10 pb-6 z-10">
		<div class="flex items-center justify-between animate-fade-in-up">
			<div class="flex items-center gap-3">
				<button
					onclick={() => goto('/profile')}
					class="p-2 -ml-2 rounded-full hover:bg-[#3D3028]/5 transition-colors"
				>
					<svg class="w-6 h-6 text-[#5C4F44]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
						<path d="M19 12H5M12 19l-7-7 7-7"/>
					</svg>
				</button>
				<h1 class="font-serif text-2xl font-light text-[#3D3228] tracking-wide">Cấp Bậc</h1>
			</div>
		</div>
	</header>

	<main class="px-6 relative z-10 space-y-8">
		<!-- Main Avatar Section -->
		<div class="text-center animate-scale-in" style="animation-delay: 0.1s;">
			<!-- Large Avatar with Glow -->
			<div class="relative inline-flex items-center justify-center">
				<!-- Golden glow halo -->
				<div class="absolute inset-0 flex items-center justify-center">
					<div
						class="w-56 h-56 rounded-full bg-gradient-to-br from-[#C5A059]/30 via-[#C9B896]/20 to-transparent blur-2xl animate-pulse-slow"
					></div>
				</div>

				<!-- Avatar -->
				<div class="relative w-44 h-44 rounded-full overflow-hidden shadow-2xl shadow-[#C5A059]/30 border-4 border-[#E8DCC8]">
					<LevelAvatar level={currentLevel.level} size="2xl" showGlow={false} class="w-full h-full" />
				</div>
			</div>

			<!-- Editable Dharma Name -->
			<div class="mt-6">
				{#if isEditingName}
					<div class="flex items-center justify-center gap-2">
						<input
							type="text"
							bind:value={editedName}
							onkeydown={handleKeydown}
							maxlength="20"
							class="px-4 py-2 bg-[#FAF8F5] border-2 border-[#C5A059]/40 rounded-2xl text-[#3D3228] text-xl text-center font-serif focus:outline-none focus:border-[#C5A059] w-48"
							autofocus
						/>
						<button
							onclick={saveName}
							disabled={isSavingName}
							class="p-2 rounded-full bg-[#C5A059] text-white hover:bg-[#A69070] transition-colors"
						>
							{#if isSavingName}
								<svg class="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
									<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
									<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
								</svg>
							{:else}
								<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
									<polyline points="20,6 9,17 4,12"/>
								</svg>
							{/if}
						</button>
						<button
							onclick={cancelEdit}
							class="p-2 rounded-full bg-[#EDE8E3] text-[#5C4F44] hover:bg-[#E8E2DA] transition-colors"
						>
							<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
								<line x1="18" y1="6" x2="6" y2="18"/>
								<line x1="6" y1="6" x2="18" y2="18"/>
							</svg>
						</button>
					</div>
				{:else}
					<button
						onclick={startEditName}
						class="group inline-flex items-center gap-2 px-4 py-2 rounded-full hover:bg-[#F2EDE6] transition-colors"
					>
						<h2 class="font-serif text-2xl font-light text-[#3D3228] tracking-wide">{dharmaName}</h2>
						<svg class="w-4 h-4 text-[#7A6B5A]/50 group-hover:text-[#7A6B5A] transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
							<path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
						</svg>
					</button>
				{/if}
			</div>

			<!-- Current Level Name -->
			<p class="mt-3 text-[#C5A059] font-medium tracking-wide">
				{currentLevel.name}
			</p>

			<!-- Total Merits -->
			<p class="mt-2 text-[#7A6B5A] text-sm">
				{totalMerits.toLocaleString()} điểm công đức
			</p>
		</div>

		<!-- Progress Section -->
		{#if currentLevel.level < 5}
			<div class="bg-gradient-to-br from-[#F2EDE6] to-[#FAF8F5] rounded-3xl p-6 border border-[#E8E0D8]/50 animate-fade-in-up" style="animation-delay: 0.2s;">
				<div class="text-center mb-4">
					<p class="text-[#7A6B5A] text-sm mb-1">Tiến trình đến cấp tiếp theo</p>
					<p class="text-[#3D3228] font-medium">{progressData.pointsToNext.toLocaleString()} điểm nữa</p>
				</div>

				<!-- Progress Bar -->
				<div class="relative">
					<div class="h-1.5 bg-[#E8E0D8] rounded-full overflow-hidden">
						<div
							class="h-full bg-gradient-to-r from-[#C9B896] to-[#C5A059] rounded-full transition-all duration-1000 ease-out"
							style="width: {progressData.percentage}%;"
						></div>
					</div>

					<!-- Percentage -->
					<div class="flex justify-between mt-2">
						<span class="text-[#7A6B5A]/50 text-xs">{Math.round(progressData.percentage)}%</span>
						<span class="text-[#7A6B5A]/50 text-xs">100%</span>
					</div>
				</div>

				<!-- Next Level Preview -->
				<div class="mt-4 pt-4 border-t border-[#E8E0D8]/50">
					<p class="text-center text-[#7A6B5A]/60 text-sm">
						Cấp tiếp theo: <span class="text-[#C5A059] font-medium">{progressData.nextLevelName}</span>
					</p>
				</div>
			</div>
		{:else}
			<!-- Max Level Reached -->
			<div class="bg-gradient-to-br from-[#C5A059]/10 to-[#C9B896]/10 rounded-3xl p-6 border border-[#C5A059]/30 text-center animate-fade-in-up" style="animation-delay: 0.2s;">
				<svg class="w-12 h-12 mx-auto text-[#C5A059] mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
					<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
				</svg>
				<p class="text-[#3D3228] font-medium">Bạn đã đạt cấp tối đa!</p>
				<p class="text-[#7A6B5A] text-sm mt-1">Tòa Sen Tỏa Sáng - Giác ngộ viên mãn</p>
			</div>
		{/if}

		<!-- Level Timeline -->
		<div class="animate-fade-in-up" style="animation-delay: 0.3s;">
			<h3 class="font-serif text-lg font-light text-[#3D3228] mb-6 tracking-wide text-center">Hành Trình Tu Tập</h3>

			<div class="space-y-4">
				{#each LEVELS as level, i}
					{@const isUnlocked = totalMerits >= level.minPoints}
					{@const isCurrent = currentLevel.level === level.level}

					<div class="relative {i < LEVELS.length - 1 ? 'pb-6' : ''}">
						<!-- Timeline line -->
						{#if i < LEVELS.length - 1}
							<div class="absolute left-[27px] top-14 bottom-0 w-0.5 {isUnlocked ? 'bg-[#C5A059]/40' : 'bg-[#E8E0D8]'}"></div>
						{/if}

						<!-- Level card -->
						<div
							class="relative flex items-center gap-4 p-4 rounded-2xl transition-all duration-500 {isUnlocked ? 'bg-gradient-to-r from-[#F2EDE6] to-[#FAF8F5] border border-[#E8E0D8]/50' : 'bg-[#F7F3F0] border border-[#E8E0D8]/30 grayscale opacity-60'}"
							style="animation-delay: {0.4 + i * 0.1}s;"
						>
							<!-- Level number / Lock -->
							<div class="relative flex-shrink-0">
								{#if isUnlocked}
									<div class="w-14 h-14 rounded-full bg-gradient-to-br from-[#C5A059] to-[#A69070] flex items-center justify-center shadow-lg shadow-[#C5A059]/20">
										<span class="text-white font-medium text-lg">{level.level}</span>
									</div>
									{#if isCurrent}
										<div class="absolute -inset-1 rounded-full border-2 border-[#C5A059]/50 animate-ping"></div>
									{/if}
								{:else}
									<div class="w-14 h-14 rounded-full bg-[#E8E0D8] flex items-center justify-center">
										<svg class="w-6 h-6 text-[#7A6B5A]/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
											<rect x="3" y="11" width="18" height="11" rx="2"/>
											<path d="M7 11V7a5 5 0 0110 0v4"/>
										</svg>
									</div>
								{/if}
							</div>

							<!-- Level info -->
							<div class="flex-1 min-w-0">
								<div class="flex items-center gap-2">
									<h4 class="font-serif text-base {isUnlocked ? 'text-[#3D3228]' : 'text-[#7A6B5A]'}">{level.name}</h4>
									{#if isCurrent}
										<span class="px-2 py-0.5 bg-[#C5A059]/10 text-[#C5A059] text-xs rounded-full font-medium">Hiện tại</span>
									{/if}
								</div>
								<p class="text-[#7A6B5A]/60 text-sm mt-0.5">{level.description}</p>
								<p class="text-[#7A6B5A]/40 text-xs mt-1">
									{#if level.maxPoints}
										{level.minPoints.toLocaleString()} - {level.maxPoints.toLocaleString()} điểm
									{:else}
										{level.minPoints.toLocaleString()}+ điểm
									{/if}
								</p>
							</div>

							<!-- Merits needed -->
							{#if !isUnlocked}
								<div class="text-right flex-shrink-0">
									<p class="text-[#C5A059] font-medium text-sm">
										{(level.minPoints - totalMerits).toLocaleString()}
									</p>
									<p class="text-[#7A6B5A]/40 text-xs">điểm nữa</p>
								</div>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		</div>

		<!-- Quote -->
		<div class="text-center py-8 animate-fade-in" style="animation-delay: 0.9s;">
			<p class="text-[#3D3028]/20 text-xs italic leading-relaxed">
				"Mỗi ngày tích lũy một điều tốt, ta đang vun trồng hạt giống Bồ Đề trong tâm"
			</p>
		</div>
	</main>
</div>

<!-- Bottom Navigation -->
<BottomNav currentRoute="/profile" />

<style>
	.font-serif {
		font-family: 'Playfair Display', Georgia, serif;
	}

	@keyframes pulse-slow {
		0%, 100% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.02);
		}
	}

	.animate-pulse-slow {
		animation: pulse-slow 4s ease-in-out infinite;
	}
</style>
