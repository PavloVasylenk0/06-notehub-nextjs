import { fetchNoteById } from "@/lib/api";
import NoteDetailsClient from "./NoteDetails.client";
import type { Note } from "@/types/note";

interface PageParams {
  params: {
    id: string;
  };
}

export default async function NoteDetailsPage({ params }: PageParams) {
  if (!params?.id) {
    throw new Error("Note ID is missing");
  }

  const note: Note = await fetchNoteById(params.id);

  return <NoteDetailsClient note={note} />;
}
