import { Menu, MenuItem, ListItemText, MenuProps } from '@mui/material';
import React from 'react';

type HeadingsMenuProps = MenuProps & {
  isHeading1Selected?: boolean;
  onHeading1Click?: () => void;
  isHeading2Selected?: boolean;
  onHeading2Click?: () => void;
};

export default function HeadingsMenu({
  open,
  anchorEl,
  onClose,
  onHeading1Click,
  isHeading1Selected,
  onHeading2Click,
  isHeading2Selected,
  ...props
}: HeadingsMenuProps) {
  return (
    <Menu
      id="headings-menu"
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
      <MenuItem onClick={onHeading1Click} selected={isHeading1Selected}>
        <ListItemText
          disableTypography
          sx={{
            typography: 'heading-xl',
          }}
        >
          Heading 1
        </ListItemText>
      </MenuItem>
      <MenuItem onClick={onHeading2Click} selected={isHeading2Selected}>
        <ListItemText
          disableTypography
          sx={{
            typography: 'heading-l',
          }}
        >
          Heading 2
        </ListItemText>
      </MenuItem>
    </Menu>
  );
}
