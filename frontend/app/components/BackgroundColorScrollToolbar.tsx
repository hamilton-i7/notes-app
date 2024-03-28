import { SxProps, Theme, useScrollTrigger } from '@mui/material';
import { cloneElement } from 'react';

export default function BackgroundColorScrollToolbar({
  children,
  sx,
}: {
  children: React.ReactElement;
  sx: SxProps<Theme>;
}) {
  const trigger = useScrollTrigger({ disableHysteresis: true, threshold: 0 });
  return cloneElement(children, {
    sx: trigger
      ? {
          bgcolor: (theme: Theme) => theme.palette.background.surfaceVariant,
          ...sx,
        }
      : { bgcolor: (theme: Theme) => theme.palette.background.main, ...sx },
  });
}
