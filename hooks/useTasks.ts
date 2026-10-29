'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Task, TaskChanges, createTask, deleteTask, getTasks, updateTask } from '@/lib/api';

// Keep the skeleton on screen long enough to read as a loading state instead of a flicker.
const MIN_SKELETON_MS = 600;
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const newestFirst = (a: Task, b: Task) => b.id - a.id;

/**
 * Owns the task list: loading, create/update/delete against the API, and keeping the
 * local list in sync. Mutations throw on failure so callers (forms, modals) can show
 * the error where the user is looking; successes show a toast.
 */
export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [busyIds, setBusyIds] = useState<ReadonlySet<number>>(new Set());

  // State starts as "loading", so it is only set once the request settles.
  const fetchTasks = useCallback(
    () =>
      Promise.all([getTasks(), wait(MIN_SKELETON_MS)])
        .then(([list]) => {
          setTasks(list);
          setLoadError('');
        })
        .catch((e) => setLoadError(e instanceof Error ? e.message : 'Could not load tasks'))
        .finally(() => setLoading(false)),
    [],
  );

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const reload = useCallback(() => {
    setLoading(true);
    return fetchTasks();
  }, [fetchTasks]);

  const setBusy = (id: number, busy: boolean) =>
    setBusyIds((prev) => {
      const next = new Set(prev);
      if (busy) next.add(id);
      else next.delete(id);
      return next;
    });

  const add = useCallback(async (title: string, description: string) => {
    const task = await createTask(title, description);
    setTasks((prev) => [task, ...prev]);
    toast.success('Task added successfully');
  }, []);

  const update = useCallback(async (id: number, changes: TaskChanges, message: string) => {
    setBusy(id, true);
    try {
      const task = await updateTask(id, changes);
      setTasks((prev) => prev.map((t) => (t.id === id ? task : t)));
      toast.success(message);
    } finally {
      setBusy(id, false);
    }
  }, []);

  const remove = useCallback(async (id: number) => {
    await deleteTask(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
    toast.success('Task deleted');
  }, []);

  const open = useMemo(() => tasks.filter((t) => !t.completed).sort(newestFirst), [tasks]);
  const completed = useMemo(() => tasks.filter((t) => t.completed).sort(newestFirst), [tasks]);

  return { open, completed, loading, loadError, busyIds, reload, add, update, remove };
}
