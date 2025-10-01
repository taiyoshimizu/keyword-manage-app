import { Router } from 'express';
import { Pillar } from '../models/Pillar';
import { Keyword } from '../models/Keyword';


const r = Router();


// Create pillar
r.post('/', async (req, res) => {
const doc = await Pillar.create({ title: req.body.title, description: req.body.description });
res.json(doc);
});


// List pillars with progress
r.get('/', async (_req, res) => {
const pillars = await Pillar.find().sort({ createdAt: -1 });
const pillarIds = pillars.map(p => p._id);
const grouped = await Keyword.aggregate([
{ $match: { pillarId: { $in: pillarIds } } },
{ $group: { _id: '$pillarId',
total: { $sum: 1 },
published: { $sum: { $cond: [{ $eq: ['$status','published'] }, 1, 0] } }
}}
]);
const map = new Map(grouped.map(g => [String(g._id), g]));
const result = pillars.map(p => ({
...p.toObject(),
progress: map.get(String(p._id)) || { total: 0, published: 0 }
}));
res.json(result);
});


// Get one
r.get('/:id', async (req, res) => {
const pillar = await Pillar.findById(req.params.id);
if (!pillar) return res.status(404).json({ message: 'Not found' });
const keywords = await Keyword.find({ pillarId: pillar._id }).sort({ createdAt: -1 });
res.json({ pillar, keywords });
});


// Update
r.put('/:id', async (req, res) => {
const doc = await Pillar.findByIdAndUpdate(req.params.id, req.body, { new: true });
res.json(doc);
});


// Delete
r.delete('/:id', async (req, res) => {
await Pillar.findByIdAndDelete(req.params.id);
await Keyword.updateMany({ pillarId: req.params.id }, { $unset: { pillarId: 1 } });
res.json({ ok: true });
});


export default r;
