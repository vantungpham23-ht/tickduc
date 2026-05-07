<script lang="ts">
	import { goto } from '$app/navigation';
	import { Home, User, Sparkles } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import BottomNav from '$lib/components/BottomNav.svelte';
	import { supabase } from '$lib/supabase';

	// User data
	let meritPoints = $state(0);
	let streak = $state(0);
	let longestStreak = $state(0);
	let todayMeditations = $state(0);
	let totalDays = $state(0);
	let dharmaName = $state('Tân Viên');
	let avatarEmoji = $state('🙏');
	let isGuest = $state(false);
	let isLoading = $state(true);

	// Recent activities
	interface Activity {
		id: string;
		type: string;
		createdAt: string;
		meritsEarned: number;
	}

	let recentActivities = $state<Activity[]>([]);

	async function fetchUserData() {
		isLoading = true;
		isGuest = localStorage.getItem('isGuest') === 'true';

		if (isGuest) {
			// Load guest data from localStorage
			meritPoints = parseInt(localStorage.getItem('guestMerit') || '0');
			dharmaName = localStorage.getItem('guestDharmaName') || 'Khách';
			avatarEmoji = '👤';
			streak = 0;
			longestStreak = 0;
			totalDays = 0;
			todayMeditations = 0;
			isLoading = false;
			return;
		}

		try {
			const { data: { user } } = await supabase.auth.getUser();
			if (!user) {
				isLoading = false;
				return;
			}

			// Fetch profile
			const { data: profile, error } = await supabase
				.from('profiles')
				.select('*')
				.eq('id', user.id)
				.single();

			if (profile) {
				meritPoints = profile.total_merits || 0;
				streak = profile.current_streak || 0;
				longestStreak = profile.longest_streak || 0;
				totalDays = profile.total_sessions || 0;
				dharmaName = profile.dharma_name || 'Tân Viên';
				avatarEmoji = profile.avatar_emoji || '🙏';
			}

			// Fetch today's meditations
			const today = new Date();
			today.setHours(0, 0, 0, 0);

			const { data: todayLogs } = await supabase
				.from('merit_logs')
				.select('id')
				.eq('user_id', user.id)
				.gte('created_at', today.toISOString());

			todayMeditations = todayLogs?.length || 0;

			// Fetch recent activities
			const { data: activities } = await supabase
				.from('merit_logs')
				.select('id, created_at, merits_earned')
				.eq('user_id', user.id)
				.order('created_at', { ascending: false })
				.limit(5);

			recentActivities = (activities || []).map(a => ({
				id: a.id,
				type: 'meditation',
				createdAt: a.created_at,
				meritsEarned: a.merits_earned
			}));

		} catch (error) {
			console.error('Error fetching user data:', error);
		}

		isLoading = false;
	}

	function formatDate(dateString: string) {
		const date = new Date(dateString);
		const now = new Date();
		const diff = now.getTime() - date.getTime();
		const hours = Math.floor(diff / (1000 * 60 * 60));

		if (hours < 1) return 'Vừa xong';
		if (hours < 24) return `Hôm nay, ${date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`;
		if (hours < 48) return `Hôm qua, ${date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`;
		return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
	}

	onMount(() => {
		fetchUserData();
	});
</script>

