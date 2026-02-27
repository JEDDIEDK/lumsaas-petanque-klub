"use client";

import { useActionState } from "react";
import { adminResetPassword } from "@/app/actions/auth";

export function AdminResetPasswordForm({ email }: { email: string }) {
  const [state, action, pending] = useActionState(
    async (_prev: { ok: boolean; message: string } | null, formData: FormData) =>
      adminResetPassword(formData),
    null
  );

  return (
    <form action={action} className="mt-2 flex flex-wrap items-center gap-2">
      <input type="hidden" name="email" value={email} />
      <input
        name="newPassword"
        type="password"
        minLength={6}
        required
        placeholder="Nyt kodeord"
        className="rounded-md border border-black/10 px-3 py-2 text-xs"
      />
      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-moss px-3 py-2 text-xs font-semibold text-white disabled:opacity-60"
      >
        {pending ? "Gemmer..." : "Nulstil kode"}
      </button>
      {state ? <span className="text-xs text-stone">{state.message}</span> : null}
    </form>
  );
}
