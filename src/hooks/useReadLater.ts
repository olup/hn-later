import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";
import type { ReadLaterItem, Story } from "@/models/hn";
import { filterReadLaterItems, readLaterStore, type ReadLaterFilter } from "@/storage/readLater";

export function useReadLater() {
  const [items, setItems] = useState<ReadLaterItem[]>(() => readLaterStore.list());

  const refresh = useCallback(() => setItems(readLaterStore.list()), []);

  useFocusEffect(refresh);

  const add = useCallback(
    (story: Story) => {
      readLaterStore.add(story);
      refresh();
    },
    [refresh],
  );

  const remove = useCallback(
    (id: number) => {
      readLaterStore.remove(id);
      refresh();
    },
    [refresh],
  );

  const toggle = useCallback(
    (story: Story) => {
      readLaterStore.toggle(story);
      refresh();
    },
    [refresh],
  );

  const markRead = useCallback(
    (id: number, read: boolean) => {
      readLaterStore.markRead(id, read);
      refresh();
    },
    [refresh],
  );

  const removeRead = useCallback(() => {
    readLaterStore.removeRead();
    refresh();
  }, [refresh]);

  return {
    items,
    savedIds: new Set(items.map((item) => item.id)),
    add,
    remove,
    toggle,
    markRead,
    removeRead,
    filter: (filter: ReadLaterFilter) => filterReadLaterItems(items, filter),
    refresh,
  };
}
