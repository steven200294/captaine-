export { generateEmbedding, generateEmbeddings } from './embeddings';
export { retrieveContext, formatContextForPrompt } from './rag';
export { buildSystemPrompt } from './system-prompt';
export { extractActions, stripMarkers } from './actions';
export type { ChatAction, ProductAction, PromoAction } from './actions';
export type { RetrievedChunk } from './rag';
