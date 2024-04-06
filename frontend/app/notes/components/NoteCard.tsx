import React, { useContext } from 'react';
import { Note } from '../models/note.model';
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Typography,
  styled,
} from '@mui/material';
import DateText from './DateCreated';
import CategoryChips from '@/app/categories/components/CategoryChips';
import { NotesContext } from '../NotesContext';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { NOTE_TYPE } from '@/app/lib/constants';

const NoteCardBase = styled(Card)(({ theme }) => ({
  '&.MuiCard-root': {
    backgroundColor: theme.palette.background.surfaceVariant,
    borderRadius: theme.spacing(3),
  },
}));

type NoteCardProps = {
  note: Note;
  onNoteClick?: (id: number) => void;
};

function NoteCardContent({ note, onNoteClick = () => {} }: NoteCardProps) {
  const { setDisplayAddNote } = useContext(NotesContext);

  const handleNoteClick = (id: number) => {
    setDisplayAddNote(false);
    onNoteClick(id);
  };

  return (
    <CardActionArea onClick={() => handleNoteClick(note.id)}>
      <CardContent>
        <Box
          sx={{
            mb: (theme) => theme.spacing(2),
          }}
        >
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
  );
}

export default function NoteCard({
  note,
  onNoteClick = () => {},
}: NoteCardProps) {
  return (
    <NoteCardBase elevation={0}>
      <NoteCardContent note={note} onNoteClick={onNoteClick} />
    </NoteCardBase>
  );
}

export function SortableNoteCard({ note, onNoteClick }: NoteCardProps) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: note.id.toString(),
    data: {
      type: NOTE_TYPE,
      note,
    },
  });

  if (isDragging) {
    return (
      <NoteCardBase
        ref={setNodeRef}
        elevation={0}
        sx={{
          opacity: 0.25,
          transition,
          transform: CSS.Transform.toString(transform),
        }}
      >
        <NoteCardContent note={note} onNoteClick={onNoteClick} />
      </NoteCardBase>
    );
  }

  return (
    <NoteCardBase
      ref={setNodeRef}
      elevation={0}
      sx={{
        touchAction: 'manipulation',
        transition,
        transform: CSS.Transform.toString(transform),
      }}
      {...attributes}
      {...listeners}
    >
      <NoteCardContent note={note} onNoteClick={onNoteClick} />
    </NoteCardBase>
  );
}
