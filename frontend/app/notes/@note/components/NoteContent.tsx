import React from 'react';
import { Box, Stack, TextField } from '@mui/material';
import DateText from '../../components/DateCreated';

type NoteContentProps = {
  title?: string;
  onTitleChange?: (title: string) => void;
  content?: string;
  onContentChange?: (content: string) => void;
  dateCreated?: string;
  lastModified?: string;
};

export default function NoteContent({
  title,
  onTitleChange = () => {},
  content,
  onContentChange = () => {},
  dateCreated,
  lastModified,
}: NoteContentProps) {
  return (
    <Stack sx={{ p: (theme) => theme.spacing(4), height: '100%' }}>
      {dateCreated && (
        <Box sx={{ mb: (theme) => theme.spacing(4) }}>
          <DateText date={dateCreated} prefix="Created on: " />
        </Box>
      )}
      <Stack flex="1" sx={{ overflowY: 'scroll' }}>
        <TextField
          variant="outlined"
          multiline
          fullWidth
          placeholder="Title"
          value={title}
          onChange={(event) => onTitleChange(event.target.value)}
          sx={{
            '& .MuiInputBase-root': { p: 0 },
            '.MuiInputBase-input': { typography: 'heading-xl' },
            '& .MuiOutlinedInput-notchedOutline': {
              border: 'none',
            },
            mb: (theme) => theme.spacing(4),
          }}
        />
        <TextField
          variant="outlined"
          multiline
          fullWidth
          placeholder="Note"
          value={content}
          onChange={(event) => onContentChange(event.target.value)}
          sx={{
            flex: 1,
            '& .MuiInputBase-root': {
              p: 0,
              height: '100%',
              alignItems: 'start',
            },
            '.MuiInputBase-input': { typography: 'body-l' },
            '& .MuiOutlinedInput-notchedOutline': {
              border: 'none',
            },
          }}
        />
      </Stack>
      {lastModified && (
        <Box sx={{ mt: (theme) => theme.spacing(4), alignSelf: 'center' }}>
          <DateText date={lastModified} prefix="Last modified on: " />
        </Box>
      )}
    </Stack>
  );
}