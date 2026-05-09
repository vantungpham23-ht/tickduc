<script lang="ts">
	import Level1 from './levels/Level1.svelte';
	import Level2 from './levels/Level2.svelte';
	import Level3 from './levels/Level3.svelte';
	import Level4 from './levels/Level4.svelte';
	import Level5 from './levels/Level5.svelte';

	interface Props {
		level: number;
		size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
		showGlow?: boolean;
		class?: string;
	}

	let { level, size = 'md', showGlow = true, class: className = '' }: Props = $props();

	const sizeClasses = {
		sm: 'w-8 h-8',
		md: 'w-12 h-12',
		lg: 'w-16 h-16',
		xl: 'w-24 h-24',
		'2xl': 'w-32 h-32'
	};

	const glowSizes = {
		sm: 'w-16 h-16',
		md: 'w-20 h-20',
		lg: 'w-28 h-28',
		xl: 'w-40 h-40',
		'2xl': 'w-56 h-56'
	};
</script>

<div class="relative inline-flex items-center justify-center {className}">
	<!-- Glow effect -->
	{#if showGlow}
		<div
			class="absolute {glowSizes[size]} rounded-full bg-gradient-to-br from-[#C5A059]/20 to-[#C9B896]/10 blur-xl animate-pulse-slow"
			class:opacity-100={level >= 4}
			class:opacity-60={level >= 2 && level < 4}
			class:opacity-30={level < 2}
		></div>
	{/if}

	<!-- Level SVG -->
	<div class="relative z-10 {sizeClasses[size]}">
		{#if level >= 5}
			<Level5 />
		{:else if level >= 4}
			<Level4 />
		{:else if level >= 3}
			<Level3 />
		{:else if level >= 2}
			<Level2 />
		{:else}
			<Level1 />
		{/if}
	</div>
</div>

<style>
	@keyframes pulse-slow {
		0%, 100% {
			transform: scale(1);
			opacity: inherit;
		}
		50% {
			transform: scale(1.05);
		}
	}

	.animate-pulse-slow {
		animation: pulse-slow 4s ease-in-out infinite;
	}
</style>
