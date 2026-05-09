<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	let currentStep = $state(0);
	let isAnimating = $state(false);
	let canSwipe = $state(false);

	const steps = [
		{
			id: 'welcome',
			title: 'Chào mừng đến',
			subtitle: 'Hành trình tích đức',
			description: 'Một hành trình thánh thiện bắt đầu từ đây. Nuôi dưỡng tâm hồn, tích lũy những điều tốt đẹp.',
			icon: 'lotus',
			bgGradient: 'from-[#F7F3F0] to-[#F2EDE6]'
		},
		{
			id: 'meditation',
			title: 'Thiền định',
			subtitle: 'Lắng nghe tiếng gọi nội tâm',
			description: 'Thiền tại cho ta những lời bàn sạch, giữ cho tâm hồn bình lặng giữa đôn hàng cuộc đời.',
			icon: 'lotus-seated',
			bgGradient: 'from-[#F2EDE6] to-[#E8E2DA]'
		},
		{
			id: 'merit',
			title: 'Tích đức',
			subtitle: 'Những điều tốt đẹp nhỏ nhất',
			description: 'Mỗi ngày, tích lũy những điều tốt đẹp. Gõ mõ, hành đạo, tụng kinh - mọi hành động đều tạo nên công đức.',
			icon: 'mokugyo',
			bgGradient: 'from-[#E8E2DA] to-[#F2EDE6]'
		},
		{
			id: 'community',
			title: 'Cộng đồng',
			subtitle: 'Chia sẻ hành trình',
			description: 'Kết nối với những tâm hồn cùng chung lý tưởng. Cùng nhau tiến bước trên con đường Phật đạo.',
			icon: 'community',
			bgGradient: 'from-[#F2EDE6] to-[#F7F3F0]'
		}
	];

	let currentData = $derived(steps[currentStep]);

	function nextStep() {
		if (currentStep < steps.length - 1) {
			isAnimating = true;
			setTimeout(() => {
				currentStep++;
				isAnimating = false;
			}, 300);
		} else {
			localStorage.setItem('hasOnboarded', 'true');
			goto('/auth');
		}
	}

	function prevStep() {
		if (currentStep > 0) {
			isAnimating = true;
			setTimeout(() => {
				currentStep--;
				isAnimating = false;
			}, 300);
		} else {
			goto('/');
		}
	}

	function skipOnboarding() {
		localStorage.setItem('hasOnboarded', 'true');
		goto('/auth');
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'ArrowRight' || e.key === ' ') {
			e.preventDefault();
			nextStep();
		} else if (e.key === 'ArrowLeft') {
			e.preventDefault();
			prevStep();
		}
	}

	onMount(() => {
		setTimeout(() => canSwipe = true, 500);
		window.addEventListener('keydown', handleKeydown);
		return () => {
			window.removeEventListener('keydown', handleKeydown);
		};
	});
</script>

