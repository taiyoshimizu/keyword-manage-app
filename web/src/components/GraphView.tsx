'use client';
import React, { useMemo } from 'react';
import ReactFlow, { Background, Controls } from 'react-flow-renderer';
import type { Pillar, Keyword } from '@/types';

export default function GraphView({ pillar, keywords }:{ pillar:Pillar, keywords:Keyword[] }){
  const nodes = useMemo(()=>{
    const base = [{ id: pillar._id, data:{ label: pillar.title }, position:{ x: 0, y: 0 } }];
    const kNodes = keywords.map((k,i)=>({
      id: k._id, data:{ label: k.term },
      position:{ x: Math.cos(i)*200, y: Math.sin(i)*200 }
    }));
    return [...base, ...kNodes];
  },[pillar, keywords]);

  const edges = keywords.map(k => ({ id: `${pillar._id}-${k._id}`, source: pillar._id, target: k._id }));

  return (
    <div className="h-[400px] border rounded-xl">
      <ReactFlow nodes={nodes as any} edges={edges as any} fitView>
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
