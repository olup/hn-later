import type { CommentNode, HNCategory, HNItem, Story } from "@/models/hn";
import { getDomain } from "@/utils/format";

const BASE_URL = "https://hacker-news.firebaseio.com/v0";

const CATEGORY_PATHS: Record<HNCategory, string> = {
  top: "topstories",
  best: "beststories",
  new: "newstories",
  ask: "askstories",
  show: "showstories",
  jobs: "jobstories",
};

export function storyIdsPathForCategory(category: HNCategory): string {
  return CATEGORY_PATHS[category];
}

async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(`${BASE_URL}/${path}.json`);
  if (!response.ok) {
    throw new Error(`HN API request failed: ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export function normalizeStory(item: HNItem): Story {
  return {
    id: item.id,
    title: item.title ?? "Untitled",
    author: item.by ?? "unknown",
    score: item.score ?? 0,
    commentCount: item.descendants ?? 0,
    time: item.time ?? 0,
    domain: getDomain(item.url),
    url: item.url,
    type: item.type ?? "story",
    kids: item.kids ?? [],
  };
}

export async function fetchStoryIds(category: HNCategory): Promise<number[]> {
  return fetchJson<number[]>(storyIdsPathForCategory(category));
}

export async function fetchItem(id: number): Promise<HNItem | null> {
  return fetchJson<HNItem | null>(`item/${id}`);
}

export async function fetchStories(category: HNCategory, limit = 40): Promise<Story[]> {
  const ids = await fetchStoryIds(category);
  const items = await Promise.all(ids.slice(0, limit).map((id) => fetchItem(id)));
  return items.filter((item): item is HNItem => Boolean(item && !item.deleted && !item.dead)).map(normalizeStory);
}

export async function fetchStory(id: number): Promise<Story> {
  const item = await fetchItem(id);
  if (!item) throw new Error("Story not found");
  return normalizeStory(item);
}

export async function fetchCommentTree(ids: number[] = [], depth = 0): Promise<CommentNode[]> {
  if (ids.length === 0) return [];
  const items = await Promise.all(ids.map((id) => fetchItem(id)));
  const comments: Array<CommentNode | null> = await Promise.all(
    items.map(async (item) => {
      if (!item || item.type !== "comment") return null;
      const kids = depth > 8 ? [] : await fetchCommentTree(item.kids ?? [], depth + 1);
      return {
        id: item.id,
        author: item.by ?? "unknown",
        text: item.deleted ? "[deleted]" : item.text ?? "",
        time: item.time ?? 0,
        kids,
        deleted: item.deleted,
        dead: item.dead,
      } satisfies CommentNode;
    }),
  );
  return comments.filter((comment): comment is CommentNode => Boolean(comment && !comment.dead));
}
