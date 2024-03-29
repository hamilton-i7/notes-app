import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';
import React from 'react';
import { useDeleteCategory } from '../categories.hook';
import { useRouter } from 'next/navigation';

type DeleteCategoryDialogProps = {
  id: number;
  open: boolean;
  onClose: () => void;
};

export default function DeleteCategoryDialog({
  id,
  open,
  onClose,
}: DeleteCategoryDialogProps) {
  const { mutate: deleteCategory } = useDeleteCategory();
  const router = useRouter();

  const handleDeleteNote = () => {
    deleteCategory(id, {
      onSuccess: () => {
        onClose();
        router.replace('/notes');
      },
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="delete-category-dialog-title"
      aria-describedby="delete-category-dialog-description"
      sx={{
        '& .MuiPaper-root': {
          borderRadius: (theme) => theme.spacing(6),
        },
      }}
    >
      <DialogTitle
        id="delete-category-dialog-title"
        variant="heading-l"
        component="h2"
        sx={{
          p: (theme) => theme.spacing(6),
          color: (theme) => theme.palette.error.onContainer,
        }}
      >
        Delete this category?
      </DialogTitle>
      <DialogContent>
        <DialogContentText
          id="delete-category-dialog-description"
          variant="body-l"
          sx={{ color: (theme) => theme.palette.outline }}
        >
          Are you sure you want to delete this category? The category will be
          removed from all notes related to it.
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
