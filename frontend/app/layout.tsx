import type { Metadata } from 'next';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import Providers from './providers';
import theme from './lib/theme';
import NotesDrawer from './components/NotesDrawer';

export const metadata: Metadata = {
  title: 'Notes App',
  description: 'Challenge by Ensolvers',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <AppRouterCacheProvider>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <NotesDrawer>{children}</NotesDrawer>
            </ThemeProvider>
          </AppRouterCacheProvider>
        </Providers>
      </body>
    </html>
  );
}
