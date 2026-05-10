// Theme store for level-based theming
import { writable, derived, get } from 'svelte/store';
import { LEVEL_THEMES, type LevelTheme } from '$lib/components/levels';

// Store for current level
export const currentLevel = writable<number>(1);

// Store for previous level (to detect level-up)
export const previousLevel = writable<number>(1);

// Store for showing level-up notification
export const showLevelUpNotification = writable<boolean>(false);

// Store for level-up animation
export const levelUpAnimationData = writable<{
	fromLevel: number;
	toLevel: number;
	show: boolean;
}>({
	fromLevel: 1,
	toLevel: 1,
	show: false
});

// Derived store for current theme
export const currentTheme = derived(currentLevel, ($currentLevel) => {
	return LEVEL_THEMES[$currentLevel] || LEVEL_THEMES[1];
});

// Function to set level and trigger level-up if needed
export function setLevel(level: number, meritPoints: number = 0, skipNotification = false) {
	const prevLevel = get(currentLevel);
	previousLevel.set(prevLevel);
	currentLevel.set(level);

	// Detect level-up - only trigger notification if not skipped and level increased
	if (!skipNotification && level > prevLevel) {
		triggerLevelUpNotification(prevLevel, level);
	}
}

// Trigger level-up notification with animation
function triggerLevelUpNotification(fromLevel: number, toLevel: number) {
	levelUpAnimationData.set({
		fromLevel,
		toLevel,
		show: true
	});

	showLevelUpNotification.set(true);

	// Auto-hide after animation completes (6 seconds)
	setTimeout(() => {
		showLevelUpNotification.set(false);
	}, 6000);
}

// Dismiss notification manually
export function dismissLevelUpNotification() {
	showLevelUpNotification.set(false);
}

// Apply theme to CSS variables
export function applyThemeToCSS(theme: LevelTheme) {
	if (typeof document === 'undefined') return;

	const root = document.documentElement;

	// Apply theme colors to CSS custom properties
	root.style.setProperty('--color-primary', theme.primary);
	root.style.setProperty('--color-primary-light', theme.primaryLight);
	root.style.setProperty('--color-primary-dark', theme.primaryDark);
	root.style.setProperty('--color-secondary', theme.secondary);
	root.style.setProperty('--color-accent', theme.accent);

	root.style.setProperty('--color-bg-primary', theme.bgDeep);
	root.style.setProperty('--color-bg-secondary', theme.bgSurface);
	root.style.setProperty('--color-bg-card', theme.bgCard);
	root.style.setProperty('--color-bg-elevated', theme.bgElevated);
	root.style.setProperty('--color-bg-surface', theme.bgSurface);

	root.style.setProperty('--color-text-primary', theme.textPrimary);
	root.style.setProperty('--color-text-secondary', theme.textSecondary);
	root.style.setProperty('--color-text-muted', theme.textMuted);

	root.style.setProperty('--color-glow', theme.glow);
	root.style.setProperty('--glow-intensity', theme.glowIntensity.toString());

	// Update background color for body
	root.style.setProperty('background-color', theme.bgDeep);

	// Update selection color
	root.style.setProperty('--selection-bg', `${theme.primary}33`);

	// Update border colors
	root.style.setProperty('--border-gold-subtle', `${theme.primary}33`);
	root.style.setProperty('--border-gold-muted', `${theme.primary}59`);
}

// Get theme for a specific level
export function getThemeForLevel(level: number): LevelTheme {
	return LEVEL_THEMES[level] || LEVEL_THEMES[1];
}

// Initialize theme from stored level
export function initializeTheme(level: number) {
	const theme = getThemeForLevel(level);
	applyThemeToCSS(theme);
	currentLevel.set(level);
	previousLevel.set(level);
}
