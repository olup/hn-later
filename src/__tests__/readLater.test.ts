import { createMemoryKVStorage } from "@/storage/kv";
import { createReadLaterStore, filterReadLaterItems } from "@/storage/readLater";
import type { Story } from "@/models/hn";

const story: Story = {
  id: 1,
  title: "Why relational databases still win",
  author: "jdeas",
  score: 298,
  commentCount: 143,
  time: 1_714_800_000,
  domain: "jvns.ca",
  url: "https://jvns.ca/blog/relational-databases/",
  type: "story",
};

test("adds, toggles read status, and removes read later items", () => {
  const store = createReadLaterStore(createMemoryKVStorage());

  store.add(story);
  expect(store.list()).toHaveLength(1);
  expect(store.isSaved(1)).toBe(true);

  store.markRead(1, true);
  expect(store.list()[0].read).toBe(true);

  store.remove(1);
  expect(store.list()).toHaveLength(0);
});

test("filters read later items by status and search query", () => {
  const store = createReadLaterStore(createMemoryKVStorage());
  store.add(story);
  store.add({ ...story, id: 2, title: "The accidental tech entrepreneur", domain: "stripe.com" });
  store.markRead(1, true);

  expect(filterReadLaterItems(store.list(), { status: "unread", query: "" }).map((item) => item.id)).toEqual([2]);
  expect(filterReadLaterItems(store.list(), { status: "all", query: "stripe" }).map((item) => item.id)).toEqual([2]);
});
