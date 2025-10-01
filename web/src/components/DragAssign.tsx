'use client';
import { DndContext, useDroppable, useDraggable } from '@dnd-kit/core';
import { api } from '@/lib/api';

function Draggable({ id, children }: { id: string; children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });
  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;
  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes} className="cursor-move">
      {children}
    </div>
  );
}

function Droppable({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const { isOver, setNodeRef } = useDroppable({ id });
  return (
    <div
      ref={setNodeRef}
      className={`p-3 border-2 rounded-xl min-h-[120px] ${
        isOver ? 'border-blue-500 bg-blue-50' : 'border-dashed'
      }`}
    >
      {children}
    </div>
  );
}

export default function DragAssign({
  unassigned,
  pillarId,
  reload,
}: {
  unassigned: { _id: string; term: string }[];
  pillarId: string;
  reload: () => void;
}) {
  const handleDragEnd = async (ev: any) => {
    const dragId = ev.active?.id as string | undefined;
    const overId = ev.over?.id as string | undefined;
    if (!dragId || !overId) return;
    if (overId === `pillar:${pillarId}`) {
      await api.post('/api/keywords/bulk/move', { keywordIds: [dragId], pillarId });
      reload();
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="p-3 border rounded-xl">
          <div className="font-semibold mb-2">未割当キーワード</div>
          <div className="space-y-2">
            {unassigned.length === 0 && (
              <div className="text-sm text-gray-500">未割当はありません</div>
            )}
            {unassigned.map((k) => (
              <Draggable key={k._id} id={k._id}>
                <div className="p-2 border rounded bg-white">{k.term}</div>
              </Draggable>
            ))}
          </div>
        </div>
        <div>
          <div className="font-semibold mb-2">このPillarに割り当て（ドロップ）</div>
          <Droppable id={`pillar:${pillarId}`}>
            <div className="text-sm text-gray-500">
              ここに未割当キーワードをドロップすると、Pillarに割り当てられます
            </div>
          </Droppable>
        </div>
      </div>
    </DndContext>
  );
}

