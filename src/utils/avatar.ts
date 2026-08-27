import { AvatarAccents } from '@/constants/theme';

/** Deterministically maps a seed (e.g. category) to an avatar accent color. */
export function getAvatarAccent(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return AvatarAccents[hash % AvatarAccents.length];
}
