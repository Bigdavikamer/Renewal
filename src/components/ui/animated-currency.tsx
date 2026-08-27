import { useEffect, useState } from 'react';
import { runOnJS, useAnimatedReaction, useSharedValue, withTiming } from 'react-native-reanimated';

import { ThemedText, type ThemedTextProps } from '@/components/themed-text';
import { Duration } from '@/constants/motion';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { formatCurrency } from '@/utils/currency';

type AnimatedCurrencyProps = Omit<ThemedTextProps, 'children'> & {
  value: number;
  /** Count up from 0 on first mount instead of showing the value immediately. */
  animateFromZero?: boolean;
};

/**
 * Currency text that eases toward a new value instead of snapping, so future
 * spending-total updates (adding/removing a payment) feel continuous.
 */
export function AnimatedCurrency({ value, animateFromZero = false, ...rest }: AnimatedCurrencyProps) {
  const reducedMotion = useReducedMotion();
  const initialValue = animateFromZero ? 0 : value;
  const progress = useSharedValue(initialValue);
  const [display, setDisplay] = useState(initialValue);

  useEffect(() => {
    if (reducedMotion) {
      progress.value = value;
      setDisplay(value);
    } else {
      progress.value = withTiming(value, { duration: Duration.normal });
    }
  }, [value, reducedMotion, progress]);

  useAnimatedReaction(
    () => progress.value,
    (current, previous) => {
      if (previous === null || Math.round(current * 100) !== Math.round(previous * 100)) {
        runOnJS(setDisplay)(current);
      }
    }
  );

  return <ThemedText {...rest}>{formatCurrency(display)}</ThemedText>;
}
