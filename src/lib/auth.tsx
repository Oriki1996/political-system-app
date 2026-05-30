import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase, supabaseEnabled, APP_NAMESPACE } from "./supabase";
import { ensureProfile, getShareScores, setShareScoresDb } from "./cloudScores";

interface Profile {
  id: string;
  display_name: string;
  email?: string;
  avatar_url?: string;
  class_code?: string;
}

interface AuthCtx {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInGuest: (name: string) => Promise<void>;
  signOut: () => Promise<void>;
  isGuest: boolean;
  cloudEnabled: boolean;
  /** Whether the student's score is visible to others (default: true). */
  shareScores: boolean;
  updateShareScores: (v: boolean) => void;
}

const Ctx = createContext<AuthCtx | null>(null);
const GUEST_KEY = `${APP_NAMESPACE}_guest_v1`;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [guestName, setGuestName] = useState<string | null>(() => localStorage.getItem(GUEST_KEY));
  const [shareScores, setShareScores] = useState(true);

  useEffect(() => {
    if (!supabaseEnabled || !supabase) {
      setLoading(false);
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess);
      setUser(sess?.user ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user || !supabase) {
      setProfile(null);
      return;
    }
    // Build a profile from the Google user_metadata for instant UI.
    const display = user.user_metadata?.full_name || user.email?.split("@")[0] || "סטודנט";
    setProfile({
      id: user.id,
      display_name: display,
      email: user.email,
      avatar_url: user.user_metadata?.avatar_url,
    });
    // Best-effort cloud profile: ensure a row exists and load the visibility choice.
    ensureProfile(user).then(() => getShareScores(user.id)).then(setShareScores).catch(() => {});
  }, [user]);

  function updateShareScores(v: boolean) {
    setShareScores(v);
    if (user) setShareScoresDb(user.id, v);
  }

  async function signInWithGoogle() {
    if (!supabase) return;
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
  }

  async function signInGuest(name: string) {
    localStorage.setItem(GUEST_KEY, name);
    setGuestName(name);
  }

  async function signOut() {
    if (supabase) await supabase.auth.signOut();
    localStorage.removeItem(GUEST_KEY);
    setGuestName(null);
    setUser(null);
    setSession(null);
    setProfile(null);
  }

  const isGuest = !user && Boolean(guestName);

  const effectiveProfile: Profile | null = profile
    ? profile
    : guestName
      ? { id: "guest-" + guestName, display_name: guestName }
      : null;

  return (
    <Ctx.Provider
      value={{
        user,
        profile: effectiveProfile,
        session,
        loading,
        signInWithGoogle,
        signInGuest,
        signOut,
        isGuest,
        cloudEnabled: supabaseEnabled && Boolean(user),
        shareScores,
        updateShareScores,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuth must be used within AuthProvider");
  return v;
}
