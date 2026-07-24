import { createMMKV } from "react-native-mmkv";

export type KVStorage = {
  getString(key: string): string | undefined;
  set(key: string, value: string): void;
  remove(key: string): boolean | void;
  clearAll?(): void;
};

export function createMemoryKVStorage(): KVStorage {
  const store = new Map<string, string>();
  return {
    getString: (key) => store.get(key),
    set: (key, value) => store.set(key, value),
    remove: (key) => store.delete(key),
    clearAll: () => store.clear(),
  };
}

let mmkv: KVStorage | null = null;

export function getKVStorage(): KVStorage {
  if (!mmkv) {
    mmkv = createMMKV({ id: "hn-later" });
  }
  return mmkv as KVStorage;
}

export function readJson<T>(storage: KVStorage, key: string, fallback: T): T {
  const raw = storage.getString(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeJson<T>(storage: KVStorage, key: string, value: T): void {
  storage.set(key, JSON.stringify(value));
}
