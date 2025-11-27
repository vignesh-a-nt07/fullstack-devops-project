import React from 'react';
import { ThemeProvider as MuiThemeProvider, CssBaseline, GlobalStyles } from '@mui/material';
import buildTheme from '../config/muiTheme';
import { ThemeModeProvider, THEME_KEY, ThemePreference } from './themeContext';

const ThemeProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [preference, setPreference] = React.useState<ThemePreference>(() => {
    if (typeof window === 'undefined') return 'system';
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'light' || saved === 'dark' || saved === 'system')
      return saved as ThemePreference;
    return 'system';
  });

  const [effectiveMode, setEffectiveMode] = React.useState<'light' | 'dark'>(() => {
    if (typeof window === 'undefined') return 'light';
    if (preference === 'light' || preference === 'dark') return preference;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  });

  const setMode = React.useCallback((p: ThemePreference) => {
    setPreference(p);
    try {
      localStorage.setItem(THEME_KEY, p);
    } catch {
      // ignore
    }

    if (p === 'light' || p === 'dark') {
      setEffectiveMode(p);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setEffectiveMode(prefersDark ? 'dark' : 'light');
    }
  }, []);

  const toggleMode = React.useCallback(() => {
    setPreference((prev) => {
      let nextPref: ThemePreference;
      if (prev === 'system') {
        nextPref = effectiveMode === 'light' ? 'dark' : 'light';
      } else {
        nextPref = prev === 'light' ? 'dark' : 'light';
      }

      try {
        localStorage.setItem(THEME_KEY, nextPref);
      } catch {
        // ignore
      }

      setEffectiveMode(nextPref);
      return nextPref;
    });
  }, [effectiveMode]);

  // Watch system preference if user chose 'system'
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handle = (e: MediaQueryListEvent) => {
      const newMode = e.matches ? 'dark' : 'light';
      console.log(`[Theme Change] System changed to ${newMode} mode`);
      if (preference === 'system') setEffectiveMode(newMode);
    };

    mq.addEventListener('change', handle);
    return () => mq.removeEventListener('change', handle);
  }, [preference]);

  const theme = React.useMemo(() => buildTheme(effectiveMode), [effectiveMode]);

  // Local type to access our custom theme tokens without using `any`.
  type CustomTheme = {
    custom: {
      gradientBackground: string;
      cardShadow: string;
      login: {
        cardBg: string;
        titleColor: string;
        btnGradient: string;
      };
    };
  };
  const custom = (theme as unknown as CustomTheme).custom;

  return (
    <ThemeModeProvider value={{ mode: effectiveMode, preference, toggleMode, setMode }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyles
          styles={{
            ':root': {
              fontFamily: theme.typography.fontFamily,
              colorScheme: effectiveMode,
            },
            body: {
              margin: 0,
              minWidth: 320,
              minHeight: '100vh',
              background: custom.gradientBackground,
            },
            '.login-page-center': {
              minHeight: '100vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'none',
            },
            '.login-form-modern': {
              background: custom.login.cardBg,
              padding: '2.5rem 2rem',
              borderRadius: 16,
              boxShadow: custom.cardShadow,
              minWidth: 340,
              maxWidth: 360,
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
            },
            '.login-title': {
              fontSize: '2rem',
              fontWeight: 700,
              color: custom.login.titleColor,
              textAlign: 'center',
              marginBottom: '0.5rem',
            },
            '.login-btn': {
              background: custom.login.btnGradient,
              color: '#fff',
            },
          }}
        />
        {children}
      </MuiThemeProvider>
    </ThemeModeProvider>
  );
};

export default ThemeProvider;
