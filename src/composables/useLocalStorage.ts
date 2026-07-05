type Settings = Record<string, string | boolean | number | string[]>;

const STORAGE_KEY = "lawandorga_frontend_settings";

export function loadSettingsFromStorage(): Settings {
  if (typeof window === "undefined") return {};

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error("Failed to load settings from localStorage:", error);
    return {};
  }
}

export function saveSettingsToStorage(settings: Settings): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error("Failed to save settings to localStorage:", error);
    if (error instanceof DOMException && error.code === 22) {
      console.warn("localStorage quota exceeded");
    }
  }
}

export function getSettingFromStorage<T = string | boolean | number | string[]>(
  key: string,
  defaultValue: T = "" as T,
): T {
  const settings = loadSettingsFromStorage();
  return (settings[key] as T) ?? defaultValue;
}

export function setSettingInStorage(
  key: string,
  value: string | boolean | number | string[],
): void {
  const settings = loadSettingsFromStorage();
  settings[key] = value;
  saveSettingsToStorage(settings);
}

export function removeSettingFromStorage(key: string): void {
  const settings = loadSettingsFromStorage();
  delete settings[key];
  saveSettingsToStorage(settings);
}

export function clearSettingsStorage(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear settings from localStorage:", error);
  }
}

export function exportSettings(): string {
  const settings = loadSettingsFromStorage();
  return JSON.stringify(settings, null, 2);
}

export function importSettings(jsonString: string): boolean {
  try {
    const settings = JSON.parse(jsonString);
    if (typeof settings === "object" && settings !== null) {
      saveSettingsToStorage(settings);
      return true;
    }
    return false;
  } catch (error) {
    console.error("Failed to import settings:", error);
    return false;
  }
}
