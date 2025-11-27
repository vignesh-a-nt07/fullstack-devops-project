import { createTheme } from '@mui/material';

export const primaryMain = '#009688';
export const primaryLight = '#00bcd4';

export function buildTheme(mode: 'light' | 'dark' = 'light') {
  const isLight = mode === 'light';
  return createTheme({
    palette: {
      mode,
      primary: {
        main: primaryMain,
        light: primaryLight,
        contrastText: '#fff',
      },
      secondary: {
        main: '#1976d2',
      },
      background: {
        default: isLight ? '#f8faff' : '#242424',
        paper: isLight ? '#fff' : '#1e1e1e',
      },
    },
    typography: {
      fontFamily: 'Inter, Segoe UI, Arial, sans-serif',
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            fontWeight: 600,
            padding: '10px 12px',
            textTransform: 'none',
          },
          containedPrimary: {
            background: `linear-gradient(90deg, ${primaryMain} 0%, ${primaryLight} 100%)`,
            color: '#fff',
            boxShadow: '0 2px 8px rgba(0, 188, 212, 0.08)',
            '&:hover': {
              background: `linear-gradient(90deg, ${primaryLight} 0%, ${primaryMain} 100%)`,
            },
          },
        },
      },
      MuiTypography: {
        styleOverrides: {
          h5: {
            color: primaryMain,
            fontWeight: 700,
          },
        },
      },
    },
    // custom tokens for non-MUI or global styles
    custom: {
      gradientBackground: 'linear-gradient(135deg, #e3f0ff 0%, #f8faff 100%)',
      cardShadow: '0 4px 32px rgba(0, 0, 0, 0.08)',
      login: {
        cardBg: '#fff',
        titleColor: primaryMain,
        btnGradient: `linear-gradient(90deg, ${primaryMain} 0%, ${primaryLight} 100%)`,
      },
    },
  });
}

export default buildTheme;
