import { StyleSheet, View } from 'react-native';

import { SkeletonBlock } from '@/components/ui/skeleton-block';
import { Radii, Spacing } from '@/constants/theme';

/** Mirrors Home's real layout shape so nothing jumps once data arrives. */
export function HomeSkeleton() {
  return (
    <View style={styles.container}>
      <View style={styles.spending}>
        <SkeletonBlock width={150} height={12} />
        <SkeletonBlock width={200} height={44} />
        <SkeletonBlock width={130} height={12} />
      </View>

      <View style={styles.list}>
        <SkeletonBlock width={90} height={12} />
        <SkeletonBlock height={76} radius={Radii.lg} />
        <SkeletonBlock height={76} radius={Radii.lg} />
        <SkeletonBlock height={76} radius={Radii.lg} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.five,
  },
  spending: {
    gap: Spacing.two,
  },
  list: {
    gap: Spacing.three,
  },
});
