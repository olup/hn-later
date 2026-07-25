import { buildAlgoliaSearchUrl, normalizeAlgoliaHit } from "@/api/algolia";

test("builds an Algolia HN story search url", () => {
  expect(buildAlgoliaSearchUrl("react native", 2)).toBe(
    "https://hn.algolia.com/api/v1/search?query=react+native&tags=story&hitsPerPage=30&page=2",
  );
});

test("normalizes an Algolia hit into a story", () => {
  const story = normalizeAlgoliaHit({
    objectID: "123",
    title: "HN Later ships",
    url: "https://example.com/hn-later",
    author: "olup",
    points: 42,
    num_comments: 9,
    created_at_i: 1_714_800_000,
  });

  expect(story).toMatchObject({
    id: 123,
    title: "HN Later ships",
    domain: "example.com",
    author: "olup",
    score: 42,
    commentCount: 9,
    time: 1_714_800_000,
  });
});

test("falls back to HN discussion domain for Ask HN-style hits without urls", () => {
  const story = normalizeAlgoliaHit({
    objectID: "456",
    title: "Ask HN: Best Android reader?",
    author: "pg",
    points: null,
    num_comments: null,
    created_at_i: 1_714_800_000,
  });

  expect(story.domain).toBe("news.ycombinator.com");
  expect(story.score).toBe(0);
  expect(story.commentCount).toBe(0);
});
