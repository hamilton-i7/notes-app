import axios from '../lib/axiosInstance';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category } from './models/category.model';

export const getCategories = async () => {
  const response = await axios.get<Category[]>('/categories');
  return response.data;
};

export const createCategory = async (category: CreateCategoryDto) => {
  const response = await axios.post<Category>('/categories', category);
  return response.data;
};
