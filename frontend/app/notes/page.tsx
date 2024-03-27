import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query';
import React from 'react';
import { NOTES_KEY } from '../lib/constants';
import { getNotes } from './notes.api';
import Notes from './Notes';

export default async function NotesPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: [NOTES_KEY],
    queryFn: getNotes,
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Notes />
    </HydrationBoundary>
  );
}
