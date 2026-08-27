import Constants, { ExecutionEnvironment } from 'expo-constants';

/**
 * expo-notifications' Android functionality was removed from Expo Go
 * starting with SDK 53 — even loading/using the module there can throw.
 * Local reminders work normally in a development or production build; this
 * flag just keeps the feature dormant inside Expo Go itself, where it can't
 * work anyway. `expo-constants` is a plain JS config module, safe to import
 * statically anywhere, including the root layout.
 */
export const isExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;
