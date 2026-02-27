"use server";

export async function submitInquiry(_formData: FormData) {
  void _formData;
  return { ok: true, message: "Kontaktformular er midlertidigt slået fra i lokal version." };
}
