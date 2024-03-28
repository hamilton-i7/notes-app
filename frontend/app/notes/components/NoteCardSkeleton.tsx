import { Skeleton } from '@mui/material';
import React from 'react';

export default function NoteCardSkeleton() {
  return (
    <Skeleton
      variant="rectangular"
      sx={{
        width: '100%',
        height: (theme) => theme.spacing(45),
        borderRadius: (theme) => theme.spacing(3),
      }}
    />
  );
}
