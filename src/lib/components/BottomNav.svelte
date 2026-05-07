<script lang="ts">
	import { Home, User, Trophy } from 'lucide-svelte';
	import { page } from '$app/state';

	interface Props {
		currentRoute: string;
	}

	let { currentRoute }: Props = $props();

	const navItems = [
		{ route: '/dashboard', icon: Home, label: 'Trang chủ' },
		{ route: '/leaderboard', icon: Trophy, label: 'Xếp hạng' },
		{ route: '/profile', icon: User, label: 'Cá nhân' },
	];
</script>

<nav class="fixed bottom-0 left-0 right-0 bg-zen-white border-t border-zen-brown/10 px-4 py-2 z-50 safe-area-bottom">
	<div class="max-w-lg mx-auto">
		<div class="flex items-center justify-around">
			{#each navItems as item}
				{@const isActive = currentRoute === item.route}
				<a
					href={item.route}
					class="flex flex-col items-center py-2 px-4 rounded-xl transition-all duration-300 {isActive ? 'text-zen-gold' : 'text-zen-brown/40 hover:text-zen-brown/60'}"
				>
					<div class="relative">
						<item.icon class="w-6 h-6 transition-transform duration-300 {isActive ? 'scale-110' : ''}" />
						{#if isActive}
							<div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-zen-gold"></div>
						{/if}
					</div>
					<span class="text-xs mt-1 font-medium">{item.label}</span>
				</a>
			{/each}
		</div>
	</div>
</nav>

<style>
	.safe-area-bottom {
		padding-bottom: max(0.5rem, env(safe-area-inset-bottom));
	}
</style>
