import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Alert, RefreshControl, SectionList, Text, View } from 'react-native';

import { ChipRow } from '@/components/ui/ChipRow';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { IconButton } from '@/components/ui/IconButton';
import { LoadingView } from '@/components/ui/LoadingView';
import { SafeScreen } from '@/components/ui/SafeScreen';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { useAsyncData } from '@/hooks/useAsyncData';
import { useRefreshStore } from '@/store/refreshStore';
import { colors } from '@/theme';
import { getErrorMessage } from '@/utils/getErrorMessage';

import { MenuItemRow } from '../components/MenuItemRow';
import { foodItemCache } from '../foodCache';
import { useFoodCategories } from '../hooks/useFoodCategories';
import { foodVendorService } from '../services/foodVendorService';
import { styles } from './MenuScreen.styles';

const addItem = () => router.push('/food/menu/new');

export function MenuScreen() {
    const version = useRefreshStore((s) => s.foodItems);
    const { labelOf } = useFoodCategories();
    const [category, setCategory] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [toggling, setToggling] = useState(null);
    const { data: items, loading, error, reload, setData } = useAsyncData(async () => {
        const list = await foodVendorService.listItems();
        foodItemCache.put(list);
        return list;
    }, [version]);

    const filters = useMemo(() => {
        const keys = [...new Set((items ?? []).map((i) => i.category))];
        return [{ value: null, label: 'All' }, ...keys.map((k) => ({ value: k, label: labelOf(k) }))];
    }, [items, labelOf]);

    const sections = useMemo(() => {
        const groups = new Map();
        (items ?? []).filter((i) => !category || i.category === category).forEach((i) => {
            if (!groups.has(i.category)) groups.set(i.category, []);
            groups.get(i.category).push(i);
        });
        return [...groups.entries()].map(([key, data]) => ({ key, title: labelOf(key), data }));
    }, [items, category, labelOf]);

    const toggle = async (item, next) => {
        setToggling(item.id);
        setData((list) => list.map((i) => (i.id === item.id ? { ...i, is_available: next } : i)));
        try {
            const updated = await foodVendorService.setAvailability(item.id, next);
            foodItemCache.put([updated]);
            setData((list) => list.map((i) => (i.id === item.id ? updated : i)));
        }
        catch (e) {
            setData((list) => list.map((i) => (i.id === item.id ? { ...i, is_available: !next } : i)));
            Alert.alert("Couldn't update item", getErrorMessage(e));
        }
        finally {
            setToggling(null);
        }
    };

    const refresh = async () => {
        setRefreshing(true);
        await reload({ silent: true });
        setRefreshing(false);
    };

    const available = (items ?? []).filter((i) => i.is_available).length;

    let body;
    if (loading && !items) body = <LoadingView />;
    else if (error && !items) body = <ErrorState message={error} onRetry={() => reload()}/>;
    else {
        body = (<SectionList sections={sections} keyExtractor={(item) => item.id} contentContainerStyle={styles.list} stickySectionHeadersEnabled={false} renderSectionHeader={({ section }) => (<Text style={styles.sectionTitle}>{`${section.title} · ${section.data.length}`}</Text>)} renderItem={({ item }) => (<MenuItemRow item={item} categoryLabel={labelOf(item.category)} toggling={toggling === item.id} onToggle={(next) => toggle(item, next)} onPress={() => router.push(`/food/menu/${item.id}`)}/>)} ItemSeparatorComponent={() => <View style={styles.separator}/>} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={colors.primary} colors={[colors.primary]}/>} ListEmptyComponent={<EmptyState icon="fast-food-outline" title="Your menu is empty" message="Add meals, drinks and anything else customers can order." actionLabel="Add menu item" onAction={addItem}/>}/>);
    }

    return (<SafeScreen>
      <ScreenHeader title="Menu" subtitle={items?.length ? `${available} of ${items.length} available now` : undefined} showBack={false} right={<IconButton icon="add" tone="primary" accessibilityLabel="Add menu item" onPress={addItem}/>}/>
      {filters.length > 2 ? <ChipRow options={filters} value={category} onChange={setCategory}/> : null}
      {body}
    </SafeScreen>);
}
