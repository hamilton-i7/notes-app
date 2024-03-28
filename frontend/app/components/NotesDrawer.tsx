'use client';

import React, { useState, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Stack } from '@mui/material';
import {
  Archive,
  Home,
  LabelOutlined,
  TipsAndUpdates,
} from '@mui/icons-material';
import DrawerItem from './DrawerItem';
import { Destination } from '../lib/models/destination.model';
import { usePathname, useSearchParams } from 'next/navigation';
import ElevationScrollAppBar from './ElevationScrollAppBar';
import BackgroundColorScrollToolbar from './BackgroundColorScrollToolbar';
import { useGetCategories } from '../categories/categories.hook';

const drawerWidth = 280;

interface NotesDrawerProps {
  children: React.ReactNode;
}

export default function NotesDrawer({ children }: NotesDrawerProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [currentURL, setCurrentURL] = useState('');

  const [mobileOpen, setMobileOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const { data: categories, isPending, isError, error } = useGetCategories();

  const mainDestinations: Destination[] = [
    { icon: <Home />, text: 'Home', href: '/notes', path: '/notes' },
    {
      icon: <Archive />,
      text: 'Archive',
      href: '/notes/archive',
      path: '/notes/archive',
    },
  ];
  const [categoryDestinations, setCategoryDestinations] = useState<
    (Destination & { id: number })[]
  >([]);
  const [currentPageTitle, setCurrentPageTitle] = useState('');

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  useEffect(() => {
    if (searchParams.has('categories') && categories) {
      const categoryId = searchParams.get('categories')!;
      setCurrentPageTitle(
        categories.find(({ id }) => id === +categoryId)?.name ?? ''
      );
      return;
    }

    switch (pathname) {
      case '/notes':
        setCurrentPageTitle('Home');
        break;
      case '/notes/archive':
        setCurrentPageTitle('Archive');
    }
  }, [pathname, searchParams, categories]);

  useEffect(() => {
    if (!categories) return;
    setCategoryDestinations(
      categories.map((category) => ({
        id: category.id,
        icon: <LabelOutlined />,
        text: category.name,
        href: `/notes?categories=${category.id}`,
        path: `/notes?categories=${category.id}`,
      }))
    );
  }, [categories]);

  useEffect(() => {
    if (searchParams.has('categories')) {
      const categoryId = searchParams.get('categories')!;
      setCurrentURL(`${pathname}?categories=${categoryId}`);
      return;
    }
    setCurrentURL(pathname);
  }, [pathname, searchParams]);

  const drawer = (
    <aside>
      <Stack
        direction="row"
        alignItems="center"
        spacing={2}
        sx={{
          p: (theme) => theme.spacing(6, 4),
        }}
      >
        <Typography variant="heading-xl" component="div">
          NotesApp
        </Typography>
        <TipsAndUpdates fontSize="large" />
      </Stack>
      <Divider />
      <List>
        {mainDestinations.map((destination, index) => (
          <DrawerItem
            key={index}
            destination={destination}
            selected={currentURL === destination.path}
            onClick={handleDrawerClose}
          />
        ))}
      </List>
      <Divider />
      <Typography
        variant="body-m"
        component="h4"
        sx={{ m: (theme) => theme.spacing(4, 4, 0) }}
      >
        Categories
      </Typography>
      <List>
        {isPending && <div>Loading categories...</div>}
        {isError && <div>Error fetching categories: {error.message}</div>}
        {categoryDestinations.map((category) => (
          <DrawerItem
            key={category.id}
            destination={category}
            selected={currentURL === category.path}
            onClick={handleDrawerClose}
          />
        ))}
      </List>
    </aside>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <ElevationScrollAppBar>
        <AppBar
          position="fixed"
          sx={{
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            ml: { sm: `${drawerWidth}px` },
            color: (theme) => theme.palette.background.onSurface,
          }}
        >
          <BackgroundColorScrollToolbar>
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{
                  mx: (theme) => theme.spacing(2),
                  display: { sm: 'none' },
                }}
              >
                <MenuIcon />
              </IconButton>
              <Typography
                variant="heading-l"
                noWrap
                component="h1"
                color="inherit"
              >
                {currentPageTitle}
              </Typography>
            </Toolbar>
          </BackgroundColorScrollToolbar>
        </AppBar>
      </ElevationScrollAppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              bgcolor: (theme) => theme.palette.background.surface,
              borderTopRightRadius: (theme) => theme.spacing(8),
              borderBottomRightRadius: (theme) => theme.spacing(8),
              color: (theme) => theme.palette.outline,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}
