import React from 'react';
import {
  Popper,
  Grow,
  Paper,
  ClickAwayListener,
  PopperProps,
  Typography,
  Box,
  Stack,
  Button,
  TextField,
} from '@mui/material';

type LinkPopperProps = PopperProps & {
  href: string;
  onHrefChange?: (href: string) => void;
  onClose?: (event: Event | React.SyntheticEvent) => void;
  onSaveLink?: () => void;
};

export default function LinkPopper({
  open,
  anchorEl,
  href,
  onHrefChange = () => {},
  onClose = () => {},
  onSaveLink = () => {},
}: LinkPopperProps) {
  return (
    <Popper
      open={open}
      anchorEl={anchorEl}
      role="dialog"
      placement="top"
      transition
      sx={{
        width: '100%',
        maxWidth: (theme) => theme.spacing(105),
        zIndex: (theme) => theme.zIndex.modal,
        px: (theme) => ({ xs: theme.spacing(4), sm: 0 }),
      }}
    >
      {({ TransitionProps }) => (
        <Grow
          {...TransitionProps}
          style={{
            transformOrigin: 'left bottom',
          }}
        >
          <Paper
            elevation={2}
            sx={{
              width: '100%',
              p: (theme) => theme.spacing(4),
              color: (theme) => theme.palette.background.onSurface,
              bgcolor: (theme) => theme.palette.background.surface,
            }}
          >
            <ClickAwayListener onClickAway={onClose}>
              <Box>
                <Typography
                  variant="heading-l"
                  component="h3"
                  sx={{ mb: (theme) => theme.spacing(4) }}
                >
                  Edit link
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  label="Link *"
                  value={href}
                  onChange={(event) => onHrefChange(event.target.value)}
                />
              </Box>
            </ClickAwayListener>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="end"
              spacing={2}
              sx={{ mt: (theme) => theme.spacing(4) }}
            >
              <Button
                onClick={onClose}
                sx={{ typography: 'body-l', textTransform: 'capitalize' }}
              >
                Cancel
              </Button>
              <Button
                onClick={onSaveLink}
                sx={{ typography: 'body-l', textTransform: 'capitalize' }}
              >
                Save
              </Button>
            </Stack>
          </Paper>
        </Grow>
      )}
    </Popper>
  );
}
