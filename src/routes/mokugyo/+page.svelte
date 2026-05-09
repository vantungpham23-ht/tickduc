<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { goto } from '$app/navigation';
	import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision';
	import { supabase } from '$lib/supabase';

	let videoElement: HTMLVideoElement | undefined;
	let canvasElement: HTMLCanvasElement | undefined;
	let cameraActive = $state(false);
	let cameraError = $state<string | null>(null);
	let isLoading = $state(true);
	let handLandmarker: HandLandmarker | null = null;
	let animationFrameId: number;
	let lastTimestamp = -1;

	let tapCount = $state(0);
	let sessionCount = $state(0);
	let lifetimeCount = $state(0);
	let isTapping = $state(false);
	let showMokugyoAnimation = $state(false);
	let showRipple = $state(false);
	let ripples: Array<{ id: number; scale: number; opacity: number }> = $state([]);

	let isPinched = $state(false);
	let wasPinched = $state(false);
	let pinchDebounce = $state(false);
	let currentDistance = $state(1);
	let handDetected = $state(false);

	let audioContext: AudioContext | null = null;
	let mokugyoBuffer: AudioBuffer | null = null;
	let meritBuffer: AudioBuffer | null = null;

	let showMeritToast = $state(false);
	let toastTimeout: ReturnType<typeof setTimeout>;

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
			} catch { console.log('Merit ding sound not found'); }
		} catch (error) { console.error('Error loading audio:', error); }
	}

	function playSound(buffer: AudioBuffer | null, volume: number = 0.8) {
		if (!audioContext || !buffer) return;
		if (audioContext.state === 'suspended') audioContext.resume();
		const source = audioContext.createBufferSource();
		const gainNode = audioContext.createGain();
		source.buffer = buffer;
		gainNode.gain.value = volume;
		source.connect(gainNode);
		gainNode.connect(audioContext.destination);
		source.start(0);
	}

	function playMokugyoSound() {
		if (mokugyoBuffer) playSound(mokugyoBuffer, 0.85);
		else playSynthesizedSound('mokugyo');
	}

	function playMeritSound() {
		if (meritBuffer) playSound(meritBuffer, 1.0);
		else playSynthesizedSound('merit');
	}

	function playSynthesizedSound(type: 'mokugyo' | 'merit') {
		if (!audioContext) audioContext = new AudioContext();
		if (audioContext.state === 'suspended') audioContext.resume();
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
			const vision = await FilesetResolver.forVisionTasks('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm');
			handLandmarker = await HandLandmarker.createFromOptions(vision, {
				baseOptions: { modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task', delegate: 'GPU' },
				runningMode: 'VIDEO', numHands: 1
			});
			if (cameraActive) detectHands();
		} catch (error) { console.error('Failed to initialize HandLandmarker:', error); }
	}

	async function startCamera() {
		isLoading = true;
		await loadAudioFiles();
		isLoading = false;
	}

	function stopCamera() {
		if (videoElement?.srcObject) { const tracks = (videoElement.srcObject as MediaStream).getTracks(); tracks.forEach(track => track.stop()); videoElement.srcObject = null; }
		cameraActive = false;
	}

	function calculateDistance(p1: { x: number; y: number }, p2: { x: number; y: number }) { const dx = p1.x - p2.x; const dy = p1.y - p2.y; return Math.sqrt(dx * dx + dy * dy); }

	function detectHands() {
		if (!videoElement || !handLandmarker || !cameraActive) return;
		const renderLoop = (timestamp: number) => {
			if (lastTimestamp !== timestamp && videoElement && handLandmarker) {
				const results = handLandmarker.detectForVideo(videoElement, timestamp);
				lastTimestamp = timestamp;
				if (canvasElement) drawHandLandmarks(results);
				checkPinchGesture(results);
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
			const color = 'rgba(197, 160, 89, 0.5)';
			for (const landmarks of results.landmarks) {
				const connections = [[0,1],[1,2],[2,3],[3,4],[0,5],[5,6],[6,7],[7,8],[0,9],[9,10],[10,11],[11,12],[0,13],[13,14],[14,15],[15,16],[0,17],[17,18],[18,19],[19,20],[5,9],[9,13],[13,17]];
				ctx.strokeStyle = color; ctx.lineWidth = 1.5; ctx.lineCap = 'round';
				for (const [start, end] of connections) {
					const s = landmarks[start]; const e = landmarks[end];
					ctx.beginPath();
					ctx.moveTo(s.x * canvasElement.width, s.y * canvasElement.height);
					ctx.lineTo(e.x * canvasElement.width, e.y * canvasElement.height);
					ctx.stroke();
				}
				ctx.fillStyle = isPinched ? 'rgba(197, 160, 89, 0.9)' : color;
				ctx.beginPath(); ctx.arc(landmarks[4].x * canvasElement.width, landmarks[4].y * canvasElement.height, 4, 0, 2 * Math.PI); ctx.fill();
				ctx.beginPath(); ctx.arc(landmarks[8].x * canvasElement.width, landmarks[8].y * canvasElement.height, 4, 0, 2 * Math.PI); ctx.fill();
			}
		}
	}

	function checkPinchGesture(results: any) {
		if (!results.landmarks || results.landmarks.length === 0) { isPinched = false; wasPinched = false; currentDistance = 1; return; }
		const hand = results.landmarks[0];
		const distance = calculateDistance(hand[4], hand[8]);
		currentDistance = distance;
		isPinched = distance < PINCH_THRESHOLD;
		if (isPinched && !wasPinched && !pinchDebounce) { triggerTap(); pinchDebounce = true; }
		if (!isPinched) pinchDebounce = false;
		wasPinched = isPinched;
	}

	function triggerTap() {
		const now = Date.now();
		if (now - lastTapTime < TAP_COOLDOWN) return;
		lastTapTime = now;
		playMokugyoSound();
		tapCount++; sessionCount++; lifetimeCount++;
		isTapping = true; showMokugyoAnimation = true; showRipple = true;
		const rippleId = Date.now();
		ripples = [...ripples, { id: rippleId, scale: 0.5, opacity: 0.6 }];
		setTimeout(() => { ripples = ripples.filter(r => r.id !== rippleId); }, 600);
		setTimeout(() => { isTapping = false; }, 100);
		setTimeout(() => { showMokugyoAnimation = false; }, 150);
		setTimeout(() => { showRipple = false; }, 500);
		if (tapCount >= 108) triggerMeritMilestone();
		saveTapCount();
	}

	function triggerMeritMilestone() {
		playMeritSound();
		saveMeritToSupabase();
		showMeritToast = true;
		clearTimeout(toastTimeout);
		toastTimeout = setTimeout(() => { showMeritToast = false; }, 4000);
		tapCount = 0; sessionCount = 0;
	}

	function saveTapCount() {
		const isGuest = localStorage.getItem('isGuest') === 'true';
		if (isGuest) { const currentLifetime = parseInt(localStorage.getItem('guestMokugyoTaps') || '0'); localStorage.setItem('guestMokugyoTaps', String(currentLifetime + 1)); }
	}

	async function saveMeritToSupabase() {
		try {
			const isGuest = localStorage.getItem('isGuest') === 'true';
			if (isGuest) { const currentMerit = parseInt(localStorage.getItem('guestMerit') || '0'); localStorage.setItem('guestMerit', String(currentMerit + 10)); return; }
			const { data: { user } } = await supabase.auth.getUser();
			if (!user) return;
			await supabase.from('merit_logs').insert({ user_id: user.id, merits_earned: 10, merit_type: 'mokugyo', duration_seconds: 0 });
			await supabase.rpc('add_merit', { p_user_id: user.id, p_merits: 10, p_duration: 0 });
		} catch (error) { console.error('Error saving merit:', error); }
	}

	function loadStoredData() {
		const isGuest = localStorage.getItem('isGuest') === 'true';
		if (isGuest) { const storedTaps = localStorage.getItem('guestMokugyoTaps'); if (storedTaps) lifetimeCount = parseInt(storedTaps); }
	}

	function handleRetryCamera() { cameraError = null; startCamera(); }

	function handleScreenTap() {
		console.log('Screen tap!');
		if (!audioContext) audioContext = new AudioContext();
		if (audioContext.state === 'suspended') audioContext.resume();
		triggerTap();
	}

	let progressPercent = $derived((sessionCount % 108) / 108 * 100);
	let remainingTaps = $derived(108 - (sessionCount % 108));

	onMount(() => { loadStoredData(); startCamera(); });

	onDestroy(() => {
		if (animationFrameId) cancelAnimationFrame(animationFrameId);
		stopCamera();
		if (audioContext) audioContext.close();
		clearTimeout(toastTimeout);
	});
</script>

<div class="min-h-screen relative overflow-hidden flex flex-col" onclick={handleScreenTap} role="button" tabindex="0" onkeydown={(e) => e.key === ' ' && handleScreenTap()}>
	<!-- Ambient backgrounds -->
	<div class="fixed inset-0 overflow-hidden pointer-events-none">
		<div class="absolute top-0 right-0 w-96 h-96 bg-[#C5A059]/3 rounded-full blur-3xl animate-float-drift"></div>
		<div class="absolute bottom-0 left-0 w-64 h-64 bg-[#93B1A7]/2 rounded-full blur-3xl animate-float-drift" style="animation-delay: -4s;"></div>
	</div>

	<!-- Header -->
	<header class="relative z-30 px-4 pt-6 pb-4 flex items-center justify-between">
		<button onclick={() => goto('/dashboard')} aria-label="Quay về"
			class="p-2.5 rounded-full bg-[#242018]/80 backdrop-blur-md border border-[#C5A059]/10 hover:border-[#C5A059]/20 transition-colors">
			<svg class="w-5 h-5 text-[#8A8070]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
		</button>
		<h1 class="font-serif text-base text-[#F5F0E8]/80 font-light tracking-wide">Gõ Mõ Tích Công Đức</h1>
		<div class="w-10"></div>
	</header>

	<!-- Main Content -->
	<main class="flex-1 flex flex-col items-center justify-center px-6 py-8 relative z-10">
		<!-- Session Counter -->
		<div class="text-center mb-8 animate-fade-in-up">
			<p class="text-[#8A8070]/40 text-sm tracking-wide mb-2 font-light">Hôm nay đã gõ</p>
			<p class="font-serif text-5xl text-[#F5F0E8] tracking-wide">
				<span class="text-[#C5A059]/80">{sessionCount % 108}</span> <span class="text-[#8A8070]/20 text-3xl">/</span> <span class="text-[#8A8070]/30 text-3xl">108</span>
			</p>
			<p class="text-[#8A8070]/30 text-xs mt-3 font-light tracking-wide">cốc</p>
		</div>

		<!-- Progress Bar -->
		<div class="w-full max-w-xs mb-12 animate-fade-in-up" style="animation-delay: 0.1s;">
			<div class="h-[2px] bg-[#8A8070]/10 rounded-full overflow-hidden">
				<div class="h-full rounded-full transition-all duration-300 ease-out bg-gradient-to-r from-[#C5A059]/60 to-[#D4B896]/80" style="width: {progressPercent}%;"></div>
			</div>
			{#if remainingTaps > 0 && remainingTaps < 108}
				<p class="text-center text-[#8A8070]/30 text-xs mt-3 font-light tracking-wide">Còn {remainingTaps} cốc để được +10 công đức</p>
			{:else if remainingTaps === 0}
				<p class="text-center text-[#C5A059]/80 text-xs mt-3 font-light tracking-wide">Hoàn thành 108 cốc — Được +10 công đức!</p>
			{/if}
		</div>

		<!-- Mokugyo Container -->
		<div class="relative flex items-center justify-center">
			{#if showRipple}
				{#each ripples as ripple (ripple.id)}
					<div class="absolute w-64 h-64 rounded-full border border-[#C5A059]/20 animate-ripple-out" style="transform: scale({ripple.scale}); opacity: {ripple.opacity};"></div>
				{/each}
			{/if}

			<div class="absolute w-48 h-48 rounded-full bg-[#C5A059]/8 blur-3xl transition-opacity duration-300" class:opacity-80={showRipple || isTapping} class:opacity-20={!showRipple && !isTapping}></div>

			<div class="relative transition-transform duration-100" class:scale-105={isTapping} class:scale-100={!isTapping}>
				<svg viewBox="0 0 200 200" class="w-48 h-48 md:w-56 md:h-56 transition-transform duration-100" class:animate-mokugyo-shake={isTapping}>
					<defs>
						<linearGradient id="mokugyoGold" x1="0%" y1="0%" x2="100%" y2="100%">
							<stop offset="0%" stop-color="#D4B96A"/>
							<stop offset="50%" stop-color="#C5A059"/>
							<stop offset="100%" stop-color="#A69050"/>
						</linearGradient>
						<filter id="mokugyoShadow" x="-20%" y="-20%" width="140%" height="140%">
							<feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="#C5A059" flood-opacity="0.1"/>
						</filter>
					</defs>
					<ellipse cx="100" cy="105" rx="70" ry="55" fill="url(#mokugyoGold)" filter="url(#mokugyoShadow)"/>
					<path d="M 45 100 Q 60 95 75 100 Q 90 105 100 100 Q 115 95 130 100 Q 145 105 155 100" fill="none" stroke="#A69050" stroke-width="0.5" opacity="0.3"/>
					<path d="M 50 115 Q 70 110 90 115 Q 110 120 130 115 Q 145 110 150 115" fill="none" stroke="#A69050" stroke-width="0.5" opacity="0.3"/>
					<circle cx="70" cy="95" r="6" fill="#242018" opacity="0.6"/>
					<circle cx="130" cy="95" r="6" fill="#242018" opacity="0.6"/>
					<circle cx="68" cy="93" r="2" fill="#F5F0E8" opacity="0.3"/>
					<circle cx="128" cy="93" r="2" fill="#F5F0E8" opacity="0.3"/>
					<path d="M 85 115 Q 100 125 115 115" fill="none" stroke="#242018" stroke-width="2" stroke-linecap="round" opacity="0.5"/>
					<ellipse cx="100" cy="55" rx="25" ry="15" fill="url(#mokugyoGold)"/>
					<ellipse cx="95" cy="50" rx="12" ry="6" fill="#D4B96A" opacity="0.4"/>
					<ellipse cx="55" cy="100" rx="15" ry="30" fill="#D4B96A" opacity="0.2"/>
				</svg>
			</div>
		</div>

		<!-- Instruction -->
		<div class="mt-12 text-center animate-fade-in-up" style="animation-delay: 0.2s;">
			<p class="text-[#8A8070]/40 text-sm tracking-wide font-light">Chạm màn hình để gõ mõ</p>
		</div>
	</main>

	{#if showMeritToast}
		<div class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 animate-fade-in-up">
			<div class="bg-[#242018] backdrop-blur-2xl border border-[#C5A059]/20 text-[#F5F0E8] px-8 py-5 rounded-2xl shadow-2xl shadow-black/30 text-center">
				<p class="font-serif text-lg tracking-wide mb-1">+10 Công đức</p>
				<p class="text-[#C5A059]/80 text-sm tracking-wider font-light">Chúc mừng bạn!</p>
			</div>
		</div>
	{/if}

	{#if isLoading && !cameraError}
		<div class="absolute inset-0 flex items-center justify-center z-20 bg-[#1A1814]/90 backdrop-blur-sm">
			<div class="text-center">
				<div class="relative w-16 h-16 mx-auto mb-4">
					<div class="absolute inset-0 rounded-full border border-[#C5A059]/20 animate-ping" style="animation-duration: 3s;"></div>
					<div class="absolute inset-2 rounded-full border border-[#C5A059]/30 animate-pulse" style="animation-duration: 2s;"></div>
					<div class="absolute inset-4 rounded-full bg-[#C5A059]/10"></div>
				</div>
				<p class="text-[#8A8070]/40 text-sm tracking-wide font-light">Đang khởi tạo...</p>
			</div>
		</div>
	{/if}

	{#if cameraError}
		<div class="absolute inset-0 flex items-center justify-center z-20 bg-[#1A1814]/95 backdrop-blur-md px-6">
			<div class="text-center max-w-xs">
				<div class="w-16 h-16 mx-auto mb-4 rounded-full border border-[#C5A059]/15 flex items-center justify-center">
					<svg class="w-8 h-8 text-[#C5A059]/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
				</div>
				<p class="text-[#F5F0E8]/60 mb-6 text-sm leading-relaxed font-light">{cameraError}</p>
				<button onclick={handleRetryCamera} class="w-full py-3 bg-[#C5A059]/10 border border-[#C5A059]/20 text-[#C5A059] rounded-full text-sm font-light tracking-wide hover:bg-[#C5A059]/15 transition-colors">Thử lại</button>
			</div>
		</div>
	{/if}
</div>

<style>
	@keyframes mokugyo-shake {
		0%, 100% { transform: translateX(0) rotate(0); }
		25% { transform: translateX(-3px) rotate(-2deg); }
		75% { transform: translateX(3px) rotate(2deg); }
	}
	.animate-mokugyo-shake { animation: mokugyo-shake 0.1s ease-in-out; }
	@keyframes ripple-out {
		0% { transform: scale(0.5); opacity: 0.5; }
		100% { transform: scale(2); opacity: 0; }
	}
	.animate-ripple-out { animation: ripple-out 0.6s ease-out forwards; }
</style>
