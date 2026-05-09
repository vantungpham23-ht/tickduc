<script lang="ts">
	// Level 2: Mầm sen non (108 - 1,079 điểm)
	// A young lotus bud emerging - delicate, promising
</script>

<svg class="w-full h-full" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
	<defs>
		<!-- Soft green-lotus gradient -->
		<linearGradient id="level2Bud" x1="0%" y1="100%" x2="0%" y2="0%">
			<stop offset="0%" stop-color="#9CAF88"/>
			<stop offset="50%" stop-color="#B5C4A5"/>
			<stop offset="100%" stop-color="#C9D4B5"/>
		</linearGradient>
		
		<!-- Inner petal gradient -->
		<linearGradient id="level2Inner" x1="0%" y1="100%" x2="0%" y2="0%">
			<stop offset="0%" stop-color="#B5C4A5"/>
			<stop offset="100%" stop-color="#E8DCC8"/>
		</linearGradient>
		
		<!-- Water reflection -->
		<linearGradient id="level2Water" x1="0%" y1="0%" x2="0%" y2="100%">
			<stop offset="0%" stop-color="#E8E2DA" stop-opacity="0.6"/>
			<stop offset="100%" stop-color="#E8E2DA" stop-opacity="0.1"/>
		</linearGradient>
		
		<!-- Ambient glow -->
		<radialGradient id="level2Glow" cx="50%" cy="50%" r="50%">
			<stop offset="0%" stop-color="#9CAF88" stop-opacity="0.12"/>
			<stop offset="100%" stop-color="#9CAF88" stop-opacity="0"/>
		</radialGradient>
		
		<filter id="level2Shadow" x="-20%" y="-20%" width="140%" height="140%">
			<feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#5C4F44" flood-opacity="0.12"/>
		</filter>
	</defs>
	
	<!-- Background ambient glow -->
	<circle cx="100" cy="100" r="90" fill="url(#level2Glow)"/>
	
	<!-- Water surface line -->
	<ellipse cx="100" cy="150" rx="60" ry="8" fill="url(#level2Water)"/>
	
	<!-- Decorative circle frame -->
	<circle cx="100" cy="100" r="70" stroke="#B5C4A5" stroke-width="0.5" stroke-opacity="0.4" stroke-dasharray="2 4"/>
	
	<!-- Lotus bud -->
	<g filter="url(#level2Shadow)">
		<!-- Outer petals (tightly closed) -->
		<ellipse cx="100" cy="100" rx="18" ry="45" fill="url(#level2Bud)" transform="rotate(0 100 120)"/>
		<ellipse cx="100" cy="100" rx="18" ry="45" fill="url(#level2Bud)" transform="rotate(45 100 120)" opacity="0.9"/>
		<ellipse cx="100" cy="100" rx="18" ry="45" fill="url(#level2Bud)" transform="rotate(90 100 120)" opacity="0.85"/>
		<ellipse cx="100" cy="100" rx="18" ry="45" fill="url(#level2Bud)" transform="rotate(135 100 120)" opacity="0.9"/>
		
		<!-- Inner emerging petals -->
		<ellipse cx="100" cy="110" rx="10" ry="30" fill="url(#level2Inner)" opacity="0.8"/>
		
		<!-- Center bud tip -->
		<ellipse cx="100" cy="72" rx="6" ry="10" fill="#C9D4B5"/>
		<ellipse cx="100" cy="70" rx="3" ry="5" fill="#E8DCC8" opacity="0.7"/>
	</g>
	
	<!-- Small floating leaves -->
	<ellipse cx="55" cy="155" rx="12" ry="4" fill="#9CAF88" opacity="0.4"/>
	<ellipse cx="145" cy="158" rx="10" ry="3" fill="#9CAF88" opacity="0.3"/>
	
	<!-- Water ripples -->
	<ellipse cx="100" cy="155" rx="35" ry="4" fill="none" stroke="#B5C4A5" stroke-width="0.5" opacity="0.5"/>
	
	<!-- Decorative dots -->
	<circle cx="45" cy="90" r="2" fill="#B5C4A5" opacity="0.5"/>
	<circle cx="155" cy="95" r="2" fill="#B5C4A5" opacity="0.5"/>
</svg>
