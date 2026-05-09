<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount, onDestroy } from 'svelte';

	interface Petal {
		id: number;
		x: number;
		size: number;
		delay: number;
		duration: number;
		rotation: number;
		type: 'lotus' | 'leaf';
	}

	interface Suggestion {
		title: string;
		description: string;
		action: string;
		link: string;
		timeRange: string;
		icon: 'lotus' | 'dharma' | 'pray';
	}

	// Quiet luxury SVG icons
	const SeasonIcons = {
		spring: `<svg viewBox="0 0 48 48" class="w-full h-full"><defs><linearGradient id="spring" x1="0%" y1="100%" x2="0%" y2="0%"><stop offset="0%" stop-color="#C9B896" stop-opacity="0.9"/><stop offset="100%" stop-color="#E8DCC8"/></linearGradient></defs><ellipse cx="24" cy="28" rx="10" ry="16" fill="url(#spring)" transform="rotate(0 24 32)"/><ellipse cx="24" cy="28" rx="10" ry="16" fill="url(#spring)" transform="rotate(60 24 32)" opacity="0.85"/><ellipse cx="24" cy="28" rx="10" ry="16" fill="url(#spring)" transform="rotate(120 24 32)" opacity="0.7"/><ellipse cx="24" cy="30" rx="7" ry="12" fill="#E8DCC8" transform="rotate(30 24 32)" opacity="0.8"/><ellipse cx="24" cy="30" rx="7" ry="12" fill="#E8DCC8" transform="rotate(90 24 32)" opacity="0.75"/><ellipse cx="24" cy="30" rx="7" ry="12" fill="#E8DCC8" transform="rotate(150 24 32)" opacity="0.7"/><circle cx="24" cy="32" r="5" fill="#C9B896"/></svg>`,
		summer: `<svg viewBox="0 0 48 48" class="w-full h-full"><defs><radialGradient id="sun" cx="50%" cy="50%"><stop offset="0%" stop-color="#E8D4A8"/><stop offset="100%" stop-color="#C9A96E"/></radialGradient></defs><circle cx="24" cy="24" r="10" fill="url(#sun)"/><g stroke="#C9A96E" stroke-width="2" stroke-linecap="round" opacity="0.7"><line x1="24" y1="6" x2="24" y2="10"/><line x1="24" y1="38" x2="24" y2="42"/><line x1="6" y1="24" x2="10" y2="24"/><line x1="38" y1="24" x2="42" y2="24"/><line x1="11" y1="11" x2="14" y2="14"/><line x1="34" y1="34" x2="37" y2="37"/><line x1="11" y1="37" x2="14" y2="34"/><line x1="34" y1="14" x2="37" y2="11"/></g></svg>`,
		autumn: `<svg viewBox="0 0 48 48" class="w-full h-full"><defs><linearGradient id="leaf" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#C9B896"/><stop offset="100%" stop-color="#A69070"/></linearGradient></defs><path d="M24 6 C38 18 42 32 34 42 C26 48 14 44 8 32 C2 20 10 6 24 6" fill="url(#leaf)"/><path d="M24 12 C24 28 24 38 24 42" stroke="#8B7355" stroke-width="1.5" fill="none" opacity="0.5"/><path d="M24 20 C20 22 16 24 14 28" stroke="#8B7355" stroke-width="1" fill="none" opacity="0.4"/><path d="M24 26 C28 28 32 28 34 30" stroke="#8B7355" stroke-width="1" fill="none" opacity="0.4"/></svg>`,
		winter: `<svg viewBox="0 0 48 48" class="w-full h-full"><defs><linearGradient id="snow" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#E8E0D5"/><stop offset="100%" stop-color="#C9B896"/></linearGradient></defs><line x1="24" y1="8" x2="24" y2="40" stroke="#C9A96E" stroke-width="2" stroke-linecap="round"/><line x1="8" y1="24" x2="40" y2="24" stroke="#C9A96E" stroke-width="2" stroke-linecap="round"/><line x1="12" y1="12" x2="36" y2="36" stroke="#C9A96E" stroke-width="1.5" stroke-linecap="round" opacity="0.6"/><line x1="36" y1="12" x2="12" y2="36" stroke="#C9A96E" stroke-width="1.5" stroke-linecap="round" opacity="0.6"/><circle cx="24" cy="24" r="4" fill="url(#snow)"/><circle cx="24" cy="10" r="1.5" fill="#C9A96E" opacity="0.7"/><circle cx="24" cy="38" r="1.5" fill="#C9A96E" opacity="0.7"/><circle cx="10" cy="24" r="1.5" fill="#C9A96E" opacity="0.7"/><circle cx="38" cy="24" r="1.5" fill="#C9A96E" opacity="0.7"/></svg>`
	};

	let petals: Petal[] = [];
	let mounted = $state(false);
	let currentTime = $state(new Date());
	let intervalId: ReturnType<typeof setInterval>;

	// Get current season
	function getSeason(): { name: string; icon: string; color: string } {
		const month = currentTime.getMonth() + 1;
		if (month >= 3 && month <= 5) return { name: 'Xuan', icon: SeasonIcons.spring, color: '#9CAF88' };
		if (month >= 6 && month <= 8) return { name: 'Ha', icon: SeasonIcons.summer, color: '#C5A059' };
		if (month >= 9 && month <= 11) return { name: 'Thu', icon: SeasonIcons.autumn, color: '#C4A89C' };
		return { name: 'Dong', icon: SeasonIcons.winter, color: '#A8B5C0' };
	}

	// Get time-based suggestion
	function getSuggestion(): Suggestion {
		const hour = currentTime.getHours();

		if (hour >= 5 && hour < 9) {
			return {
				title: 'Thien sang',
				description: 'Buoi sang tinh lang la thoi gian tuyet voi de thien dinh.',
				action: 'Bat dau thien',
				link: '/meditate',
				timeRange: '5:00 - 9:00',
				icon: 'lotus'
			};
		} else if (hour >= 9 && hour < 12) {
			return {
				title: 'Hanh dao',
				description: 'Buoi sang la luc tinh thanh tiet tac nhat.',
				action: 'Hanh dao ngay',
				link: '/praying',
				timeRange: '9:00 - 12:00',
				icon: 'dharma'
			};
		} else if (hour >= 12 && hour < 15) {
			return {
				title: 'Nghi trua',
				description: 'Giua trua, hay danh vai phut yen lang.',
				action: 'Thien ngan',
				link: '/meditate',
				timeRange: '12:00 - 15:00',
				icon: 'lotus'
			};
		} else if (hour >= 15 && hour < 18) {
			return {
				title: 'Go mo',
				description: 'Chieu muon la thoi gian thich hop de go mo.',
				action: 'Go mo tich duc',
				link: '/mokugyo',
				timeRange: '15:00 - 18:00',
				icon: 'pray'
			};
		} else if (hour >= 18 && hour < 21) {
			return {
				title: 'Toi tung kinh',
				description: 'Buoi toi la luc tam hon can su binh yen.',
				action: 'Bat dau toi nay',
				link: '/praying',
				timeRange: '18:00 - 21:00',
				icon: 'dharma'
			};
		} else {
			return {
				title: 'An tam nghi ngoi',
				description: 'Da muon roi. Hay de tam an va nghi ngoi.',
				action: 'Xem hanh trinh',
				link: '/dashboard',
				timeRange: '21:00 - 5:00',
				icon: 'lotus'
			};
		}
	}

	function createPetals() {
		const count = 15;
		petals = Array.from({ length: count }, (_, i) => ({
			id: i,
			x: Math.random() * 100,
			size: 12 + Math.random() * 16,
			delay: Math.random() * 8,
			duration: 8 + Math.random() * 6,
			rotation: Math.random() * 360,
			type: Math.random() > 0.5 ? 'lotus' : 'leaf'
		}));
	}

	onMount(() => {
		createPetals();
		mounted = true;
		intervalId = setInterval(() => {
			currentTime = new Date();
		}, 60000);
	});

	onDestroy(() => {
		if (intervalId) clearInterval(intervalId);
	});

	let suggestion = $derived(getSuggestion());
	let season = $derived(getSeason());
	let formattedTime = $derived(currentTime.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }));
