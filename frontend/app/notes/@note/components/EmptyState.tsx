import React from 'react';
import { Description } from '@mui/icons-material';
import { Stack, Typography } from '@mui/material';

export default function EmptyState() {
  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      sx={{
        display: { xs: 'none', lg: 'flex' },
        borderLeft: (theme) =>
          `${theme.spacing(0.25)} solid ${theme.palette.outline}`,
        p: (theme) => theme.spacing(4),
        textAlign: 'center',
        flex: { lg: 2 },
      }}
    >
      <Description
        sx={{
          fontSize: (theme) => theme.spacing(20),
          mb: (theme) => theme.spacing(3),
        }}
      />
      <Typography
        variant="heading-l"
        component="h2"
        sx={{ mb: (theme) => theme.spacing(3) }}
      >
        Select a note to view
      </Typography>
      <Typography
        paragraph
        variant="body-l"
        sx={{ color: (theme) => theme.palette.background.onSurfaceVariant }}
      >
        Choose a note from the list on the left to view its contents, or create
        a new note to add to your collection.
      </Typography>
    </Stack>
  );
}
