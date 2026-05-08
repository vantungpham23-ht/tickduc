<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';

	let canvasRef: HTMLCanvasElement;
	let animationFrameId: number;
	
	// Floating elements
	let floatingElements: Array<{
		x: number;
		y: number;
		size: number;
		rotation: number;
		rotationSpeed: number;
		fallSpeed: number;
		swayAmplitude: number;
		swaySpeed: number;
		phase: number;
		opacity: number;
		type: 'lotus' | 'petal' | 'leaf';
	}> = [];

	let mouseX = $state(0);
	let mouseY = $state(0);

	function createFloatingElement() {
		const types: ('lotus' | 'petal' | 'leaf')[] = ['lotus', 'petal', 'petal', 'petal', 'leaf'];
		return {
			x: Math.random() * (canvasRef?.width || 1200),
			y: -50 - Math.random() * 100,
			size: 15 + Math.random() * 25,
			rotation: Math.random() * 360,
			rotationSpeed: (Math.random() - 0.5) * 2,
			fallSpeed: 0.3 + Math.random() * 0.5,
			swayAmplitude: 20 + Math.random() * 40,
			swaySpeed: 0.5 + Math.random() * 1,
			phase: Math.random() * Math.PI * 2,
			opacity: 0.15 + Math.random() * 0.25,
			type: types[Math.floor(Math.random() * types.length)]
		};
	}

	function drawLotus(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, rotation: number, opacity: number) {
		ctx.save();
		ctx.translate(x, y);
		ctx.rotate((rotation * Math.PI) / 180);
		ctx.globalAlpha = opacity;
		
		const scale = size / 40;
		
		// Outer petals
		for (let i = 0; i < 6; i++) {
			const angle = (i / 6) * Math.PI * 2;
			ctx.save();
			ctx.rotate(angle);
			ctx.beginPath();
			ctx.ellipse(0, -15 * scale, 8 * scale, 18 * scale, 0, 0, Math.PI * 2);
			ctx.fillStyle = 'rgba(201, 184, 150, 0.6)';
			ctx.fill();
			ctx.restore();
		}
		
		// Inner petals
		for (let i = 0; i < 5; i++) {
			const angle = (i / 5) * Math.PI * 2 + Math.PI / 5;
			ctx.save();
			ctx.rotate(angle);
			ctx.beginPath();
			ctx.ellipse(0, -10 * scale, 6 * scale, 14 * scale, 0, 0, Math.PI * 2);
			ctx.fillStyle = 'rgba(232, 220, 200, 0.7)';
			ctx.fill();
			ctx.restore();
		}
		
		// Center
		ctx.beginPath();
		ctx.arc(0, 0, 5 * scale, 0, Math.PI * 2);
		ctx.fillStyle = 'rgba(180, 160, 130, 0.8)';
		ctx.fill();
		
		ctx.restore();
	}

	function drawPetal(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, rotation: number, opacity: number) {
		ctx.save();
		ctx.translate(x, y);
		ctx.rotate((rotation * Math.PI) / 180);
		ctx.globalAlpha = opacity;
		
		// Teardrop petal shape
		ctx.beginPath();
		ctx.moveTo(0, -size);
		ctx.bezierCurveTo(size * 0.6, -size * 0.5, size * 0.6, size * 0.5, 0, size);
		ctx.bezierCurveTo(-size * 0.6, size * 0.5, -size * 0.6, -size * 0.5, 0, -size);
		ctx.fillStyle = 'rgba(232, 215, 195, 0.5)';
		ctx.fill();
		
		// Subtle vein
		ctx.beginPath();
		ctx.moveTo(0, -size * 0.8);
		ctx.lineTo(0, size * 0.6);
		ctx.strokeStyle = 'rgba(201, 184, 150, 0.3)';
		ctx.lineWidth = 0.5;
		ctx.stroke();
		
		ctx.restore();
	}

	function drawLeaf(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, rotation: number, opacity: number) {
		ctx.save();
		ctx.translate(x, y);
		ctx.rotate((rotation * Math.PI) / 180);
		ctx.globalAlpha = opacity;
		
		// Leaf shape
		ctx.beginPath();
		ctx.moveTo(0, -size);
		ctx.bezierCurveTo(size * 0.8, -size * 0.3, size * 0.8, size * 0.3, 0, size);
		ctx.bezierCurveTo(-size * 0.8, size * 0.3, -size * 0.8, -size * 0.3, 0, -size);
		ctx.fillStyle = 'rgba(156, 175, 136, 0.4)';
		ctx.fill();
		
		// Stem
		ctx.beginPath();
		ctx.moveTo(0, -size);
		ctx.lineTo(0, size * 0.8);
		ctx.strokeStyle = 'rgba(120, 140, 100, 0.5)';
		ctx.lineWidth = 1;
		ctx.stroke();
		
		ctx.restore();
	}

	function animate() {
		if (!canvasRef) return;
		
		const ctx = canvasRef.getContext('2d');
		if (!ctx) return;
		
		ctx.clearRect(0, 0, canvasRef.width, canvasRef.height);
		
		// Update and draw floating elements
		for (let i = floatingElements.length - 1; i >= 0; i--) {
			const el = floatingElements[i];
			
			// Update position
			el.y += el.fallSpeed;
			el.rotation += el.rotationSpeed;
			el.phase += el.swaySpeed * 0.02;
			
			// Swaying motion
			const swayX = Math.sin(el.phase) * el.swayAmplitude;
			
			// Draw element
			if (el.type === 'lotus') {
				drawLotus(ctx, el.x + swayX, el.y, el.size, el.rotation, el.opacity);
			} else if (el.type === 'petal') {
				drawPetal(ctx, el.x + swayX, el.y, el.size, el.rotation, el.opacity);
			} else {
				drawLeaf(ctx, el.x + swayX, el.y, el.size, el.rotation, el.opacity);
			}
			
			// Remove if off screen
			if (el.y > (canvasRef?.height || 800) + 50) {
				floatingElements.splice(i, 1);
			}
		}
		
		// Spawn new elements
		if (floatingElements.length < 15 && Math.random() > 0.97) {
			floatingElements.push(createFloatingElement());
		}
		
		animationFrameId = requestAnimationFrame(animate);
	}

	function handleResize() {
		if (canvasRef) {
			canvasRef.width = window.innerWidth;
			canvasRef.height = window.innerHeight;
		}
	}

	function handleMouseMove(e: MouseEvent) {
		mouseX = e.clientX;
		mouseY = e.clientY;
	}

	onMount(() => {
		if (!browser) return;
		
		handleResize();
		window.addEventListener('resize', handleResize);
		window.addEventListener('mousemove', handleMouseMove);
		
		// Initialize with some elements
		for (let i = 0; i < 8; i++) {
			const el = createFloatingElement();
			el.y = Math.random() * (canvasRef?.height || 800);
			floatingElements.push(el);
		}
		
		animate();
	});

	onDestroy(() => {
		if (animationFrameId) {
			cancelAnimationFrame(animationFrameId);
		}
		if (browser) {
			window.removeEventListener('resize', handleResize);
			window.removeEventListener('mousemove', handleMouseMove);
		}
	});
