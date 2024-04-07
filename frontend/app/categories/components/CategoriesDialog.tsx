import React, { useContext, useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
  Skeleton,
  Typography,
  DialogContentText,
} from '@mui/material';
import { useGetCategories } from '../categories.hook';
import { NotesContext } from '@/app/notes/NotesContext';
import { Category } from '../models/category.model';
import { useGetNote, useUpdateNote } from '@/app/notes/notes.hook';
import { UpdateNoteDto } from '@/app/notes/dto/update-note.dto';
import { useQueryClient } from '@tanstack/react-query';
import { NOTES_KEY } from '@/app/lib/constants';

type CategoriesDialogProps = {
  open: boolean;
  onClose?: () => void;
};

export default function CategoriesDialog({
  open,
  onClose = () => {},
}: CategoriesDialogProps) {
  const { currentNoteId } = useContext(NotesContext);

  const {
    data: categories,
    isSuccess,
    isPending,
    isError,
    error,
  } = useGetCategories();
  const { data: note } = useGetNote(currentNoteId, !!currentNoteId);
  const { mutate: updateNote } = useUpdateNote();
  const queryClient = useQueryClient();

  const [selectedCategories, setSelectedCategories] = useState<{
    [id: number]: Category | null;
  }>({});

  const handleSelect = (id: number, category: Category) => {
    if (selectedCategories[id]) {
      setSelectedCategories((prev) => ({ ...prev, [id]: null }));
      return;
    }
    setSelectedCategories((prev) => ({ ...prev, [id]: category }));
  };

  const handleSave = () => {
    const noteDto: UpdateNoteDto = {
      categories: Object.keys(selectedCategories)
        .filter((id) => selectedCategories[+id])
        .map((id) => +id),
    };

    updateNote(
      { id: note!.id, note: noteDto },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  const emptyContent = (
    <>
      <DialogTitle>No categories yet!</DialogTitle>
      <DialogContent>
        <DialogContentText
          variant="body-l"
          sx={{ color: (theme) => theme.palette.outline }}
        >
          Oops! It looks like there are no categories available. Why not create
          a category to get started?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          autoFocus
          onClick={onClose}
          sx={{ typography: 'body-l', textTransform: 'capitalize' }}
        >
          Ok
        </Button>
      </DialogActions>
    </>
  );

  const content = (
    <>
      <DialogTitle>Categories</DialogTitle>
      <DialogContent dividers>
        <FormGroup>
          {isPending &&
            Array.from(Array(5)).map((_, i) => (
              <Typography key={i} variant="heading-xl">
                <Skeleton />
              </Typography>
            ))}
          {isError && <div>Error {error.message}</div>}
          {isSuccess &&
            categories.map((category) => (
              <FormControlLabel
                key={category.id}
                control={
                  <Checkbox
                    checked={Boolean(selectedCategories[category.id])}
                    onChange={() => handleSelect(category.id, category)}
                  />
                }
                label={category.name}
              />
            ))}
        </FormGroup>
      </DialogContent>
      <DialogActions>
        <Button
          autoFocus
          onClick={onClose}
          sx={{ typography: 'body-l', textTransform: 'capitalize' }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          sx={{ typography: 'body-l', textTransform: 'capitalize' }}
        >
          Save
        </Button>
      </DialogActions>
    </>
  );

  useEffect(() => {
    if (!categories || !note) return;
    setSelectedCategories(
      note.categories.reduce(
        (acc, curr) => ({
          ...acc,
          [curr.id]: curr,
        }),
        {}
      )
    );
  }, [categories, note]);

  return (
    <Dialog
      sx={{
        '& .MuiDialog-paper': {
          width: '80%',
          maxHeight: 435,
          borderRadius: (theme) => theme.spacing(6),
        },
      }}
      maxWidth="xs"
      open={open}
      onClose={onClose}
    >
      {categories && categories.length ? content : emptyContent}
    </Dialog>
  );
}
