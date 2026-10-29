'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { useTasks } from '@/hooks/useTasks';
import type { Task } from '@/lib/api';
import AddTaskForm from './AddTaskForm';
import DeleteTaskModal from './DeleteTaskModal';
import EditTaskModal from './EditTaskModal';
import FilterTabs, { View } from './FilterTabs';
import TaskList from './TaskList';

export default function TaskApp() {
  const { open, completed, loading, loadError, busyIds, reload, add, update, remove } = useTasks();
  const [view, setView] = useState<View>('open');
  const [editing, setEditing] = useState<Task | null>(null);
  const [deleting, setDeleting] = useState<Task | null>(null);

  const toggle = (task: Task) =>
    update(
      task.id,
      { completed: !task.completed },
      task.completed ? 'Task moved back to All' : 'Task marked as completed',
    ).catch((e) => toast.error(e instanceof Error ? e.message : 'Could not update the task'));

  return (
    <>
      <AddTaskForm onAdd={add} />

      <FilterTabs view={view} counts={{ open: open.length, completed: completed.length }} onChange={setView} />

      <TaskList
        tasks={view === 'open' ? open : completed}
        view={view}
        loading={loading}
        loadError={loadError}
        busyIds={busyIds}
        onRetry={reload}
        onToggle={toggle}
        onEdit={setEditing}
        onDelete={setDeleting}
      />

      {editing && (
        <EditTaskModal
          task={editing}
          onSave={(title, description) => update(editing.id, { title, description }, 'Task updated successfully')}
          onClose={() => setEditing(null)}
        />
      )}
      {deleting && (
        <DeleteTaskModal task={deleting} onConfirm={() => remove(deleting.id)} onClose={() => setDeleting(null)} />
      )}
    </>
  );
}
