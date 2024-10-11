import React from 'react';

const OrdersPagination = ({ totalPages, currentPage, setCurrentPage, itemsPerPage, setItemsPerPage, sortOrder, setSortOrder, sortDirection, setSortDirection }) => {
  
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value, 10));
    setCurrentPage(1); // Reset to first page on items per page change
  };

  const handleSortOrderChange = (e) => {
    setSortOrder(e.target.value);
  };

  const handleSortDirectionChange = (e) => {
    setSortDirection(e.target.value);
  };

  return (
    <div className="flex mx-auto mb-4 justify-between w-4/5 items-center space-x-32">
      <div>
        <label className='flex'>
          <p className='text-textcolot'>محصول در هر صفحه</p>
          <select value={itemsPerPage} onChange={handleItemsPerPageChange} className="border rounded ml-2 bg-white text-black">
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={20}>20</option>
          </select>
        </label>
      </div>

      {/* Sort Options */}
      

      <div className="flex justify-center mb-4">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index + 1)}
            className={`mx-1 p-2 rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            {index + 1}
          </button>
        ))}
      </div>
      <div className='flex flex-col align-middle items-center'>
      <label className='flex w-full'>
          <select value={sortOrder} onChange={handleSortOrderChange} className="border rounded ml-2 bg-white w-20 text-black">
            <option value="date">تاریخ</option>
            <option value="price">قیمت</option>
          </select>
          <p className='text-textcolot text-center'>مرتب‌سازی بر اساس</p>
        </label>

          <label className="flex w-full justify-between">
          <select value={sortDirection} onChange={handleSortDirectionChange} className="border rounded ml-2 w-20 bg-white text-black">
            <option value="asc">صعودی</option>
            <option value="desc">نزولی</option>
          </select>
          <p className='text-textcolot text-center' > ترتیب مرتب سازی</p>
        </label>
      </div>
    </div>
  );
};

export default OrdersPagination;
