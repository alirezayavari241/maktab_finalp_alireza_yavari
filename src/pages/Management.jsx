import React, { useState, useEffect } from 'react';
import { useFetchProducts } from '../hooks/useFetchProducts';
import TabButtons from '../components/TabButtons';
import ProductTable from '../components/ProductTable';
import InventoryTable from '../components/InventoryTable';
import OrdersTable from '../components/Orderstable'; // Import the OrdersTable
import { useNavigate } from 'react-router-dom';

const AdminPanel = () => {
  const { products, loading, error, itemsPerPage, setItemsPerPage, currentPage, setCurrentPage, sortOrder, setSortOrder, sortDirection, setSortDirection } = useFetchProducts();
  const navigate = useNavigate();
  const [dropdown, setDropdown] = useState(false);
  const [hasAccessToken, setHasAccessToken] = useState(false);
  const [activeTab, setActiveTab] = useState(1);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      setHasAccessToken(true);
    }
  }, []);

  const handleLogoutClick = () => {
    localStorage.removeItem('accessToken'); 
    setHasAccessToken(false); 
    navigate('/login'); 
  };

  if (loading) return <div>در حال بارگذاری...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="h-screen bg-white overflow-scroll font-iransans">
      <div className='w-full bg-textcolot py-2 flex justify-end'>
        <div>
          <p className='text-white p-2 font-iransans flex mt-3 mr-3'>پنل مدیریت فروشگاه کتاب 
            <li className="relative -mt-2 px-3">
              <button 
                onMouseEnter={() => setDropdown(true)} 
                onMouseLeave={() => setDropdown(false)}
                className="focus:outline-none py-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" /></svg>
              </button>
              {dropdown && (
                <ul className="absolute -left-20 w-32 bg-gray-400 border-btnbg border-2 rounded shadow-lg z-10 -mt-2 flex-col flex"
                onMouseEnter={() => setDropdown(true)}  
                onMouseLeave={() => setDropdown(false)}>
                  <button className="p-2 hover:bg-btnbg cursor-pointer border-b-2 border-btnbg" onClick={() => navigate('/')}>صفحه اصلی</button>
                  <button className="p-2 hover:bg-btnbg cursor-pointer" onClick={handleLogoutClick}>خروج</button>
                </ul>
              )}
            </li>
          </p>
        </div>
      </div>
      <div className='w-full bg-btnbg py-4'>
        <TabButtons activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
      <div className="container mx-auto p-4">
        <div>                       
          {activeTab === 1 && (
            <ProductTable 
              products={products} 
              itemsPerPage={itemsPerPage}
              setItemsPerPage={setItemsPerPage}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
              sortDirection={sortDirection}
              setSortDirection={setSortDirection}
            />
          )}
          {activeTab === 2 && (
            <InventoryTable 
              products={products}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
              sortDirection={sortDirection}
              setSortDirection={setSortDirection}
            />
          )}
          {activeTab === 3 && ( // Adding the orders tab
            <OrdersTable />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
