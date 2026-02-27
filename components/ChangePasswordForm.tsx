"use client";

import { useActionState } from "react";
import { changeOwnPassword } from "@/app/actions/auth";

export function ChangePasswordForm() {
  const [state, action, pending] = useActionState(
    async (_prev: { ok: boolean; message: string } | null, formData: FormData) =>
      changeOwnPassword(formData),
    null
  );

  return (
    <form action={action} className="grid gap-3 rounded-xl bg-white p-5 shadow-card">
      <h3 className="text-xl font-bold">Skift kodeord</h3>
      <div>
        <label className="mb-1 block text-sm">Nuværende kodeord</label>
        <input
          name="currentPassword"
          type="password"
          required
          className="w-full rounded-md border border-black/10 px-3 py-2"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm">Nyt kodeord</label>
        <input
          name="newPassword"
          type="password"
          minLength={6}
          required
          className="w-full rounded-md border border-black/10 px-3 py-2"
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-moss px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
      >
        {pending ? "Gemmer..." : "Opdater kodeord"}
      </button>
      {state ? <p className="text-sm text-stone">{state.message}</p> : null}
    </form>
  );
}
