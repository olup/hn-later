import { useState } from "react";
import { settingsStore, type AppSettings } from "@/storage/settings";

export function useSettings() {
  const [settings, setSettingsState] = useState<AppSettings>(() => settingsStore.get());

  function setSettings(next: AppSettings) {
    settingsStore.set(next);
    setSettingsState(next);
  }

  return { settings, setSettings };
}
