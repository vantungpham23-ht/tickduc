<script lang="ts">
	import { onMount } from 'svelte';
	import BottomNav from '$lib/components/BottomNav.svelte';
	import { supabase } from '$lib/supabase';
	import { currentTheme } from '$lib/stores/theme';

	interface LeaderboardUser { rank: number; id: string; name: string; dharmaName: string; meritPoints: number; streak: number; avatar: string; avatarColor: string; }

	const avatarColors: Record<string, string> = {
		lotus: 'lotus', sun: 'sun', moon: 'moon',
		star: 'star', leaf: 'leaf', flame: 'flame',
	};

	let leaderboard = $state<LeaderboardUser[]>([]);
	let currentUserRank = $state<number | null>(null);
	let isLoading = $state(true);
	let currentUser = $state<LeaderboardUser | null>(null);

	function getAvatarSvg(avatarId: string, size: 'sm' | 'md' | 'lg' = 'md') {
		const sizes: Record<string, string> = { sm: 'w-4 h-4', md: 'w-5 h-5', lg: 'w-8 h-8' };
		const s = sizes[size];
		switch (avatarId) {
			case 'lotus': return `<svg class="${s}" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5"><ellipse cx="24" cy="42" rx="5" ry="2.5"/><path d="M24 38 C24 38 19 32 19 26 C19 20 24 14 24 14 C24 14 29 20 29 26 C29 32 24 38 24 38"/></svg>`;
			case 'sun': return `<svg class="${s}" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="24" cy="24" r="8"/><path d="M24 8v6M24 34v6M8 24h6M34 24h6"/></svg>`;
			case 'moon': return `<svg class="${s}" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M36 24c0-8.284-5.716-15-13-15-1.126 0-2.218.14-3.26.4C25.1 11.2 29 16 29 21.5c0 5.5-3.9 10.3-9.26 12.1 1.04.26 2.13.4 3.26.4 7.284 0 13-6.716 13-15z"/></svg>`;
			case 'star': return `<svg class="${s}" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M24 8l4.9 10 11 1.6-8 7.8 1.9 11-9.8-5.2-9.8 5.2 1.9-11-8-7.8 11-1.6z"/></svg>`;
			case 'leaf': return `<svg class="${s}" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 36 C12 24 20 12 36 12 C36 12 36 36 24 36 C18 36 12 36 12 36"/></svg>`;
			case 'flame': return `<svg class="${s}" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M24 44 C16 36 12 28 12 22 C12 14 18 8 24 8 C24 8 24 14 28 14 C32 14 36 18 36 24 C36 28 34 32 32 34 C30 36 26 38 24 44"/></svg>`;
			default: return `<svg class="${s}" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5"><ellipse cx="24" cy="42" rx="5" ry="2.5"/><path d="M24 38 C24 38 19 32 19 26 C19 20 24 14 24 14 C24 14 29 20 29 26 C29 32 24 38 24 38"/></svg>`;
		}
	}

	async function fetchLeaderboard() {
		try {
			const { data } = await supabase.from('profiles').select('*').order('total_merits', { ascending: false }).limit(50);
			if (data && data.length > 0) {
				leaderboard = data.map((user, index) => ({
					rank: index + 1, id: user.id, name: user.email?.split('@')[0] || 'User',
					dharmaName: user.dharma_name || 'Tân Viên', meritPoints: user.total_merits || 0,
					streak: user.current_streak || 0, avatar: user.avatar_emoji || 'lotus',
					avatarColor: avatarColors[user.avatar_emoji] || 'lotus'
				}));
			}
		} catch (error) { console.error('Error:', error); }
		finally { isLoading = false; }
	}

	async function fetchCurrentUserRank() {
		try {
			const { data: { user } } = await supabase.auth.getUser();
			if (!user) return;
			const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
			if (data) {
				currentUser = {
					rank: 0, id: user.id, name: user.email?.split('@')[0] || 'User',
					dharmaName: data.dharma_name || 'Tân Viên', meritPoints: data.total_merits || 0,
					streak: data.current_streak || 0, avatar: data.avatar_emoji || 'lotus',
					avatarColor: avatarColors[data.avatar_emoji] || 'lotus'
				};
				currentUserRank = leaderboard.findIndex(u => u.id === user.id) + 1;
				if (currentUserRank === 0) currentUserRank = null;
			}
		} catch (error) { /* not logged in */ }
	}

	onMount(() => { fetchLeaderboard().then(() => fetchCurrentUserRank()); });
