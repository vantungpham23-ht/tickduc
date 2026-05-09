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

	// Meditation state
	let isInPose = $state(false);
	let wasInPose = $state(false);
	let elapsedSeconds = $state(0);
	let handDetected = $state(false);
	let leftHandY = $state(0);
	let rightHandY = $state(0);

	// Stability tracking
	let poseStartTime = 0;
	const POSE_STABILITY_DELAY = 0; // Start immediately when both hands are in zone

	// Wake Lock
	let wakeLock: WakeLockSentinel | null = null;

	// Audio
	let audioContext: AudioContext | null = null;
	let mediBuffer: AudioBuffer | null = null;
	let isAudioPlaying = $state(false);
	let audioSource: AudioBufferSourceNode | null = null;

	// Toast
	let showMeritToast = $state(false);
	let toastTimeout: ReturnType<typeof setTimeout>;

	// Constants
	const MEDITATION_DURATION = 600;
	const MEDITATION_THRESHOLD = 0.25;

	async function loadAudioFiles() {
		try {
			audioContext = new AudioContext();
			const mediResponse = await fetch('/medi.mp3');
			const mediData = await mediResponse.arrayBuffer();
			mediBuffer = await audioContext.decodeAudioData(mediData);
		} catch (error) {
			console.error('Error loading audio:', error);
		}
	}

	async function requestWakeLock() {
		try {
			if ('wakeLock' in navigator) {
				wakeLock = await navigator.wakeLock.request('screen');
				console.log('Wake Lock acquired');
			}
		} catch (err) {
			console.error('Wake Lock error:', err);
		}
	}

	async function releaseWakeLock() {
		if (wakeLock) {
			await wakeLock.release();
			wakeLock = null;
			console.log('Wake Lock released');
		}
	}

	function startAudioLoop() {
		if (!audioContext || !mediBuffer || isAudioPlaying) return;
		isAudioPlaying = true;

		function playAudio() {
			if (!audioContext || !mediBuffer || !isInPose) {
				stopAudioLoop();
				return;
			}

			audioSource = audioContext.createBufferSource();
			const gainNode = audioContext.createGain();
			audioSource.buffer = mediBuffer;
			gainNode.gain.value = 0.7;
			audioSource.connect(gainNode);
			gainNode.connect(audioContext.destination);

			audioSource.onended = () => {
				if (isInPose && isAudioPlaying) playAudio();
			};
			audioSource.start(0);
		}
		playAudio();
	}

	function stopAudioLoop() {
		isAudioPlaying = false;
		if (audioSource) {
			try { audioSource.stop(); } catch (e) {}
			audioSource = null;
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
		stopAudioLoop();
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
			const color = '#93B1A7';

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
		if (!results.landmarks || results.landmarks.length === 0) {
			handDetected = false;
			leftHandY = 0;
			rightHandY = 0;
			poseStartTime = 0; // Reset stability timer
			if (isInPose) exitMeditation();
			return;
		}

		handDetected = true;

		// Lấy vị trí Y của mỗi tay (wrist landmark = index 0)
		// Tay ở dưới = Y lớn hơn (vì Y tăng từ trên xuống dưới)
		let currentLeftY = 0;
		let currentRightY = 0;

		if (results.landmarks.length === 1) {
			currentLeftY = results.landmarks[0][0].y;
			currentRightY = results.landmarks[0][0].y;
		} else if (results.landmarks.length >= 2) {
			currentLeftY = results.landmarks[0][0].y;
			currentRightY = results.landmarks[1][0].y;
		}

		leftHandY = currentLeftY;
		rightHandY = currentRightY;

		// Kiểm tra nếu 2 tay đặt xuống dưới (vùng đầu gối)
		// Y > 0.5 nghĩa là tay ở dưới màn hình (đầu gối)
		// Y > 0.35 đến Y < 0.75 là vùng hợp lý cho đầu gối
		const leftInZone = currentLeftY > 0.5 && currentLeftY < 0.8;
		const rightInZone = currentRightY > 0.5 && currentRightY < 0.8;
		const nowInPose = leftInZone && rightInZone;

		if (nowInPose && !wasInPose) {
			// Bắt đầu đếm thời gian ổn định
			if (poseStartTime === 0) {
				poseStartTime = Date.now();
			}
			// Kiểm tra đã giữ ổn định đủ lâu chưa
			if (Date.now() - poseStartTime >= POSE_STABILITY_DELAY) {
				enterMeditation();
			}
		} else if (!nowInPose && wasInPose) {
			// Tay di chuyển ra khỏi vùng
			poseStartTime = 0;
			exitMeditation();
		} else if (!nowInPose) {
			// Không ở trong tư thế, reset timer
			poseStartTime = 0;
		}
		wasInPose = nowInPose;
	}

	let meditationInterval: ReturnType<typeof setInterval> | null = null;

	function enterMeditation() {
		isInPose = true;
		if (audioContext?.state === 'suspended') audioContext.resume();
		startAudioLoop();
		requestWakeLock();

		if (!meditationInterval) {
			meditationInterval = setInterval(() => {
				elapsedSeconds++;
				if (elapsedSeconds >= MEDITATION_DURATION) completeMeditation();
			}, 1000);
		}
	}

	function exitMeditation() {
		isInPose = false;
		stopAudioLoop();
		releaseWakeLock();
		if (meditationInterval) { clearInterval(meditationInterval); meditationInterval = null; }
	}

	function completeMeditation() {
		exitMeditation();
		saveMerit();
		showMeritToast = true;
		clearTimeout(toastTimeout);
		toastTimeout = setTimeout(() => { showMeritToast = false; }, 5000);
		elapsedSeconds = 0;
	}

	async function saveMerit() {
		try {
			const isGuest = localStorage.getItem('isGuest') === 'true';
			if (isGuest) {
				const current = parseInt(localStorage.getItem('guestMerit') || '0');
				localStorage.setItem('guestMerit', String(current + 100));
				return;
			}
			const { data: { user } } = await supabase.auth.getUser();
			if (!user) return;
			await supabase.from('merit_logs').insert({
				user_id: user.id, merits_earned: 100, merit_type: 'meditation', duration_seconds: MEDITATION_DURATION
			});
			await supabase.rpc('add_merit', { p_user_id: user.id, p_merits: 100, p_duration: MEDITATION_DURATION });
		} catch (error) { console.error('Error saving merit:', error); }
	}

	let remainingSeconds = $derived(MEDITATION_DURATION - elapsedSeconds);
	let progressPercent = $derived((elapsedSeconds / MEDITATION_DURATION) * 100);

	function formatTime(seconds: number): string {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs.toString().padStart(2, '0')}`;
	}

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
		releaseWakeLock();
		if (audioContext) audioContext.close();
		clearTimeout(toastTimeout);
		if (meditationInterval) clearInterval(meditationInterval);
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
						<ellipse cx="12" cy="12" rx="6" ry="10" fill="#D4B896" transform="rotate(-15 12 12)"/>
					</svg>
				{:else}
					<svg 
						width={particle.size} 
						height={particle.size} 
						viewBox="0 0 24 24" 
						style="transform: rotate({particle.rotation}deg)"
					>
						<path d="M12 2C8 6 4 10 4 14c0 4 4 6 8 6s8-2 8-6c0-4-4-8-8-12z" fill="#93B1A7" opacity="0.7"/>
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

		<!-- Hand placement zones -->
		{#if !isInPose}
			<!-- Left hand zone -->
			<div class="absolute z-25 bottom-[22%] left-[8%] w-24 h-24 flex flex-col items-center justify-center">
				<div class="relative w-full h-full">
					<div class="absolute inset-0 rounded-full border-2 border-dashed {leftHandY > 0.5 && leftHandY < 0.8 ? 'border-green-400/70 bg-green-400/20' : 'border-white/40 bg-white/5'}" 
						style="animation: pulse-zone 2s ease-in-out infinite;">
					</div>
					<div class="absolute inset-0 flex items-center justify-center">
						{#if leftHandY > 0.5 && leftHandY < 0.8}
							<svg class="w-12 h-12 text-green-400/80" viewBox="0 0 24 24" fill="currentColor">
								<path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
							</svg>
						{:else}
							<svg class="w-10 h-10 text-white/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
								<path d="M18 11V6a2 2 0 0 0-2-2 2 2 0 0 0-2 2v0M14 10V4a2 2 0 0 0-2-2 2 2 0 0 0-2 2v6M10 10.5V6a2 2 0 0 0-2-2 2 2 0 0 0-2 2v8"/>
								<path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/>
							</svg>
						{/if}
					</div>
				</div>
				<p class="text-white/50 text-xs mt-2 text-center">Tay trái</p>
			</div>

			<!-- Right hand zone -->
			<div class="absolute z-25 bottom-[22%] right-[8%] w-24 h-24 flex flex-col items-center justify-center">
				<div class="relative w-full h-full">
					<div class="absolute inset-0 rounded-full border-2 border-dashed {rightHandY > 0.5 && rightHandY < 0.8 ? 'border-green-400/70 bg-green-400/20' : 'border-white/40 bg-white/5'}" 
						style="animation: pulse-zone 2s ease-in-out infinite;">
					</div>
					<div class="absolute inset-0 flex items-center justify-center">
						{#if rightHandY > 0.5 && rightHandY < 0.8}
							<svg class="w-12 h-12 text-green-400/80" viewBox="0 0 24 24" fill="currentColor">
								<path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
							</svg>
						{:else}
							<svg class="w-10 h-10 text-white/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
								<path d="M18 11V6a2 2 0 0 0-2-2 2 2 0 0 0-2 2v0M14 10V4a2 2 0 0 0-2-2 2 2 0 0 0-2 2v6M10 10.5V6a2 2 0 0 0-2-2 2 2 0 0 0-2 2v8"/>
								<path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/>
							</svg>
						{/if}
					</div>
				</div>
				<p class="text-white/50 text-xs mt-2 text-center">Tay phải</p>
			</div>

			<!-- Center line indicator -->
			<div class="absolute z-25 bottom-[15%] left-1/2 -translate-x-1/2 text-center">
				<p class="text-white/30 text-xs">Đặt 2 tay xuống 2 vùng trên</p>
			</div>
		{/if}
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

		<h1 class="font-serif text-lg text-white font-light tracking-wide">Thiền</h1>

		<div class="w-10"></div>
	</header>

	<!-- Main Content -->
	<main class="relative z-30 flex-1 flex flex-col items-center justify-end pb-24 px-6">
		<!-- Timer Display -->
		<div class="text-center mb-6">
			<p class="text-white/60 text-sm tracking-wide mb-2">
				{isInPose ? 'Đang thiền...' : handDetected ? 'Đặt tay xuống đầu gối' : 'Chờ tay...'}
			</p>
			<p class="font-serif text-6xl text-white tracking-wide tabular-nums">
				{formatTime(remainingSeconds)}
			</p>
		</div>

		<!-- Progress -->
		<div class="w-64">
			<div class="h-1 bg-white/20 rounded-full overflow-hidden">
				<div
					class="h-full rounded-full transition-all duration-1000 bg-[#93B1A7]"
					style="width: {progressPercent}%"
				></div>
			</div>
			{#if isAudioPlaying}
				<p class="text-[#93B1A7] text-xs text-center mt-2">Đang phát nhạc thiền</p>
			{/if}
		</div>

		<!-- Instructions -->
		<div class="text-center mt-4">
			<p class="text-white/50 text-sm">Ngồi yên, 2 tay đặt lên 2 đầu gối trong 10 phút</p>
			<p class="text-white/30 text-xs mt-2">Hoàn thành 10 phút thiền để được +100 công đức</p>
		</div>
	</main>

	<!-- Merit Toast -->
	{#if showMeritToast}
		<div class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50" style="animation: fadeInUp 0.8s ease-out forwards;">
			<div class="bg-[#242018] backdrop-blur-2xl border border-[#C5A059]/20 text-[#F5F0E8] px-8 py-5 rounded-2xl shadow-2xl text-center">
				<p class="font-serif text-xl tracking-wide mb-2">+100 Công đức</p>
				<p class="text-[#93B1A7] text-sm tracking-wider">Nam mô Quan Thế Âm</p>
			</div>
		</div>
	{/if}

	<!-- Loading -->
	{#if isLoading}
		<div class="absolute inset-0 flex items-center justify-center z-40 bg-[#1A1814]/90">
			<div class="text-center">
				<div class="w-16 h-16 mx-auto mb-4 rounded-full border border-white/20" style="animation: pulse 2s ease-in-out infinite;"></div>
				<p class="text-white/60 text-sm tracking-wide">Đang khởi tạo camera...</p>
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
	@keyframes pulse-zone {
		0%, 100% { opacity: 0.6; transform: scale(1); }
		50% { opacity: 1; transform: scale(1.05); }
	}
	.font-serif { font-family: 'Playfair Display', Georgia, serif; }
</style>
