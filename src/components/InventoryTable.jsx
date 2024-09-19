import React from 'react';
import Pagination from './Pagination';
import { sortProducts } from '../utils/sorting';

const InventoryTable = ({ products, itemsPerPage, setItemsPerPage, currentPage, setCurrentPage, sortOrder, setSortOrder, sortDirection, setSortDirection }) => {
    const sortedProducts = sortProducts(products, sortOrder, sortDirection);

  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);

  return (
    <>
    <div className='flex mx-auto  flex-col align-middle items-center w-4/5 h-5/6'>
    <h1 className="text-2xl font-bold mb-4">مدیریت موجودی و قیمت</h1>
      <table className="min-w-full border border-gray-300 mb-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2">موجودی</th>
            <th className="border border-gray-300 p-2">قیمت</th>
            <th className="border border-gray-300 p-2">نام کالا</th>
          </tr>
        </thead>
        <tbody>
          {currentProducts.map((product) => (
            <tr key={product._id}>
              <td className="border border-gray-300 p-2">{product.quantity}</td>
              <td className="border border-gray-300 p-2">{product.price}</td>
              <td className="border border-gray-300 p-2">{product.name}</td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
      <Pagination 
        totalPages={totalPages} 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage} 
        itemsPerPage={itemsPerPage} 
        setItemsPerPage={setItemsPerPage}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        sortDirection={sortDirection}
        setSortDirection={setSortDirection}
      />
    </>
  );
};

export default InventoryTable;