</script>

<div class="min-h-screen bg-zen-cream relative overflow-hidden flex flex-col">
	<!-- Animated Background Canvas -->
	<canvas
		bind:this={canvasRef}
		class="absolute inset-0 w-full h-full pointer-events-none"
	></canvas>

	<!-- Ambient Light Orbs -->
	<div class="absolute inset-0 overflow-hidden pointer-events-none">
		<!-- Large slow-moving orb 1 -->
		<div 
			class="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-br from-zen-gold/10 to-transparent blur-3xl transition-transform duration-[8000ms] ease-out"
			style="top: -10%; left: -15%; transform: translate({mouseX * 0.02}px, {mouseY * 0.02}px);"
		></div>
		
		<!-- Large slow-moving orb 2 -->
		<div 
			class="absolute w-[400px] h-[400px] rounded-full bg-gradient-to-br from-zen-sage/10 to-transparent blur-3xl transition-transform duration-[10000ms] ease-out"
			style="bottom: -5%; right: -10%; transform: translate({-mouseX * 0.015}px, {-mouseY * 0.015}px);"
		></div>
		
		<!-- Small floating orb -->
		<div 
			class="absolute w-[200px] h-[200px] rounded-full bg-gradient-to-br from-zen-gold/5 to-transparent blur-2xl animate-float-slow"
			style="top: 30%; right: 20%;"
		></div>
	</div>

	<!-- Main Content -->
	<main class="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12">
		<!-- Hero Section -->
		<div class="flex flex-col items-center text-center">
			<!-- Animated Lotus Logo with Breathing Glow -->
			<div class="mb-10 relative">
				<!-- Outer glow rings -->
				<div class="absolute inset-0 flex items-center justify-center">
					<div class="w-32 h-32 rounded-full border border-zen-gold/10 animate-breathing-outer"></div>
				</div>
				<div class="absolute inset-0 flex items-center justify-center">
					<div class="w-28 h-28 rounded-full border border-zen-gold/15 animate-breathing-middle"></div>
				</div>
				
				<!-- Main logo container -->
				<div class="relative w-28 h-28 flex items-center justify-center">
					<!-- Breathing background -->
					<div class="absolute inset-0 rounded-full bg-gradient-to-br from-zen-gold/20 to-zen-gold/5 animate-breathing-core"></div>
					
					<!-- Lotus SVG -->
					<svg class="w-16 h-16 text-zen-gold animate-float-gentle" viewBox="0 0 80 80" fill="none">
						<defs>
							<linearGradient id="lotusGradient" x1="0%" y1="100%" x2="0%" y2="0%">
								<stop offset="0%" stop-color="#C9B896" stop-opacity="0.8"/>
								<stop offset="100%" stop-color="#E8DCC8" stop-opacity="1"/>
							</linearGradient>
							<filter id="lotusGlow">
								<feGaussianBlur stdDeviation="2" result="blur"/>
								<feMerge>
									<feMergeNode in="blur"/>
									<feMergeNode in="SourceGraphic"/>
								</feMerge>
							</filter>
						</defs>
						
						<!-- Outer petals -->
						<ellipse cx="40" cy="25" rx="8" ry="18" fill="url(#lotusGradient)" transform="rotate(0 40 50)"/>
						<ellipse cx="40" cy="25" rx="8" ry="18" fill="url(#lotusGradient)" transform="rotate(60 40 50)"/>
						<ellipse cx="40" cy="25" rx="8" ry="18" fill="url(#lotusGradient)" transform="rotate(120 40 50)"/>
						<ellipse cx="40" cy="25" rx="8" ry="18" fill="url(#lotusGradient)" transform="rotate(180 40 50)"/>
						<ellipse cx="40" cy="25" rx="8" ry="18" fill="url(#lotusGradient)" transform="rotate(240 40 50)"/>
						<ellipse cx="40" cy="25" rx="8" ry="18" fill="url(#lotusGradient)" transform="rotate(300 40 50)"/>
						
						<!-- Inner petals -->
						<ellipse cx="40" cy="30" rx="6" ry="14" fill="url(#lotusGradient)" opacity="0.9" transform="rotate(30 40 50)"/>
						<ellipse cx="40" cy="30" rx="6" ry="14" fill="url(#lotusGradient)" opacity="0.9" transform="rotate(90 40 50)"/>
						<ellipse cx="40" cy="30" rx="6" ry="14" fill="url(#lotusGradient)" opacity="0.9" transform="rotate(150 40 50)"/>
						<ellipse cx="40" cy="30" rx="6" ry="14" fill="url(#lotusGradient)" opacity="0.9" transform="rotate(210 40 50)"/>
						<ellipse cx="40" cy="30" rx="6" ry="14" fill="url(#lotusGradient)" opacity="0.9" transform="rotate(270 40 50)"/>
						<ellipse cx="40" cy="30" rx="6" ry="14" fill="url(#lotusGradient)" opacity="0.9" transform="rotate(330 40 50)"/>
						
						<!-- Center -->
						<circle cx="40" cy="50" r="6" fill="#C9B896" filter="url(#lotusGlow)"/>
					</svg>
				</div>
			</div>

			<!-- Title with elegant typography -->
			<h1 class="font-serif text-5xl md:text-6xl lg:text-7xl font-light text-zen-brown mb-4 tracking-wide">
				<span class="block">Tích Công Đức</span>
			</h1>

			<!-- Subtitle with poetic layout -->
			<div class="space-y-1 mb-14">
				<p class="text-zen-brown/50 text-lg md:text-xl font-light tracking-wide">
					Tích lũy công đức mỗi ngày
				</p>
				<p class="text-zen-brown/40 text-base md:text-lg font-extralight italic">
					Nuôi dưỡng tâm hồn an lạc
				</p>
			</div>

			<!-- CTA Button with premium glassmorphism -->
			<button
				onclick={() => goto('/auth')}
				class="group relative px-14 py-5 bg-zen-brown/90 backdrop-blur-md rounded-full font-medium text-lg text-zen-cream shadow-xl shadow-zen-brown/20 transition-all duration-500 hover:bg-zen-brown hover:shadow-2xl hover:shadow-zen-brown/30 hover:-translate-y-1 active:translate-y-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-zen-gold focus-visible:ring-offset-2 overflow-hidden"
			>
				<!-- Shine effect on hover -->
				<div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
				
				<span class="relative z-10 tracking-wide">Bắt đầu hành trình</span>
				
				<!-- Arrow icon -->
				<span class="absolute right-5 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
					<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<path d="M5 12h14M12 5l7 7-7 7"/>
					</svg>
				</span>
			</button>
		</div>

		<!-- Features Bento Grid -->
		<div class="mt-20 w-full max-w-3xl grid grid-cols-2 md:grid-cols-3 gap-4 stagger-children">
			<!-- Feature 1: Meditation -->
			<div class="bg-zen-parchment/60 backdrop-blur-sm rounded-2xl p-5 text-left border border-zen-brown/5 hover:border-zen-gold/20 transition-all duration-300 hover:shadow-lg hover:shadow-zen-gold/5">
				<div class="w-10 h-10 rounded-xl bg-zen-gold/10 flex items-center justify-center mb-3">
					<svg class="w-5 h-5 text-zen-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
						<circle cx="12" cy="12" r="10"/>
						<path d="M12 6v6l4 2"/>
					</svg>
				</div>
				<h3 class="font-medium text-zen-brown mb-1">Thiền định</h3>
				<p class="text-zen-brown/50 text-sm">Tĩnh tâm mỗi ngày</p>
			</div>

			<!-- Feature 2: Track Progress -->
			<div class="bg-zen-parchment/60 backdrop-blur-sm rounded-2xl p-5 text-left border border-zen-brown/5 hover:border-zen-sage/30 transition-all duration-300 hover:shadow-lg hover:shadow-zen-sage/5">
				<div class="w-10 h-10 rounded-xl bg-zen-sage/10 flex items-center justify-center mb-3">
					<svg class="w-5 h-5 text-zen-sage" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
						<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
					</svg>
				</div>
				<h3 class="font-medium text-zen-brown mb-1">Theo dõi</h3>
				<p class="text-zen-brown/50 text-sm">Tiến trình tu tập</p>
			</div>

			<!-- Feature 3: Community -->
			<div class="bg-zen-parchment/60 backdrop-blur-sm rounded-2xl p-5 text-left border border-zen-brown/5 hover:border-zen-gold/20 transition-all duration-300 hover:shadow-lg hover:shadow-zen-gold/5 col-span-2 md:col-span-1">
				<div class="w-10 h-10 rounded-xl bg-zen-gold/10 flex items-center justify-center mb-3">
					<svg class="w-5 h-5 text-zen-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
						<path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
						<circle cx="9" cy="7" r="4"/>
						<path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
					</svg>
				</div>
				<h3 class="font-medium text-zen-brown mb-1">Cộng đồng</h3>
				<p class="text-zen-brown/50 text-sm">Kết nối tâm hồn</p>
			</div>
		</div>
	</main>

	<!-- Footer Quote -->
	<footer class="relative z-10 py-8 text-center">
		<p class="text-zen-brown/30 text-sm font-light tracking-wider italic">
			"Hành trình ngàn dặm bắt đầu từ một bước chân"
		</p>
	</footer>
