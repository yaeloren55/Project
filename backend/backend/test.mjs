// minimal-multi-image.mjs
import { GoogleGenAI } from '@google/genai';
import fs from 'node:fs/promises';
import path from 'node:path';

const API_KEY = process.env.GEMINI_API_KEY ?? process.env.gemini_api_key ?? 'AIzaSyDwEA5VXe7EB8soEE4OIFITw8lvu7ErC2U';
const MODEL   = 'gemini-2.5-flash-image-preview';

// 1st image = the person; others = clothes/references
const IMAGES = [
  './1.jpg',
  './3.jpeg',
  './4.png',
];

const PROMPT = 'Edit the first image to dress the person with clothes from the other images. Keep the person/background unchanged. Only change the clothes, fit naturally.';
const OUT    = './result.png';

const mime = (p) => {
  const e = path.extname(p).toLowerCase();
  if (e === '.jpg' || e === '.jpeg') return 'image/jpeg';
  if (e === '.png') return 'image/png';
  if (e === '.webp') return 'image/webp';
  return 'application/octet-stream';
};
const toInline = async (p) => ({
  inlineData: { mimeType: mime(p), data: (await fs.readFile(p)).toString('base64') }
});

const ai = new GoogleGenAI({ apiKey: API_KEY });

// build contents: prompt + images
const parts = await Promise.all(IMAGES.map(toInline));
const res = await ai.models.generateContent({
  model: MODEL,
  contents: [{ text: PROMPT }, ...parts],
});

// save first returned image
const img = res.candidates?.[0]?.content?.parts?.find(p => p?.inlineData?.data);
if (!img) throw new Error('No image returned');
await fs.mkdir(path.dirname(OUT), { recursive: true });
await fs.writeFile(OUT, Buffer.from(img.inlineData.data, 'base64'));
console.log('Saved', OUT);
console.log('Done');