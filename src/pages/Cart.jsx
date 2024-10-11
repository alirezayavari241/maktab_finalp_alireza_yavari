import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Header from '../components/Headermenu';
import Bfooter from '../components/Footer';
import { toast, ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cartItems')) || [];
    const fetchCartItems = async () => {
      const updatedCartItems = await Promise.all(
        cart.map(async (item) => {
          const response = await axios.get(`http://localhost:8000/api/products/${item.productId}`);
          return {
            ...response.data.data.product,
            cartquantity: item.cartquantity,
          };
        })
      );
      setCartItems(updatedCartItems);
    };
    fetchCartItems();
  }, []);

  useEffect(() => {
    const calculateTotalPrice = () => {
      const total = cartItems.reduce((acc, item) => acc + item.price * item.cartquantity, 0);
      setTotalPrice(total);
    };
    calculateTotalPrice();
  }, [cartItems]);

  const handleQuantityChange = (productId, newQuantity) => {
    const quantity = parseInt(newQuantity, 10);
    const updatedItems = cartItems.map(item => {
      if (item._id === productId) {
        if (quantity > item.quantity) {
          toast.error(`تعداد انتخابی بیشتر از موجودی انبار است. حداکثر موجودی: ${item.quantity}`);
          return item;  
        }
        return { ...item, cartquantity: quantity };
      }
      return item;
    });
    
    setCartItems(updatedItems);
    localStorage.setItem('cartItems', JSON.stringify(updatedItems.map(({ _id, cartquantity }) => ({ productId: _id, cartquantity }))));
  };

  const handleShowModal = (productId) => {
    setItemToRemove(productId);
    setShowModal(true);
  };

  const confirmRemoveItem = () => {
    const updatedItems = cartItems.filter(item => item._id !== itemToRemove);
    setCartItems(updatedItems);
    localStorage.setItem('cartItems', JSON.stringify(updatedItems.map(({ _id, cartquantity }) => ({ productId: _id, cartquantity }))));
    setShowModal(false);
    setItemToRemove(null);
    toast.success('کالا با موفقیت حذف شد!');
  };

  const closeModal = () => {
    setShowModal(false);
    setItemToRemove(null);
  };

  const handleSubmit = () =>{
    localStorage.setItem('cartTotal', totalPrice)
    navigate('/submitcart')

  }

  return (
    <div className='bg-pbg font-iransans h-full'>
    <div className="">
      <Header />
      <div className="w-4/5 mx-auto mt-16">
        <h1 className="text-3xl text-textcolot text-right mb-8">سبد خرید شما</h1>
        {cartItems.length === 0 ? (
          <p className="text-center text-textcolot">سبد خرید شما خالی است</p>
        ) : (
          <>
            <div className='flex felx-row mx-auto  align-middle items-center w-full space-x-10 '>
              <div className='w-64 h-96'>
                <div className="border border-textcolot rounded-lg">
                  <p className='text-xl text-textcolot p-2 text-right'>:(تومان)جمع کل</p>
                  <p className="text-2xl text-textcolot p-3 text-center">
                    {totalPrice.toLocaleString('fa-IR')} 
                  </p>
                </div>
                <button className="bg-textcolot text-white rounded-xl p-3 mt-5 " onClick={()=>handleSubmit()}>
                  نهایی کردن خرید
                </button>
              </div>
              <table className="border border-gray-300 w-4/5">
                <thead>
                  <tr className="bg-gray-100 text-black">
                    <th className="border border-gray-300 p-2">عملیات</th>
                    <th className="border border-gray-300 p-2">قیمت تعداد</th>
                    <th className="border border-gray-300 p-2">تعداد کالا</th>
                    <th className="border border-gray-300 p-2">(تومان)مبلغ</th>
                    <th className="border border-gray-300 p-2">نام کالا</th>
                    <th className="border border-gray-300 p-2">تصویر</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map(item => (
                    <tr key={item._id} className='text-black'>
                      <td className="border border-gray-300 p-2 text-center">
                        <button onClick={() => handleShowModal(item._id)} className="text-red-600">حذف</button>
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        <p className="text-lg text-textcolot rtl ">{(item.price*item.cartquantity).toLocaleString('fa-IR')}</p>
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        <input 
                          type="number"
                          min="1"
                          value={item.cartquantity}
                          max={item.quantity}
                          onChange={(e) => handleQuantityChange(item._id, e.target.value)}
                          className="w-16 text-center p-2 border border-textcolot rounded-md bg-white"
                          />
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        <p className="text-lg text-textcolot rtl ">{item.price.toLocaleString('fa-IR')}</p>
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        <Link to={`/products/${item._id}`} className="text-xl text-textcolot">{item.name}</Link>
                      </td>
                      <td className="border border-gray-300 p-2 text-center items-center">
                        <img src={`http://${item.images[0]}`} className="h-24 w-24 rounded-xl mx-auto" alt={item.name} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <p className="mb-4 text-xl text-gray-800">آیا از حذف این کالا مطمئن هستید؟</p>

              <div className="flex justify-center space-x-4">
                <button
                  onClick={confirmRemoveItem}
                  className="bg-red-500 text-white px-4 py-2 rounded-md"
                  >
                  بله، حذف کن
                </button>
                <button
                  onClick={closeModal}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md"
                  >
                  لغو
                </button>
              </div>
            </div>
          </div>
        )}

        <ToastContainer />
      </div>

    </div>
        <div className='mb-0 mt-52'> <Bfooter /></div>
        </div>
  );
};

export default CartPage;
