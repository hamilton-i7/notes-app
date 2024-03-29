import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CATEGORIES_KEY, SINGLE_CATEGORY_KEY } from '../lib/constants';
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategory,
  updateCategory,
} from './categories.api';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

export const useGetCategories = () => {
  return useQuery({
    queryKey: [CATEGORIES_KEY],
    queryFn: getCategories,
  });
};

export const useGetCategory = (id: number | undefined, enabled = false) => {
  return useQuery({
    queryKey: [SINGLE_CATEGORY_KEY, { id }],
    queryFn: () => getCategory(id!),
    enabled,
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

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      category,
    }: {
      id: number;
      category: UpdateCategoryDto;
    }) => updateCategory(id, category),
    onSuccess: (data) => {
      queryClient.setQueryData([SINGLE_CATEGORY_KEY, { id: data.id }], data);
      queryClient.invalidateQueries({ queryKey: [CATEGORIES_KEY] });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CATEGORIES_KEY] });
    },
  });
};
