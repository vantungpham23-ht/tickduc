<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { currentTheme } from '$lib/stores/theme';

	// === VIETNAMESE LUNAR CALENDAR ===
	// Pre-computed lunar calendar data for accuracy
	// Each entry: { lunarNewYear: [dd, mm, yyyy], leapMonths: number[] }
	// Lunar new year = first day of year 1 (mùng 1 tháng giêng)

	const LUNAR_DATA: Record<number, { tet: [number, number, number]; leapMonths: number[] }> = {
		2024: { tet: [10, 2, 2024], leapMonths: [] },
		2025: { tet: [29, 1, 2025], leapMonths: [6] },
		2026: { tet: [17, 2, 2026], leapMonths: [] },
		2027: { tet: [7, 2, 2027], leapMonths: [6] },
		2028: { tet: [26, 1, 2028], leapMonths: [6] },
		2029: { tet: [13, 2, 2029], leapMonths: [] },
		2030: { tet: [3, 2, 2030], leapMonths: [7] },
	};

	function jdFromDate(d: number, m: number, y: number): number {
		let a = Math.floor((14 - m) / 12);
		let yy = y + 4800 - a;
		let mm = m + 12 * a - 3;
		return d + Math.floor((153 * mm + 2) / 5) + 365 * yy
			+ Math.floor(yy / 4) - Math.floor(yy / 100) + Math.floor(yy / 400) - 32045;
	}

	const HEAVENLY_STEMS = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'];
	const ZODIAC_ANIMALS = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];
	const VIETNAMESE_HOURS = [
		'Tý (23-1)', 'Sửu (1-3)', 'Dần (3-5)', 'Mão (5-7)', 'Thìn (7-9)', 'Tỵ (9-11)',
		'Ngọ (11-13)', 'Mùi (13-15)', 'Thân (15-17)', 'Dậu (17-19)', 'Tuất (19-21)', 'Hợi (21-23)'
	];
	const HOANG_DAO_HOURS = ['Tý', 'Sửu', 'Mão', 'Ngọ', 'Mùi', 'Dậu'];
	const LUNAR_MONTHS = ['Giêng', 'Hai', 'Ba', 'Tư', 'Năm', 'Sáu', 'Bảy', 'Tám', 'Chín', 'Mười', 'Mười Một', 'Mười Hai'];

	function getLunarDate(date: Date): { day: number; month: number; year: number; isLeap: boolean } {
		const gy = date.getFullYear();
		const gm = date.getMonth() + 1;
		const gd = date.getDate();
		const jd = jdFromDate(gd, gm, gy);

		// Find which lunar year this date falls in
		for (let year = gy; year >= gy - 1; year--) {
			const data = LUNAR_DATA[year];
			if (!data) continue;
			const [td, tm, ty] = data.tet;
			const tetJd = jdFromDate(td, tm, ty);
			const nextYearData = LUNAR_DATA[year + 1];
			const nextTetJd = nextYearData ? jdFromDate(nextYearData.tet[0], nextYearData.tet[1], nextYearData.tet[2]) : 9999999;

			if (jd >= tetJd && jd < nextTetJd) {
				// This is lunar year "year"
				let daysSinceTet = jd - tetJd;

				// Count through months
				let month = 1;
				let dayOfMonth = 1;
				let dayCounter = 0;

				while (dayCounter <= daysSinceTet) {
					// Days in this month (29 or 30)
					const daysInMonth = isLeapMonth(year, month) ? 30 : (getMonthLength(year, month));

					if (dayCounter + daysInMonth > daysSinceTet) {
						dayOfMonth = daysSinceTet - dayCounter + 1;
						break;
					}
					dayCounter += daysInMonth;
					month++;
					if (month > 12) break;
				}

				const isLeap = isLeapMonth(year, month);
				return { day: dayOfMonth, month, year, isLeap };
			}
		}

		return { day: 1, month: 1, year: gy, isLeap: false };
	}

	function getMonthLength(year: number, month: number): number {
		// Approximate month lengths based on lunar year data
		// Typically alternate between 29 and 30 days
		const data = LUNAR_DATA[year];
		if (!data) return 30;

		// Standard pattern: most years have 6 months of 30 days and 6 of 29 days
		// Count of 30-day months per year is roughly half
		const thirtyDayMonths = getThirtyDayMonths(year);
		return thirtyDayMonths.includes(month) ? 30 : 29;
	}

	function isLeapMonth(year: number, month: number): boolean {
		const data = LUNAR_DATA[year];
		return data?.leapMonths?.includes(month) ?? false;
	}

	function getThirtyDayMonths(year: number): number[] {
		// Known 30-day months for each year (approximate)
		// Lunar months typically alternate, with ~6 months of 30 days
		// Common pattern for Vietnamese lunar calendar
		const patterns: Record<number, number[]> = {
			2024: [1, 3, 5, 8, 10, 12],
			2025: [1, 2, 4, 6, 8, 9, 11],
			2026: [1, 3, 5, 7, 9, 11, 12],
			2027: [1, 3, 4, 6, 8, 10, 12],
			2028: [1, 2, 4, 6, 9, 11],
			2029: [1, 3, 5, 8, 10, 12],
			2030: [1, 3, 4, 6, 8, 10, 11],
		};
		return patterns[year] ?? [1, 3, 5, 7, 9, 11];
	}

	function getCanChiYear(year: number): string {
		// Vietnamese cycle: starts from year 4 (Giáp Tý = 1984)
		let cycleYear = (year - 4) % 60;
		if (cycleYear < 0) cycleYear += 60;
		return `${HEAVENLY_STEMS[cycleYear % 10]} ${ZODIAC_ANIMALS[cycleYear % 12]}`;
	}

	function getCanChiDay(jd: number): string {
		// Vietnamese day cycle: starts from 1/1/1988 = Giáp Tý
		// JDN of 1/1/1988 = 2447162
		let offset = (jd - 2447162 + 10) % 60;
		if (offset < 0) offset += 60;
		return `${HEAVENLY_STEMS[offset % 10]} ${ZODIAC_ANIMALS[offset % 12]}`;
	}

	function getDayQuality(date: Date): { quality: string; color: string; description: string; icon: string } {
		const day = date.getDate();
		const month = date.getMonth() + 1;
		const zodiacDay = (day + month) % 6;
		const qualities = [
			{ quality: 'Đại Cát', color: '#4CAF50', description: 'Ngày hoàng đạo, làm việc gì cũng thuận lợi', icon: 'star' },
			{ quality: 'Tiểu Cát', color: '#8BC34A', description: 'Ngày tốt, thích hợp cho việc bắt đầu mới', icon: 'sun' },
			{ quality: 'Bình Hòa', color: '#9E9E9E', description: 'Ngày bình thường, giữ tâm an ổn', icon: 'cloud' },
			{ quality: 'Tiểu Hung', color: '#FF9800', description: 'Ngày có chút trở ngại, cẩn thận hơn', icon: 'warning' },
			{ quality: 'Đại Hung', color: '#E53935', description: 'Ngày xấu, nên thận trọng trong mọi việc', icon: 'alert' },
			{ quality: 'Bình Hòa', color: '#9E9E9E', description: 'Ngày cân bằng, giữ tâm an lành', icon: 'cloud' },
		];
		return qualities[zodiacDay % 6];
	}

	// State
	let currentTime = $state(new Date());
	let lunarDate = $state({ day: 1, month: 1, year: 2026, isLeap: false });
	let canChiDay = $state('Giáp Tý');
	let canChiYear = $state('Bính Ngọ');
	let dayQuality = $state({ quality: 'Bình Hòa', color: '#9E9E9E', description: 'Ngày bình thường', icon: 'cloud' });

	let currentHourIndex = $derived(Math.floor((currentTime.getHours() + 1) / 2) % 12);
	let currentHourName = $derived(VIETNAMESE_HOURS[currentHourIndex]);

	let goodHours = $derived(() => {
		const day = currentTime.getDate();
		const idx = day % 6;
		return [0, 2, 4, 6, 8, 10].map(i => VIETNAMESE_HOURS[(i + idx) % 12]);
	});

	let dailyQuote = $derived({
		text: "Nếu bạn yêu thương mà không gây ra hận quả, bạn đã hiểu ý nghĩa của sự vắng lặng.",
		source: "Đức Phật"
	});

	const quotes = [
		{ text: "Nếu bạn yêu thương mà không gây ra hận quả, bạn đã hiểu ý nghĩa của sự vắng lặng.", source: "Đức Phật" },
		{ text: "Đừng sống trong quá khứ, đừng mơ về tương lai, trí tuệ là sống trong hiện tại.", source: "Đức Phật" },
		{ text: "Kẻ thù không thể nào là kẻ thù vĩnh viễn, cũng như người bạn không thể nào là bạn vĩnh viễn.", source: "Đức Phật" },
		{ text: "Hạnh phúc không phải là điều có sẵn, nó xuất phát từ chính hành động của bạn.", source: "Đức Phật" },
		{ text: "Mọi khổ đau đều sinh ra từ tham lam, sân hận, si mê. Mọi hạnh phúc đều sinh ra từ từ, biết đủ.", source: "Đức Phật" },
		{ text: "Hãy để tâm bạn như mặt hồ tĩnh lặng, nhìn thẳng vào bản chất của sự vật.", source: "Thiền Tông" },
		{ text: "Tâm an thì cảnh an. Tâm loạn thì cảnh loạn.", source: "Thiền Tông" },
		{ text: "Cho đi không mất, giữ lại không được, hà tất phải tham lam.", source: "Kinh Phật" },
		{ text: "Im lặng không phải là yếu đuối, đó là sức mạnh của người biết kiềm chế.", source: "Thiền Tông" },
		{ text: "Mỗi ngày là một cơ hội để bắt đầu lại, để trở nên tốt đẹp hơn.", source: "Đức Phật" },
		{ text: "Khi tâm bạn rộng lớn như đại dương, mọi khổ đau đều tan biến.", source: "Kinh Phật" },
		{ text: "Hãy là ánh sáng cho chính mình, đừng chờ đợi ai thắp sáng cho bạn.", source: "Kinh Phật" },
		{ text: "Sự giận dữ sinh ra sự hối hận, sự bình yên sinh ra hạnh phúc vĩnh cửu.", source: "Đức Phật" },
	];

	let quote = $derived(quotes[currentTime.getDate() % quotes.length]);

	function formatSolarDate(date: Date): string {
		const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
		const months = ['Một', 'Hai', 'Ba', 'Tư', 'Năm', 'Sáu', 'Bảy', 'Tám', 'Chín', 'Mười', 'Mười Một', 'Mười Hai'];
		return `${days[date.getDay()]}, ngày ${date.getDate()} tháng ${months[date.getMonth()]} năm ${date.getFullYear()}`;
	}

	function formatLunarDate(lunar: typeof lunarDate): string {
		// Vietnamese day names
		const dayNames: Record<number, string> = {
			1: 'Mùng Một', 2: 'Mùng Hai', 3: 'Mùng Ba', 4: 'Mùng Bốn', 5: 'Mùng Năm',
			6: 'Mùng Sáu', 7: 'Mùng Bảy', 8: 'Mùng Tám', 9: 'Mùng Chín', 10: 'Mùng Mười',
			11: 'Mười Một', 12: 'Mười Hai', 13: 'Mười Ba', 14: 'Mười Bốn', 15: 'Mười Lăm',
			16: 'Mười Sáu', 17: 'Mười Bảy', 18: 'Mười Tám', 19: 'Mười Chín', 20: 'Hai Mươi',
			21: 'Hai Mươi Mốt', 22: 'Hai Mươi Hai', 23: 'Hai Mươi Ba', 24: 'Hai Mươi Bốn',
			25: 'Hai Mươi Lăm', 26: 'Hai Mươi Sáu', 27: 'Hai Mươi Bảy', 28: 'Hai Mươi Tám',
			29: 'Hai Mươi Chín', 30: 'Ba Mươi'
		};
		let dayName = dayNames[lunar.day] || `Mùng ${lunar.day}`;
		if (lunar.day > 30) dayName = `Mùng ${lunar.day - 30}`; // For leap months
		let monthName = LUNAR_MONTHS[lunar.month - 1] || 'Mười Hai';
		return `Ngày ${dayName} tháng ${monthName} năm ${lunar.year}${lunar.isLeap ? ' (nhuận)' : ''}`;
	}

	function formatTime(date: Date): string {
		return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
	}

	onMount(() => {
		const updateTime = () => {
			currentTime = new Date();
			lunarDate = getLunarDate(currentTime);
			const jd = jdFromDate(currentTime.getDate(), currentTime.getMonth() + 1, currentTime.getFullYear());
			canChiDay = getCanChiDay(jd);
			canChiYear = getCanChiYear(currentTime.getFullYear());
			dayQuality = getDayQuality(currentTime);
		};
		updateTime();
		const interval = setInterval(updateTime, 1000);
		return () => clearInterval(interval);
	});
