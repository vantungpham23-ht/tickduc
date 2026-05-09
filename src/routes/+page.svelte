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

<div class="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
	<!-- Ambient backgrounds -->
	<div class="fixed inset-0 overflow-hidden pointer-events-none">
		<div class="absolute top-1/4 left-1/4 w-80 h-80 bg-[#C5A059]/4 rounded-full blur-3xl animate-float-drift"></div>
		<div class="absolute bottom-1/3 right-1/4 w-64 h-64 bg-[#93B1A7]/3 rounded-full blur-3xl animate-float-drift" style="animation-delay: -3s;"></div>
		<div class="absolute top-1/2 right-0 w-48 h-48 bg-[#C5A059]/2 rounded-full blur-3xl animate-float-drift" style="animation-delay: -6s;"></div>
	</div>

	<!-- Subtle grid -->
	<div class="fixed inset-0 opacity-[0.02] pointer-events-none" style="background-image: url('data:image/svg+xml,%3Csvg width=&quot;60&quot; height=&quot;60&quot; viewBox=&quot;0 0 60 60&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cg fill=&quot;none&quot; fill-rule=&quot;evenodd&quot;%3E%3Cg fill=&quot;%23C5A059&quot; fill-opacity=&quot;1&quot;%3E%3Cpath d=&quot;M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z&quot;/%3E%3C/g%3E%3C/g%3E%3C/svg%3E');"></div>

	<!-- Content -->
	<div class="relative z-10 text-center">
		<!-- Lotus Logo -->
		<div class="mb-10 animate-fade-in-scale">
			<svg class="w-28 h-28 mx-auto text-[#C5A059]/70" viewBox="0 0 100 100" fill="none">
				<defs>
					<linearGradient id="lotusGradHome" x1="0%" y1="100%" x2="0%" y2="0%">
						<stop offset="0%" stop-color="#C5A059" stop-opacity="0.7"/>
						<stop offset="50%" stop-color="#D4B896" stop-opacity="0.9"/>
						<stop offset="100%" stop-color="#F5F0E8" stop-opacity="1"/>
					</linearGradient>
					<filter id="lotusGlowHome">
						<feGaussianBlur stdDeviation="3" result="coloredBlur"/>
						<feMerge>
							<feMergeNode in="coloredBlur"/>
							<feMergeNode in="SourceGraphic"/>
						</feMerge>
					</filter>
				</defs>
				<!-- Outer petals -->
				<ellipse cx="50" cy="35" rx="10" ry="22" fill="url(#lotusGradHome)" transform="rotate(0 50 60)" opacity="0.6"/>
				<ellipse cx="50" cy="35" rx="10" ry="22" fill="url(#lotusGradHome)" transform="rotate(60 50 60)" opacity="0.6"/>
				<ellipse cx="50" cy="35" rx="10" ry="22" fill="url(#lotusGradHome)" transform="rotate(120 50 60)" opacity="0.6"/>
				<ellipse cx="50" cy="35" rx="10" ry="22" fill="url(#lotusGradHome)" transform="rotate(180 50 60)" opacity="0.6"/>
				<ellipse cx="50" cy="35" rx="10" ry="22" fill="url(#lotusGradHome)" transform="rotate(240 50 60)" opacity="0.6"/>
				<ellipse cx="50" cy="35" rx="10" ry="22" fill="url(#lotusGradHome)" transform="rotate(300 50 60)" opacity="0.6"/>
				<!-- Inner petals -->
				<ellipse cx="50" cy="38" rx="7" ry="16" fill="url(#lotusGradHome)" opacity="0.8" transform="rotate(30 50 60)"/>
				<ellipse cx="50" cy="38" rx="7" ry="16" fill="url(#lotusGradHome)" opacity="0.8" transform="rotate(90 50 60)"/>
				<ellipse cx="50" cy="38" rx="7" ry="16" fill="url(#lotusGradHome)" opacity="0.8" transform="rotate(150 50 60)"/>
				<ellipse cx="50" cy="38" rx="7" ry="16" fill="url(#lotusGradHome)" opacity="0.8" transform="rotate(210 50 60)"/>
				<ellipse cx="50" cy="38" rx="7" ry="16" fill="url(#lotusGradHome)" opacity="0.8" transform="rotate(270 50 60)"/>
				<ellipse cx="50" cy="38" rx="7" ry="16" fill="url(#lotusGradHome)" opacity="0.8" transform="rotate(330 50 60)"/>
				<!-- Center -->
				<circle cx="50" cy="60" r="8" fill="#C5A059" filter="url(#lotusGlowHome)" opacity="0.8"/>
				<circle cx="50" cy="60" r="5" fill="#D4B896" opacity="0.9"/>
			</svg>
		</div>

		<!-- App Name -->
		<div class="opacity-0 animate-fade-in-up" style="animation-delay: 0.3s; animation-fill-mode: forwards;">
			<h1 class="font-serif text-3xl font-light text-[#F5F0E8] tracking-widest mb-3">
				Tích Công Đức
			</h1>
			<div class="flex items-center justify-center gap-3 mb-1">
				<div class="w-8 h-px bg-gradient-to-r from-transparent to-[#C5A059]/40"></div>
				<p class="text-[#8A8070] text-sm font-light tracking-wider">Nuôi dưỡng tâm hồn an lạc</p>
				<div class="w-8 h-px bg-gradient-to-l from-transparent to-[#C5A059]/40"></div>
			</div>
		</div>
	</div>

	<!-- Progress bar -->
	<div class="absolute bottom-24 left-1/2 -translate-x-1/2 w-36 opacity-0 animate-fade-in" style="animation-delay: 0.5s; animation-fill-mode: forwards;">
		<div class="h-[1px] bg-[#C5A059]/10 rounded-full overflow-hidden">
			<div class="h-full bg-gradient-to-r from-[#C5A059]/40 to-[#D4B896]/60 rounded-full transition-all duration-100" style="width: {progress}%;"></div>
		</div>
	</div>

	<!-- Quote -->
	<div class="absolute bottom-12 left-6 right-6 text-center opacity-0 animate-fade-in" style="animation-delay: 0.8s; animation-fill-mode: forwards;">
		<p class="text-[#8A8070]/25 text-xs italic font-serif-alt tracking-wide">
			"Hành trình ngàn đăm bắt đầu từ một bước chân"
		</p>
	</div>
</div>
