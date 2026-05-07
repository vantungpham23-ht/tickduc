<script lang="ts">
	import { onMount } from 'svelte';
	import BottomNav from '$lib/components/BottomNav.svelte';
	import { supabase } from '$lib/supabase';
	import { goto } from '$app/navigation';

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

	let leaderboard = $state<LeaderboardUser[]>([]);
	let currentUserRank = $state<number | null>(null);
	let isLoading = $state(true);
	let currentUser = $state<LeaderboardUser | null>(null);

	async function fetchLeaderboard() {
		try {
			const { data, error } = await supabase
				.from('profiles')
				.select('*')
				.order('total_merits', { ascending: false })
				.limit(50);

			if (error) throw error;

			// Only show data if we have results from database
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
					avatar: user.avatar_emoji || '🙏',
					avatarColor: user.avatar_color || 'bg-amber-100'
				}));
			}
			// If data is empty, leave leaderboard empty
		} catch (error) {
			console.error('Error fetching leaderboard:', error);
			// Don't show mock data - leave empty
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
				avatar: data.avatar_emoji || '🙏',
				avatarColor: data.avatar_color || 'bg-amber-100'
			};

			// Calculate user's rank
			currentUserRank = leaderboard.findIndex(u => u.id === user.id) + 1;
			if (currentUserRank === 0) currentUserRank = null;
		} catch (error) {
			console.log('User not logged in or error fetching rank');
		}
	}

	function loadMockData() {
		// No mock data - only show real users from database
	}

	onMount(() => {
		fetchLeaderboard().then(() => fetchCurrentUserRank());
	});
</script>

