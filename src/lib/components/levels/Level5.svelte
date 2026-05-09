<script lang="ts">
	// Level 5: Tòa sen tỏa sáng (Trên 10,800 điểm)
	// The enlightened lotus throne - divine, transcendent
</script>

<svg class="w-full h-full" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
	<defs>
		<!-- Divine outer petal gradient -->
		<linearGradient id="level5Outer" x1="0%" y1="100%" x2="0%" y2="0%">
			<stop offset="0%" stop-color="#B8A07E"/>
			<stop offset="30%" stop-color="#D4C4A8"/>
			<stop offset="70%" stop-color="#E8DCC8"/>
			<stop offset="100%" stop-color="#F5EEE0"/>
		</linearGradient>
		
		<!-- Divine inner petal gradient -->
		<linearGradient id="level5Inner" x1="0%" y1="100%" x2="0%" y2="0%">
			<stop offset="0%" stop-color="#C5A059"/>
			<stop offset="50%" stop-color="#D4B896"/>
			<stop offset="100%" stop-color="#E8D4A8"/>
		</linearGradient>
		
		<!-- Sacred center glow -->
		<radialGradient id="level5Center" cx="50%" cy="50%" r="50%">
			<stop offset="0%" stop-color="#F5EEE0"/>
			<stop offset="30%" stop-color="#C5A059"/>
			<stop offset="70%" stop-color="#C9A96E"/>
			<stop offset="100%" stop-color="#B8A07E"/>
		</radialGradient>
		
		<!-- Divine aura glow -->
		<radialGradient id="level5Aura" cx="50%" cy="50%" r="50%">
			<stop offset="0%" stop-color="#C5A059" stop-opacity="0.25"/>
			<stop offset="40%" stop-color="#C5A059" stop-opacity="0.1"/>
			<stop offset="70%" stop-color="#E8DCC8" stop-opacity="0.05"/>
			<stop offset="100%" stop-color="#C5A059" stop-opacity="0"/>
		</radialGradient>
		
		<!-- Second layer aura -->
		<radialGradient id="level5Aura2" cx="50%" cy="50%" r="50%">
			<stop offset="0%" stop-color="#F5EEE0" stop-opacity="0.3"/>
			<stop offset="100%" stop-color="#F5EEE0" stop-opacity="0"/>
		</radialGradient>
		
		<!-- Water with sacred reflection -->
		<linearGradient id="level5Water" x1="0%" y1="0%" x2="0%" y2="100%">
			<stop offset="0%" stop-color="#C5A059" stop-opacity="0.3"/>
			<stop offset="50%" stop-color="#C9A96E" stop-opacity="0.15"/>
			<stop offset="100%" stop-color="#C5A059" stop-opacity="0.05"/>
		</linearGradient>
		
		<!-- Throne base gradient -->
		<linearGradient id="level5Throne" x1="0%" y1="0%" x2="0%" y2="100%">
			<stop offset="0%" stop-color="#C5A059"/>
			<stop offset="100%" stop-color="#A69070"/>
		</linearGradient>
		
		<!-- Divine radiance filter -->
		<filter id="level5Radiance" x="-100%" y="-100%" width="300%" height="300%">
			<feGaussianBlur stdDeviation="4" result="blur"/>
			<feMerge>
				<feMergeNode in="blur"/>
				<feMergeNode in="blur"/>
				<feMergeNode in="SourceGraphic"/>
			</feMerge>
		</filter>
		
		<filter id="level5Shadow" x="-20%" y="-20%" width="140%" height="140%">
			<feDropShadow dx="0" dy="6" stdDeviation="10" flood-color="#C5A059" flood-opacity="0.3"/>
		</filter>
	</defs>
	
	<!-- Background divine aura -->
	<circle cx="100" cy="90" r="100" fill="url(#level5Aura)"/>
	<circle cx="100" cy="90" r="70" fill="url(#level5Aura2)"/>
	
	<!-- Sacred light rays -->
	<g opacity="0.2">
		<line x1="100" y1="15" x2="100" y2="50" stroke="#C5A059" stroke-width="1.5"/>
		<line x1="155" y1="30" x2="130" y2="60" stroke="#C5A059" stroke-width="1"/>
		<line x1="175" y1="70" x2="145" y2="85" stroke="#C5A059" stroke-width="0.8"/>
		<line x1="180" y1="110" x2="150" y2="105" stroke="#C5A059" stroke-width="0.6"/>
		<line x1="45" y1="30" x2="70" y2="60" stroke="#C5A059" stroke-width="1"/>
		<line x1="25" y1="70" x2="55" y2="85" stroke="#C5A059" stroke-width="0.8"/>
		<line x1="20" y1="110" x2="50" y2="105" stroke="#C5A059" stroke-width="0.6"/>
	</g>
	
	<!-- Halo ring -->
	<circle cx="100" cy="85" r="55" stroke="#C5A059" stroke-width="0.3" opacity="0.4" stroke-dasharray="1 3"/>
	<circle cx="100" cy="85" r="62" stroke="#C5A059" stroke-width="0.2" opacity="0.3" stroke-dasharray="1 4"/>
	
	<!-- Water surface with sacred reflection -->
	<ellipse cx="100" cy="175" rx="75" ry="14" fill="url(#level5Water)"/>
	
	<!-- Divine lotus throne base -->
	<g filter="url(#level5Shadow)">
		<!-- Throne pedestal -->
		<ellipse cx="100" cy="170" rx="35" ry="8" fill="url(#level5Throne)" opacity="0.6"/>
		
		<!-- Main divine lotus -->
		<!-- Outer petals - majestic spread -->
		<ellipse cx="100" cy="75" rx="18" ry="48" fill="url(#level5Outer)" transform="rotate(0 100 105)" opacity="0.95" filter="url(#level5Radiance)"/>
		<ellipse cx="100" cy="75" rx="18" ry="48" fill="url(#level5Outer)" transform="rotate(25 100 105)" opacity="0.92"/>
		<ellipse cx="100" cy="75" rx="18" ry="48" fill="url(#level5Outer)" transform="rotate(50 100 105)" opacity="0.95"/>
		<ellipse cx="100" cy="75" rx="18" ry="48" fill="url(#level5Outer)" transform="rotate(75 100 105)" opacity="0.92"/>
		<ellipse cx="100" cy="75" rx="18" ry="48" fill="url(#level5Outer)" transform="rotate(100 100 105)" opacity="0.95"/>
		<ellipse cx="100" cy="75" rx="18" ry="48" fill="url(#level5Outer)" transform="rotate(125 100 105)" opacity="0.92"/>
		<ellipse cx="100" cy="75" rx="18" ry="48" fill="url(#level5Outer)" transform="rotate(150 100 105)" opacity="0.95"/>
		<ellipse cx="100" cy="75" rx="18" ry="48" fill="url(#level5Outer)" transform="rotate(175 100 105)" opacity="0.92"/>
		<ellipse cx="100" cy="75" rx="18" ry="48" fill="url(#level5Outer)" transform="rotate(200 100 105)" opacity="0.95"/>
		<ellipse cx="100" cy="75" rx="18" ry="48" fill="url(#level5Outer)" transform="rotate(225 100 105)" opacity="0.92"/>
		<ellipse cx="100" cy="75" rx="18" ry="48" fill="url(#level5Outer)" transform="rotate(250 100 105)" opacity="0.95"/>
		<ellipse cx="100" cy="75" rx="18" ry="48" fill="url(#level5Outer)" transform="rotate(275 100 105)" opacity="0.92"/>
		<ellipse cx="100" cy="75" rx="18" ry="48" fill="url(#level5Outer)" transform="rotate(300 100 105)" opacity="0.95"/>
		<ellipse cx="100" cy="75" rx="18" ry="48" fill="url(#level5Outer)" transform="rotate(325 100 105)" opacity="0.92"/>
		<ellipse cx="100" cy="75" rx="18" ry="48" fill="url(#level5Outer)" transform="rotate(350 100 105)" opacity="0.95"/>
		
		<!-- Middle petals -->
		<ellipse cx="100" cy="82" rx="14" ry="40" fill="url(#level5Inner)" transform="rotate(12 100 105)" opacity="0.9"/>
		<ellipse cx="100" cy="82" rx="14" ry="40" fill="url(#level5Inner)" transform="rotate(48 100 105)" opacity="0.88"/>
		<ellipse cx="100" cy="82" rx="14" ry="40" fill="url(#level5Inner)" transform="rotate(84 100 105)" opacity="0.9"/>
		<ellipse cx="100" cy="82" rx="14" ry="40" fill="url(#level5Inner)" transform="rotate(120 100 105)" opacity="0.88"/>
		<ellipse cx="100" cy="82" rx="14" ry="40" fill="url(#level5Inner)" transform="rotate(156 100 105)" opacity="0.9"/>
		<ellipse cx="100" cy="82" rx="14" ry="40" fill="url(#level5Inner)" transform="rotate(192 100 105)" opacity="0.88"/>
		<ellipse cx="100" cy="82" rx="14" ry="40" fill="url(#level5Inner)" transform="rotate(228 100 105)" opacity="0.9"/>
		<ellipse cx="100" cy="82" rx="14" ry="40" fill="url(#level5Inner)" transform="rotate(264 100 105)" opacity="0.88"/>
		<ellipse cx="100" cy="82" rx="14" ry="40" fill="url(#level5Inner)" transform="rotate(300 100 105)" opacity="0.9"/>
		<ellipse cx="100" cy="82" rx="14" ry="40" fill="url(#level5Inner)" transform="rotate(336 100 105)" opacity="0.88"/>
		
		<!-- Inner petals -->
		<ellipse cx="100" cy="90" rx="10" ry="30" fill="#E8D4A8" opacity="0.92"/>
		<ellipse cx="100" cy="90" rx="10" ry="30" fill="#E8D4A8" opacity="0.88" transform="rotate(36 100 105)"/>
		<ellipse cx="100" cy="90" rx="10" ry="30" fill="#E8D4A8" opacity="0.92" transform="rotate(72 100 105)"/>
		<ellipse cx="100" cy="90" rx="10" ry="30" fill="#E8D4A8" opacity="0.88" transform="rotate(108 100 105)"/>
		<ellipse cx="100" cy="90" rx="10" ry="30" fill="#E8D4A8" opacity="0.92" transform="rotate(144 100 105)"/>
		<ellipse cx="100" cy="90" rx="10" ry="30" fill="#E8D4A8" opacity="0.88" transform="rotate(180 100 105)"/>
		<ellipse cx="100" cy="90" rx="10" ry="30" fill="#E8D4A8" opacity="0.92" transform="rotate(216 100 105)"/>
		<ellipse cx="100" cy="90" rx="10" ry="30" fill="#E8D4A8" opacity="0.88" transform="rotate(252 100 105)"/>
		<ellipse cx="100" cy="90" rx="10" ry="30" fill="#E8D4A8" opacity="0.92" transform="rotate(288 100 105)"/>
		<ellipse cx="100" cy="90" rx="10" ry="30" fill="#E8D4A8" opacity="0.88" transform="rotate(324 100 105)"/>
		
		<!-- Sacred center mandala -->
		<circle cx="100" cy="100" r="22" fill="url(#level5Center)"/>
		
		<!-- Mandala inner rings -->
		<circle cx="100" cy="100" r="16" fill="none" stroke="#F5EEE0" stroke-width="0.5" opacity="0.6"/>
		<circle cx="100" cy="100" r="12" fill="none" stroke="#C5A059" stroke-width="0.5" opacity="0.5"/>
		<circle cx="100" cy="100" r="8" fill="#F5EEE0" opacity="0.8"/>
		
		<!-- Sacred geometry dots -->
		<circle cx="100" cy="100" r="4" fill="#C5A059"/>
		<circle cx="100" cy="100" r="2" fill="#F5EEE0" opacity="0.9"/>
		
		<!-- Sparkle points -->
		<circle cx="95" cy="96" r="1.5" fill="#F5EEE0"/>
		<circle cx="105" cy="96" r="1.5" fill="#F5EEE0"/>
		<circle cx="100" cy="104" r="1.5" fill="#F5EEE0"/>
		<circle cx="93" cy="100" r="1" fill="#F5EEE0" opacity="0.8"/>
		<circle cx="107" cy="100" r="1" fill="#F5EEE0" opacity="0.8"/>
	</g>
	
	<!-- Golden sacred leaves -->
	<ellipse cx="40" cy="178" rx="20" ry="7" fill="#C5A059" opacity="0.3"/>
	<ellipse cx="160" cy="180" rx="17" ry="6" fill="#C5A059" opacity="0.25"/>
	
	<!-- Sacred water ripples -->
	<ellipse cx="100" cy="178" rx="55" ry="8" fill="none" stroke="#C5A059" stroke-width="0.6" opacity="0.5"/>
	<ellipse cx="100" cy="183" rx="65" ry="9" fill="none" stroke="#C5A059" stroke-width="0.4" opacity="0.4"/>
	<ellipse cx="100" cy="188" rx="73" ry="10" fill="none" stroke="#C5A059" stroke-width="0.3" opacity="0.3"/>
	
	<!-- Divine sparkle constellation -->
	<circle cx="30" cy="55" r="3" fill="#C5A059" opacity="0.5"/>
	<circle cx="170" cy="60" r="3" fill="#C5A059" opacity="0.5"/>
	<circle cx="25" cy="95" r="2" fill="#C5A059" opacity="0.4"/>
	<circle cx="175" cy="100" r="2" fill="#C5A059" opacity="0.4"/>
	<circle cx="35" cy="140" r="2" fill="#C5A059" opacity="0.35"/>
	<circle cx="165" cy="135" r="2" fill="#C5A059" opacity="0.35"/>
	<circle cx="20" cy="125" r="1.5" fill="#C5A059" opacity="0.3"/>
	<circle cx="180" cy="120" r="1.5" fill="#C5A059" opacity="0.3"/>
	
	<!-- Additional sacred dots -->
	<circle cx="45" cy="50" r="1.5" fill="#F5EEE0" opacity="0.6"/>
	<circle cx="155" cy="55" r="1.5" fill="#F5EEE0" opacity="0.6"/>
</svg>
