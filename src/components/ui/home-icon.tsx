import { StyleSheet, View, type ColorValue } from 'react-native';

type HomeIconProps = {
  color: ColorValue;
  size?: number;
};

/**
 * Minimal geometric home glyph for the tab bar — a roof (CSS border-triangle)
 * over a base rectangle. No icon library needed; tints via `color` so it
 * follows the tab bar's existing active/inactive theme colors automatically.
 */
export function HomeIcon({ color, size = 24 }: HomeIconProps) {
  const roofSize = size * 0.42;
  const baseWidth = size * 0.6;
  const baseHeight = size * 0.4;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <View
        style={[
          styles.roof,
          { borderLeftWidth: roofSize, borderRightWidth: roofSize, borderBottomWidth: roofSize, borderBottomColor: color },
        ]}
      />
      <View style={[styles.base, { width: baseWidth, height: baseHeight, backgroundColor: color }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  roof: {
    width: 0,
    height: 0,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    marginBottom: -1,
  },
  base: {
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
  },
});
