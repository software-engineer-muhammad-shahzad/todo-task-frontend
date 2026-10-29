export type Task = {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
};

export type TaskChanges = Partial<Pick<Task, 'title' | 'description' | 'completed'>>;

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:8001/api';

export class ApiError extends Error {
  constructor(message: string, readonly status?: number) {
    super(message);
    this.name = 'ApiError';
  }
}

/** Turns a DRF error body ({detail}, {field: [msgs]}, or {non_field_errors}) into one sentence. */
function messageFrom(data: unknown, status: number): string {
  if (data && typeof data === 'object') {
    const body = data as Record<string, unknown>;
    if (typeof body.detail === 'string') return body.detail;
    const parts = Object.values(body).flat().filter((v): v is string => typeof v === 'string');
    if (parts.length) return parts.join(' ');
  }
  return `Request failed (${status})`;
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      ...init,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    throw new ApiError('Cannot reach the server. Check that the backend is running.');
  }
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new ApiError(messageFrom(data, res.status), res.status);
  }
  return res.status === 204 ? (null as T) : res.json();
}

export const getTasks = () => request<Task[]>('/tasks');

export const createTask = (title: string, description: string) =>
  request<Task>('/tasks', { method: 'POST', body: JSON.stringify({ title, description }) });

export const updateTask = (id: number, changes: TaskChanges) =>
  request<Task>(`/tasks/${id}`, { method: 'PATCH', body: JSON.stringify(changes) });

export const deleteTask = (id: number) => request<null>(`/tasks/${id}`, { method: 'DELETE' });
