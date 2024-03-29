import { ListItemText, Menu, MenuItem, MenuProps } from '@mui/material';
import React from 'react';

type CategoryMenuProps = MenuProps & {
  onEditClick?: () => void;
  onDeleteClick?: () => void;
};

export default function CategoryMenu({
  open,
  anchorEl,
  onClose,
  onEditClick,
  onDeleteClick,
  ...props
}: CategoryMenuProps) {
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
      <MenuItem onClick={onEditClick}>
        <ListItemText
          disableTypography
          sx={{
            typography: 'body-l',
          }}
        >
          Edit category
        </ListItemText>
      </MenuItem>
      <MenuItem onClick={onDeleteClick}>
        <ListItemText
          disableTypography
          sx={{
            typography: 'body-l',
          }}
        >
          Delete category
        </ListItemText>
      </MenuItem>
    </Menu>
  );
}
