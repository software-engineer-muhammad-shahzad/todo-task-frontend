import TaskApp from '@/components/TaskApp';

export default function Home() {
  return (
    <main>
      <h1>Task Manager</h1>
      <p className="subtitle">Plan it, do it, tick it off.</p>
      <TaskApp />
    </main>
  );
}
