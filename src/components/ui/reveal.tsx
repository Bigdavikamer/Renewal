import type { PropsWithChildren } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

import { Duration } from '@/constants/motion';
import { useReducedMotion } from '@/hooks/use-reduced-motion';

type RevealProps = PropsWithChildren<{
  /** Stagger delay in ms, typically `index * StaggerStep`. */
  delay?: number;
  style?: StyleProp<ViewStyle>;
}>;

/**
 * Shared entrance animation for Home's top-level sections: a subtle
 * fade + upward settle, staggered by `delay`. Falls back to a quick fade
 * when the user prefers reduced motion.
 */
export function Reveal({ delay = 0, style, children }: RevealProps) {
  const reducedMotion = useReducedMotion();

  const entering = reducedMotion
    ? FadeIn.duration(Duration.fast)
    : FadeInDown.duration(Duration.normal).delay(delay);

  return (
    <Animated.View entering={entering} style={style}>
      {children}
    </Animated.View>
  );
}
