import { Schema, model, Types } from 'mongoose';


export type Status = 'todo' | 'writing' | 'published';


const PillarSchema = new Schema({
title: { type: String, required: true },
description: { type: String },
// 集計用キャッシュは持たず、都度集計でもOK（MVP）
}, { timestamps: true });


export const Pillar = model('Pillar', PillarSchema);
