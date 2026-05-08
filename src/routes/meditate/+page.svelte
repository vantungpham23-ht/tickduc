<script lang="ts">
	import { goto } from '$app/navigation';
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

	// Aura particles - Zen style (lightweight)
	let auraParticles: Array<{
		x: number;
		y: number;
		vx: number;
		vy: number;
		life: number;
		maxLife: number;
		size: number;
		opacity: number;
	}> = [];

	// Zen aura state
	let auraIntensity = $state(0); // 0-1 for breathing effect
	let zenGlowPhase = 0;

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
			// Zen warm gold color
			const color = isPraying ? '#C9B896' : 'rgba(201, 184, 150, 0.7)';
			const dotSize = 4;
			const lineWidth = 2;
			
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
				ctx.lineWidth = lineWidth;
				ctx.lineCap = 'round';

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
			// Zen searching indicator - soft, non-distracting
			const centerX = canvasElement.width / 2;
			const centerY = canvasElement.height / 2;
			
			ctx.save();
			ctx.strokeStyle = 'rgba(201, 184, 150, 0.3)';
			ctx.lineWidth = 1.5;
			ctx.setLineDash([4, 4]);
			
			// Gentle searching circle
			ctx.beginPath();
			ctx.arc(centerX, centerY, 25, 0, Math.PI * 2);
			ctx.stroke();
			ctx.restore();
		}
	}

	function drawAuraEffect() {
		const ctx = auraCanvas?.getContext('2d');
		if (!ctx || !auraCanvas) return;

		ctx.clearRect(0, 0, auraCanvas.width, auraCanvas.height);

		// Skip if no tracking and no flash
		if (trackingConfidence === 0 && !showAuraFlash) return;

		const centerX = bodyCenterX * auraCanvas.width;
		const centerY = bodyCenterY * auraCanvas.height;
		const width = bodyWidth * auraCanvas.width;
		const height = bodyHeight * auraCanvas.height;

		if (showAuraFlash) {
			// Zen lotus bloom burst - elegant and smooth
			drawZenBurst(ctx, centerX, centerY, width, height);
		} else if (trackingConfidence > 10) {
			// Zen breathing aura - soft, organic, meditative
			const fadeAlpha = Math.min(1, trackingConfidence / 70);
			drawZenAura(ctx, centerX, centerY, width, height, fadeAlpha);
		}

		// Draw floating light orbs (lite version)
		drawZenParticles(ctx);
	}

	function drawZenAura(ctx: CanvasRenderingContext2D, centerX: number, centerY: number, width: number, height: number, fadeAlpha: number = 1) {
		// Zen breathing phase - slow, organic rhythm
		zenGlowPhase += 0.02;
		const breathePhase = (Math.sin(zenGlowPhase) + 1) / 2; // 0 to 1
		auraIntensity = 0.3 + breathePhase * 0.3; // Oscillates between 0.3 and 0.6

		// Primary aura - warm gold glow (zen candle)
		const baseAlpha = 0.15 * fadeAlpha * auraIntensity;
		
		// Single soft radial gradient - clean and elegant
		const gradient = ctx.createRadialGradient(
			centerX, centerY - height * 0.1, 0,
			centerX, centerY, Math.max(width, height) * 1.2
		);
		gradient.addColorStop(0, `rgba(201, 184, 150, ${baseAlpha * 1.5})`); // zen-gold center
		gradient.addColorStop(0.3, `rgba(201, 184, 150, ${baseAlpha})`);
		gradient.addColorStop(0.6, `rgba(180, 160, 130, ${baseAlpha * 0.5})`);
		gradient.addColorStop(1, 'rgba(180, 160, 130, 0)');

		ctx.save();
		ctx.beginPath();
		ctx.ellipse(
			centerX,
			centerY + height * 0.1,
			width * 1.4 + breathePhase * 10,
			height * 0.8 + breathePhase * 6,
			0, 0, Math.PI * 2
		);
		ctx.fillStyle = gradient;
		ctx.fill();
		ctx.restore();

		// Subtle incense smoke wisps - very light
		if (Math.random() > 0.95 && fadeAlpha > 0.5) {
			const angle = Math.random() * Math.PI * 2;
			const radius = width * 0.5;
			auraParticles.push({
				x: centerX + Math.cos(angle) * radius,
				y: centerY + Math.sin(angle) * radius * 0.6,
				vx: (Math.random() - 0.5) * 0.3,
				vy: -Math.random() * 0.8 - 0.3,
				life: 40,
				maxLife: 40,
				size: Math.random() * 2 + 1,
				opacity: 0.3 * fadeAlpha
			});
		}
	}

	function drawZenBurst(ctx: CanvasRenderingContext2D, centerX: number, centerY: number, width: number, height: number) {
		// Elegant burst phase - angel wings divine light effect
		const burstDuration = 3000; // 3 seconds for majestic angel effect
		const burstPhase = (Date.now() % burstDuration) / burstDuration;
		
		// Smooth easing - ease-out-cubic for majestic feel
		const easeOut = 1 - Math.pow(1 - burstPhase, 3);
		const alpha = Math.max(0, 1 - Math.pow(burstPhase, 0.5));

		// ========== LAYER 0: Divine Angel Wings (Behind Person) ==========
		if (burstPhase < 0.7) {
			const wingPhase = Math.min(1, burstPhase * 1.5);
			const wingAlpha = alpha * 0.7 * wingPhase;
			
			// Wing spread animation
			const wingSpread = wingPhase * width * 2.5;
			const wingHeight = wingPhase * height * 1.8;
			
			// Left Wing
			ctx.save();
			const leftWingGradient = ctx.createRadialGradient(
				centerX - wingSpread * 0.3, centerY - height * 0.3, 0,
				centerX - wingSpread, centerY - height * 0.5, wingSpread * 0.8
			);
			leftWingGradient.addColorStop(0, `rgba(255, 250, 240, ${wingAlpha})`);
			leftWingGradient.addColorStop(0.3, `rgba(255, 245, 220, ${wingAlpha * 0.8})`);
			leftWingGradient.addColorStop(0.6, `rgba(255, 235, 200, ${wingAlpha * 0.4})`);
			leftWingGradient.addColorStop(1, 'rgba(255, 225, 180, 0)');
			
			// Draw left wing feather shapes
			ctx.beginPath();
			ctx.moveTo(centerX, centerY - height * 0.2);
			// Feather layers going outward
			for (let i = 0; i < 5; i++) {
				const featherProgress = i / 5;
				const featherWidth = wingSpread * (0.3 + featherProgress * 0.7);
				const featherHeight = wingHeight * (0.5 + featherProgress * 0.5);
				const curveX = centerX - featherWidth;
				const curveY = centerY - height * 0.2 - featherHeight + Math.sin(featherProgress * Math.PI) * featherHeight * 0.5;
				ctx.quadraticCurveTo(
					centerX - featherWidth * 0.7, curveY + featherHeight * 0.3,
					curveX, curveY
				);
			}
			ctx.closePath();
			ctx.fillStyle = leftWingGradient;
			ctx.fill();
			ctx.restore();
			
			// Right Wing
			ctx.save();
			const rightWingGradient = ctx.createRadialGradient(
				centerX + wingSpread * 0.3, centerY - height * 0.3, 0,
				centerX + wingSpread, centerY - height * 0.5, wingSpread * 0.8
			);
			rightWingGradient.addColorStop(0, `rgba(255, 250, 240, ${wingAlpha})`);
			rightWingGradient.addColorStop(0.3, `rgba(255, 245, 220, ${wingAlpha * 0.8})`);
			rightWingGradient.addColorStop(0.6, `rgba(255, 235, 200, ${wingAlpha * 0.4})`);
			rightWingGradient.addColorStop(1, 'rgba(255, 225, 180, 0)');
			
			ctx.beginPath();
			ctx.moveTo(centerX, centerY - height * 0.2);
			for (let i = 0; i < 5; i++) {
				const featherProgress = i / 5;
				const featherWidth = wingSpread * (0.3 + featherProgress * 0.7);
				const featherHeight = wingHeight * (0.5 + featherProgress * 0.5);
				const curveX = centerX + featherWidth;
				const curveY = centerY - height * 0.2 - featherHeight + Math.sin(featherProgress * Math.PI) * featherHeight * 0.5;
				ctx.quadraticCurveTo(
					centerX + featherWidth * 0.7, curveY + featherHeight * 0.3,
					curveX, curveY
				);
			}
			ctx.closePath();
			ctx.fillStyle = rightWingGradient;
			ctx.fill();
			ctx.restore();
			
			// Halo Ring above head
			if (wingPhase > 0.3) {
				const haloAlpha = wingAlpha * 0.6 * Math.min(1, (wingPhase - 0.3) / 0.4);
				const haloRadius = width * 0.8 * wingPhase;
				
				ctx.save();
				ctx.beginPath();
				ctx.ellipse(
					centerX,
					centerY - height * 0.7,
					haloRadius,
					haloRadius * 0.3,
					0, 0, Math.PI * 2
				);
				ctx.strokeStyle = `rgba(255, 250, 230, ${haloAlpha})`;
				ctx.lineWidth = 3 * wingPhase;
				ctx.shadowColor = 'rgba(255, 250, 230, 0.8)';
				ctx.shadowBlur = 20;
				ctx.stroke();
				
				// Inner halo glow
				const haloGlow = ctx.createRadialGradient(
					centerX, centerY - height * 0.7, haloRadius * 0.5,
					centerX, centerY - height * 0.7, haloRadius * 1.5
				);
				haloGlow.addColorStop(0, `rgba(255, 255, 240, ${haloAlpha * 0.3})`);
				haloGlow.addColorStop(1, 'rgba(255, 250, 230, 0)');
				ctx.fillStyle = haloGlow;
				ctx.fill();
				ctx.restore();
			}
		}

		// ========== LAYER 1: Soft golden radiance (like candlelight expanding) ==========
		const radianceSize = width * 3 * easeOut;
		const radianceGradient = ctx.createRadialGradient(
			centerX, centerY, 0,
			centerX, centerY, radianceSize
		);
		radianceGradient.addColorStop(0, `rgba(201, 184, 150, ${alpha * 0.4})`);
		radianceGradient.addColorStop(0.4, `rgba(201, 184, 150, ${alpha * 0.15})`);
		radianceGradient.addColorStop(1, 'rgba(201, 184, 150, 0)');

		ctx.save();
		ctx.fillStyle = radianceGradient;
		ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		ctx.restore();

		// ========== LAYER 2: Gentle expanding rings (like water ripples) ==========
		for (let i = 0; i < 3; i++) {
			const ringDelay = i * 0.15;
			const ringPhase = Math.max(0, Math.min(1, (burstPhase - ringDelay) / 0.5));
			const ringEase = 1 - Math.pow(1 - ringPhase, 2);
			
			const ringScale = 1 + ringEase * 3;
			const ringAlpha = (1 - ringPhase) * 0.4;

			ctx.save();
			ctx.beginPath();
			ctx.ellipse(
				centerX,
				centerY + height * 0.1,
				width * ringScale,
				height * ringScale * 0.6,
				0, 0, Math.PI * 2
			);
			ctx.strokeStyle = `rgba(201, 184, 150, ${ringAlpha})`;
			ctx.lineWidth = 2 * (1 - ringPhase * 0.5);
			ctx.stroke();
			ctx.restore();
		}

		// ========== LAYER 3: Floating light orbs (sparse, elegant) ==========
		if (burstPhase < 0.6 && burstPhase > 0.1) {
			const orbCount = 8;
			for (let i = 0; i < orbCount; i++) {
				const angle = (i / orbCount) * Math.PI * 2 + burstPhase * 0.5;
				const distance = easeOut * Math.min(ctx.canvas.width, ctx.canvas.height) * 0.35;
				const orbX = centerX + Math.cos(angle) * distance;
				const orbY = centerY + Math.sin(angle) * distance * 0.6 - easeOut * 30;
				
				const orbGradient = ctx.createRadialGradient(orbX, orbY, 0, orbX, orbY, 8);
				orbGradient.addColorStop(0, `rgba(255, 248, 235, ${alpha * 0.8})`);
				orbGradient.addColorStop(0.5, `rgba(201, 184, 150, ${alpha * 0.4})`);
				orbGradient.addColorStop(1, 'rgba(201, 184, 150, 0)');

				ctx.save();
				ctx.beginPath();
				ctx.arc(orbX, orbY, 8, 0, Math.PI * 2);
				ctx.fillStyle = orbGradient;
				ctx.fill();
				ctx.restore();
			}
		}

		// ========== LAYER 4: Central lotus glow bloom ==========
		const bloomSize = width * 2 * easeOut;
		const bloomGradient = ctx.createRadialGradient(
			centerX, centerY, 0,
			centerX, centerY, bloomSize
		);
		bloomGradient.addColorStop(0, `rgba(255, 248, 235, ${alpha * 0.6})`);
		bloomGradient.addColorStop(0.3, `rgba(201, 184, 150, ${alpha * 0.3})`);
		bloomGradient.addColorStop(1, 'rgba(201, 184, 150, 0)');

		ctx.save();
		ctx.beginPath();
		ctx.arc(centerX, centerY, bloomSize, 0, Math.PI * 2);
		ctx.fillStyle = bloomGradient;
		ctx.fill();
		ctx.restore();
	}

	function drawZenParticles(ctx: CanvasRenderingContext2D) {
		// Zen particles - soft, floating light orbs
		for (let i = auraParticles.length - 1; i >= 0; i--) {
			const p = auraParticles[i];
			
			p.x += p.vx;
			p.y += p.vy;
			p.life--;

			if (p.life <= 0) {
				auraParticles.splice(i, 1);
				continue;
			}

			const alpha = (p.life / p.maxLife) * p.opacity;
			
			ctx.save();
			const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2);
			gradient.addColorStop(0, `rgba(255, 248, 235, ${alpha})`);
			gradient.addColorStop(0.5, `rgba(201, 184, 150, ${alpha * 0.5})`);
			gradient.addColorStop(1, 'rgba(201, 184, 150, 0)');
			
			ctx.beginPath();
			ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
			ctx.fillStyle = gradient;
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
		
		// Spawn zen light orbs - sparse, elegant
		const centerX = bodyCenterX * auraCanvas.width;
		const centerY = bodyCenterY * auraCanvas.height;
		
		for (let i = 0; i < 12; i++) {
			const angle = (i / 12) * Math.PI * 2 + Math.random() * 0.3;
			const speed = 0.5 + Math.random() * 1;
			auraParticles.push({
				x: centerX,
				y: centerY,
				vx: Math.cos(angle) * speed,
				vy: Math.sin(angle) * speed * 0.6 - 0.3,
				life: 60 + Math.random() * 30,
				maxLife: 90,
				size: 2 + Math.random() * 2,
				opacity: 0.5 + Math.random() * 0.3
			});
		}

		setTimeout(() => {
			showAuraFlash = false;
		}, 2500);

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
			class="p-2.5 rounded-full bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-colors"
		>
			<svg class="w-5 h-5 text-white/80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
				<path d="M19 12H5M12 19l-7-7 7-7"/>
			</svg>
		</button>
		
		<h1 class="font-serif text-lg font-light text-white tracking-wide">Tích công đức</h1>
		
		<button class="p-2.5 rounded-full bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-colors">
			<svg class="w-5 h-5 text-white/80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
				<circle cx="12" cy="12" r="3"/>
				<path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/>
			</svg>
		</button>
	</header>

	<!-- Countdown Circle - Top Left -->
	{#if cameraActive && !cameraError}
		<div class="absolute top-24 left-6 z-30">
			<div class="relative w-20 h-20">
				<!-- Zen circle - ink brush style -->
				<svg class="w-full h-full -rotate-90" viewBox="0 0 80 80">
					<!-- Outer soft glow -->
					<defs>
						<filter id="zenGlow" x="-50%" y="-50%" width="200%" height="200%">
							<feGaussianBlur stdDeviation="3" result="blur"/>
							<feMerge>
								<feMergeNode in="blur"/>
								<feMergeNode in="SourceGraphic"/>
							</feMerge>
						</filter>
					</defs>
					
					<!-- Background circle - subtle ink wash -->
					<circle
						cx="40"
						cy="40"
						r="35"
						fill="none"
						stroke="rgba(201, 184, 150, 0.15)"
						stroke-width="2"
					/>
					
					<!-- Progress circle - warm gold -->
					<circle
						cx="40"
						cy="40"
						r="35"
						fill="none"
						stroke={isPraying ? '#C9B896' : 'rgba(201, 184, 150, 0.5)'}
						stroke-width="2"
						stroke-linecap="round"
						stroke-dasharray="219.91"
						stroke-dashoffset={219.91 - (prayerProgress / PRAYING_TIME) * 219.91}
						filter="url(#zenGlow)"
						class="transition-all duration-300"
					/>
				</svg>
				
				<!-- Center content -->
				<div class="absolute inset-0 flex flex-col items-center justify-center">
					<span class="font-serif text-2xl font-light text-white tracking-wide">
						{Math.ceil(PRAYING_TIME - prayerProgress)}
					</span>
					{#if !isPraying}
						<span class="text-[10px] text-white/40 tracking-widest -mt-0.5">giây</span>
					{/if}
				</div>
			</div>
		</div>
	{/if}

	<!-- Loading State -->
	{#if isLoading && !cameraError}
		<div class="absolute inset-0 flex items-center justify-center z-20 bg-black/60 backdrop-blur-sm">
			<div class="text-center">
				<!-- Zen breathing lotus -->
				<div class="relative w-16 h-16 mx-auto mb-4">
					<div class="absolute inset-0 rounded-full border border-zen-gold/20 animate-ping" style="animation-duration: 3s;"></div>
					<div class="absolute inset-2 rounded-full border border-zen-gold/30 animate-pulse" style="animation-duration: 2s;"></div>
					<div class="absolute inset-4 rounded-full bg-zen-gold/20 animate-breathe-subtle"></div>
				</div>
				<p class="text-zen-gold/60 text-sm tracking-wide">Đang tĩnh tâm...</p>
			</div>
		</div>
	{/if}

	<!-- Error State -->
	{#if cameraError}
		<div class="absolute inset-0 flex items-center justify-center z-20 bg-black/80 backdrop-blur-md px-6">
			<div class="text-center max-w-xs">
				<!-- Zen error icon -->
				<div class="w-16 h-16 mx-auto mb-4 rounded-full border border-zen-gold/20 flex items-center justify-center">
					<svg class="w-8 h-8 text-zen-gold/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
						<circle cx="12" cy="12" r="10"/>
						<path d="M12 8v4M12 16h.01"/>
					</svg>
				</div>
				<p class="text-white/80 mb-6 text-sm leading-relaxed">
					{cameraError}
				</p>
				<div class="flex flex-col gap-3">
					<button
						onclick={() => { cameraError = null; startCamera(); }}
						class="w-full py-3 bg-zen-gold/20 text-zen-gold rounded-full text-sm font-medium tracking-wide hover:bg-zen-gold/30 transition-colors"
					>
						Thử lại
					</button>
					<button
						onclick={() => goto('/setup-profile')}
						class="w-full py-3 bg-white/5 text-white/60 rounded-full text-sm tracking-wide hover:bg-white/10 transition-colors"
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
				<!-- Zen Lotus Meditation Icon -->
				<div class="relative w-14 h-14 flex items-center justify-center">
					<!-- Subtle outer glow -->
					<div class="absolute inset-0 rounded-full bg-zen-gold/10 animate-pulse" style="animation-duration: 4s;"></div>
					<!-- Lotus SVG -->
					<svg class="w-8 h-8 text-zen-gold" viewBox="0 0 48 48" fill="none">
						<defs>
							<linearGradient id="lotusGrad" x1="0%" y1="100%" x2="0%" y2="0%">
								<stop offset="0%" stop-color="#C9B896" stop-opacity="0.6"/>
								<stop offset="100%" stop-color="#E8DCC8" stop-opacity="0.9"/>
							</linearGradient>
						</defs>
						<!-- Center petal -->
						<ellipse cx="24" cy="24" rx="4" ry="8" fill="url(#lotusGrad)"/>
						<!-- Side petals -->
						<path d="M24 26 C20 20 16 18 14 14 C14 14 20 14 24 22" fill="url(#lotusGrad)" opacity="0.7"/>
						<path d="M24 26 C28 20 32 18 34 14 C34 14 28 14 24 22" fill="url(#lotusGrad)" opacity="0.7"/>
						<!-- Outer petals -->
						<path d="M24 28 C18 22 12 20 10 16 C10 16 18 16 24 26" fill="url(#lotusGrad)" opacity="0.5"/>
						<path d="M24 28 C30 22 36 20 38 16 C38 16 30 16 24 26" fill="url(#lotusGrad)" opacity="0.5"/>
					</svg>
				</div>
				
				<!-- Instruction -->
				<p class="text-white/80 text-center font-light tracking-wide">
					{statusText()}
				</p>
				
				<!-- Prayer Quality Bar - Zen Style -->
				{#if !isPraying && trackingConfidence > 30}
					<div class="w-44 h-1 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
						<div 
							class="h-full rounded-full transition-all duration-500 ease-out"
							style="background: linear-gradient(90deg, #9CAF88, #C9B896);"
							style:width="{prayerQuality}%"
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