<div class="min-h-screen bg-zen-beige pb-24">
	<!-- Header -->
	<header class="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-10">
		<div class="px-6 py-4">
			<h1 class="text-2xl font-serif font-bold text-zen-brown">Bảng Xếp Hạng</h1>
			{#if currentUserRank}
				<p class="text-sm text-zen-brown/60 mt-1">Hạng của bạn: <span class="font-semibold text-zen-gold">#{currentUserRank}</span></p>
			{:else if !isLoading}
				<p class="text-sm text-zen-brown/60 mt-1"><a href="/auth" class="text-zen-gold hover:underline">Đăng nhập</a> để xem hạng của bạn</p>
			{/if}
		</div>
	</header>

	{#if isLoading}
		<div class="flex items-center justify-center py-20">
			<div class="w-12 h-12 border-4 border-zen-gold/30 border-t-zen-gold rounded-full animate-spin"></div>
		</div>
	{:else if leaderboard.length === 0}
		<!-- Empty State -->
		<div class="flex flex-col items-center justify-center py-20 text-center">
			<div class="w-24 h-24 rounded-full bg-zen-brown/5 flex items-center justify-center mb-6">
				<span class="text-5xl">🪷</span>
			</div>
			<h2 class="font-serif text-2xl text-zen-brown mb-2">Chưa có ai trong bảng xếp hạng</h2>
			<p class="text-zen-brown/60 max-w-xs">
				Hãy là người đầu tiên tích lũy công đức để được ghi danh!
			</p>
		</div>
	{:else}
	<div class="px-4 pt-6 space-y-4">
		<!-- Top 3 Podium -->
		<div class="flex items-end justify-center gap-3 mb-8">
			<!-- 2nd Place -->
			{#if leaderboard[1]}
				<div class="flex flex-col items-center animate-fadeInUp" style="animation-delay: 200ms">
					<div class="relative">
						<div class="w-16 h-16 rounded-full {leaderboard[1].avatarColor} flex items-center justify-center text-3xl shadow-lg border-2 border-gray-200">
							{leaderboard[1].avatar}
						</div>
						<span class="absolute -top-2 -right-2 w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center text-xs font-bold text-white">2</span>
					</div>
					<p class="mt-2 text-sm font-semibold text-zen-brown">{leaderboard[1].dharmaName}</p>
					<p class="text-xs text-zen-brown/60">{leaderboard[1].meritPoints.toLocaleString()} điểm</p>
					<div class="w-20 h-24 bg-gradient-to-t from-gray-200 to-gray-300 rounded-t-2xl mt-2 flex items-center justify-center">
						<span class="text-3xl">🥈</span>
					</div>
				</div>
			{/if}

			<!-- 1st Place -->
			{#if leaderboard[0]}
				<div class="flex flex-col items-center animate-fadeInUp" style="animation-delay: 100ms">
					<div class="relative">
						<div class="w-20 h-20 rounded-full {leaderboard[0].avatarColor} flex items-center justify-center text-4xl shadow-xl border-2 border-zen-gold ring-4 ring-zen-gold/30">
							{leaderboard[0].avatar}
						</div>
						<span class="absolute -top-2 -right-2 w-7 h-7 bg-zen-gold rounded-full flex items-center justify-center text-sm font-bold text-white shadow-lg">1</span>
						<span class="absolute -bottom-1 left-1/2 -translate-x-1/2 text-xl">👑</span>
					</div>
					<p class="mt-3 text-base font-bold text-zen-brown">{leaderboard[0].dharmaName}</p>
					<p class="text-sm font-medium text-zen-gold">{leaderboard[0].meritPoints.toLocaleString()} điểm</p>
					<div class="w-24 h-32 bg-gradient-to-t from-amber-400 to-amber-300 rounded-t-3xl mt-2 flex items-center justify-center shadow-lg">
						<span class="text-4xl">🥇</span>
					</div>
				</div>
			{/if}

			<!-- 3rd Place -->
			{#if leaderboard[2]}
				<div class="flex flex-col items-center animate-fadeInUp" style="animation-delay: 300ms">
					<div class="relative">
						<div class="w-16 h-16 rounded-full {leaderboard[2].avatarColor} flex items-center justify-center text-3xl shadow-lg border-2 border-amber-600">
							{leaderboard[2].avatar}
						</div>
						<span class="absolute -top-2 -right-2 w-6 h-6 bg-amber-600 rounded-full flex items-center justify-center text-xs font-bold text-white">3</span>
					</div>
					<p class="mt-2 text-sm font-semibold text-zen-brown">{leaderboard[2].dharmaName}</p>
					<p class="text-xs text-zen-brown/60">{leaderboard[2].meritPoints.toLocaleString()} điểm</p>
					<div class="w-20 h-20 bg-gradient-to-t from-amber-600 to-amber-500 rounded-t-2xl mt-2 flex items-center justify-center">
						<span class="text-3xl">🥉</span>
					</div>
				</div>
			{/if}
		</div>

		<!-- Rest of Leaderboard -->
		<div class="bg-white rounded-2xl shadow-sm overflow-hidden">
			<div class="px-4 py-3 bg-zen-brown/5 border-b border-zen-brown/10">
				<h2 class="font-semibold text-zen-brown">Bảng xếp hạng</h2>
			</div>

			{#each leaderboard.slice(3) as user}
				<div class="flex items-center px-4 py-3 border-b border-zen-brown/5 last:border-b-0 hover:bg-zen-gold/5 transition-colors {currentUser?.id === user.id ? 'bg-zen-gold/10' : ''}">
					<div class="w-8 h-8 rounded-full bg-zen-brown/10 flex items-center justify-center font-bold text-sm text-zen-brown/70 mr-3">
						{user.rank}
					</div>
					<div class="w-10 h-10 rounded-full {user.avatarColor} flex items-center justify-center text-xl mr-3">
						{user.avatar}
					</div>
					<div class="flex-1 min-w-0">
						<p class="font-medium text-zen-brown truncate">{user.dharmaName}</p>
						<p class="text-xs text-zen-brown/50 truncate">{user.name}</p>
					</div>
					<div class="text-right">
						<p class="font-semibold text-zen-gold">{user.meritPoints.toLocaleString()}</p>
						<p class="text-xs text-zen-brown/50">{user.streak} ngày</p>
					</div>
				</div>
			{/each}
		</div>

		<!-- Your Position -->
		{#if currentUser}
			<div class="bg-gradient-to-r from-zen-gold/20 to-zen-gold/10 rounded-2xl p-4 border border-zen-gold/30">
				<div class="flex items-center">
					<div class="w-12 h-12 rounded-full {currentUser.avatarColor} flex items-center justify-center text-2xl mr-3">
						{currentUser.avatar}
					</div>
					<div class="flex-1">
						<p class="font-semibold text-zen-brown">Vị trí của bạn</p>
						<p class="text-sm text-zen-brown/60">Đạo danh: {currentUser.dharmaName}</p>
					</div>
					<div class="text-center">
						<p class="text-2xl font-bold text-zen-gold">#{currentUserRank}</p>
						<p class="text-xs text-zen-brown/60">{currentUser.meritPoints.toLocaleString()} điểm</p>
					</div>
				</div>
			</div>
		{/if}
	</div>
	{/if}

	<BottomNav currentRoute="/leaderboard" />
</div>
