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

<div class="min-h-screen bg-[#F7F3F0] pb-20">
	<!-- Header -->
	<header class="relative px-5 pt-8 pb-6">
		<div class="flex items-center justify-between">
			<div>
				<div class="flex items-center gap-2 mb-1">
					<!-- Time of Day Icon -->
					{#if greetingTimeOfDay === 'morning'}
						<svg class="w-5 h-5 text-[#C5A059]" viewBox="0 0 24 24" fill="none">
							<circle cx="12" cy="16" r="5" fill="currentColor" opacity="0.8"/>
							<path d="M12 9 L12 6 M8 11 L6 9 M16 11 L18 9 M12 16 L12 19 M7 14 L5 13 M17 14 L19 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
						</svg>
					{:else if greetingTimeOfDay === 'afternoon'}
						<svg class="w-5 h-5 text-[#C5A059]" viewBox="0 0 24 24" fill="none">
							<circle cx="12" cy="12" r="5" fill="currentColor" opacity="0.8"/>
							<path d="M12 4 L12 6 M12 18 L12 20 M4 12 L6 12 M18 12 L20 12 M6.34 6.34 L7.76 7.76 M16.24 16.24 L17.66 17.66 M6.34 17.66 L7.76 16.24 M16.24 7.76 L17.66 6.34" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
						</svg>
					{:else if greetingTimeOfDay === 'evening'}
						<svg class="w-5 h-5 text-[#93B1A7]" viewBox="0 0 24 24" fill="none">
							<path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" fill="currentColor" opacity="0.8"/>
						</svg>
					{:else}
						<svg class="w-5 h-5 text-[#A69070]" viewBox="0 0 24 24" fill="none">
							<path d="M12 3 L13 5 L15 5 L13.5 6.5 L14 9 L12 7.5 L10 9 L10.5 6.5 L9 5 L11 5 Z" fill="currentColor" opacity="0.9"/>
							<path d="M18 8 L18.5 9.5 L20 9.5 L19 10.5 L19.5 12 L18 11 L16.5 12 L17 10.5 L16 9.5 L17.5 9.5 Z" fill="currentColor" opacity="0.6"/>
							<path d="M6 14 L6.3 14.8 L7 15 L6.5 15.6 L6.8 16.4 L6 16 L5.2 16.4 L5.5 15.6 L5 15 L5.7 14.8 Z" fill="currentColor" opacity="0.7"/>
						</svg>
					{/if}
					<p class="text-[#7A6B5A] text-sm">{greeting}</p>
				</div>
				<h1 class="font-serif text-2xl font-medium text-[#3D3229] tracking-wide">
					{dharmaName}
				</h1>
			</div>
		</div>
	</header>

	<main class="px-5 space-y-5">
		<!-- Main Card: Tổng công đức -->
		<div class="relative bg-[#F2EDE6]/60 rounded-3xl p-6 overflow-hidden">
			<!-- Static Lotus -->
			<div class="absolute -right-6 -bottom-6 w-36 h-36 opacity-30">
				<svg viewBox="0 0 120 120" class="w-full h-full">
					<ellipse cx="60" cy="105" rx="30" ry="8" fill="#C9B896" opacity="0.2"/>
					<path d="M60 95 C50 85 35 70 35 55 C35 45 45 38 55 42 C50 55 52 72 60 85" fill="#C9B896" opacity="0.7"/>
					<path d="M60 95 C70 85 85 70 85 55 C85 45 75 38 65 42 C70 55 68 72 60 85" fill="#C9B896" opacity="0.7"/>
					<path d="M60 88 C48 78 38 62 42 48 C46 38 56 38 60 48 C56 60 58 75 60 82" fill="#E8DCC8" opacity="0.85"/>
					<path d="M60 88 C72 78 82 62 78 48 C74 38 64 38 60 48 C64 60 62 75 60 82" fill="#E8DCC8" opacity="0.85"/>
					<ellipse cx="60" cy="62" rx="8" ry="10" fill="#F5EEE0"/>
					<ellipse cx="60" cy="60" rx="5" ry="7" fill="#E8DCC8"/>
					<circle cx="57" cy="56" r="1.5" fill="#C9B896"/>
					<circle cx="63" cy="56" r="1.5" fill="#C9B896"/>
					<circle cx="60" cy="54" r="1.5" fill="#C9B896"/>
				</svg>
			</div>

			<div class="relative">
				<p class="text-[#7A6B5A] text-sm font-light tracking-wide">Tổng công đức</p>
				
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
				</div>
			</div>
		</div>

		<!-- Streak Card -->
		{#if streak > 0}
		<div class="bg-[#9CAF88]/10 rounded-2xl p-4 flex items-center gap-4">
			<div class="w-12 h-12 rounded-full bg-[#9CAF88]/20 flex items-center justify-center">
				<svg class="w-6 h-6 text-[#9CAF88]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
					<path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
				</svg>
			</div>
			<div>
				<p class="text-[#9CAF88] font-medium">{streak} ngày</p>
				<p class="text-[#7A6B5A]/50 text-sm">Chuỗi tích tu</p>
			</div>
		</div>
		{/if}

		<!-- Action Cards -->
		<div class="grid grid-cols-3 gap-3">
			<!-- Thiền Card -->
			<button
				onclick={() => goto('/meditate')}
				class="relative bg-[#EDE8E3]/60 rounded-2xl p-4 text-left overflow-hidden"
			>
				<div class="relative">
					<div class="w-10 h-10 rounded-xl bg-[#C5A059]/10 flex items-center justify-center mb-2">
						<svg class="w-5 h-5 text-[#C5A059]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
							<circle cx="12" cy="8" r="4"/>
							<path d="M6 20v-2a4 4 0 014-4h4a4 4 0 014 4v2"/>
						</svg>
					</div>
					<h3 class="font-serif text-sm text-[#3D3028]">Thiền</h3>
					<p class="text-[#3D3028]/40 text-xs">10 phút</p>
				</div>
			</button>

			<!-- Hành Đạo Card -->
			<button
				onclick={() => goto('/praying')}
				class="relative bg-[#EDE8E3]/60 rounded-2xl p-4 text-left overflow-hidden"
			>
				<div class="relative">
					<div class="w-10 h-10 rounded-xl bg-[#C5A059]/10 flex items-center justify-center mb-2">
						<svg class="w-5 h-5 text-[#C5A059]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
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
					<h3 class="font-serif text-sm text-[#3D3028]">Hành Đạo</h3>
					<p class="text-[#3D3028]/40 text-xs">10 giây</p>
				</div>
			</button>

			<!-- Gõ Mõ Card -->
			<button
				onclick={() => goto('/mokugyo')}
				class="relative bg-[#EDE8E3]/60 rounded-2xl p-4 text-left overflow-hidden"
			>
				<div class="relative">
					<div class="w-10 h-10 rounded-xl bg-[#93B1A7]/10 flex items-center justify-center mb-2">
						<svg class="w-5 h-5 text-[#93B1A7]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
							<ellipse cx="12" cy="14" rx="8" ry="6"/>
							<path d="M12 8V6"/>
							<ellipse cx="12" cy="5" rx="3" ry="2"/>
						</svg>
					</div>
					<h3 class="font-serif text-sm text-[#3D3028]">Gõ Mõ</h3>
					<p class="text-[#3D3028]/40 text-xs">Tích điểm</p>
				</div>
			</button>
		</div>

		<!-- Quick Actions -->
		<div class="grid grid-cols-2 gap-3">
			<button
				onclick={() => goto('/guide')}
				class="bg-[#F2EDE6]/60 rounded-2xl p-4 text-left">
				<div class="w-10 h-10 rounded-xl bg-[#C5A059]/20 flex items-center justify-center mb-3">
					<svg class="w-5 h-5 text-[#C5A059]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
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
				class="bg-[#F2EDE6]/60 rounded-2xl p-4 text-left">
				<div class="w-10 h-10 rounded-xl bg-[#9CAF88]/20 flex items-center justify-center mb-3">
					<svg class="w-5 h-5 text-[#9CAF88]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
						<path d="M4 19.5A2.5 2.5 0 016.5 17H20"/>
						<path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
					</svg>
				</div>
				<p class="font-medium text-[#3D3229] text-sm">Kinh Phật</p>
				<p class="text-[#7A6B5A]/50 text-xs mt-0.5">Lời vàng mỗi ngày</p>
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
</style>
