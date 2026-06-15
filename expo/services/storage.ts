import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";

const ASYNC_KEY = "solefit_user_data";
const SECURE_MEASUREMENTS_KEY = "solefit_measurements";
const SECURE_PROFILE_KEY = "solefit_profile";

// ── Secure Store (encrypted — for biometric-adjacent data) ──

export async function saveSecureMeasurements(measurements: object): Promise<void> {
  await SecureStore.setItemAsync(SECURE_MEASUREMENTS_KEY, JSON.stringify(measurements));
}

export async function loadSecureMeasurements<T>(): Promise<T | null> {
  const raw = await SecureStore.getItemAsync(SECURE_MEASUREMENTS_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export async function deleteSecureMeasurements(): Promise<void> {
  await SecureStore.deleteItemAsync(SECURE_MEASUREMENTS_KEY);
}

export async function saveSecureProfile(profile: object): Promise<void> {
  await SecureStore.setItemAsync(SECURE_PROFILE_KEY, JSON.stringify(profile));
}

export async function loadSecureProfile<T>(): Promise<T | null> {
  const raw = await SecureStore.getItemAsync(SECURE_PROFILE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export async function deleteSecureProfile(): Promise<void> {
  await SecureStore.deleteItemAsync(SECURE_PROFILE_KEY);
}

// ── Async Storage (non-sensitive preferences / wishlist) ──

export async function saveNonSensitiveState(data: object): Promise<void> {
  await AsyncStorage.setItem(ASYNC_KEY, JSON.stringify(data));
}

export async function loadNonSensitiveState<T>(): Promise<T | null> {
  const raw = await AsyncStorage.getItem(ASYNC_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export async function deleteNonSensitiveState(): Promise<void> {
  await AsyncStorage.removeItem(ASYNC_KEY);
}

// ── Full data wipe ──

export async function deleteAllUserData(): Promise<void> {
  await Promise.all([
    deleteSecureMeasurements(),
    deleteSecureProfile(),
    deleteNonSensitiveState(),
  ]);
}
