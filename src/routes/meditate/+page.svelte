<script lang="ts">
	import { goto } from '$app/navigation';
	import { ArrowLeft, Camera, CameraOff, AlertCircle } from 'lucide-svelte';
	import { onMount, onDestroy } from 'svelte';
	import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision';
	import { supabase } from '$lib/supabase';

	// State
	let videoElement: HTMLVideoElement;
	let canvasElement: HTMLCanvasElement;
	let auraCanvas: HTMLCanvasElement;
	let cameraActive = $state(false);
	let cameraError = $state<string | null>(null);
	let isLoading = $state(true);
	let handLandmarker: HandLandmarker | null = null;
	let animationFrameId: number;
	let lastTimestamp = -1;

	// Body tracking state
	let bodyCenterX = $state(0.5);
	let bodyCenterY = $state(0.5);
	let bodyWidth = $state(0.3);
	let bodyHeight = $state(0.5);
	let smoothedCenterX = 0.5;
	let smoothedCenterY = 0.5;

	// Meditation state
	let isPraying = $state(false);
	let prayerProgress = $state(0);
	let prayerStartTime: number | null = null;
	let totalMerits = $state(0);
	let showAuraFlash = $state(false);

	// Aura particles
	let auraParticles: Array<{
		x: number;
		y: number;
		vx: number;
		vy: number;
		life: number;
		maxLife: number;
		size: number;
	}> = [];

	// Audio
	let bellAudio: HTMLAudioElement;

	// Constants
	const PRAYING_THRESHOLD = 0.15;
	const PRAYING_TIME = 10;

	async function initializeHandLandmarker() {
		try {
			const vision = await FilesetResolver.forVisionTasks(
				'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
			);

			handLandmarker = await HandLandmarker.createFromOptions(vision, {
				baseOptions: {
					modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
					delegate: 'GPU'
				},
				runningMode: 'VIDEO',
				numHands: 2
			});

			console.log('HandLandmarker initialized successfully');
		} catch (error) {
			console.error('Failed to initialize HandLandmarker:', error);
			cameraError = 'Không thể khởi tạo bộ phát hiện tay. Vui lòng thử lại.';
		}
	}

	async function startCamera() {
		try {
			isLoading = true;
			cameraError = null;

			const stream = await navigator.mediaDevices.getUserMedia({
				video: {
					facingMode: 'user',
					width: { ideal: 1280 },
					height: { ideal: 720 }
				}
			});

			videoElement.srcObject = stream;
			await videoElement.play();

			if (!handLandmarker) {
				await initializeHandLandmarker();
			}

			cameraActive = true;
			isLoading = false;

			detectHands();
		} catch (error: any) {
			isLoading = false;
			if (error.name === 'NotAllowedError') {
				cameraError = 'Vui lòng cho phép truy cập camera để sử dụng tính năng này.';
			} else if (error.name === 'NotFoundError') {
				cameraError = 'Không tìm thấy camera trên thiết bị của bạn.';
			} else {
				cameraError = 'Đã xảy ra lỗi khi truy cập camera.';
			}
		}
	}

	function stopCamera() {
		if (videoElement?.srcObject) {
			const tracks = (videoElement.srcObject as MediaStream).getTracks();
			tracks.forEach(track => track.stop());
			videoElement.srcObject = null;
		}
		cameraActive = false;
	}

	function calculateDistance(point1: { x: number; y: number }, point2: { x: number; y: number }) {
		const dx = point1.x - point2.x;
		const dy = point1.y - point2.y;
		return Math.sqrt(dx * dx + dy * dy);
	}

	function detectHands() {
		if (!videoElement || !handLandmarker || !cameraActive) return;

		const renderLoop = (timestamp: number) => {
			if (lastTimestamp !== timestamp) {
				const results = handLandmarker.detectForVideo(videoElement, timestamp);
				lastTimestamp = timestamp;

				updateBodyTracking(results);
				drawHandLandmarks(results);
				drawAuraEffect();
				checkPrayingGesture(results);
			}

			if (cameraActive) {
				animationFrameId = requestAnimationFrame(renderLoop);
			}
		};

		animationFrameId = requestAnimationFrame(renderLoop);
	}

	function updateBodyTracking(results: any) {
		if (!results.landmarks || results.landmarks.length === 0) return;

		let minX = 1, maxX = 0, minY = 1, maxY = 0;
		let totalX = 0, totalY = 0;
		let pointCount = 0;

		for (const landmarks of results.landmarks) {
			for (const point of landmarks) {
				minX = Math.min(minX, point.x);
				maxX = Math.max(maxX, point.x);
				minY = Math.min(minY, point.y);
				maxY = Math.max(maxY, point.y);
				totalX += point.x;
				totalY += point.y;
				pointCount++;
			}
		}

		// Calculate body region from hands (expand outward)
		const centerX = totalX / pointCount;
		const centerY = totalY / pointCount;
		
		// Add margin for body silhouette
		const width = Math.max((maxX - minX) * 3, 0.25);
		const height = Math.max((maxY - minY) * 5, 0.4);
		
		// Adjust Y position (hands are usually above center, so move up)
		const adjustedY = Math.max(0.2, Math.min(0.8, centerY - height * 0.1));

		// Smooth the movement
		smoothedCenterX = smoothedCenterX * 0.7 + centerX * 0.3;
		smoothedCenterY = smoothedCenterY * 0.7 + adjustedY * 0.3;

		bodyCenterX = smoothedCenterX;
		bodyCenterY = smoothedCenterY;
		bodyWidth = width;
		bodyHeight = height;
	}

	function drawHandLandmarks(results: any) {
		const ctx = canvasElement?.getContext('2d');
		if (!ctx || !results || !canvasElement) return;

		ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);

		if (results.landmarks && results.landmarks.length > 0) {
			const color = isPraying ? '#C5A059' : 'rgba(255, 255, 255, 0.6)';
			
			for (const landmarks of results.landmarks) {
				const connections = [
					[0, 1], [1, 2], [2, 3], [3, 4],
					[0, 5], [5, 6], [6, 7], [7, 8],
					[0, 9], [9, 10], [10, 11], [11, 12],
					[0, 13], [13, 14], [14, 15], [15, 16],
					[0, 17], [17, 18], [18, 19], [19, 20],
					[5, 9], [9, 13], [13, 17]
				];

				ctx.strokeStyle = color;
				ctx.lineWidth = 3;

				for (const [start, end] of connections) {
					const startPoint = landmarks[start];
					const endPoint = landmarks[end];
					ctx.beginPath();
					ctx.moveTo(startPoint.x * canvasElement.width, startPoint.y * canvasElement.height);
					ctx.lineTo(endPoint.x * canvasElement.width, endPoint.y * canvasElement.height);
					ctx.stroke();
				}

				ctx.fillStyle = color;
				for (const point of landmarks) {
					ctx.beginPath();
					ctx.arc(point.x * canvasElement.width, point.y * canvasElement.height, 5, 0, 2 * Math.PI);
					ctx.fill();
				}
			}
		}
	}

	function drawAuraEffect() {
		const ctx = auraCanvas?.getContext('2d');
		if (!ctx || !auraCanvas) return;

		ctx.clearRect(0, 0, auraCanvas.width, auraCanvas.height);

		if (!isPraying && !showAuraFlash) return;

		const centerX = bodyCenterX * auraCanvas.width;
		const centerY = bodyCenterY * auraCanvas.height;
		const width = bodyWidth * auraCanvas.width;
		const height = bodyHeight * auraCanvas.height;

		if (showAuraFlash) {
			// Draw burst particles when merit triggers
			drawAuraBurst(ctx, centerX, centerY, width, height);
		} else {
			// Draw tracking body outline aura
			drawBodyOutlineAura(ctx, centerX, centerY, width, height);
		}

		// Draw floating particles
		drawParticles(ctx);
	}

	function drawBodyOutlineAura(ctx: CanvasRenderingContext2D, centerX: number, centerY: number, width: number, height: number) {
		// Create neon glow layers with cyan/blue gradient
		const layers = [
			{ scale: 1.6, alpha: 0.08, blur: 60 },
			{ scale: 1.4, alpha: 0.12, blur: 40 },
			{ scale: 1.25, alpha: 0.18, blur: 25 },
			{ scale: 1.15, alpha: 0.25, blur: 15 },
			{ scale: 1.0, alpha: 0.4, blur: 8 }
		];

		for (const layer of layers) {
			ctx.save();
			ctx.filter = `blur(${layer.blur}px)`;
			
			ctx.beginPath();
			ctx.ellipse(
				centerX,
				centerY + height * 0.1,
				width * layer.scale,
				height * layer.scale * 0.6,
				0,
				0,
				Math.PI * 2
			);
			
			// Neon gradient: cyan to blue
			const gradient = ctx.createRadialGradient(
				centerX, centerY - height * 0.2, 0,
				centerX, centerY, Math.max(width, height) * layer.scale * 1.5
			);
			gradient.addColorStop(0, `rgba(0, 255, 255, 0)`);
			gradient.addColorStop(0.3, `rgba(0, 200, 255, ${layer.alpha})`);
			gradient.addColorStop(0.6, `rgba(100, 150, 255, ${layer.alpha * 0.7})`);
			gradient.addColorStop(1, `rgba(150, 100, 255, 0)`);
			
			ctx.fillStyle = gradient;
			ctx.fill();
			ctx.restore();
		}

		// Draw inner neon ring - cyan glow
		ctx.save();
		ctx.beginPath();
		ctx.ellipse(
			centerX,
			centerY + height * 0.1,
			width * 1.3,
			height * 0.75,
			0,
			0,
			Math.PI * 2
		);
		ctx.strokeStyle = 'rgba(0, 255, 255, 0.6)';
		ctx.lineWidth = 2;
		ctx.shadowColor = '#00FFFF';
		ctx.shadowBlur = 20;
		ctx.stroke();
		ctx.restore();

		// Draw outer ring - purple accent
		ctx.save();
		ctx.beginPath();
		ctx.ellipse(
			centerX,
			centerY + height * 0.1,
			width * 1.5,
			height * 0.85,
			0,
			0,
			Math.PI * 2
		);
		ctx.strokeStyle = 'rgba(180, 100, 255, 0.4)';
		ctx.lineWidth = 1.5;
		ctx.shadowColor = '#B464FF';
		ctx.shadowBlur = 15;
		ctx.stroke();
		ctx.restore();

		// Add floating neon particles
		if (Math.random() > 0.6) {
			const angle = Math.random() * Math.PI * 2;
			const radius = width * (0.7 + Math.random() * 0.5);
			auraParticles.push({
				x: centerX + Math.cos(angle) * radius,
				y: centerY + Math.sin(angle) * radius * 0.7,
				vx: (Math.random() - 0.5) * 0.8,
				vy: -Math.random() * 1.5 - 0.8,
				life: 50,
				maxLife: 50,
				size: Math.random() * 3 + 2
			});
		}
	}

	function drawAuraBurst(ctx: CanvasRenderingContext2D, centerX: number, centerY: number, width: number, height: number) {
		// Create massive full-screen burst with neon colors
		const burstPhase = Math.min((Date.now() % 1500) / 1500, 1);
		
		// Layer 1: Giant cyan flash
		ctx.save();
		const flashSize1 = burstPhase * Math.max(ctx.canvas.width, ctx.canvas.height);
		const gradient1 = ctx.createRadialGradient(
			centerX, centerY, 0,
			centerX, centerY, flashSize1
		);
		gradient1.addColorStop(0, `rgba(0, 255, 255, ${(1 - burstPhase) * 0.8})`);
		gradient1.addColorStop(0.3, `rgba(100, 200, 255, ${(1 - burstPhase) * 0.5})`);
		gradient1.addColorStop(0.6, `rgba(150, 100, 255, ${(1 - burstPhase) * 0.3})`);
		gradient1.addColorStop(1, 'rgba(150, 100, 255, 0)');
		
		ctx.fillStyle = gradient1;
		ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		ctx.restore();

		// Layer 2: Expanding rings
		for (let i = 0; i < 5; i++) {
			const ringPhase = Math.max(0, burstPhase - i * 0.12);
			const scale = 1 + ringPhase * 4;
			const alpha = (1 - ringPhase) * 0.7;

			ctx.save();
			ctx.beginPath();
			ctx.ellipse(
				centerX,
				centerY + height * 0.1,
				width * scale,
				height * scale * 0.6,
				0,
				0,
				Math.PI * 2
			);
			
			// Alternate cyan and purple rings
			const ringColor = i % 2 === 0 ? `rgba(0, 255, 255, ${alpha})` : `rgba(180, 100, 255, ${alpha})`;
			ctx.strokeStyle = ringColor;
			ctx.lineWidth = 4 * (1 - ringPhase * 0.5);
			ctx.shadowColor = i % 2 === 0 ? '#00FFFF' : '#B464FF';
			ctx.shadowBlur = 30;
			ctx.stroke();
			ctx.restore();
		}

		// Layer 3: Massive particle explosion
		if (burstPhase < 0.7) {
			const particleCount = 30;
			for (let i = 0; i < particleCount; i++) {
				const angle = (i / particleCount) * Math.PI * 2;
				const speed = 5 + Math.random() * 8;
				const dist = burstPhase * Math.max(ctx.canvas.width, ctx.canvas.height) * 0.6;
				
				auraParticles.push({
					x: centerX + Math.cos(angle) * dist,
					y: centerY + Math.sin(angle) * dist * 0.6,
					vx: Math.cos(angle) * speed * 0.5,
					vy: Math.sin(angle) * speed * 0.3,
					life: 60,
					maxLife: 60,
					size: Math.random() * 6 + 4
				});
			}
		}
	}

	function drawParticles(ctx: CanvasRenderingContext2D) {
		for (let i = auraParticles.length - 1; i >= 0; i--) {
			const p = auraParticles[i];
			
			p.x += p.vx;
			p.y += p.vy;
			p.life--;

			if (p.life <= 0) {
				auraParticles.splice(i, 1);
				continue;
			}

			const alpha = p.life / p.maxLife;
			
			// Alternate cyan and purple particles
			const hue = Math.random() > 0.5 ? 180 : 280; // Cyan or Purple
			
			ctx.save();
			ctx.beginPath();
			ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2);
			ctx.fillStyle = `hsla(${hue}, 100%, 70%, ${alpha * 0.9})`;
			ctx.shadowColor = hue === 180 ? '#00FFFF' : '#B464FF';
			ctx.shadowBlur = 15;
			ctx.fill();
			ctx.restore();
		}
	}

	function checkPrayingGesture(results: any) {
		if (!results.landmarks || results.landmarks.length < 2) {
			if (isPraying) {
				resetPrayerTimer();
			}
			return;
		}

		const hand1 = results.landmarks[0];
		const hand2 = results.landmarks[1];

		const wrist1 = hand1[0];
		const wrist2 = hand2[0];
		const index1 = hand1[8];
		const index2 = hand2[8];

		const wristDistance = calculateDistance(wrist1, wrist2);
		const indexDistance = calculateDistance(index1, index2);

		const currentlyPraying = wristDistance < PRAYING_THRESHOLD && indexDistance < PRAYING_THRESHOLD;

		if (currentlyPraying && !isPraying) {
			isPraying = true;
			prayerStartTime = Date.now();
			startPrayerTimer();
		} else if (!currentlyPraying && isPraying) {
			resetPrayerTimer();
		}
	}

	function startPrayerTimer() {
		if (prayerStartTime === null) return;

		let lastTriggeredAt = 0; // Track last merit trigger time

		const interval = setInterval(() => {
			if (!isPraying || !prayerStartTime) {
				clearInterval(interval);
				return;
			}

			const elapsed = (Date.now() - prayerStartTime) / 1000;
			prayerProgress = elapsed % PRAYING_TIME;

			// Trigger merit every 10 seconds of continuous prayer
			// Use a small buffer (0.15s) to handle timing edge cases
			if (elapsed >= lastTriggeredAt + PRAYING_TIME - 0.15) {
				lastTriggeredAt = Math.floor(elapsed / PRAYING_TIME) * PRAYING_TIME;
				triggerMeritCycle();
			}
		}, 100);

		return () => clearInterval(interval);
	}

	function triggerMeritCycle() {
		if (bellAudio) {
			bellAudio.currentTime = 0;
			bellAudio.play().catch(console.error);
		}

		showAuraFlash = true;
		
		// Spawn massive burst particles
		const centerX = bodyCenterX * auraCanvas.width;
		const centerY = bodyCenterY * auraCanvas.height;
		const maxDist = Math.max(auraCanvas.width, auraCanvas.height) * 0.4;
		
		for (let i = 0; i < 40; i++) {
			const angle = Math.random() * Math.PI * 2;
			const speed = 3 + Math.random() * 6;
			auraParticles.push({
				x: centerX,
				y: centerY,
				vx: Math.cos(angle) * speed,
				vy: Math.sin(angle) * speed * 0.6,
				life: 80 + Math.random() * 40,
				maxLife: 120,
				size: Math.random() * 6 + 3
			});
		}

		setTimeout(() => {
			showAuraFlash = false;
		}, 2000);

		saveMerit();
		totalMerits++;
	}

	function resetPrayerTimer() {
		isPraying = false;
		prayerStartTime = null;
		prayerProgress = 0;
	}

	function saveMerit() {
		const isGuest = localStorage.getItem('isGuest') === 'true';

		if (isGuest) {
			const currentMerit = parseInt(localStorage.getItem('guestMerit') || '0');
			localStorage.setItem('guestMerit', String(currentMerit + 1));
		} else {
			saveMeritToSupabase();
		}
	}

	async function saveMeritToSupabase() {
		try {
			const { data: { user } } = await supabase.auth.getUser();
			if (!user) {
				console.log('User not logged in, skipping merit save');
				return;
			}

			// Log the merit
			const { error: logError } = await supabase
				.from('merit_logs')
				.insert({
					user_id: user.id,
					merits_earned: 1,
					duration_seconds: PRAYING_TIME
				});

			if (logError) {
				console.error('Error logging merit:', logError);
			}

			// Update profile using RPC function for atomic operation
			const { error: rpcError } = await supabase.rpc('add_merit', {
				p_user_id: user.id,
				p_merits: 1,
				p_duration: PRAYING_TIME
			});

			if (rpcError) {
				console.error('Error updating merit count:', rpcError);
			}
		} catch (error) {
			console.error('Error saving merit to Supabase:', error);
		}
	}

	function handleRetryCamera() {
		cameraError = null;
		startCamera();
	}

	function handleGuestMode() {
		goto('/setup-profile');
	}

	onMount(() => {
		bellAudio = new Audio('/bell.mp3');
		bellAudio.volume = 0.7;
		startCamera();
	});

	onDestroy(() => {
		if (animationFrameId) {
			cancelAnimationFrame(animationFrameId);
		}
		stopCamera();
	});

	let circleProgress = $derived({
		strokeDashoffset: 565.48 - (prayerProgress / PRAYING_TIME) * 565.48
	});
