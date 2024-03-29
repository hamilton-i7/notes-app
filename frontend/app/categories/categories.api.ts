import axios from '../lib/axiosInstance';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './models/category.model';

export const getCategories = async () => {
  const response = await axios.get<Category[]>('/categories');
  return response.data;
};

export const getCategory = async (id: number) => {
  const response = await axios.get<Category>(`/categories/${id}`);
  return response.data;
};

export const createCategory = async (category: CreateCategoryDto) => {
  const response = await axios.post<Category>('/categories', category);
  return response.data;
};

export const updateCategory = async (
  id: number,
  category: UpdateCategoryDto
) => {
  const response = await axios.patch<Category>(`/categories/${id}`, category);
  return response.data;
};

export const deleteCategory = async (id: number) => {
  const response = await axios.delete<string>(`categories/${id}`);
  return response.data;
};
