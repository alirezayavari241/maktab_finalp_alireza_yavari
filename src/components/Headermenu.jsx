import React, { useState } from 'react';

const Header = () => {
  const [dropdown, setDropdown] = useState(false);

  return (
    <header className=" text-textcolot p-4 z-10 relative text-right ">
      <div className="flex">
        <nav className="relative w-full flex">
          <ul className="flex justify-between space-x-12">
            
            <li className="relative">
              <button 
                onMouseEnter={() => setDropdown(true)} 
                onMouseLeave={() => setDropdown(false)}
                className="focus:outline-none  py-2"
              >
                 دسته بندی ها
              </button>
              {dropdown && (
                <ul className="absolute -left-24 w-48 bg-white border-btnbg border-2 rounded shadow-lg z-20"
                onMouseEnter={() => setDropdown(true)} // ا
                onMouseLeave={() => setDropdown(false)}>
                  <li className="p-2 hover:bg-btnbg cursor-pointer">کمک درسی</li>
                  <li className="p-2 hover:bg-btnbg cursor-pointer">روانشناسی</li>
                  <li className="p-2 hover:bg-btnbg cursor-pointer">تاریخی</li>
                </ul>
              )}
            </li>
            <li className="hover:bg-btnbg p-2 rounded cursor-pointer transition-colors">تخفیف ها</li>
            <li className="hover:bg-btnbg p-2 rounded cursor-pointer transition-colors">لوازم تحریر</li>
            <li className="hover:bg-btnbg p-2 rounded cursor-pointer transition-colors">صفحه اصلی</li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
