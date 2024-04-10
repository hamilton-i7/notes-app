import React from 'react';
import {
  Popper,
  Grow,
  Paper,
  ClickAwayListener,
  PopperProps,
  Typography,
  TextField,
  Box,
  Stack,
  Button,
} from '@mui/material';

type LinkPopperProps = PopperProps & {
  text?: string;
  onTextChange?: (text: string) => void;
  href: string;
  onHrefChange?: (href: string) => void;
  onClose?: (event: Event | React.SyntheticEvent) => void;
  onCreateLink?: () => void;
};

export default function CreateLinkPopper({
  text,
  onTextChange = () => {},
  href,
  onHrefChange = () => {},
  open,
  anchorEl,
  onClose = () => {},
  onCreateLink,
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
            elevation={4}
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
                  Add link
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  label="Text"
                  value={text}
                  onChange={(event) => onTextChange(event.target.value)}
                  sx={{ mb: (theme) => theme.spacing(4) }}
                />
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
                onClick={onCreateLink}
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
