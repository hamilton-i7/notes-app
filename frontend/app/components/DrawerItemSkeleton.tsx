import React from 'react';
import { Skeleton } from '@mui/material';

export default function DrawerItemSkeleton() {
  return (
    <Skeleton
      sx={{
        fontSize: (theme) => theme.spacing(12),
        mx: (theme) => theme.spacing(4),
      }}
    />
  );
}
