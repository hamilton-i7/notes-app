import { Chip } from '@mui/material';
import { Stack } from '@mui/system';
import React from 'react';
import { Category } from '../models/category.model';

type CategoryChipsProps = {
  categories: Category[];
};

export default function CategoryChips({ categories }: CategoryChipsProps) {
  return (
    <Stack
      direction="row"
      sx={{ flexWrap: 'wrap', gap: (theme) => theme.spacing(2) }}
    >
      {categories.map((category) => (
        <Chip
          key={category.id}
          label={category.name}
          sx={{
            borderRadius: (theme) => theme.spacing(1.5),
            bgcolor: (theme) => theme.palette.tertiary.main,
            color: (theme) => theme.palette.tertiary.onMain,
          }}
        />
      ))}
    </Stack>
  );
}
