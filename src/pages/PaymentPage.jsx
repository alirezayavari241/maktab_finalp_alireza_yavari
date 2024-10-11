import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PaymentPage = () => {
  const navigate = useNavigate();
  const [cardNumber, setCardNumber] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [cvv2, setCvv2] = useState('');
  const [otp, setOtp] = useState('');
  const [timeLeft, setTimeLeft] = useState(600); 

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          toast.error("زمان پرداخت به پایان رسید!");
          navigate(`/orders/cancelled`);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer); 
  }, []);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePayment = async () => {
    const userId = localStorage.getItem('userId'); 
    const cart = JSON.parse(localStorage.getItem('cartItems'));
    const accessToken = localStorage.getItem('accessToken');

    const orderData = {
      user: userId,
      products: cart.map(item => ({
        product: item.productId,
        count: item.cartquantity,
      })),
      deliveryStatus: false,
    };

    try {
      const response = await axios.post('http://localhost:8000/api/orders', orderData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status === 201) {
        const orderId = response.data.data.order._id; 

        for (const item of cart) {
          try {
            const productResponse = await axios.get(`http://localhost:8000/api/products/${item.productId}`, {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            });
            const currentQuantity = productResponse.data.data.product.quantity;
            const newQuantity = currentQuantity - item.cartquantity;

            const formData = new FormData();
            formData.append('quantity', newQuantity);

            await axios.patch(`http://localhost:8000/api/products/${item.productId}`, formData, {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'multipart/form-data',
              },
            });
          } catch (error) {
            console.error(`Error updating product ${item.productId}:`, error);
          }
        }

        localStorage.removeItem('cartItems');
        toast.success('پرداخت با موفقیت انجام شد! سفارش شما ثبت شد.');
        
        navigate(`/orders/${orderId}`);
      }
    } catch (error) {
      console.error("Error processing payment", error);
      toast.error("خطا در پردازش پرداخت");
    }
  };

  const handleCancel = () => {
    const orderId = 'cancelled';
    toast.info('پرداخت لغو شد');
    navigate(`/orders/${orderId}`); 
  };

  return (
    <div className="bg-gray-100 min-h-screen p-8 font-iransans text-right">
      <h1 className="text-3xl text-center text-gray-800 mb-8">صفحه پرداخت</h1>

      <div className="bg-white shadow-lg rounded-lg p-6 max-w-md mx-auto">
        <div className="mb-4">
          <label className="block mb-2 text-sm text-gray-600">شماره کارت</label>
          <input
            type="text"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
            placeholder="شماره کارت ۱۶ رقمی"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-sm text-gray-600">تاریخ انقضا</label>
          <input
            type="text"
            value={expirationDate}
            onChange={(e) => setExpirationDate(e.target.value)}
            className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
            placeholder="مثال: ۰۴/۱۴۰۲"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-sm text-gray-600">CVV2</label>
          <input
            type="text"
            value={cvv2}
            onChange={(e) => setCvv2(e.target.value)}
            className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
            placeholder="کد CVV2"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-sm text-gray-600">رمز پویا</label>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
            placeholder="رمز پویا"
          />
        </div>

        <div className="mb-4 text-center">
          <span className="text-lg text-red-600">زمان باقی‌مانده: {formatTime(timeLeft)}</span>
        </div>

        <div className="flex justify-between mt-6">
          <button
            onClick={handleCancel}
            className="bg-red-500 text-white rounded-xl p-3 hover:bg-red-600 transition duration-200"
          >
            انصراف
          </button>
          <button
            onClick={handlePayment}
            className="bg-blue-500 text-white rounded-xl p-3 hover:bg-blue-600 transition duration-200"
          >
            تایید پرداخت
          </button>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default PaymentPage;