<div class="min-h-screen bg-gradient-to-b {currentData.bgGradient} flex flex-col relative overflow-hidden">
	<div class="absolute top-0 left-0 right-0 h-1/3 overflow-hidden pointer-events-none">
		<div class="absolute top-10 right-10 w-32 h-32 bg-[#C5A059]/5 rounded-full blur-3xl animate-float-drift"></div>
		<div class="absolute top-20 left-10 w-24 h-24 bg-[#9CAF88]/5 rounded-full blur-2xl animate-float-drift" style="animation-delay: -3s;"></div>
	</div>

	<div class="absolute top-6 right-6 z-20">
		<button
			onclick={skipOnboarding}
			class="px-4 py-2 text-[#7A6B5A]/60 text-sm hover:text-[#7A6B5A] transition-colors"
		>
			Bỏ qua
		</button>
	</div>

	<div class="absolute top-6 left-6 z-20">
		<button
			onclick={prevStep}
			class="p-2 rounded-full hover:bg-[#3D3028]/5 transition-colors"
		>
			<svg class="w-6 h-6 text-[#5C4F44]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
				<path d="M19 12H5M12 19l-7-7 7-7"/>
			</svg>
		</button>
	</div>

	<main class="flex-1 flex flex-col items-center justify-center px-8 py-20 relative z-10">
		<div
			class="text-center max-w-sm mx-auto transition-all duration-300"
			class:opacity-0={isAnimating}
			class:translate-y-4={isAnimating}
			class:translate-y-0={!isAnimating}
			class:opacity-100={!isAnimating}
		>
			<div class="mb-10">
				{#if currentData.icon === 'lotus'}
					<div class="w-24 h-24 mx-auto animate-gentle-glow">
						<svg class="w-full h-full text-[#C5A059]" viewBox="0 0 80 80" fill="none">
							<defs>
								<linearGradient id="onboardLotus" x1="0%" y1="100%" x2="0%" y2="0%">
									<stop offset="0%" stop-color="#C9B896"/>
									<stop offset="100%" stop-color="#E8DCC8"/>
								</linearGradient>
							</defs>
							<ellipse cx="40" cy="22" rx="8" ry="16" fill="url(#onboardLotus)" transform="rotate(0 40 48)" opacity="0.8"/>
							<ellipse cx="40" cy="22" rx="8" ry="16" fill="url(#onboardLotus)" transform="rotate(60 40 48)" opacity="0.8"/>
							<ellipse cx="40" cy="22" rx="8" ry="16" fill="url(#onboardLotus)" transform="rotate(120 40 48)" opacity="0.8"/>
							<ellipse cx="40" cy="22" rx="8" ry="16" fill="url(#onboardLotus)" transform="rotate(180 40 48)" opacity="0.8"/>
							<ellipse cx="40" cy="22" rx="8" ry="16" fill="url(#onboardLotus)" transform="rotate(240 40 48)" opacity="0.8"/>
							<ellipse cx="40" cy="22" rx="8" ry="16" fill="url(#onboardLotus)" transform="rotate(300 40 48)" opacity="0.8"/>
							<circle cx="40" cy="48" r="6" fill="#C9B896"/>
						</svg>
					</div>
				{:else if currentData.icon === 'lotus-seated'}
					<div class="w-24 h-24 mx-auto">
						<svg class="w-full h-full text-[#9CAF88]" viewBox="0 0 80 80" fill="none">
							<ellipse cx="40" cy="65" rx="20" ry="6" fill="currentColor" opacity="0.2"/>
							<path d="M40 60 C30 60 25 55 25 50 C25 45 30 40 40 40 C50 40 55 45 55 50 C55 55 50 60 40 60" fill="currentColor" opacity="0.3"/>
							<circle cx="40" cy="30" r="8" fill="currentColor" opacity="0.4"/>
							<path d="M32 42 L40 35 L48 42" stroke="currentColor" stroke-width="2" fill="none" opacity="0.5"/>
						</svg>
					</div>
				{:else if currentData.icon === 'mokugyo'}
					<div class="w-24 h-24 mx-auto">
						<svg class="w-full h-full text-[#C5A059]" viewBox="0 0 80 80" fill="none">
							<defs>
								<linearGradient id="mokugyoGrad" x1="0%" y1="0%" x2="0%" y2="100%">
									<stop offset="0%" stop-color="#C9B896"/>
									<stop offset="100%" stop-color="#A69070"/>
								</linearGradient>
							</defs>
							<ellipse cx="40" cy="55" rx="18" ry="10" fill="url(#mokugyoGrad)"/>
							<ellipse cx="40" cy="50" rx="18" ry="10" fill="#E8DCC8"/>
							<ellipse cx="40" cy="50" rx="14" ry="7" fill="url(#mokugyoGrad)" opacity="0.3"/>
							<path d="M40 40 L40 28" stroke="#A69070" stroke-width="3"/>
							<ellipse cx="40" cy="26" rx="6" ry="4" fill="url(#mokugyoGrad)"/>
						</svg>
					</div>
				{:else if currentData.icon === 'community'}
					<div class="w-24 h-24 mx-auto">
						<svg class="w-full h-full text-[#9CAF88]" viewBox="0 0 80 80" fill="none">
							<circle cx="40" cy="22" r="6" fill="currentColor" opacity="0.5"/>
							<path d="M28 55 C28 48 33 42 40 42 C47 42 52 48 52 55" fill="currentColor" opacity="0.3"/>
							<ellipse cx="28" cy="58" rx="8" ry="3" fill="currentColor" opacity="0.2"/>
							<ellipse cx="52" cy="58" rx="8" ry="3" fill="currentColor" opacity="0.2"/>
							<ellipse cx="40" cy="62" rx="10" ry="4" fill="currentColor" opacity="0.2"/>
							<circle cx="22" cy="35" r="5" fill="currentColor" opacity="0.4"/>
							<path d="M15 55 C15 50 18 46 22 46 C26 46 29 50 29 55" fill="currentColor" opacity="0.25"/>
							<circle cx="58" cy="35" r="5" fill="currentColor" opacity="0.4"/>
							<path d="M51 55 C51 50 54 46 58 46 C62 46 65 50 65 55" fill="currentColor" opacity="0.25"/>
						</svg>
					</div>
				{/if}
			</div>

			<div class="flex justify-center gap-2 mb-8">
				{#each steps as _, i}
					<div
						class="w-2 h-2 rounded-full transition-all duration-300 {i === currentStep ? 'w-6 bg-[#C5A059]' : i < currentStep ? 'bg-[#C5A059]/50' : 'bg-[#E8E0D8]'}"
					></div>
				{/each}
			</div>

			<h1 class="font-serif text-3xl font-light text-[#3D3028] mb-2 tracking-wide animate-fade-in-up">
				{currentData.title}
			</h1>

			<p class="text-[#9CAF88] text-sm tracking-wider mb-6 animate-fade-in-up" style="animation-delay: 0.1s;">
				{currentData.subtitle}
			</p>

			<p class="text-[#7A6B5A] text-base leading-relaxed font-light animate-fade-in-up" style="animation-delay: 0.2s;">
				{currentData.description}
			</p>
		</div>
	</main>

	<footer class="px-8 py-10 relative z-10">
		<button
			onclick={nextStep}
			class="w-full py-4 bg-[#3D3028] text-[#F7F3F0] rounded-2xl font-medium text-lg transition-all duration-300 hover:bg-[#3D3028]/90 hover:shadow-lg hover:shadow-[#3D3028]/20 active:scale-[0.98]"
		>
			{currentStep === steps.length - 1 ? 'Bắt đầu hành trình' : 'Tiếp tục'}
		</button>

		{#if currentStep === 0}
			<p class="text-center text-[#3D3028]/20 text-xs italic mt-8 animate-fade-in" style="animation-delay: 0.5s;">
				"Những điều tốt đẹp nhất trong cuộc sống là những điều chúng ta không thể thấy bằng mắt"
			</p>
		{/if}
	</footer>
</div>

<style>
	.font-serif {
		font-family: 'Playfair Display', Georgia, serif;
	}
</style>
