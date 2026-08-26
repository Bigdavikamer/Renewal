/**
 * Placeholder subscription data for the Home screen.
 * Replace with real persisted data once storage is implemented.
 */

import type { Subscription } from '@/types/subscription';
import { addDays } from '@/utils/date';

const today = new Date();

export const mockSubscriptions: Subscription[] = [
  {
    id: 'netflix',
    name: 'Netflix',
    category: 'Entertainment',
    amount: 39.9,
    frequency: 'monthly',
    nextRenewalDate: addDays(today, 3).toISOString(),
  },
  {
    id: 'spotify',
    name: 'Spotify',
    category: 'Entertainment',
    amount: 21.9,
    frequency: 'monthly',
    nextRenewalDate: addDays(today, 8).toISOString(),
  },
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    category: 'Productivity',
    amount: 100,
    frequency: 'monthly',
    nextRenewalDate: addDays(today, 12).toISOString(),
  },
  {
    id: 'google-one',
    name: 'Google One',
    category: 'Utilities',
    amount: 9.99,
    frequency: 'monthly',
    nextRenewalDate: addDays(today, 18).toISOString(),
  },
];
