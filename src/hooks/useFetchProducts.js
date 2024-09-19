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

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/products');
        setProducts(response.data.data.products);
      } catch (err) {
        setError('خطا در بارگذاری داده‌ها');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return { products, loading, error, itemsPerPage, setItemsPerPage, currentPage, setCurrentPage, sortOrder, setSortOrder, sortDirection, setSortDirection };
};
