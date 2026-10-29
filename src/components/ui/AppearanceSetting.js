import { useTheme } from '@/theme/ThemeProvider';

import { SegmentedControl } from './SegmentedControl';

const OPTIONS = [
    { value: 'system', label: 'System' },
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
];

export function AppearanceSetting() {
    const { preference, setPreference } = useTheme();
    return <SegmentedControl label="Appearance" options={OPTIONS} value={preference} onChange={setPreference}/>;
}
