<script lang="ts">
	interface Props {
		currentRoute: string;
	}

	let { currentRoute }: Props = $props();

	const navItems = [
		{ route: '/dashboard', label: 'Trang chủ' },
		{ route: '/leaderboard', label: 'Đạo hạnh' },
		{ route: '/profile', label: 'Cá nhân' },
	];
</script>

<nav class="fixed bottom-0 left-0 right-0 z-50 pb-0">
	<!-- Gradient fade from page to nav -->
	<div class="absolute -top-12 left-0 right-0 h-12 bg-gradient-to-t from-[#1A1814] to-transparent pointer-events-none"></div>

	<div class="relative bg-[#12110E]/90 backdrop-blur-2xl border-t border-[#C5A059]/8 px-4 pt-2 pb-6">
		<div class="flex items-center justify-around max-w-md mx-auto">
			{#each navItems as item}
				{@const isActive = currentRoute === item.route}
				<a
					href={item.route}
					class="flex flex-col items-center py-1.5 px-4 min-w-[72px] transition-all duration-300"
				>
					<!-- Active indicator dot -->
					<div class="h-0.5 w-0.5 rounded-full mb-1 transition-all duration-300 {isActive ? 'bg-[#C5A059]/60 scale-100' : 'bg-transparent scale-0'}"></div>

					<div class="w-10 h-10 rounded-2xl flex items-center justify-center mb-0.5 transition-all duration-300 {isActive ? 'bg-[#C5A059]/10' : 'bg-transparent'}">
						{#if item.route === '/dashboard'}
							<svg class="w-5 h-5 transition-all duration-300 {isActive ? 'text-[#C5A059] scale-110' : 'text-[#8A8070]/40'}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
								<path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
								<polyline points="9 22 9 12 15 12 15 22"/>
							</svg>
						{:else if item.route === '/leaderboard'}
							<svg class="w-5 h-5 transition-all duration-300 {isActive ? 'text-[#C5A059] scale-110' : 'text-[#8A8070]/40'}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
								<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
							</svg>
						{:else if item.route === '/profile'}
							<svg class="w-5 h-5 transition-all duration-300 {isActive ? 'text-[#C5A059] scale-110' : 'text-[#8A8070]/40'}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
								<path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
								<circle cx="12" cy="7" r="4"/>
							</svg>
						{/if}
					</div>

					<span class="text-[10px] tracking-wider transition-all duration-300 {isActive ? 'text-[#C5A059]/80 font-medium' : 'text-[#8A8070]/30 font-light'}">{item.label}</span>
				</a>
			{/each}
		</div>
	</div>
</nav>
