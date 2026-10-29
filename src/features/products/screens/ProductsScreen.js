import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, View } from 'react-native';

import { ChipRow } from '@/components/ui/ChipRow';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { IconButton } from '@/components/ui/IconButton';
import { LoadingView } from '@/components/ui/LoadingView';
import { SafeScreen } from '@/components/ui/SafeScreen';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { usePagedList } from '@/hooks/usePagedList';
import { useRefreshStore } from '@/store/refreshStore';
import { colors } from '@/theme';

import { ProductListItem } from '../components/ProductListItem';
import { productCache } from '../productCache';
import { productService } from '../services/productService';
import { PRODUCT_FILTERS } from '../utils/productStatus';
import { styles } from './ProductsScreen.styles';

const EMPTY_COPY = {
    all: { title: 'No products yet', message: 'Add your first product to start selling.' },
    live: { title: 'Nothing live yet', message: 'Approved, visible products show here.' },
    review: { title: 'Nothing in review', message: 'New products wait here until Hamads approves them.' },
    hidden: { title: 'No hidden products', message: 'Products you switch off show here.' },
};

const addProduct = () => router.push('/store/products/new');

export function ProductsScreen() {
    const [filter, setFilter] = useState('all');
    const version = useRefreshStore((s) => s.products);
    const params = PRODUCT_FILTERS.find((f) => f.value === filter).params;

    const list = usePagedList(async (page) => {
        const result = await productService.listMine({ ...params, ...page });
        productCache.put(result.items);
        return result;
    }, [filter, version]);

    let body;
    if (list.status === 'loading') body = <LoadingView />;
    else if (list.status === 'error') body = <ErrorState message={list.error} onRetry={list.reload}/>;
    else {
        body = (<FlatList data={list.items} keyExtractor={(item) => item.id} contentContainerStyle={styles.list} renderItem={({ item }) => (<ProductListItem product={item} onPress={() => router.push(`/store/products/${item.id}`)}/>)} ItemSeparatorComponent={() => <View style={styles.separator}/>} onEndReached={list.loadMore} onEndReachedThreshold={0.4} refreshControl={<RefreshControl refreshing={list.refreshing} onRefresh={list.refresh} tintColor={colors.primary} colors={[colors.primary]}/>} ListFooterComponent={list.loadingMore ? <ActivityIndicator style={styles.footer} color={colors.primary}/> : null} ListEmptyComponent={<EmptyState icon="pricetags-outline" title={EMPTY_COPY[filter].title} message={EMPTY_COPY[filter].message} actionLabel={filter === 'all' ? 'Add product' : undefined} onAction={filter === 'all' ? addProduct : undefined}/>}/>);
    }

    return (<SafeScreen>
      <ScreenHeader title="Products" showBack={false} right={<IconButton icon="add" tone="primary" accessibilityLabel="Add product" onPress={addProduct}/>}/>
      <ChipRow options={PRODUCT_FILTERS} value={filter} onChange={setFilter}/>
      {body}
    </SafeScreen>);
}
