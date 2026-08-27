/**
 * Small reusable haptics wrapper. Keeps every call site consistent and
 * makes haptics a no-op on platforms that don't support them (web).
 */

import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

const enabled = Platform.OS === 'ios' || Platform.OS === 'android';

export const haptics = {
  /** Primary button press. */
  impact() {
    if (enabled) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  },
  /** Important selection, e.g. tapping a payment card. */
  selection() {
    if (enabled) Haptics.selectionAsync();
  },
  /** Future: successful save. */
  success() {
    if (enabled) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  },
  /** Future: destructive/warning action. */
  warning() {
    if (enabled) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  },
};
