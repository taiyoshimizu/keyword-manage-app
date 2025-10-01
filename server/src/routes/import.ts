import { Router } from 'express';
import { Keyword } from '../models/Keyword';


const r = Router();


// CSV: term,searchVolume,difficulty,status,pillarId(optional)
r.post('/csv', async (req, res) => {
const rows: any[] = req.body.rows || [];
const created = await Keyword.insertMany(rows.map(r => ({
term: r.term,
searchVolume: Number(r.searchVolume||0),
difficulty: Number(r.difficulty||0),
status: r.status || 'todo',
pillarId: r.pillarId || undefined
})));
res.json({ count: created.length });
});


// Export all keywords as CSV payload
r.get('/csv', async (_req, res) => {
const rows = await Keyword.find();
const header = 'term,searchVolume,difficulty,status,pillarId\n';
const body = rows.map(r => [
JSON.stringify(r.term), r.searchVolume, r.difficulty, r.status, r.pillarId||''
].join(',')).join('\n');
res.setHeader('Content-Type', 'text/csv');
res.send(header + body);
});


export default r;
