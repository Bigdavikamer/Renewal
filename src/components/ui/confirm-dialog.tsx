import { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { AnimatedPressable } from '@/components/ui/animated-pressable';
import { Card } from '@/components/ui/card';
import { Duration, SpringTactile } from '@/constants/motion';
import { Radii, Spacing } from '@/constants/theme';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { useTheme } from '@/hooks/use-theme';

type ConfirmDialogProps = {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
  /** Styles the confirm action as a dangerous, visually-distinct choice. */
  destructive?: boolean;
  /** Disables both actions and is used for a mid-action label (e.g. "Deleting…"). */
  busy?: boolean;
  error?: string | null;
  onConfirm: () => void;
  onCancel: () => void;
};

/**
 * Generic in-app confirmation overlay — a dimmed backdrop behind a centered
 * card, built on the existing Reanimated setup rather than a native Alert,
 * so it looks and feels like Renewal. Not delete-specific; reusable for any
 * future confirm-then-act flow.
 */
export function ConfirmDialog({
  visible,
  title,
  message,
  confirmLabel,
  cancelLabel = 'Cancel',
  destructive = false,
  busy = false,
  error,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!visible) return null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      <Animated.View
        entering={FadeIn.duration(Duration.fast)}
        exiting={FadeOut.duration(Duration.fast)}
        style={[StyleSheet.absoluteFill, styles.backdrop]}>
        <Pressable
          style={StyleSheet.absoluteFill}
          accessibilityLabel={cancelLabel}
          onPress={busy ? undefined : onCancel}
        />
      </Animated.View>

      <View style={styles.center} pointerEvents="box-none">
        <DialogCard
          title={title}
          message={message}
          confirmLabel={confirmLabel}
          cancelLabel={cancelLabel}
          destructive={destructive}
          busy={busy}
          error={error}
          onConfirm={onConfirm}
          onCancel={onCancel}
        />
      </View>
    </View>
  );
}

function DialogCard({
  title,
  message,
  confirmLabel,
  cancelLabel,
  destructive,
  busy,
  error,
  onConfirm,
  onCancel,
}: Omit<ConfirmDialogProps, 'visible'>) {
  const theme = useTheme();
  const reducedMotion = useReducedMotion();
  const opacity = useSharedValue(reducedMotion ? 1 : 0);
  const scale = useSharedValue(reducedMotion ? 1 : 0.94);

  useEffect(() => {
    if (reducedMotion) {
      opacity.value = 1;
      scale.value = 1;
      return;
    }
    opacity.value = withTiming(1, { duration: Duration.fast });
    scale.value = withSpring(1, SpringTactile);
    // Only animate in once, on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View exiting={FadeOut.duration(Duration.fast)} style={[styles.cardWrap, animatedStyle]}>
      <Card elevated style={styles.card}>
        <ThemedText variant="title" style={destructive ? { color: theme.destructive } : undefined}>
          {title}
        </ThemedText>
        <ThemedText variant="body" color="textSecondary" style={styles.message}>
          {message}
        </ThemedText>

        {error ? (
          <ThemedText variant="caption" color="destructive">
            {error}
          </ThemedText>
        ) : null}

        <View style={styles.actions}>
          <AnimatedPressable
            haptic="selection"
            accessibilityRole="button"
            accessibilityLabel={cancelLabel}
            disabled={busy}
            onPress={onCancel}
            style={[styles.action, styles.cancelAction, { borderColor: theme.border, opacity: busy ? 0.6 : 1 }]}>
            <ThemedText variant="body" style={styles.actionLabel}>
              {cancelLabel}
            </ThemedText>
          </AnimatedPressable>

          <AnimatedPressable
            haptic="none"
            accessibilityRole="button"
            accessibilityLabel={confirmLabel}
            disabled={busy}
            onPress={onConfirm}
            style={[
              styles.action,
              {
                backgroundColor: destructive ? theme.destructive : theme.primary,
                opacity: busy ? 0.7 : 1,
              },
            ]}>
            <ThemedText variant="body" style={[styles.actionLabel, styles.actionLabelOnFill]}>
              {confirmLabel}
            </ThemedText>
          </AnimatedPressable>
        </View>
      </Card>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.five,
  },
  cardWrap: {
    width: '100%',
    maxWidth: 360,
  },
  card: {
    gap: Spacing.two,
  },
  message: {
    marginBottom: Spacing.one,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.two,
    marginTop: Spacing.three,
  },
  action: {
    flex: 1,
    minHeight: 48,
    borderRadius: Radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelAction: {
    borderWidth: 1.5,
  },
  actionLabel: {
    fontWeight: '700',
  },
  actionLabelOnFill: {
    color: '#FFFFFF',
  },
});
