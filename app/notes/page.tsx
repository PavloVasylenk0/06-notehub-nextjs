import NotesClient from "./Notes.client";
import { fetchNotes } from "@/lib/api";

export default async function NotesPage() {
  const initialData = await fetchNotes({ page: 1, perPage: 12 });

  return <NotesClient initialData={initialData} />;
}
