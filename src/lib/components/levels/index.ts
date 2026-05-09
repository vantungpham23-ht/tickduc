// Level utility functions and constants

export interface LevelInfo {
	level: number;
	name: string;
	minPoints: number;
	maxPoints: number | null;
	description: string;
}

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
