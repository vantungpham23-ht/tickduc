<script lang="ts">
  export let size: number = 200;
  export let animated: boolean = true;
  export let glowIntensity: number = 0.15;
  export let meritValue: number = 1;

  const uid = Math.random().toString(36).substring(2, 9);
</script>

<div class="thumbnail-container" style="--size: {size}px; --glow: {glowIntensity}">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 400 400"
    width={size}
    height={size}
    class:animated
  >
    <defs>
      <linearGradient id="bgGrad-{uid}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#F5F2ED"/>
        <stop offset="50%" stop-color="#EDE8E1"/>
        <stop offset="100%" stop-color="#E5E0D8"/>
      </linearGradient>

      <linearGradient id="goldGrad-{uid}" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#C9A962"/>
        <stop offset="50%" stop-color="#D4B96A"/>
        <stop offset="100%" stop-color="#B8944D"/>
      </linearGradient>

      <filter id="softGlow-{uid}" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="4" result="blur"/>
        <feMerge>
          <feMergeNode in="blur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>

      <filter id="handGlow-{uid}" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="2.5" result="blur"/>
        <feMerge>
          <feMergeNode in="blur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>

      <filter id="shadow-{uid}" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="#2C2C2C" flood-opacity="0.08"/>
      </filter>
    </defs>

    <!-- Background -->
    <rect width="400" height="400" rx="20" fill="url(#bgGrad-{uid})"/>

    <!-- Subtle border -->
    <rect x="1" y="1" width="398" height="398" rx="20" fill="none" stroke="#D4CFC6" stroke-width="1"/>

    <!-- Outer aura rings -->
    <circle cx="200" cy="200" r="145" fill="none" stroke="url(#goldGrad-{uid})" stroke-width="0.5" opacity="0.35"/>
    <circle cx="200" cy="200" r="130" fill="none" stroke="url(#goldGrad-{uid})" stroke-width="0.3" opacity="0.25"/>

    <!-- Main halo circle -->
    <circle cx="200" cy="200" r="85" fill="none" stroke="#D4B96A" stroke-width="1.5" opacity="0.5" filter="url(#softGlow-{uid})" class="halo"/>

    <!-- Left Hand -->
    <g filter="url(#handGlow-{uid})">
      <path d="M 168 155 Q 150 162 140 180 Q 134 198 136 215 Q 138 232 144 248 Q 150 264 158 278 Q 167 292 178 302 Q 188 310 198 312 L 200 312 L 200 290 Q 190 280 182 268 Q 174 254 170 238 Q 166 222 164 208 Q 162 194 163 180 Q 164 168 168 155 Z" fill="#3D3D3D" opacity="0.88"/>
      <!-- Left thumb -->
      <path d="M 172 195 Q 178 190 186 193 Q 193 197 191 208 Q 188 217 180 215 Q 174 213 172 206 Q 171 200 172 195 Z" fill="#3D3D3D" opacity="0.88"/>
    </g>

    <!-- Right Hand -->
    <g filter="url(#handGlow-{uid})">
      <path d="M 232 155 Q 250 162 260 180 Q 266 198 264 215 Q 262 232 256 248 Q 250 264 242 278 Q 233 292 222 302 Q 212 310 202 312 L 200 312 L 200 290 Q 210 280 218 268 Q 226 254 230 238 Q 234 222 236 208 Q 238 194 237 180 Q 236 168 232 155 Z" fill="#3D3D3D" opacity="0.88"/>
      <!-- Right thumb -->
      <path d="M 228 195 Q 222 190 214 193 Q 207 197 209 208 Q 212 217 220 215 Q 226 213 228 206 Q 229 200 228 195 Z" fill="#3D3D3D" opacity="0.88"/>
    </g>

    <!-- Center palm glow -->
    <ellipse cx="200" cy="245" rx="18" ry="22" fill="#D4B96A" opacity={glowIntensity} class="palm-glow"/>

    <!-- Light rays -->
    <g opacity="0.25" stroke="url(#goldGrad-{uid})" stroke-width="0.6" stroke-linecap="round" class="rays">
      <line x1="200" y1="95" x2="200" y2="75"/>
      <line x1="245" y1="112" x2="258" y2="95"/>
      <line x1="155" y1="112" x2="142" y2="95"/>
      <line x1="280" y1="148" x2="298" y2="135"/>
      <line x1="120" y1="148" x2="102" y2="135"/>
    </g>

    <!-- Corner decorations -->
    <g opacity="0.18">
      <path d="M 28 28 Q 52 28 52 52" fill="none" stroke="#B8944D" stroke-width="0.6"/>
      <path d="M 372 28 Q 348 28 348 52" fill="none" stroke="#B8944D" stroke-width="0.6"/>
      <path d="M 28 372 Q 52 372 52 348" fill="none" stroke="#B8944D" stroke-width="0.6"/>
      <path d="M 372 372 Q 348 372 348 348" fill="none" stroke="#B8944D" stroke-width="0.6"/>
    </g>

    <!-- Text -->
    <g filter="url(#shadow-{uid})">
      <text x="200" y="360" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="30" fill="#4A4A4A" letter-spacing="5" font-weight="300">+{meritValue}</text>
      <text x="200" y="380" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="10" fill="#9A9A9A" letter-spacing="7" font-weight="400">CÔNG ĐỨC</text>
    </g>
  </svg>
</div>

<style>
  .thumbnail-container {
    width: var(--size);
    height: var(--size);
    display: inline-block;
  }

  svg.animated :global(.halo) {
    animation: haloPulse 4s ease-in-out infinite;
    transform-origin: center;
  }

  svg.animated :global(.palm-glow) {
    animation: breathe 5s ease-in-out infinite;
    transform-origin: center;
  }

  svg.animated :global(.rays) {
    animation: shimmer 3.5s ease-in-out infinite;
  }

  @keyframes haloPulse {
    0%, 100% { opacity: 0.4; stroke-width: 1.5; }
    50% { opacity: 0.7; stroke-width: 2; }
  }

  @keyframes breathe {
    0%, 100% { opacity: var(--glow); transform: scale(1); }
    50% { opacity: calc(var(--glow) * 1.8); transform: scale(1.08); }
  }

  @keyframes shimmer {
    0%, 100% { opacity: 0.2; }
    50% { opacity: 0.4; }
  }
</style>