<script lang="ts">
	import { goto } from '$app/navigation';
	import { ArrowLeft } from 'lucide-svelte';
	import BottomNav from '$lib/components/BottomNav.svelte';

	const steps = [
		{
			step: 1,
			title: 'Bắt đầu',
			description: 'Chọn bắt đầu thiền từ màn hình chính',
			icon: `<svg class="w-full h-full" viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="2">
				<circle cx="40" cy="40" r="30" stroke-dasharray="4 4"/>
				<path d="M35 30l15 10-15 10z" fill="currentColor"/>
			</svg>`,
			tip: 'Tìm nơi yên tĩnh, thoải mái'
		},
		{
			step: 2,
			title: 'Chắp tay',
			description: 'Đưa hai lòng bàn tay chạm nhau trước ngực',
			icon: `<svg class="w-full h-full" viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="2">
				<path d="M25 60 C25 40 35 25 40 20 C45 25 55 40 55 60"/>
				<ellipse cx="40" cy="55" rx="15" ry="10" fill="currentColor" opacity="0.3"/>
				<path d="M30 45 L40 35 L50 45" stroke-width="1.5"/>
				<path d="M25 50 C20 45 20 35 30 30" stroke-width="1.5"/>
				<path d="M55 50 C60 45 60 35 50 30" stroke-width="1.5"/>
			</svg>`,
			tip: 'Hai bàn tay khép chặt, ngón tay đặt sát nhau'
		},
		{
			step: 3,
			title: 'Giữ yên',
			description: 'Duy trì tư thế chắp tay trong 10 giây',
			icon: `<svg class="w-full h-full" viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="2">
				<circle cx="40" cy="40" r="25" stroke-dasharray="2 2"/>
				<path d="M40 25 L40 35 M40 45 L40 55 M25 40 L35 40 M45 40 L55 40" stroke-width="1.5"/>
				<circle cx="40" cy="40" r="8" fill="currentColor" opacity="0.5"/>
				<path d="M40 32 L40 40 L46 40" stroke-width="1.5"/>
			</svg>`,
			tip: 'Hít thở đều, tâm an tĩnh, mắt nhắm nhẹ'
		},
		{
			step: 4,
			title: 'Nhận công đức',
			description: 'Sau khi giữ đủ 10 giây, bạn sẽ tích lũy được công đức',
			icon: `<svg class="w-full h-full" viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="2">
				<ellipse cx="40" cy="70" rx="12" ry="4" fill="currentColor" opacity="0.2"/>
				<path d="M40 60 C40 60 28 48 28 38 C28 28 40 16 40 16 C40 16 52 28 52 38 C52 48 40 60 40 60" fill="currentColor" opacity="0.3"/>
				<path d="M28 54 C20 42 14 34 14 26 C14 18 26 12 34 16" fill="currentColor" opacity="0.2"/>
				<path d="M52 54 C60 42 66 34 66 26 C66 18 54 12 46 16" fill="currentColor" opacity="0.2"/>
				<circle cx="40" cy="35" r="4" fill="currentColor"/>
			</svg>`,
			tip: 'Mỗi ngày tích lũy, công đức sẽ tăng trưởng'
		}
	];

	let currentStep = $state(0);
</script>

