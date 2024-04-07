import React from 'react';
import { NOTES_KEY } from '@/app/lib/constants';
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query';
import { getFavoriteNotes } from '../notes.api';
import FavoriteNotes from './FavoriteNotes';

export default async function FavoritesPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: [NOTES_KEY, { favorites: true }],
    queryFn: getFavoriteNotes,
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <FavoriteNotes />
    </HydrationBoundary>
  );
}
