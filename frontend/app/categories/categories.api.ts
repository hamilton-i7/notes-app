import axios from '../lib/axiosInstance';
import { Category } from './models/category.model';

export const getCategories = async () => {
  const response = await axios.get<Category[]>('/categories');
  return response.data;
};
