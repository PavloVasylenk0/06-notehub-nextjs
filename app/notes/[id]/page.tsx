import { Metadata } from "next";
import { fetchNoteById } from "@/lib/api";
import NoteDetailsClient from "./NoteDetails.client";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const note = await fetchNoteById(id);
    return {
      title: note.title || "Note Details",
      description: note.content.substring(0, 160),
    };
  } catch {
    return {
      title: "Note not found",
      description: "The requested note does not exist.",
    };
  }
}

export default async function NoteDetailsPage({ params }: PageProps) {
  const { id } = await params;

  try {
    const note = await fetchNoteById(id);
    return <NoteDetailsClient initialNote={note} />;
  } catch {
    notFound();
  }
}
