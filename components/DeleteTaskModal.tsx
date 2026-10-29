'use client';

import { useState } from 'react';
import type { Task } from '@/lib/api';
import Modal from './Modal';
import Spinner from './Spinner';

type Props = {
  task: Task;
  onConfirm: () => Promise<unknown>;
  onClose: () => void;
};

export default function DeleteTaskModal({ task, onConfirm, onClose }: Props) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  const confirmDelete = async () => {
    setDeleting(true);
    setError('');
    try {
      await onConfirm();
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Modal title="Delete task?" onClose={onClose}>
      <p className="modal-text">
        <strong>{task.title}</strong> will be permanently deleted. This can&apos;t be undone.
      </p>
      {error && <p className="error" role="alert">{error}</p>}
      <div className="modal-actions">
        <button type="button" onClick={onClose} autoFocus>Cancel</button>
        <button type="button" className="danger-solid" onClick={confirmDelete} disabled={deleting}>
          {deleting && <Spinner />}
          {deleting ? 'Deleting…' : 'Delete'}
        </button>
      </div>
    </Modal>
  );
}