</script>

<div class="min-h-screen pb-24 relative overflow-hidden">
	<div class="fixed inset-0 overflow-hidden pointer-events-none">
		<div class="absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl animate-float-drift" style="background: {$currentTheme.primary}10;"></div>
		<div class="absolute bottom-0 left-0 w-64 h-64 rounded-full blur-3xl animate-float-drift" style="background: {$currentTheme.secondary}08; animation-delay: -4s;"></div>
	</div>

	<header class="relative px-6 pt-8 pb-6 z-10">
		<h1 class="font-serif text-3xl font-light tracking-wide" style="color: {$currentTheme.textPrimary};">Đạo Hạnh</h1>
		<p class="text-sm mt-2 font-light" style="color: {$currentTheme.textMuted};">Hành trình tích đức của con</p>
		{#if currentUserRank}
			<div class="mt-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border" style="background: {$currentTheme.primary}08; border-color: {$currentTheme.primary}15;">
				<div class="w-1.5 h-1.5 rounded-full animate-pulse-soft" style="background: {$currentTheme.primary}60;"></div>
				<span class="text-xs" style="color: {$currentTheme.textMuted};">Hạng của con: <span class="font-medium" style="color: {$currentTheme.primaryLight};">#{currentUserRank}</span></span>
			</div>
		{:else if !isLoading}
			<div class="mt-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border" style="background: {$currentTheme.bgSurface}; border-color: {$currentTheme.primary}08;">
				<span class="text-xs" style="color: {$currentTheme.textMuted}; opacity: 0.4;"><a href="/auth" style="color: {$currentTheme.primary}; opacity: 0.5;">Đăng nhập</a> để ghi danh</span>
			</div>
		{/if}
	</header>

	{#if isLoading}
		<div class="flex items-center justify-center py-20">
			<div class="w-10 h-10 rounded-full animate-spin" style="border: 1px solid {$currentTheme.primary}20; border-top-color: {$currentTheme.primary}60;"></div>
		</div>
	{:else if leaderboard.length === 0}
		<div class="flex flex-col items-center justify-center py-20 px-6 text-center">
			<div class="relative w-32 h-32 mb-8">
				<svg viewBox="0 0 100 100" class="w-full h-full animate-breathe" style="color: {$currentTheme.primary}10;">
					<ellipse cx="50" cy="90" rx="15" ry="6" fill="currentColor"/>
					<path d="M50 75 C50 75 30 55 30 40 C30 25 50 10 50 10 C50 10 70 25 70 40 C70 55 50 75 50 75" fill="currentColor"/>
				</svg>
			</div>
			<h2 class="font-serif text-2xl mb-3" style="color: {$currentTheme.textPrimary};">Chưa có ai ghi danh</h2>
			<p class="text-sm max-w-xs leading-relaxed" style="color: {$currentTheme.textMuted}; opacity: 0.4;">Hãy là người đầu tiên tích lũy công đức trên hành trình này</p>
		</div>
	{:else}
	<div class="px-4 space-y-6 relative z-10">
		{#if leaderboard.length >= 3}
		<div class="relative py-8">
			<div class="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-px" style="background: linear-gradient(to right, transparent, {$currentTheme.primary}20, transparent);"></div>
			<div class="flex items-end justify-center gap-2">
				{#if leaderboard[1]}
				<div class="flex flex-col items-center animate-fade-in-up" style="animation-delay: 300ms;">
					<div class="relative">
						<div class="w-12 h-12 rounded-full border flex items-center justify-center" style="background: {$currentTheme.bgSurface}; border-color: {$currentTheme.primary}10;">
							{@html getAvatarSvg(leaderboard[1].avatar, 'md')}
						</div>
						<div class="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center" style="background: {$currentTheme.bgSecondary}; border: 1px solid {$currentTheme.textMuted}20;">
							<span class="text-[10px]" style="color: {$currentTheme.textMuted};">2</span>
						</div>
					</div>
					<p class="mt-2 text-xs truncate max-w-[64px] text-center" style="color: {$currentTheme.textPrimary}; opacity: 0.7;">{leaderboard[1].dharmaName}</p>
					<p class="text-[10px]" style="color: {$currentTheme.textMuted}; opacity: 0.4;">{leaderboard[1].meritPoints}</p>
					<div class="mt-2 w-16 h-16 rounded-t-xl flex items-center justify-center" style="background: {$currentTheme.bgSurface}; border: 1px solid {$currentTheme.textMuted}05;">
						<svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" style="color: {$currentTheme.textMuted}; opacity: 0.2;"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/></svg>
					</div>
				</div>
				{/if}

				{#if leaderboard[0]}
				<div class="flex flex-col items-center animate-fade-in-up z-10" style="animation-delay: 100ms;">
					<div class="relative -mb-2">
						<svg class="w-6 h-6 animate-gentle-glow" viewBox="0 0 32 32" fill="currentColor" style="color: {$currentTheme.primary}; opacity: 0.4;"><path d="M16 4l3 8h10l-8 6 3 10-8-5-8 5 3-10-8-6h10z"/></svg>
					</div>
					<div class="relative">
						<div class="w-16 h-16 rounded-full border flex items-center justify-center shadow-xl" style="background: {$currentTheme.bgSurface}; border-color: {$currentTheme.primary}15;">
							{@html getAvatarSvg(leaderboard[0].avatar, 'lg')}
						</div>
						<div class="absolute inset-0 rounded-full animate-ping" style="background: {$currentTheme.primary}05; animation-duration: 4s;"></div>
					</div>
					<p class="mt-3 text-sm font-light truncate max-w-[80px] text-center" style="color: {$currentTheme.textPrimary}; opacity: 0.8;">{leaderboard[0].dharmaName}</p>
					<p class="text-xs" style="color: {$currentTheme.primary};">{leaderboard[0].meritPoints}</p>
					<div class="mt-2 w-20 h-24 rounded-t-2xl flex items-center justify-center shadow-lg" style="background: {$currentTheme.bgSurface}; border: 1px solid {$currentTheme.primary}10;">
						<svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" style="color: {$currentTheme.primary}; opacity: 0.3;"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/></svg>
					</div>
				</div>
				{/if}

				{#if leaderboard[2]}
				<div class="flex flex-col items-center animate-fade-in-up" style="animation-delay: 500ms;">
					<div class="relative">
						<div class="w-12 h-12 rounded-full border flex items-center justify-center" style="background: {$currentTheme.bgSurface}; border-color: {$currentTheme.textMuted}10;">
							{@html getAvatarSvg(leaderboard[2].avatar, 'md')}
						</div>
						<div class="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center" style="background: {$currentTheme.bgSecondary}; border: 1px solid {$currentTheme.textMuted}20;">
							<span class="text-[10px]" style="color: {$currentTheme.accent};">3</span>
						</div>
					</div>
					<p class="mt-2 text-xs truncate max-w-[64px] text-center" style="color: {$currentTheme.textPrimary}; opacity: 0.7;">{leaderboard[2].dharmaName}</p>
					<p class="text-[10px]" style="color: {$currentTheme.textMuted}; opacity: 0.4;">{leaderboard[2].meritPoints}</p>
					<div class="mt-2 w-16 h-12 rounded-t-xl flex items-center justify-center" style="background: {$currentTheme.bgSurface}; border: 1px solid {$currentTheme.textMuted}05;">
						<svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" style="color: {$currentTheme.textMuted}; opacity: 0.15;"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/></svg>
					</div>
				</div>
				{/if}
			</div>
			<div class="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-px" style="background: linear-gradient(to right, transparent, {$currentTheme.primary}20, transparent);"></div>
		</div>
		{/if}

		{#if leaderboard.length > 3}
		<div class="rounded-3xl overflow-hidden border" style="background: {$currentTheme.bgSurface}99; border-color: {$currentTheme.primary}08;">
			<div class="px-5 py-4 border-b" style="border-color: {$currentTheme.primary}05;">
				<h2 class="font-serif text-base font-light" style="color: {$currentTheme.textPrimary}; opacity: 0.7;">Danh sách hành giả</h2>
			</div>
			<div class="divide-y" style="border-color: {$currentTheme.primary}05;">
				{#each leaderboard.slice(3) as user, index}
				<div class="flex items-center px-5 py-3.5 transition-colors duration-200" style="background: {currentUser?.id === user.id ? $currentTheme.primary + '08' : 'transparent'};" onmouseenter={(e) => e.currentTarget.style.background = `${$currentTheme.primary}05`} onmouseleave={(e) => e.currentTarget.style.background = currentUser?.id === user.id ? `${$currentTheme.primary}08` : 'transparent'}>
					<div class="w-7 h-7 rounded-full flex items-center justify-center mr-3 flex-shrink-0" style="background: {$currentTheme.bgSecondary}; border: 1px solid {$currentTheme.textMuted}10;">
						<span class="text-[11px]" style="color: {$currentTheme.textMuted}; opacity: 0.5;">{user.rank}</span>
					</div>
					<div class="w-8 h-8 rounded-full border flex items-center justify-center mr-3 flex-shrink-0" style="background: {$currentTheme.bgSurface}; border-color: {$currentTheme.textMuted}05;">
						{@html getAvatarSvg(user.avatar, 'sm')}
					</div>
					<div class="flex-1 min-w-0">
						<p class="text-sm truncate font-light" style="color: {$currentTheme.textPrimary}; opacity: 0.7;">{user.dharmaName}</p>
						<p class="text-[10px] truncate" style="color: {$currentTheme.textMuted}; opacity: 0.3;">{user.name}</p>
					</div>
					<div class="text-right flex-shrink-0">
						<p class="text-sm" style="color: {$currentTheme.primary};">{user.meritPoints}</p>
						<p class="text-[10px]" style="color: {$currentTheme.textMuted}; opacity: 0.3;">{user.streak} ngày</p>
					</div>
				</div>
				{/each}
			</div>
		</div>
		{/if}

		{#if currentUser}
		<div class="rounded-2xl p-4 border" style="background: linear-gradient(to right, {$currentTheme.primary}05, {$currentTheme.primary}03, {$currentTheme.secondary}05); border-color: {$currentTheme.primary}10;">
			<div class="flex items-center gap-3">
				<div class="w-10 h-10 rounded-full border flex items-center justify-center" style="background: {$currentTheme.bgSurface}; border-color: {$currentTheme.primary}15;">
					{@html getAvatarSvg(currentUser.avatar, 'md')}
				</div>
				<div class="flex-1 min-w-0">
					<p class="text-sm" style="color: {$currentTheme.textPrimary}; opacity: 0.7;">Vị trí của con</p>
					<p class="text-xs" style="color: {$currentTheme.textMuted}; opacity: 0.4;">Đạo danh: {currentUser.dharmaName}</p>
				</div>
				<div class="text-right flex-shrink-0">
					<p class="font-serif text-2xl font-light" style="color: {$currentTheme.primary};">#{currentUserRank}</p>
					<p class="text-[10px]" style="color: {$currentTheme.textMuted}; opacity: 0.3;">{currentUser.meritPoints} điểm</p>
				</div>
			</div>
		</div>
		{/if}
	</div>
	{/if}
</div>

<BottomNav currentRoute="/leaderboard" />