</script>

<div class="min-h-screen pb-20" style="background-color: var(--color-bg-primary, #FAF7F2);">
	<!-- Ambient glow -->
	<div class="fixed inset-0 pointer-events-none overflow-hidden">
		<div class="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl" style="background: {$currentTheme.primary}05;"></div>
		<div class="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full blur-3xl" style="background: {$currentTheme.secondary}05;"></div>
	</div>

	<!-- Header -->
	<header class="relative px-6 pt-10 pb-6 text-center">
		<h1 class="font-serif text-2xl tracking-[0.3em] uppercase" style="color: {$currentTheme.textPrimary};">Kinh Phật</h1>
		<div class="w-12 h-px mx-auto mt-3" style="background: {$currentTheme.primary}30;"></div>
	</header>

	<!-- Zodiac Clock Card -->
	<div class="px-5 mb-5">
		<div class="relative rounded-3xl p-6 border" style="background: linear-gradient(to bottom right, {$currentTheme.bgCard}, {$currentTheme.bgDeep}); border-color: {$currentTheme.primary}10;">
			<!-- Corner ornaments -->
			<svg class="absolute top-3 left-3 w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.5" style="color: {$currentTheme.primary}20;">
				<path d="M3 3 L12 3 M3 3 L3 12" stroke-linecap="round"/>
			</svg>
			<svg class="absolute top-3 right-3 w-6 h-6 rotate-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.5" style="color: {$currentTheme.primary}20;">
				<path d="M3 3 L12 3 M3 3 L3 12" stroke-linecap="round"/>
			</svg>

			<div class="text-center">
				<div class="font-serif text-5xl tracking-[0.2em] tabular-nums" style="color: {$currentTheme.textPrimary};">
					{formatTime(currentTime)}
				</div>
				<div class="text-xs tracking-[0.4em] uppercase mt-1" style="color: {$currentTheme.primary}; opacity: 0.5;">Giờ Việt Nam</div>
			</div>

			<!-- Divider -->
			<div class="flex items-center gap-3 my-5">
				<div class="flex-1 h-px" style="background: linear-gradient(to right, transparent, {$currentTheme.primary}15, transparent);"></div>
				<svg class="w-3 h-3" viewBox="0 0 24 24" fill="currentColor" style="color: {$currentTheme.primary}30;">
					<circle cx="12" cy="12" r="3"/>
				</svg>
				<div class="flex-1 h-px" style="background: linear-gradient(to right, transparent, {$currentTheme.primary}15, transparent);"></div>
			</div>

			<!-- Solar Date -->
			<div class="text-center mb-4">
				<div class="text-sm tracking-wide" style="color: {$currentTheme.textPrimary}; opacity: 0.8;">{formatSolarDate(currentTime)}</div>
				<div class="flex items-center justify-center gap-2 mt-2">
					<svg class="w-3 h-3" viewBox="0 0 24 24" fill="currentColor" style="color: {$currentTheme.secondary}; opacity: 0.5;">
						<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
					</svg>
					<span class="text-xs tracking-wider" style="color: {$currentTheme.secondary}; opacity: 0.6;">{canChiDay}</span>
				</div>
			</div>

			<!-- Lunar Calendar -->
			<div class="flex items-center justify-center gap-3 py-3 px-4 rounded-2xl border" style="background: {$currentTheme.primary}05; border-color: {$currentTheme.primary}10;">
				<svg class="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor" style="color: {$currentTheme.primary}; opacity: 0.6;">
					<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
				</svg>
				<div class="text-sm tracking-wide leading-relaxed" style="color: {$currentTheme.textPrimary}; opacity: 0.8;">
					{formatLunarDate(lunarDate)}
				</div>
			</div>
		</div>
	</div>

	<!-- Day Quality Card -->
	<div class="px-5 mb-5">
		<div class="rounded-3xl p-5 border" style="background: linear-gradient(to bottom right, {$currentTheme.bgCard}, {$currentTheme.bgDeep}); border-color: {$currentTheme.primary}10;">
			<div class="flex items-center gap-3 mb-3">
				<div class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style="background: {dayQuality.color}15; border: 1px solid {dayQuality.color}25;">
					{#if dayQuality.icon === 'star'}
						<svg class="w-5 h-5" style="color: {dayQuality.color}" viewBox="0 0 24 24" fill="currentColor">
							<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
						</svg>
					{:else if dayQuality.icon === 'sun'}
						<svg class="w-5 h-5" style="color: {dayQuality.color}" viewBox="0 0 24 24" fill="currentColor">
							<circle cx="12" cy="12" r="5"/>
							<path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
						</svg>
					{:else if dayQuality.icon === 'cloud'}
						<svg class="w-5 h-5" style="color: {dayQuality.color}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
							<path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
						</svg>
					{:else if dayQuality.icon === 'warning'}
						<svg class="w-5 h-5" style="color: {dayQuality.color}" viewBox="0 0 24 24" fill="currentColor">
							<path d="M12 2L1 21h22L12 2zm0 3.99L19.53 19H4.47L12 5.99zM11 10v4h2v-4h-2zm0 6v2h2v-2h-2z"/>
						</svg>
					{:else}
						<svg class="w-5 h-5" style="color: {dayQuality.color}" viewBox="0 0 24 24" fill="currentColor">
							<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
						</svg>
					{/if}
				</div>
				<div>
					<div class="text-sm font-medium tracking-wide" style="color: {dayQuality.color}">
						{dayQuality.quality}
					</div>
					<div class="text-xs" style="color: {$currentTheme.textPrimary}; opacity: 0.3;">Chiêm tinh ngày hôm nay</div>
				</div>
			</div>
			<p class="text-xs leading-relaxed pl-[46px]" style="color: {$currentTheme.textPrimary}; opacity: 0.4;">{dayQuality.description}</p>
		</div>
	</div>

	<!-- Good Hours -->
	<div class="px-5 mb-5">
		<div class="rounded-3xl p-5 border" style="background: linear-gradient(to bottom right, {$currentTheme.bgCard}, {$currentTheme.bgDeep}); border-color: {$currentTheme.primary}10;">
			<div class="flex items-center gap-3 mb-4">
				<svg class="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="#4CAF50" style="opacity: 0.7;">
					<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
				</svg>
				<div class="text-xs font-medium tracking-wider uppercase" style="color: #4CAF50; opacity: 0.8;">Giờ Hoàng Đạo</div>
			</div>
			<div class="flex flex-wrap gap-2">
				{#each goodHours() as hour}
					<div class="px-3 py-1.5 rounded-full border" style="background: rgba(76, 175, 80, 0.08); border-color: rgba(76, 175, 80, 0.2);">
						<span class="text-xs font-medium" style="color: #4CAF50; opacity: 0.9;">{hour.split(' ')[0]}</span>
					</div>
				{/each}
			</div>
			<p class="text-[10px] mt-3 tracking-wide" style="color: {$currentTheme.textPrimary}; opacity: 0.25;">Thời gian tốt lành cho việc quan trọng</p>
		</div>
	</div>

	<!-- Bad Hours -->
	<div class="px-5 mb-5">
		<div class="rounded-3xl p-5 border" style="background: linear-gradient(to bottom right, {$currentTheme.bgCard}, {$currentTheme.bgDeep}); border-color: {$currentTheme.primary}10;">
			<div class="flex items-center gap-3 mb-4">
				<svg class="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="#E53935" style="opacity: 0.6;">
					<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
				</svg>
				<div class="text-xs font-medium tracking-wider uppercase" style="color: #E53935; opacity: 0.6;">Giờ Hắc Đạo</div>
			</div>
			<div class="flex flex-wrap gap-2">
				{#each VIETNAMESE_HOURS.filter(h => !goodHours().some(g => g.split(' ')[0] === h.split(' ')[0])).slice(0, 6) as hour}
					<div class="px-3 py-1.5 rounded-full border" style="background: rgba(229, 57, 53, 0.08); border-color: rgba(229, 57, 53, 0.2);">
						<span class="text-xs" style="color: #E53935; opacity: 0.6;">{hour.split(' ')[0]}</span>
					</div>
				{/each}
			</div>
			<p class="text-[10px] mt-3 tracking-wide" style="color: {$currentTheme.textPrimary}; opacity: 0.25;">Nên tránh giờ này cho việc lớn</p>
		</div>
	</div>

	<!-- Current Hour -->
	<div class="px-5 mb-5">
		<div class="relative rounded-3xl p-5 border" style="background: linear-gradient(to bottom right, {$currentTheme.primary}08, {$currentTheme.primary}03); border-color: {$currentTheme.primary}15;">
			<div class="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full border" style="background: {$currentTheme.bgDeep}; border-color: {$currentTheme.primary}20;">
				<span class="text-[9px] tracking-[0.3em] uppercase" style="color: {$currentTheme.primary}; opacity: 0.5;">Hiện Tại</span>
			</div>
			<div class="text-center pt-2">
				<div class="text-lg font-light tracking-wide" style="color: {$currentTheme.textPrimary}; opacity: 0.9;">{currentHourName}</div>
				{#if HOANG_DAO_HOURS.includes(currentHourName.split(' ')[0])}
					<div class="flex items-center justify-center gap-2 mt-2">
						<svg class="w-4 h-4" viewBox="0 0 24 24" fill="#4CAF50" style="opacity: 0.5;">
							<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
						</svg>
						<span class="text-xs" style="color: #4CAF50; opacity: 0.5;">Đang trong giờ hoàng đạo</span>
					</div>
				{:else}
					<div class="flex items-center justify-center gap-2 mt-2">
						<svg class="w-4 h-4" viewBox="0 0 24 24" fill="#E53935" style="opacity: 0.3;">
							<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
						</svg>
						<span class="text-xs" style="color: #E53935; opacity: 0.3;">Đang trong giờ hắc đạo</span>
					</div>
				{/if}
			</div>
		</div>
	</div>

	<!-- Year Info -->
	<div class="px-5 mb-5">
		<div class="grid grid-cols-2 gap-3">
			<div class="rounded-2xl p-4 border" style="background: linear-gradient(to bottom right, {$currentTheme.bgCard}, {$currentTheme.bgDeep}); border-color: {$currentTheme.primary}10;">
				<div class="flex items-center gap-2 mb-2">
					<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="color: {$currentTheme.primary}; opacity: 0.4;">
						<circle cx="12" cy="12" r="10"/>
						<path d="M12 6v6l4 2"/>
					</svg>
					<span class="text-[9px] uppercase tracking-widest" style="color: {$currentTheme.primary}; opacity: 0.4;">Năm {currentTime.getFullYear()}</span>
				</div>
				<div class="text-sm font-light tracking-wide" style="color: {$currentTheme.textPrimary}; opacity: 0.7;">{canChiYear}</div>
			</div>
			<div class="rounded-2xl p-4 border" style="background: linear-gradient(to bottom right, {$currentTheme.bgCard}, {$currentTheme.bgDeep}); border-color: {$currentTheme.primary}10;">
				<div class="flex items-center gap-2 mb-2">
					<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="color: {$currentTheme.secondary}; opacity: 0.4;">
						<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
					</svg>
					<span class="text-[9px] uppercase tracking-widest" style="color: {$currentTheme.secondary}; opacity: 0.4;">Tuổi năm</span>
				</div>
				<div class="text-sm font-light tracking-wide" style="color: {$currentTheme.textPrimary}; opacity: 0.7;">{ZODIAC_ANIMALS[(currentTime.getFullYear() - 4) % 12]}</div>
			</div>
		</div>
	</div>

	<!-- Daily Quote -->
	<div class="px-5 mb-5">
		<div class="relative rounded-3xl p-6 border" style="background: linear-gradient(to bottom right, {$currentTheme.bgCard}, {$currentTheme.bgDeep}); border-color: {$currentTheme.primary}10;">
			<svg class="absolute top-4 left-5 w-7 h-7" viewBox="0 0 24 24" fill="currentColor" style="color: {$currentTheme.primary}; opacity: 0.08;">
				<path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"/>
			</svg>

			<div class="pt-5 pl-4">
				<p class="text-sm leading-relaxed italic font-light" style="color: {$currentTheme.textPrimary}; opacity: 0.6;">
					"{quote.text}"
				</p>
				<div class="flex items-center gap-3 mt-5">
					<div class="w-8 h-px" style="background: linear-gradient(to right, {$currentTheme.primary}30, transparent);"></div>
					<span class="text-[10px] tracking-[0.25em] uppercase" style="color: {$currentTheme.primary}; opacity: 0.5;">{quote.source}</span>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.font-serif { font-family: 'Playfair Display', Georgia, serif; }
</style>
