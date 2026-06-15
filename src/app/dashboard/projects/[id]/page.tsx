import { getProjectWithTasks } from "@/lib/supabase/queries";
import { notFound } from "next/navigation";
import KanbanBoard from "./KanbanBoard";
import PageToast from "@/components/PageToast";

export default async function ProjectDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ toast?: string }>;
}) {
  const { id } = await params;
  const project = await getProjectWithTasks(id);
  if (!project) notFound();

  const { toast } = await searchParams;

  return (
    <>
      <PageToast toast={toast} />
      <KanbanBoard project={project} />
    </>
  );
}
