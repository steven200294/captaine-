/**
 * Apply the pgvector migration to remote Supabase.
 * Usage: npx tsx --env-file=.env.local scripts/apply-migration.ts
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing SUPABASE env vars.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: false },
});

const SQL_STATEMENTS = [
  `CREATE EXTENSION IF NOT EXISTS vector`,

  `CREATE TABLE IF NOT EXISTS knowledge_embeddings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chunk_id TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT NOT NULL,
    subcategory TEXT,
    keywords TEXT[] DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    embedding VECTOR(1536) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
  )`,

  `CREATE INDEX IF NOT EXISTS idx_knowledge_embeddings_category
    ON knowledge_embeddings(category)`,
];

const MATCH_FUNCTION = `
CREATE OR REPLACE FUNCTION match_knowledge(
  query_embedding VECTOR(1536),
  match_count INT DEFAULT 5,
  match_threshold FLOAT DEFAULT 0.3
)
RETURNS TABLE (
  id UUID,
  chunk_id TEXT,
  title TEXT,
  content TEXT,
  category TEXT,
  subcategory TEXT,
  keywords TEXT[],
  metadata JSONB,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    ke.id,
    ke.chunk_id,
    ke.title,
    ke.content,
    ke.category,
    ke.subcategory,
    ke.keywords,
    ke.metadata,
    1 - (ke.embedding <=> query_embedding) AS similarity
  FROM knowledge_embeddings ke
  WHERE 1 - (ke.embedding <=> query_embedding) > match_threshold
  ORDER BY ke.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
`;

async function main() {
  console.log('Applying pgvector migration...\n');

  for (const sql of SQL_STATEMENTS) {
    const { error } = await supabase.rpc('exec', { query: sql });
    if (error) {
      console.log(`Note: ${error.message.slice(0, 80)}`);
      console.log('  (This is expected if using the Supabase Dashboard SQL Editor instead)\n');
    } else {
      console.log(`  OK: ${sql.slice(0, 50)}...`);
    }
  }

  // Try the function
  const { error: fnError } = await supabase.rpc('exec', { query: MATCH_FUNCTION });
  if (fnError) {
    console.log(`\nNote: Could not create function via RPC: ${fnError.message.slice(0, 80)}`);
    console.log('\n--- MANUAL STEP REQUIRED ---');
    console.log('Please run the following SQL in Supabase Dashboard > SQL Editor:');
    console.log('File: supabase/migrations/002_knowledge_embeddings.sql\n');
  } else {
    console.log('  OK: match_knowledge function created');
  }

  // Verify table exists
  const { data, error: checkError } = await supabase
    .from('knowledge_embeddings')
    .select('chunk_id')
    .limit(1);

  if (checkError) {
    console.log(`\nTable check: ${checkError.message}`);
    console.log('\n=== ACTION REQUIRED ===');
    console.log('Go to Supabase Dashboard > SQL Editor and paste the contents of:');
    console.log('  supabase/migrations/002_knowledge_embeddings.sql');
    console.log('Then run: npx tsx --env-file=.env.local scripts/ingest-knowledge.ts');
  } else {
    console.log('\nTable knowledge_embeddings exists. Ready for ingestion!');
    console.log('Run: npx tsx --env-file=.env.local scripts/ingest-knowledge.ts');
  }
}

main().catch(console.error);
