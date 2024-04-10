import React, { useEffect, useState } from 'react';
import { ToggleButtonGroup } from './ToggleButtonGroup';
import {
  FormatAlignLeftOutlined,
  FormatAlignCenterOutlined,
  FormatAlignRightOutlined,
  FormatAlignJustifyOutlined,
} from '@mui/icons-material';
import {
  Popper,
  Grow,
  Paper,
  ClickAwayListener,
  Tooltip,
  ToggleButton,
  PopperProps,
} from '@mui/material';
import { CENTER, JUSTIFY, LEFT, RIGHT } from '../lib/constants';
import { Editor } from '@tiptap/react';

export type Alignment =
  | typeof LEFT
  | typeof CENTER
  | typeof RIGHT
  | typeof JUSTIFY;

type TextAlignPopperProps = PopperProps & {
  editor: Editor;
  onAlignmentClick?: (alignment: Alignment) => void;
  onClose?: (event: Event | React.SyntheticEvent) => void;
};

export default function TextAlignPopper({
  open,
  anchorEl,
  editor,
  onClose = () => {},
  onAlignmentClick = () => {},
}: TextAlignPopperProps) {
  const [alignment, setAlignment] = useState<Alignment>(LEFT);

  const handleAlign = (
    _: React.MouseEvent<HTMLElement>,
    newAlignment: Alignment | null
  ) => {
    if (!newAlignment) return;
    setAlignment(newAlignment);
    onAlignmentClick(newAlignment);
  };

  const handleAlignClick = (
    event: Event | React.SyntheticEvent,
    align: string
  ) => {
    editor.chain().focus().setTextAlign(align).run();
    onClose(event);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        (event.ctrlKey && event.key === 'L') ||
        (event.metaKey && event.key === 'L')
      ) {
        setAlignment('left');
        onAlignmentClick('left');
      } else if (
        (event.ctrlKey && event.key === 'E') ||
        (event.metaKey && event.key === 'E')
      ) {
        setAlignment('center');
        onAlignmentClick('center');
      } else if (
        (event.ctrlKey && event.key === 'R') ||
        (event.metaKey && event.key === 'R')
      ) {
        setAlignment('right');
        onAlignmentClick('right');
      } else if (
        (event.ctrlKey && event.key === 'J') ||
        (event.metaKey && event.key === 'J')
      ) {
        setAlignment('justify');
        onAlignmentClick('justify');
      }
    };
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onAlignmentClick]);

  return (
    <Popper
      open={open}
      anchorEl={anchorEl}
      role="menu"
      placement="top"
      transition
      sx={{
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
              p: (theme) => theme.spacing(1),
              color: (theme) => theme.palette.background.onSurface,
              bgcolor: (theme) => theme.palette.background.surface,
            }}
          >
            <ClickAwayListener onClickAway={onClose}>
              <ToggleButtonGroup
                size="small"
                color="primary"
                exclusive
                value={alignment}
                onChange={handleAlign}
                aria-label="Text alignment"
              >
                <Tooltip arrow title="Left (Ctrl+Shift+L)">
                  <ToggleButton
                    value={LEFT}
                    aria-label={LEFT}
                    onClick={(event) => handleAlignClick(event, LEFT)}
                  >
                    <FormatAlignLeftOutlined />
                  </ToggleButton>
                </Tooltip>
                <Tooltip arrow title="Center (Ctrl+Shift+E)">
                  <ToggleButton
                    value={CENTER}
                    aria-label={CENTER}
                    onClick={(event) => handleAlignClick(event, CENTER)}
                  >
                    <FormatAlignCenterOutlined />
                  </ToggleButton>
                </Tooltip>
                <Tooltip arrow title="Right (Ctrl+Shift+R)">
                  <ToggleButton
                    value={RIGHT}
                    aria-label={RIGHT}
                    onClick={(event) => handleAlignClick(event, RIGHT)}
                  >
                    <FormatAlignRightOutlined />
                  </ToggleButton>
                </Tooltip>
                <Tooltip arrow title="Justify (Ctrl+Shift+J)">
                  <ToggleButton
                    value={JUSTIFY}
                    aria-label={JUSTIFY}
                    onClick={(event) => handleAlignClick(event, JUSTIFY)}
                  >
                    <FormatAlignJustifyOutlined />
                  </ToggleButton>
                </Tooltip>
              </ToggleButtonGroup>
            </ClickAwayListener>
          </Paper>
        </Grow>
      )}
    </Popper>
  );
}
