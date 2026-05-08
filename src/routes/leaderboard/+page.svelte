<script lang="ts">
	import { onMount } from 'svelte';
	import BottomNav from '$lib/components/BottomNav.svelte';
	import { supabase } from '$lib/supabase';

	interface LeaderboardUser {
		rank: number;
		id: string;
		name: string;
		dharmaName: string;
		meritPoints: number;
		streak: number;
		longestStreak: number;
		totalSessions: number;
		avatar: string;
		avatarColor: string;
	}

	const avatarColors: Record<string, string> = {
		lotus: 'bg-zen-rose/20',
		sun: 'bg-zen-gold/20',
		moon: 'bg-zen-brown-warm/20',
		star: 'bg-zen-gold-soft/20',
		leaf: 'bg-zen-sage/20',
		flame: 'bg-zen-rose/20',
	};

	let leaderboard = $state<LeaderboardUser[]>([]);
	let currentUserRank = $state<number | null>(null);
	let isLoading = $state(true);
	let currentUser = $state<LeaderboardUser | null>(null);

	function getAvatarSvg(avatarId: string, size: 'sm' | 'md' | 'lg' = 'md') {
		const sizes = { sm: 'w-5 h-5', md: 'w-6 h-6', lg: 'w-10 h-10' };
		const s = sizes[size];
		
		switch (avatarId) {
			case 'lotus':
				return `<svg class="${s}" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="24" cy="42" rx="5" ry="2.5"/><path d="M24 38 C24 38 19 32 19 26 C19 20 24 14 24 14 C24 14 29 20 29 26 C29 32 24 38 24 38"/><path d="M19 34 C15 28 12 24 12 20 C12 16 17 14 21 16"/><path d="M29 34 C33 28 36 24 36 20 C36 16 31 14 27 16"/></svg>`;
			case 'sun':
				return `<svg class="${s}" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="24" cy="24" r="8"/><path d="M24 8v6M24 34v6M8 24h6M34 24h6"/></svg>`;
			case 'moon':
				return `<svg class="${s}" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M36 24c0-8.284-5.716-15-13-15-1.126 0-2.218.14-3.26.4C25.1 11.2 29 16 29 21.5c0 5.5-3.9 10.3-9.26 12.1 1.04.26 2.13.4 3.26.4 7.284 0 13-6.716 13-15z"/></svg>`;
			case 'star':
				return `<svg class="${s}" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M24 8l4.9 10 11 1.6-8 7.8 1.9 11-9.8-5.2-9.8 5.2 1.9-11-8-7.8 11-1.6z"/></svg>`;
			case 'leaf':
				return `<svg class="${s}" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 36 C12 24 20 12 36 12 C36 12 36 36 24 36 C18 36 12 36 12 36"/><path d="M12 36 C20 32 28 24 36 12"/></svg>`;
			case 'flame':
				return `<svg class="${s}" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M24 44 C16 36 12 28 12 22 C12 14 18 8 24 8 C24 8 24 14 28 14 C32 14 36 18 36 24 C36 28 34 32 32 34 C30 36 26 38 24 44"/></svg>`;
			default:
				return `<svg class="${s}" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="24" cy="42" rx="5" ry="2.5"/><path d="M24 38 C24 38 19 32 19 26 C19 20 24 14 24 14 C24 14 29 20 29 26 C29 32 24 38 24 38"/></svg>`;
		}
	}

	async function fetchLeaderboard() {
		try {
			const { data, error } = await supabase
				.from('profiles')
				.select('*')
				.order('total_merits', { ascending: false })
				.limit(50);

			if (error) throw error;

			if (data && data.length > 0) {
				leaderboard = data.map((user, index) => ({
					rank: index + 1,
					id: user.id,
					name: user.email?.split('@')[0] || 'User',
					dharmaName: user.dharma_name || 'Tân Viên',
					meritPoints: user.total_merits || 0,
					streak: user.current_streak || 0,
					longestStreak: user.longest_streak || 0,
					totalSessions: user.total_sessions || 0,
					avatar: user.avatar_emoji || 'lotus',
					avatarColor: avatarColors[user.avatar_emoji] || 'bg-zen-rose/20'
				}));
			}
		} catch (error) {
			console.error('Error fetching leaderboard:', error);
		} finally {
			isLoading = false;
		}
	}

	async function fetchCurrentUserRank() {
		try {
			const { data: { user } } = await supabase.auth.getUser();
			if (!user) return;

			const { data, error } = await supabase
				.from('profiles')
				.select('*')
				.eq('id', user.id)
				.single();

			if (error) throw error;

			currentUser = {
				rank: 0,
				id: user.id,
				name: user.email?.split('@')[0] || 'User',
				dharmaName: data.dharma_name || 'Tân Viên',
				meritPoints: data.total_merits || 0,
				streak: data.current_streak || 0,
				longestStreak: data.longest_streak || 0,
				totalSessions: data.total_sessions || 0,
				avatar: data.avatar_emoji || 'lotus',
				avatarColor: avatarColors[data.avatar_emoji] || 'bg-zen-rose/20'
			};

			currentUserRank = leaderboard.findIndex(u => u.id === user.id) + 1;
			if (currentUserRank === 0) currentUserRank = null;
		} catch (error) {
			console.log('User not logged in or error fetching rank');
		}
	}

	onMount(() => {
		fetchLeaderboard().then(() => fetchCurrentUserRank());
	});
