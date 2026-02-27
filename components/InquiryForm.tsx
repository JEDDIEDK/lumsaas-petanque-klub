"use client";

import { useState } from "react";
import { submitInquiry } from "@/app/actions/inquiries";

export function InquiryForm({ compact = false }: { compact?: boolean }) {
  const [message, setMessage] = useState<string | null>(null);

  return (
    <form
      className="grid gap-3 rounded-xl bg-white p-5 shadow-card"
      action={async (formData) => {
        const result = await submitInquiry(formData);
        setMessage(result.message);
      }}
    >
      <div className={compact ? "grid gap-3" : "grid gap-3 md:grid-cols-2"}>
        <div>
          <label className="mb-1 block text-sm">Navn</label>
          <input name="name" required className="w-full rounded-md border border-black/10 px-3 py-2" />
        </div>
        <div>
          <label className="mb-1 block text-sm">Email</label>
          <input name="email" type="email" required className="w-full rounded-md border border-black/10 px-3 py-2" />
        </div>
      </div>
      <div>
        <label className="mb-1 block text-sm">Telefon</label>
        <input name="phone" className="w-full rounded-md border border-black/10 px-3 py-2" />
      </div>
      <div>
        <label className="mb-1 block text-sm">Besked</label>
        <textarea
          name="message"
          required
          rows={4}
          className="w-full rounded-md border border-black/10 px-3 py-2"
          placeholder="Skriv lidt om dig selv og hvad du ønsker at høre mere om"
        />
      </div>
      <button type="submit" className="rounded-md bg-moss px-4 py-2 text-sm font-semibold text-white">
        Send forespørgsel
      </button>
      {message ? <p className="text-sm text-stone">{message}</p> : null}
    </form>
  );
}
