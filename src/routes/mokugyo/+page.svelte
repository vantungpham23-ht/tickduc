<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { goto } from '$app/navigation';
	import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision';
	import { supabase } from '$lib/supabase';

	// State
	let videoElement: HTMLVideoElement | undefined;
	let canvasElement: HTMLCanvasElement | undefined;
	let cameraActive = $state(false);
	let cameraError = $state<string | null>(null);
	let isLoading = $state(true);
	let handLandmarker: HandLandmarker | null = null;
	let animationFrameId: number;
	let lastTimestamp = -1;

	// Mokugyo state
	let tapCount = $state(0);
	let sessionCount = $state(0);
	let lifetimeCount = $state(0);
	let isTapping = $state(false);
	let showMokugyoAnimation = $state(false);
	let showRipple = $state(false);
	let ripples: Array<{ id: number; scale: number; opacity: number }> = $state([]);

	// Gesture detection state
	let isPinched = $state(false);
	let wasPinched = $state(false);
	let pinchDebounce = $state(false);
	let currentDistance = $state(1);
	let handDetected = $state(false);

	// Audio
	let audioContext: AudioContext | null = null;
	let mokugyoBuffer: AudioBuffer | null = null;
	let meritBuffer: AudioBuffer | null = null;

	// Toast
	let showMeritToast = $state(false);
	let toastTimeout: ReturnType<typeof setTimeout>;

	// Constants
	const PINCH_THRESHOLD = 0.07;
	const TAP_COOLDOWN = 250;
	let lastTapTime = 0;

	async function loadAudioFiles() {
		try {
			audioContext = new AudioContext();

			const mokugyoResponse = await fetch('/mokugyo.mp3');
			const mokugyoData = await mokugyoResponse.arrayBuffer();
			mokugyoBuffer = await audioContext.decodeAudioData(mokugyoData);

			try {
				const meritResponse = await fetch('/merit_ding.mp3');
				const meritData = await meritResponse.arrayBuffer();
				meritBuffer = await audioContext.decodeAudioData(meritData);
			} catch {
				console.log('Merit ding sound not found');
			}
		} catch (error) {
			console.error('Error loading audio:', error);
		}
	}

	function playSound(buffer: AudioBuffer | null, volume: number = 0.8) {
		if (!audioContext || !buffer) return;

		if (audioContext.state === 'suspended') {
			audioContext.resume();
		}

		const source = audioContext.createBufferSource();
		const gainNode = audioContext.createGain();

		source.buffer = buffer;
		gainNode.gain.value = volume;

		source.connect(gainNode);
		gainNode.connect(audioContext.destination);
		source.start(0);
	}

	function playMokugyoSound() {
		if (mokugyoBuffer) {
			playSound(mokugyoBuffer, 0.85);
		} else {
			playSynthesizedSound('mokugyo');
		}
	}

	function playMeritSound() {
		if (meritBuffer) {
			playSound(meritBuffer, 1.0);
		} else {
			playSynthesizedSound('merit');
		}
	}

	function playSynthesizedSound(type: 'mokugyo' | 'merit') {
		if (!audioContext) {
			audioContext = new AudioContext();
		}

		if (audioContext.state === 'suspended') {
			audioContext.resume();
		}

		const now = audioContext.currentTime;

		if (type === 'mokugyo') {
			const osc = audioContext.createOscillator();
			const gain = audioContext.createGain();

			osc.type = 'sine';
			osc.frequency.setValueAtTime(180, now);
			osc.frequency.exponentialRampToValueAtTime(80, now + 0.15);

			gain.gain.setValueAtTime(0.8, now);
			gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

			osc.connect(gain);
			gain.connect(audioContext.destination);

			osc.start(now);
			osc.stop(now + 0.3);
		} else {
			const osc = audioContext.createOscillator();
			const gain = audioContext.createGain();

			osc.type = 'sine';
			osc.frequency.setValueAtTime(880, now);

			gain.gain.setValueAtTime(0, now);
			gain.gain.linearRampToValueAtTime(0.6, now + 0.05);
			gain.gain.exponentialRampToValueAtTime(0.01, now + 1.5);

			osc.connect(gain);
			gain.connect(audioContext.destination);

			osc.start(now);
			osc.stop(now + 1.5);
		}
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
				numHands: 1
			});

			console.log('HandLandmarker initialized successfully');

			if (cameraActive) {
				detectHands();
			}
		} catch (error) {
			console.error('Failed to initialize HandLandmarker:', error);
			cameraError = 'Không thể khởi tạo bộ phát hiện tay. Vui lòng thử lại.';
		}
	}

	async function startCamera() {
		isLoading = true;

		await loadAudioFiles();

		isLoading = false;
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
		const dx = p1.x - p2.x;
		const dy = p1.y - p2.y;
		return Math.sqrt(dx * dx + dy * dy);
	}

	function detectHands() {
		if (!videoElement || !handLandmarker || !cameraActive) return;

		const renderLoop = (timestamp: number) => {
			if (lastTimestamp !== timestamp && videoElement && handLandmarker) {
				const results = handLandmarker.detectForVideo(videoElement, timestamp);
				lastTimestamp = timestamp;

				if (canvasElement) {
					drawHandLandmarks(results);
				}
				checkPinchGesture(results);
			}

			if (cameraActive) {
				animationFrameId = requestAnimationFrame(renderLoop);
			}
		};

		animationFrameId = requestAnimationFrame(renderLoop);
	}

	function drawHandLandmarks(results: any) {
		const ctx = canvasElement?.getContext('2d');
		if (!ctx || !results || !canvasElement) return;

		ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);

		if (results.landmarks && results.landmarks.length > 0) {
			const color = 'rgba(197, 160, 89, 0.5)';
			const dotSize = 3;

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
				ctx.lineWidth = 1.5;
				ctx.lineCap = 'round';

				for (const [start, end] of connections) {
					const startPoint = landmarks[start];
					const endPoint = landmarks[end];
					ctx.beginPath();
					ctx.moveTo(startPoint.x * canvasElement.width, startPoint.y * canvasElement.height);
					ctx.lineTo(endPoint.x * canvasElement.width, endPoint.y * canvasElement.height);
					ctx.stroke();
				}

				ctx.fillStyle = isPinched ? 'rgba(197, 160, 89, 0.9)' : color;
				const thumb = landmarks[4];
				const index = landmarks[8];

				ctx.beginPath();
				ctx.arc(thumb.x * canvasElement.width, thumb.y * canvasElement.height, dotSize + 1, 0, 2 * Math.PI);
				ctx.fill();

				ctx.beginPath();
				ctx.arc(index.x * canvasElement.width, index.y * canvasElement.height, dotSize + 1, 0, 2 * Math.PI);
				ctx.fill();
			}
		}
	}

	function checkPinchGesture(results: any) {
		if (!results.landmarks || results.landmarks.length === 0) {
			isPinched = false;
			wasPinched = false;
			currentDistance = 1;
			return;
		}

		const hand = results.landmarks[0];
		const thumbTip = hand[4];
		const indexTip = hand[8];

		const distance = calculateDistance(thumbTip, indexTip);
		currentDistance = distance;

		isPinched = distance < PINCH_THRESHOLD;

		if (isPinched && !wasPinched && !pinchDebounce) {
			console.log('PINCH DETECTED!');
			triggerTap();
			pinchDebounce = true;
		}

		if (!isPinched) {
			pinchDebounce = false;
		}

		wasPinched = isPinched;
	}

	function triggerTap() {
		const now = Date.now();

		if (now - lastTapTime < TAP_COOLDOWN) return;
		lastTapTime = now;

		playMokugyoSound();

		tapCount++;
		sessionCount++;
		lifetimeCount++;

		isTapping = true;
		showMokugyoAnimation = true;
		showRipple = true;

		const rippleId = Date.now();
		ripples = [...ripples, { id: rippleId, scale: 0.5, opacity: 0.6 }];

		setTimeout(() => {
			ripples = ripples.filter(r => r.id !== rippleId);
		}, 600);

		setTimeout(() => {
			isTapping = false;
		}, 100);

		setTimeout(() => {
			showMokugyoAnimation = false;
		}, 150);

		setTimeout(() => {
			showRipple = false;
		}, 500);

		if (tapCount >= 108) {
			triggerMeritMilestone();
		}

		saveTapCount();
	}

	function triggerMeritMilestone() {
		playMeritSound();
		saveMeritToSupabase();

		showMeritToast = true;
		clearTimeout(toastTimeout);
		toastTimeout = setTimeout(() => {
			showMeritToast = false;
		}, 4000);

		tapCount = 0;
		sessionCount = 0;
	}

	function saveTapCount() {
		const isGuest = localStorage.getItem('isGuest') === 'true';

		if (isGuest) {
			const currentLifetime = parseInt(localStorage.getItem('guestMokugyoTaps') || '0');
			localStorage.setItem('guestMokugyoTaps', String(currentLifetime + 1));
		}
	}

	async function saveMeritToSupabase() {
		try {
			const isGuest = localStorage.getItem('isGuest') === 'true';
			if (isGuest) {
				const currentMerit = parseInt(localStorage.getItem('guestMerit') || '0');
				localStorage.setItem('guestMerit', String(currentMerit + 10));
				return;
			}

			const { data: { user } } = await supabase.auth.getUser();
			if (!user) return;

			await supabase.from('merit_logs').insert({
				user_id: user.id,
				merits_earned: 10,
				merit_type: 'mokugyo',
				duration_seconds: 0
			});

			await supabase.rpc('add_merit', {
				p_user_id: user.id,
				p_merits: 10,
				p_duration: 0
			});
		} catch (error) {
			console.error('Error saving merit:', error);
		}
	}

	function loadStoredData() {
		const isGuest = localStorage.getItem('isGuest') === 'true';

		if (isGuest) {
			const storedTaps = localStorage.getItem('guestMokugyoTaps');
			if (storedTaps) {
				lifetimeCount = parseInt(storedTaps);
			}
		}
	}

	function handleRetryCamera() {
		cameraError = null;
		startCamera();
	}

	function handleScreenTap() {
		console.log('Screen tap!');
		if (!audioContext) {
			audioContext = new AudioContext();
		}
		if (audioContext.state === 'suspended') {
			audioContext.resume();
		}
		triggerTap();
	}

	let progressPercent = $derived((sessionCount % 108) / 108 * 100);
	let remainingTaps = $derived(108 - (sessionCount % 108));

	onMount(() => {
		loadStoredData();
		startCamera();
	});

	onDestroy(() => {
		if (animationFrameId) {
			cancelAnimationFrame(animationFrameId);
		}
		stopCamera();
		if (audioContext) {
			audioContext.close();
		}
		clearTimeout(toastTimeout);
	});
