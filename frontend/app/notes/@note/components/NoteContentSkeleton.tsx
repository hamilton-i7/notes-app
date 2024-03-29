import { Box, Skeleton, Typography } from '@mui/material';

import React from 'react';
export default function NoteContentSkeleton() {
  return (
    <Box sx={{ px: (theme) => theme.spacing(4) }}>
      <Typography variant="body-m">
        <Skeleton sx={{ mb: (theme) => theme.spacing(4), width: '20%' }} />
      </Typography>

      <Typography variant="heading-xl">
        <Skeleton sx={{ mb: (theme) => theme.spacing(4), width: '50%' }} />
      </Typography>
      <Skeleton
        variant="rectangular"
        sx={{ width: '100%', height: (theme) => theme.spacing(40) }}
      />
    </Box>
  );
}
