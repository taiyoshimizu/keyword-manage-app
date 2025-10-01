'use client';
import { useEffect, useMemo, useCallback } from 'react';
import ReactFlow, {
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  NodeChange,
  applyNodeChanges,
} from 'reactflow';
import 'reactflow/dist/style.css';
import type { Pillar, Keyword } from '@/types';

type PosMap = Record<string, { x: number; y: number }>;

export default function GraphView({ pillar, keywords }:{ pillar:Pillar, keywords:Keyword[] }){
  const storageKey = `rf-pos-${pillar._id}`;

  // 保存済み座標を取得
  const savedPos: PosMap = useMemo(() => {
    try { return JSON.parse(localStorage.getItem(storageKey) || '{}'); }
    catch { return {}; }
  }, [storageKey]);

  // 初期ノード
  const initialNodes: Node[] = useMemo(() => {
    const nodes: Node[] = [];
    nodes.push({
      id: pillar._id,
      data: { label: pillar.title },
      position: savedPos[pillar._id] ?? { x: 0, y: 0 },
      draggable: true,
      type: 'default',
    });
    const R = 240;
    keywords.forEach((k, i) => {
      const angle = (2 * Math.PI * i) / Math.max(1, keywords.length);
      const def = { x: Math.cos(angle) * R, y: Math.sin(angle) * R };
      nodes.push({
        id: k._id,
        data: { label: k.term },
        position: savedPos[k._id] ?? def,
        draggable: true,
        type: 'default',
      });
    });
    return nodes;
  }, [pillar, keywords, savedPos]);

  // 初期エッジ
  const initialEdges: Edge[] = useMemo(
    () => keywords.map((k) => ({ id: `${pillar._id}-${k._id}`, source: pillar._id, target: k._id })),
    [pillar, keywords]
  );

  // 制御状態（React Flow推奨の use*State）
  const [nodes, setNodes, onNodesChangeRF] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // ノード移動時に座標を保存
  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      setNodes((nds) => {
        const next = applyNodeChanges(changes, nds);
        const pos: PosMap = {};
        next.forEach((n) => (pos[n.id] = n.position));
        localStorage.setItem(storageKey, JSON.stringify(pos));
        return next;
      });
      onNodesChangeRF(changes); // ReactFlow 内部の変更も適用
    },
    [setNodes, onNodesChangeRF, storageKey]
  );

  // keywords が変わったら nodes/edges を再同期（追加直後など）
  useEffect(() => {
    setNodes(initialNodes);
  }, [initialNodes, setNodes]);

  useEffect(() => {
    setEdges(initialEdges);
  }, [initialEdges, setEdges]);

  return (
    <div className="h-[460px] border rounded-xl">
      <ReactFlow
        key={pillar._id}             // ピラー切替で確実に再初期化
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}

