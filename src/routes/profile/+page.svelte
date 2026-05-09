<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import BottomNav from '$lib/components/BottomNav.svelte';
	import LevelAvatar from '$lib/components/LevelAvatar.svelte';
	import { supabase } from '$lib/supabase';
	import { getLevelInfo, type LevelInfo } from '$lib/components/levels/index';

	// User data
	let dharmaName = $state('Tân Viên');
	let totalMerits = $state(0);
	let isGuest = $state(false);
	let isLoading = $state(true);
	let mounted = $state(false);
	let currentLevel = $state<LevelInfo | null>(null);

	// Edit name state
	let isEditingName = $state(false);
	let editedName = $state('');
	let isSavingName = $state(false);

	async function fetchUserData() {
		isLoading = true;
		isGuest = localStorage.getItem('isGuest') === 'true';

		if (isGuest) {
			dharmaName = localStorage.getItem('guestDharmaName') || 'Khách';
			totalMerits = parseInt(localStorage.getItem('guestMerit') || '0');
			isLoading = false;
			currentLevel = getLevelInfo(totalMerits);
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
		currentLevel = getLevelInfo(totalMerits);
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

	async function handleLogout() {
		try {
			await supabase.auth.signOut();
		} catch (e) {}
		localStorage.removeItem('isGuest');
		localStorage.removeItem('guestMerit');
		localStorage.removeItem('guestDharmaName');
		localStorage.removeItem('guestAvatarEmoji');
		localStorage.removeItem('hasOnboarded');
		goto('/');
	}

	onMount(() => {
		mounted = true;
		fetchUserData();
	});
</script>

<div class="min-h-screen bg-[#F7F3F0] pb-28 relative overflow-hidden">
	<!-- Background decorations -->
	<div class="fixed inset-0 overflow-hidden pointer-events-none">
		<div class="absolute top-1/4 -left-20 w-64 h-64 bg-[#C5A059]/5 rounded-full blur-3xl animate-float-drift"></div>
		<div class="absolute bottom-1/3 right-1/4 w-48 h-48 bg-[#9CAF88]/5 rounded-full blur-3xl animate-float-drift" style="animation-delay: -4s;"></div>
	</div>

	<!-- Header -->
	<header class="relative px-6 py-6 z-10">
		<div class="flex items-center justify-between animate-fade-in-up">
			<h1 class="font-serif text-2xl font-light text-[#3D3228]">Cá Nhân</h1>
			<button
				onclick={() => goto('/dashboard')}
				class="p-2 -mr-2 rounded-full hover:bg-[#3D3028]/5 transition-colors"
			>
				<svg class="w-6 h-6 text-[#5C4F44]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
					<path d="M19 12H5M12 19l-7-7 7-7"/>
				</svg>
			</button>
		</div>
	</header>

	<!-- Main Content -->
	<main class="px-6 relative z-10">
		<!-- Profile Card -->
		<div class="bg-gradient-to-br from-[#F2EDE6] to-[#FAF8F5] rounded-3xl p-8 shadow-sm border border-[#E8E0D8]/50 text-center mb-6 animate-fade-in-up" style="animation-delay: 0.1s;">
			<!-- Avatar with Level-based SVG -->
			<button onclick={() => goto('/profile/level')} class="relative inline-block group">
				<!-- Golden glow halo -->
				<div class="absolute inset-0 flex items-center justify-center -translate-x-1/2 -translate-y-1/2 left-1/2 top-0">
					<div
						class="w-36 h-36 rounded-full bg-gradient-to-br from-[#C5A059]/20 via-[#C9B896]/15 to-transparent blur-xl group-hover:scale-110 transition-transform duration-500"
					></div>
				</div>

				<div class="relative w-28 h-28 rounded-full overflow-hidden shadow-lg shadow-[#C5A059]/20 border-4 border-[#E8DCC8] mx-auto bg-[#FAF8F5]">
					{#if isLoading}
						<div class="w-full h-full flex items-center justify-center">
							<div class="w-8 h-8 border-2 border-[#C5A059]/30 border-t-[#C5A059] rounded-full animate-spin"></div>
						</div>
					{:else}
						<LevelAvatar level={currentLevel?.level || 1} size="2xl" showGlow={false} class="w-full h-full" />
					{/if}
				</div>

				<!-- Tap hint -->
				<div class="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#3D3028]/80 text-white text-xs rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
					Xem cấp bậc
				</div>
			</button>

			<!-- Editable Dharma Name -->
			<div class="mt-5">
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
							class="p-2 rounded-full bg-[#C5A059] text-white hover:bg-[#A69070] transition-colors disabled:opacity-50"
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
						<h2 class="font-serif text-2xl font-light text-[#3D3228] tracking-wide">
							{#if isLoading}
								<span class="opacity-50">...</span>
							{:else}
								{dharmaName}
							{/if}
						</h2>
						<svg class="w-4 h-4 text-[#7A6B5A]/50 group-hover:text-[#7A6B5A] transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
							<path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
						</svg>
					</button>
				{/if}
			</div>

			<!-- Level Badge -->
			{#if currentLevel && !isLoading}
				<button onclick={() => goto('/profile/level')} class="mt-3 inline-flex items-center gap-2 px-4 py-1.5 bg-[#C5A059]/10 rounded-full border border-[#C5A059]/20 hover:bg-[#C5A059]/20 transition-colors">
					<div class="w-5 h-5">
						<LevelAvatar level={currentLevel.level} size="sm" showGlow={false} />
					</div>
					<span class="text-[#C5A059] text-sm font-medium">{currentLevel.name}</span>
					<svg class="w-4 h-4 text-[#C5A059]/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<polyline points="9,18 15,12 9,6"/>
					</svg>
				</button>
			{/if}

			<!-- Merits -->
			<div class="flex items-center justify-center gap-2 mt-4">
				<svg class="w-5 h-5 text-[#C5A059]" viewBox="0 0 24 24" fill="currentColor">
					<path d="M12 2L15 8L22 9L17 14L18 21L12 18L6 21L7 14L2 9L9 8Z"/>
				</svg>
				<span class="font-medium text-[#5C4F44]">
					{#if isLoading}
						<span class="opacity-50">...</span>
					{:else}
						{totalMerits.toLocaleString()}
					{/if}
				</span>
				<span class="text-[#7A6B5A]/50">công đức</span>
			</div>

			{#if isGuest}
				<div class="mt-4 px-4 py-2 bg-amber-50 rounded-full inline-block animate-fade-in">
					<span class="text-amber-700 text-sm">Chế độ Khách</span>
				</div>
			{/if}
		</div>

		<!-- Quick Actions -->
		<div class="bg-gradient-to-br from-[#F2EDE6] to-[#FAF8F5] rounded-3xl p-6 shadow-sm border border-[#E8E0D8]/50 animate-fade-in-up" style="animation-delay: 0.2s;">
			<h3 class="font-serif text-lg font-light text-[#3D3228] mb-5 tracking-wide text-center">Hành Trình</h3>

			<div class="space-y-3">
				<button
					onclick={() => goto('/profile/level')}
					class="w-full flex items-center gap-4 p-4 bg-[#EDE8E3] rounded-2xl hover:bg-[#E8E2DA] transition-colors group"
				>
					<div class="w-12 h-12 rounded-xl bg-[#C5A059]/15 flex items-center justify-center">
						<svg class="w-6 h-6 text-[#C5A059]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
							<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
						</svg>
					</div>
					<div class="flex-1 text-left">
						<p class="font-medium text-[#3D3228] text-sm">Cấp Bậc Tu Tập</p>
						<p class="text-[#7A6B5A]/60 text-xs mt-0.5">Xem tiến trình của bạn</p>
					</div>
					<svg class="w-5 h-5 text-[#7A6B5A]/40 group-hover:text-[#7A6B5A] transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<polyline points="9,18 15,12 9,6"/>
					</svg>
				</button>

				<button
					onclick={() => goto('/guide')}
					class="w-full flex items-center gap-4 p-4 bg-[#EDE8E3] rounded-2xl hover:bg-[#E8E2DA] transition-colors group"
				>
					<div class="w-12 h-12 rounded-xl bg-[#9CAF88]/15 flex items-center justify-center">
						<svg class="w-6 h-6 text-[#9CAF88]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
							<circle cx="12" cy="12" r="10"/>
							<path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/>
							<path d="M12 17h.01"/>
						</svg>
					</div>
					<div class="flex-1 text-left">
						<p class="font-medium text-[#3D3228] text-sm">Hướng Dẫn</p>
						<p class="text-[#7A6B5A]/60 text-xs mt-0.5">Tìm hiểu cách tu tập</p>
					</div>
					<svg class="w-5 h-5 text-[#7A6B5A]/40 group-hover:text-[#7A6B5A] transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<polyline points="9,18 15,12 9,6"/>
					</svg>
				</button>
			</div>
		</div>

		<!-- Guest Mode / Logout -->
		{#if isGuest}
			<div class="mt-6 text-center animate-fade-in-up" style="animation-delay: 0.3s;">
				<p class="text-[#7A6B5A]/50 text-sm">
					Đăng nhập để đồng bộ dữ liệu
				</p>
				<button
					onclick={() => goto('/auth')}
					class="mt-3 px-8 py-3 bg-gradient-to-r from-[#C5A059] to-[#A69070] text-white rounded-full font-medium hover:shadow-lg hover:shadow-[#C5A059]/20 transition-all"
				>
					Đăng nhập
				</button>
			</div>
		{:else}
			<div class="mt-6 animate-fade-in-up" style="animation-delay: 0.3s;">
				<button
					onclick={handleLogout}
					class="w-full py-4 bg-[#EDE8E3] text-[#5C4F44] rounded-2xl font-medium hover:bg-[#E8E2DA] transition-all duration-300 flex items-center justify-center gap-3 border border-[#E8E0D8]"
				>
					<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
						<path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
						<polyline points="16,17 21,12 16,7"/>
						<line x1="21" y1="12" x2="9" y2="12"/>
					</svg>
					Đăng xuất
				</button>
			</div>
		{/if}

		<!-- App Version -->
		<div class="text-center mt-10 animate-fade-in" style="animation-delay: 0.5s;">
			<p class="text-[#3D3028]/20 text-sm">Tích Công Đức v1.0.0</p>
		</div>
	</main>
</div>

<!-- Bottom Navigation -->
<BottomNav currentRoute="/profile" />

<style>
	.font-serif {
		font-family: 'Playfair Display', Georgia, serif;
	}
</style>
