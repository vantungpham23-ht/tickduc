<script lang="ts">
	// Level 1: Hạt giống Bồ Đề (0 - 107 điểm)
	// A zen seed waiting to sprout - minimalist, elegant
</script>

<svg class="w-full h-full" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
	<defs>
		<!-- Soft golden gradient -->
		<radialGradient id="level1Seed" cx="50%" cy="50%" r="50%">
			<stop offset="0%" stop-color="#E8DCC8"/>
			<stop offset="60%" stop-color="#C9B896"/>
			<stop offset="100%" stop-color="#A69070"/>
		</radialGradient>
		
		<!-- Ambient glow -->
		<radialGradient id="level1Glow" cx="50%" cy="50%" r="50%">
			<stop offset="0%" stop-color="#C5A059" stop-opacity="0.15"/>
			<stop offset="100%" stop-color="#C5A059" stop-opacity="0"/>
		</radialGradient>
		
		<!-- Earth tone shadow -->
		<filter id="level1Shadow" x="-20%" y="-20%" width="140%" height="140%">
			<feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="#5C4F44" flood-opacity="0.15"/>
		</filter>
	</defs>
	
	<!-- Background ambient glow -->
	<circle cx="100" cy="100" r="90" fill="url(#level1Glow)"/>
	
	<!-- Decorative circle frame - zen minimalist -->
	<circle cx="100" cy="100" r="70" stroke="#C9B896" stroke-width="0.5" stroke-opacity="0.3" stroke-dasharray="2 4"/>
	
	<!-- Main seed shape - organic, peaceful -->
	<g filter="url(#level1Shadow)">
		<!-- Seed body -->
		<ellipse cx="100" cy="115" rx="28" ry="38" fill="url(#level1Seed)"/>
		
		<!-- Seed highlight -->
		<ellipse cx="92" cy="105" rx="8" ry="12" fill="#F5EEE0" opacity="0.5"/>
		
		<!-- Subtle vein line -->
		<path d="M100 85 Q100 100 100 140" stroke="#A69070" stroke-width="1" stroke-opacity="0.3" fill="none"/>
	</g>
	
	<!-- Tiny sprouting hint - hope -->
	<path d="M100 77 Q100 70 100 65" stroke="#9CAF88" stroke-width="1.5" stroke-linecap="round" fill="none"/>
	<circle cx="100" cy="62" r="3" fill="#9CAF88" opacity="0.6"/>
	
	<!-- Minimalist decorative dots -->
	<circle cx="55" cy="80" r="2" fill="#C9B896" opacity="0.4"/>
	<circle cx="145" cy="120" r="2" fill="#C9B896" opacity="0.4"/>
	<circle cx="70" cy="150" r="1.5" fill="#C9B896" opacity="0.3"/>
	<circle cx="130" cy="65" r="1.5" fill="#C9B896" opacity="0.3"/>
</svg>
