'use client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import type { Keyword, Pillar } from '@/types';
import GraphView from '@/components/GraphView';
import DragAssign from '@/components/DragAssign';

export default function PillarPage() {
  const { id } = useParams<{ id: string }>();
  const [pillar, setPillar] = useState<Pillar | null>(null);
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [term, setTerm] = useState('');
  const [unassigned, setUnassigned] = useState<Keyword[]>([]);

  const load = async () => {
    const { data } = await api.get(`/api/pillars/${id}`);
    setPillar(data.pillar); setKeywords(data.keywords);
    const all = await api.get('/api/keywords');
    setUnassigned(all.data.filter((k: Keyword) => !k.pillarId));
  };
  useEffect(() => { load(); }, [id]);

  const addKeyword = async () => {
    if (!term) return;
    await api.post('/api/keywords', { term, status: 'todo', pillarId: id });
    setTerm(''); load();
  };

  const setStatus = async (kid: string, status: 'todo'|'writing'|'published') => {
    await api.put(`/api/keywords/${kid}`, { status });
    load();
  };

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">{pillar?.title}</h1>
      <p className="text-gray-600">{pillar?.description}</p>

      {pillar && (
        <div className="space-y-4">
          <GraphView pillar={pillar} keywords={keywords} />
          <DragAssign
            unassigned={unassigned.map(({ _id, term }) => ({ _id, term }))}
            pillarId={pillar._id}
            reload={load}
          />
        </div>
      )} 
      <div className="flex gap-2 items-center">
        <input value={term} onChange={e=>setTerm(e.target.value)} placeholder="Add keyword"
               className="border rounded px-3 py-2" />
        <button onClick={addKeyword} className="px-4 py-2 rounded bg-black text-white">Add</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {(['todo','writing','published'] as const).map(st => (
          <div key={st} className="p-3 border rounded-xl">
            <div className="font-semibold capitalize">{st}</div>
            <div className="space-y-2 mt-2 min-h-[120px]">
              {keywords.filter(k=>k.status===st).map(k => (
                <div key={k._id}
                     className={`p-3 rounded border ${st==='todo'?'bg-gray-50':st==='writing'?'bg-yellow-50':'bg-green-50'}`}>
                  <div className="font-medium">{k.term}</div>
                  <div className="text-xs text-gray-500">SV:{k.searchVolume} / DIF:{k.difficulty}</div>
                  <div className="flex gap-2 mt-2">
                    {(['todo','writing','published'] as const).map(s2 => (
                      <button key={s2} onClick={()=>setStatus(k._id, s2)}
                              className="text-xs border rounded px-2 py-1">{s2}</button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
