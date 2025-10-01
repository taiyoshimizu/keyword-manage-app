import { Router } from 'express';
import { Keyword } from '../models/Keyword';


const r = Router();


r.post('/', async (req, res) => {
const doc = await Keyword.create(req.body);
res.json(doc);
});


r.get('/', async (req, res) => {
const q: any = {};
if (req.query.status) q.status = req.query.status;
if (req.query.pillarId) q.pillarId = req.query.pillarId;
const docs = await Keyword.find(q).sort({ createdAt: -1 });
res.json(docs);
});


r.put('/:id', async (req, res) => {
const doc = await Keyword.findByIdAndUpdate(req.params.id, req.body, { new: true });
res.json(doc);
});


r.delete('/:id', async (req, res) => {
await Keyword.findByIdAndDelete(req.params.id);
res.json({ ok: true });
});


// Bulk move to pillar (DnDなどで使用)
r.post('/bulk/move', async (req, res) => {
const { keywordIds, pillarId } = req.body; // string[]
const rsl = await Keyword.updateMany({ _id: { $in: keywordIds } }, { $set: { pillarId } });
res.json({ matched: rsl.matchedCount, modified: rsl.modifiedCount });
});


export default r;
