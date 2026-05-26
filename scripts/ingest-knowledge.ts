/**
 * Ingestion script: reads knowledge base chunks and inserts embeddings into Supabase pgvector.
 *
 * Prerequisites:
 *   1. Run the SQL migration (002_knowledge_embeddings.sql) in Supabase Dashboard SQL Editor
 *   2. Set OPENAI_API_KEY in .env.local
 *
 * Usage: npx tsx scripts/ingest-knowledge.ts
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const OPENAI_KEY = process.env.OPENAI_API_KEY!;

if (!SUPABASE_URL || !SUPABASE_KEY || !OPENAI_KEY) {
  console.error('Missing env vars. Make sure .env.local is loaded.');
  console.error('Run with: npx tsx --env-file=.env.local scripts/ingest-knowledge.ts');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: false },
});

const openai = new OpenAI({ apiKey: OPENAI_KEY });

const KNOWLEDGE_DIR = resolve(process.cwd(), 'knowledge/chunks');
const BATCH_SIZE = 10;

interface Chunk {
  id: string;
  title: string;
  content: string;
  category: string;
  subcategory?: string;
  keywords?: string[];
  [key: string]: unknown;
}

interface ChunkFile {
  metadata: { category: string };
  chunks: Chunk[];
}

const CHUNK_FILES = [
  'products.json',
  'schedule.json',
  'access.json',
  'legal.json',
  'about.json',
  'faq.json',
  'esim-bnesim.json',
  'promotions.json',
];

async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: texts,
    dimensions: 1536,
  });
  return response.data.map((d) => d.embedding);
}

async function main() {
  console.log('--- Knowledge Base Ingestion ---\n');

  const allChunks: { chunk: Chunk; category: string }[] = [];

  for (const file of CHUNK_FILES) {
    const path = resolve(KNOWLEDGE_DIR, file);
    const raw = readFileSync(path, 'utf-8');
    const parsed: ChunkFile = JSON.parse(raw);
    const category = parsed.metadata.category;

    for (const chunk of parsed.chunks) {
      allChunks.push({ chunk, category });
    }
    console.log(`  Loaded ${parsed.chunks.length} chunks from ${file}`);
  }

  console.log(`\nTotal chunks: ${allChunks.length}`);
  console.log(`Batch size: ${BATCH_SIZE}\n`);

  let processed = 0;
  let skipped = 0;

  for (let i = 0; i < allChunks.length; i += BATCH_SIZE) {
    const batch = allChunks.slice(i, i + BATCH_SIZE);
    const texts = batch.map(({ chunk }) => `${chunk.title}\n${chunk.content}`);

    const embeddings = await generateEmbeddings(texts);

    for (let j = 0; j < batch.length; j++) {
      const { chunk, category } = batch[j];
      const embedding = embeddings[j];

      const { slug, price_adult, price_child, includes_esim, includes_macarons, product_slug, discount_amount, active, ...rest } = chunk;
      const metadata: Record<string, unknown> = {};
      if (slug) metadata.slug = slug;
      if (product_slug) metadata.slug = product_slug;
      if (price_adult !== undefined) metadata.price_adult = price_adult;
      if (price_child !== undefined) metadata.price_child = price_child;
      if (includes_esim !== undefined) metadata.includes_esim = includes_esim;
      if (includes_macarons !== undefined) metadata.includes_macarons = includes_macarons;
      if (discount_amount !== undefined) metadata.discount_amount = discount_amount;
      if (active !== undefined) metadata.active = active;

      const { error } = await supabase.from('knowledge_embeddings').upsert(
        {
          chunk_id: chunk.id,
          title: chunk.title,
          content: chunk.content,
          category: category,
          subcategory: chunk.subcategory || null,
          keywords: chunk.keywords || [],
          metadata,
          embedding,
        },
        { onConflict: 'chunk_id' }
      );

      if (error) {
        console.error(`  ERROR on ${chunk.id}: ${error.message}`);
        skipped++;
      } else {
        processed++;
      }
    }

    console.log(`  Processed ${Math.min(i + BATCH_SIZE, allChunks.length)}/${allChunks.length}`);

    if (i + BATCH_SIZE < allChunks.length) {
      await new Promise((r) => setTimeout(r, 200));
    }
  }

  console.log(`\nDone! Processed: ${processed}, Skipped: ${skipped}`);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
