<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import BottomNav from '$lib/components/BottomNav.svelte';
	import LevelAvatar from '$lib/components/LevelAvatar.svelte';
	import { supabase } from '$lib/supabase';
	import { getLevelInfo, type LevelInfo } from '$lib/components/levels/index';

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
			if (!user) { isLoading = false; return; }
			const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
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

<div class="min-h-screen pb-24 relative overflow-hidden">
	<!-- Ambient backgrounds -->
	<div class="fixed inset-0 overflow-hidden pointer-events-none">
		<div class="absolute top-0 left-1/4 w-80 h-80 bg-[#C5A059]/4 rounded-full blur-3xl animate-float-drift"></div>
		<div class="absolute bottom-1/4 right-0 w-64 h-64 bg-[#93B1A7]/3 rounded-full blur-3xl animate-float-drift" style="animation-delay: -4s;"></div>
		<div class="absolute top-1/2 right-1/4 w-48 h-48 bg-[#C5A059]/2 rounded-full blur-3xl animate-float-drift" style="animation-delay: -8s;"></div>
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
						<svg class="w-4 h-4 text-[#C5A059] flex-shrink-0" viewBox="0 0 24 24" fill="none">
							<circle cx="12" cy="16" r="5" fill="currentColor" opacity="0.7"/>
							<path d="M12 9 L12 6 M8 11 L6 9 M16 11 L18 9 M12 16 L12 19 M7 14 L5 13 M17 14 L19 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
						</svg>
					{:else if greetingTimeOfDay === 'afternoon'}
						<svg class="w-4 h-4 text-[#D4B896] flex-shrink-0" viewBox="0 0 24 24" fill="none">
							<circle cx="12" cy="12" r="5" fill="currentColor" opacity="0.7"/>
							<path d="M12 4 L12 6 M12 18 L12 20 M4 12 L6 12 M18 12 L20 12 M6.34 6.34 L7.76 7.76 M16.24 16.24 L17.66 17.66 M6.34 17.66 L7.76 16.24 M16.24 7.76 L17.66 6.34" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
						</svg>
					{:else if greetingTimeOfDay === 'evening'}
						<svg class="w-4 h-4 text-[#93B1A7] flex-shrink-0" viewBox="0 0 24 24" fill="none">
							<path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" fill="currentColor" opacity="0.7"/>
						</svg>
					{:else}
						<svg class="w-4 h-4 text-[#8A8070] flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
							<path d="M12 3 L13 5 L15 5 L13.5 6.5 L14 9 L12 7.5 L10 9 L10.5 6.5 L9 5 L11 5 Z" opacity="0.9"/>
							<path d="M18 8 L18.5 9.5 L20 9.5 L19 10.5 L19.5 12 L18 11 L16.5 12 L17 10.5 L16 9.5 L17.5 9.5 Z" opacity="0.5"/>
							<path d="M6 14 L6.3 14.8 L7 15 L6.5 15.6 L6.8 16.4 L6 16 L5.2 16.4 L5.5 15.6 L5 15 L5.7 14.8 Z" opacity="0.6"/>
						</svg>
					{/if}
					<p class="text-[#8A8070] text-sm font-light tracking-wide">{greeting}</p>
				</div>

				<!-- Dharma name -->
				<h1 class="font-serif text-3xl text-[#F5F0E8] font-light tracking-wide leading-none">
					{dharmaName}
				</h1>

				<!-- Decorative line -->
				<div class="flex items-center gap-3 mt-4">
					<div class="w-8 h-px bg-gradient-to-r from-[#C5A059]/40 to-transparent"></div>
					<div class="w-1.5 h-1.5 rounded-full bg-[#C5A059]/30"></div>
				</div>
			</div>

			<!-- Avatar button -->
			<button onclick={() => goto('/profile')} class="relative flex-shrink-0 ml-4">
				{#if currentLevel && !isLoading}
					<div class="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#1A1814] border border-[#C5A059]/30 flex items-center justify-center z-10 shadow-lg">
						<LevelAvatar level={currentLevel.level} size="xs" showGlow={false} />
					</div>
				{/if}
				<div class="w-12 h-12 rounded-full bg-gradient-to-br from-[#C5A059]/20 to-[#C5A059]/5 border border-[#C5A059]/20 p-0.5 shadow-lg shadow-black/20">
					<div class="w-full h-full rounded-full bg-[#242018] flex items-center justify-center overflow-hidden">
						{#if isLoading}
							<div class="w-5 h-5 border border-[#C5A059]/20 border-t-[#C5A059]/60 rounded-full animate-spin"></div>
						{:else}
							<LevelAvatar level={currentLevel?.level || 1} size="md" showGlow={true} />
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
			<div class="absolute inset-0 bg-gradient-to-br from-[#2A2520] via-[#242018] to-[#1A1814]"></div>
			<!-- Top accent line -->
			<div class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C5A059]/30 to-transparent"></div>
			<!-- Corner ornaments -->
			<svg class="absolute top-4 left-4 w-5 h-5 text-[#C5A059]/10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.5">
				<path d="M3 3 L12 3 M3 3 L3 12" stroke-linecap="round"/>
			</svg>
			<svg class="absolute top-4 right-4 w-5 h-5 text-[#C5A059]/10 rotate-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.5">
				<path d="M3 3 L12 3 M3 3 L3 12" stroke-linecap="round"/>
			</svg>

			<!-- Decorative lotus silhouette -->
			<div class="absolute right-4 bottom-2 w-32 h-32 opacity-5">
				<svg viewBox="0 0 100 100" class="w-full h-full">
					<ellipse cx="50" cy="40" rx="12" ry="25" fill="#C5A059" transform="rotate(0 50 65)"/>
					<ellipse cx="50" cy="40" rx="12" ry="25" fill="#C5A059" transform="rotate(72 50 65)"/>
					<ellipse cx="50" cy="40" rx="12" ry="25" fill="#C5A059" transform="rotate(144 50 65)"/>
					<ellipse cx="50" cy="40" rx="12" ry="25" fill="#C5A059" transform="rotate(216 50 65)"/>
					<ellipse cx="50" cy="40" rx="12" ry="25" fill="#C5A059" transform="rotate(288 50 65)"/>
					<circle cx="50" cy="65" r="8" fill="#C5A059"/>
				</svg>
			</div>

			<div class="relative p-6">
				<div class="flex items-center justify-between mb-6">
					<div class="flex items-center gap-2">
						<svg class="w-3.5 h-3.5 text-[#C5A059]/50" viewBox="0 0 24 24" fill="currentColor">
							<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
						</svg>
						<span class="text-[#8A8070] text-xs tracking-[0.2em] uppercase">Tổng công đức</span>
					</div>
					{#if currentLevel && !isLoading}
						<button onclick={() => goto('/profile/level')} class="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C5A059]/8 border border-[#C5A059]/15 hover:border-[#C5A059]/30 transition-colors group">
							<div class="w-4 h-4">
								<LevelAvatar level={currentLevel.level} size="xs" showGlow={false} />
							</div>
							<span class="text-[#C5A059]/80 text-xs font-medium">{currentLevel.name}</span>
							<svg class="w-3 h-3 text-[#C5A059]/40 group-hover:text-[#C5A059]/70 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<path d="M9 18l6-6-6-6"/>
							</svg>
						</button>
					{/if}
				</div>

				<div class="flex items-end justify-between">
					<div>
						<div class="flex items-baseline gap-2">
							{#if isLoading}
								<span class="font-serif text-6xl font-light text-[#F5F0E8]/20">...</span>
							{:else}
								<span class="font-serif text-6xl font-light text-[#F5F0E8] tracking-tight tabular-nums">{meritPoints.toLocaleString()}</span>
							{/if}
						</div>
						<p class="text-[#8A8070]/40 text-sm mt-2 font-light tracking-wide">điểm công đức</p>
					</div>

					<!-- Breathing lotus icon -->
					<div class="w-14 h-14 animate-breathe-subtle">
						<svg class="w-full h-full text-[#C5A059]/60" viewBox="0 0 60 60" fill="none">
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
		<div class="rounded-2xl overflow-hidden animate-fade-in-up border border-[#93B1A7]/10" style="animation-delay: 0.15s;">
			<div class="absolute inset-0 bg-gradient-to-r from-[#93B1A7]/5 to-transparent"></div>
			<div class="relative flex items-center gap-4 px-5 py-4">
				<div class="w-10 h-10 rounded-full bg-[#93B1A7]/10 border border-[#93B1A7]/15 flex items-center justify-center flex-shrink-0">
					<svg class="w-5 h-5 text-[#93B1A7]/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
						<path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
					</svg>
				</div>
				<div class="flex-1">
					<p class="text-[#93B1A7] font-light text-sm">
						<span class="font-medium">{streak}</span> ngày liên tục
					</p>
					<p class="text-[#8A8070]/30 text-xs mt-0.5">Chuỗi tích tụ của bạn</p>
				</div>
				<div class="w-px h-8 bg-gradient-to-b from-transparent via-[#93B1A7]/10 to-transparent"></div>
			</div>
		</div>
		{/if}

		<!-- Practice Cards - 3 Column Grid -->
		<div class="grid grid-cols-3 gap-3 stagger-children">
			<!-- Meditation -->
			<button onclick={() => goto('/meditate')} class="group relative rounded-2xl overflow-hidden aspect-square">
				<div class="absolute inset-0 bg-gradient-to-b from-[#2A2520] to-[#1E1A16] border border-[#C5A059]/10 group-hover:border-[#C5A059]/25 transition-colors"></div>
				<!-- Top accent -->
				<div class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C5A059]/20 to-transparent group-hover:via-[#C5A059]/40 transition-colors"></div>

				<div class="relative h-full flex flex-col items-center justify-center p-3">
					<div class="w-11 h-11 rounded-1.5xl bg-[#C5A059]/8 group-hover:bg-[#C5A059]/14 flex items-center justify-center mb-2.5 transition-colors group-hover:scale-105">
						<svg class="w-5 h-5 text-[#C5A059]/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
							<circle cx="12" cy="8" r="4"/>
							<path d="M6 20v-2a4 4 0 014-4h4a4 4 0 014 4v2"/>
						</svg>
					</div>
					<span class="font-serif text-sm text-[#F5F0E8]/80 tracking-wide leading-none mb-1">Thiền</span>
					<span class="text-[#8A8070]/30 text-[10px] font-light">10 phút</span>
				</div>
			</button>

			<!-- Prayer -->
			<button onclick={() => goto('/praying')} class="group relative rounded-2xl overflow-hidden aspect-square">
				<div class="absolute inset-0 bg-gradient-to-b from-[#2A2520] to-[#1E1A16] border border-[#C5A059]/10 group-hover:border-[#C5A059]/25 transition-colors"></div>
				<div class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C5A059]/20 to-transparent group-hover:via-[#C5A059]/40 transition-colors"></div>

				<div class="relative h-full flex flex-col items-center justify-center p-3">
					<div class="w-11 h-11 rounded-1.5xl bg-[#C5A059]/8 group-hover:bg-[#C5A059]/14 flex items-center justify-center mb-2.5 transition-colors group-hover:scale-105">
						<svg class="w-5 h-5 text-[#C5A059]/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
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
					<span class="font-serif text-sm text-[#F5F0E8]/80 tracking-wide leading-none mb-1">Hành Đạo</span>
					<span class="text-[#8A8070]/30 text-[10px] font-light">10 giây</span>
				</div>
			</button>

			<!-- Mokugyo -->
			<button onclick={() => goto('/mokugyo')} class="group relative rounded-2xl overflow-hidden aspect-square">
				<div class="absolute inset-0 bg-gradient-to-b from-[#2A2520] to-[#1E1A16] border border-[#93B1A7]/10 group-hover:border-[#93B1A7]/25 transition-colors"></div>
				<div class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#93B1A7]/20 to-transparent group-hover:via-[#93B1A7]/40 transition-colors"></div>

				<div class="relative h-full flex flex-col items-center justify-center p-3">
					<div class="w-11 h-11 rounded-1.5xl bg-[#93B1A7]/8 group-hover:bg-[#93B1A7]/14 flex items-center justify-center mb-2.5 transition-colors group-hover:scale-105">
						<svg class="w-5 h-5 text-[#93B1A7]/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
							<ellipse cx="12" cy="14" rx="8" ry="6"/>
							<path d="M12 8V6"/>
							<ellipse cx="12" cy="5" rx="3" ry="2"/>
						</svg>
					</div>
					<span class="font-serif text-sm text-[#F5F0E8]/80 tracking-wide leading-none mb-1">Gõ Mõ</span>
					<span class="text-[#8A8070]/30 text-[10px] font-light">108 lần</span>
				</div>
			</button>
		</div>

		<!-- Quick Actions -->
		<div class="grid grid-cols-2 gap-3 stagger-children">
			<button onclick={() => goto('/guide')} class="group relative rounded-2xl overflow-hidden text-left">
				<div class="absolute inset-0 bg-gradient-to-br from-[#2A2520] to-[#1E1A16] border border-[#C5A059]/8 group-hover:border-[#C5A059]/20 transition-colors"></div>
				<div class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C5A059]/10 to-transparent"></div>
				<div class="relative p-4 flex items-start gap-3">
					<div class="w-9 h-9 rounded-xl bg-[#C5A059]/8 group-hover:bg-[#C5A059]/14 flex items-center justify-center flex-shrink-0 transition-colors">
						<svg class="w-4 h-4 text-[#C5A059]/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
							<circle cx="12" cy="12" r="10"/>
							<path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/>
							<path d="M12 17h.01"/>
						</svg>
					</div>
					<div>
						<p class="text-[#F5F0E8]/80 text-sm font-light tracking-wide leading-tight">Hướng dẫn</p>
						<p class="text-[#8A8070]/30 text-[10px] mt-1 font-light">Cách tu tập</p>
					</div>
				</div>
			</button>

			<button onclick={() => goto('/buddhist')} class="group relative rounded-2xl overflow-hidden text-left">
				<div class="absolute inset-0 bg-gradient-to-br from-[#2A2520] to-[#1E1A16] border border-[#93B1A7]/8 group-hover:border-[#93B1A7]/20 transition-colors"></div>
				<div class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#93B1A7]/10 to-transparent"></div>
				<div class="relative p-4 flex items-start gap-3">
					<div class="w-9 h-9 rounded-xl bg-[#93B1A7]/8 group-hover:bg-[#93B1A7]/14 flex items-center justify-center flex-shrink-0 transition-colors">
						<svg class="w-4 h-4 text-[#93B1A7]/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
							<path d="M4 19.5A2.5 2.5 0 016.5 17H20"/>
							<path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
						</svg>
					</div>
					<div>
						<p class="text-[#F5F0E8]/80 text-sm font-light tracking-wide leading-tight">Kinh Phật</p>
						<p class="text-[#8A8070]/30 text-[10px] mt-1 font-light">Lịch & lời kinh</p>
					</div>
				</div>
			</button>
		</div>

		<!-- Daily quote -->
		<div class="relative py-6 animate-fade-in-up" style="animation-delay: 0.5s;">
			<div class="flex items-center gap-4">
				<div class="flex-shrink-0 w-8 h-px bg-gradient-to-r from-transparent to-[#C5A059]/15"></div>
				<p class="flex-1 text-center font-serif-alt text-[#8A8070]/35 text-sm italic font-light leading-relaxed px-2">
					"Những điều tốt đẹp nhất trong cuộc sống là những điều chúng ta không thể thấy bằng mắt"
				</p>
				<div class="flex-shrink-0 w-8 h-px bg-gradient-to-l from-transparent to-[#C5A059]/15"></div>
			</div>
		</div>
	</main>
</div>

<BottomNav currentRoute="/dashboard" />
