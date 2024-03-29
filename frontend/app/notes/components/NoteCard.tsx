import React, { useContext } from 'react';
import { Note } from '../models/note.model';
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Typography,
} from '@mui/material';
import DateText from './DateCreated';
import CategoryChips from '@/app/categories/components/CategoryChips';
import { NotesContext } from '../NotesContext';

type NoteCardProps = {
  note: Note;
  onNoteClick?: (id: number) => void;
};

export default function NoteCard({
  note,
  onNoteClick = () => {},
}: NoteCardProps) {
  const { setDisplayAddNote } = useContext(NotesContext);

  const handleNoteClick = (id: number) => {
    setDisplayAddNote(false);
    onNoteClick(id);
  };

  return (
    <Card
      elevation={0}
      sx={{
        bgcolor: (theme) => theme.palette.background.surfaceVariant,
        borderRadius: (theme) => theme.spacing(3),
      }}
    >
      <CardActionArea onClick={() => handleNoteClick(note.id)}>
        <CardContent>
          <Box
            sx={{
              mb: (theme) => theme.spacing(2),
            }}
          >
            {' '}
            <DateText date={note.createdAt} />
          </Box>

          <Typography
            variant="heading-m"
            component="h3"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: '1',
              WebkitBoxOrient: 'vertical',
              mb: (theme) => theme.spacing(3),
              color: (theme) => theme.palette.background.onSurfaceVariant,
            }}
          >
            {note.title}
          </Typography>
          <Typography
            color="text.secondary"
            variant="body-l"
            paragraph
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: '2',
              WebkitBoxOrient: 'vertical',
              color: (theme) => theme.palette.outline,
              whiteSpace: 'pre-wrap',
            }}
          >
            {note.content}
          </Typography>

          <CategoryChips categories={note.categories} />
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
