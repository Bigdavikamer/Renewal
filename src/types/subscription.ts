export type BillingFrequency = 'weekly' | 'monthly' | 'yearly';

export type Subscription = {
  id: string;
  name: string;
  category: string;
  amount: number;
  frequency: BillingFrequency;
  /** ISO 8601 timestamp of the next charge. */
  nextRenewalDate: string;
};
