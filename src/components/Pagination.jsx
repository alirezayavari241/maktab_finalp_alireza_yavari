import React from 'react';

const Pagination = ({ totalPages, currentPage, setCurrentPage, itemsPerPage, setItemsPerPage, sortOrder, setSortOrder, sortDirection, setSortDirection }) => {
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  const handleDirectionChange = (e) => {
    setSortDirection(e.target.value);
  };

  return (
    <>
      <div className="flex justify-between mb-4 w-4/5 mx-auto">
        <div>
          <label className='flex'>
          <p className='text-textcolot'>محصول در هر صفحه</p>
            <select value={itemsPerPage} onChange={handleItemsPerPageChange} className="border rounded ml-2">
              <option value={5}>5</option>
              <option value={2}>2</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
            </select>
          </label>
        </div>
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
          <select value={sortOrder} onChange={handleSortChange} className="border rounded ml-2 w-fit h-fit">
              <option value="createdAt">تاریخ</option>
              <option value="price">قیمت</option>
              <option value="quantity">موجودی</option>
            </select>
            <p className='text-textcolot'>مرتب سازی بر اساس</p>

          </label>

          <label className="flex w-full justify-between">
            <select value={sortDirection} onChange={handleDirectionChange} className="border rounded ml-2 w-fit">
              <option value="asc">صعودی</option>
              <option value="desc">نزولی</option>
            </select>
            <p className='text-textcolot'>ترتیب مرتب سازی</p>
          </label>
        </div>
      </div>


    </>
  );
};

export default Pagination;
