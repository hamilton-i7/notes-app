import React, { useEffect, useRef, useState } from 'react';
import { type Editor } from '@tiptap/react';
import {
  Divider,
  IconButton,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  styled,
  useMediaQuery,
  useTheme,
  toggleButtonGroupClasses,
} from '@mui/material';
import {
  ArrowDropDownOutlined,
  CodeOutlined,
  FormatAlignLeftOutlined,
  FormatBoldOutlined,
  FormatItalicOutlined,
  FormatListBulletedOutlined,
  FormatListNumberedOutlined,
  FormatSizeOutlined,
  FormatStrikethroughOutlined,
  FormatUnderlinedOutlined,
  LinkOutlined,
  RedoOutlined,
  UndoOutlined,
} from '@mui/icons-material';
import HeadingsMenu from './HeadingsMenu';
import { BOLD, ITALIC, STRIKETHROUGH, UNDERLINE } from '../lib/constants';
import CreateLinkPopper from './CreateLinkPopper';
import LinkPopper from './LinkPopper';

type RichTextFieldToolbarProps = {
  editor: Editor | null;
};

const ToolbarIconButton = styled(IconButton)(({ theme }) => ({
  '&.MuiButtonBase-root': {
    borderRadius: theme.spacing(1),
  },
}));

const ToolbarToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  [`& .${toggleButtonGroupClasses.grouped}`]: {
    margin: theme.spacing(0.5),
    border: 0,
    borderRadius: theme.shape.borderRadius,
    [`&.${toggleButtonGroupClasses.disabled}`]: {
      border: 0,
    },
  },
  [`& .${toggleButtonGroupClasses.middleButton},& .${toggleButtonGroupClasses.lastButton}`]:
    {
      marginLeft: -1,
      borderLeft: '1px solid transparent',
    },
}));

