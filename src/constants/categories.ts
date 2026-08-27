/** Predefined categories offered in the Add Payment form. */
export const CATEGORIES = [
  'Entertainment',
  'Productivity',
  'Health',
  'Fitness',
  'Education',
  'Cloud Storage',
  'Finance',
  'Gaming',
  'Other',
] as const;

export type Category = (typeof CATEGORIES)[number];
