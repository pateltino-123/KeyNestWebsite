import createContextHook from "@nkzw/create-context-hook";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";

import { supabase } from "@/services/supabase";

const GUEST_KEY = "shoefit_guest_mode";
const LOCAL_USER_KEY = "shoefit_local_user";

/**
 * TEMPORARY: local auth bypass.
 *
 * While we're testing, any email + password is accepted and signs the user in
 * locally (no real Supabase verification, no email confirmation). The Supabase
 * client and session handling below stay wired up so we can switch back to real
 * auth later by flipping LOCAL_AUTH_BYPASS to false.
 */
const LOCAL_AUTH_BYPASS = true;

interface LocalUser {
  email: string;
  name: string;
}

export interface AuthResult {
  ok: boolean;
  error?: string;
}

function nameFromEmail(email: string): string {
  const handle = email.split("@")[0] ?? "";
  if (!handle) return "";
  return handle.charAt(0).toUpperCase() + handle.slice(1);
}

export const [AuthProvider, useAuth] = createContextHook(() => {
  const [session, setSession] = useState<Session | null>(null);
  const [localUser, setLocalUser] = useState<LocalUser | null>(null);
  const [isGuest, setIsGuest] = useState<boolean>(false);
  const [initializing, setInitializing] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;

    (async () => {
      const [{ data }, guest, storedLocal] = await Promise.all([
        supabase.auth.getSession(),
        AsyncStorage.getItem(GUEST_KEY),
        AsyncStorage.getItem(LOCAL_USER_KEY),
      ]);
      if (!mounted) return;
      setSession(data.session);
      setIsGuest(guest === "true");
      if (storedLocal) {
        try {
          setLocalUser(JSON.parse(storedLocal) as LocalUser);
        } catch {
          // ignore corrupt value
        }
      }
      setInitializing(false);
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      if (newSession) {
        setIsGuest(false);
        AsyncStorage.removeItem(GUEST_KEY).catch(() => {});
      }
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const signInLocal = useCallback(async (email: string, name: string) => {
    const user: LocalUser = { email: email.trim(), name };
    await AsyncStorage.setItem(LOCAL_USER_KEY, JSON.stringify(user));
    await AsyncStorage.removeItem(GUEST_KEY);
    setLocalUser(user);
    setIsGuest(false);
  }, []);

  const signIn = useCallback(
    async (email: string, password: string): Promise<AuthResult> => {
      if (LOCAL_AUTH_BYPASS) {
        if (!email.trim() || !password) {
          return { ok: false, error: "Enter an email and password." };
        }
        await signInLocal(email, nameFromEmail(email));
        return { ok: true };
      }
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) return { ok: false, error: error.message };
      return { ok: true };
    },
    [signInLocal],
  );

  const signUp = useCallback(
    async (email: string, password: string, name: string): Promise<AuthResult> => {
      if (LOCAL_AUTH_BYPASS) {
        if (!email.trim() || !password) {
          return { ok: false, error: "Enter an email and password." };
        }
        await signInLocal(email, name.trim() || nameFromEmail(email));
        return { ok: true };
      }
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: { data: { full_name: name.trim() } },
      });
      if (error) return { ok: false, error: error.message };
      if (!data.session) {
        return { ok: true, error: "CONFIRM_EMAIL" };
      }
      return { ok: true };
    },
    [signInLocal],
  );

  const signOut = useCallback(async () => {
    await supabase.auth.signOut().catch(() => {});
    await AsyncStorage.multiRemove([GUEST_KEY, LOCAL_USER_KEY]);
    setIsGuest(false);
    setLocalUser(null);
    setSession(null);
  }, []);

  const continueAsGuest = useCallback(async () => {
    await AsyncStorage.setItem(GUEST_KEY, "true");
    setIsGuest(true);
  }, []);

  const supaUser: User | null = session?.user ?? null;
  const email = localUser?.email ?? supaUser?.email ?? "";
  const displayName =
    localUser?.name ?? (supaUser?.user_metadata?.full_name as string | undefined) ?? "";

  return {
    session,
    user: supaUser,
    email,
    displayName,
    isAuthed: !!session || !!localUser,
    isGuest,
    initializing,
    signIn,
    signUp,
    signOut,
    continueAsGuest,
  };
});
