/**
 * Renewal motion tokens. Centralizes every duration/spring used for UI motion
 * so screens never hardcode animation magic numbers.
 */

import { Easing } from 'react-native-reanimated';

export const Duration = {
  /** Immediate touch response — press-in feedback only. */
  instant: 80,
  /** Micro-interactions: press states, small toggles. */
  fast: 150,
  /** Section/element transitions, entrances. */
  normal: 320,
  /** Slow, ambient loops — e.g. the loading-skeleton pulse. */
  slow: 900,
} as const;

/** Delay before the greeting's emoji animates in, so it follows the text by a beat. */
export const GreetingEmojiDelay = 140;

export const Curve = {
  standard: Easing.out(Easing.cubic),
} as const;

/** Restrained spring for tactile interactions (button/card press release). */
export const SpringTactile = {
  damping: 18,
  stiffness: 260,
  mass: 0.6,
} as const;

/** Slightly softer spring for content settling into place (entrances). */
export const SpringSettle = {
  damping: 20,
  stiffness: 180,
  mass: 0.7,
} as const;

/** Stagger step between sibling entrance animations, in ms. */
export const StaggerStep = 60;

/** Subtle scale used for pressed states — never large enough to feel bouncy. */
export const PressScale = {
  button: 0.97,
  card: 0.98,
} as const;
