import React, { useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { useGetCategory, useUpdateCategory } from '../categories.hook';
import { UpdateCategoryDto } from '../dto/update-category.dto';

type EditCategoryDialogProps = {
  id: number;
  open: boolean;
  onClose?: () => void;
};

export default function EditCategoryDialog({
  id,
  open,
  onClose = () => {},
}: EditCategoryDialogProps) {
  const { data: category } = useGetCategory(id);
  const { mutate: updateCategory } = useUpdateCategory();
  const [name, setName] = useState('');

  const handleNameChange = (text: string) => {
    setName(text);
  };

  const handleUpdateCategory = () => {
    const categoryDto: UpdateCategoryDto = { name };

    updateCategory(
      { id: category!.id, category: categoryDto },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  useEffect(() => {
    if (!category) return;
    setName(category.name);
  }, [category]);

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
        Edit category
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
          onClick={handleUpdateCategory}
          sx={{ typography: 'body-l', textTransform: 'capitalize' }}
        >
          Edit
        </Button>
      </DialogActions>
    </Dialog>
  );
}