</div>

<style>
	/* Breathing animations */
	@keyframes breathing-core {
		0%, 100% {
			transform: scale(1);
			opacity: 0.8;
		}
		50% {
			transform: scale(1.1);
			opacity: 1;
		}
	}

	@keyframes breathing-middle {
		0%, 100% {
			transform: scale(1) rotate(0deg);
			opacity: 0.6;
		}
		50% {
			transform: scale(1.15) rotate(3deg);
			opacity: 0.8;
		}
	}

	@keyframes breathing-outer {
		0%, 100% {
			transform: scale(1) rotate(0deg);
			opacity: 0.4;
		}
		50% {
			transform: scale(1.2) rotate(-3deg);
			opacity: 0.6;
		}
	}

	@keyframes float-gentle {
		0%, 100% {
			transform: translateY(0) rotate(0deg);
		}
		25% {
			transform: translateY(-5px) rotate(2deg);
		}
		75% {
			transform: translateY(5px) rotate(-2deg);
		}
	}

	@keyframes float-slow {
		0%, 100% {
			transform: translateY(0) translateX(0);
		}
		33% {
			transform: translateY(-20px) translateX(10px);
		}
		66% {
			transform: translateY(10px) translateX(-10px);
		}
	}

	.animate-breathing-core {
		animation: breathing-core 4s ease-in-out infinite;
	}

	.animate-breathing-middle {
		animation: breathing-middle 5s ease-in-out infinite;
	}

	.animate-breathing-outer {
		animation: breathing-outer 6s ease-in-out infinite;
	}

	.animate-float-gentle {
		animation: float-gentle 6s ease-in-out infinite;
	}

	.animate-float-slow {
		animation: float-slow 12s ease-in-out infinite;
	}

	.font-serif {
		font-family: 'Playfair Display', Georgia, serif;
	}
</style>
