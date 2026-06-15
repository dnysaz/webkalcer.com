import { getAllProjects } from "@/lib/supabase/queries";
import { deleteProject } from "./actions";
import PageToast from "@/components/PageToast";
import Link from "next/link";
import ProjectCard from "./ProjectCard";

export default async function ProjectsPage({ searchParams }: { searchParams: Promise<{ toast?: string }> }) {
  const projects = await getAllProjects();
  const { toast } = await searchParams;

  return (
    <div className="px-4">
      <PageToast toast={toast} />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tighter text-dark">Projects</h1>
          <p className="mt-1 text-sm font-bold text-zinc-500">Manage your project tasks.</p>
        </div>
        <Link href="/dashboard/projects/new" className="rounded-full bg-pink px-6 py-2.5 text-sm font-bold text-white transition hover:bg-pink-dark">
          + New Project
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {projects.length === 0 && (
          <p className="col-span-full text-sm font-bold text-zinc-500">No projects yet. Create your first project!</p>
        )}
        {projects.map((p) => (
          <ProjectCard key={p.id} project={p} deleteAction={deleteProject} />
        ))}
      </div>
    </div>
  );
}
