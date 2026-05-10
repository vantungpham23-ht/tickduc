// Level utility functions and constants

export interface LevelInfo {
	level: number;
	name: string;
	minPoints: number;
	maxPoints: number | null;
	description: string;
}

// Theme colors for each level
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
		// Level 1: Hạt Giống Bồ Đề - Earthy, natural, beginning
		primary: '#8B7355',       // Earthy brown
		primaryLight: '#A89078',
		primaryDark: '#6B5744',
		secondary: '#93B1A7',     // Sage green
		accent: '#C4A89C',        // Soft rose
		bgVoid: '#0D0B09',
		bgNight: '#141210',
		bgDeep: '#1A1714',
		bgSurface: '#242018',
		bgCard: '#2A2520',
		bgElevated: '#33302A',
		textPrimary: '#F5F0E8',
		textSecondary: '#D9D2C4',
		textMuted: '#8A8070',
		glow: 'rgba(139, 115, 85, 0.3)',
		glowIntensity: 0.3
	},
	2: {
		// Level 2: Mầm Sen Non - Fresh, growing, hopeful
		primary: '#7A9E7E',       // Fresh green
		primaryLight: '#98B89C',
		primaryDark: '#5E8062',
		secondary: '#93B1A7',     // Sage
		accent: '#A8C0B8',         // Light sage
		bgVoid: '#090D09',
		bgNight: '#0F140E',
		bgDeep: '#161E15',
		bgSurface: '#1E2A1C',
		bgCard: '#253326',
		bgElevated: '#2D3E2F',
		textPrimary: '#F5F0E8',
		textSecondary: '#D9D2C4',
		textMuted: '#8A8070',
		glow: 'rgba(122, 158, 126, 0.35)',
		glowIntensity: 0.45
	},
	3: {
		// Level 3: Hoa Sen Chớm Nở - Pink lotus, blooming
		primary: '#C4A89C',       // Lotus pink
		primaryLight: '#D9C4BC',
		primaryDark: '#A89080',
		secondary: '#E8D4C8',     // Soft cream
		accent: '#F5E6DC',         // Light pink
		bgVoid: '#0D0A09',
		bgNight: '#141210',
		bgDeep: '#1A1614',
		bgSurface: '#241E1A',
		bgCard: '#2C2520',
		bgElevated: '#352D28',
		textPrimary: '#F5F0E8',
		textSecondary: '#D9D2C4',
		textMuted: '#8A8070',
		glow: 'rgba(196, 168, 156, 0.4)',
		glowIntensity: 0.6
	},
	4: {
		// Level 4: Hoa Sen Vàng Kim - Golden lotus, radiant
		primary: '#C5A059',       // Gold
		primaryLight: '#D4B896',
		primaryDark: '#B8944A',
		secondary: '#E8D4A8',     // Light gold
		accent: '#F5E6C4',         // Pale gold
		bgVoid: '#0A0908',
		bgNight: '#12110E',
		bgDeep: '#1A1814',
		bgSurface: '#242018',
		bgCard: '#2A2520',
		bgElevated: '#33302A',
		textPrimary: '#F5F0E8',
		textSecondary: '#D9D2C4',
		textMuted: '#8A8070',
		glow: 'rgba(197, 160, 89, 0.45)',
		glowIntensity: 0.8
	},
	5: {
		// Level 5: Tòa Sen Tỏa Sáng - Divine, transcendent, enlightened
		primary: '#D4AF37',       // Divine gold
		primaryLight: '#E8C962',
		primaryDark: '#C5A030',
		secondary: '#F0E68C',     // Khaki gold
		accent: '#FFD700',         // Pure gold
		bgVoid: '#080604',
		bgNight: '#0E0C08',
		bgDeep: '#151208',
		bgSurface: '#1E1A10',
		bgCard: '#262018',
		bgElevated: '#302A18',
		textPrimary: '#FFF8E7',
		textSecondary: '#F5F0E8',
		textMuted: '#A09080',
		glow: 'rgba(255, 215, 0, 0.5)',
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
