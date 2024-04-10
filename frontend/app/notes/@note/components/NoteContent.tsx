import React from 'react';
import { Box, Stack, TextField } from '@mui/material';
import DateText from '../../components/DateCreated';
import CategoryChips from '@/app/categories/components/CategoryChips';
import { Category } from '@/app/categories/models/category.model';
import { EditorContent, useEditor } from '@tiptap/react';
import RichTextFieldToolbar from '@/app/components/RichTextFieldToolbar';
import StarterKit from '@tiptap/starter-kit';
import { EMPTY_NOTE_CONTENT } from '@/app/lib/constants';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Typography from '@tiptap/extension-typography';
import styles from '@/app/components/styles.module.css';

type NoteContentProps = {
  title?: string;
  onTitleChange?: (title: string) => void;
  content?: string;
  onContentChange?: (content: string) => void;
  dateCreated?: string;
  lastModified?: string;
  categories?: Category[];
};

export default function NoteContent({
  title,
  onTitleChange = () => {},
  content,
  onContentChange = () => {},
  dateCreated,
  lastModified,
  categories = [],
}: NoteContentProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        horizontalRule: false,
        blockquote: false,
        codeBlock: false,
        heading: {
          levels: [1, 2],
        },
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Link.extend({ inclusive: false }),
      Placeholder.configure({
        placeholder: EMPTY_NOTE_CONTENT,
      }),
      Typography,
    ],
    content,
    editorProps: {
      attributes: {
        class: `${styles.editor}`,
      },
    },
    onUpdate({ editor }) {
      onContentChange(editor.getHTML());
    },
  });

  return (
    <Stack
      sx={{
        p: (theme) => theme.spacing(4),
        height: { xs: '100%', lg: 'auto' },
        flex: { lg: 1 },
        overflowY: 'hidden',
      }}
    >
      {dateCreated && (
        <Box sx={{ mb: (theme) => theme.spacing(4) }}>
          <DateText date={dateCreated} prefix="Created on: " />
        </Box>
      )}
      <Stack flex="1" sx={{ overflowY: 'scroll' }}>
        <TextField
          variant="outlined"
          fullWidth
          placeholder="Title"
          autoFocus
          value={title}
          onChange={(event) => onTitleChange(event.target.value)}
          sx={{
            '& .MuiInputBase-root': { p: 0 },
            '& .MuiInputBase-input': { p: 0 },
            '.MuiInputBase-input': { typography: 'heading-xl' },
            '& .MuiOutlinedInput-notchedOutline': {
              border: 'none',
            },
            mb: (theme) => theme.spacing(4),
          }}
        />
        <EditorContent editor={editor} />
        {Boolean(categories.length) && (
          <Box sx={{ mb: (theme) => theme.spacing(4) }}>
            <CategoryChips categories={categories} />
          </Box>
        )}
      </Stack>
      <RichTextFieldToolbar editor={editor} />
      {lastModified && (
        <Box sx={{ mt: (theme) => theme.spacing(4), textAlign: 'center' }}>
          <DateText date={lastModified} prefix="Last modified on: " />
        </Box>
      )}
    </Stack>
  );
}
