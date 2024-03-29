import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CATEGORIES_KEY } from '../lib/constants';
import { createCategory, getCategories } from './categories.api';
import { CreateCategoryDto } from './dto/create-category.dto';

export const useGetCategories = () => {
  return useQuery({
    queryKey: [CATEGORIES_KEY],
    queryFn: getCategories,
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (category: CreateCategoryDto) => createCategory(category),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CATEGORIES_KEY] });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};
