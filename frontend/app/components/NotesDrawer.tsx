'use client';

import React, { useState, cloneElement, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MailIcon from '@mui/icons-material/Mail';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Stack, Theme, useScrollTrigger } from '@mui/material';
import { Archive, Home, TipsAndUpdates } from '@mui/icons-material';
import DrawerItem from './DrawerItem';
import { Destination } from '../lib/models/destination.model';
import { usePathname } from 'next/navigation';

const drawerWidth = 280;

interface NotesDrawerProps {
  children: React.ReactNode;
}

function BackgroundColorScrollToolbar({
  children,
}: {
  children: React.ReactElement;
}) {
  const trigger = useScrollTrigger({ disableHysteresis: true, threshold: 0 });
  return cloneElement(children, {
    sx: trigger
      ? { bgcolor: (theme: Theme) => theme.palette.background.surfaceVariant }
      : { bgcolor: (theme: Theme) => theme.palette.background.main },
  });
}

function ElevationScrollAppBar({ children }: { children: React.ReactElement }) {
  const trigger = useScrollTrigger({ disableHysteresis: true, threshold: 0 });
  return cloneElement(children, { elevation: trigger ? 1 : 0 });
}

export default function NotesDrawer({ children }: NotesDrawerProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const mainDestinations: Destination[] = [
    { icon: <Home />, text: 'Home', href: '/notes', path: '/notes' },
    {
      icon: <Archive />,
      text: 'Archive',
      href: '/notes/archive',
      path: '/notes/archive',
    },
  ];
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
    switch (pathname) {
      case '/notes':
        setCurrentPageTitle('Home');
        break;
      case '/notes/archive':
        setCurrentPageTitle('Archive');
    }
  }, [pathname]);

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
            selected={pathname === destination.path}
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
        {['All mail', 'Trash', 'Spam'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
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
                sx={{ mx: 2, display: { sm: 'none' } }}
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
        component="main"
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
