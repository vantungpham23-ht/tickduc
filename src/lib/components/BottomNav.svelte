<script lang="ts">
	import { Home, Wind, Award, User } from 'lucide-svelte';

	interface Props {
		currentRoute: string;
	}

	let { currentRoute }: Props = $props();

	const navItems = [
		{ route: '/dashboard', icon: Home, label: 'Trang chủ' },
		{ route: '/meditate', icon: Wind, label: 'Thiền' },
		{ route: '/leaderboard', icon: Award, label: 'Đạo hạnh' },
		{ route: '/profile', icon: User, label: 'Cá nhân' },
	];
</script>

<nav class="fixed bottom-0 left-0 right-0 bg-zen-cream/95 backdrop-blur-lg border-t border-zen-linen px-4 py-2 pb-5 z-50">
	<div class="flex items-center justify-around max-w-md mx-auto">
		{#each navItems as item}
			{@const isActive = currentRoute === item.route}
			<a
				href={item.route}
				class="flex flex-col items-center py-1 px-3 min-w-[65px] transition-all duration-300"
			>
				<div 
					class="w-11 h-11 rounded-2xl flex items-center justify-center mb-1 transition-all duration-300 {isActive ? 'bg-zen-gold/15 shadow-sm' : 'bg-transparent'}"
				>
					<item.icon 
						class="w-5 h-5 transition-all duration-300 {isActive ? 'text-zen-brown-deep scale-110' : 'text-zen-brown-warm/50'}" 
						strokeWidth={1.5} 
					/>
				</div>
				<span class="text-[11px] transition-all duration-300 {isActive ? 'text-zen-brown-deep font-medium' : 'text-zen-brown-warm/50'}">{item.label}</span>
				
				{#if isActive}
					<div class="w-1 h-1 rounded-full bg-zen-gold mt-1 animate-breathe-subtle"></div>
				{/if}
			</a>
		{/each}
	</div>
</nav>
