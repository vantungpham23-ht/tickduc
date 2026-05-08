<script lang="ts">
	import { goto } from '$app/navigation';
	import { Leaf } from 'lucide-svelte';
</script>

<div class="min-h-screen bg-zen-cream flex flex-col items-center justify-center px-6 py-12">
	<!-- Background decoration -->
	<div class="fixed inset-0 overflow-hidden pointer-events-none">
		<div class="absolute top-20 left-10 w-32 h-32 bg-zen-gold/5 rounded-full blur-3xl"></div>
		<div class="absolute bottom-20 right-10 w-48 h-48 bg-zen-gold/5 rounded-full blur-3xl"></div>
	</div>

	<div class="relative z-10 flex flex-col items-center text-center stagger-children">
		<!-- Lotus Logo -->
		<div class="mb-8 animate-fade-in">
			<div class="w-24 h-24 rounded-full bg-zen-gold/10 flex items-center justify-center animate-pulse-glow">
				<Leaf class="w-12 h-12 text-zen-gold" strokeWidth={1.5} />
			</div>
		</div>

		<!-- Title -->
		<h1 class="font-serif text-5xl md:text-6xl lg:text-7xl font-semibold text-zen-brown mb-4 tracking-tight">
			Tích Công Đức
		</h1>

		<!-- Subtitle -->
		<p class="text-zen-brown/60 text-lg md:text-xl max-w-md mx-auto mb-12 font-light leading-relaxed">
			Tích lũy công đức mỗi ngày<br />
			Nuôi dưỡng tâm hồn an lạc
		</p>

		<!-- Start Button -->
		<button
			onclick={() => goto('/auth')}
			class="group relative px-12 py-4 bg-zen-brown text-zen-cream rounded-full font-medium text-lg transition-all duration-300 hover:bg-zen-brown/90 hover:shadow-lg hover:shadow-zen-brown/20 hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-zen-gold focus-visible:ring-offset-2"
		>
			<span class="relative z-10">Bắt đầu</span>
			<div class="absolute inset-0 rounded-full bg-zen-gold/20 scale-0 group-hover:scale-100 transition-transform duration-300"></div>
		</button>
	</div>

	<!-- Footer hint -->
	<p class="absolute bottom-8 text-zen-brown/40 text-sm">
		Hành trình từ một bước chân
	</p>
</div>

<style>
	.font-serif {
		font-family: 'Playfair Display', Georgia, serif;
	}
</style>
