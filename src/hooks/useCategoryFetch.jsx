import { useState, useEffect } from 'react';
import axios from 'axios';

export const useCategoryFetch = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await axios.get('http://localhost:8000/api/categories');
      setCategories(response.data.data.categories);
    };
    fetchCategories();
  }, []);

  return { categories };
};
