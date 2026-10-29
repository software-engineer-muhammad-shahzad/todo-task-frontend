'use client';

import { useState } from 'react';
import Spinner from './Spinner';

type Props = {
  onAdd: (title: string, description: string) => Promise<unknown>;
};

export default function AddTaskForm({ onAdd }: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (adding) return;
    setAdding(true);
    setError('');
    try {
      await onAdd(title, description);
      setTitle('');
      setDescription('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not add the task');
    } finally {
      setAdding(false);
    }
  };

  return (
    <form className="add" onSubmit={submit}>
      {error && <p className="error" role="alert">{error}</p>}
      <input
        type="text"
        placeholder="What needs to be done?"
        aria-label="Task title"
        maxLength={200}
        required
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Description (optional)"
        aria-label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button className="primary" type="submit" disabled={adding} aria-busy={adding}>
        {adding && <Spinner />}
        {adding ? 'Adding…' : 'Add task'}
      </button>
    </form>
  );
}
