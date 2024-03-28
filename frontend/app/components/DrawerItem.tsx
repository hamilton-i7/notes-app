import React from 'react';
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import Link from 'next/link';
import { Destination } from '../lib/models/destination.model';

type DrawerItemProps = {
  destination: Destination;
  selected?: boolean;
  onClick?: () => void;
};

export default function DrawerItem({
  destination,
  selected = false,
  onClick = () => {},
}: DrawerItemProps) {
  return (
    <ListItem disablePadding>
      <ListItemButton
        href={destination.href}
        LinkComponent={Link}
        selected={selected}
        onClick={onClick}
      >
        <ListItemIcon>{destination.icon}</ListItemIcon>
        <ListItemText primary={destination.text} />
      </ListItemButton>
    </ListItem>
  );
}
