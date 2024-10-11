import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from '../components/Headermenu';
import Bfooter from '../components/Footer';
const OrderStatusPage = () => {
  const { orderId } = useParams(); 
  const [orderStatus, setOrderStatus] = useState(null); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 

  useEffect(() => {
    const fetchOrderStatus = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const response = await axios.get(`http://localhost:8000/api/orders/${orderId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        setOrderStatus(response.data.status);  
      } catch (error) {
        if (error.response && error.response.status === 500) {

          setOrderStatus('failed');
        } else {
          setError('خطا در دریافت وضعیت سفارش');
          toast.error('خطا در دریافت وضعیت سفارش');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrderStatus();
  }, [orderId]);

  if (loading) {
    return <div>در حال بارگذاری...</div>; 
  }

  if (error) {
    return <div className="text-red-500">{error}</div>; 
  }

  return (
    <>
    <div className="bg-pbg font-iransans h-screen">
    <Header/>
    <div className="bg-pbg font-iransans w-4/5 mx-auto p-4">
      <h1 className="text-3xl text-textcolot text-right mb-8">وضعیت سفارش</h1>

      <div className=" p-4 ">
        {orderStatus === 'success' ? (
          <div>
            <h2 className="text-green-600 text-xl text-right">پرداخت موفقیت‌آمیز بود!</h2>
            <p className="text-gray-700 mt-4 text-right">
            </p>
          </div>
        ) : (
          <div>
            <h2 className="text-red-600 text-xl text-right">پرداخت ناموفق بود</h2>
            <p className="text-gray-700 mt-4 text-right">
              متاسفانه پرداخت شما انجام نشد. لطفاً دوباره تلاش کنید یا با پشتیبانی تماس بگیرید.
            </p>
          </div>
        )}
      </div>

      <ToastContainer />
    </div>
    <div className='mt-40'>
        <Bfooter/>
    </div>
        
    </div>
    </>
  );
};

export default OrderStatusPage;