</script>

<div class="min-h-screen bg-[#F7F3F0] flex flex-col overflow-hidden">
	<!-- Falling Petals Animation -->
	<div class="fixed inset-0 pointer-events-none overflow-hidden z-0">
		{#each petals as petal (petal.id)}
			<div
				class="absolute text-[#C9B896]/30"
				style="
					left: {petal.x}%;
					top: -60px;
					width: {petal.size}px;
					height: {petal.size}px;
					animation: fall {petal.duration}s linear {petal.delay}s infinite;
				"
			>
				{#if petal.type === 'lotus'}
					<svg viewBox="0 0 48 48" class="w-full h-full">
						<ellipse cx="24" cy="24" rx="8" ry="14" fill="currentColor" opacity="0.6" transform="rotate(0 24 24)"/>
						<ellipse cx="24" cy="24" rx="8" ry="14" fill="currentColor" opacity="0.4" transform="rotate(60 24 24)"/>
						<ellipse cx="24" cy="24" rx="8" ry="14" fill="currentColor" opacity="0.3" transform="rotate(120 24 24)"/>
					</svg>
				{:else}
					<svg viewBox="0 0 48 48" class="w-full h-full">
						<path d="M24 4 C36 16, 40 32, 32 44 C24 48, 12 44, 8 32 C4 20, 12 4, 24 4" fill="currentColor" opacity="0.5"/>
					</svg>
				{/if}
			</div>
		{/each}
	</div>

	<!-- Main Content -->
	<main class="flex-1 flex flex-col items-center justify-center px-6 py-8 relative z-10">
		<!-- Season & Time Badge -->
		<div class="mb-6 text-center">
			<div class="inline-flex items-center gap-3 px-4 py-2 bg-[#F2EDE6]/80 rounded-full backdrop-blur-sm">
				<div class="w-8 h-8" style="color: {season.color};">
					{@html season.icon}
				</div>
				<span class="text-[#7A6B5A] text-sm font-medium">Mua {season.name}</span>
				<span class="text-[#3D3028]/20">|</span>
				<span class="text-[#C5A059] text-sm font-light">{formattedTime}</span>
			</div>
		</div>

		<!-- Hero Section -->
		<div class="flex flex-col items-center text-center">
			<!-- Animated Lotus Logo -->
			<div class="mb-8">
				<svg class="w-20 h-20 text-[#C5A059] animate-breathe" viewBox="0 0 80 80" fill="none">
					<defs>
						<linearGradient id="lotusGrad" x1="0%" y1="100%" x2="0%" y2="0%">
							<stop offset="0%" stop-color="#C9B896" stop-opacity="0.8"/>
							<stop offset="100%" stop-color="#E8DCC8" stop-opacity="1"/>
						</linearGradient>
					</defs>
					<!-- Outer petals -->
					<ellipse cx="40" cy="25" rx="8" ry="18" fill="url(#lotusGrad)" transform="rotate(0 40 50)"/>
					<ellipse cx="40" cy="25" rx="8" ry="18" fill="url(#lotusGrad)" transform="rotate(60 40 50)"/>
					<ellipse cx="40" cy="25" rx="8" ry="18" fill="url(#lotusGrad)" transform="rotate(120 40 50)"/>
					<ellipse cx="40" cy="25" rx="8" ry="18" fill="url(#lotusGrad)" transform="rotate(180 40 50)"/>
					<ellipse cx="40" cy="25" rx="8" ry="18" fill="url(#lotusGrad)" transform="rotate(240 40 50)"/>
					<ellipse cx="40" cy="25" rx="8" ry="18" fill="url(#lotusGrad)" transform="rotate(300 40 50)"/>
					<!-- Inner petals -->
					<ellipse cx="40" cy="30" rx="6" ry="14" fill="url(#lotusGrad)" opacity="0.9" transform="rotate(30 40 50)"/>
					<ellipse cx="40" cy="30" rx="6" ry="14" fill="url(#lotusGrad)" opacity="0.9" transform="rotate(90 40 50)"/>
					<ellipse cx="40" cy="30" rx="6" ry="14" fill="url(#lotusGrad)" opacity="0.9" transform="rotate(150 40 50)"/>
					<ellipse cx="40" cy="30" rx="6" ry="14" fill="url(#lotusGrad)" opacity="0.9" transform="rotate(210 40 50)"/>
					<ellipse cx="40" cy="30" rx="6" ry="14" fill="url(#lotusGrad)" opacity="0.9" transform="rotate(270 40 50)"/>
					<ellipse cx="40" cy="30" rx="6" ry="14" fill="url(#lotusGrad)" opacity="0.9" transform="rotate(330 40 50)"/>
					<!-- Center -->
					<circle cx="40" cy="50" r="6" fill="#C9B896"/>
				</svg>
			</div>

			<!-- Title -->
			<h1 class="font-serif text-4xl md:text-5xl font-light text-[#3D3028] mb-3 tracking-wide">
				Tich Cong Duc
			</h1>

			<!-- Subtitle -->
			<p class="text-[#3D3028]/50 text-base font-light tracking-wide">
				Nuoi duong tam hon an lac
			</p>
		</div>

		<!-- Time-based Suggestion Card -->
		<div class="mt-8 w-full max-w-md">
			<div class="bg-[#F2EDE6]/90 backdrop-blur-sm rounded-3xl p-5 shadow-sm border border-[#E8E0D5]">
				<div class="flex items-start gap-4">
					<div class="w-12 h-12 rounded-xl bg-[#C5A059]/10 flex items-center justify-center flex-shrink-0">
						{#if suggestion.icon === 'lotus'}
							<svg class="w-6 h-6 text-[#C5A059]" viewBox="0 0 48 48" fill="none">
								<ellipse cx="24" cy="28" rx="8" ry="14" fill="currentColor" opacity="0.6" transform="rotate(0 24 32)"/>
								<ellipse cx="24" cy="28" rx="8" ry="14" fill="currentColor" opacity="0.5" transform="rotate(60 24 32)"/>
								<ellipse cx="24" cy="28" rx="8" ry="14" fill="currentColor" opacity="0.4" transform="rotate(120 24 32)"/>
								<circle cx="24" cy="32" r="4" fill="currentColor" opacity="0.7"/>
							</svg>
						{:else if suggestion.icon === 'dharma'}
							<svg class="w-6 h-6 text-[#C5A059]" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5">
								<circle cx="24" cy="24" r="8"/>
								<circle cx="24" cy="24" r="3" fill="currentColor"/>
								<path d="M24 8v6M24 34v6M8 24h6M34 24h6M12 12l4 4M32 32l4 4M12 36l4-4M32 16l4-4"/>
							</svg>
						{:else}
							<svg class="w-6 h-6 text-[#C5A059]" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5">
								<path d="M24 8 C30 14, 32 20, 32 26 C32 32, 28 36, 24 40 C20 36, 16 32, 16 26 C16 20, 18 14, 24 8"/>
								<path d="M24 14 C26 16, 27 18, 27 21 C27 24, 26 26, 24 28"/>
							</svg>
						{/if}
					</div>
					<div class="flex-1 min-w-0">
						<div class="flex items-center gap-2 mb-1">
							<h3 class="font-serif text-base text-[#3D3028] font-medium">{suggestion.title}</h3>
							<span class="text-[#C5A059]/40 text-xs">{suggestion.timeRange}</span>
						</div>
						<p class="text-[#7A6B5A] text-sm leading-relaxed mb-3">
							{suggestion.description}
						</p>
						<a
							href={suggestion.link}
							class="inline-flex items-center gap-2 px-4 py-2 bg-[#3D3028] text-[#F7F3F0] text-sm rounded-full hover:bg-[#3D3028]/90 transition-colors"
						>
							{suggestion.action}
							<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
								<path d="M5 12h14M12 5l7 7-7 7"/>
							</svg>
						</a>
					</div>
				</div>
			</div>
		</div>

		<!-- Features -->
		<div class="mt-10 w-full max-w-md grid grid-cols-3 gap-3">
			<!-- Meditation -->
			<a
				href="/meditate"
				class="bg-[#EDE8E3]/60 rounded-2xl p-4 text-center border border-[#3D3028]/5 hover:border-[#C5A059]/20 transition-colors"
			>
				<div class="w-10 h-10 mx-auto rounded-xl bg-[#C5A059]/10 flex items-center justify-center mb-2">
					<svg class="w-5 h-5 text-[#C5A059]" viewBox="0 0 48 48" fill="none">
						<ellipse cx="24" cy="28" rx="7" ry="12" fill="currentColor" opacity="0.6" transform="rotate(0 24 32)"/>
						<ellipse cx="24" cy="28" rx="7" ry="12" fill="currentColor" opacity="0.5" transform="rotate(60 24 32)"/>
						<ellipse cx="24" cy="28" rx="7" ry="12" fill="currentColor" opacity="0.4" transform="rotate(120 24 32)"/>
						<circle cx="24" cy="32" r="3" fill="currentColor" opacity="0.7"/>
					</svg>
				</div>
				<h3 class="font-medium text-[#3D3028] text-sm mb-0.5">Thien</h3>
				<p class="text-[#3D3028]/40 text-xs">Tinh tam</p>
			</a>

			<!-- Mokugyo -->
			<a
				href="/mokugyo"
				class="bg-[#EDE8E3]/60 rounded-2xl p-4 text-center border border-[#3D3028]/5 hover:border-[#C5A059]/20 transition-colors"
			>
				<div class="w-10 h-10 mx-auto rounded-xl bg-[#9CAF88]/10 flex items-center justify-center mb-2">
					<svg class="w-5 h-5 text-[#9CAF88]" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5">
						<ellipse cx="24" cy="30" rx="12" ry="8"/>
						<path d="M24 14v10"/>
						<ellipse cx="24" cy="12" rx="5" ry="4"/>
					</svg>
				</div>
				<h3 class="font-medium text-[#3D3028] text-sm mb-0.5">Go Mo</h3>
				<p class="text-[#3D3028]/40 text-xs">Tich diem</p>
			</a>

			<!-- Community -->
			<a
				href="/leaderboard"
				class="bg-[#EDE8E3]/60 rounded-2xl p-4 text-center border border-[#3D3028]/5 hover:border-[#C5A059]/20 transition-colors"
			>
				<div class="w-10 h-10 mx-auto rounded-xl bg-[#C5A059]/10 flex items-center justify-center mb-2">
					<svg class="w-5 h-5 text-[#C5A059]" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5">
						<circle cx="20" cy="16" r="6"/>
						<circle cx="28" cy="16" r="6"/>
						<path d="M8 36c0-6.627 5.373-12 12-12s12 5.373 12 12"/>
						<path d="M28 36c0-6.627 5.373-12 12-12s12 5.373 12 12"/>
					</svg>
				</div>
				<h3 class="font-medium text-[#3D3028] text-sm mb-0.5">Cong dong</h3>
				<p class="text-[#3D3028]/40 text-xs">Ket noi</p>
			</a>
		</div>
	</main>

	<!-- Footer -->
	<footer class="py-6 text-center relative z-10">
		<p class="text-[#3D3028]/30 text-sm font-light tracking-wider italic">
			"Hanh trinh ngan dam bat dau tu mot buoc chan"
		</p>
	</footer>
</div>

<style>
	.font-serif {
		font-family: 'Playfair Display', Georgia, serif;
	}

	@keyframes breathe {
		0%, 100% {
			transform: scale(1);
			opacity: 1;
		}
		50% {
			transform: scale(1.05);
			opacity: 0.9;
		}
	}

	.animate-breathe {
		animation: breathe 4s ease-in-out infinite;
	}

	@keyframes fall {
		0% {
			transform: translateY(-60px) rotate(0deg);
			opacity: 0;
		}
		10% {
			opacity: 1;
		}
		90% {
			opacity: 1;
		}
		100% {
			transform: translateY(calc(100vh + 60px)) rotate(360deg);
			opacity: 0;
		}
	}
</style>
