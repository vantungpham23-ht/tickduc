<script lang="ts">
	// Level 3: Hoa sen chớm nở (1,080 - 4,999 điểm)
	// A lotus beginning to bloom - graceful, unfolding
</script>

<svg class="w-full h-full" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
	<defs>
		<!-- Pink-lavender lotus gradient -->
		<linearGradient id="level3Outer" x1="0%" y1="100%" x2="0%" y2="0%">
			<stop offset="0%" stop-color="#D9C4BC"/>
			<stop offset="50%" stop-color="#E8D4CC"/>
			<stop offset="100%" stop-color="#F5EEE0"/>
		</linearGradient>
		
		<!-- Inner petal gradient -->
		<linearGradient id="level3Inner" x1="0%" y1="100%" x2="0%" y2="0%">
			<stop offset="0%" stop-color="#C9B896"/>
			<stop offset="100%" stop-color="#E8DCC8"/>
		</linearGradient>
		
		<!-- Golden center glow -->
		<radialGradient id="level3Center" cx="50%" cy="50%" r="50%">
			<stop offset="0%" stop-color="#C5A059"/>
			<stop offset="60%" stop-color="#C9B896"/>
			<stop offset="100%" stop-color="#E8DCC8"/>
		</radialGradient>
		
		<!-- Water reflection -->
		<linearGradient id="level3Water" x1="0%" y1="0%" x2="0%" y2="100%">
			<stop offset="0%" stop-color="#D9C4BC" stop-opacity="0.3"/>
			<stop offset="100%" stop-color="#D9C4BC" stop-opacity="0.05"/>
		</linearGradient>
		
		<!-- Ambient glow -->
		<radialGradient id="level3Glow" cx="50%" cy="50%" r="50%">
			<stop offset="0%" stop-color="#C4A89C" stop-opacity="0.15"/>
			<stop offset="100%" stop-color="#C4A89C" stop-opacity="0"/>
		</radialGradient>
		
		<filter id="level3Shadow" x="-20%" y="-20%" width="140%" height="140%">
			<feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#5C4F44" flood-opacity="0.1"/>
		</filter>
	</defs>
	
	<!-- Background ambient glow -->
	<circle cx="100" cy="100" r="90" fill="url(#level3Glow)"/>
	
	<!-- Water surface -->
	<ellipse cx="100" cy="160" rx="65" ry="10" fill="url(#level3Water)"/>
	
	<!-- Decorative circle frame -->
	<circle cx="100" cy="100" r="70" stroke="#C4A89C" stroke-width="0.5" stroke-opacity="0.4" stroke-dasharray="2 4"/>
	
	<!-- Main lotus bloom -->
	<g filter="url(#level3Shadow)">
		<!-- Outer petals - partially open -->
		<ellipse cx="100" cy="95" rx="14" ry="38" fill="url(#level3Outer)" transform="rotate(0 100 120)" opacity="0.9"/>
		<ellipse cx="100" cy="95" rx="14" ry="38" fill="url(#level3Outer)" transform="rotate(45 100 120)" opacity="0.85"/>
		<ellipse cx="100" cy="95" rx="14" ry="38" fill="url(#level3Outer)" transform="rotate(90 100 120)" opacity="0.9"/>
		<ellipse cx="100" cy="95" rx="14" ry="38" fill="url(#level3Outer)" transform="rotate(135 100 120)" opacity="0.85"/>
		<ellipse cx="100" cy="95" rx="14" ry="38" fill="url(#level3Outer)" transform="rotate(180 100 120)" opacity="0.9"/>
		<ellipse cx="100" cy="95" rx="14" ry="38" fill="url(#level3Outer)" transform="rotate(225 100 120)" opacity="0.85"/>
		<ellipse cx="100" cy="95" rx="14" ry="38" fill="url(#level3Outer)" transform="rotate(270 100 120)" opacity="0.9"/>
		<ellipse cx="100" cy="95" rx="14" ry="38" fill="url(#level3Outer)" transform="rotate(315 100 120)" opacity="0.85"/>
		
		<!-- Inner petals -->
		<ellipse cx="100" cy="105" rx="10" ry="28" fill="url(#level3Inner)" transform="rotate(22.5 100 120)" opacity="0.9"/>
		<ellipse cx="100" cy="105" rx="10" ry="28" fill="url(#level3Inner)" transform="rotate(67.5 100 120)" opacity="0.85"/>
		<ellipse cx="100" cy="105" rx="10" ry="28" fill="url(#level3Inner)" transform="rotate(112.5 100 120)" opacity="0.9"/>
		<ellipse cx="100" cy="105" rx="10" ry="28" fill="url(#level3Inner)" transform="rotate(157.5 100 120)" opacity="0.85"/>
		<ellipse cx="100" cy="105" rx="10" ry="28" fill="url(#level3Inner)" transform="rotate(202.5 100 120)" opacity="0.9"/>
		<ellipse cx="100" cy="105" rx="10" ry="28" fill="url(#level3Inner)" transform="rotate(247.5 100 120)" opacity="0.85"/>
		<ellipse cx="100" cy="105" rx="10" ry="28" fill="url(#level3Inner)" transform="rotate(292.5 100 120)" opacity="0.9"/>
		<ellipse cx="100" cy="105" rx="10" ry="28" fill="url(#level3Inner)" transform="rotate(337.5 100 120)" opacity="0.85"/>
		
		<!-- Golden center -->
		<circle cx="100" cy="115" r="14" fill="url(#level3Center)"/>
		<circle cx="100" cy="113" r="8" fill="#E8DCC8" opacity="0.6"/>
		
		<!-- Center detail dots -->
		<circle cx="97" cy="112" r="1.5" fill="#A69070" opacity="0.5"/>
		<circle cx="103" cy="112" r="1.5" fill="#A69070" opacity="0.5"/>
		<circle cx="100" cy="116" r="1.5" fill="#A69070" opacity="0.5"/>
	</g>
	
	<!-- Floating leaves -->
	<ellipse cx="50" cy="165" rx="15" ry="5" fill="#9CAF88" opacity="0.35"/>
	<ellipse cx="150" cy="168" rx="12" ry="4" fill="#9CAF88" opacity="0.3"/>
	
	<!-- Water ripples -->
	<ellipse cx="100" cy="163" rx="40" ry="5" fill="none" stroke="#C4A89C" stroke-width="0.5" opacity="0.4"/>
	<ellipse cx="100" cy="166" rx="50" ry="6" fill="none" stroke="#C4A89C" stroke-width="0.3" opacity="0.3"/>
	
	<!-- Decorative dots -->
	<circle cx="40" cy="85" r="2" fill="#C4A89C" opacity="0.5"/>
	<circle cx="160" cy="90" r="2" fill="#C4A89C" opacity="0.5"/>
	<circle cx="55" cy="145" r="1.5" fill="#C4A89C" opacity="0.4"/>
	<circle cx="145" cy="140" r="1.5" fill="#C4A89C" opacity="0.4"/>
</svg>
