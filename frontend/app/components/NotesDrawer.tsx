'use client';

import React, { useState, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Button, Stack, useMediaQuery, useTheme } from '@mui/material';
import {
  Add,
  Archive,
  Home,
  LabelOutlined,
  MoreVert,
  TipsAndUpdates,
} from '@mui/icons-material';
import DrawerItem from './DrawerItem';
import { Destination } from '../lib/models/destination.model';
import { usePathname, useSearchParams } from 'next/navigation';
import ElevationScrollAppBar from './ElevationScrollAppBar';
import BackgroundColorScrollToolbar from './BackgroundColorScrollToolbar';
import { useGetCategories } from '../categories/categories.hook';
import DrawerItemSkeleton from './DrawerItemSkeleton';
import CreateCategoryDialog from '../categories/components/CreateCategoryDialog';
import CategoryMenu from '../categories/components/CategoryMenu';
import EditCategoryDialog from '../categories/components/EditCategoryDialog';
import DeleteCategoryDialog from '../categories/components/DeleteCategoryDialog';

const drawerWidth = 280;

interface NotesDrawerProps {
  children: React.ReactNode;
}

export default function NotesDrawer({ children }: NotesDrawerProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isCategoryScreen = searchParams.has('categories');

  const [currentURL, setCurrentURL] = useState('');

  const [mobileOpen, setMobileOpen] = useState(false);

  const theme = useTheme();
  const isBeyondSmallScreen = useMediaQuery(theme.breakpoints.up('sm'));

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

  const [showCreateCategoryDialog, setShowCreateCategoryDialog] =
    useState(false);

  const [showEditCategoryDialog, setShowEditCategoryDialog] = useState(false);
  const [showDeleteCategoryDialog, setShowDeleteCategoryDialog] =
    useState(false);

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const openOptionsMenu = Boolean(anchorEl);

  const handleDrawerClose = () => {
    setMobileOpen(false);
  };

  const handleDrawerOpen = () => {
    setMobileOpen(true);
  };

  const handleCreateCategoryClick = () => {
    handleDrawerClose();
    setShowCreateCategoryDialog(true);
  };

  const handleCreateCategoryClose = () => {
    setShowCreateCategoryDialog(false);
  };

  const handleOptionsClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseOptionsMenu = () => {
    setAnchorEl(null);
  };

  const handleEditCategoryClick = () => {
    handleCloseOptionsMenu();
    setShowEditCategoryDialog(true);
  };

  const handleEditCategoryClose = () => {
    setShowEditCategoryDialog(false);
  };

  const handleDeleteCategoryClick = () => {
    handleCloseOptionsMenu();
    setShowDeleteCategoryDialog(true);
  };

  const handleDeleteCategoryClose = () => {
    setShowDeleteCategoryDialog(false);
  };

  useEffect(() => {
    if (isCategoryScreen && categories) {
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
  }, [pathname, searchParams, categories, isCategoryScreen]);

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
    if (isCategoryScreen) {
      const categoryId = searchParams.get('categories')!;
      setCurrentURL(`${pathname}?categories=${categoryId}`);
      return;
    }
    setCurrentURL(pathname);
  }, [pathname, searchParams, isCategoryScreen]);

  useEffect(() => {
    if (!isBeyondSmallScreen) return;
    setMobileOpen(false);
  }, [isBeyondSmallScreen]);

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
        {isPending && (
          <>
            {Array.from(Array(5)).map((_, i) => (
              <DrawerItemSkeleton key={i} />
            ))}
          </>
        )}
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
      <Button
        startIcon={<Add />}
        onClick={handleCreateCategoryClick}
        sx={{
          typography: 'body-l',
          textTransform: 'capitalize',
          m: (theme) => theme.spacing(0, 2, 4),
        }}
      >
        Create new category
      </Button>
    </aside>
  );

  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <ElevationScrollAppBar>
          <AppBar
            position="fixed"
            sx={{
              width: { sm: `calc(100% - ${drawerWidth}px)` },
              ml: { sm: `${drawerWidth}px` },
              color: (theme) => theme.palette.background.onSurface,
              display: { lg: 'none' },
            }}
          >
            <BackgroundColorScrollToolbar>
              <Toolbar>
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleDrawerOpen}
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
                  sx={{ flex: 1 }}
                >
                  {currentPageTitle}
                </Typography>
                {isCategoryScreen && (
                  <>
                    <IconButton
                      color="inherit"
                      onClick={handleOptionsClick}
                      aria-label="show category options menu"
                      sx={{ mx: (theme) => theme.spacing(2) }}
                    >
                      <MoreVert />
                    </IconButton>
                    <CategoryMenu
                      anchorEl={anchorEl}
                      open={openOptionsMenu}
                      onClose={handleCloseOptionsMenu}
                      onEditClick={handleEditCategoryClick}
                      onDeleteClick={handleDeleteCategoryClick}
                    />
                  </>
                )}
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
            p: { sm: 3, lg: 0 },
            width: { sm: `calc(100% - ${drawerWidth}px)` },
          }}
        >
          <Toolbar sx={{ display: { lg: 'none' } }} />
          {children}
        </Box>
      </Box>
      <CreateCategoryDialog
        open={showCreateCategoryDialog}
        onClose={handleCreateCategoryClose}
      />
      <EditCategoryDialog
        id={+searchParams.get('categories')!}
        open={showEditCategoryDialog}
        onClose={handleEditCategoryClose}
      />
      <DeleteCategoryDialog
        id={+searchParams.get('categories')!}
        open={showDeleteCategoryDialog}
        onClose={handleDeleteCategoryClose}
      />
    </>
  );
}
