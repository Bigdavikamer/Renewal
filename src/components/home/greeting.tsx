import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withSpring, withTiming } from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { Reveal } from '@/components/ui/reveal';
import { Duration, GreetingEmojiDelay, SpringTactile } from '@/constants/motion';
import { Spacing, Typography } from '@/constants/theme';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { useTheme } from '@/hooks/use-theme';
import { getGreeting } from '@/utils/date';

/**
 * Home's opening line. Settles in with the rest of the screen via `Reveal`;
 * the emoji then arrives a beat later with its own tiny scale/opacity pop,
 * so it reads as slightly more alive than the text without feeling bouncy.
 */
export function Greeting() {
  const theme = useTheme();
  const reducedMotion = useReducedMotion();
  const opacity = useSharedValue(reducedMotion ? 1 : 0);
  const scale = useSharedValue(reducedMotion ? 1 : 0.7);

  useEffect(() => {
    if (reducedMotion) {
      opacity.value = 1;
      scale.value = 1;
      return;
    }
    opacity.value = withDelay(GreetingEmojiDelay, withTiming(1, { duration: Duration.fast }));
    scale.value = withDelay(GreetingEmojiDelay, withSpring(1, SpringTactile));
  }, [reducedMotion, opacity, scale]);

  const emojiStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const greeting = getGreeting();

  return (
    <Reveal delay={0} style={styles.row}>
      <ThemedText variant="title" accessibilityRole="header" accessibilityLabel={`${greeting} 👋`}>
        {greeting}
      </ThemedText>
      <Animated.Text
        style={[styles.emoji, { color: theme.text }, emojiStyle]}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants">
        👋
      </Animated.Text>
    </Reveal>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  emoji: {
    fontSize: Typography.title.fontSize,
    lineHeight: Typography.title.lineHeight,
  },
});
