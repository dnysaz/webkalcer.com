"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function createProject(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;

  const { data, error } = await supabase
    .from("projects")
    .insert({ name, description })
    .select("id")
    .single();

  if (error) return { error: error.message };

  revalidatePath("/dashboard/projects");
  redirect(`/dashboard/projects/${data.id}`);
}

export async function deleteProject(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/projects");
}

export async function createTask(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const rawProjectId = formData.get("project_id");
  const rawName = formData.get("name");
  const projectId = typeof rawProjectId === "string" ? rawProjectId : "";
  const name = typeof rawName === "string" ? rawName : "";
  const detail = typeof formData.get("detail") === "string" ? (formData.get("detail") as string) : "";
  const status = typeof formData.get("status") === "string" ? (formData.get("status") as string) : "Started";
  const dueDate = typeof formData.get("due_date") === "string" ? (formData.get("due_date") as string) : "";

  if (!projectId) return { error: "Project ID is required" };
  if (!name.trim()) return { error: "Task name is required" };

  const { data: tasks } = await supabase
    .from("tasks")
    .select("sort_order")
    .eq("project_id", projectId)
    .eq("status", status)
    .order("sort_order", { ascending: false })
    .limit(1);

  const nextSort = (tasks?.[0]?.sort_order ?? -1) + 1;

  const { error } = await supabase.from("tasks").insert({
    project_id: projectId,
    name,
    detail: detail || "",
    status,
    due_date: dueDate || null,
    sort_order: nextSort,
  });

  if (error) return { error: error.message };
  revalidatePath(`/dashboard/projects/${projectId}`);
  return { success: true };
}

export async function updateTask(id: string, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const rawName = formData.get("name");
  const name = typeof rawName === "string" ? rawName : "";
  const detail = typeof formData.get("detail") === "string" ? (formData.get("detail") as string) : "";
  const status = typeof formData.get("status") === "string" ? (formData.get("status") as string) : "";
  const dueDate = typeof formData.get("due_date") === "string" ? (formData.get("due_date") as string) : "";

  if (!name.trim()) return { error: "Task name is required" };

  const updates: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };
  updates.name = name;
  updates.detail = detail;
  if (status) updates.status = status;
  updates.due_date = dueDate || null;

  const { error } = await supabase.from("tasks").update(updates).eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/dashboard/projects", "layout");
  return { success: true };
}

export async function updateTaskStatus(id: string, status: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { error } = await supabase
    .from("tasks")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/dashboard/projects", "layout");
  return { success: true };
}

export async function deleteTask(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase.from("tasks").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/projects", "layout");
}

export async function getTaskById(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("tasks")
    .select("*")
    .eq("id", id)
    .single();

  return data;
}

export async function createColumn(projectId: string, name: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { data: existing } = await supabase
    .from("project_columns")
    .select("id")
    .eq("project_id", projectId)
    .eq("name", name)
    .maybeSingle();

  if (existing) return { error: "Column already exists" };

  const { data: maxSort } = await supabase
    .from("project_columns")
    .select("sort_order")
    .eq("project_id", projectId)
    .order("sort_order", { ascending: false })
    .limit(1);

  const nextSort = (maxSort?.[0]?.sort_order ?? -1) + 1;

  const { error } = await supabase.from("project_columns").insert({
    project_id: projectId,
    name,
    sort_order: nextSort,
  });

  if (error) return { error: error.message };
  revalidatePath(`/dashboard/projects/${projectId}`);
  return { success: true };
}

export async function deleteColumn(projectId: string, name: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  // Delete all tasks in this column first
  await supabase.from("tasks").delete().eq("project_id", projectId).eq("status", name);

  // Then delete the column
  const { error } = await supabase
    .from("project_columns")
    .delete()
    .eq("project_id", projectId)
    .eq("name", name);

  if (error) throw new Error(error.message);
  revalidatePath(`/dashboard/projects/${projectId}`);
}

export async function reorderTasks(updates: { id: string; status?: string; sort_order: number }[]) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const results = await Promise.allSettled(
    updates.map(({ id, status, sort_order }) => {
      const data: Record<string, unknown> = {
        sort_order,
        updated_at: new Date().toISOString(),
      };
      if (status) data.status = status;
      return supabase.from("tasks").update(data).eq("id", id);
    })
  );

  const rejected = results.filter((r) => r.status === "rejected");
  if (rejected.length > 0) {
    const msg = (rejected[0] as PromiseRejectedResult).reason?.message || "Failed to reorder some tasks";
    return { error: msg };
  }

  revalidatePath("/dashboard/projects", "layout");
  return { success: true };
}