</script>

<div
	class="min-h-screen bg-[#F7F3F0] relative overflow-hidden flex flex-col"
	onclick={handleScreenTap}
	role="button"
	tabindex="0"
	onkeydown={(e) => e.key === ' ' && handleScreenTap()}
>
	<!-- Header -->
	<header class="relative z-30 px-4 pt-6 pb-4 flex items-center justify-between">
		<button
			onclick={() => goto('/dashboard')}
			aria-label="Quay về trang chủ"
			class="p-2.5 rounded-full bg-[#3D3028]/5 backdrop-blur-md border border-[#3D3028]/10 hover:bg-[#3D3028]/10 transition-colors"
		>
			<svg class="w-5 h-5 text-[#3D3028]/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
				<path d="M19 12H5M12 19l-7-7 7-7"/>
			</svg>
		</button>

		<h1 class="font-serif text-lg font-light text-[#3D3028] tracking-wide">Gõ Mõ Tích Công Đức</h1>

		<div class="w-10"></div>
	</header>

	<!-- Main Content -->
	<main class="flex-1 flex flex-col items-center justify-center px-6 py-8">
		<!-- Session Counter -->
		<div class="text-center mb-8 animate-fade-in-up">
			<p class="text-[#3D3028]/60 text-sm tracking-wide mb-1">Hôm nay đã gõ</p>
			<p class="font-serif text-4xl text-[#3D3028] tracking-wide">
				<span class="text-[#C5A059]">{sessionCount % 108}</span> / 108 cốc
			</p>
		</div>

		<!-- Progress Bar -->
		<div class="w-full max-w-xs mb-12 animate-fade-in-up" style="animation-delay: 0.1s;">
			<div class="h-1 bg-[#3D3028]/10 rounded-full overflow-hidden">
				<div
					class="h-full rounded-full transition-all duration-300 ease-out bg-gradient-to-r from-[#C5A059] to-[#B8944D]"
					style="width: {progressPercent}%"
				></div>
			</div>
			{#if remainingTaps > 0 && remainingTaps < 108}
				<p class="text-center text-[#3D3028]/40 text-xs mt-2 tracking-wide">
					Còn {remainingTaps} cốc để được +10 công đức
				</p>
			{:else if remainingTaps === 0}
				<p class="text-center text-[#C5A059] text-xs mt-2 tracking-wide">
					Hoàn thành 108 cốc - Được +10 công đức!
				</p>
			{/if}
		</div>

		<!-- Mokugyo Container -->
		<div class="relative flex items-center justify-center">
			{#if showRipple}
				{#each ripples as ripple (ripple.id)}
					<div
						class="absolute w-64 h-64 rounded-full border border-[#C5A059]/40 animate-ripple-out"
						style="transform: scale({ripple.scale}); opacity: {ripple.opacity};"
					></div>
				{/each}
			{/if}

			<div
				class="absolute w-48 h-48 rounded-full bg-[#C5A059]/10 blur-2xl transition-opacity duration-300"
				class:opacity-100={showRipple || isTapping}
				class:opacity-30={!showRipple && !isTapping}
			></div>

			<div
				class="relative transition-transform duration-100"
				class:scale-105={isTapping}
				class:scale-100={!isTapping}
			>
				<svg
					viewBox="0 0 200 200"
					class="w-48 h-48 md:w-56 md:h-56 transition-transform duration-100"
					class:animate-mokugyo-shake={isTapping}
				>
					<defs>
						<linearGradient id="mokugyoGold" x1="0%" y1="0%" x2="100%" y2="100%">
							<stop offset="0%" stop-color="#D4B96A"/>
							<stop offset="50%" stop-color="#C5A059"/>
							<stop offset="100%" stop-color="#A69050"/>
						</linearGradient>
						<filter id="mokugyoShadow" x="-20%" y="-20%" width="140%" height="140%">
							<feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="#3D3028" flood-opacity="0.15"/>
						</filter>
					</defs>

					<ellipse cx="100" cy="105" rx="70" ry="55" fill="url(#mokugyoGold)" filter="url(#mokugyoShadow)"/>

					<path d="M 45 100 Q 60 95 75 100 Q 90 105 100 100 Q 115 95 130 100 Q 145 105 155 100" fill="none" stroke="#A69050" stroke-width="0.5" opacity="0.3"/>
					<path d="M 50 115 Q 70 110 90 115 Q 110 120 130 115 Q 145 110 150 115" fill="none" stroke="#A69050" stroke-width="0.5" opacity="0.3"/>

					<circle cx="70" cy="95" r="6" fill="#3D3028" opacity="0.7"/>
					<circle cx="130" cy="95" r="6" fill="#3D3028" opacity="0.7"/>
					<circle cx="68" cy="93" r="2" fill="#F7F3F0" opacity="0.5"/>
					<circle cx="128" cy="93" r="2" fill="#F7F3F0" opacity="0.5"/>

					<path d="M 85 115 Q 100 125 115 115" fill="none" stroke="#3D3028" stroke-width="2" stroke-linecap="round" opacity="0.6"/>

					<ellipse cx="100" cy="55" rx="25" ry="15" fill="url(#mokugyoGold)"/>
					<ellipse cx="95" cy="50" rx="12" ry="6" fill="#D4B96A" opacity="0.5"/>
					<ellipse cx="55" cy="100" rx="15" ry="30" fill="#D4B96A" opacity="0.3"/>
				</svg>
			</div>
		</div>

		<!-- Instruction -->
		<div class="mt-12 text-center animate-fade-in-up" style="animation-delay: 0.2s;">
			<p class="text-[#3D3028]/50 text-sm tracking-wide">
				Chạm màn hình để gõ mõ
			</p>
			<p class="text-[#3D3028]/30 text-xs mt-4">
				💡 Tap anywhere to tap the mokugyo
			</p>
		</div>
	</main>

	{#if showMeritToast}
		<div class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 animate-fade-in-up">
			<div class="bg-[#3D3028] text-[#F7F3F0] px-8 py-4 rounded-2xl shadow-2xl text-center">
				<p class="font-serif text-lg tracking-wide mb-1">+10 Công đức</p>
				<p class="text-[#C5A059] text-sm tracking-wider">Chúc mừng bạn!</p>
			</div>
		</div>
	{/if}

	{#if isLoading && !cameraError}
		<div class="absolute inset-0 flex items-center justify-center z-20 bg-[#F7F3F0]/90 backdrop-blur-sm">
			<div class="text-center">
				<div class="relative w-16 h-16 mx-auto mb-4">
					<div class="absolute inset-0 rounded-full border border-[#C5A059]/20 animate-ping" style="animation-duration: 3s;"></div>
					<div class="absolute inset-2 rounded-full border border-[#C5A059]/30 animate-pulse" style="animation-duration: 2s;"></div>
					<div class="absolute inset-4 rounded-full bg-[#C5A059]/20"></div>
				</div>
				<p class="text-[#3D3028]/60 text-sm tracking-wide">Đang khởi tạo...</p>
			</div>
		</div>
	{/if}

	{#if cameraError}
		<div class="absolute inset-0 flex items-center justify-center z-20 bg-[#F7F3F0]/95 backdrop-blur-md px-6">
			<div class="text-center max-w-xs">
				<div class="w-16 h-16 mx-auto mb-4 rounded-full border border-[#C5A059]/20 flex items-center justify-center">
					<svg class="w-8 h-8 text-[#C5A059]/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
						<circle cx="12" cy="12" r="10"/>
						<path d="M12 8v4M12 16h.01"/>
					</svg>
				</div>
				<p class="text-[#3D3028]/80 mb-6 text-sm leading-relaxed">
					{cameraError}
				</p>
				<button
					onclick={handleRetryCamera}
					class="w-full py-3 bg-[#C5A059]/20 text-[#3D3028] rounded-full text-sm font-medium tracking-wide hover:bg-[#C5A059]/30 transition-colors"
				>
					Thử lại
				</button>
			</div>
		</div>
	{/if}
</div>

<style>
	.font-serif {
		font-family: 'Playfair Display', Georgia, serif;
	}

	@keyframes mokugyo-shake {
		0%, 100% { transform: translateX(0) rotate(0); }
		25% { transform: translateX(-3px) rotate(-2deg); }
		75% { transform: translateX(3px) rotate(2deg); }
	}

	.animate-mokugyo-shake {
		animation: mokugyo-shake 0.1s ease-in-out;
	}

	@keyframes ripple-out {
		0% { transform: scale(0.5); opacity: 0.6; }
		100% { transform: scale(2); opacity: 0; }
	}

	.animate-ripple-out {
		animation: ripple-out 0.6s ease-out forwards;
	}

	.animate-fade-in-up {
		animation: fadeInUp 0.8s ease-out forwards;
	}

	@keyframes fadeInUp {
		from { opacity: 0; transform: translateY(20px); }
		to { opacity: 1; transform: translateY(0); }
	}
</style>
