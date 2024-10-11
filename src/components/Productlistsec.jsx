import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ProductSlider2 = ({ categoryId }) => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/products?page=1&limit=100');
        const filteredProducts = response.data.data.products.filter(
          (product) => product.category._id === categoryId
        );
        setProducts(filteredProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, [categoryId]);

  const handleProductClick = (productId) => {
    navigate(`/products/${productId}`);
  };

  return (
    <div className='flex w-4/5 mx-auto flex-row-reverse rounded-3xl border-btnbg border-2 mt-5'>
      <div className='flex h-15 w-52 border-l-2 border-btnbg'>
        <p className='flex mx-auto text-3xl text-textcolot mt-auto mb-auto px-3 text-center'>بهترین های <br></br>روانشناسی</p>
      </div>
      <div className="flex w-5/6 mr-3 ml-3 mt-5 overflow-x-auto space-x-4 mb-3 px-3">
        {products.map((product) => (
          <div key={product.id} className="flex-none w-64 border-btnbg border-2 p-4 rounded-3xl shadow-lg items-center justify-center">
            <img
              src={`http://${product.images[0]}`} 
              alt={product.name}
              className="h-48 w-48 object-cover mb-4 mx-auto"
            />
            <h3 className="text-lg font-bold mb-2 text-black text-center">{product.name}</h3>
            <div className='flex justify-center'>
              <p className='text-black'>تومان</p>
              <p className="mb-2 text-black">{product.price.toLocaleString('fa-IR')}</p>
            </div>
            <button
              onClick={() => handleProductClick(product._id)}
              className="bg-textcolot text-white px-4 py-2 rounded w-full"
            >
              مشاهده بیشتر
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductSlider2;
