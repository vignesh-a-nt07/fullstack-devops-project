import React from 'react';

export const THEME_KEY = 'hirehub_theme_mode';

export type ThemePreference = 'light' | 'dark' | 'system';
export type ThemeMode = 'light' | 'dark';

export type ThemeModeContextValue = {
  // actual mode used in MUI theme
  mode: ThemeMode;
  // user's saved preference (light, dark, or system)
  preference: ThemePreference;
  // toggles between light/dark; if system, switches to explicit preference
  toggleMode: () => void;
  // manually set preference
  setMode: (m: ThemePreference) => void;
};

// ✅ Create context
const ThemeModeContext = React.createContext<ThemeModeContextValue | undefined>(undefined);

// ✅ Export Provider for external wrapping
export const ThemeModeProvider = ThemeModeContext.Provider;

// ✅ Export a hook for consumers
export const useThemeMode = (): ThemeModeContextValue => {
  const ctx = React.useContext(ThemeModeContext);
  if (!ctx) throw new Error('useThemeMode must be used within ThemeProvider');
  return ctx;
};
