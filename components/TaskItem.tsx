'use client';

import type { Task } from '@/lib/api';

type Props = {
  task: Task;
  busy: boolean;
  onToggle: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });

export default function TaskItem({ task, busy, onToggle, onEdit, onDelete }: Props) {
  return (
    <li className={task.completed ? 'done' : ''}>
      <input
        type="checkbox"
        checked={task.completed}
        disabled={busy}
        onChange={() => onToggle(task)}
        aria-label={task.completed ? `Mark "${task.title}" as not completed` : `Mark "${task.title}" as completed`}
      />
      <div className="body">
        <div className="title">{task.title}</div>
        {task.description && <div className="desc">{task.description}</div>}
        <time className="meta" dateTime={task.created_at}>Added {formatDate(task.created_at)}</time>
      </div>
      <div className="actions">
        <button
          type="button"
          onClick={() => onEdit(task)}
          disabled={task.completed || busy}
          title={task.completed ? 'Un-tick the task to edit it' : undefined}
        >
          Edit
        </button>
        <button type="button" className="danger" onClick={() => onDelete(task)} disabled={busy}>
          Delete
        </button>
      </div>
    </li>
  );
}
