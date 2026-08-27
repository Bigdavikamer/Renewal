import { useLocalSearchParams, useRouter } from 'expo-router';

import { ErrorState } from '@/components/home/error-state';
import { PaymentForm, subscriptionToFormValues } from '@/components/payment-form/payment-form';
import { Screen } from '@/components/ui/screen';
import { updateSubscription } from '@/db/repositories/subscription-repository';
import { useSubscription } from '@/hooks/use-subscription';
import { syncReminder } from '@/notifications/reminders';
import type { Subscription } from '@/types/subscription';

export default function EditPaymentScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const data = useSubscription(id);

  if (data.status === 'loading') {
    return <Screen />;
  }

  if (data.status === 'error') {
    return (
      <Screen>
        <ErrorState message={data.message} onRetry={data.reload} />
      </Screen>
    );
  }

  if (data.status === 'not-found') {
    return (
      <Screen>
        <ErrorState
          message="This payment could not be found. It may have already been removed."
          onRetry={() => router.back()}
          retryLabel="Go back"
        />
      </Screen>
    );
  }

  return (
    <PaymentForm
      title="Edit payment"
      submitLabel="Save changes"
      submittingLabel="Saving…"
      initialValues={subscriptionToFormValues(data.subscription)}
      onSubmit={async (input) => {
        await updateSubscription(id, input);
        const updated: Subscription = { ...data.subscription, ...input, updatedAt: new Date().toISOString() };
        const { notificationId } = await syncReminder(updated, data.subscription.reminderNotificationId);
        await updateSubscription(id, { reminderNotificationId: notificationId });
      }}
    />
  );
}
