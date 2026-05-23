import { createContext, useContext, useEffect, useState, useCallback, type ReactNode, createElement } from "react";

const KEY = "psi-settings-v1";

export type FontScale = "sm" | "md" | "lg" | "xl";

export interface Settings {
  scoringEnabled: boolean;
  reduceMotion: boolean;
  highContrast: boolean;
  fontScale: FontScale;
  underlineLinks: boolean;
}

const DEFAULTS: Settings = {
  scoringEnabled: true,
  reduceMotion: false,
  highContrast: false,
  fontScale: "md",
  underlineLinks: false,
};

function read(): Settings {
  try {
    const stored = JSON.parse(localStorage.getItem(KEY) || "{}");
    return { ...DEFAULTS, ...stored };
  } catch {
    return { ...DEFAULTS };
  }
}

function write(s: Settings) {
  localStorage.setItem(KEY, JSON.stringify(s));
}

const FONT_SCALE_PX: Record<FontScale, number> = { sm: 14, md: 16, lg: 18, xl: 20 };

function apply(s: Settings) {
  const root = document.documentElement;
  // Reduce motion
  root.classList.toggle("reduce-motion", s.reduceMotion || matchMedia("(prefers-reduced-motion: reduce)").matches);
  // High contrast
  root.classList.toggle("high-contrast", s.highContrast);
  // Underline links
  root.classList.toggle("underline-links", s.underlineLinks);
  // Font scale via CSS var on root
  root.style.fontSize = `${FONT_SCALE_PX[s.fontScale]}px`;
}

interface SettingsCtx {
  settings: Settings;
  setSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
  reset: () => void;
}

const Ctx = createContext<SettingsCtx | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(() => read());

  useEffect(() => {
    apply(settings);
    write(settings);
  }, [settings]);

  const setSetting = useCallback(<K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings((s) => ({ ...s, [key]: value }));
  }, []);

  const reset = useCallback(() => {
    setSettings({ ...DEFAULTS });
  }, []);

  return createElement(Ctx.Provider, { value: { settings, setSetting, reset } }, children);
}

export function useSettings() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useSettings must be used within SettingsProvider");
  return v;
}
