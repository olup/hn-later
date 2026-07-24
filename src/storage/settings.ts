import type { KVStorage } from "@/storage/kv";
import { getKVStorage, readJson, writeJson } from "@/storage/kv";

const KEY = "settings";

export type AppSettings = {
  fontScale: "small" | "normal" | "large";
  linkMode: "internal" | "chrome";
};

export const defaultSettings: AppSettings = {
  fontScale: "normal",
  linkMode: "internal",
};

export function createSettingsStore(storage: KVStorage = getKVStorage()) {
  return {
    get(): AppSettings {
      return readJson(storage, KEY, defaultSettings);
    },
    set(settings: AppSettings) {
      writeJson(storage, KEY, settings);
    },
  };
}

export const settingsStore = createSettingsStore();
