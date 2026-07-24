import type { ReadLaterItem, Story } from "@/models/hn";
import type { KVStorage } from "@/storage/kv";
import { getKVStorage, readJson, writeJson } from "@/storage/kv";

const KEY = "read-later-items";

export type ReadLaterStatus = "all" | "unread" | "read";
export type ReadLaterSort = "newest" | "oldest";

export type ReadLaterFilter = {
  status: ReadLaterStatus;
  query: string;
  sort?: ReadLaterSort;
};

export function filterReadLaterItems(items: ReadLaterItem[], filter: ReadLaterFilter): ReadLaterItem[] {
  const query = filter.query.trim().toLowerCase();
  return items
    .filter((item) => {
      if (filter.status === "read" && !item.read) return false;
      if (filter.status === "unread" && item.read) return false;
      if (!query) return true;
      return [item.title, item.url ?? "", item.domain].some((value) => value.toLowerCase().includes(query));
    })
    .sort((a, b) => (filter.sort === "oldest" ? a.addedAt - b.addedAt : b.addedAt - a.addedAt));
}

export function createReadLaterStore(storage: KVStorage = getKVStorage()) {
  const list = () => readJson<ReadLaterItem[]>(storage, KEY, []);
  const save = (items: ReadLaterItem[]) => writeJson(storage, KEY, items);

  return {
    list,
    isSaved(id: number) {
      return list().some((item) => item.id === id);
    },
    add(story: Story) {
      const items = list();
      if (items.some((item) => item.id === story.id)) return;
      save([{ ...story, addedAt: Date.now(), read: false }, ...items]);
    },
    remove(id: number) {
      save(list().filter((item) => item.id !== id));
    },
    toggle(story: Story) {
      if (this.isSaved(story.id)) {
        this.remove(story.id);
      } else {
        this.add(story);
      }
    },
    markRead(id: number, read: boolean) {
      save(list().map((item) => (item.id === id ? { ...item, read } : item)));
    },
    removeRead() {
      save(list().filter((item) => !item.read));
    },
  };
}

export const readLaterStore = createReadLaterStore();