<div class="min-h-screen bg-zen-beige pb-24">
	<!-- Header -->
	<header class="px-6 py-6 flex items-center justify-between">
		<div>
			<p class="text-zen-brown/60 text-sm">Xin chào,</p>
			<h1 class="font-serif text-2xl font-semibold text-zen-brown">{dharmaName}</h1>
		</div>
		<button onclick={() => goto('/profile')} class="w-12 h-12 rounded-full bg-zen-white shadow-md flex items-center justify-center text-2xl">
			{avatarEmoji}
		</button>
	</header>

	<!-- Main Content -->
	<main class="px-6 py-4">
		<!-- Merit Points Card -->
		<div class="bg-zen-white rounded-3xl p-8 shadow-lg shadow-zen-brown/5 mb-6 text-center relative overflow-hidden">
			<!-- Decorative glow -->
			<div class="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-zen-gold/10 rounded-full blur-3xl"></div>

			<div class="relative z-10">
				<p class="text-zen-brown/60 mb-2 text-sm uppercase tracking-wider">Tổng công đức</p>
				<div class="flex items-baseline justify-center gap-2 mb-4">
					<span class="font-serif text-7xl md:text-8xl font-bold text-zen-gold">
						{#if isLoading}
							<span class="opacity-50">...</span>
						{:else}
							{meritPoints.toLocaleString()}
						{/if}
					</span>
					<span class="text-zen-brown/40 text-lg">điểm</span>
				</div>

				<!-- Stats Row -->
				<div class="flex justify-center gap-8 mt-6">
					<div class="text-center">
						<p class="text-2xl font-semibold text-zen-brown">{streak}</p>
						<p class="text-zen-brown/50 text-xs">Ngày liên tiếp</p>
					</div>
					<div class="w-px bg-zen-brown/10"></div>
					<div class="text-center">
						<p class="text-2xl font-semibold text-zen-brown">{todayMeditations}</p>
						<p class="text-zen-brown/50 text-xs">Hôm nay</p>
					</div>
					<div class="w-px bg-zen-brown/10"></div>
					<div class="text-center">
						<p class="text-2xl font-semibold text-zen-brown">{totalDays}</p>
						<p class="text-zen-brown/50 text-xs">Tổng ngày</p>
					</div>
				</div>
			</div>
		</div>

		<!-- Guest Mode Banner -->
		{#if isGuest}
			<div class="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6">
				<p class="text-amber-800 text-sm">
					<span class="font-semibold">Chế độ Khách:</span> Công đức chỉ lưu trên thiết bị này.
					<a href="/auth" class="text-amber-600 hover:underline ml-1">Đăng nhập</a> để đồng bộ dữ liệu.
				</p>
			</div>
		{/if}

		<!-- Meditation Button -->
		<button
			onclick={() => goto('/meditate')}
			class="w-full py-6 bg-gradient-to-r from-zen-gold to-zen-brown text-zen-white rounded-3xl font-medium text-xl shadow-xl shadow-zen-gold/30 transition-all duration-300 hover:shadow-2xl hover:shadow-zen-gold/40 hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-3 mb-8"
		>
			<Sparkles class="w-6 h-6" />
			Bắt đầu tích công đức
		</button>

		<!-- Recent Activity -->
		<section class="mb-8">
			<div class="flex items-center justify-between mb-4">
				<h2 class="font-serif text-xl font-semibold text-zen-brown">Hoạt động gần đây</h2>
				<a href="/leaderboard" class="text-zen-gold text-sm hover:underline">
					Xếp hạng
				</a>
			</div>

			{#if recentActivities.length > 0}
				<div class="space-y-3">
					{#each recentActivities as activity}
						<div class="bg-zen-white rounded-2xl p-4 flex items-center gap-4 shadow-sm">
							<div class="w-12 h-12 rounded-full bg-zen-gold/10 flex items-center justify-center">
								<Sparkles class="w-6 h-6 text-zen-gold" />
							</div>
							<div class="flex-1">
								<p class="font-medium text-zen-brown">Thiền định thành công</p>
								<p class="text-sm text-zen-brown/50">{formatDate(activity.createdAt)}</p>
							</div>
							<div class="text-zen-gold font-semibold">+{activity.meritsEarned}</div>
						</div>
					{/each}
				</div>
			{:else if !isLoading}
				<div class="bg-zen-white rounded-2xl p-6 text-center shadow-sm">
					<p class="text-zen-brown/50">Chưa có hoạt động nào</p>
					<p class="text-zen-brown/30 text-sm mt-1">Bắt đầu thiền định để tích công đức</p>
				</div>
			{/if}
		</section>

		<!-- Motivational Quote -->
		<div class="bg-gradient-to-br from-zen-brown to-zen-brown/90 rounded-3xl p-6 text-center">
			<p class="text-zen-beige/90 font-serif text-lg italic leading-relaxed">
				"Mỗi hơi thở là một cơ hội để tích lũy công đức"
			</p>
			<p class="text-zen-beige/50 text-sm mt-3">- Thầy Tịnh Không</p>
		</div>
	</main>
</div>

<!-- Bottom Navigation -->
<BottomNav currentRoute="/dashboard" />

<style>
	.font-serif {
		font-family: 'Playfair Display', Georgia, serif;
	}
</style>
