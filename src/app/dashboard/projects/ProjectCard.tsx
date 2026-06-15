"use client";

import Link from "next/link";
import DeleteButton from "@/components/DeleteButton";

interface Project {
  id: string;
  name: string;
  description: string;
  created_at: string;
  tasks?: { count: number } | { count: number }[];
}

export default function ProjectCard({ project, deleteAction }: { project: Project; deleteAction: (id: string) => Promise<void> }) {
  const taskCount = Array.isArray(project.tasks)
    ? project.tasks[0]?.count ?? 0
    : (project.tasks as { count: number } | undefined)?.count ?? 0;

  return (
    <div className="group relative rounded-xl border-2 border-zinc-200 bg-white p-5 transition hover:border-pink/30">
      <Link href={`/dashboard/projects/${project.id}`} className="block min-h-[100px]">
        <h3 className="text-base font-black text-dark">{project.name}</h3>
        {project.description && (
          <p className="mt-1 text-sm font-bold text-zinc-500">{project.description}</p>
        )}
        <div className="mt-2 flex items-center gap-3 text-xs font-bold text-zinc-400">
          <span>{new Date(project.created_at).toLocaleDateString("id-ID", { year: "numeric", month: "short", day: "numeric" })}</span>
          <span>{taskCount} task{taskCount !== 1 ? "s" : ""}</span>
        </div>
      </Link>
      <div className="absolute right-3 top-3">
        <DeleteButton id={project.id} label="project" action={deleteAction} />
      </div>
    </div>
  );
}
