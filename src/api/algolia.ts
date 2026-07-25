import type { Story } from "@/models/hn";
import { getDomain } from "@/utils/format";

const ALGOLIA_BASE_URL = "https://hn.algolia.com/api/v1/search";
const HITS_PER_PAGE = 30;

export type AlgoliaHit = {
  objectID: string;
  title?: string | null;
  story_title?: string | null;
  url?: string | null;
  story_url?: string | null;
  author?: string | null;
  points?: number | null;
  num_comments?: number | null;
  created_at_i?: number | null;
};

type AlgoliaSearchResponse = {
  hits: AlgoliaHit[];
  page: number;
  nbPages: number;
  nbHits: number;
};

export function buildAlgoliaSearchUrl(query: string, page = 0): string {
  const params = new URLSearchParams({
    query,
    tags: "story",
    hitsPerPage: String(HITS_PER_PAGE),
    page: String(page),
  });
  return `${ALGOLIA_BASE_URL}?${params.toString()}`;
}

export function normalizeAlgoliaHit(hit: AlgoliaHit): Story {
  const url = hit.url ?? hit.story_url ?? undefined;
  return {
    id: Number(hit.objectID),
    title: hit.title ?? hit.story_title ?? "Untitled",
    author: hit.author ?? "unknown",
    score: hit.points ?? 0,
    commentCount: hit.num_comments ?? 0,
    time: hit.created_at_i ?? 0,
    domain: getDomain(url),
    url,
    type: "story",
    kids: [],
  };
}

export async function searchStories(query: string, page = 0): Promise<Story[]> {
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];

  const response = await fetch(buildAlgoliaSearchUrl(trimmed, page));
  if (!response.ok) {
    throw new Error(`Algolia HN search failed: ${response.status}`);
  }

  const data = (await response.json()) as AlgoliaSearchResponse;
  return data.hits.map(normalizeAlgoliaHit).filter((story) => Number.isFinite(story.id));
}