export default function RichTextFieldToolbar({
  editor,
}: RichTextFieldToolbarProps) {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('lg'));

  const [formats, setFormats] = useState<string[]>([]);
  const isBoldActive = editor?.isActive(BOLD);
  const isItalicActive = editor?.isActive(ITALIC);
  const isUnderlineActive = editor?.isActive(UNDERLINE);
  const isStrikethroughActive = editor?.isActive(STRIKETHROUGH);

  const [headingsMenuAnchor, setHeadingsMenuAnchor] =
    useState<HTMLElement | null>(null);
  const openHeadingsMenu = Boolean(headingsMenuAnchor);

  const [openCreateLinkPopper, setOpenCreateLinkPopper] = useState(false);
  const [openLinkPopper, setOpenLinkPopper] = useState(false);
  const linkPopperAnchorRef = useRef<HTMLButtonElement>(null);
  const [linkText, setLinkText] = useState('');
  const [href, setHref] = useState('');

  const handleHeadingsButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setHeadingsMenuAnchor(event.currentTarget);
  };

  const handleHeadings1Click = () => {
    editor!.chain().focus().toggleHeading({ level: 1 }).run();
    handleCloseHeadingsMenu();
  };

  const handleHeadings2Click = () => {
    editor!.chain().focus().toggleHeading({ level: 2 }).run();
    handleCloseHeadingsMenu();
  };

  const handleCloseHeadingsMenu = () => {
    setHeadingsMenuAnchor(null);
  };

  const handleFormat = (
    _: React.MouseEvent<HTMLElement>,
    newFormats: string[]
  ) => {
    setFormats(newFormats);
  };

  const handleBoldClick = () => {
    editor!.chain().focus().toggleBold().run();
  };

  const handleItalicClick = () => {
    editor!.chain().focus().toggleItalic().run();
  };

  const handleUnderlineClick = () => {
    editor!.chain().focus().toggleUnderline().run();
  };

  const handleStrikeClick = () => {
    editor!.chain().focus().toggleStrike().run();
  };

  const handleLinkPopperClick = () => {
    const currentHref = editor!.getAttributes('link').href;
    if (currentHref) {
      setHref(currentHref);
      setOpenLinkPopper((prev) => !prev);
      return;
    }
    setOpenCreateLinkPopper((prev) => !prev);
  };

  const handleLinkTextChange = (text: string) => {
    setLinkText(text);
  };

  const handleHrefChange = (text: string) => {
    setHref(text);
  };

  const handleCreateLink = () => {
    const formattedHref = href.replaceAll('http://', '').trim();
    editor!
      .chain()
      .focus()
      .extendMarkRange('link')
      .setLink({ href: `http://${formattedHref}` })
      .command(({ tr }) => {
        tr.insertText(linkText);
        return true;
      })
      .run();
  };

  const handleEditLink = () => {
    const formattedHref = href.replaceAll('http://', '').trim();
    editor!
      .chain()
      .focus()
      .extendMarkRange('link')
      .setLink({ href: `http://${formattedHref}` })
      .run();
  };

  const handleCloseLinkPopper = (event: Event | React.SyntheticEvent) => {
    if (
      linkPopperAnchorRef.current &&
      linkPopperAnchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }
    setOpenCreateLinkPopper(false);
    setOpenLinkPopper(false);
    setLinkText('');
    setHref('');
  };

  useEffect(() => {
    // Close menus on layout change
    handleCloseHeadingsMenu();
    setOpenCreateLinkPopper(false);
  }, [matches]);

  useEffect(() => {
    if (isBoldActive) {
      setFormats((prev) => [...prev, BOLD]);
    } else {
      setFormats((prev) => prev.filter((format) => format !== BOLD));
    }

    if (isItalicActive) {
      setFormats((prev) => [...prev, ITALIC]);
    } else {
      setFormats((prev) => prev.filter((format) => format !== ITALIC));
    }

    if (isUnderlineActive) {
      setFormats((prev) => [...prev, UNDERLINE]);
    } else {
      setFormats((prev) => prev.filter((format) => format !== UNDERLINE));
    }

    if (isStrikethroughActive) {
      setFormats((prev) => [...prev, STRIKETHROUGH]);
    } else {
      setFormats((prev) => prev.filter((format) => format !== STRIKETHROUGH));
    }
  }, [isBoldActive, isItalicActive, isUnderlineActive, isStrikethroughActive]);

  useEffect(() => {
    if (!editor) return;
    if (openCreateLinkPopper) {
      const { view, state } = editor;
      const { from, to } = view.state.selection;
      const text = state.doc.textBetween(from, to, '');
      setLinkText(text);
    }
  }, [openCreateLinkPopper, editor]);

  if (!editor) return null;
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="center"
      spacing={1}
      rowGap={2}
      flexWrap="wrap"
    >
      <Tooltip title="Styles" arrow>
        <ToolbarIconButton onClick={handleHeadingsButtonClick}>
          <FormatSizeOutlined />
          <ArrowDropDownOutlined />
        </ToolbarIconButton>
      </Tooltip>
      <HeadingsMenu
        anchorEl={headingsMenuAnchor}
        open={openHeadingsMenu}
        onClose={handleCloseHeadingsMenu}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        isHeading1Selected={editor.isActive('heading', { level: 1 })}
        onHeading1Click={handleHeadings1Click}
        isHeading2Selected={editor.isActive('heading', { level: 2 })}
        onHeading2Click={handleHeadings2Click}
      />

      <Divider orientation="vertical" flexItem />

      <ToolbarToggleButtonGroup
        size="small"
        color="primary"
        value={formats}
        onChange={handleFormat}
        aria-label="Text marks"
      >
        <Tooltip arrow title="Bold (Ctrl+B)">
          <ToggleButton
            value={BOLD}
            aria-label={BOLD}
            onClick={handleBoldClick}
          >
            <FormatBoldOutlined />
          </ToggleButton>
        </Tooltip>
        <Tooltip arrow title="Italic (Ctrl+I)">
          <ToggleButton
            value={ITALIC}
            aria-label={ITALIC}
            onClick={handleItalicClick}
          >
            <FormatItalicOutlined />
          </ToggleButton>
        </Tooltip>
        <Tooltip arrow title="Underline (Ctrl+U)">
          <ToggleButton
            value={UNDERLINE}
            aria-label={UNDERLINE}
            onClick={handleUnderlineClick}
          >
            <FormatUnderlinedOutlined />
          </ToggleButton>
        </Tooltip>
        <Tooltip arrow title="Strikethrough (Ctrl+Shift+S)">
          <ToggleButton
            value={STRIKETHROUGH}
            aria-label={STRIKETHROUGH}
            onClick={handleStrikeClick}
          >
            <FormatStrikethroughOutlined />
          </ToggleButton>
        </Tooltip>
      </ToolbarToggleButtonGroup>

      <Divider orientation="vertical" flexItem />

      <Tooltip arrow title="Link">
        <ToolbarIconButton
          ref={linkPopperAnchorRef}
          onClick={handleLinkPopperClick}
        >
          <LinkOutlined />
        </ToolbarIconButton>
      </Tooltip>
      <CreateLinkPopper
        open={openCreateLinkPopper}
        anchorEl={linkPopperAnchorRef.current}
        onClose={handleCloseLinkPopper}
        text={linkText}
        onTextChange={handleLinkTextChange}
        href={href}
        onHrefChange={handleHrefChange}
        onCreateLink={handleCreateLink}
      />
      <LinkPopper
        open={openLinkPopper}
        anchorEl={linkPopperAnchorRef.current}
        onClose={handleCloseLinkPopper}
        href={href}
        onHrefChange={handleHrefChange}
        onSaveLink={handleEditLink}
      />

      <Divider orientation="vertical" flexItem />

      <Tooltip arrow title="Align">
        <ToolbarIconButton>
          <FormatAlignLeftOutlined />
          <ArrowDropDownOutlined />
        </ToolbarIconButton>
      </Tooltip>
      <Tooltip arrow title="Bullet list (Ctrl+Shift+8)">
        <ToolbarIconButton>
          <FormatListBulletedOutlined />
        </ToolbarIconButton>
      </Tooltip>
      <Tooltip arrow title="Numbered list (Ctrl+Shift+7)">
        <ToolbarIconButton>
          <FormatListNumberedOutlined />
        </ToolbarIconButton>
      </Tooltip>

      <Divider orientation="vertical" flexItem />

      <Tooltip arrow title="Code (Ctrl+E)">
        <ToolbarIconButton>
          <CodeOutlined />
        </ToolbarIconButton>
      </Tooltip>

      <Divider orientation="vertical" flexItem />

      <Tooltip arrow title="Undo (Ctrl+Z)">
        <ToolbarIconButton>
          <UndoOutlined />
        </ToolbarIconButton>
      </Tooltip>
      <Tooltip arrow title="Redo (Ctrl+Y)">
        <ToolbarIconButton>
          <RedoOutlined />
        </ToolbarIconButton>
      </Tooltip>
    </Stack>
  );
}
