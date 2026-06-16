import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";

const ASYNC_KEY = "solefit_user_data";
const SECURE_MEASUREMENTS_KEY = "solefit_measurements";
const SECURE_PROFILE_KEY = "solefit_profile";

// ── Secure Store (encrypted — for biometric-adjacent data) ──

export async function saveSecureMeasurements(measurements: object): Promise<void> {
  try {
    await SecureStore.setItemAsync(SECURE_MEASUREMENTS_KEY, JSON.stringify(measurements));
  } catch {
    // SecureStore unavailable — data not persisted
  }
}

export async function loadSecureMeasurements<T>(): Promise<T | null> {
  try {
    const raw = await SecureStore.getItemAsync(SECURE_MEASUREMENTS_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  } catch {
    return null;
  }
}

export async function deleteSecureMeasurements(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(SECURE_MEASUREMENTS_KEY);
  } catch {
    // SecureStore unavailable — nothing to delete
  }
}

export async function saveSecureProfile(profile: object): Promise<void> {
  try {
    await SecureStore.setItemAsync(SECURE_PROFILE_KEY, JSON.stringify(profile));
  } catch {
    // SecureStore unavailable — data not persisted
  }
}

export async function loadSecureProfile<T>(): Promise<T | null> {
  try {
    const raw = await SecureStore.getItemAsync(SECURE_PROFILE_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  } catch {
    return null;
  }
}

export async function deleteSecureProfile(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(SECURE_PROFILE_KEY);
  } catch {
    // SecureStore unavailable — nothing to delete
  }
}

// ── Async Storage (non-sensitive preferences / wishlist) ──

export async function saveNonSensitiveState(data: object): Promise<void> {
  try {
    await AsyncStorage.setItem(ASYNC_KEY, JSON.stringify(data));
  } catch {
    // AsyncStorage write failed — non-sensitive data not persisted
  }
}

export async function loadNonSensitiveState<T>(): Promise<T | null> {
  try {
    const raw = await AsyncStorage.getItem(ASYNC_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  } catch {
    return null;
  }
}

export async function deleteNonSensitiveState(): Promise<void> {
  try {
    await AsyncStorage.removeItem(ASYNC_KEY);
  } catch {
    // AsyncStorage removal failed — nothing to delete
  }
}

// ── Full data wipe ──

export async function deleteAllUserData(): Promise<void> {
  await Promise.all([
    deleteSecureMeasurements(),
    deleteSecureProfile(),
    deleteNonSensitiveState(),
  ]);
}
