import { createClient } from "@supabase/supabase-js";

export type Seminar = {
  id: string;
  name: string;
  description: string | null;
  color: string | null;
  created_at: string;
};

export type Session = {
  id: string;
  seminar_id: string;
  paper_id: string | null;
  title: string;
  session_number: number | null;
  date: string | null;
  speaker: string | null;
  paper_title: string | null;
  paper_authors: string | null;
  paper_url: string | null;
  summary: string | null;
  pdf_url: string | null;
  pdf_path: string | null;
  ai_one_liner: string | null;
  ai_summary: string | null;
  ai_tags: string[] | null;
  ai_keywords: string[] | null;
  created_at: string;
  updated_at: string;
};

export type Note = {
  id: string;
  session_id: string;
  page_number: number | null;
  question: string;
  answer: string | null;
  my_note: string | null;
  tags: string[] | null;
  is_important: boolean;
  is_before_talk: boolean;
  created_at: string;
  updated_at: string;
};

export type Paper = {
  id: string;
  title: string;
  authors: string | null;
  year: number | null;
  venue: string | null;
  url: string | null;
  abstract: string | null;
  one_line_summary: string | null;
  japanese_summary: string | null;
  tags: string[] | null;
  created_at: string;
  updated_at: string;
};

export type TranslationNote = {
  id: string;
  session_id: string;
  page_number: number | null;
  section_title: string | null;
  original_text: string | null;
  japanese_translation: string | null;
  my_comment: string | null;
  tags: string[] | null;
  created_at: string;
  updated_at: string;
};

export type SessionWithCounts = Session & {
  seminar?: Pick<Seminar, "id" | "name" | "color"> | null;
  notes?: { count: number }[];
  important_notes?: { count: number }[];
  before_talk_notes?: { count: number }[];
};

export function isSupabaseConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);
}

export function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");
  }

  return createClient(url, key);
}
