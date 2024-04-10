'use client';

import React, { useContext, useEffect, useState } from 'react';
import { NotesContext } from '../NotesContext';
import {
  Dialog,
  AppBar,
  Toolbar,
  IconButton,
  Button,
  Slide,
  Stack,
  Snackbar,
  Box,
  Tooltip,
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import {
  Close,
  DoneOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  MoreVert,
} from '@mui/icons-material';
import ElevationScrollAppBar from '@/app/components/ElevationScrollAppBar';
import BackgroundColorScrollToolbar from '@/app/components/BackgroundColorScrollToolbar';
import NoteContent from './components/NoteContent';
import NoteMenu from './components/NoteMenu';
import DeleteNoteDialog from './components/DeleteNoteDialog';
import { useGetNote, useUpdateNote } from '../notes.hook';
import { UpdateNoteDto } from '../dto/update-note.dto';
import CategoriesDialog from '@/app/categories/components/CategoriesDialog';
import EmptyState from './components/EmptyState';
import NoteContentSkeleton from './components/NoteContentSkeleton';
import { Category } from '@/app/categories/models/category.model';
import { useGetCategories } from '@/app/categories/categories.hook';

const SNACKBAR_DURATION_MILLIS = 3_000;

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function PermanentContentWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Box
      sx={{
        display: { xs: 'none', lg: 'flex' },
        flexDirection: { lg: 'column' },
        flex: { lg: 1 },
        borderLeft: (theme) =>
          `${theme.spacing(0.25)} solid ${theme.palette.outline}`,
      }}
    >
      {children}
    </Box>
  );
}

