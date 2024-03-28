'use client';

import { createTheme } from '@mui/material';
import { Plus_Jakarta_Sans } from 'next/font/google';

declare module '@mui/material/styles' {
  interface Palette {
    tertiary: Palette['primary'];
    outline: Palette['divider'];
  }

  interface PaletteOptions {
    tertiary?: PaletteOptions['primary'];
    outline?: PaletteOptions['divider'];
  }
}

declare module '@mui/material/styles' {
  interface TypeBackground {
    main: string;
    onMain: string;
    surface: string;
    onSurface: string;
    surfaceVariant: string;
    onSurfaceVariant: string;
  }
}

declare module '@mui/material/styles' {
  interface PaletteColor {
    onMain?: string;
    container?: string;
    onContainer?: string;
  }

  interface SimplePaletteColorOptions {
    onMain?: string;
    container?: string;
    onContainer?: string;
  }
}

declare module '@mui/material/styles' {
  interface TypographyVariants {
    'heading-xl': React.CSSProperties;
    'heading-l': React.CSSProperties;
    'heading-m': React.CSSProperties;
    'heading-s': React.CSSProperties;
    'body-l': React.CSSProperties;
    'body-m': React.CSSProperties;
  }

  interface TypographyVariantsOptions {
    'heading-xl'?: React.CSSProperties;
    'heading-l'?: React.CSSProperties;
    'heading-m'?: React.CSSProperties;
    'heading-s'?: React.CSSProperties;
    'body-l'?: React.CSSProperties;
    'body-m'?: React.CSSProperties;
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    'heading-xl': true;
    'heading-l': true;
    'heading-m': true;
    'heading-s': true;
    'body-l': true;
    'body-m': true;
  }
}

const plus_jakarta_sans = Plus_Jakarta_Sans({
  weight: ['500', '700'],
  style: 'normal',
  subsets: ['latin'],
});

const theme = createTheme({
  palette: {
    primary: {
      main: '#8f4e00',
      onMain: '#ffffff',
      container: '#ffdcc2',
      onContainer: '#2e1500',
    },
    secondary: {
      main: '#745943',
      onMain: '#ffffff',
      container: '#ffdcc2',
      onContainer: '#2a1707',
    },
    tertiary: {
      main: '#5b6237',
      onMain: '#ffffff',
      container: '#e0e7b1',
      onContainer: '#191e00',
    },
    error: {
      main: '#ba1a1a',
      onMain: '#ffffff',
      container: '#ffdad6',
      onContainer: '#410002',
    },
    background: {
      main: '#fffbff',
      onMain: '#201b17',
      surface: '#fffbff',
      onSurface: '#201b17',
      surfaceVariant: '#f3dfd1',
      onSurfaceVariant: '#51443b',
    },
    outline: '#847469',
  },
  typography: {
    fontFamily: plus_jakarta_sans.style.fontFamily,
    'heading-xl': {
      fontSize: '1.5rem',
      fontWeight: 700,
      lineHeight: 1.25,
    },
    'heading-l': {
      fontSize: '1.125rem',
      fontWeight: 700,
      lineHeight: 1.2777,
    },
    'heading-m': {
      fontSize: '0.9375rem',
      fontWeight: 700,
      lineHeight: 1.2666,
    },
    'heading-s': {
      fontSize: '0.75rem',
      fontWeight: 700,
      lineHeight: 1.25,
      letterSpacing: '0.2em',
    },
    'body-l': {
      fontSize: '0.8125rem',
      fontWeight: 500,
      lineHeight: 1.7692,
    },
    'body-m': {
      fontSize: '0.75rem',
      fontWeight: 700,
      lineHeight: 1.25,
    },
  },
  spacing: (factor: number) => `${0.25 * factor}rem`,
});

export default theme;
