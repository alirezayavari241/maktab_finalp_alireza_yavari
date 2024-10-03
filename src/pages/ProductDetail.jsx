import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Headermenu';
import Bfooter from '../components/Footer';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/products/${id}`);
        setProduct(response.data.data.product);
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-pbg font-iransans h-full ">
        <Header/>
        <div className='w-4/5 mx-auto flex mt-16'>
            <div className='w-full flex-row-reverse flex mx-auto '>
            <div className=''><img src={`http://${product.images}`} className='h-96 w-full rounded-xl' alt={product.name}/></div>
                <div className='w-full'>
                   <div className='border-b-2 border-textcolot w-full flex flex-col'>
                   <p className='text-3xl text-textcolot  text-right py-4 -mt-5'>{product.name}</p>
                   <p className='text-sm text-textcolot  w-full text-right '>{product.category.name}-{product.subcategory.name}</p>
                   </div>

                    <div className='felx flex- w-full'>
                            <div className='mt-4 flex mr-0'>
                                <p className=' text-textcolot text-right text-lg'>{product.description}</p>
                            </div>
                            <div className='flex flex-col w-64 border-2 border-textcolot rounded-3xl p-3 justify-center align-middle'>
                                 <div className='flex justify-center text-xl mx-auto'>
                                     <p className='text-black'>تومان</p>
                                    <p className="mb-2 text-black">{product.price.toLocaleString('fa-IR')}</p>
                                 </div>
                                <div className='flex flex-col space-x-2 w-full mx-auto justify-center items-center text-center '>
                                <input type='number'  min={1} max={product.quantity} step={1} inputMode='numric' placeholder='1'className='bg-white border-textcolot w-24 text-xl text-textcolot text-center rounded-xl p-3 border-2 mx-auto'/>
                                <button className='bg-textcolot text-white w-full h-10 rounded-3xl mx-auto mt-4 justify-center'>خرید</button>
                                </div>
                                <div className='flex mx-auto mt-3 text-btnbg'>
                                    <p>ضمانت ارسال سلامت کالا</p>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
</svg>


                                </div>
                            </div>
                    </div>
                </div>
            </div>
        </div>
        <div className='mt-20'><Bfooter/></div>
    </div>
  );
};

export default ProductDetail;
