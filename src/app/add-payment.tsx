import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import { CategoryPicker } from '@/components/add-payment/category-picker';
import { CurrencyPicker } from '@/components/add-payment/currency-picker';
import { DateSelector } from '@/components/add-payment/date-selector';
import { FrequencyPicker } from '@/components/add-payment/frequency-picker';
import { ThemedText } from '@/components/themed-text';
import { AnimatedPressable } from '@/components/ui/animated-pressable';
import { Button } from '@/components/ui/button';
import { Screen } from '@/components/ui/screen';
import { TextField } from '@/components/ui/text-field';
import { Spacing } from '@/constants/theme';
import { createSubscription } from '@/db/repositories/subscription-repository';
import type { BillingFrequency, CurrencyCode } from '@/types/subscription';
import { addDays } from '@/utils/date';
import { DEFAULT_CURRENCY } from '@/utils/currency';
import { haptics } from '@/utils/haptics';

type FormState = {
  name: string;
  amount: string;
  currency: CurrencyCode;
  category: string;
  frequency: BillingFrequency;
  nextRenewalDate: string;
  notes: string;
};

function createInitialForm(): FormState {
  return {
    name: '',
    amount: '',
    currency: DEFAULT_CURRENCY,
    category: '',
    frequency: 'monthly',
    nextRenewalDate: addDays(new Date(), 30).toISOString(),
    notes: '',
  };
}

type FormErrors = Partial<Record<keyof FormState, string>>;

function parseAmount(raw: string): number {
  return Number(raw.trim().replace(',', '.'));
}

function validate(form: FormState): FormErrors {
  const errors: FormErrors = {};

  const name = form.name.trim();
  if (!name) errors.name = 'Service name is required.';
  else if (name.length > 60) errors.name = 'Keep it under 60 characters.';

  if (!form.amount.trim()) {
    errors.amount = 'Amount is required.';
  } else {
    const amount = parseAmount(form.amount);
    if (!Number.isFinite(amount)) errors.amount = 'Enter a valid amount.';
    else if (amount <= 0) errors.amount = 'Enter an amount greater than 0.';
  }

  if (!form.category) errors.category = 'Choose a category.';

  if (!form.nextRenewalDate || Number.isNaN(new Date(form.nextRenewalDate).getTime())) {
    errors.nextRenewalDate = 'Choose a valid date.';
  }

  return errors;
}

export default function AddPaymentScreen() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(createInitialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
  }

  async function handleSave() {
    if (submitting) return;

    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      haptics.warning();
      return;
    }

    setSubmitError(null);
    setSubmitting(true);

    try {
      await createSubscription({
        name: form.name.trim(),
        amount: parseAmount(form.amount),
        currency: form.currency,
        category: form.category,
        frequency: form.frequency,
        nextRenewalDate: form.nextRenewalDate,
        notes: form.notes.trim() ? form.notes.trim() : null,
      });
      haptics.success();
      router.back();
    } catch (error) {
      setSubmitting(false);
      setSubmitError(error instanceof Error ? error.message : "Couldn't save. Please try again.");
      haptics.warning();
    }
  }

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Screen>
        <View style={styles.header}>
          <AnimatedPressable
            accessibilityRole="button"
            accessibilityLabel="Close"
            haptic="selection"
            onPress={() => router.back()}
            style={styles.close}>
            <ThemedText style={styles.closeGlyph}>✕</ThemedText>
          </AnimatedPressable>
          <ThemedText variant="title">Add payment</ThemedText>
          <View style={styles.closeSpacer} />
        </View>

        <View style={styles.form}>
          <TextField
            label="Service name"
            placeholder="Netflix"
            value={form.name}
            onChangeText={(value) => update('name', value)}
            error={errors.name}
            maxLength={60}
            autoCapitalize="words"
            returnKeyType="next"
          />

          <TextField
            label="Amount"
            placeholder="0.00"
            value={form.amount}
            onChangeText={(value) => update('amount', value)}
            error={errors.amount}
            keyboardType="decimal-pad"
          />

          <CurrencyPicker value={form.currency} onChange={(value) => update('currency', value)} />

          <CategoryPicker
            value={form.category}
            onChange={(value) => update('category', value)}
            error={errors.category}
          />

          <FrequencyPicker value={form.frequency} onChange={(value) => update('frequency', value)} />

          <DateSelector
            value={form.nextRenewalDate}
            onChange={(value) => update('nextRenewalDate', value)}
            error={errors.nextRenewalDate}
          />

          <TextField
            label="Notes"
            placeholder="Optional"
            value={form.notes}
            onChangeText={(value) => update('notes', value)}
            multiline
          />
        </View>

        {submitError ? (
          <ThemedText variant="caption" color="destructive" style={styles.submitError}>
            {submitError}
          </ThemedText>
        ) : null}

        <Button
          label={submitting ? 'Saving…' : 'Save payment'}
          icon={null}
          onPress={handleSave}
          disabled={submitting}
        />
      </Screen>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  close: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeGlyph: {
    fontSize: 18,
    fontWeight: '700',
  },
  closeSpacer: {
    width: 44,
  },
  form: {
    gap: Spacing.four,
  },
  submitError: {
    textAlign: 'center',
  },
});
