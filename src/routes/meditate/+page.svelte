<script lang="ts">
	import { goto } from '$app/navigation';
	import { ArrowLeft, Settings, Camera, CameraOff, AlertCircle } from 'lucide-svelte';
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
	
	// Tracking state - để tránh mất tracking
	let trackingConfidence = $state(0); // 0-100
	let lastSeenHands = 0; // timestamp khi thấy hands lần cuối
	let isTrackingLost = $state(false);
	const TRACKING_TIMEOUT = 500; // ms trước khi báo mất tracking
	const RECOVERY_FADE_DURATION = 300; // ms để fade aura khi mất

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
	const PRAYING_THRESHOLD = 0.22;
	const PRAYING_TIME = 10;

	// Prayer quality feedback
	let prayerQuality = $state(0);
	let prayerHint = $state<'palms' | 'fingers' | 'together' | 'perfect'>('palms');

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
		if (!results.landmarks || results.landmarks.length === 0) {
			// Không có hands - giảm confidence theo thời gian
			const timeSinceLastSeen = Date.now() - lastSeenHands;
			
			if (lastSeenHands > 0) {
				// Đang trong quá trình mất tracking
				if (timeSinceLastSeen > TRACKING_TIMEOUT) {
					trackingConfidence = 0;
					isTrackingLost = true;
					// Fade aura ra nhưng KHÔNG reset vị trí ngay
					// bodyCenterX, bodyCenterY vẫn giữ nguyên để không bị nhảy
				} else {
					// Đang fade dần
					trackingConfidence = Math.max(0, 100 - (timeSinceLastSeen / TRACKING_TIMEOUT) * 100);
				}
			}
			return;
		}

		// Có hands - cập nhật tracking
		lastSeenHands = Date.now();
		isTrackingLost = false;
		trackingConfidence = Math.min(100, trackingConfidence + 20); // Tăng nhanh khi thấy

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

		// Smooth the movement - tăng smoothing để không bị jitter
		smoothedCenterX = smoothedCenterX * 0.85 + centerX * 0.15;
		smoothedCenterY = smoothedCenterY * 0.85 + adjustedY * 0.15;

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
			// Tracking tốt - màu vàng gold
			const color = isPraying ? '#C5A059' : 'rgba(0, 255, 255, 0.8)';
			const dotSize = 5;
			
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
					ctx.arc(point.x * canvasElement.width, point.y * canvasElement.height, dotSize, 0, 2 * Math.PI);
					ctx.fill();
				}
			}
		} else if (isTrackingLost) {
			// Không có hands - vẽ icon tìm kiếm nhẹ ở giữa
			const centerX = canvasElement.width / 2;
			const centerY = canvasElement.height / 2;
			
			ctx.save();
			ctx.strokeStyle = 'rgba(255, 200, 100, 0.4)';
			ctx.lineWidth = 2;
			ctx.setLineDash([5, 5]);
			
			// Vẽ vòng tròn tìm kiếm
			ctx.beginPath();
			ctx.arc(centerX, centerY, 30, 0, Math.PI * 2);
			ctx.stroke();
			
			// Vẽ mũi tên
			ctx.setLineDash([]);
			ctx.beginPath();
			ctx.moveTo(centerX + 20, centerY + 20);
			ctx.lineTo(centerX, centerY);
			ctx.lineTo(centerX + 15, centerY);
			ctx.moveTo(centerX, centerY);
			ctx.lineTo(centerX, centerY + 15);
			ctx.stroke();
			ctx.restore();
		}
	}

	function drawAuraEffect() {
		const ctx = auraCanvas?.getContext('2d');
		if (!ctx || !auraCanvas) return;

		ctx.clearRect(0, 0, auraCanvas.width, auraCanvas.height);

		// Không vẽ aura nếu tracking bị mất hoàn toàn
		if (trackingConfidence === 0 && !showAuraFlash) return;

		const centerX = bodyCenterX * auraCanvas.width;
		const centerY = bodyCenterY * auraCanvas.height;
		const width = bodyWidth * auraCanvas.width;
		const height = bodyHeight * auraCanvas.height;

		if (showAuraFlash) {
			// Draw burst particles when merit triggers
			drawAuraBurst(ctx, centerX, centerY, width, height);
		} else if (trackingConfidence > 10) {
			// Tính opacity dựa trên tracking confidence
			const fadeAlpha = Math.min(1, trackingConfidence / 70);
			// Draw tracking body outline aura với fade effect
			drawBodyOutlineAura(ctx, centerX, centerY, width, height, fadeAlpha);
		}

		// Draw floating particles
		drawParticles(ctx);
	}

	function drawBodyOutlineAura(ctx: CanvasRenderingContext2D, centerX: number, centerY: number, width: number, height: number, fadeAlpha: number = 1) {
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
			gradient.addColorStop(0.3, `rgba(0, 200, 255, ${layer.alpha * fadeAlpha})`);
			gradient.addColorStop(0.6, `rgba(100, 150, 255, ${layer.alpha * 0.7 * fadeAlpha})`);
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
		ctx.strokeStyle = `rgba(0, 255, 255, ${0.6 * fadeAlpha})`;
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
		ctx.strokeStyle = `rgba(180, 100, 255, ${0.4 * fadeAlpha})`;
		ctx.lineWidth = 1.5;
		ctx.shadowColor = '#B464FF';
		ctx.shadowBlur = 15;
		ctx.stroke();
		ctx.restore();

		// Add floating neon particles - giảm khi tracking yếu
		if (Math.random() > 0.6 && fadeAlpha > 0.3) {
			const angle = Math.random() * Math.PI * 2;
			const radius = width * (0.7 + Math.random() * 0.5);
			auraParticles.push({
				x: centerX + Math.cos(angle) * radius,
				y: centerY + Math.sin(angle) * radius * 0.7,
				vx: (Math.random() - 0.5) * 0.8,
				vy: -Math.random() * 1.5 - 0.8,
				life: Math.floor(50 * fadeAlpha),
				maxLife: Math.floor(50 * fadeAlpha),
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
			// Reset prayer quality when hands not detected
			prayerQuality = 0;
			prayerHint = 'palms';
			return;
		}

		const hand1 = results.landmarks[0];
		const hand2 = results.landmarks[1];

		// Calculate distances for multiple finger pairs for better detection
		const wrist1 = hand1[0];
		const wrist2 = hand2[0];
		const thumb1 = hand1[4];
		const thumb2 = hand2[4];
		const index1 = hand1[8];
		const index2 = hand2[8];
		const middle1 = hand1[12];
		const middle2 = hand2[12];

		// Distance between palms (wrists)
		const wristDistance = calculateDistance(wrist1, wrist2);
		
		// Distance between thumbs
		const thumbDistance = calculateDistance(thumb1, thumb2);
		
		// Distance between index fingers
		const indexDistance = calculateDistance(index1, index2);
		
		// Distance between middle fingers
		const middleDistance = calculateDistance(middle1, middle2);

		// Average distance of all finger pairs
		const avgFingerDistance = (thumbDistance + indexDistance + middleDistance) / 3;
		
		// Calculate prayer quality (0-100)
		// Best case: both wrists close AND all fingers close
		const wristQuality = Math.max(0, 1 - wristDistance / 0.3) * 50;
		const fingerQuality = Math.max(0, 1 - avgFingerDistance / 0.25) * 50;
		prayerQuality = Math.round(wristQuality + fingerQuality);

		// Determine hint based on what's wrong
		if (wristDistance > 0.2) {
			prayerHint = 'palms';
		} else if (avgFingerDistance > 0.15) {
			prayerHint = 'fingers';
		} else if (avgFingerDistance > PRAYING_THRESHOLD) {
			prayerHint = 'together';
		} else {
			prayerHint = 'perfect';
		}

		// Use average of wrist and finger distance for more forgiving detection
		const combinedDistance = (wristDistance + avgFingerDistance) / 2;
		const currentlyPraying = combinedDistance < PRAYING_THRESHOLD && wristDistance < 0.25;

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
		prayerQuality = 0;
		prayerHint = 'palms';
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

	// Status text based on state
	let statusText = $derived(() => {
		if (!cameraActive || cameraError) return '';
		if (isPraying) return 'Đang đếm ngược...';
		if (isTrackingLost) return 'Không tìm thấy tay';
		if (trackingConfidence < 30) return 'Đang tìm kiếm...';
		if (prayerQuality >= 80) return 'Đúng tư thế rồi!';
		if (prayerQuality >= 50) return 'Tốt rồi, giữ thêm...';
		return 'Hãy chấp tay và giữ yên';
	});
</script>

<div class="min-h-screen bg-black relative overflow-hidden">
	<!-- Camera Feed -->
	<div class="absolute inset-0">
		<video
			bind:this={videoElement}
			class="w-full h-full object-cover"
			style="transform: scaleX(-1);"
			playsinline
			muted
		></video>
	</div>

	<!-- Hand Landmarks Canvas -->
	<canvas
		bind:this={canvasElement}
		class="absolute inset-0 w-full h-full pointer-events-none"
		width={1280}
		height={720}
		style="transform: scaleX(-1);"
	></canvas>

	<!-- Aura Canvas (body tracking glow) -->
	<canvas
		bind:this={auraCanvas}
		class="absolute inset-0 w-full h-full pointer-events-none"
		width={1280}
		height={720}
		style="transform: scaleX(-1);"
	></canvas>

	<!-- Dark Overlay -->
	<div class="absolute inset-0 bg-black/40 pointer-events-none"></div>

	<!-- Header -->
	<header class="relative z-30 px-4 pt-6 pb-4 flex items-center justify-between">
		<button 
			onclick={() => goto('/dashboard')}
			class="p-2 rounded-full bg-white/10 backdrop-blur-md"
		>
			<ArrowLeft class="w-5 h-5 text-white" />
		</button>
		
		<h1 class="font-serif text-lg font-semibold text-white tracking-wide">Tích công đức</h1>
		
		<button class="p-2 rounded-full bg-white/10 backdrop-blur-md">
			<Settings class="w-5 h-5 text-white" />
		</button>
	</header>

	<!-- Countdown Circle - Top Left -->
	{#if cameraActive && !cameraError}
		<div class="absolute top-24 left-6 z-30">
			<div class="relative w-20 h-20">
				<!-- Background circle -->
				<svg class="w-full h-full -rotate-90" viewBox="0 0 80 80">
					<circle
						cx="40"
						cy="40"
						r="35"
						fill="none"
						stroke="rgba(255,255,255,0.15)"
						stroke-width="3"
					/>
					<circle
						cx="40"
						cy="40"
						r="35"
						fill="none"
						stroke={isPraying ? '#FFD700' : 'rgba(255,255,255,0.5)'}
						stroke-width="3"
						stroke-linecap="round"
						stroke-dasharray="219.91"
						stroke-dashoffset={219.91 - (prayerProgress / PRAYING_TIME) * 219.91}
						class="transition-all duration-100"
					/>
				</svg>
				
				<div class="absolute inset-0 flex flex-col items-center justify-center">
					<span class="text-2xl font-bold text-white">
						{Math.ceil(PRAYING_TIME - prayerProgress)}
					</span>
					{#if !isPraying}
						<span class="text-[10px] text-white/50 -mt-1">giây</span>
					{/if}
				</div>
			</div>
		</div>
	{/if}

	<!-- Loading State -->
	{#if isLoading && !cameraError}
		<div class="absolute inset-0 flex items-center justify-center z-20 bg-black/60">
			<div class="text-center">
				<div class="w-16 h-16 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center">
					<Camera class="w-8 h-8 text-white/60 animate-pulse" />
				</div>
				<p class="text-white/60 text-sm">Đang khởi động...</p>
			</div>
		</div>
	{/if}

	<!-- Error State -->
	{#if cameraError}
		<div class="absolute inset-0 flex items-center justify-center z-20 bg-black/80 px-6">
			<div class="text-center">
				<div class="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
					<CameraOff class="w-8 h-8 text-red-400" />
				</div>
				<p class="text-red-300 mb-2 flex items-center justify-center gap-2 text-sm">
					<AlertCircle class="w-4 h-4" />
					{cameraError}
				</p>
				<div class="flex gap-3 justify-center mt-6">
					<button
						onclick={() => { cameraError = null; startCamera(); }}
						class="px-5 py-2.5 bg-yellow-500 text-black rounded-full text-sm font-medium"
					>
						Thử lại
					</button>
					<button
						onclick={() => goto('/setup-profile')}
						class="px-5 py-2.5 bg-white/10 text-white rounded-full text-sm font-medium"
					>
						Dùng thử
					</button>
				</div>
			</div>
		</div>
	{/if}

	<!-- Bottom Footer -->
	{#if cameraActive && !cameraError}
		<div class="absolute bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-black/90 via-black/60 to-transparent pt-16 pb-8 px-6">
			<div class="flex flex-col items-center gap-3">
				<!-- Meditation Icon -->
				<div class="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center">
					<svg class="w-7 h-7 text-white" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
						<ellipse cx="24" cy="42" rx="5" ry="2.5"/>
						<path d="M24 38 C24 38 19 32 19 26 C19 20 24 14 24 14 C24 14 29 20 29 26 C29 32 24 38 24 38"/>
						<path d="M19 34 C15 28 12 24 12 20 C12 16 17 14 21 16"/>
						<path d="M29 34 C33 28 36 24 36 20 C36 16 31 14 27 16"/>
					</svg>
				</div>
				
				<!-- Instruction -->
				<p class="text-white text-center font-medium">
					{statusText()}
				</p>
				
				<!-- Prayer Quality Bar -->
				{#if !isPraying && trackingConfidence > 30}
					<div class="w-48 h-1.5 bg-white/20 rounded-full overflow-hidden">
						<div 
							class="h-full rounded-full transition-all duration-300"
							class:bg-green-400={prayerQuality >= 80}
							class:bg-yellow-400={prayerQuality >= 50 && prayerQuality < 80}
							class:bg-orange-400={prayerQuality >= 30 && prayerQuality < 50}
							class:bg-red-400={prayerQuality < 30}
							style="width: {prayerQuality}%"
						></div>
					</div>
				{/if}
			</div>
		</div>
	{/if}
</div>

<style>
	.font-serif {
		font-family: 'Playfair Display', Georgia, serif;
	}
</style>