</script>

<div class="min-h-screen bg-zen-cream pb-24">
	<!-- Header -->
	<header class="relative px-6 pt-8 pb-6 overflow-hidden">
		<!-- Background decoration -->
		<div class="absolute inset-0 pointer-events-none">
			<div class="absolute top-0 right-0 w-32 h-32 bg-zen-gold/5 rounded-full blur-3xl"></div>
			<div class="absolute -bottom-10 left-0 w-40 h-40 bg-zen-sage/5 rounded-full blur-3xl"></div>
		</div>
		
		<div class="relative">
			<h1 class="font-serif text-3xl font-light text-zen-brown-deep tracking-wide">Đạo Hạnh</h1>
			<p class="text-zen-brown-warm/60 text-sm mt-2">Hành trình tích đức của con</p>
			
			{#if currentUserRank}
				<div class="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-zen-gold/10 rounded-full">
					<div class="w-2 h-2 rounded-full bg-zen-gold animate-breathe-subtle"></div>
					<span class="text-sm text-zen-brown-warm">Hạng của con: <span class="font-medium text-zen-brown-deep">#{currentUserRank}</span></span>
				</div>
			{:else if !isLoading}
				<div class="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-zen-parchment/60 rounded-full">
					<span class="text-sm text-zen-brown-warm/60"><a href="/auth" class="text-zen-gold hover:underline">Đăng nhập</a> để ghi danh</span>
				</div>
			{/if}
		</div>
	</header>

	{#if isLoading}
		<div class="flex items-center justify-center py-20">
			<div class="relative">
				<div class="w-12 h-12 border-2 border-zen-gold/20 border-t-zen-gold rounded-full animate-spin"></div>
				<div class="absolute inset-0 w-12 h-12 border-2 border-zen-sage/20 border-b-zen-sage rounded-full animate-spin" style="animation-direction: reverse; animation-delay: 0.5s;"></div>
			</div>
		</div>
	{:else if leaderboard.length === 0}
		<!-- Empty State -->
		<div class="flex flex-col items-center justify-center py-20 px-6 text-center">
			<div class="relative w-32 h-32 mb-8">
				<!-- Animated lotus -->
				<svg viewBox="0 0 100 100" class="w-full h-full text-zen-gold/20 animate-breathe">
					<ellipse cx="50" cy="90" rx="15" ry="6" fill="currentColor"/>
					<path d="M50 75 C50 75 30 55 30 40 C30 25 50 10 50 10 C50 10 70 25 70 40 C70 55 50 75 50 75" fill="currentColor"/>
					<path d="M30 65 C18 48 8 36 8 24 C8 12 26 6 38 14" fill="currentColor"/>
					<path d="M70 65 C82 48 92 36 92 24 C92 12 74 6 62 14" fill="currentColor"/>
				</svg>
				<!-- Ripple rings -->
				<div class="absolute inset-0 border border-zen-gold/10 rounded-full animate-ripple"></div>
				<div class="absolute inset-4 border border-zen-gold/5 rounded-full animate-ripple" style="animation-delay: 0.5s;"></div>
			</div>
			
			<h2 class="font-serif text-2xl text-zen-brown-deep mb-3">Chưa có ai ghi danh</h2>
			<p class="text-zen-brown-warm/60 max-w-xs leading-relaxed">
				Hãy là người đầu tiên tích lũy công đức trên hành trình này
			</p>
		</div>
	{:else}
	<div class="px-4 space-y-6">
		<!-- Top 3 - Elegant Podium -->
		{#if leaderboard.length >= 3}
		<div class="relative py-8">
			<!-- Decorative top line -->
			<div class="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-px bg-gradient-to-r from-transparent via-zen-gold/30 to-transparent"></div>
			
			<div class="flex items-end justify-center gap-2 md:gap-4">
				<!-- 2nd Place -->
				{#if leaderboard[1]}
					<div class="flex flex-col items-center animate-fade-in-up" style="animation-delay: 300ms;">
						<!-- Avatar -->
						<div class="relative">
							<div class="w-14 h-14 md:w-16 md:h-16 rounded-full {leaderboard[1].avatarColor} flex items-center justify-center shadow-md ring-2 ring-zen-linen">
								{@html getAvatarSvg(leaderboard[1].avatar, 'md')}
							</div>
							<div class="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-zen-linen flex items-center justify-center shadow-sm">
								<span class="text-xs font-medium text-zen-brown-warm">2</span>
							</div>
						</div>
						
						<!-- Name -->
						<p class="mt-3 text-sm font-medium text-zen-brown-deep truncate max-w-[80px] text-center">{leaderboard[1].dharmaName}</p>
						<p class="text-xs text-zen-brown-warm/60">{leaderboard[1].meritPoints}</p>
						
						<!-- Pedestal -->
						<div class="mt-3 w-20 md:w-24 h-20 md:h-24 rounded-t-2xl bg-gradient-to-t from-zen-parchment to-zen-linen flex items-center justify-center shadow-lg relative overflow-hidden">
							<div class="absolute inset-0 bg-gradient-to-t from-zen-brown/5 to-transparent"></div>
							<svg class="w-8 h-8 text-zen-brown-warm/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
								<circle cx="12" cy="12" r="8"/>
								<circle cx="12" cy="12" r="3"/>
								<path d="M12 2v4M12 18v4M2 12h4M18 12h4"/>
							</svg>
						</div>
					</div>
				{/if}

				<!-- 1st Place - Center, Taller -->
				{#if leaderboard[0]}
					<div class="flex flex-col items-center animate-fade-in-up z-10" style="animation-delay: 100ms;">
						<!-- Crown indicator -->
						<div class="relative -mb-2">
							<svg class="w-8 h-8 text-zen-gold animate-breathe-subtle" viewBox="0 0 32 32" fill="currentColor">
								<path d="M16 4l3 8h10l-8 6 3 10-8-5-8 5 3-10-8-6h10z"/>
							</svg>
						</div>
						
						<!-- Avatar - Larger -->
						<div class="relative">
							<div class="w-18 h-18 md:w-20 md:h-20 rounded-full {leaderboard[0].avatarColor} flex items-center justify-center shadow-xl ring-4 ring-zen-gold/20">
								{@html getAvatarSvg(leaderboard[0].avatar, 'lg')}
							</div>
							<!-- Glow effect -->
							<div class="absolute inset-0 rounded-full bg-zen-gold/10 animate-ping" style="animation-duration: 3s;"></div>
						</div>
						
						<!-- Name -->
						<p class="mt-4 text-base font-medium text-zen-brown-deep truncate max-w-[100px] text-center">{leaderboard[0].dharmaName}</p>
						<p class="text-sm font-medium text-zen-gold">{leaderboard[0].meritPoints}</p>
						
						<!-- Pedestal - Tallest -->
						<div class="mt-3 w-24 md:w-28 h-28 md:h-32 rounded-t-3xl bg-gradient-to-t from-zen-gold/20 to-zen-gold/10 flex items-center justify-center shadow-xl relative overflow-hidden">
							<div class="absolute inset-0 bg-gradient-to-t from-zen-gold/10 to-transparent"></div>
							<!-- Inner glow -->
							<div class="absolute inset-2 rounded-t-2xl border border-zen-gold/20"></div>
							<svg class="w-10 h-10 text-zen-gold/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
								<circle cx="12" cy="12" r="8"/>
								<circle cx="12" cy="12" r="3"/>
								<path d="M12 2v4M12 18v4M2 12h4M18 12h4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
							</svg>
						</div>
					</div>
				{/if}

				<!-- 3rd Place -->
				{#if leaderboard[2]}
					<div class="flex flex-col items-center animate-fade-in-up" style="animation-delay: 500ms;">
						<!-- Avatar -->
						<div class="relative">
							<div class="w-14 h-14 md:w-16 md:h-16 rounded-full {leaderboard[2].avatarColor} flex items-center justify-center shadow-md ring-2 ring-zen-linen">
								{@html getAvatarSvg(leaderboard[2].avatar, 'md')}
							</div>
							<div class="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-zen-rose/30 flex items-center justify-center shadow-sm">
								<span class="text-xs font-medium text-zen-rose">3</span>
							</div>
						</div>
						
						<!-- Name -->
						<p class="mt-3 text-sm font-medium text-zen-brown-deep truncate max-w-[80px] text-center">{leaderboard[2].dharmaName}</p>
						<p class="text-xs text-zen-brown-warm/60">{leaderboard[2].meritPoints}</p>
						
						<!-- Pedestal -->
						<div class="mt-3 w-20 md:w-24 h-16 md:h-20 rounded-t-2xl bg-gradient-to-t from-zen-rose/20 to-zen-rose/10 flex items-center justify-center shadow-lg relative overflow-hidden">
							<div class="absolute inset-0 bg-gradient-to-t from-zen-rose/5 to-transparent"></div>
							<svg class="w-8 h-8 text-zen-rose/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
								<circle cx="12" cy="12" r="8"/>
								<circle cx="12" cy="12" r="3"/>
								<path d="M12 2v4M12 18v4"/>
							</svg>
						</div>
					</div>
				{/if}
			</div>
			
			<!-- Decorative bottom line -->
			<div class="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-px bg-gradient-to-r from-transparent via-zen-gold/30 to-transparent"></div>
		</div>
		{/if}

		<!-- Rest of List -->
		{#if leaderboard.length > 3}
		<div class="bg-zen-parchment/40 backdrop-blur-sm rounded-3xl overflow-hidden">
			<div class="px-5 py-4 border-b border-zen-linen/50">
				<h2 class="font-serif text-lg text-zen-brown-deep">Danh sách hành giả</h2>
			</div>

			<div class="divide-y divide-zen-linen/30">
				{#each leaderboard.slice(3) as user, index}
					<div 
						class="flex items-center px-5 py-4 transition-colors duration-200 hover:bg-zen-gold/5 {currentUser?.id === user.id ? 'bg-zen-gold/10' : ''}"
						style="animation-delay: {(index + 4) * 100}ms;"
					>
						<div class="w-8 h-8 rounded-full bg-zen-parchment flex items-center justify-center mr-4">
							<span class="text-sm font-medium text-zen-brown-warm/70">{user.rank}</span>
						</div>
						
						<div class="w-10 h-10 rounded-full {user.avatarColor} flex items-center justify-center mr-3">
							{@html getAvatarSvg(user.avatar, 'sm')}
						</div>
						
						<div class="flex-1 min-w-0">
							<p class="font-medium text-zen-brown-deep truncate">{user.dharmaName}</p>
							<p class="text-xs text-zen-brown-warm/50 truncate">{user.name}</p>
						</div>
						
						<div class="text-right">
							<p class="font-medium text-zen-gold">{user.meritPoints}</p>
							<p class="text-xs text-zen-brown-warm/40">{user.streak} ngày</p>
						</div>
					</div>
				{/each}
			</div>
		</div>
		{/if}

		<!-- Your Position Card -->
		{#if currentUser}
			<div class="bg-gradient-to-r from-zen-gold/10 via-zen-gold/5 to-zen-sage/10 rounded-2xl p-4 border border-zen-gold/20">
				<div class="flex items-center gap-4">
					<div class="w-12 h-12 rounded-full {currentUser.avatarColor} flex items-center justify-center">
						{@html getAvatarSvg(currentUser.avatar, 'md')}
					</div>
					<div class="flex-1">
						<p class="font-medium text-zen-brown-deep">Vị trí của con</p>
						<p class="text-sm text-zen-brown-warm/60">Đạo danh: {currentUser.dharmaName}</p>
					</div>
					<div class="text-center">
						<p class="text-2xl font-light text-zen-gold">#{currentUserRank}</p>
						<p class="text-xs text-zen-brown-warm/50">{currentUser.meritPoints} điểm</p>
					</div>
				</div>
			</div>
		{/if}
	</div>
	{/if}

	<BottomNav currentRoute="/leaderboard" />
</div>
