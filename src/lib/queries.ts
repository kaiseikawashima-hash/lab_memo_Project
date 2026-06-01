import { getSupabase, Note, Paper, Seminar, Session, SessionWithCounts, TranslationNote } from "./supabase";
import { canonicalSeminarName, seminarDescription } from "./utils";

const initialSeminars = [
  {
    name: "研究ゼミ",
    description: "研究テーマの議論、進捗、関連論文の理解メモを蓄積します。",
    color: "#22d3ee"
  },
  {
    name: "数理最適化ゼミ",
    description: "最適化理論、凸解析、数理モデルの輪読メモをまとめます。",
    color: "#a78bfa"
  },
  {
    name: "Python 機械学習ゼミ",
    description: "Python 実装、機械学習モデル、実験まわりの輪読メモをまとめます。",
    color: "#38bdf8"
  }
];

type NoteWithSession = Note & {
  session: Session & { seminar: Pick<Seminar, "id" | "name" | "color"> };
};

function isPhase2Missing(error: { code?: string; message?: string }) {
  return error.code === "42P01" || error.code === "42703" || /schema cache|papers|translation_notes|ai_one_liner|ai_summary|ai_tags|ai_keywords/i.test(error.message || "");
}

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
  return seminars.map(normalizeSeminar).filter((seminar) => {
    const canonicalName = canonicalSeminarName(seminar.name);
    if (seen.has(canonicalName)) return false;
    seen.add(canonicalName);
    return true;
  });
}

function normalizeSeminar<T extends Pick<Seminar, "name" | "description" | "color">>(seminar: T) {
  const name = canonicalSeminarName(seminar.name);
  return {
    ...seminar,
    name,
    description: seminarDescription(name, seminar.description),
    color: seminar.color || (name === "数理最適化ゼミ" ? "#a78bfa" : name === "Python 機械学習ゼミ" ? "#38bdf8" : "#22d3ee")
  };
}

