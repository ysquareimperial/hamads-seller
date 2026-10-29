export const lightColors = {
    primary: '#4F46E5',
    primaryDark: '#4338CA',
    primarySoft: '#EEF0FF',
    primaryGradientEnd: '#7C3AED',
    background: '#F3F4FB',
    surface: '#FFFFFF',
    border: '#E3E5F0',
    borderFocus: '#4F46E5',
    text: '#0F1222',
    textMuted: '#6B7089',
    textOnPrimary: '#FFFFFF',
    danger: '#DC2626',
    dangerSoft: '#FEF2F2',
    warning: '#B45309',
    warningSoft: '#FFF4E0',
    success: '#15803D',
    successSoft: '#ECFDF3',
    star: '#F59E0B',
    overlay: 'rgba(15, 18, 34, 0.45)',
    scrim: 'rgba(255, 255, 255, 0.7)',
    dot: 'rgba(255, 255, 255, 0.7)',
    disabled: '#B8BBD6',
};

export const darkColors = {
    primary: '#6C63FF',
    primaryDark: '#A5A0FF',
    primarySoft: '#25284A',
    primaryGradientEnd: '#9061F9',
    background: '#0E1020',
    surface: '#181B30',
    border: '#2B2F4A',
    borderFocus: '#8B85FF',
    text: '#F2F3FA',
    textMuted: '#9A9FBD',
    textOnPrimary: '#FFFFFF',
    danger: '#F87171',
    dangerSoft: '#3A1D22',
    warning: '#FBBF24',
    warningSoft: '#38290F',
    success: '#4ADE80',
    successSoft: '#12301F',
    star: '#FBBF24',
    overlay: 'rgba(0, 0, 0, 0.65)',
    scrim: 'rgba(14, 16, 32, 0.7)',
    dot: 'rgba(255, 255, 255, 0.4)',
    disabled: '#4A4E6B',
};

/**
 * `colors` is a live object: setColorScheme() swaps its values in place, so
 * every `colors.x` read at render/style-creation time reflects the active scheme.
 * The root layout remounts the tree (key) when the scheme changes.
 */
export const colors = { ...lightColors };

let currentScheme = 'light';

export const getColorScheme = () => currentScheme;

export function setColorScheme(scheme) {
    if (scheme === currentScheme) return;
    currentScheme = scheme;
    Object.assign(colors, scheme === 'dark' ? darkColors : lightColors);
}
