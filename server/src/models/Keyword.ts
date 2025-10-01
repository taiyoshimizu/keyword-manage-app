import { Schema, model, Types } from 'mongoose';


export type Status = 'todo' | 'writing' | 'published';


const KeywordSchema = new Schema({
term: { type: String, required: true },
searchVolume: { type: Number, default: 0 },
difficulty: { type: Number, default: 0 },
status: { type: String, enum: ['todo','writing','published'], default: 'todo' },
pillarId: { type: Types.ObjectId, ref: 'Pillar' },
notes: { type: String },
}, { timestamps: true });


export const Keyword = model('Keyword', KeywordSchema);
