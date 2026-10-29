import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

import { StatusBadge } from '@/components/ui/StatusBadge';
import { colors } from '@/theme';

import { styles } from './BusinessCard.styles';

/**
 * One business on the hub. Inactive (not set up) cards are faded but still tappable,
 * and lead to setup instead of the business.
 */
export function BusinessCard({ config, active, loading = false, title, badges = [], highlight, onPress }) {
    return (<Pressable accessibilityRole="button" accessibilityLabel={active ? `Open ${config.name}` : `Set up ${config.name}`} onPress={onPress} disabled={loading} style={({ pressed }) => [styles.card, !active && !loading && styles.inactive, pressed && styles.pressed]}>
      <View style={styles.top}>
        <View style={[styles.iconTile, active && styles.iconTileActive]}>
          <Ionicons name={config.icon} size={26} color={active ? colors.textOnPrimary : colors.primary}/>
        </View>
        <View style={styles.titles}>
          <Text style={styles.kind}>{config.name.toUpperCase()}</Text>
          <Text style={styles.title} numberOfLines={1}>{title ?? config.name}</Text>
        </View>
        {loading ? (<ActivityIndicator color={colors.primary}/>) : (<Ionicons name={active ? 'chevron-forward' : 'add-circle-outline'} size={22} color={active ? colors.textMuted : colors.primary}/>)}
      </View>

      <Text style={styles.tagline}>{config.tagline}</Text>

      {loading ? null : active ? (<View style={styles.footer}>
          {badges.map((b) => (<StatusBadge key={b.text} text={b.text} tone={b.tone}/>))}
          {highlight ? <Text style={styles.highlight}>{highlight}</Text> : null}
        </View>) : (<View style={styles.setup}>
          <Text style={styles.setupText}>{`Not set up yet · Tap to open your ${config.short}`}</Text>
        </View>)}
    </Pressable>);
}
