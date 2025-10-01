export type Status = 'todo' | 'writing' | 'published';
export type Pillar = { _id: string; title: string; description?: string; progress?: { total: number; published: number } };
export type Keyword = { _id: string; term: string; searchVolume: number; difficulty: number; status: Status; pillarId?: string };
