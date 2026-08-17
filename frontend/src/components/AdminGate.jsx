import React, { useState } from 'react';
import { Lock, Unlock } from 'lucide-react';
import { postJSON, setPasscode, clearPasscode, getPasscode } from '../api';

/**
 * Passcode screen in front of the admin page. Keeps the cook from editing the
 * week by accident — it is not a security boundary (see README).
 */
export default function AdminGate({ children }) {
  const [unlocked, setUnlocked] = useState(() => !!getPasscode());
  const [code, setCode] = useState('');
  const [error, setError] = useState(null);
  const [checking, setChecking] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setChecking(true);
    setError(null);
    try {
      await postJSON('/api/admin/unlock', { passcode: code });
      setPasscode(code);
      setUnlocked(true);
    } catch (err) {
      setError(err.message);
    }
    setChecking(false);
  };

  const lock = () => {
    clearPasscode();
    setUnlocked(false);
    setCode('');
  };

  if (unlocked) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3 rounded-xl border border-sage-100 bg-sage-100/50 px-4 py-2.5">
          <span className="flex items-center gap-2 text-sm font-semibold text-sage-700">
            <Unlock className="h-4 w-4" />
            Unlocked
          </span>
          <button
            onClick={lock}
            className="tap -my-2 px-2 text-sm font-semibold text-clay-700 underline underline-offset-2"
          >
            Lock again
          </button>
        </div>
        {children}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-sm">
      <form onSubmit={submit} className="card p-6 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-cream-200">
          <Lock className="h-5 w-5 text-clay-600" />
        </div>
        <h2 className="text-lg font-bold text-clay-900">Admin access</h2>
        <p className="mx-auto mt-1 max-w-xs text-sm text-clay-600">
          Enter the passcode to change this week's menu.
        </p>

        <input
          type="password"
          inputMode="numeric"
          autoComplete="off"
          autoFocus
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Passcode"
          aria-label="Admin passcode"
          className="field mt-5 text-center tracking-[0.4em]"
        />

        {error && <p className="mt-3 text-sm text-red-700">{error}</p>}

        <button type="submit" disabled={checking || !code} className="btn-primary mt-4 w-full">
          {checking ? 'Checking…' : 'Unlock'}
        </button>
      </form>
    </div>
  );
}
