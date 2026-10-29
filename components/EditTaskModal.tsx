'use client';

import { useState } from 'react';
import type { Task } from '@/lib/api';
import Modal from './Modal';
import Spinner from './Spinner';

type Props = {
  task: Task;
  onSave: (title: string, description: string) => Promise<unknown>;
  onClose: () => void;
};

export default function EditTaskModal({ task, onSave, onClose }: Props) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await onSave(title, description);
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal title="Edit task" onClose={onClose}>
      <form className="modal-form" onSubmit={submit}>
        {error && <p className="error" role="alert">{error}</p>}
        <label>
          Title
          <input
            type="text"
            value={title}
            maxLength={200}
            required
            autoFocus
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>
        <label>
          Description
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        </label>
        <div className="modal-actions">
          <button type="button" onClick={onClose}>Cancel</button>
          <button type="submit" className="primary" disabled={saving}>
            {saving && <Spinner />}
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
