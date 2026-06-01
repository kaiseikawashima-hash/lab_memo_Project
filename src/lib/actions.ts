"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSupabase } from "./supabase";
import { fileNameSafe, splitTags } from "./utils";

export async function createSession(formData: FormData) {
  const supabase = getSupabase();
  const seminarId = String(formData.get("seminar_id") || "");
  const title = String(formData.get("title") || "");
  const date = String(formData.get("date") || "") || null;
  const pdf = formData.get("pdf_file");

  let duplicateQuery = supabase
    .from("sessions")
    .select("id")
    .eq("seminar_id", seminarId)
    .eq("title", title)
    .limit(1);

  duplicateQuery = date ? duplicateQuery.eq("date", date) : duplicateQuery.is("date", null);

  const { data: duplicate, error: duplicateError } = await duplicateQuery.maybeSingle();
  if (duplicateError) throw new Error(duplicateError.message);
  if (duplicate) redirect(`/sessions/${duplicate.id}`);

  const { data: session, error } = await supabase
    .from("sessions")
    .insert({
      seminar_id: seminarId,
      title,
      date,
      speaker: String(formData.get("speaker") || "") || null,
      paper_title: String(formData.get("paper_title") || "") || null,
      paper_authors: String(formData.get("paper_authors") || "") || null,
      paper_url: String(formData.get("paper_url") || "") || null,
      summary: String(formData.get("summary") || "") || null
    })
    .select("id")
    .single();

  if (error || !session) throw new Error(error?.message || "Failed to create session");

  if (pdf instanceof File && pdf.size > 0) {
    const path = `sessions/${session.id}/${Date.now()}-${fileNameSafe(pdf.name)}`;
    const { error: uploadError } = await supabase.storage.from("seminar-pdfs").upload(path, pdf, {
      contentType: pdf.type || "application/pdf",
      upsert: true
    });
    if (uploadError) throw new Error(uploadError.message);

    const { data } = supabase.storage.from("seminar-pdfs").getPublicUrl(path);
    const { error: updateError } = await supabase
      .from("sessions")
      .update({ pdf_path: path, pdf_url: data.publicUrl })
      .eq("id", session.id);
    if (updateError) throw new Error(updateError.message);
  }

  revalidatePath("/");
  redirect(`/sessions/${session.id}`);
}

export async function updateSession(formData: FormData) {
  const supabase = getSupabase();
  const sessionId = String(formData.get("session_id") || "");
  const oldPdfPath = String(formData.get("old_pdf_path") || "");
  const pdf = formData.get("pdf_file");

  const updates: Record<string, string | null> = {
    seminar_id: String(formData.get("seminar_id") || ""),
    title: String(formData.get("title") || ""),
    date: String(formData.get("date") || "") || null,
    speaker: String(formData.get("speaker") || "") || null,
    paper_title: String(formData.get("paper_title") || "") || null,
    paper_authors: String(formData.get("paper_authors") || "") || null,
    paper_url: String(formData.get("paper_url") || "") || null,
    summary: String(formData.get("summary") || "") || null
  };

  if (pdf instanceof File && pdf.size > 0) {
    const path = `sessions/${sessionId}/${Date.now()}-${fileNameSafe(pdf.name)}`;
    const { error: uploadError } = await supabase.storage.from("seminar-pdfs").upload(path, pdf, {
      contentType: pdf.type || "application/pdf",
      upsert: true
    });
    if (uploadError) throw new Error(uploadError.message);

    if (oldPdfPath) {
      await supabase.storage.from("seminar-pdfs").remove([oldPdfPath]);
    }

    const { data } = supabase.storage.from("seminar-pdfs").getPublicUrl(path);
    updates.pdf_path = path;
    updates.pdf_url = data.publicUrl;
  }

  const { error } = await supabase.from("sessions").update(updates).eq("id", sessionId);
  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath(`/sessions/${sessionId}`);
  revalidatePath(`/sessions/${sessionId}/edit`);
  redirect(`/sessions/${sessionId}`);
}

export async function createNote(formData: FormData) {
  const supabase = getSupabase();
  const sessionId = String(formData.get("session_id") || "");
  const pageValue = String(formData.get("page_number") || "");

  const { error } = await supabase.from("notes").insert({
    session_id: sessionId,
    page_number: pageValue ? Number(pageValue) : null,
    question: String(formData.get("question") || ""),
    answer: String(formData.get("answer") || "") || null,
    my_note: String(formData.get("my_note") || "") || null,
    tags: splitTags(formData.get("tags")),
    is_important: formData.get("is_important") === "on",
    is_before_talk: formData.get("is_before_talk") === "on"
  });

  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath(`/sessions/${sessionId}`);
  redirect(`/sessions/${sessionId}`);
}

export async function deleteNote(formData: FormData) {
  const supabase = getSupabase();
  const noteId = String(formData.get("note_id") || "");
  const sessionId = String(formData.get("session_id") || "");

  const { error } = await supabase.from("notes").delete().eq("id", noteId);
  if (error) throw new Error(error.message);

  revalidatePath("/");
  if (sessionId) revalidatePath(`/sessions/${sessionId}`);
}

export async function deleteSession(formData: FormData) {
  const supabase = getSupabase();
  const sessionId = String(formData.get("session_id") || "");
  const pdfPath = String(formData.get("pdf_path") || "");

  if (pdfPath) {
    await supabase.storage.from("seminar-pdfs").remove([pdfPath]);
  }

  const { error } = await supabase.from("sessions").delete().eq("id", sessionId);
  if (error) throw new Error(error.message);

  revalidatePath("/");
  redirect("/");
}