export default function NotePage() {
  const { currentNoteId, setCurrentNoteId } = useContext(NotesContext);
  const {
    data: note,
    isPending,
    isError,
    error,
  } = useGetNote(currentNoteId, !!currentNoteId);
  const { data: categories } = useGetCategories();
  const { mutate: updateNote } = useUpdateNote();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [noteCategories, setNoteCategories] = useState<Category[]>([]);

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const openOptionsMenu = Boolean(anchorEl);

  const [openDeleteNoteDialog, setOpenDeleteNoteDialog] = useState(false);
  const [openCategoriesDialog, setOpenCategoriesDialog] = useState(false);

  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [useSnackbarAction, setUseSnackbarAction] = useState(false);

  const handleTitleChange = (text: string) => {
    setTitle(text);
  };

  const handleContentChange = (text: string) => {
    setContent(text);
  };

  const handleClose = () => {
    setCurrentNoteId(null);
  };

  const handleOptionsClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseOptionsMenu = () => {
    setAnchorEl(null);
  };

  const handleCloseDeleteNoteDialog = () => {
    setOpenDeleteNoteDialog(false);
  };

  const handleCloseCategoriesDialog = () => {
    setOpenCategoriesDialog(false);
  };

  const handleCloseSnakbar = () => {
    setShowSnackbar(false);
  };

  const handleUpdateNote = () => {
    const noteDto: UpdateNoteDto = {
      title,
      content,
    };

    updateNote(
      { id: note!.id, note: noteDto },
      {
        onSuccess: () => {
          setSnackbarMessage('Note updated 😊');
          setUseSnackbarAction(false);
          setShowSnackbar(true);
        },
      }
    );
  };

  const handleFavoriteToggle = () => {
    const favorite = !note!.favorite;
    const message = favorite
      ? 'Added to favorites 💖'
      : 'Removed from favorites 💔';
    const noteDto: UpdateNoteDto = { favorite };

    updateNote(
      { id: note!.id, note: noteDto },
      {
        onSuccess: () => {
          setSnackbarMessage(message);
          setUseSnackbarAction(false);
          setShowSnackbar(true);
        },
      }
    );
  };

  const handleArchiveToggle = () => {
    handleCloseOptionsMenu();

    const archivedAt = note!.archivedAt
      ? null
      : new Date(Date.now()).toISOString();
    const message = archivedAt ? 'Note archived 😟' : 'Note restored 😃';
    const noteDto: UpdateNoteDto = { archivedAt };

    updateNote(
      { id: note!.id, note: noteDto },
      {
        onSuccess: () => {
          setSnackbarMessage(message);
          setUseSnackbarAction(true);
          setShowSnackbar(true);
        },
      }
    );
  };

  const handleCategoriesClick = () => {
    handleCloseOptionsMenu();
    setOpenCategoriesDialog(true);
  };

  const handleDeleteClick = () => {
    handleCloseOptionsMenu();
    setOpenDeleteNoteDialog(true);
  };

  const handleUndoArchiveToggle = () => {
    handleCloseSnakbar();

    const archivedAt = note!.archivedAt
      ? null
      : new Date(Date.now()).toISOString();
    const noteDto: UpdateNoteDto = { archivedAt };

    updateNote({ id: note!.id, note: noteDto });
  };

  const topBar = (
    <ElevationScrollAppBar>
      <AppBar
        sx={{
          position: 'relative',
          color: (theme) => theme.palette.background.onSurface,
        }}
      >
        <BackgroundColorScrollToolbar sx={{ justifyContent: 'space-between' }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
              sx={{ mx: (theme) => theme.spacing(2) }}
            >
              <Close />
            </IconButton>
            <Stack
              direction="row"
              alignItems="center"
              spacing={4}
              sx={{ color: (theme) => theme.palette.background.onSurface }}
            >
              <Tooltip title="Save">
                <IconButton
                  edge="end"
                  color="inherit"
                  onClick={handleUpdateNote}
                  aria-label="save"
                >
                  <DoneOutlined />
                </IconButton>
              </Tooltip>

              <Tooltip
                title={note?.favorite ? 'Unfavorite note' : 'Favorite note'}
              >
                <IconButton
                  edge="end"
                  color="inherit"
                  onClick={handleFavoriteToggle}
                  aria-label="Toggle favorite"
                >
                  {note?.favorite ? (
                    <FavoriteOutlined />
                  ) : (
                    <FavoriteBorderOutlined />
                  )}
                </IconButton>
              </Tooltip>

              <IconButton
                edge="end"
                color="inherit"
                onClick={handleOptionsClick}
                aria-label="more options"
              >
                <MoreVert />
              </IconButton>
              <NoteMenu
                anchorEl={anchorEl}
                isArchived={Boolean(note?.archivedAt)}
                open={openOptionsMenu}
                onClose={handleCloseOptionsMenu}
                onArchiveToggleClick={handleArchiveToggle}
                onDeleteClick={handleDeleteClick}
                onCategoriesClick={handleCategoriesClick}
              />
            </Stack>
          </Toolbar>
        </BackgroundColorScrollToolbar>
      </AppBar>
    </ElevationScrollAppBar>
  );

  const snackbarAction = (
    <Button size="small" onClick={handleUndoArchiveToggle}>
      Undo
    </Button>
  );

  useEffect(() => {
    if (!note) return;
    setTitle(note.title);
    setContent(note.content);
  }, [note]);

  useEffect(() => {
    if (!categories || !note) return;

    const noteCategoryIds: { [id: number]: Category } = note.categories.reduce(
      (acc, curr) => ({ ...acc, [curr.id]: curr }),
      {}
    );
    setNoteCategories(categories.filter(({ id }) => noteCategoryIds[id]));
  }, [categories, note]);

  useEffect(() => {
    if (!currentNoteId && showSnackbar) {
      setShowSnackbar(false);
    }
  }, [currentNoteId, showSnackbar]);

  if (!currentNoteId) {
    return <EmptyState />;
  }

  if (isPending) {
    return (
      <PermanentContentWrapper>
        {topBar}
        <NoteContentSkeleton />
      </PermanentContentWrapper>
    );
  }

  if (isError) {
    return <div>Error {error.message}</div>;
  }

  const pageContent = (
    <NoteContent
      title={title}
      onTitleChange={handleTitleChange}
      dateCreated={note.createdAt}
      lastModified={note.lastModified}
      categories={noteCategories}
    />
  );

  return (
    <>
      <Dialog
        fullScreen
        open
        onClose={handleClose}
        TransitionComponent={Transition}
        sx={{
          display: { xs: 'block', lg: 'none' },
          '& .MuiPaper-root': {
            bgcolor: (theme) => theme.palette.background.surface,
          },
        }}
      >
        {topBar}
        {pageContent}
      </Dialog>

      <PermanentContentWrapper>
        {topBar}
        {pageContent}
      </PermanentContentWrapper>

      <CategoriesDialog
        open={openCategoriesDialog}
        onClose={handleCloseCategoriesDialog}
      />
      <DeleteNoteDialog
        open={openDeleteNoteDialog}
        onClose={handleCloseDeleteNoteDialog}
      />
      <Snackbar
        open={showSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        autoHideDuration={SNACKBAR_DURATION_MILLIS}
        onClose={handleCloseSnakbar}
        message={snackbarMessage}
        action={useSnackbarAction ? snackbarAction : null}
      />
    </>
  );
}
