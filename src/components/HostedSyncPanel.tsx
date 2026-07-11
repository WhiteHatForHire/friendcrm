import { Cloud, CloudOff, DownloadCloud, KeyRound, LogOut, ShieldCheck, UploadCloud } from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { createFriendCrmSupabaseClient, getSupabaseConfig, hasSupabaseConfig } from "../lib/supabaseClient";
import { fetchSupabaseCrmData, prepareCrmDataForHostedSync, pushSupabaseCrmData } from "../lib/supabaseSync";
import { summarizeCrmData } from "../lib/dataValidation";
import type { CrmData } from "../types";

type HostedSyncPanelProps = {
  data: CrmData;
  onReplaceLocalData: (data: CrmData) => void;
};

type SyncMode = "local" | "hosted";

export function HostedSyncPanel({ data, onReplaceLocalData }: HostedSyncPanelProps) {
  const config = getSupabaseConfig();
  const configured = hasSupabaseConfig();
  const client = useMemo(() => (configured ? createFriendCrmSupabaseClient() : null), [configured]);
  const [session, setSession] = useState<Session | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [syncMode, setSyncMode] = useState<SyncMode>("local");
  const [hostedWriteArmed, setHostedWriteArmed] = useState(false);
  const [message, setMessage] = useState(() =>
    configured
      ? "Supabase is configured. Local mode is still driving the bus until you sign in and arm hosted sync."
      : "Supabase is not configured in this browser. Local mode only, which is cozy and nosy enough."
  );
  const [isBusy, setIsBusy] = useState(false);
  const safeData = prepareCrmDataForHostedSync(data);
  const omittedMemories = data.memories.length - safeData.memories.length;
  const safeSummary = summarizeCrmData(safeData);
  const canUseHosted = Boolean(configured && client && session);
  const hostedWritesReady = canUseHosted && syncMode === "hosted" && hostedWriteArmed;

  useEffect(() => {
    if (!client) return;
    let mounted = true;

    client.auth.getSession().then(({ data: authData }) => {
      if (!mounted) return;
      setSession(authData.session);
    });

    const { data: listener } = client.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      if (!nextSession) {
        setSyncMode("local");
        setHostedWriteArmed(false);
      }
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, [client]);

  async function submitAuth(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await authenticate("sign-in");
  }

  async function authenticate(mode: "sign-in" | "sign-up") {
    if (!client || !email.trim() || !password) return;
    setIsBusy(true);
    setMessage(mode === "sign-in" ? "Checking credentials with the hosted desk..." : "Creating a fake-data-safe hosted account...");

    const result =
      mode === "sign-in"
        ? await client.auth.signInWithPassword({ email: email.trim(), password })
        : await client.auth.signUp({ email: email.trim(), password });

    setIsBusy(false);
    if (result.error) {
      setMessage(`Auth failed: ${result.error.message}`);
      return;
    }

    setSession(result.data.session);
    setMessage(
      result.data.session
        ? "Signed in. Hosted sync is available, but writes still need the big obvious arming switch."
        : "Account created. Check email confirmation settings if Supabase asks for the official velvet rope."
    );
  }

  async function signOut() {
    if (!client) return;
    setIsBusy(true);
    const { error } = await client.auth.signOut();
    setIsBusy(false);
    if (error) {
      setMessage(`Sign out failed: ${error.message}`);
      return;
    }
    setMessage("Signed out. Back to local mode, where the files gossip only inside this browser.");
  }

  async function pushLocalToHosted() {
    if (!hostedWritesReady || !client || !session?.user.id) return;
    setIsBusy(true);
    setMessage("Uploading confirmed local records to Supabase. No unconfirmed memory freeloaders allowed.");
    try {
      await pushSupabaseCrmData(client, session.user.id, safeData);
      setMessage(
        `Hosted push complete: ${safeSummary.people} people, ${safeSummary.notes} notes, ${safeSummary.memories} confirmed memories, ${safeSummary.openLoops} open loops, and ${safeSummary.nextMoves} next moves.`
      );
    } catch (error) {
      setMessage(`Hosted push failed: ${errorMessage(error)}`);
    } finally {
      setIsBusy(false);
    }
  }

  async function pullHostedToLocal() {
    if (!canUseHosted || !client || !session?.user.id) return;
    if (
      !window.confirm(
        "Pull hosted Supabase data into this browser? This replaces the current local dataset. Export first if this local copy matters."
      )
    ) {
      return;
    }

    setIsBusy(true);
    setMessage("Pulling hosted records into the local desk...");
    try {
      const hostedData = await fetchSupabaseCrmData(client, session.user.id);
      onReplaceLocalData(hostedData);
      const hostedSummary = summarizeCrmData(hostedData);
      setMessage(
        `Hosted pull complete: ${hostedSummary.people} people, ${hostedSummary.notes} notes, and ${hostedSummary.memories} memories now live in local browser storage.`
      );
    } catch (error) {
      setMessage(`Hosted pull failed: ${errorMessage(error)}`);
    } finally {
      setIsBusy(false);
    }
  }

  return (
    <section className="hosted-sync-panel">
      <div className="hosted-sync-header">
        <span className={configured ? "sync-status configured" : "sync-status"}>
          {configured ? <Cloud size={18} /> : <CloudOff size={18} />}
          {configured ? "Supabase wired" : "Local only"}
        </span>
        <div>
          <h2>Hosted Sync Desk</h2>
          <p>
            Local mode stays default. Hosted mode is for fake-data sync trials after sign-in, with an extra write arming switch because privacy likes seatbelts.
          </p>
        </div>
      </div>

      <div className="sync-mode-toggle" role="group" aria-label="Data mode">
        <button type="button" className={syncMode === "local" ? "active" : ""} onClick={() => setSyncMode("local")}>
          Local Mode
        </button>
        <button
          type="button"
          className={syncMode === "hosted" ? "active" : ""}
          onClick={() => setSyncMode("hosted")}
          disabled={!canUseHosted}
        >
          Synced Mode
        </button>
      </div>

      <dl className="sync-facts">
        <div>
          <dt>Project URL</dt>
          <dd>{config.url ? config.url.replace("https://", "") : "Not configured"}</dd>
        </div>
        <div>
          <dt>Session</dt>
          <dd>{session?.user.email ?? "Not signed in"}</dd>
        </div>
        <div>
          <dt>Hosted payload</dt>
          <dd>
            {safeSummary.people} people, {safeSummary.notes} notes, {safeSummary.memories} confirmed memories
          </dd>
        </div>
      </dl>

      {configured ? (
        <form className="hosted-auth-form" onSubmit={(event) => void submitAuth(event)}>
          <label>
            <span>Email</span>
            <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" autoComplete="email" />
          </label>
          <label>
            <span>Password</span>
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              minLength={6}
              autoComplete="current-password"
            />
          </label>
          <div className="hosted-auth-actions">
            <button className="primary-button" type="submit" disabled={isBusy || !email.trim() || !password}>
              <KeyRound size={16} />
              Sign In
            </button>
            <button
              className="primary-button muted"
              type="button"
              disabled={isBusy || !email.trim() || !password}
              onClick={() => void authenticate("sign-up")}
            >
              Create Trial Login
            </button>
            <button type="button" disabled={isBusy || !session} onClick={() => void signOut()}>
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </form>
      ) : (
        <p className="settings-note">Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` locally to unlock hosted trial controls.</p>
      )}

      <label className="hosted-arm-switch">
        <input
          type="checkbox"
          checked={hostedWriteArmed}
          onChange={(event) => setHostedWriteArmed(event.target.checked)}
          disabled={!canUseHosted || syncMode !== "hosted"}
        />
        I understand this writes the current fake/local dataset to my hosted Supabase account.
      </label>

      <div className="hosted-sync-actions">
        <button className="primary-button" type="button" disabled={!hostedWritesReady || isBusy} onClick={() => void pushLocalToHosted()}>
          <UploadCloud size={16} />
          Push Local To Hosted
        </button>
        <button className="primary-button muted" type="button" disabled={!canUseHosted || isBusy} onClick={() => void pullHostedToLocal()}>
          <DownloadCloud size={16} />
          Pull Hosted To Local
        </button>
      </div>

      <p className="hosted-privacy-note">
        <ShieldCheck size={16} />
        {omittedMemories
          ? `${omittedMemories} unconfirmed memory will be omitted from hosted sync. Good. Creepy guesses do not get a passport.`
          : "Only confirmed durable memories are eligible for hosted sync. Notes and open loops keep their sensitivity labels."}
      </p>
      <p className="settings-note" aria-live="polite">{message}</p>
    </section>
  );
}

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Unknown hosted desk tantrum.";
}
