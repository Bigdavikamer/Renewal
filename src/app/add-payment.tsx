import { PaymentForm } from '@/components/payment-form/payment-form';
import { createSubscription, updateSubscription } from '@/db/repositories/subscription-repository';
import { DEFAULT_REMINDER_DAYS_BEFORE, syncReminder } from '@/notifications/reminders';
import { DEFAULT_CURRENCY } from '@/utils/currency';
import { addDays } from '@/utils/date';

export default function AddPaymentScreen() {
  return (
    <PaymentForm
      title="Add payment"
      submitLabel="Save payment"
      submittingLabel="Saving…"
      initialValues={{
        name: '',
        amount: '',
        currency: DEFAULT_CURRENCY,
        category: '',
        frequency: 'monthly',
        nextRenewalDate: addDays(new Date(), 30).toISOString(),
        reminderDaysBefore: DEFAULT_REMINDER_DAYS_BEFORE,
        notes: '',
      }}
      onSubmit={async (input) => {
        const created = await createSubscription(input);
        const { notificationId } = await syncReminder(created, null);
        await updateSubscription(created.id, { reminderNotificationId: notificationId });
      }}
    />
  );
}
