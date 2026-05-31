import { getSupabase, Note, Seminar, Session, SessionWithCounts } from "./supabase";

const initialSeminars = [
  {
    name: "研究ゼミ",
    description: "研究テーマの議論、進捗、関連論文の理解メモを蓄積します。",
    color: "#22d3ee"
  },
  {
    name: "輪読ゼミA",
    description: "理論・数理最適化・基礎寄りの輪読メモをまとめます。",
    color: "#a78bfa"
  },
  {
    name: "輪読ゼミB",
    description: "機械学習モデル、システム、応用寄りの輪読メモをまとめます。",
    color: "#38bdf8"
  }
];

export async function getSeminars() {
  const supabase = getSupabase();
  const { data, error } = await supabase.from("seminars").select("*").order("created_at");
  if (error) throw new Error(error.message);
  if (data.length) return uniqueSeminars(data as Seminar[]);

  const { data: inserted, error: insertError } = await supabase
    .from("seminars")
    .insert(initialSeminars)
    .select("*")
    .order("created_at");

  if (insertError) return [];
  return uniqueSeminars(inserted as Seminar[]);
}

function uniqueSeminars(seminars: Seminar[]) {
  const seen = new Set<string>();
  return seminars.filter((seminar) => {
    if (seen.has(seminar.name)) return false;
    seen.add(seminar.name);
    return true;
  });
}

export async function getSessions() {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("sessions")
    .select("*, seminar:seminars(id,name,color)")
    .order("date", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);

  const { data: notes, error: noteError } = await supabase
    .from("notes")
    .select("session_id,is_important,is_before_talk");
  if (noteError) throw new Error(noteError.message);

  return (data as SessionWithCounts[]).map((session) => {
    const ownNotes = notes.filter((note) => note.session_id === session.id);
    return {
      ...session,
      notes: [{ count: ownNotes.length }],
      important_notes: [{ count: ownNotes.filter((note) => note.is_important).length }],
      before_talk_notes: [{ count: ownNotes.filter((note) => note.is_before_talk).length }]
    };
  });
}

export async function getSession(id: string) {
  const { data, error } = await getSupabase()
    .from("sessions")
    .select("*, seminar:seminars(id,name,color)")
    .eq("id", id)
    .single();
  if (error) throw new Error(error.message);
  return data as Session & { seminar: Pick<Seminar, "id" | "name" | "color"> };
}

export async function getNotes(sessionId?: string) {
  let query = getSupabase()
    .from("notes")
    .select("*, session:sessions(id,title,paper_title, seminar:seminars(id,name,color))")
    .order("created_at", { ascending: false });

  if (sessionId) query = query.eq("session_id", sessionId);

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data as (Note & {
    session: Session & { seminar: Pick<Seminar, "id" | "name" | "color"> };
  })[];
}

export async function searchAll(query: string, filter?: string) {
  const supabase = getSupabase();
  const term = query.trim();
  const sessionsQuery = supabase
    .from("sessions")
    .select("*, seminar:seminars(id,name,color)")
    .or(`title.ilike.%${term}%,paper_title.ilike.%${term}%,paper_authors.ilike.%${term}%,summary.ilike.%${term}%`)
    .limit(20);

  let notesQuery = supabase
    .from("notes")
    .select("*, session:sessions(id,title,paper_title, seminar:seminars(id,name,color))")
    .or(`question.ilike.%${term}%,answer.ilike.%${term}%,my_note.ilike.%${term}%,tags.cs.{${term}}`)
    .limit(40);

  if (filter === "important") notesQuery = notesQuery.eq("is_important", true);
  if (filter === "before") notesQuery = notesQuery.eq("is_before_talk", true);

  const [sessions, notes] = await Promise.all([sessionsQuery, notesQuery]);
  if (sessions.error) throw new Error(sessions.error.message);
  if (notes.error) throw new Error(notes.error.message);

  return {
    sessions: (term ? sessions.data : []) as SessionWithCounts[],
    notes: (term || filter ? notes.data : []) as (Note & {
      session: Session & { seminar: Pick<Seminar, "id" | "name" | "color"> };
    })[]
  };
}
