'use client'

import { useQuery } from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api";
import { useParams } from "next/navigation";
import css from "./NoteDetails.module.css";
import type { Note } from "@/types/note";

interface NoteDetailsClientProps {
  initialNote?: Note | null;
}

export default function NoteDetailsClient({
  initialNote = null,
}: NoteDetailsClientProps) {
  const params = useParams();
  const noteId = getValidNoteId(params?.id);

  const {
    data: note,
    isLoading,
    isError,
    error,
  } = useQuery<Note, Error>({
    queryKey: ["note", noteId],
    queryFn: () => {
      if (!noteId) throw new Error("Note ID is required");
      return fetchNoteById(noteId);
    },
    enabled: !!noteId,
    initialData: initialNote ?? undefined,
    staleTime: 60 * 1000,
    retry: 2,
  });

  if (!noteId) {
    return <div className={css.error}>Invalid note ID</div>;
  }

  if (isLoading) {
    return <div className={css.loading}>Loading note details...</div>;
  }

  if (isError) {
    return (
      <div className={css.error}>
        Failed to load note: {error?.message || "Unknown error"}
      </div>
    );
  }

  if (!note) {
    return <div className={css.error}>Note not found</div>;
  }

  return (
    <div className={css.container}>
      <div className={css.item}>
        <div className={css.header}>
          <h2>{note.title}</h2>
          <span className={css.tag}>{note.tag}</span>
        </div>
        <p className={css.content}>{note.content}</p>
        <div className={css.footer}>
          <p className={css.date}>
            Created: {new Date(note.createdAt).toLocaleDateString()}
          </p>
          <p className={css.date}>
            Last updated: {new Date(note.updatedAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}

function getValidNoteId(id: unknown): string | undefined {
  if (typeof id === "string") return id;
  if (Array.isArray(id) && id.length > 0) return id[0];
  return undefined;
}