import React, { useEffect, useState } from 'react';
import { CreateCategoryDto } from '../dto/create-category.dto';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { useCreateCategory } from '../categories.hook';

type CreateCategoryDialogProps = {
  open: boolean;
  onClose?: () => void;
};

export default function CreateCategoryDialog({
  open,
  onClose = () => {},
}: CreateCategoryDialogProps) {
  const { mutate: createCategory } = useCreateCategory();
  const [name, setName] = useState('');

  const handleNameChange = (text: string) => {
    setName(text);
  };

  const handleCreateCategory = () => {
    const category: CreateCategoryDto = { name };

    createCategory(category, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  useEffect(() => {
    if (open) {
      // Reset state when opening the dialog
      setName('');
    }
  }, [open]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        component: 'form',
        sx: { width: '100%', maxWidth: (theme) => theme.spacing(120) },
      }}
    >
      <DialogTitle
        variant="heading-l"
        component="h2"
        sx={{
          textTransform: 'capitalize',
          color: (theme) => theme.palette.background.onSurface,
        }}
      >
        Add new category
      </DialogTitle>
      <DialogContent>
        <TextField
          id="column-name-input"
          variant="outlined"
          label="Category name"
          fullWidth
          value={name}
          onChange={(event) => handleNameChange(event.target.value)}
          sx={{ mt: (theme) => theme.spacing(4) }}
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          sx={{ typography: 'body-l', textTransform: 'capitalize' }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleCreateCategory}
          sx={{ typography: 'body-l', textTransform: 'capitalize' }}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}
