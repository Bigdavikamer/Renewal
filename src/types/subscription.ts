export type BillingFrequency = 'weekly' | 'monthly' | 'quarterly' | 'yearly';

export type SubscriptionStatus = 'active' | 'trial' | 'canceled';

/** ISO 4217-ish set of currencies Renewal supports selecting in V1. */
export type CurrencyCode = 'BRL' | 'USD' | 'EUR';

export type Subscription = {
  id: string;
  name: string;
  amount: number;
  currency: CurrencyCode;
  category: string;
  frequency: BillingFrequency;
  /** ISO 8601 timestamp of the next charge. */
  nextRenewalDate: string;
  /** ISO 8601 timestamp. Reserved for trial support — not yet surfaced in the UI. */
  trialEndDate: string | null;
  notes: string | null;
  status: SubscriptionStatus;
  createdAt: string;
  updatedAt: string;
};

/** Fields a caller provides when creating a subscription; the repository stamps the rest. */
export type SubscriptionInput = {
  name: string;
  amount: number;
  currency: CurrencyCode;
  category: string;
  frequency: BillingFrequency;
  nextRenewalDate: string;
  trialEndDate?: string | null;
  notes?: string | null;
  status?: SubscriptionStatus;
};
