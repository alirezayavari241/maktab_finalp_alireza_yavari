import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Calendar } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import moment from 'jalali-moment';
import Header from '../components/Headermenu';
import Bfooter from '../components/Footer';
const OrderCompletionPage = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({
    firstname: '',
    lastname: '',
    address: '',
    phoneNumber: ''
  });
  const [deliveryDate, setDeliveryDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [totalPrice, setTotalPrice] = useState(0); 

  useEffect(() => {
    const fetchUserInfo = async () => {
      const userId = localStorage.getItem('userId');
      const accessToken = localStorage.getItem('accessToken');

      try {
        const response = await axios.get(`http://localhost:8000/api/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setUserInfo(response.data.data.user);
      } catch (error) {
        console.error("Error fetching user data", error);
        toast.error("خطا در بارگذاری اطلاعات کاربر");
      } finally {
        setLoading(false);
      }
    };

    const cartTotal = localStorage.getItem('cartTotal');
    setTotalPrice(cartTotal ? parseFloat(cartTotal) : 0);

    fetchUserInfo();
  }, []);

  const handleDateChange = (date) => {
    console.log(moment(date).locale('fa').format('YYYY/MM/DD').toLocaleString('fa-IR'));
    setDeliveryDate(date);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  const handleSaveChanges = async () => {
    const userId = localStorage.getItem('userId');
    const accessToken = localStorage.getItem('accessToken');

    try {
      await axios.patch(`http://localhost:8000/api/users/${userId}`, {
        firstname: userInfo.firstname,
        lastname: userInfo.lastname,
        phoneNumber: userInfo.phoneNumber,
        address: userInfo.address,
      }, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    } catch (error) {
      console.error("Error updating user data", error);
      toast.error("خطا در به‌روزرسانی اطلاعات کاربر");
    }
  };

  const handleOrderCompletion = () => {
    handleSaveChanges(); 
    toast.success('سفارش شما با موفقیت ثبت شد!');
    setTimeout(() => {
        navigate('/payment'); 

    }, 2500);
  };

  if (loading) return <p>در حال بارگذاری...</p>;

  return (
    <>
    <div className='bg-pbg font-iransans h-full'>
        <Header/>
        <div>
        <div className="bg-pbg font-iransans w-4/5 mx-auto">
      <h1 className="text-3xl text-textcolot text-right mb-8">تکمیل سفارش</h1>

      {userInfo ? (
        <div className=" p-4 rounded shadow w-full">
          <h2 className="text-xl text-textcolot mb-4 text-right">اطلاعات کاربر</h2>
          
          <div className="flex flex-col mx-auto space-y-5 items-center justify-center align-middle ml-96 -mr-64">
            <div className='flex flex-row space-x-10'>
            <div className='w-48 text-right flex flex-col'>
            <label className="flex mb-2 text-sm text-gray-700 text-right w-full ml-32">نام خانوادگی</label>
            <input
              type="text"
              name="lastname"
              value={userInfo.lastname}
              onChange={handleInputChange}
              className="border rounded p-1 w-full bg-white border-textcolot text-black"
            />
          </div>
            <div className='w-48 text-right flex flex-col'>
            <label className="flex mb-2 text-sm text-gray-700 text-right w-full ml-44">نام</label>
            <input
              type="text"
              name="firstname"
              value={userInfo.firstname}
              onChange={handleInputChange}
              className="border rounded p-1 w-full bg-white border-textcolot text-black"
            />
          </div>

            </div>
            <div className='flex flex-row space-x-10'>
            <div className='w-48 text-right flex flex-col'>
            <label className="flex mb-2 text-sm text-gray-700 text-right w-full ml-40">آدرس</label>
            <input
              type="text"
              name="address"
              value={userInfo.address}
              onChange={handleInputChange}
              className="border rounded p-1 w-full bg-white border-textcolot text-black"
            />
          </div>
          <div className='w-48 text-right flex flex-col'>
            <label className="flex mb-2 text-sm text-gray-700 text-right w-full ml-40">تـلـفن</label>
            <input
              type="text"
              name="phoneNumber"
              value={userInfo.phoneNumber}
              onChange={handleInputChange}
              className="border rounded p-1 w-full bg-white border-textcolot text-black"
            />
          </div>
            </div>
          </div>
        <div>
        <div className=' -mt-48 w-fit ml-36'>
            <h2 className="text-xl text-textcolot text-right ">تاریخ تحویل</h2>
            <div className='mt-5'>
            <Calendar
            onChange={handleDateChange}
            value={deliveryDate}
            locale="fa-IR"
          />
            </div>
            </div>

          <div className="mt-12">
            <h3 className="text-lg text-textcolot w-fit border-b-2 border-textcolot">مجموع قیمت سبد خرید: {totalPrice.toLocaleString('fa-IR')} تومان</h3>
          </div>

          <button
            onClick={handleOrderCompletion}
            className="bg-textcolot text-white rounded-xl p-3 mt-5"
          >
            ثبت سفارش
          </button>
        </div>
        </div>
      ) : (
        <p className="text-center text-textcolot">اطلاعات کاربر پیدا نشد</p>
      )}

      <ToastContainer />
    </div>

        </div>
        <div className='mt-20'> <Bfooter/> </div>
    </div>
    </>
  );
};

export default OrderCompletionPage;