function normalizeSessionSeminar<T extends { seminar?: Pick<Seminar, "id" | "name" | "color"> | null }>(value: T) {
  if (!value.seminar) return value;
  return {
    ...value,
    seminar: normalizeSeminar({ ...value.seminar, description: null })
  };
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

  return (data as SessionWithCounts[]).map((rawSession) => {
    const session = normalizeSessionSeminar(rawSession);
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
  return normalizeSessionSeminar(data as Session & { seminar: Pick<Seminar, "id" | "name" | "color"> });
}

export async function getNotes(sessionId?: string) {
  let query = getSupabase()
    .from("notes")
    .select("*, session:sessions(id,title,paper_title, seminar:seminars(id,name,color))")
    .order("created_at", { ascending: false });

  if (sessionId) query = query.eq("session_id", sessionId);

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data as NoteWithSession[]).map((note) => ({
    ...note,
    session: normalizeSessionSeminar(note.session)
  }));
}

export async function searchAll(query: string, filter?: string) {
  const supabase = getSupabase();
  const term = query.trim();
  const sessionsQuery = supabase
    .from("sessions")
    .select("*, seminar:seminars(id,name,color)")
    .or(`title.ilike.%${term}%,paper_title.ilike.%${term}%,paper_authors.ilike.%${term}%,summary.ilike.%${term}%,ai_one_liner.ilike.%${term}%,ai_summary.ilike.%${term}%`)
    .limit(20);

  const papersQuery = supabase
    .from("papers")
    .select("*")
    .or(`title.ilike.%${term}%,authors.ilike.%${term}%,venue.ilike.%${term}%,abstract.ilike.%${term}%,one_line_summary.ilike.%${term}%,japanese_summary.ilike.%${term}%,tags.cs.{${term}}`)
    .limit(20);

  let notesQuery = supabase
    .from("notes")
    .select("*, session:sessions(id,title,paper_title, seminar:seminars(id,name,color))")
    .or(`question.ilike.%${term}%,answer.ilike.%${term}%,my_note.ilike.%${term}%,tags.cs.{${term}}`)
    .limit(40);

  if (filter === "important") notesQuery = notesQuery.eq("is_important", true);
  if (filter === "before") notesQuery = notesQuery.eq("is_before_talk", true);

  const [sessions, papers, notes] = await Promise.all([sessionsQuery, papersQuery, notesQuery]);
  let sessionResults = sessions;
  if (sessions.error && isPhase2Missing(sessions.error)) {
    sessionResults = await supabase
      .from("sessions")
      .select("*, seminar:seminars(id,name,color)")
      .or(`title.ilike.%${term}%,paper_title.ilike.%${term}%,paper_authors.ilike.%${term}%,summary.ilike.%${term}%`)
      .limit(20);
  }
  if (sessionResults.error) throw new Error(sessionResults.error.message);
  if (papers.error && !isPhase2Missing(papers.error)) throw new Error(papers.error.message);
  if (notes.error) throw new Error(notes.error.message);

  return {
    sessions: (term ? (sessionResults.data as SessionWithCounts[]).map(normalizeSessionSeminar) : []) as SessionWithCounts[],
    papers: (term && !papers.error ? papers.data as Paper[] : []) as Paper[],
    notes: (term || filter ? (notes.data as NoteWithSession[]).map((note) => ({ ...note, session: normalizeSessionSeminar(note.session) })) : []) as NoteWithSession[]
  };
}

export async function getPapers() {
  const supabase = getSupabase();
  const { data, error } = await supabase.from("papers").select("*").order("created_at", { ascending: false });
  if (error) {
    if (isPhase2Missing(error)) return [];
    throw new Error(error.message);
  }

  const [sessions, notes] = await Promise.all([getSessions(), getNotes()]);

  return (data as Paper[]).map((paper) => {
    const relatedSessions = sessions.filter((session) => session.paper_id === paper.id || session.paper_title === paper.title);
    const relatedSessionIds = new Set(relatedSessions.map((session) => session.id));
    return {
      ...paper,
      related_sessions_count: relatedSessions.length,
      related_notes_count: notes.filter((note) => relatedSessionIds.has(note.session_id)).length
    };
  });
}

export async function getPaper(id: string) {
  const [papers, sessions, notes] = await Promise.all([getPapers(), getSessions(), getNotes()]);
  const paper = papers.find((item) => item.id === id);
  if (!paper) throw new Error("Paper not found");
  const relatedSessions = sessions.filter((session) => session.paper_id === paper.id || session.paper_title === paper.title);
  const sessionIds = new Set(relatedSessions.map((session) => session.id));
  return {
    paper,
    sessions: relatedSessions,
    notes: notes.filter((note) => sessionIds.has(note.session_id))
  };
}

export async function getTranslationNotes(sessionId: string) {
  const { data, error } = await getSupabase()
    .from("translation_notes")
    .select("*")
    .eq("session_id", sessionId)
    .order("created_at", { ascending: false });
  if (error) {
    if (isPhase2Missing(error)) return [];
    throw new Error(error.message);
  }
  return data as TranslationNote[];
}

export async function getAllTags() {
  const [papers, sessions, notes] = await Promise.all([getPapers(), getSessions(), getNotes()]);
  const map = new Map<string, { tag: string; papers: number; sessions: number; notes: number }>();
  const touch = (tag: string) => {
    const normalized = tag.trim();
    if (!normalized) return null;
    if (!map.has(normalized)) map.set(normalized, { tag: normalized, papers: 0, sessions: 0, notes: 0 });
    return map.get(normalized)!;
  };

  papers.forEach((paper) => paper.tags?.forEach((tag) => {
    const item = touch(tag);
    if (item) item.papers++;
  }));
  sessions.forEach((session) => [...(session.ai_tags || []), ...(session.ai_keywords || [])].forEach((tag) => {
    const item = touch(tag);
    if (item) item.sessions++;
  }));
  notes.forEach((note) => note.tags?.forEach((tag) => {
    const item = touch(tag);
    if (item) item.notes++;
  }));

  return Array.from(map.values()).sort((a, b) => b.papers + b.sessions + b.notes - (a.papers + a.sessions + a.notes));
}

export async function getTagDetail(tag: string) {
  const decoded = decodeURIComponent(tag);
  const [papers, sessions, notes] = await Promise.all([getPapers(), getSessions(), getNotes()]);
  return {
    tag: decoded,
    papers: papers.filter((paper) => paper.tags?.includes(decoded)),
    sessions: sessions.filter((session) => session.ai_tags?.includes(decoded) || session.ai_keywords?.includes(decoded)),
    notes: notes.filter((note) => note.tags?.includes(decoded))
  };
}

export async function getKnowledgeMap() {
  const tags = await getAllTags();
  const topTags = tags.slice(0, 24);
  return Promise.all(topTags.map((item) => getTagDetail(item.tag)));
}

export async function getRelatedNotes(sessionId: string) {
  const [currentNotes, allNotes] = await Promise.all([getNotes(sessionId), getNotes()]);
  const tags = new Set(currentNotes.flatMap((note) => note.tags || []));
  if (!tags.size) return [];
  return allNotes
    .filter((note) => note.session_id !== sessionId)
    .map((note) => ({
      note,
      score: (note.tags || []).filter((tag) => tags.has(tag)).length
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
    .map((item) => item.note);
}
