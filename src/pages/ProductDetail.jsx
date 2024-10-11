import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Headermenu';
import Bfooter from '../components/Footer';
import { toast, ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [cartquantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/products/${id}`);
        const productData = response.data.data.product;
        setProduct(productData);
        if (productData.images.length > 0) {
          setSelectedImage(productData.images[0]);
        }
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || []; 
    const newItem = {
      productId: product._id,
      productName: product.name,
      cartquantity: cartquantity
    };

    const existingItemIndex = cartItems.findIndex(item => item.productId === product._id);

    if (existingItemIndex !== -1) {
      cartItems[existingItemIndex].cartquantity += cartquantity;
    } else {
      cartItems.push(newItem);
    }

    localStorage.setItem('cartItems', JSON.stringify(cartItems));

    toast.success('محصول به سبد خرید اضافه شد!');
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-pbg font-iransans h-full">
      <Header />
      <div className='w-4/5 mx-auto flex mt-16'>
        <div className='w-full flex-row-reverse flex mx-auto'>
          <div className='w-4/6'>
            <div className='flex flex-col'>
              <div className='w-full mx-auto justify-center items-center'>
                <img src={`http://${selectedImage}`} className='h-96 w-96 rounded-xl mx-auto' alt={product.name} />
              </div>
              <div className='flex mt-4 justify-center space-x-2'>
                {product.images.map((img, index) => (
                  <img
                    key={index}
                    src={`http://${img}`}
                    onClick={() => setSelectedImage(img)}
                    className={`h-20 w-20 object-cover cursor-pointer border-2 ${selectedImage === img ? 'border-blue-500' : 'border-gray-300'}`}
                    alt={`preview-${index}`}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className='w-full flex flex-col'>
            <div className='border-b-2 border-textcolot w-full flex flex-col'>
              <p className='text-3xl text-textcolot text-right py-4 -mt-5'>{product.name}</p>
              <p className='text-sm text-textcolot w-full text-right'>{product.category.name} - {product.subcategory.name}</p>
            </div>

            <div className=' w-full flex-col flex justify-around'>
              <div className='mt-4 flex '>
                <p className='text-textcolot text-right text-lg leading-8'>{product.description}</p>
              </div>
              <div className='flex flex-col w-60 border-2 border-textcolot rounded-3xl p-3 mt-14'>
                <div className='flex justify-center text-xl'>
                  <p className='text-black'>تومان</p>
                  <p className="mb-2 text-black">{product.price.toLocaleString('fa-IR')}</p>
                </div>
                <div className='flex flex-col w-full text-center'>
                  <input
                    type='number'
                    min={1}
                    max={product.quantity}
                    value={cartquantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                    className={`bg-white border-textcolot w-24 text-xl text-center rounded-xl p-3 border-2 mx-auto text-black ${product.quantity === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={product.quantity === 0} // Disable input if quantity is 0
                  />
                  {product.quantity === 0 && (
                    <p className='text-red-500 mt-2'>کالا در انبار موجود نیست</p>
                  )}
                  <button
                    className={`bg-textcolot text-white w-full h-10 rounded-3xl mx-auto mt-4 ${product.quantity === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={handleAddToCart}
                    disabled={product.quantity === 0} // Disable button if quantity is 0
                  >
                    خرید
                  </button>
                </div>
                <div className='flex mx-auto mt-3 text-btnbg'>
                  <p>ضمانت ارسال سلامت کالا</p>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15L15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ToastContainer />
      </div>
      <div className='mt-20'><Bfooter /></div>
    </div>
  );
};

export default ProductDetail;
