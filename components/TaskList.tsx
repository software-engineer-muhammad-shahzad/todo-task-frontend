'use client';

import type { Task } from '@/lib/api';
import type { View } from './FilterTabs';
import TaskItem from './TaskItem';

type Props = {
  tasks: Task[];
  view: View;
  loading: boolean;
  loadError: string;
  busyIds: ReadonlySet<number>;
  onRetry: () => void;
  onToggle: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
};

export default function TaskList({ tasks, view, loading, loadError, busyIds, onRetry, ...handlers }: Props) {
  if (loading) {
    return (
      <ul aria-busy="true" aria-label="Loading tasks">
        {[0, 1, 2].map((i) => (
          <li key={i} className="skeleton" aria-hidden="true">
            <span className="sk-box" />
            <div className="body">
              <span className="sk-line" style={{ width: '55%' }} />
              <span className="sk-line" style={{ width: '30%' }} />
            </div>
          </li>
        ))}
      </ul>
    );
  }

  if (loadError) {
    return (
      <div className="msg" role="alert">
        <p className="error-text">{loadError}</p>
        <button type="button" onClick={onRetry}>Try again</button>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="msg">
        {view === 'completed' ? 'No completed tasks yet.' : 'No tasks yet. Add one above!'}
      </div>
    );
  }

  return (
    <ul>
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} busy={busyIds.has(task.id)} {...handlers} />
      ))}
    </ul>
  );
}
