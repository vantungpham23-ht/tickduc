<script lang="ts">
	import { showLevelUpNotification, levelUpAnimationData, dismissLevelUpNotification, currentTheme } from '$lib/stores/theme';
	import { LEVELS } from '$lib/components/levels';
	import { onMount } from 'svelte';

	let particles: Array<{
		id: number;
		x: number;
		y: number;
		size: number;
		color: string;
		duration: number;
		delay: number;
	}> = [];

	// Generate celebration particles
	function generateParticles() {
		const newParticles = [];
		const colors = [$currentTheme.primary, $currentTheme.primaryLight, $currentTheme.accent, '#FFD700', '#F5F0E8'];

		for (let i = 0; i < 50; i++) {
			newParticles.push({
				id: i,
				x: Math.random() * 100,
				y: -10 - Math.random() * 20,
				size: 4 + Math.random() * 8,
				color: colors[Math.floor(Math.random() * colors.length)],
				duration: 2 + Math.random() * 2,
				delay: Math.random() * 2
			});
		}
		particles = newParticles;
	}

	// Get level name
	function getLevelName(level: number): string {
		return LEVELS.find(l => l.level === level)?.name || '';
	}

	// Watch for notification show
	$effect(() => {
		if ($showLevelUpNotification) {
			generateParticles();
		}
	});

	let progress = $state(0);

	// Progress animation
	$effect(() => {
		if ($showLevelUpNotification) {
			progress = 0;
			const interval = setInterval(() => {
				progress += 2;
				if (progress >= 100) {
					clearInterval(interval);
				}
			}, 120);
			return () => clearInterval(interval);
		}
	});
</script>

{#if $showLevelUpNotification}
	<!-- Backdrop -->
	<div
		class="fixed inset-0 z-[9999] flex items-center justify-center p-4"
		role="dialog"
		aria-modal="true"
	>
		<!-- Semi-transparent overlay -->
		<button
			class="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-default"
			onclick={dismissLevelUpNotification}
			aria-label="Close notification"
		></button>

		<!-- Celebration particles -->
		{#each particles as particle (particle.id)}
			<div
				class="absolute pointer-events-none celebration-particle"
				style="
					left: {particle.x}%;
					top: {particle.y}%;
					width: {particle.size}px;
					height: {particle.size}px;
					background: {particle.color};
					animation-duration: {particle.duration}s;
					animation-delay: {particle.delay}s;
					box-shadow: 0 0 {particle.size * 2}px {particle.color};
				"
			></div>
		{/each}

		<!-- Notification card -->
		<div
			class="relative w-full max-w-sm rounded-3xl p-8 text-center overflow-hidden"
			style="
				background: linear-gradient(145deg,
					{$currentTheme.bgCard} 0%,
					{$currentTheme.bgSurface} 50%,
					{$currentTheme.bgElevated} 100%
				);
				border: 2px solid {$currentTheme.primary}60;
				box-shadow:
					0 0 40px {$currentTheme.glow},
					0 25px 50px -12px rgba(0, 0, 0, 0.5),
					inset 0 1px 0 {$currentTheme.primaryLight}30;
			"
		>
			<!-- Glow effect behind icon -->
			<div
				class="absolute top-6 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full blur-3xl opacity-50"
				style="background: {$currentTheme.primary};"
			></div>

			<!-- Level up icon -->
			<div class="relative mb-6">
				<div
					class="w-24 h-24 mx-auto rounded-full flex items-center justify-center animate-breathe"
					style="
						background: linear-gradient(145deg,
							{$currentTheme.primary} 0%,
							{$currentTheme.primaryDark} 100%
						);
						box-shadow:
							0 0 30px {$currentTheme.glow},
							inset 0 2px 4px {$currentTheme.primaryLight}40;
					"
				>
					<svg
						class="w-12 h-12 text-white drop-shadow-lg"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="1.5"
					>
						<path
							d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
							fill={$currentTheme.primaryLight}
							stroke={$currentTheme.primaryLight}
						/>
					</svg>
				</div>

				<!-- Radiating rings -->
				<div
					class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border border {$currentTheme.primary}30"
					style="animation: pulse-ring 2s ease-out infinite;"
				></div>
				<div
					class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full border border {$currentTheme.primary}20"
					style="animation: pulse-ring 2s ease-out infinite 0.5s;"
				></div>
			</div>

			<!-- Title -->
			<h2
				class="text-2xl font-serif font-semibold mb-2 tracking-wide"
				style="color: {$currentTheme.primaryLight};"
			>
				Chúc Mừng!
			</h2>

			<!-- Level transition -->
			<div class="mb-4">
				<p class="text-lg opacity-70 mb-1" style="color: {$currentTheme.textSecondary};">
					Bạn đã thăng cấp
				</p>
				<div class="flex items-center justify-center gap-3">
					<span
						class="text-lg font-medium px-3 py-1 rounded-full"
						style="
							background: {$currentTheme.bgDeep};
							color: {$currentTheme.textMuted};
						"
					>
						{getLevelName($levelUpAnimationData.fromLevel)}
					</span>
					<svg class="w-5 h-5 opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M5 12h14M12 5l7 7-7 7" stroke={$currentTheme.primaryLight}/>
					</svg>
					<span
						class="text-xl font-semibold px-3 py-1 rounded-full"
						style="
							background: linear-gradient(145deg, {$currentTheme.primary}40, {$currentTheme.primaryLight}20);
							color: {$currentTheme.primaryLight};
							border: 1px solid {$currentTheme.primary}60;
						"
					>
						{getLevelName($levelUpAnimationData.toLevel)}
					</span>
				</div>
			</div>

			<!-- Level number -->
			<div class="mb-6">
				<span
					class="text-6xl font-serif font-bold"
					style="
						background: linear-gradient(180deg, {$currentTheme.primaryLight} 0%, {$currentTheme.primary} 100%);
						-webkit-background-clip: text;
						-webkit-text-fill-color: transparent;
						background-clip: text;
					"
				>
					Cấp {$levelUpAnimationData.toLevel}
				</span>
			</div>

			<!-- Description -->
			<p
				class="text-sm opacity-80 mb-6"
				style="color: {$currentTheme.textMuted};"
			>
				{LEVELS.find(l => l.level === $levelUpAnimationData.toLevel)?.description || ''}
			</p>

			<!-- Progress bar -->
			<div
				class="h-1 rounded-full overflow-hidden mb-2"
				style="background: {$currentTheme.bgDeep};"
			>
				<div
					class="h-full rounded-full transition-all duration-100"
					style="
						width: {progress}%;
						background: linear-gradient(90deg, {$currentTheme.primary}, {$currentTheme.primaryLight});
						box-shadow: 0 0 10px {$currentTheme.glow};
					"
				></div>
			</div>

			<p class="text-xs opacity-50" style="color: {$currentTheme.textMuted};">
				Thông báo sẽ đóng sau
			</p>
		</div>
	</div>
{/if}

<style>
	@keyframes pulse-ring {
		0% {
			transform: translate(-50%, -50%) scale(0.8);
			opacity: 0.6;
		}
		100% {
			transform: translate(-50%, -50%) scale(1.5);
			opacity: 0;
		}
	}

	.celebration-particle {
		animation: celebration-fall linear forwards;
		border-radius: 50%;
	}

	@keyframes celebration-fall {
		0% {
			transform: translateY(0) rotate(0deg);
			opacity: 1;
		}
		100% {
			transform: translateY(100vh) rotate(720deg);
			opacity: 0;
		}
	}
</style>
