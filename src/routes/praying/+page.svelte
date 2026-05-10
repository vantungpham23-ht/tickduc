<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { goto } from '$app/navigation';
	import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision';
	import { supabase } from '$lib/supabase';
	import { currentTheme } from '$lib/stores/theme';

	// State
	let videoElement: HTMLVideoElement | undefined;
	let canvasElement: HTMLCanvasElement | undefined;
	let cameraActive = $state(false);
	let cameraError = $state<string | null>(null);
	let isLoading = $state(true);
	let handLandmarker: HandLandmarker | null = null;
	let animationFrameId: number;
	let lastTimestamp = -1;

	// Prayer state
	let isPraying = $state(false);
	let wasPraying = $state(false);
	let prayerProgress = $state(0);
	let handDetected = $state(false);

	// Audio
	let audioContext: AudioContext | null = null;
	let bellBuffer: AudioBuffer | null = null;

	// Toast
	let showMeritToast = $state(false);
	let toastTimeout: ReturnType<typeof setTimeout>;

	// Constants
	const PRAYING_DURATION = 10;
	const PRAYING_THRESHOLD = 0.2;

	async function loadAudioFiles() {
		try {
			audioContext = new AudioContext();
			const response = await fetch('/bell.mp3');
			const data = await response.arrayBuffer();
			bellBuffer = await audioContext.decodeAudioData(data);
		} catch (error) {
			console.error('Error loading audio:', error);
		}
	}

	function playSound(volume: number = 0.8) {
		if (!audioContext || !bellBuffer) return;
		if (audioContext.state === 'suspended') audioContext.resume();

		const source = audioContext.createBufferSource();
		const gainNode = audioContext.createGain();
		source.buffer = bellBuffer;
		gainNode.gain.value = volume;
		source.connect(gainNode);
		gainNode.connect(audioContext.destination);
		source.start(0);
	}

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
			startDetection();
		} catch (error) {
			cameraError = 'Không thể khởi tạo bộ phát hiện tay.';
		}
	}

	async function startCamera() {
		isLoading = true;
		cameraError = null;
		await loadAudioFiles();

		try {
			const stream = await navigator.mediaDevices.getUserMedia({
				video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } }
			});
			if (!videoElement) { isLoading = false; return; }

			videoElement.srcObject = stream;
			await videoElement.play();
			cameraActive = true;
			initializeHandLandmarker();
		} catch (error: any) {
			if (error.name === 'NotAllowedError') {
				cameraError = 'Vui lòng cho phép truy cập camera.';
			} else {
				cameraError = 'Đã xảy ra lỗi khi truy cập camera.';
			}
		} finally {
			isLoading = false;
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

	function calculateDistance(p1: { x: number; y: number }, p2: { x: number; y: number }) {
		return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
	}

	function startDetection() {
		if (!videoElement || !handLandmarker || !cameraActive) return;

		const renderLoop = (timestamp: number) => {
			if (lastTimestamp !== timestamp && videoElement && handLandmarker) {
				const results = handLandmarker.detectForVideo(videoElement, timestamp);
				lastTimestamp = timestamp;
				drawHandLandmarks(results);
				processGesture(results);
			}
			if (cameraActive) animationFrameId = requestAnimationFrame(renderLoop);
		};
		animationFrameId = requestAnimationFrame(renderLoop);
	}

	function drawHandLandmarks(results: any) {
		const ctx = canvasElement?.getContext('2d');
		if (!ctx || !results || !canvasElement) return;

		ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);

		if (results.landmarks && results.landmarks.length > 0) {
			const color = `rgba(${parseInt($currentTheme.primary.slice(1,3), 16)}, ${parseInt($currentTheme.primary.slice(3,5), 16)}, ${parseInt($currentTheme.primary.slice(5,7), 16)}, 0.6)`;

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
				ctx.lineWidth = 2;
				ctx.lineCap = 'round';
				ctx.lineJoin = 'round';

				for (const [start, end] of connections) {
					const s = landmarks[start];
					const e = landmarks[end];
					ctx.beginPath();
					ctx.moveTo(s.x * canvasElement.width, s.y * canvasElement.height);
					ctx.lineTo(e.x * canvasElement.width, e.y * canvasElement.height);
					ctx.stroke();
				}

				// Draw all landmarks as dots
				for (let i = 0; i < landmarks.length; i++) {
					const point = landmarks[i];
					ctx.fillStyle = color;
					ctx.beginPath();
					ctx.arc(point.x * canvasElement.width, point.y * canvasElement.height, 3, 0, 2 * Math.PI);
					ctx.fill();
				}
			}
		}
	}

	function processGesture(results: any) {
		if (!results.landmarks || results.landmarks.length < 2) {
			handDetected = false;
			if (isPraying) exitPrayer();
			return;
		}

		handDetected = true;

		// Lấy 2 tay
		const hand1 = results.landmarks[0];
		const hand2 = results.landmarks[1];

		// Tính khoảng cách trung bình giữa các điểm tương ứng của 2 tay
		let totalDistance = 0;
		for (let i = 0; i < 5; i++) {
			// So sánh ngón tay tương ứng (0-4 là ngón cái tới ngón út)
			const tip1 = hand1[i * 4 + 4]; // đầu ngón
			const tip2 = hand2[i * 4 + 4];
			totalDistance += calculateDistance(tip1, tip2);
		}

		const avgDistance = totalDistance / 5;
		const nowPraying = avgDistance < PRAYING_THRESHOLD;

		if (nowPraying && !wasPraying) enterPrayer();
		else if (!nowPraying && wasPraying) exitPrayer();
		wasPraying = nowPraying;
	}

	let prayerInterval: ReturnType<typeof setInterval> | null = null;

	function enterPrayer() {
		isPraying = true;
		prayerProgress = 0;
		const step = 100 / PRAYING_DURATION;
		prayerInterval = setInterval(() => {
			prayerProgress += step;
			if (prayerProgress >= 100) completePrayer();
		}, 1000);
	}

	function exitPrayer() {
		isPraying = false;
		prayerProgress = 0;
		if (prayerInterval) { clearInterval(prayerInterval); prayerInterval = null; }
	}

	function completePrayer() {
		exitPrayer();
		playSound(0.85);
		saveMerit();
		showMeritToast = true;
		clearTimeout(toastTimeout);
		toastTimeout = setTimeout(() => { showMeritToast = false; }, 3000);
	}

	async function saveMerit() {
		try {
			const isGuest = localStorage.getItem('isGuest') === 'true';
			if (isGuest) {
				const current = parseInt(localStorage.getItem('guestMerit') || '0');
				localStorage.setItem('guestMerit', String(current + 1));
				return;
			}
			const { data: { user } } = await supabase.auth.getUser();
			if (!user) return;
			await supabase.from('merit_logs').insert({
				user_id: user.id, merits_earned: 1, merit_type: 'praying', duration_seconds: PRAYING_DURATION
			});
			await supabase.rpc('add_merit', { p_user_id: user.id, p_merits: 1, p_duration: PRAYING_DURATION });
		} catch (error) { console.error('Error saving merit:', error); }
	}

	let remainingSeconds = $derived(Math.ceil(PRAYING_DURATION * (1 - prayerProgress / 100)));
	let progressPercent = $derived(prayerProgress);

	// Particle animation
	let particles = $state<Array<{id: number, x: number, y: number, size: number, rotation: number, delay: number, type: 'petal' | 'leaf'}>>([]);

	function createParticles() {
		particles = [];
		for (let i = 0; i < 15; i++) {
			particles.push({
				id: i,
				x: Math.random() * 100,
				y: -10 + Math.random() * 20,
				size: 8 + Math.random() * 12,
				rotation: Math.random() * 360,
				delay: Math.random() * 8,
				type: Math.random() > 0.5 ? 'petal' : 'leaf'
			});
		}
	}

	onMount(() => { 
		startCamera(); 
		createParticles();
	});
	onDestroy(() => {
		if (animationFrameId) cancelAnimationFrame(animationFrameId);
		stopCamera();
		if (audioContext) audioContext.close();
		clearTimeout(toastTimeout);
		if (prayerInterval) clearInterval(prayerInterval);
	});
