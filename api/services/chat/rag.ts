import { createServiceClient } from '@shared/config/supabase-server';
import { generateEmbedding } from './embeddings';

export interface RetrievedChunk {
  chunkId: string;
  title: string;
  content: string;
  category: string;
  subcategory: string | null;
  keywords: string[];
  metadata: Record<string, unknown>;
  similarity: number;
}

export async function retrieveContext(
  query: string,
  topK: number = 5
): Promise<RetrievedChunk[]> {
  const supabase = createServiceClient();
  const queryEmbedding = await generateEmbedding(query);

  const { data, error } = await supabase.rpc('match_knowledge', {
    query_embedding: queryEmbedding,
    match_count: topK,
    match_threshold: 0.3,
  });

  if (error) {
    console.error('[RAG] match_knowledge error:', error.message);
    return [];
  }

  return (data || []).map((row: Record<string, unknown>) => ({
    chunkId: row.chunk_id as string,
    title: row.title as string,
    content: row.content as string,
    category: row.category as string,
    subcategory: row.subcategory as string | null,
    keywords: row.keywords as string[],
    metadata: row.metadata as Record<string, unknown>,
    similarity: row.similarity as number,
  }));
}

export function formatContextForPrompt(chunks: RetrievedChunk[]): string {
  if (chunks.length === 0) return '';

  const sections = chunks.map((chunk, i) => {
    const meta = chunk.metadata;
    const priceInfo = meta.price_adult
      ? ` | Prix adulte: ${(meta.price_adult as number) / 100}€`
      : '';
    const slug = meta.slug ? ` | Slug: ${meta.slug}` : '';

    return `[${i + 1}] ${chunk.title} (${chunk.category}${slug}${priceInfo})\n${chunk.content}`;
  });

  return sections.join('\n\n');
}
