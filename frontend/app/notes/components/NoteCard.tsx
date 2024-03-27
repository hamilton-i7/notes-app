import React from 'react';
import { Note } from '../models/note.model';
import { Card, CardContent, Typography } from '@mui/material';
import dayjs from 'dayjs';

type NoteCardProps = {
  note: Note;
};

export default function NoteCard({ note }: NoteCardProps) {
  const currentYear = new Date(Date.now()).getFullYear();
  const isCurrentYear = new Date(note.createdAt).getFullYear() === currentYear;
  const dateCreated = dayjs(note.createdAt).format(
    isCurrentYear ? 'D MMM' : 'D MMM, YYYY'
  );

  return (
    <Card
      elevation={0}
      sx={{
        bgcolor: (theme) => theme.palette.background.surfaceVariant,
        borderRadius: (theme) => theme.spacing(3),
      }}
    >
      <CardContent>
        <Typography
          variant="body-m"
          sx={{
            mb: (theme) => theme.spacing(2),
            color: (theme) => theme.palette.outline,
          }}
        >
          {dateCreated}
        </Typography>
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
          }}
        >
          {note.content}
        </Typography>
      </CardContent>
    </Card>
  );
}
