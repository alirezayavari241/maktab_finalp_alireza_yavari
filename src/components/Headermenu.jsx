
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  const [hasAccessToken, setHasAccessToken] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      setHasAccessToken(true);
    }
    
    const cart = JSON.parse(localStorage.getItem('cartItems')) || [];
    console.log(cart);
    const leng = cart.length
    const totalCount = leng
    setCartItemCount(totalCount);
  }, []);

  const [dropdown, setDropdown] = useState(false);
  
  const handleLoginClick = () => {
    if (hasAccessToken) {
      navigate('/panel');
    } else {
      navigate('/login');
    }
  };
  
  const handlemenunav = (path) => {
    if (path === 'home') {
      navigate('/');
    }
    if (path === 'list') {
      navigate('/productlist');
    }
    if (path === 'amoozesh') {
      navigate('productlist/66ec0ed93ad19494d8d2c80c');
    }
    if (path === 'ravanshenasi') {
      navigate('productlist/66ec0efd3ad19494d8d2c814');
    }
    if (path === 'cart') {
      navigate('/cart');
    }
  }

  return (
    <>
      <div className="flex flex-row-reverse justify-between w-4/5 align-middle items-center content-center mx-auto border-b-btnbg border-b-2">
        <div className="flex">
          <div className="absolute">
            <img src="../src/assets/icons/icons8-search-48.png" height={30} width={30} className="mt-1 ml-2" />
          </div>
          <input
            type="text"
            placeholder="جستجوی محصولات"
            className="bg-btnbg bg-opacity-50 text-right w-64 p-2 focus:outline-none rounded-3xl h-10 placeholder:text-gray-500"
          />
        </div>
        <div>
          <img className="h-24 w-24 mt-6 mb-5" src="../src/assets/icons/logo.png" />
        </div>
        <div className="flex space-x-3">
          <div>
            <button className="flex p-1 py-2 rounded-3xl w-36 bg-transparent border-btnbg border-2 text-btnbg hover:shadow-lg transition-all"
              onClick={() => handlemenunav("cart")}>
              <div className="absolute ml-2">
                <img src="../src/assets/icons/basket.png" width={25} height={25} />
              </div>
              <p className="ml-10">سبد خرید</p>
              {cartItemCount > 0 && ( 
                <p className=" bg-red-500 text-white text-xs rounded-full text-center w-5 mx-auto h-5 py-1">{cartItemCount}</p>
              )}
            </button>
          </div>
          <div>
            <button
              className="flex p-1 py-2 rounded-3xl w-40 bg-transparent border-textcolot border-2 text-btnbg hover:shadow-lg transition-all"
              onClick={handleLoginClick}
            >
              <div className="absolute ml-2">
                <img src="../src/assets/icons/user.png" width={25} height={25} />
              </div>
              <p className="ml-10 text-textcolot">{hasAccessToken ? 'پنل کاربری' : 'ورود / عضویت'}</p>
            </button>
          </div>
        </div>
      </div>
      <div className="flex mx-auto w-full justify-center">
        <header className=" text-textcolot p-4 z-10 relative text-right ">
          <div className="flex">
            <nav className="relative w-full flex">
              <ul className="flex justify-between space-x-12">
                <li className="relative">
                  <button 
                    onClick={() => handlemenunav("list")}
                    onMouseEnter={() => setDropdown(true)} 
                    onMouseLeave={() => setDropdown(false)}
                    className="focus:outline-none py-2"
                  >
                    دسته بندی ها
                  </button>
                  {dropdown && (
                    <ul className="absolute -left-24 w-48 bg-white border-btnbg border-2 rounded shadow-lg z-20 transition-all flex flex-col text-right"
                      onMouseEnter={() => setDropdown(true)}
                      onMouseLeave={() => setDropdown(false)}
                    >
                      <button className="p-2 hover:bg-btnbg cursor-pointer transition-all" onClick={() => handlemenunav("amoozesh")}>کمک درسی</button>
                      <button className="p-2 hover:bg-btnbg cursor-pointer transition-all" onClick={() => handlemenunav("ravanshenasi")}>روانشناسی</button>
                      <button className="p-2 hover:bg-btnbg cursor-pointer transition-all">تاریخی</button>
                    </ul>
                  )}
                </li>
                <button className="hover:bg-btnbg p-2 rounded cursor-pointer transition-colors">تخفیف ها</button>
                <button className="hover:bg-btnbg p-2 rounded cursor-pointer transition-colors">لوازم تحریر</button>
                <button className="hover:bg-btnbg p-2 rounded cursor-pointer transition-colors" onClick={() => handlemenunav("home")}>صفحه اصلی</button>
              </ul>
            </nav>
          </div>
        </header>
      </div>
    </>
  );
};

export default Header;
