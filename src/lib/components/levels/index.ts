// Level utility functions and constants

export interface LevelInfo {
	level: number;
	name: string;
	minPoints: number;
	maxPoints: number | null;
	description: string;
}

// Theme colors for each level - LIGHT LUXURY PALETTE
export interface LevelTheme {
	primary: string;
	primaryLight: string;
	primaryDark: string;
	secondary: string;
	accent: string;
	bgVoid: string;
	bgNight: string;
	bgDeep: string;
	bgSurface: string;
	bgCard: string;
	bgElevated: string;
	textPrimary: string;
	textSecondary: string;
	textMuted: string;
	glow: string;
	glowIntensity: number; // 0-1, affects animation intensity
}

export const LEVEL_THEMES: Record<number, LevelTheme> = {
	1: {
		// Level 1: Hạt Giống Bồ Đề - Warm Earth, natural, beginning
		primary: '#A07850',       // Warm brown
		primaryLight: '#C4A078',
		primaryDark: '#8B6840',
		secondary: '#93B1A7',     // Sage green
		accent: '#C4A89C',        // Soft rose
		bgVoid: '#FAF7F2',
		bgNight: '#F5F0E8',
		bgDeep: '#EDE6DA',
		bgSurface: '#E5DDD0',
		bgCard: '#FFFFFF',
		bgElevated: '#FFFFFF',
		textPrimary: '#2E2520',
		textSecondary: '#6B5D4D',
		textMuted: '#9A8E80',
		glow: 'rgba(160, 120, 80, 0.2)',
		glowIntensity: 0.3
	},
	2: {
		// Level 2: Mầm Sen Non - Fresh Sage, growing, hopeful
		primary: '#7A9E7E',       // Fresh sage green
		primaryLight: '#A8C0A8',
		primaryDark: '#5E8062',
		secondary: '#93B1A7',     // Sage
		accent: '#C4D4C8',        // Light sage
		bgVoid: '#F7FAF8',
		bgNight: '#F0F5F2',
		bgDeep: '#E8F0EC',
		bgSurface: '#DCE8E2',
		bgCard: '#FFFFFF',
		bgElevated: '#FFFFFF',
		textPrimary: '#2E3530',
		textSecondary: '#5A6B60',
		textMuted: '#8A9E90',
		glow: 'rgba(122, 158, 126, 0.2)',
		glowIntensity: 0.45
	},
	3: {
		// Level 3: Hoa Sen Chớm Nở - Soft Rose, blooming, elegant
		primary: '#C4A89C',       // Lotus rose
		primaryLight: '#D9C4BC',
		primaryDark: '#A89080',
		secondary: '#E8D4C8',     // Soft cream
		accent: '#F5E6DC',        // Light pink
		bgVoid: '#FAF7F5',
		bgNight: '#F5F0EC',
		bgDeep: '#EDE8E2',
		bgSurface: '#E5DDD6',
		bgCard: '#FFFFFF',
		bgElevated: '#FFFFFF',
		textPrimary: '#2E2522',
		textSecondary: '#6B5D52',
		textMuted: '#9A8E85',
		glow: 'rgba(196, 168, 156, 0.25)',
		glowIntensity: 0.6
	},
	4: {
		// Level 4: Hoa Sen Vàng Kim - Golden Honey, radiant, luxurious
		primary: '#C5A059',       // Golden honey
		primaryLight: '#E8D4A8',
		primaryDark: '#B8944A',
		secondary: '#D4B896',    // Champagne
		accent: '#F5E6C4',        // Pale gold
		bgVoid: '#FAF8F2',
		bgNight: '#F5F2E8',
		bgDeep: '#F0EBD8',
		bgSurface: '#E8E0CC',
		bgCard: '#FFFFFF',
		bgElevated: '#FFFFFF',
		textPrimary: '#2E2820',
		textSecondary: '#6B5D40',
		textMuted: '#9A8E70',
		glow: 'rgba(197, 160, 89, 0.25)',
		glowIntensity: 0.8
	},
	5: {
		// Level 5: Tòa Sen Tỏa Sáng - Divine Gold, transcendent, enlightened
		primary: '#B8944A',       // Divine warm gold
		primaryLight: '#E8D4A8',
		primaryDark: '#9A7830',
		secondary: '#D4B896',     // Champagne
		accent: '#F5E6C4',        // Pale gold
		bgVoid: '#FDFBF5',
		bgNight: '#FAF6EC',
		bgDeep: '#F8F2E0',
		bgSurface: '#F0E8D0',
		bgCard: '#FFFFFF',
		bgElevated: '#FFFFFF',
		textPrimary: '#28220A',
		textSecondary: '#5A5020',
		textMuted: '#8A8060',
		glow: 'rgba(184, 148, 74, 0.3)',
		glowIntensity: 1.0
	}
};

export const LEVELS: LevelInfo[] = [
	{
		level: 1,
		name: 'Hạt Giống Bồ Đề',
		minPoints: 0,
		maxPoints: 107,
		description: 'Khởi đầu của hành trình tu tập'
	},
	{
		level: 2,
		name: 'Mầm Sen Non',
		minPoints: 108,
		maxPoints: 1079,
		description: 'Tâm hồn bắt đầu nảy mầm'
	},
	{
		level: 3,
		name: 'Hoa Sen Chớm Nở',
		minPoints: 1080,
		maxPoints: 4999,
		description: 'Đạo đức tỏa sáng dần'
	},
	{
		level: 4,
		name: 'Hoa Sen Vàng Kim',
		minPoints: 5000,
		maxPoints: 10799,
		description: 'Công đức viên mãn'
	},
	{
		level: 5,
		name: 'Tòa Sen Tỏa Sáng',
		minPoints: 10800,
		maxPoints: null,
		description: 'Giác ngộ viên mãn'
	}
];

export function getLevelInfo(meritPoints: number): LevelInfo {
	for (let i = LEVELS.length - 1; i >= 0; i--) {
		if (meritPoints >= LEVELS[i].minPoints) {
			return LEVELS[i];
		}
	}
	return LEVELS[0];
}

export function getNextLevelInfo(currentLevel: LevelInfo): LevelInfo | null {
	if (currentLevel.level >= 5) return null;
	return LEVELS[currentLevel.level];
}

export function getProgress(meritPoints: number, currentLevel: LevelInfo): {
	percentage: number;
	pointsToNext: number;
	nextLevelName: string;
} {
	if (currentLevel.level >= 5) {
		return {
			percentage: 100,
			pointsToNext: 0,
			nextLevelName: ''
		};
	}

	const range = currentLevel.maxPoints! - currentLevel.minPoints + 1;
	const progress = meritPoints - currentLevel.minPoints;
	const percentage = Math.min((progress / range) * 100, 100);
	const pointsToNext = Math.max(0, currentLevel.maxPoints! + 1 - meritPoints);
	const nextLevel = LEVELS[currentLevel.level];

	return {
		percentage,
		pointsToNext,
		nextLevelName: nextLevel.name
	};
}
