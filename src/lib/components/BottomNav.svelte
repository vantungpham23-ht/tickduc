<script lang="ts">
	import { currentTheme } from '$lib/stores/theme';

	interface Props {
		currentRoute?: string;
	}

	let { currentRoute = '/' }: Props = $props();

	const navItems = [
		{ route: '/dashboard', label: 'Trang chủ' },
		{ route: '/leaderboard', label: 'Đạo hạnh' },
		{ route: '/profile', label: 'Cá nhân' },
	];
</script>

<nav class="fixed bottom-0 left-0 right-0 z-50 pb-0">
	<!-- Gradient fade from page to nav -->
	<div class="absolute -top-12 left-0 right-0 h-12 pointer-events-none" style="background: linear-gradient(to top, {$currentTheme.bgPrimary}, transparent);"></div>

	<div
		class="relative backdrop-blur-xl border-t px-4 pt-2 pb-6"
		style="background: rgba(255, 255, 255, 0.92); border-color: #E8E5E2;"
	>
		<div class="flex items-center justify-around max-w-md mx-auto">
			{#each navItems as item}
				{@const isActive = currentRoute === item.route}
				<a
					href={item.route}
					class="flex flex-col items-center py-1.5 px-4 min-w-[72px] transition-all duration-200"
				>
					<!-- Active indicator -->
					<div
						class="h-1 w-1 rounded-full mb-1 transition-all duration-200"
						style="background: {isActive ? $currentTheme.primary : 'transparent'};"
					></div>

					<div
						class="w-11 h-11 rounded-xl flex items-center justify-center mb-0.5 transition-all duration-200"
						style="background: {isActive ? $currentTheme.primary + '12' : 'transparent'};"
					>
						{#if item.route === '/dashboard'}
							<svg
								class="w-6 h-6 transition-all duration-200"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="1.5"
								stroke-linecap="round"
								stroke-linejoin="round"
								style="color: {isActive ? $currentTheme.primary : $currentTheme.textMuted};"
							>
								<path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
								<polyline points="9 22 9 12 15 12 15 22"/>
							</svg>
						{:else if item.route === '/leaderboard'}
							<svg
								class="w-6 h-6 transition-all duration-200"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="1.5"
								stroke-linecap="round"
								stroke-linejoin="round"
								style="color: {isActive ? $currentTheme.primary : $currentTheme.textMuted};"
							>
								<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
							</svg>
						{:else if item.route === '/profile'}
							<svg
								class="w-6 h-6 transition-all duration-200"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="1.5"
								stroke-linecap="round"
								stroke-linejoin="round"
								style="color: {isActive ? $currentTheme.primary : $currentTheme.textMuted};"
							>
								<path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
								<circle cx="12" cy="7" r="4"/>
							</svg>
						{/if}
					</div>

					<span
						class="text-xs transition-all duration-200"
						style="color: {isActive ? $currentTheme.primary : $currentTheme.textMuted}; font-weight: {isActive ? 500 : 400};"
					>{item.label}</span>
				</a>
			{/each}
		</div>
	</div>
</nav>
