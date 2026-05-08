<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';

	let { showEffects = true, burstTrigger = 0 }: { showEffects?: boolean; burstTrigger?: number } = $props();

	let canvasRef: HTMLCanvasElement;
	let animationFrameId: number;
	
	// Floating zen elements
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
		color: string;
	}> = [];

	// Fireflies
	let fireflies: Array<{
		x: number;
		y: number;
		vx: number;
		vy: number;
		size: number;
		opacity: number;
		targetOpacity: number;
		pulsePhase: number;
		color: string;
	}> = [];

	// Ambient particles
	let particles: Array<{
		x: number;
		y: number;
		size: number;
		opacity: number;
		speed: number;
		life: number;
		maxLife: number;
		type: 'dust' | 'sparkle';
	}> = [];

	let burstMode = false;
	let burstStartTime = 0;
	let lastBurstTrigger = 0;

	$effect(() => {
		if (burstTrigger > lastBurstTrigger) {
			triggerBurst();
			lastBurstTrigger = burstTrigger;
		}
	});

	function createFloatingElement(startFromTop = false) {
		const types: ('lotus' | 'petal' | 'leaf')[] = ['lotus', 'petal', 'petal', 'petal', 'leaf'];
		const colors = [
			'rgba(201, 184, 150, 0.4)',
			'rgba(232, 220, 200, 0.5)',
			'rgba(180, 160, 130, 0.35)',
			'rgba(156, 175, 136, 0.3)',
		];
		
		return {
			x: Math.random() * (canvasRef?.width || 1200),
			y: startFromTop ? -50 - Math.random() * 100 : Math.random() * (canvasRef?.height || 800),
			size: 12 + Math.random() * 20,
			rotation: Math.random() * 360,
			rotationSpeed: (Math.random() - 0.5) * 1.5,
			fallSpeed: 0.2 + Math.random() * 0.4,
			swayAmplitude: 15 + Math.random() * 35,
			swaySpeed: 0.3 + Math.random() * 0.8,
			phase: Math.random() * Math.PI * 2,
			opacity: 0.2 + Math.random() * 0.25,
			type: types[Math.floor(Math.random() * types.length)],
			color: colors[Math.floor(Math.random() * colors.length)]
		};
	}

	function createFirefly() {
		return {
			x: Math.random() * (canvasRef?.width || 1200),
			y: Math.random() * (canvasRef?.height || 800),
			vx: (Math.random() - 0.5) * 0.5,
			vy: (Math.random() - 0.5) * 0.5,
			size: 2 + Math.random() * 3,
			opacity: 0,
			targetOpacity: 0.3 + Math.random() * 0.5,
			pulsePhase: Math.random() * Math.PI * 2,
			color: Math.random() > 0.5 ? 'rgba(255, 248, 200, 0.8)' : 'rgba(201, 184, 150, 0.6)'
		};
	}

	function triggerBurst() {
		burstMode = true;
		burstStartTime = Date.now();
		
		for (let i = 0; i < 30; i++) {
			const angle = (i / 30) * Math.PI * 2;
			const speed = 1 + Math.random() * 2;
			particles.push({
				x: (canvasRef?.width || 1200) / 2,
				y: (canvasRef?.height || 800) / 2,
				size: 3 + Math.random() * 5,
				opacity: 0.8,
				speed: speed,
				life: 100 + Math.random() * 50,
				maxLife: 150,
				type: 'sparkle'
			});
		}
		
		for (let i = 0; i < 5; i++) {
			const el = createFloatingElement(false);
			el.size = 20 + Math.random() * 15;
			el.fallSpeed = 0.5 + Math.random() * 0.5;
			el.opacity = 0.5;
			floatingElements.push(el);
		}
	}

	function drawLotus(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, rotation: number, color: string) {
		ctx.save();
		ctx.translate(x, y);
		ctx.rotate((rotation * Math.PI) / 180);
		
		const scale = size / 40;
		const baseColor = color.replace(/[\d.]+\)$/, '');
		
		for (let i = 0; i < 5; i++) {
			const angle = (i / 5) * Math.PI * 2;
			ctx.save();
			ctx.rotate(angle);
			ctx.beginPath();
			ctx.ellipse(0, -12 * scale, 6 * scale, 15 * scale, 0, 0, Math.PI * 2);
			ctx.fillStyle = `${baseColor}0.4)`;
			ctx.fill();
			ctx.restore();
		}
		
		for (let i = 0; i < 4; i++) {
			const angle = (i / 4) * Math.PI * 2 + Math.PI / 4;
			ctx.save();
			ctx.rotate(angle);
			ctx.beginPath();
			ctx.ellipse(0, -8 * scale, 5 * scale, 12 * scale, 0, 0, Math.PI * 2);
			ctx.fillStyle = `${baseColor}0.6)`;
			ctx.fill();
			ctx.restore();
		}
		
		ctx.beginPath();
		ctx.arc(0, 0, 4 * scale, 0, Math.PI * 2);
		ctx.fillStyle = `${baseColor}0.8)`;
		ctx.fill();
		
		ctx.restore();
	}

	function drawPetal(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, rotation: number, color: string) {
		ctx.save();
		ctx.translate(x, y);
		ctx.rotate((rotation * Math.PI) / 180);
		
		ctx.beginPath();
		ctx.moveTo(0, -size);
		ctx.bezierCurveTo(size * 0.5, -size * 0.4, size * 0.5, size * 0.4, 0, size);
		ctx.bezierCurveTo(-size * 0.5, size * 0.4, -size * 0.5, -size * 0.4, 0, -size);
		
		const gradient = ctx.createLinearGradient(0, -size, 0, size);
		gradient.addColorStop(0, color);
		gradient.addColorStop(1, 'rgba(201, 184, 150, 0.2)');
		ctx.fillStyle = gradient;
		ctx.fill();
		
		ctx.restore();
	}

	function drawLeaf(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, rotation: number, color: string) {
		ctx.save();
		ctx.translate(x, y);
		ctx.rotate((rotation * Math.PI) / 180);
		
		ctx.beginPath();
		ctx.moveTo(0, -size);
		ctx.bezierCurveTo(size * 0.7, -size * 0.2, size * 0.7, size * 0.3, 0, size);
		ctx.bezierCurveTo(-size * 0.7, size * 0.3, -size * 0.7, -size * 0.2, 0, -size);
		ctx.fillStyle = color;
		ctx.fill();
		
		ctx.beginPath();
		ctx.moveTo(0, -size * 0.8);
		ctx.lineTo(0, size * 0.6);
		ctx.strokeStyle = 'rgba(120, 140, 100, 0.4)';
		ctx.lineWidth = 0.8;
		ctx.stroke();
		
		ctx.restore();
	}

	function drawFirefly(ctx: CanvasRenderingContext2D, ff: typeof fireflies[0]) {
		const glowGradient = ctx.createRadialGradient(ff.x, ff.y, 0, ff.x, ff.y, ff.size * 4);
		glowGradient.addColorStop(0, ff.color);
		glowGradient.addColorStop(0.3, ff.color.replace(/[\d.]+\)$/, `${ff.opacity * 0.3})`));
		glowGradient.addColorStop(1, 'rgba(255, 248, 200, 0)');
		
		ctx.beginPath();
		ctx.arc(ff.x, ff.y, ff.size * 4, 0, Math.PI * 2);
		ctx.fillStyle = glowGradient;
		ctx.fill();
		
		ctx.beginPath();
		ctx.arc(ff.x, ff.y, ff.size, 0, Math.PI * 2);
		ctx.fillStyle = `rgba(255, 255, 240, ${ff.opacity})`;
		ctx.fill();
	}

	function animate() {
		if (!canvasRef || !showEffects) {
			animationFrameId = requestAnimationFrame(animate);
			return;
		}
		
		const ctx = canvasRef.getContext('2d');
		if (!ctx) return;
		
		ctx.clearRect(0, 0, canvasRef.width, canvasRef.height);
		
		const now = Date.now();
		const burstElapsed = burstMode ? now - burstStartTime : 0;
		if (burstMode && burstElapsed > 4000) {
			burstMode = false;
		}
		
		for (let i = floatingElements.length - 1; i >= 0; i--) {
			const el = floatingElements[i];
			
			el.y += el.fallSpeed;
			el.rotation += el.rotationSpeed;
			el.phase += el.swaySpeed * 0.02;
			
			const swayX = Math.sin(el.phase) * el.swayAmplitude;
			
			if (el.type === 'lotus') {
				drawLotus(ctx, el.x + swayX, el.y, el.size, el.rotation, el.color);
			} else if (el.type === 'petal') {
				drawPetal(ctx, el.x + swayX, el.y, el.size, el.rotation, el.color);
			} else {
				drawLeaf(ctx, el.x + swayX, el.y, el.size, el.rotation, el.color);
			}
			
			if (el.y > (canvasRef?.height || 800) + 50) {
				floatingElements.splice(i, 1);
			}
		}
		
		for (const ff of fireflies) {
			ff.x += ff.vx;
			ff.y += ff.vy;
			
			ff.vx += (Math.random() - 0.5) * 0.02;
			ff.vy += (Math.random() - 0.5) * 0.02;
			
			if (ff.x < 0 || ff.x > canvasRef?.width || ff.y < 0 || ff.y > canvasRef?.height) {
				ff.x = Math.random() * (canvasRef?.width || 1200);
				ff.y = Math.random() * (canvasRef?.height || 800);
			}
			
			ff.pulsePhase += 0.05;
			ff.opacity = ff.targetOpacity * (0.5 + 0.5 * Math.sin(ff.pulsePhase));
			
			drawFirefly(ctx, ff);
		}
		
		for (let i = particles.length - 1; i >= 0; i--) {
			const p = particles[i];
			
			p.x += Math.cos(i) * p.speed;
			p.y += Math.sin(i) * p.speed - 0.5;
			p.life--;
			p.opacity = (p.life / p.maxLife) * 0.8;
			p.size *= 0.995;
			
			if (p.life <= 0 || p.size < 0.5) {
				particles.splice(i, 1);
				continue;
			}
			
			const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
			gradient.addColorStop(0, `rgba(255, 248, 230, ${p.opacity})`);
			gradient.addColorStop(0.5, `rgba(201, 184, 150, ${p.opacity * 0.5})`);
			gradient.addColorStop(1, 'rgba(201, 184, 150, 0)');
			
			ctx.beginPath();
			ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
			ctx.fillStyle = gradient;
			ctx.fill();
		}
		
		if (floatingElements.length < 12 && Math.random() > 0.98) {
			floatingElements.push(createFloatingElement(true));
		}
		
		if (fireflies.length < 8 && Math.random() > 0.99) {
			fireflies.push(createFirefly());
		}
		
		if (particles.length < 20 && Math.random() > 0.95) {
			particles.push({
				x: Math.random() * (canvasRef?.width || 1200),
				y: (canvasRef?.height || 800) + 10,
				size: 1 + Math.random() * 2,
				opacity: 0.2 + Math.random() * 0.2,
				speed: 0.2 + Math.random() * 0.3,
				life: 200 + Math.random() * 100,
				maxLife: 300,
				type: 'dust'
			});
		}
		
		animationFrameId = requestAnimationFrame(animate);
	}

	function handleResize() {
		if (canvasRef) {
			canvasRef.width = window.innerWidth;
			canvasRef.height = window.innerHeight;
		}
	}

	onMount(() => {
		if (!browser) return;
		
		handleResize();
		window.addEventListener('resize', handleResize);
		
		for (let i = 0; i < 6; i++) {
			floatingElements.push(createFloatingElement(false));
		}
		
		for (let i = 0; i < 5; i++) {
			fireflies.push(createFirefly());
		}
		
		animate();
	});

	onDestroy(() => {
		if (animationFrameId) {
			cancelAnimationFrame(animationFrameId);
		}
		if (browser) {
			window.removeEventListener('resize', handleResize);
		}
	});
</script>

<canvas
	bind:this={canvasRef}
	class="absolute inset-0 w-full h-full pointer-events-none z-10"
></canvas>
