import { NOTES_KEY } from '@/app/lib/constants';
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query';
import React from 'react';
import { getArchivedNotes } from '../notes.api';
import ArchivedNotes from './ArchivedNotes';

export default async function ArchivedNotesPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: [NOTES_KEY, { archived: true }],
    queryFn: getArchivedNotes,
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ArchivedNotes />
    </HydrationBoundary>
  );
}
