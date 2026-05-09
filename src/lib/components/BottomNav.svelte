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

<nav class="fixed bottom-0 left-0 right-0 bg-[#F7F3F0]/95 backdrop-blur-md border-t border-[#E8E0D8] px-4 py-2 pb-6 z-50">
	<div class="flex items-center justify-around max-w-md mx-auto">
		{#each navItems as item}
			{@const isActive = currentRoute === item.route}
			<a
				href={item.route}
				class="flex flex-col items-center py-2 px-5 min-w-[80px] transition-all duration-300"
			>
				<div 
					class="w-11 h-11 rounded-2xl flex items-center justify-center mb-1 transition-all duration-300 {isActive ? 'bg-[#C5A059]/15' : 'bg-transparent'}"
				>
					{#if item.route === '/dashboard'}
						<svg class="w-5 h-5 transition-all duration-300 {isActive ? 'text-[#3D3028] scale-110' : 'text-[#3D3028]/40'}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
							<path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
							<polyline points="9 22 9 12 15 12 15 22"/>
						</svg>
					{:else if item.route === '/leaderboard'}
						<svg class="w-5 h-5 transition-all duration-300 {isActive ? 'text-[#3D3028] scale-110' : 'text-[#3D3028]/40'}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
							<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
						</svg>
					{:else if item.route === '/profile'}
						<svg class="w-5 h-5 transition-all duration-300 {isActive ? 'text-[#3D3028] scale-110' : 'text-[#3D3028]/40'}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
							<path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
							<circle cx="12" cy="7" r="4"/>
						</svg>
					{/if}
				</div>
				<span class="text-[11px] tracking-wide transition-all duration-300 {isActive ? 'text-[#3D3028] font-medium' : 'text-[#3D3028]/40'}">{item.label}</span>
				
				{#if isActive}
					<div class="w-1 h-1 rounded-full bg-[#C5A059] mt-1"></div>
				{/if}
			</a>
		{/each}
	</div>
</nav>
