<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	let currentStep = $state(0);
	let isAnimating = $state(false);
	let canSwipe = $state(false);

	const steps = [
		{ id: 'welcome', title: 'Chào mừng đến', subtitle: 'Hành trình tích đức', description: 'Một hành trình thánh thiện bắt đầu từ đây. Nuôi dưỡng tâm hồn, tích lũy những điều tốt đẹp.', icon: 'lotus' },
		{ id: 'meditation', title: 'Thiền định', subtitle: 'Lắng nghe tiếng gọi nội tâm', description: 'Thiền tại cho ta những lời bàn sạch, giữ cho tâm hồn bình lặng giữa đôn hàng cuộc đời.', icon: 'lotus-seated' },
		{ id: 'merit', title: 'Tích đức', subtitle: 'Những điều tốt đẹp nhỏ nhất', description: 'Mỗi ngày, tích lũy những điều tốt đẹp. Gõ mõ, hành đạo, tụng kinh - mọi hành động đều tạo nên công đức.', icon: 'mokugyo' },
		{ id: 'community', title: 'Cộng đồng', subtitle: 'Chia sẻ hành trình', description: 'Kết nối với những tâm hồn cùng chung lý tưởng. Cùng nhau tiến bước trên con đường Phật đạo.', icon: 'community' }
	];

	let currentData = $derived(steps[currentStep]);

	function nextStep() {
		if (currentStep < steps.length - 1) {
			isAnimating = true;
			setTimeout(() => { currentStep++; isAnimating = false; }, 300);
		} else {
			localStorage.setItem('hasOnboarded', 'true');
			goto('/auth');
		}
	}

	function prevStep() {
		if (currentStep > 0) {
			isAnimating = true;
			setTimeout(() => { currentStep--; isAnimating = false; }, 300);
		} else { goto('/'); }
	}

	onMount(() => { setTimeout(() => canSwipe = true, 500); });
</script>

