'use client';
import { useState } from 'react';
import { api } from '@/lib/api';

export default function CsvImport({ onDone }: { onDone?: () => void }) {
  const [text, setText] = useState(
    'term,searchVolume,difficulty,status,pillarId\nkeyword a,100,10,todo,\nkeyword b,200,30,writing,'
  );
  const [busy, setBusy] = useState(false);

  const upload = async () => {
    setBusy(true);
    try {
      const [header, ...lines] = text.trim().split(/\r?\n/);
      const cols = header.split(',');
      const rows = lines
        .filter(Boolean)
        .map((l) => l.split(','))
        .map((arr) => Object.fromEntries(arr.map((v, i) => [cols[i], v])));
      await api.post('/api/import/csv', { rows });
      alert(`Imported ${rows.length} rows`);
      onDone?.();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="p-4 border rounded-xl space-y-2">
      <div className="font-semibold">CSV Import</div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full h-40 border rounded p-2"
      />
      <button
        onClick={upload}
        disabled={busy}
        className="px-4 py-2 rounded bg-black text-white disabled:opacity-50"
      >
        {busy ? 'Importing…' : 'Import'}
      </button>
      <p className="text-xs text-gray-500">
        1行目をヘッダーとして扱います。列: term,searchVolume,difficulty,status,pillarId
      </p>
    </div>
  );
}