</script>

<div class="min-h-screen bg-zen-brown relative overflow-hidden">
	<!-- Camera Feed -->
	<div class="absolute inset-0">
		<video
			bind:this={videoElement}
			class="w-full h-full object-cover"
			style="filter: brightness(0.85); transform: scaleX(-1);"
			playsinline
			muted
		></video>
	</div>

	<!-- Aura Canvas (body tracking glow) -->
	<canvas
		bind:this={auraCanvas}
		class="absolute inset-0 w-full h-full pointer-events-none"
		width={1280}
		height={720}
		style="transform: scaleX(-1);"
	></canvas>

	<!-- Hand Landmarks Canvas -->
	<canvas
		bind:this={canvasElement}
		class="absolute inset-0 w-full h-full"
		width={1280}
		height={720}
		style="transform: scaleX(-1);"
	></canvas>

	<!-- Cinematic Overlay -->
	<div class="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50 pointer-events-none"></div>

	<!-- Header -->
	<header class="relative z-30 px-4 py-4 flex items-center justify-between">
		<button 
			onclick={() => goto('/dashboard')}
			class="p-2 rounded-full bg-black/30 backdrop-blur-sm text-white/80 hover:bg-black/50 transition-colors"
		>
			<ArrowLeft class="w-6 h-6" />
		</button>
		
		<div class="flex items-center gap-4">
			{#if totalMerits > 0}
				<div class="px-3 py-1 rounded-full bg-zen-gold/20 border border-zen-gold/30">
					<span class="text-zen-gold font-medium text-sm">{totalMerits} công đức</span>
				</div>
			{/if}
		</div>

		<div class="w-10"></div>
	</header>

	<!-- Main Content -->
	<main class="relative z-20 flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
		
		<!-- Loading State -->
		{#if isLoading && !cameraError}
			<div class="text-center">
				<div class="w-20 h-20 mx-auto mb-6 rounded-full bg-white/10 flex items-center justify-center">
					<Camera class="w-10 h-10 text-white/60 animate-pulse" />
				</div>
				<p class="text-white/60">Đang khởi động camera...</p>
			</div>
		{/if}

		<!-- Error State -->
		{#if cameraError}
			<div class="text-center px-6">
				<div class="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center">
					<CameraOff class="w-10 h-10 text-red-400" />
				</div>
				<p class="text-red-300 mb-2 flex items-center justify-center gap-2">
					<AlertCircle class="w-5 h-5" />
					{cameraError}
				</p>
				<div class="flex gap-3 justify-center mt-6">
					<button
						onclick={handleRetryCamera}
						class="px-6 py-3 bg-zen-gold text-zen-brown rounded-full font-medium hover:bg-zen-gold/90 transition-colors"
					>
						Thử lại
					</button>
					<button
						onclick={handleGuestMode}
						class="px-6 py-3 bg-white/10 text-white rounded-full font-medium hover:bg-white/20 transition-colors"
					>
						Dùng thử
					</button>
				</div>
			</div>
		{/if}

		<!-- Praying Timer -->
		{#if cameraActive && !cameraError}
			<div class="text-center">
				<!-- Thin Circular Progress -->
				<div class="relative w-48 h-48 mx-auto">
					<svg class="w-full h-full -rotate-90" viewBox="0 0 200 200">
						<circle
							cx="100"
							cy="100"
							r="90"
							fill="none"
							stroke="rgba(255,255,255,0.1)"
							stroke-width="4"
						/>
						<circle
							cx="100"
							cy="100"
							r="90"
							fill="none"
							stroke={isPraying ? '#C5A059' : 'rgba(255,255,255,0.4)'}
							stroke-width="4"
							stroke-linecap="round"
							stroke-dasharray="565.48"
							stroke-dashoffset={circleProgress.strokeDashoffset}
							class="transition-all duration-100"
						/>
					</svg>
					
					<div class="absolute inset-0 flex flex-col items-center justify-center">
						<span class="text-5xl font-serif font-bold text-white">
							{Math.ceil(PRAYING_TIME - prayerProgress)}
						</span>
						{#if isPraying}
							<span class="text-zen-gold text-sm mt-1">Đang cầu nguyện</span>
						{:else}
							<span class="text-white/40 text-xs mt-1">Chờ đợi</span>
						{/if}
					</div>
				</div>

				{#if !isPraying}
					<div class="mt-8 px-6">
						<p class="text-white/60 text-center">
							Chắp hai tay trước ngực<br />
							<span class="text-zen-gold text-sm">Giữ yên trong 10 giây liên tục</span>
						</p>
					</div>
				{:else}
					<div class="mt-6">
						<p class="text-zen-gold/80 text-sm">
							Giữ nguyên tư thế... {Math.ceil(PRAYING_TIME - prayerProgress)}s
						</p>
					</div>
				{/if}
			</div>
		{/if}
	</main>

	<!-- Bottom Hint -->
	{#if cameraActive && !cameraError}
		<div class="absolute bottom-8 left-0 right-0 text-center z-30">
			{#if !isPraying}
				<p class="text-white/30 text-xs">
					Đưa hai tay vào khung hình để bắt đầu
				</p>
			{:else}
				<p class="text-zen-gold/40 text-xs">
					Tách tay ra để dừng
				</p>
			{/if}
		</div>
	{/if}
</div>

<style>
	.font-serif {
		font-family: 'Playfair Display', Georgia, serif;
	}
</style>
