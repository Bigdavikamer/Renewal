import { Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';

import { Duration, PressScale, SpringTactile } from '@/constants/motion';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { haptics } from '@/utils/haptics';

const AnimatedPressableBase = Animated.createAnimatedComponent(Pressable);

type AnimatedPressableProps = Omit<PressableProps, 'style'> & {
  style?: StyleProp<ViewStyle>;
  /** Scale applied while pressed. Defaults to the subtle card press scale. */
  scaleTo?: number;
  /** Haptic feedback fired on a completed press. */
  haptic?: 'impact' | 'selection' | 'none';
};

/**
 * Reusable tactile Pressable: subtle scale + opacity on press, spring release,
 * and an optional haptic — the single place press-interaction motion lives.
 */
export function AnimatedPressable({
  scaleTo = PressScale.card,
  haptic = 'none',
  onPressIn,
  onPressOut,
  onPress,
  style,
  ...rest
}: AnimatedPressableProps) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const reducedMotion = useReducedMotion();

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <AnimatedPressableBase
      onPressIn={(event) => {
        if (reducedMotion) {
          opacity.value = withTiming(0.85, { duration: Duration.fast });
        } else {
          scale.value = withTiming(scaleTo, { duration: Duration.instant });
          opacity.value = withTiming(0.92, { duration: Duration.instant });
        }
        onPressIn?.(event);
      }}
      onPressOut={(event) => {
        opacity.value = withTiming(1, { duration: Duration.fast });
        scale.value = withSpring(1, SpringTactile);
        onPressOut?.(event);
      }}
      onPress={(event) => {
        if (haptic === 'impact') haptics.impact();
        if (haptic === 'selection') haptics.selection();
        onPress?.(event);
      }}
      style={[animatedStyle, style]}
      {...rest}
    />
  );
}
