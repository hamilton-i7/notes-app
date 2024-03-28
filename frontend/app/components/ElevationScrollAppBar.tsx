import { useScrollTrigger } from '@mui/material';
import { cloneElement } from 'react';

export default function ElevationScrollAppBar({
  children,
}: {
  children: React.ReactElement;
}) {
  const trigger = useScrollTrigger({ disableHysteresis: true, threshold: 0 });
  return cloneElement(children, { elevation: trigger ? 1 : 0 });
}
