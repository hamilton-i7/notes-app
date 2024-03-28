import { useQuery } from '@tanstack/react-query';
import { CATEGORIES_KEY } from '../lib/constants';
import { getCategories } from './categories.api';

export const useGetCategories = () => {
  return useQuery({
    queryKey: [CATEGORIES_KEY],
    queryFn: getCategories,
  });
};
