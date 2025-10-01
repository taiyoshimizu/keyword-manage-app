'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import type { Pillar } from '@/types';

export default function Home() {
  const [pillars, setPillars] = useState<Pillar[]>([]);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');

  const load = async () => {
    const { data } = await api.get('/api/pillars');
    setPillars(data);
  };
  useEffect(() => { load(); }, []);

  const create = async () => {
    if (!title) return;
    await api.post('/api/pillars', { title, description: desc });
    setTitle(''); setDesc('');
    load();
  };

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Topic Cluster Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 border rounded-xl space-y-3">
          <h2 className="font-semibold">Create Pillar</h2>
          <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Pillar title"
                 className="w-full border rounded px-3 py-2" />
          <textarea value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Description"
                 className="w-full border rounded px-3 py-2" />
          <button onClick={create} className="px-4 py-2 rounded bg-black text-white">Add</button>
        </div>

        {pillars.map(p => (
          <Link key={p._id} href={`/pillars/${p._id}`} className="p-4 border rounded-xl hover:shadow">
            <div className="font-semibold">{p.title}</div>
            <div className="text-sm text-gray-600">{p.description}</div>
            <div className="mt-2 text-sm">
              Progress: {p.progress?.published || 0}/{p.progress?.total || 0}
            </div>
            <div className="w-full h-2 bg-gray-200 rounded mt-1">
              <div className="h-2 bg-green-500 rounded"
                   style={{ width: `${((p.progress?.published||0)/(p.progress?.total||1))*100}%` }} />
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
