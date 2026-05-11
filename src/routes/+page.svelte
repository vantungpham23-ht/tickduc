<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	let mounted = $state(false);
	let showContent = $state(false);
	let progress = $state(0);

	async function checkAuthAndRedirect() {
		const isGuest = localStorage.getItem('isGuest') === 'true';
		const hasProfile = localStorage.getItem('guestDharmaName');

		await new Promise(resolve => setTimeout(resolve, 800));

		try {
			const { supabase } = await import('$lib/supabase');
			const { data: { user } } = await supabase.auth.getUser();
			if (user) { goto('/dashboard'); return; }
		} catch (e) { /* Supabase not available */ }

		if (isGuest && hasProfile) { goto('/dashboard'); return; }
		if (isGuest && !hasProfile) { goto('/setup-profile'); return; }
		goto('/onboarding');
	}

	onMount(() => {
		mounted = true;
		const interval = setInterval(() => {
			progress += 2;
			if (progress >= 100) clearInterval(interval);
		}, 30);
		setTimeout(() => {
			showContent = true;
			setTimeout(checkAuthAndRedirect, 600);
		}, 500);
	});
</script>

<div class="min-h-screen flex flex-col items-center justify-center relative overflow-hidden" style="background-color: #F9F8F6;">
	<!-- Subtle ambient -->
	<div class="fixed inset-0 overflow-hidden pointer-events-none">
		<div class="absolute top-1/4 left-1/4 w-80 h-80 bg-[#B8860B]/5 rounded-full blur-3xl animate-float-drift"></div>
		<div class="absolute bottom-1/3 right-1/4 w-64 h-64 bg-[#6B8E6B]/5 rounded-full blur-3xl animate-float-drift" style="animation-delay: -3s;"></div>
	</div>

	<!-- Content -->
	<div class="relative z-10 text-center">
		<!-- Lotus Logo -->
		<div class="mb-10 animate-fade-in-scale">
			<svg class="w-28 h-28 mx-auto" viewBox="0 0 100 100" fill="none">
				<defs>
					<linearGradient id="lotusGradHome" x1="0%" y1="100%" x2="0%" y2="0%">
						<stop offset="0%" stop-color="#8B6508"/>
						<stop offset="50%" stop-color="#B8860B"/>
						<stop offset="100%" stop-color="#DAA520"/>
					</linearGradient>
				</defs>
				<!-- Outer petals -->
				<ellipse cx="50" cy="35" rx="10" ry="22" fill="url(#lotusGradHome)" transform="rotate(0 50 60)" opacity="0.7"/>
				<ellipse cx="50" cy="35" rx="10" ry="22" fill="url(#lotusGradHome)" transform="rotate(60 50 60)" opacity="0.7"/>
				<ellipse cx="50" cy="35" rx="10" ry="22" fill="url(#lotusGradHome)" transform="rotate(120 50 60)" opacity="0.7"/>
				<ellipse cx="50" cy="35" rx="10" ry="22" fill="url(#lotusGradHome)" transform="rotate(180 50 60)" opacity="0.7"/>
				<ellipse cx="50" cy="35" rx="10" ry="22" fill="url(#lotusGradHome)" transform="rotate(240 50 60)" opacity="0.7"/>
				<ellipse cx="50" cy="35" rx="10" ry="22" fill="url(#lotusGradHome)" transform="rotate(300 50 60)" opacity="0.7"/>
				<!-- Inner petals -->
				<ellipse cx="50" cy="38" rx="7" ry="16" fill="url(#lotusGradHome)" opacity="0.85" transform="rotate(30 50 60)"/>
				<ellipse cx="50" cy="38" rx="7" ry="16" fill="url(#lotusGradHome)" opacity="0.85" transform="rotate(90 50 60)"/>
				<ellipse cx="50" cy="38" rx="7" ry="16" fill="url(#lotusGradHome)" opacity="0.85" transform="rotate(150 50 60)"/>
				<ellipse cx="50" cy="38" rx="7" ry="16" fill="url(#lotusGradHome)" opacity="0.85" transform="rotate(210 50 60)"/>
				<ellipse cx="50" cy="38" rx="7" ry="16" fill="url(#lotusGradHome)" opacity="0.85" transform="rotate(270 50 60)"/>
				<ellipse cx="50" cy="38" rx="7" ry="16" fill="url(#lotusGradHome)" opacity="0.85" transform="rotate(330 50 60)"/>
				<!-- Center -->
				<circle cx="50" cy="60" r="8" fill="#B8860B" opacity="0.9"/>
				<circle cx="50" cy="60" r="5" fill="#DAA520" opacity="0.95"/>
			</svg>
		</div>

		<!-- App Name -->
		<div class="opacity-0 animate-fade-in-up" style="animation-delay: 0.3s; animation-fill-mode: forwards;">
			<h1 class="font-serif text-3xl font-medium text-[#1A1918] tracking-wide mb-3">
				Tích Công Đức
			</h1>
			<p class="text-[#7A7573] text-sm tracking-wide">Nuôi dưỡng tâm hồn an lạc</p>
		</div>
	</div>

	<!-- Progress bar -->
	<div class="absolute bottom-24 left-1/2 -translate-x-1/2 w-36 opacity-0 animate-fade-in" style="animation-delay: 0.5s; animation-fill-mode: forwards;">
		<div class="h-[2px] bg-[#E8E5E2] rounded-full overflow-hidden">
			<div class="h-full bg-[#B8860B] rounded-full transition-all duration-100" style="width: {progress}%;"></div>
		</div>
	</div>

	<!-- Quote -->
	<div class="absolute bottom-12 left-6 right-6 text-center opacity-0 animate-fade-in" style="animation-delay: 0.8s; animation-fill-mode: forwards;">
		<p class="text-[#A8A3A0] text-xs italic font-serif-alt tracking-wide">
			"Hành trình ngàn dặm bắt đầu từ một bước chân"
		</p>
	</div>
</div>