<div class="min-h-screen relative overflow-hidden" style="background-color: #F9F8F6;">
	<!-- Subtle ambient -->
	<div class="fixed inset-0 overflow-hidden pointer-events-none">
		<div class="absolute top-0 right-0 w-96 h-96 bg-[#B8860B]/5 rounded-full blur-3xl animate-float-drift"></div>
		<div class="absolute bottom-0 left-0 w-64 h-64 bg-[#6B8E6B]/5 rounded-full blur-3xl animate-float-drift" style="animation-delay: -4s;"></div>
	</div>

	<div class="fixed top-6 right-6 z-20">
		<button onclick={() => { localStorage.setItem('hasOnboarded', 'true'); goto('/auth'); }} class="text-[#7A7573] hover:text-[#1A1918] text-sm transition-colors">Bỏ qua</button>
	</div>

	<div class="fixed top-5 left-5 z-20">
		<button onclick={prevStep} class="p-2 rounded-full hover:bg-[#F0EFEC] transition-colors">
			<svg class="w-5 h-5 text-[#7A7573]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
		</button>
	</div>

	<main class="flex flex-col items-center justify-center min-h-screen px-8 py-20 relative z-10">
		<div class="text-center max-w-sm mx-auto transition-all duration-300"
			class:opacity-0={isAnimating} class:translate-y-4={isAnimating} class:opacity-100={!isAnimating} class:translate-y-0={!isAnimating}>
			<div class="mb-12">
				{#if currentData.icon === 'lotus'}
					<div class="w-28 h-28 mx-auto animate-gentle-glow">
						<svg class="w-full h-full" viewBox="0 0 80 80" fill="none">
							<defs>
								<linearGradient id="lotusGradOn1" x1="0%" y1="100%" x2="0%" y2="0%">
									<stop offset="0%" stop-color="#8B6508"/>
									<stop offset="100%" stop-color="#DAA520"/>
								</linearGradient>
							</defs>
							<ellipse cx="40" cy="22" rx="8" ry="16" fill="url(#lotusGradOn1)" opacity="0.7" transform="rotate(0 40 48)"/>
							<ellipse cx="40" cy="22" rx="8" ry="16" fill="url(#lotusGradOn1)" opacity="0.7" transform="rotate(60 40 48)"/>
							<ellipse cx="40" cy="22" rx="8" ry="16" fill="url(#lotusGradOn1)" opacity="0.7" transform="rotate(120 40 48)"/>
							<ellipse cx="40" cy="22" rx="8" ry="16" fill="url(#lotusGradOn1)" opacity="0.7" transform="rotate(180 40 48)"/>
							<ellipse cx="40" cy="22" rx="8" ry="16" fill="url(#lotusGradOn1)" opacity="0.7" transform="rotate(240 40 48)"/>
							<ellipse cx="40" cy="22" rx="8" ry="16" fill="url(#lotusGradOn1)" opacity="0.7" transform="rotate(300 40 48)"/>
							<circle cx="40" cy="48" r="6" fill="#B8860B" opacity="0.8"/>
						</svg>
					</div>
				{:else if currentData.icon === 'lotus-seated'}
					<div class="w-28 h-28 mx-auto">
						<svg class="w-full h-full text-[#6B8E6B]" viewBox="0 0 80 80" fill="none">
							<ellipse cx="40" cy="65" rx="20" ry="6" fill="currentColor" opacity="0.15"/>
							<path d="M40 60 C30 60 25 55 25 50 C25 45 30 40 40 40 C50 40 55 45 55 50 C55 55 50 60 40 60" fill="currentColor" opacity="0.25"/>
							<circle cx="40" cy="30" r="8" fill="currentColor" opacity="0.4"/>
							<path d="M32 42 L40 35 L48 42" stroke="currentColor" stroke-width="2" fill="none" opacity="0.5"/>
						</svg>
					</div>
				{:else if currentData.icon === 'mokugyo'}
					<div class="w-28 h-28 mx-auto">
						<svg class="w-full h-full" viewBox="0 0 80 80" fill="none">
							<ellipse cx="40" cy="55" rx="18" ry="10" fill="#B8860B" opacity="0.3"/>
							<ellipse cx="40" cy="50" rx="18" ry="10" fill="#B8860B" opacity="0.5"/>
							<ellipse cx="40" cy="50" rx="14" ry="7" fill="#B8860B" opacity="0.3"/>
							<path d="M40 40 L40 28" stroke="#B8860B" stroke-width="3" opacity="0.6"/>
							<ellipse cx="40" cy="26" rx="6" ry="4" fill="#B8860B" opacity="0.5"/>
						</svg>
					</div>
				{:else}
					<div class="w-28 h-28 mx-auto">
						<svg class="w-full h-full text-[#6B8E6B]" viewBox="0 0 80 80" fill="none">
							<circle cx="40" cy="22" r="6" fill="currentColor" opacity="0.4"/>
							<path d="M28 55 C28 48 33 42 40 42 C47 42 52 48 52 55" fill="currentColor" opacity="0.25"/>
							<ellipse cx="40" cy="62" rx="10" ry="4" fill="currentColor" opacity="0.15"/>
							<circle cx="22" cy="35" r="5" fill="currentColor" opacity="0.3"/>
							<path d="M15 55 C15 50 18 46 22 46 C26 46 29 50 29 55" fill="currentColor" opacity="0.2"/>
							<circle cx="58" cy="35" r="5" fill="currentColor" opacity="0.3"/>
							<path d="M51 55 C51 50 54 46 58 46 C62 46 65 50 65 55" fill="currentColor" opacity="0.2"/>
						</svg>
					</div>
				{/if}
			</div>

			<!-- Step dots -->
			<div class="flex justify-center gap-2 mb-10">
				{#each steps as _, i}
					<div class="h-1 rounded-full transition-all duration-500 {i === currentStep ? 'w-6 bg-[#B8860B]' : i < currentStep ? 'w-2 bg-[#B8860B]/40' : 'w-2 bg-[#E8E5E2]'}"></div>
				{/each}
			</div>

			<h1 class="font-serif text-3xl font-medium text-[#1A1918] mb-2 animate-fade-in-up">{currentData.title}</h1>
			<p class="text-[#B8860B] text-sm font-medium tracking-wide mb-6 animate-fade-in-up" style="animation-delay: 0.1s;">{currentData.subtitle}</p>
			<p class="text-[#4A4543] text-base leading-relaxed animate-fade-in-up" style="animation-delay: 0.2s;">{currentData.description}</p>
		</div>
	</main>

	<footer class="px-8 py-10 relative z-10">
		<button onclick={nextStep} class="w-full py-4 bg-[#B8860B] text-white rounded-xl font-medium text-base transition-all duration-300 hover:bg-[#8B6508] active:scale-[0.98] shadow-lg shadow-[#B8860B]/20">
			{currentStep === steps.length - 1 ? 'Bắt đầu hành trình' : 'Tiếp tục'}
		</button>
		{#if currentStep === 0}
			<p class="text-center text-[#A8A3A0] text-sm mt-6 animate-fade-in" style="animation-delay: 0.5s;">"Những điều tốt đẹp nhất trong cuộc sống là những điều chúng ta không thể thấy bằng mắt"</p>
		{/if}
	</footer>
</div>