</script>

<div class="fixed inset-0 bg-black flex flex-col">
	<!-- Particle Animation Layer -->
	<div class="fixed inset-0 z-30 pointer-events-none overflow-hidden">
		{#each particles as particle (particle.id)}
			<div
				class="absolute"
				style="
					left: {particle.x}%;
					top: {particle.y}%;
					animation: fall linear infinite;
					animation-duration: {10 + Math.random() * 5}s;
					animation-delay: {particle.delay}s;
					opacity: 0.4;
				"
			>
				{#if particle.type === 'petal'}
					<svg 
						width={particle.size} 
						height={particle.size} 
						viewBox="0 0 24 24" 
						style="transform: rotate({particle.rotation}deg)"
					>
						<ellipse cx="12" cy="12" rx="6" ry="10" fill="#E8DCC8" transform="rotate(-15 12 12)"/>
					</svg>
				{:else}
					<svg 
						width={particle.size} 
						height={particle.size} 
						viewBox="0 0 24 24" 
						style="transform: rotate({particle.rotation}deg)"
					>
						<path d="M12 2C8 6 4 10 4 14c0 4 4 6 8 6s8-2 8-6c0-4-4-8-8-12z" fill="#9CAF88" opacity="0.7"/>
					</svg>
				{/if}
			</div>
		{/each}
	</div>

	<!-- Camera Background -->
	<div class="absolute inset-0">
		<video
			bind:this={videoElement}
			class="absolute inset-0 w-full h-full object-cover z-0"
			style="transform: scaleX(-1);"
			playsinline
			muted
			autoplay
		></video>
		<canvas
			bind:this={canvasElement}
			class="absolute inset-0 w-full h-full z-10 pointer-events-none"
			width={1280}
			height={720}
			style="transform: scaleX(-1);"
		></canvas>
		
		<!-- Overlay gradient -->
		<div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent z-20 pointer-events-none"></div>
	</div>

	<!-- Header -->
	<header class="relative z-30 px-4 pt-6 pb-4 flex items-center justify-between">
		<button
			onclick={() => goto('/dashboard')}
			class="p-2.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-colors"
		>
			<svg class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
				<path d="M19 12H5M12 19l-7-7 7-7"/>
			</svg>
		</button>

		<h1 class="font-serif text-lg text-white font-light tracking-wide">Hành Đạo</h1>

		<div class="w-10"></div>
	</header>

	<!-- Main Content -->
	<main class="relative z-30 flex-1 flex flex-col items-center justify-end pb-24 px-6">
		<!-- Timer Display -->
		<div class="text-center mb-6">
			<p class="text-white/60 text-sm tracking-wide mb-2">
				{isPraying ? 'Đang chắp tay...' : handDetected ? 'Chắp 2 tay lại' : 'Chờ tay...'}
			</p>
			<p class="font-serif text-6xl text-white tracking-wide tabular-nums">
				{remainingSeconds}s
			</p>
		</div>

		<!-- Progress -->
		<div class="w-64">
			<div class="h-1 bg-white/20 rounded-full overflow-hidden">
				<div
					class="h-full rounded-full transition-all duration-1000 bg-[#C5A059]"
					style="width: {progressPercent}%"
				></div>
			</div>
		</div>

		<!-- Instructions -->
		<div class="text-center mt-4">
			<p class="text-white/50 text-sm">Chắp 2 tay trước ngực trong {PRAYING_DURATION} giây</p>
			<p class="text-white/30 text-xs mt-2">Hoàn thành 10 giây chắp tay để được +1 công đức</p>
		</div>
	</main>

	<!-- Merit Toast -->
	{#if showMeritToast}
		<div class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50" style="animation: fadeInUp 0.8s ease-out forwards;">
			<div class="px-10 py-6 rounded-2xl shadow-2xl text-center" style="background: {$currentTheme.bgDeep}; color: {$currentTheme.textPrimary};">
				<p class="font-serif text-xl tracking-wide mb-2">+1 Công đức</p>
				<p class="text-sm tracking-wider" style="color: {$currentTheme.primary};">Nam mô A Di Đà Phật</p>
			</div>
		</div>
	{/if}

	<!-- Loading -->
	{#if isLoading}
		<div class="absolute inset-0 flex items-center justify-center z-40" style="background: {$currentTheme.bgDeep}CC;">
			<div class="text-center">
				<div class="w-16 h-16 mx-auto mb-4 rounded-full border" style="border-color: {$currentTheme.textPrimary}20; animation: pulse 2s ease-in-out infinite;"></div>
				<p class="text-sm tracking-wide" style="color: {$currentTheme.textMuted}; opacity: 0.6;">Đang khởi tạo camera...</p>
			</div>
		</div>
	{/if}

	<!-- Error -->
	{#if cameraError}
		<div class="absolute inset-0 flex items-center justify-center z-50 bg-black/90 px-6">
			<div class="text-center max-w-xs">
				<p class="text-white/80 mb-6 text-sm">{cameraError}</p>
				<button
					onclick={() => { cameraError = null; startCamera(); }}
					class="px-8 py-3 bg-white/10 text-white rounded-full text-sm font-medium border border-white/20 hover:bg-white/20 transition-colors"
				>
					Thử lại
				</button>
			</div>
		</div>
	{/if}
</div>

<style>
	@keyframes fadeInUp {
		from { opacity: 0; transform: translate(-50%, -50%) translateY(20px); }
		to { opacity: 1; transform: translate(-50%, -50%) translateY(0); }
	}
	@keyframes pulse {
		0%, 100% { opacity: 1; }
		50% { opacity: 0.5; }
	}
	@keyframes fall {
		0% {
			transform: translateY(-10vh) rotate(0deg) translateX(0);
			opacity: 0;
		}
		10% { opacity: 0.4; }
		90% { opacity: 0.4; }
		100% {
			transform: translateY(110vh) rotate(360deg) translateX(50px);
			opacity: 0;
		}
	}
	.font-serif { font-family: 'Playfair Display', Georgia, serif; }
</style>
