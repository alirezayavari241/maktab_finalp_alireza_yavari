import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ImageSlider from '../components/Layouts/Slider';
import Header from '../components/Headermenu';
import axios from 'axios';
import ProductSlider from '../components/Productlist';
import ImageCarousel from '../components/ImageCarousel';
import ProductSlider2 from '../components/Productlistsec';
import CategoriesList from '../components/Categorieslist';
import Bfooter from '../components/Footer';
import '../../src/index.css'
function Home() {
  
  const navigate = useNavigate();
  const [hasAccessToken, setHasAccessToken] = useState(false);
  const [products, setProducts] = useState([]);
  const categoryId = '66ec0ed93ad19494d8d2c80c';
  const categoryId2 = '66ec0efd3ad19494d8d2c814';

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      setHasAccessToken(true);
    }

    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/products?page=1&limit=100');
        const filteredProducts = response.data.data.products.filter(product => product.category._id === categoryId);
        setProducts(filteredProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleLoginClick = () => {
    if (hasAccessToken) {
      navigate('/panel');
    } else {
      navigate('/login');
    }
  };


  return (
    <>
      <div className="bg-pbg font-iransans">
        <Header/>
        <div className="flex w-4/5 mx-auto mt-5">
          <ImageSlider />
        </div>
        <CategoriesList/>
        <div className='mt-14'><ProductSlider categoryId={categoryId} /></div>
        <div className='w-4/5 mx-auto mt-14 space-y-8'>
        <p className='text-2xl text-textcolot text-right w-full border-b-2 border-btnbg py-3'>انتشارات همکار	</p>
        <ImageCarousel/>
        </div>
        <div className='mt-8'><ProductSlider2 categoryId={categoryId2} /></div>
        <div className='w-4/5 mx-auto mt-14'>
          <div className='w-full bg-textcolot text-center rounded-t-3xl text-white text-2xl p-4'> <p >خوشـــحالی فروشــــی لوازم تحریر</p></div>
          <div className='w-3/12 bg-textcolot text-center rounded-b-3xl text-white text-lg p-2 mx-auto -mt-3 '> <p  className='rounded-3xl border-2 p-2 border-white w-fit mx-auto'>بزودی در بوک استور</p></div>
          <div className='flex flex-row space-x-6'>
          <div class="relative w-96 h-80 -mt-8">
  <img src="https://adineh.market/wp-content/uploads/2024/06/home-khoshhali-2.jpg" alt="Image" class="w-full h-full object-cover rounded-3xl" />
  <div class="absolute inset-0 flex items-center justify-center bg-textcolot bg-opacity-80 rounded-3xl">
    <p class="text-white text-3xl font-bold">انواع خودکار</p>
  </div>
</div>
<div class="relative w-96 h-80 mt-3">
  <img src="https://avat-shop.ir/wp-content/uploads/2023/04/IMG_0847.jpg" alt="Image" class="w-full h-full object-cover rounded-3xl" />
  <div class="absolute inset-0 flex items-center justify-center bg-textcolot bg-opacity-80 rounded-3xl">
    <p class="text-white text-3xl font-bold">انواع دفتر</p>
  </div>
</div>
<div class="relative w-96 h-80 -mt-8">
  <img src="https://api2.zoomit.ir/media/2021-12-buyleeshop-638bb649da37f663eb456644" alt="Image" class="w-full h-full object-cover rounded-3xl" />
  <div class="absolute inset-0 flex items-center justify-center bg-textcolot bg-opacity-80 rounded-3xl">
    <p class="text-white  font-bold text-3xl">وسایل فانتزی</p>
  </div>
</div>
          </div>
        </div>
        <Bfooter/>
      </div>
    </>
  );
}

export default Home;
