import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';
import React, { useContext } from 'react';
import { NotesContext } from '../../NotesContext';
import { useDeleteNote } from '../../notes.hook';

type DeleteNoteDialogProps = {
  open: boolean;
  onClose: () => void;
};

export default function DeleteNoteDialog({
  open,
  onClose,
}: DeleteNoteDialogProps) {
  const { currentNoteId, setCurrentNoteId } = useContext(NotesContext);
  const { mutate: deleteNote } = useDeleteNote();

  const handleDeleteNote = () => {
    deleteNote(currentNoteId!, {
      onSuccess: () => {
        onClose();
        setCurrentNoteId(null);
      },
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="delete-note-dialog-title"
      aria-describedby="delete-note-dialog-description"
      sx={{
        '& .MuiPaper-root': {
          borderRadius: (theme) => theme.spacing(6),
        },
      }}
    >
      <DialogTitle
        id="delete-note-dialog-title"
        variant="heading-l"
        component="h2"
        sx={{
          p: (theme) => theme.spacing(6),
          color: (theme) => theme.palette.error.onContainer,
        }}
      >
        Delete this note?
      </DialogTitle>
      <DialogContent>
        <DialogContentText
          id="delete-note-dialog-description"
          variant="body-l"
          sx={{ color: (theme) => theme.palette.outline }}
        >
          Are you sure you want to delete this note? This action cannot be
          reversed.
        </DialogContentText>
      </DialogContent>
      <DialogActions
        sx={{
          justifyContent: 'end',
          gap: (theme) => theme.spacing(6),
          p: (theme) => theme.spacing(4),
        }}
      >
        <Button
          autoFocus
          onClick={onClose}
          sx={{ typography: 'body-l', textTransform: 'capitalize' }}
        >
          Cancel
        </Button>
        <Button
          variant="text"
          onClick={handleDeleteNote}
          sx={{ typography: 'body-l', textTransform: 'capitalize' }}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
