import '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Theme {
    custom: {
      gradientBackground: string;
      cardShadow: string;
      login: {
        cardBg: string;
        titleColor: string;
        btnGradient: string;
      };
    };
  }

  // Allow configuration using `createTheme`
  interface ThemeOptions {
    custom?: {
      gradientBackground?: string;
      cardShadow?: string;
      login?: {
        cardBg?: string;
        titleColor?: string;
        btnGradient?: string;
      };
    };
  }
}
