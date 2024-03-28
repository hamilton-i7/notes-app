import {
  Menu,
  MenuItem,
  ListItemButton,
  ListItemText,
  MenuProps,
} from '@mui/material';
import React from 'react';

type NoteMenuProps = MenuProps & {
  isArchived: boolean;
  onArchiveToggleClick?: () => void;
  onDeleteClick?: () => void;
};

export default function NoteMenu({
  isArchived,
  onArchiveToggleClick = () => {},
  onDeleteClick = () => {},
  anchorEl,
  open,
  onClose,
  ...props
}: NoteMenuProps) {
  return (
    <Menu
      id="note-menu"
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      elevation={2}
      sx={{
        minWidth: (theme) => theme.spacing(48),
        '& .MuiPaper-root': {
          backgroundColor: 'common.white',
          minWidth: (theme) => theme.spacing(48),
          borderRadius: (theme) => theme.spacing(2),
        },
      }}
      {...props}
    >
      <MenuItem onClick={onArchiveToggleClick} disableGutters>
        <ListItemButton>
          <ListItemText disableTypography sx={{ typography: 'body-l' }}>
            {isArchived ? 'Unarchive' : 'Archive'}
          </ListItemText>
        </ListItemButton>
      </MenuItem>
      <MenuItem onClick={onDeleteClick}>
        <ListItemText
          disableTypography
          sx={{
            typography: 'body-l',
          }}
        >
          Delete
        </ListItemText>
      </MenuItem>
    </Menu>
  );
}
