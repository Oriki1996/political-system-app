import { supabase } from "./supabase";
import type { User } from "@supabase/supabase-js";

/** All calls are best-effort: if the table is missing or the user is offline,
 *  they fail silently so the local-first experience is never blocked. */

const now = () => new Date().toISOString();
const swallow = () => {};

/** Ensure a profile row exists. Updates display name/avatar but never touches
 *  share_scores (so the student's visibility choice is preserved). */
export async function ensureProfile(user: User): Promise<void> {
  if (!supabase) return;
  const display_name =
    user.user_metadata?.full_name || user.email?.split("@")[0] || "סטודנט";
  const avatar_url = user.user_metadata?.avatar_url ?? null;
  await supabase
    .from("psi_profiles")
    .upsert({ user_id: user.id, display_name, avatar_url, updated_at: now() }, { onConflict: "user_id" })
    .then(swallow, swallow);
}

export async function getShareScores(userId: string): Promise<boolean> {
  if (!supabase) return true;
  try {
    const { data } = await supabase
      .from("psi_profiles")
      .select("share_scores")
      .eq("user_id", userId)
      .maybeSingle();
    return data?.share_scores ?? true;
  } catch {
    return true;
  }
}

export async function setShareScoresDb(userId: string, share: boolean): Promise<void> {
  if (!supabase) return;
  await supabase
    .from("psi_profiles")
    .update({ share_scores: share, updated_at: now() })
    .eq("user_id", userId)
    .then(swallow, swallow);
}

export async function upsertUnitScore(userId: string, unitId: string, earned: number, possible: number): Promise<void> {
  if (!supabase || possible <= 0) return;
  await supabase
    .from("psi_scores")
    .upsert({ user_id: userId, unit_id: unitId, earned, possible, updated_at: now() }, { onConflict: "user_id,unit_id" })
    .then(swallow, swallow);
}

export interface BoardRow {
  userId: string;
  name: string;
  avatar?: string | null;
  total: { earned: number; possible: number };
  perUnit: Record<string, { earned: number; possible: number }>;
  isMe?: boolean;
}

/** Class board: every student who shares, aggregated + sorted by score.
 *  RLS hides non-sharers; we also guard client-side. */
export async function fetchBoard(myId?: string): Promise<BoardRow[]> {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from("psi_scores")
      .select("user_id, unit_id, earned, possible, psi_profiles!inner(display_name, avatar_url, share_scores)");
    if (error || !data) return [];
    const map = new Map<string, BoardRow>();
    for (const r of data as Array<Record<string, unknown>>) {
      const prof = r.psi_profiles as { display_name?: string; avatar_url?: string | null; share_scores?: boolean } | null;
      const uid = r.user_id as string;
      if (!prof || prof.share_scores === false) continue;
      let row = map.get(uid);
      if (!row) {
        row = {
          userId: uid,
          name: prof.display_name || "סטודנט",
          avatar: prof.avatar_url,
          total: { earned: 0, possible: 0 },
          perUnit: {},
          isMe: uid === myId,
        };
        map.set(uid, row);
      }
      const earned = (r.earned as number) || 0;
      const possible = (r.possible as number) || 0;
      row.perUnit[r.unit_id as string] = { earned, possible };
      row.total.earned += earned;
      row.total.possible += possible;
    }
    return [...map.values()].sort((a, b) => b.total.earned - a.total.earned);
  } catch {
    return [];
  }
}
