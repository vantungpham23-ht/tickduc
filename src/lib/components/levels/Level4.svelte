<script lang="ts">
	// Level 4: Hoa sen vàng kim (5,000 - 10,799 điểm)
	// A golden lotus in full bloom - radiant, majestic
</script>

<svg class="w-full h-full" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
	<defs>
		<!-- Golden outer petal gradient -->
		<linearGradient id="level4Outer" x1="0%" y1="100%" x2="0%" y2="0%">
			<stop offset="0%" stop-color="#C9A96E"/>
			<stop offset="40%" stop-color="#D4B896"/>
			<stop offset="100%" stop-color="#E8DCC8"/>
		</linearGradient>
		
		<!-- Golden inner petal gradient -->
		<linearGradient id="level4Inner" x1="0%" y1="100%" x2="0%" y2="0%">
			<stop offset="0%" stop-color="#C5A059"/>
			<stop offset="100%" stop-color="#E8D4A8"/>
		</linearGradient>
		
		<!-- Center radiant glow -->
		<radialGradient id="level4Center" cx="50%" cy="50%" r="50%">
			<stop offset="0%" stop-color="#F5EEE0"/>
			<stop offset="40%" stop-color="#C5A059"/>
			<stop offset="100%" stop-color="#C9A96E"/>
		</radialGradient>
		
		<!-- Golden ambient glow -->
		<radialGradient id="level4Glow" cx="50%" cy="50%" r="50%">
			<stop offset="0%" stop-color="#C5A059" stop-opacity="0.2"/>
			<stop offset="50%" stop-color="#C5A059" stop-opacity="0.08"/>
			<stop offset="100%" stop-color="#C5A059" stop-opacity="0"/>
		</radialGradient>
		
		<!-- Water with gold reflection -->
		<linearGradient id="level4Water" x1="0%" y1="0%" x2="0%" y2="100%">
			<stop offset="0%" stop-color="#C5A059" stop-opacity="0.25"/>
			<stop offset="100%" stop-color="#C5A059" stop-opacity="0.05"/>
		</linearGradient>
		
		<!-- Radiance effect -->
		<filter id="level4GlowFilter" x="-50%" y="-50%" width="200%" height="200%">
			<feGaussianBlur stdDeviation="3" result="blur"/>
			<feMerge>
				<feMergeNode in="blur"/>
				<feMergeNode in="SourceGraphic"/>
			</feMerge>
		</filter>
		
		<filter id="level4Shadow" x="-20%" y="-20%" width="140%" height="140%">
			<feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="#C5A059" flood-opacity="0.25"/>
		</filter>
	</defs>
	
	<!-- Background ambient glow -->
	<circle cx="100" cy="95" r="95" fill="url(#level4Glow)"/>
	
	<!-- Light rays -->
	<g opacity="0.15">
		<line x1="100" y1="30" x2="100" y2="60" stroke="#C5A059" stroke-width="1"/>
		<line x1="140" y1="45" x2="125" y2="70" stroke="#C5A059" stroke-width="0.5"/>
		<line x1="160" y1="80" x2="135" y2="95" stroke="#C5A059" stroke-width="0.5"/>
		<line x1="60" y1="45" x2="75" y2="70" stroke="#C5A059" stroke-width="0.5"/>
		<line x1="40" y1="80" x2="65" y2="95" stroke="#C5A059" stroke-width="0.5"/>
	</g>
	
	<!-- Water surface -->
	<ellipse cx="100" cy="165" rx="70" ry="12" fill="url(#level4Water)"/>
	
	<!-- Decorative circle frame -->
	<circle cx="100" cy="95" r="75" stroke="#C5A059" stroke-width="0.5" stroke-opacity="0.4" stroke-dasharray="2 4"/>
	
	<!-- Main golden lotus -->
	<g filter="url(#level4Shadow)">
		<!-- Outer petals - fully open, radiant -->
		<ellipse cx="100" cy="85" rx="16" ry="42" fill="url(#level4Outer)" transform="rotate(0 100 115)" opacity="0.95" filter="url(#level4GlowFilter)"/>
		<ellipse cx="100" cy="85" rx="16" ry="42" fill="url(#level4Outer)" transform="rotate(30 100 115)" opacity="0.9"/>
		<ellipse cx="100" cy="85" rx="16" ry="42" fill="url(#level4Outer)" transform="rotate(60 100 115)" opacity="0.95"/>
		<ellipse cx="100" cy="85" rx="16" ry="42" fill="url(#level4Outer)" transform="rotate(90 100 115)" opacity="0.9"/>
		<ellipse cx="100" cy="85" rx="16" ry="42" fill="url(#level4Outer)" transform="rotate(120 100 115)" opacity="0.95"/>
		<ellipse cx="100" cy="85" rx="16" ry="42" fill="url(#level4Outer)" transform="rotate(150 100 115)" opacity="0.9"/>
		<ellipse cx="100" cy="85" rx="16" ry="42" fill="url(#level4Outer)" transform="rotate(180 100 115)" opacity="0.95"/>
		<ellipse cx="100" cy="85" rx="16" ry="42" fill="url(#level4Outer)" transform="rotate(210 100 115)" opacity="0.9"/>
		<ellipse cx="100" cy="85" rx="16" ry="42" fill="url(#level4Outer)" transform="rotate(240 100 115)" opacity="0.95"/>
		<ellipse cx="100" cy="85" rx="16" ry="42" fill="url(#level4Outer)" transform="rotate(270 100 115)" opacity="0.9"/>
		<ellipse cx="100" cy="85" rx="16" ry="42" fill="url(#level4Outer)" transform="rotate(300 100 115)" opacity="0.95"/>
		<ellipse cx="100" cy="85" rx="16" ry="42" fill="url(#level4Outer)" transform="rotate(330 100 115)" opacity="0.9"/>
		
		<!-- Middle petals -->
		<ellipse cx="100" cy="90" rx="12" ry="35" fill="url(#level4Inner)" transform="rotate(15 100 115)" opacity="0.9"/>
		<ellipse cx="100" cy="90" rx="12" ry="35" fill="url(#level4Inner)" transform="rotate(75 100 115)" opacity="0.85"/>
		<ellipse cx="100" cy="90" rx="12" ry="35" fill="url(#level4Inner)" transform="rotate(135 100 115)" opacity="0.9"/>
		<ellipse cx="100" cy="90" rx="12" ry="35" fill="url(#level4Inner)" transform="rotate(195 100 115)" opacity="0.85"/>
		<ellipse cx="100" cy="90" rx="12" ry="35" fill="url(#level4Inner)" transform="rotate(255 100 115)" opacity="0.9"/>
		<ellipse cx="100" cy="90" rx="12" ry="35" fill="url(#level4Inner)" transform="rotate(315 100 115)" opacity="0.85"/>
		
		<!-- Inner petals -->
		<ellipse cx="100" cy="98" rx="8" ry="25" fill="#E8D4A8" opacity="0.9"/>
		<ellipse cx="100" cy="98" rx="8" ry="25" fill="#E8D4A8" opacity="0.85" transform="rotate(60 100 115)"/>
		<ellipse cx="100" cy="98" rx="8" ry="25" fill="#E8D4A8" opacity="0.9" transform="rotate(120 100 115)"/>
		<ellipse cx="100" cy="98" rx="8" ry="25" fill="#E8D4A8" opacity="0.85" transform="rotate(180 100 115)"/>
		<ellipse cx="100" cy="98" rx="8" ry="25" fill="#E8D4A8" opacity="0.9" transform="rotate(240 100 115)"/>
		<ellipse cx="100" cy="98" rx="8" ry="25" fill="#E8D4A8" opacity="0.85" transform="rotate(300 100 115)"/>
		
		<!-- Radiant center -->
		<circle cx="100" cy="110" r="18" fill="url(#level4Center)"/>
		<circle cx="100" cy="108" r="10" fill="#F5EEE0" opacity="0.7"/>
		
		<!-- Center mandala pattern -->
		<circle cx="100" cy="110" r="6" fill="none" stroke="#A69070" stroke-width="0.5" opacity="0.6"/>
		<circle cx="100" cy="110" r="3" fill="#C5A059" opacity="0.8"/>
		
		<!-- Sparkle dots -->
		<circle cx="97" cy="107" r="1" fill="#F5EEE0" opacity="0.9"/>
		<circle cx="103" cy="107" r="1" fill="#F5EEE0" opacity="0.9"/>
		<circle cx="100" cy="113" r="1" fill="#F5EEE0" opacity="0.9"/>
	</g>
	
	<!-- Golden floating leaves -->
	<ellipse cx="45" cy="170" rx="18" ry="6" fill="#C5A059" opacity="0.25"/>
	<ellipse cx="155" cy="173" rx="15" ry="5" fill="#C5A059" opacity="0.2"/>
	
	<!-- Water ripples with gold -->
	<ellipse cx="100" cy="168" rx="50" ry="7" fill="none" stroke="#C5A059" stroke-width="0.5" opacity="0.5"/>
	<ellipse cx="100" cy="172" rx="60" ry="8" fill="none" stroke="#C5A059" stroke-width="0.3" opacity="0.35"/>
	<ellipse cx="100" cy="176" rx="68" ry="9" fill="none" stroke="#C5A059" stroke-width="0.2" opacity="0.25"/>
	
	<!-- Decorative sparkle dots -->
	<circle cx="35" cy="70" r="2.5" fill="#C5A059" opacity="0.5"/>
	<circle cx="165" cy="75" r="2.5" fill="#C5A059" opacity="0.5"/>
	<circle cx="50" cy="130" r="1.5" fill="#C5A059" opacity="0.4"/>
	<circle cx="150" cy="125" r="1.5" fill="#C5A059" opacity="0.4"/>
	<circle cx="25" cy="100" r="1.5" fill="#C5A059" opacity="0.3"/>
	<circle cx="175" cy="105" r="1.5" fill="#C5A059" opacity="0.3"/>
</svg>
