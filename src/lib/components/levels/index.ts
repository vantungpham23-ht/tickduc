// Level utility functions and constants

export interface LevelInfo {
	level: number;
	name: string;
	minPoints: number;
	maxPoints: number | null;
	description: string;
}

// Theme colors for each level - MODERN LIGHT PALETTE
export interface LevelTheme {
	primary: string;
	primaryLight: string;
	primaryDark: string;
	secondary: string;
	accent: string;
	bgPrimary: string;
	bgSecondary: string;
	bgCard: string;
	bgSurface: string;
	textPrimary: string;
	textSecondary: string;
	textMuted: string;
	glow: string;
	glowIntensity: number;
}

export const LEVEL_THEMES: Record<number, LevelTheme> = {
	1: {
		// Level 1: Hạt Giống Bồ Đề - Warm Earth
		primary: '#8B7355',
		primaryLight: '#A89078',
		primaryDark: '#6B5744',
		secondary: '#93B1A7',
		accent: '#8B7355',
		bgPrimary: '#F9F8F6',
		bgSecondary: '#F5F4F2',
		bgCard: '#FFFFFF',
		bgSurface: '#F0EFEC',
		textPrimary: '#1A1918',
		textSecondary: '#4A4543',
		textMuted: '#7A7573',
		glow: 'rgba(139, 115, 85, 0.15)',
		glowIntensity: 0.3
	},
	2: {
		// Level 2: Mầm Sen Non - Fresh Sage
		primary: '#6B8E6B',
		primaryLight: '#8FBC8F',
		primaryDark: '#4A6B4A',
		secondary: '#93B1A7',
		accent: '#6B8E6B',
		bgPrimary: '#F9FAF9',
		bgSecondary: '#F5F7F5',
		bgCard: '#FFFFFF',
		bgSurface: '#EEF2EF',
		textPrimary: '#1A1918',
		textSecondary: '#3A4543',
		textMuted: '#6A7573',
		glow: 'rgba(107, 142, 107, 0.15)',
		glowIntensity: 0.45
	},
	3: {
		// Level 3: Hoa Sen Chớm Nở - Soft Rose
		primary: '#BC8F8F',
		primaryLight: '#D4A8A8',
		primaryDark: '#A07070',
		secondary: '#E8D4C8',
		accent: '#BC8F8F',
		bgPrimary: '#FAF8F7',
		bgSecondary: '#F7F4F3',
		bgCard: '#FFFFFF',
		bgSurface: '#F2EFEE',
		textPrimary: '#1A1918',
		textSecondary: '#4A4543',
		textMuted: '#7A7573',
		glow: 'rgba(188, 143, 143, 0.2)',
		glowIntensity: 0.6
	},
	4: {
		// Level 4: Hoa Sen Vàng Kim - Golden Honey
		primary: '#B8860B',
		primaryLight: '#DAA520',
		primaryDark: '#8B6508',
		secondary: '#F5E6C4',
		accent: '#B8860B',
		bgPrimary: '#FDFBF5',
		bgSecondary: '#FAF6E8',
		bgCard: '#FFFFFF',
		bgSurface: '#F5EFDC',
		textPrimary: '#1A1918',
		textSecondary: '#4A4520',
		textMuted: '#7A7560',
		glow: 'rgba(184, 134, 11, 0.15)',
		glowIntensity: 0.8
	},
	5: {
		// Level 5: Tòa Sen Tỏa Sáng - Divine Gold
		primary: '#8B7500',
		primaryLight: '#B8860B',
		primaryDark: '#6B5500',
		secondary: '#F5E6A0',
		accent: '#8B7500',
		bgPrimary: '#FDFAF0',
		bgSecondary: '#FAF5E0',
		bgCard: '#FFFFFF',
		bgSurface: '#F5EDD0',
		textPrimary: '#1A1508',
		textSecondary: '#4A4500',
		textMuted: '#7A7540',
		glow: 'rgba(184, 134, 11, 0.2)',
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
