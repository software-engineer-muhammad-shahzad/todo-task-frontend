'use client';

export type View = 'open' | 'completed';

type Props = {
  view: View;
  counts: Record<View, number>;
  onChange: (view: View) => void;
};

const TABS: { key: View; label: string }[] = [
  { key: 'open', label: 'All' },
  { key: 'completed', label: 'Completed' },
];

export default function FilterTabs({ view, counts, onChange }: Props) {
  return (
    <div className="filters" role="group" aria-label="Filter tasks">
      {TABS.map((tab) => (
        <button key={tab.key} aria-pressed={view === tab.key} onClick={() => onChange(tab.key)}>
          {tab.label}
          <span className="count">{counts[tab.key]}</span>
        </button>
      ))}
    </div>
  );
}