<div class="min-h-screen bg-zen-cream pb-24">
	<!-- Header -->
	<header class="relative px-6 pt-8 pb-4">
		<button 
			onclick={() => goto('/dashboard')}
			class="absolute left-4 top-8 p-2 rounded-full bg-zen-parchment/80 backdrop-blur-sm"
		>
			<ArrowLeft class="w-5 h-5 text-zen-brown" />
		</button>
		
		<div class="text-center">
			<h1 class="font-serif text-2xl font-light text-zen-brown-deep tracking-wide">Hướng dẫn</h1>
			<p class="text-zen-brown-warm/60 text-sm mt-1">Hành trình tích công đức</p>
		</div>
	</header>

	<!-- Progress indicator -->
	<div class="px-6 mb-6">
		<div class="flex items-center justify-center gap-2">
			{#each steps as step, i}
				<div 
					class="h-1 rounded-full transition-all duration-500 {i <= currentStep ? 'bg-zen-gold w-8' : 'bg-zen-linen w-4'}"
				></div>
			{/each}
		</div>
	</div>

	<!-- Main content -->
	<div class="px-6">
		<!-- Step card -->
		<div class="bg-zen-parchment/60 backdrop-blur-sm rounded-3xl p-6 mb-6">
			<!-- Icon -->
			<div class="w-24 h-24 mx-auto mb-6 text-zen-gold">
				{@html steps[currentStep].icon}
			</div>
			
			<!-- Step number -->
			<div class="flex items-center justify-center gap-2 mb-3">
				<span class="text-zen-gold text-sm font-medium">Bước {steps[currentStep].step}</span>
				<span class="text-zen-brown-warm/30">•</span>
				<span class="text-zen-brown-warm/60 text-sm">{currentStep + 1}/{steps.length}</span>
			</div>
			
			<!-- Title -->
			<h2 class="font-serif text-xl text-zen-brown-deep text-center mb-3">
				{steps[currentStep].title}
			</h2>
			
			<!-- Description -->
			<p class="text-zen-brown-warm/70 text-center leading-relaxed">
				{steps[currentStep].description}
			</p>
			
			<!-- Tip -->
			<div class="mt-4 px-4 py-3 bg-zen-sage/10 rounded-xl">
				<p class="text-zen-sage text-sm text-center">
					💡 {steps[currentStep].tip}
				</p>
			</div>
		</div>

		<!-- Navigation buttons -->
		<div class="flex gap-3">
			{#if currentStep > 0}
				<button
					onclick={() => currentStep--}
					class="flex-1 py-3 px-4 bg-zen-parchment rounded-xl text-zen-brown-warm font-medium"
				>
					Quay lại
				</button>
			{:else}
				<button
					onclick={() => goto('/dashboard')}
					class="flex-1 py-3 px-4 bg-zen-parchment rounded-xl text-zen-brown-warm font-medium"
				>
					Đóng
				</button>
			{/if}
			
			{#if currentStep < steps.length - 1}
				<button
					onclick={() => currentStep++}
					class="flex-1 py-3 px-4 bg-zen-gold/20 rounded-xl text-zen-brown-deep font-medium hover:bg-zen-gold/30 transition-colors"
				>
					Tiếp tục
				</button>
			{:else}
				<button
					onclick={() => goto('/meditate')}
					class="flex-1 py-3 px-4 bg-gradient-to-r from-zen-gold/30 to-zen-gold/20 rounded-xl text-zen-brown-deep font-medium hover:from-zen-gold/40 hover:to-zen-gold/30 transition-colors"
				>
					Bắt đầu thiền
				</button>
			{/if}
		</div>

		<!-- Illustration -->
		<div class="mt-8 relative">
			<div class="absolute inset-0 bg-zen-gold/5 rounded-3xl blur-xl"></div>
			<div class="relative bg-zen-parchment/40 rounded-3xl p-6 text-center">
				<div class="w-20 h-20 mx-auto mb-4 relative">
					<!-- Animated lotus -->
					<svg viewBox="0 0 80 80" class="w-full h-full text-zen-gold/40 animate-breathe">
						<ellipse cx="40" cy="70" rx="15" ry="5" fill="currentColor"/>
						<path d="M40 55 C40 55 25 40 25 28 C25 16 40 5 40 5 C40 5 55 16 55 28 C55 40 40 55 40 55" fill="currentColor"/>
						<path d="M25 48 C15 35 8 25 8 15 C8 5 22 2 32 8" fill="currentColor"/>
						<path d="M55 48 C65 35 72 25 72 15 C72 5 58 2 48 8" fill="currentColor"/>
					</svg>
					<!-- Glow ring -->
					<div class="absolute inset-0 rounded-full border border-zen-gold/20 animate-ping" style="animation-duration: 3s;"></div>
				</div>
				<p class="text-zen-brown-warm/50 text-sm italic">
					"Tâm an thì phúc tự đến"
				</p>
			</div>
		</div>
	</div>
</div>

<BottomNav currentRoute="/dashboard" />
