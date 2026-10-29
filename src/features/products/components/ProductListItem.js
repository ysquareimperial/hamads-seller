import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Pressable, Text, View } from 'react-native';

import { StatusBadge } from '@/components/ui/StatusBadge';
import { colors } from '@/theme';
import { formatNaira } from '@/utils/format';

import { productStatus } from '../utils/productStatus';
import { styles } from './ProductListItem.styles';

export function ProductListItem({ product, onPress }) {
    const status = productStatus(product);
    const thumb = product.image_urls?.[0];
    const outOfStock = product.stock_quantity <= 0;
    const reviews = Number(product.review_count) || 0;
    return (<Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <View style={styles.thumb}>
        {thumb ? (<Image source={{ uri: thumb }} style={styles.image} contentFit="cover" transition={150}/>) : (<Ionicons name="image-outline" size={26} color={colors.disabled}/>)}
      </View>
      <View style={styles.body}>
        <Text style={styles.name} numberOfLines={2}>{product.name}</Text>
        <View style={styles.priceRow}>
          <Text style={styles.price}>{formatNaira(product.price)}</Text>
          {product.compare_at_price ? (<Text style={styles.compare}>{formatNaira(product.compare_at_price)}</Text>) : null}
        </View>
        <View style={styles.metaRow}>
          <StatusBadge text={status.label} tone={status.tone}/>
          <Text style={[styles.meta, outOfStock && styles.metaDanger]}>
            {outOfStock ? 'Out of stock' : `${product.stock_quantity} in stock`}
          </Text>
          {product.has_variants ? (<Text style={styles.meta}>{product.option_names?.length ? product.option_names.join(' · ') : 'Has options'}</Text>) : null}
          {reviews > 0 ? (<Text style={styles.meta}>{`★ ${Number(product.average_rating).toFixed(1)} (${reviews})`}</Text>) : null}
        </View>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.disabled}/>
    </Pressable>);
}
