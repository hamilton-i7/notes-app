import { Typography } from '@mui/material';
import dayjs from 'dayjs';
import React from 'react';

type DateCreatedProps = {
  prefix?: string;
  date: string;
};

export default function DateText({ prefix, date }: DateCreatedProps) {
  const currentYear = new Date(Date.now()).getFullYear();
  const isCurrentYear = new Date(date).getFullYear() === currentYear;
  const dateCreated = dayjs(date).format(
    isCurrentYear ? 'D MMM' : 'D MMM, YYYY'
  );

  return (
    <Typography
      variant="body-m"
      sx={{
        color: (theme) => theme.palette.outline,
      }}
    >
      {prefix} {dateCreated}
    </Typography>
  );
}
