import { normalizeStory, storyIdsPathForCategory } from "@/api/hn";

test("maps HN categories to Firebase story id paths", () => {
  expect(storyIdsPathForCategory("top")).toBe("topstories");
  expect(storyIdsPathForCategory("ask")).toBe("askstories");
  expect(storyIdsPathForCategory("jobs")).toBe("jobstories");
});

test("normalizes a HN item into a story with domain and comment count", () => {
  const story = normalizeStory({
    id: 42,
    by: "pg",
    descendants: 12,
    score: 91,
    time: 1_714_800_000,
    title: "OpenAI releases GPT-4o",
    type: "story",
    url: "https://openai.com/index/gpt-4o/",
  });

  expect(story).toMatchObject({
    id: 42,
    author: "pg",
    commentCount: 12,
    score: 91,
    domain: "openai.com",
    url: "https://openai.com/index/gpt-4o/",
  });
});

test("normalizes Ask HN items without urls as discussion stories", () => {
  const story = normalizeStory({
    id: 7,
    by: "curious_hn",
    descendants: 48,
    score: 125,
    time: 1_714_800_000,
    title: "Ask HN: How do you manage personal knowledge?",
    type: "story",
  });

  expect(story.domain).toBe("news.ycombinator.com");
  expect(story.url).toBeUndefined();
});
