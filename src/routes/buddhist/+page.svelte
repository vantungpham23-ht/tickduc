<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { currentTheme } from '$lib/stores/theme';

	// === VIETNAMESE LUNAR CALENDAR ===
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

		for (let year = gy; year >= gy - 1; year--) {
			const data = LUNAR_DATA[year];
			if (!data) continue;
			const [td, tm, ty] = data.tet;
			const tetJd = jdFromDate(td, tm, ty);
			const nextYearData = LUNAR_DATA[year + 1];
			const nextTetJd = nextYearData ? jdFromDate(nextYearData.tet[0], nextYearData.tet[1], nextYearData.tet[2]) : 9999999;

			if (jd >= tetJd && jd < nextTetJd) {
				let daysSinceTet = jd - tetJd;
				let month = 1;
				let dayCounter = 0;

				while (dayCounter <= daysSinceTet) {
					const daysInMonth = isLeapMonth(year, month) ? 30 : (getMonthLength(year, month));
					if (dayCounter + daysInMonth > daysSinceTet) {
						break;
					}
					dayCounter += daysInMonth;
					month++;
					if (month > 12) break;
				}

				const isLeap = isLeapMonth(year, month);
				return { day: daysSinceTet - dayCounter + 1, month, year, isLeap };
			}
		}

		return { day: 1, month: 1, year: gy, isLeap: false };
	}

	function getMonthLength(year: number, month: number): number {
		const data = LUNAR_DATA[year];
		if (!data) return 30;
		const thirtyDayMonths = getThirtyDayMonths(year);
		return thirtyDayMonths.includes(month) ? 30 : 29;
	}

	function isLeapMonth(year: number, month: number): boolean {
		const data = LUNAR_DATA[year];
		return data?.leapMonths?.includes(month) ?? false;
	}

	function getThirtyDayMonths(year: number): number[] {
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
		let cycleYear = (year - 4) % 60;
		if (cycleYear < 0) cycleYear += 60;
		return `${HEAVENLY_STEMS[cycleYear % 10]} ${ZODIAC_ANIMALS[cycleYear % 12]}`;
	}

	function getCanChiDay(jd: number): string {
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

	const quotes = [
		{ text: "Nếu bạn yêu thương mà không gây ra hận quả, bạn đã hiểu ý nghĩa của sự vắng lặng.", source: "Đức Phật" },
		{ text: "Đừng sống trong quá khứ, đừng mơ về tương lai, trí tuệ là sống trong hiện tại.", source: "Đức Phật" },
		{ text: "Hạnh phúc không phải là điều có sẵn, nó xuất phát từ chính hành động của bạn.", source: "Đức Phật" },
		{ text: "Hãy để tâm bạn như mặt hồ tĩnh lặng, nhìn thẳng vào bản chất của sự vật.", source: "Thiền Tông" },
		{ text: "Tâm an thì cảnh an. Tâm loạn thì cảnh loạn.", source: "Thiền Tông" },
		{ text: "Mỗi ngày là một cơ hội để bắt đầu lại, để trở nên tốt đẹp hơn.", source: "Đức Phật" },
	];

	let quote = $derived(quotes[currentTime.getDate() % quotes.length]);

	function formatSolarDate(date: Date): string {
		const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
		const months = ['Một', 'Hai', 'Ba', 'Tư', 'Năm', 'Sáu', 'Bảy', 'Tám', 'Chín', 'Mười', 'Mười Một', 'Mười Hai'];
		return `${days[date.getDay()]}, ngày ${date.getDate()} tháng ${months[date.getMonth()]} năm ${date.getFullYear()}`;
	}

	function formatLunarDate(lunar: typeof lunarDate): string {
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

<div class="min-h-screen pb-20" style="background-color: var(--color-bg-primary, #F9F8F6);">
	<div class="fixed inset-0 pointer-events-none overflow-hidden">
		<div class="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl" style="background: {$currentTheme.primary}08;"></div>
		<div class="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full blur-3xl" style="background: {$currentTheme.secondary}05;"></div>
	</div>

	<header class="relative px-6 pt-10 pb-6 text-center">
		<h1 class="font-serif text-2xl font-medium" style="color: {$currentTheme.textPrimary};">Kinh Phật</h1>
		<div class="w-12 h-0.5 mx-auto mt-3" style="background: {$currentTheme.primary}30;"></div>
	</header>

	<!-- Zodiac Clock Card -->
	<div class="px-5 mb-5">
		<div class="relative rounded-2xl p-6 shadow-lg" style="background: {$currentTheme.bgCard};">
			<div class="text-center">
				<div class="font-serif text-5xl font-medium tabular-nums" style="color: {$currentTheme.textPrimary};">
					{formatTime(currentTime)}
				</div>
				<div class="text-sm mt-1" style="color: {$currentTheme.primary}; opacity: 0.6;">Giờ Việt Nam</div>
			</div>

			<div class="flex items-center gap-3 my-5">
				<div class="flex-1 h-px" style="background: linear-gradient(to right, transparent, #E8E5E2, transparent);"></div>
				<svg class="w-3 h-3" viewBox="0 0 24 24" fill="currentColor" style="color: {$currentTheme.primary}; opacity: 0.4;">
					<circle cx="12" cy="12" r="3"/>
				</svg>
				<div class="flex-1 h-px" style="background: linear-gradient(to right, transparent, #E8E5E2, transparent);"></div>
			</div>

			<div class="text-center mb-4">
				<div class="text-base" style="color: {$currentTheme.textPrimary};">{formatSolarDate(currentTime)}</div>
				<div class="flex items-center justify-center gap-2 mt-2">
					<svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" style="color: {$currentTheme.secondary}; opacity: 0.5;">
						<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
					</svg>
					<span class="text-sm" style="color: {$currentTheme.secondary};">{canChiDay}</span>
				</div>
			</div>

			<div class="flex items-center justify-center gap-3 py-3 px-4 rounded-xl" style="background: {$currentTheme.primary}08; border: 1px solid {$currentTheme.primary}15;">
				<svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" style="color: {$currentTheme.primary}; opacity: 0.6;">
					<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
				</svg>
				<div class="text-base" style="color: {$currentTheme.textPrimary}; opacity: 0.8;">
					{formatLunarDate(lunarDate)}
				</div>
			</div>
		</div>
	</div>

	<!-- Day Quality Card -->
	<div class="px-5 mb-5">
		<div class="rounded-2xl p-5 shadow-sm" style="background: {$currentTheme.bgCard}; border-color: {$currentTheme['border-default']};">
			<div class="flex items-center gap-3 mb-3">
				<div class="w-10 h-10 rounded-full flex items-center justify-center" style="background: {dayQuality.color}15; border: 1px solid {dayQuality.color}25;">
					<svg class="w-5 h-5" style="color: {dayQuality.color}" viewBox="0 0 24 24" fill="currentColor">
						<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
					</svg>
				</div>
				<div>
					<div class="text-base font-medium" style="color: {dayQuality.color}">{dayQuality.quality}</div>
					<div class="text-sm" style="color: {$currentTheme.textMuted};">Chiêm tinh ngày hôm nay</div>
				</div>
			</div>
			<p class="text-sm leading-relaxed pl-12" style="color: {$currentTheme.textSecondary};">{dayQuality.description}</p>
		</div>
	</div>

	<!-- Good Hours -->
	<div class="px-5 mb-5">
		<div class="rounded-2xl p-5 shadow-sm" style="background: {$currentTheme.bgCard}; border-color: {$currentTheme['border-default']};">
			<div class="flex items-center gap-2 mb-4">
				<svg class="w-4 h-4" viewBox="0 0 24 24" fill="#4CAF50" style="opacity: 0.8;">
					<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
				</svg>
				<div class="text-sm font-medium uppercase" style="color: #4CAF50;">Giờ Hoàng Đạo</div>
			</div>
			<div class="flex flex-wrap gap-2">
				{#each goodHours() as hour}
					<div class="px-3 py-1.5 rounded-full" style="background: rgba(76, 175, 80, 0.1); border: 1px solid rgba(76, 175, 80, 0.2);">
						<span class="text-sm font-medium" style="color: #4CAF50;">{hour.split(' ')[0]}</span>
					</div>
				{/each}
			</div>
		</div>
	</div>

	<!-- Current Hour -->
	<div class="px-5 mb-5">
		<div class="relative rounded-2xl p-5 shadow-sm" style="background: {$currentTheme.bgCard}; border: 1px solid {$currentTheme.primary}15;">
			<div class="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider" style="background: {$currentTheme.bgSecondary}; color: {$currentTheme.primary}; border: 1px solid {$currentTheme.primary}20;">
				Hiện Tại
			</div>
			<div class="text-center pt-2">
				<div class="text-lg font-medium" style="color: {$currentTheme.textPrimary};">{currentHourName}</div>
				{#if HOANG_DAO_HOURS.includes(currentHourName.split(' ')[0])}
					<div class="flex items-center justify-center gap-2 mt-2">
						<svg class="w-4 h-4" viewBox="0 0 24 24" fill="#4CAF50" style="opacity: 0.6;">
							<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
						</svg>
						<span class="text-sm" style="color: #4CAF50; opacity: 0.7;">Đang trong giờ hoàng đạo</span>
					</div>
				{:else}
					<div class="flex items-center justify-center gap-2 mt-2">
						<svg class="w-4 h-4" viewBox="0 0 24 24" fill="#E53935" style="opacity: 0.4;">
							<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
						</svg>
						<span class="text-sm" style="color: #E53935; opacity: 0.4;">Đang trong giờ hắc đạo</span>
					</div>
				{/if}
			</div>
		</div>
	</div>

	<!-- Year Info -->
	<div class="px-5 mb-5">
		<div class="grid grid-cols-2 gap-4">
			<div class="rounded-2xl p-4 shadow-sm" style="background: {$currentTheme.bgCard}; border-color: {$currentTheme['border-default']};">
				<div class="text-sm mb-1" style="color: {$currentTheme.textMuted};">Năm {currentTime.getFullYear()}</div>
				<div class="text-base font-medium" style="color: {$currentTheme.textPrimary};">{canChiYear}</div>
			</div>
			<div class="rounded-2xl p-4 shadow-sm" style="background: {$currentTheme.bgCard}; border-color: {$currentTheme['border-default']};">
				<div class="text-sm mb-1" style="color: {$currentTheme.textMuted};">Tuổi năm</div>
				<div class="text-base font-medium" style="color: {$currentTheme.textPrimary};">{ZODIAC_ANIMALS[(currentTime.getFullYear() - 4) % 12]}</div>
			</div>
		</div>
	</div>

	<!-- Daily Quote -->
	<div class="px-5 mb-5">
		<div class="relative rounded-2xl p-6 shadow-sm" style="background: {$currentTheme.bgCard}; border-color: {$currentTheme['border-default']};">
			<p class="text-base leading-relaxed italic" style="color: {$currentTheme.textSecondary};">"{quote.text}"</p>
			<div class="flex items-center gap-3 mt-4">
				<div class="w-8 h-px" style="background: linear-gradient(to right, {$currentTheme.primary}30, transparent);"></div>
				<span class="text-sm uppercase tracking-wider" style="color: {$currentTheme.primary}; opacity: 0.6;">{quote.source}</span>
			</div>
		</div>
	</div>
</div>
