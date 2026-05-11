<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import LevelUpNotification from '$lib/components/LevelUpNotification.svelte';
	import { initializeTheme, currentTheme, applyThemeToCSS, currentLevel } from '$lib/stores/theme';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { getLevelInfo } from '$lib/components/levels';

	let { children } = $props();

	// Page transitions using View Transitions API
	import { onNavigate } from '$app/navigation';

	onNavigate((navigation) => {
		if (!document.startViewTransition) return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});

	// Initialize theme on mount
	onMount(async () => {
		// First set default theme
		initializeTheme(1);

		// Then try to get user level from localStorage or session
		try {
			const isGuest = localStorage.getItem('isGuest') === 'true';
			if (isGuest) {
				const meritPoints = parseInt(localStorage.getItem('guestMerit') || '0');
				const level = getLevelInfo(meritPoints).level;
				initializeTheme(level);
			}
		} catch (e) {
			console.log('Could not load user theme');
		}
	});

	// Apply theme whenever it changes
	$effect(() => {
		if (browser && $currentTheme) {
			applyThemeToCSS($currentTheme);
		}
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} type="image/svg+xml" />
	<title>Tich Cong Duc</title>
	<meta name="description" content="Ung dung tich luy cong duc" />
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
</svelte:head>

<!-- Level-up notification overlay -->
<LevelUpNotification />

<div class="min-h-screen" style="background-color: var(--color-bg-primary);">
	{@render children()}
</div>

<style>
	:global(html) {
		scroll-behavior: smooth;
	}

	:global(body) {
		font-family: 'Inter', system-ui, sans-serif;
		background-color: #F9F8F6;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}

	/* View Transition Animations */
	:global(::view-transition-old(root)),
	:global(::view-transition-new(root)) {
		animation-duration: 0.3s;
		animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
	}

	:global(::view-transition-old(root)) {
		animation-name: zen-slide-out;
	}

	:global(::view-transition-new(root)) {
		animation-name: zen-slide-in;
	}

	@keyframes zen-slide-out {
		from {
			opacity: 1;
			transform: translateX(0);
		}
		to {
			opacity: 0;
			transform: translateX(-10px);
		}
	}

	@keyframes zen-slide-in {
		from {
			opacity: 0;
			transform: translateX(10px);
		}
		to {
			opacity: 1;
			transform: translateX(0);
		}
	}
</style>
