import { useEffect, useState } from 'react';
import axios from 'axios';

export const useFetchProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [sortOrder, setSortOrder] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('asc');

  const fetchProducts = async () => {
    setLoading(true); // برای نمایش بارگذاری
    try {
      const response = await axios.get(`http://localhost:8000/api/products?page=1&limit=100`);
      setProducts(response.data.data.products);
    } catch (err) {
      setError('خطا در بارگذاری داده‌ها');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(); // اینجا تابع fetchProducts را فراخوانی کنید
  }, [currentPage, itemsPerPage, sortOrder, sortDirection]); // وابستگی‌ها را اضافه کنید

  return { products, loading, error, itemsPerPage, setItemsPerPage, currentPage, setCurrentPage, sortOrder, setSortOrder, sortDirection, setSortDirection, fetchProducts }; // تابع fetchProducts را هم به خروجی اضافه کنید
};