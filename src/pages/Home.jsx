import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ImageSlider from '../components/Layouts/Slider';
import Header from '../components/Headermenu';

function Home() {
  const navigate = useNavigate();
  const [hasAccessToken, setHasAccessToken] = useState(false);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      setHasAccessToken(true);
    }
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
      <div className="bg-pbg h-screen font-iransans">
        <div className="flex flex-row-reverse justify-between w-4/5 align-middle items-center content-center mx-auto border-b-btnbg border-b-2">
          <div className="flex">
            <div className="absolute">
              <img src="src/assets/icons/icons8-search-48.png" height={30} width={30} className="mt-1 ml-2" />
            </div>
            <input
              type="text"
              placeholder="جستجوی محصولات"
              className="bg-btnbg bg-opacity-50 text-right w-64 p-2 focus:outline-none rounded-3xl h-10 placeholder:text-gray-500"
            />
          </div>
          <div>
            <img className="h-40 w-40" src="src/assets/icons/logo.png" />
          </div>
          <div className="flex space-x-3">
            <div>
              <button className="flex p-1 py-2 rounded-3xl w-32 bg-transparent border-btnbg border-2 text-btnbg hover:shadow-lg">
                <div className="absolute ml-2">
                  <img src="src/assets/icons/basket.png" width={25} height={25} />
                </div>
                <p className="ml-10">سبد خرید</p>
              </button>
            </div>
            <div>
              <button
                className="flex p-1 py-2 rounded-3xl w-40 bg-transparent border-textcolot border-2 text-btnbg hover:shadow-lg"
                onClick={handleLoginClick}
              >
                <div className="absolute ml-2">
                  <img src="src/assets/icons/user.png" width={25} height={25} />
                </div>
                <p className="ml-10 text-textcolot">{hasAccessToken ? 'پنل کاربری' : 'ورود / عضویت'}</p>
              </button>
            </div>
          </div>
        </div>
        <div className="flex mx-auto w-full justify-center">
          <Header />
        </div>
        <div className="flex w-4/5 mx-auto mt-10">
          <ImageSlider />
        </div>
      </div>
    </>
  );
}

export default Home;
