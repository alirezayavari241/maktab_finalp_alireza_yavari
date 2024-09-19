import React from 'react';
import Pagination from './Pagination';
import { sortProducts } from '../utils/sorting';

const ProductTable = ({ products, itemsPerPage, setItemsPerPage, currentPage, setCurrentPage, sortOrder, setSortOrder, sortDirection, setSortDirection }) => {
  const sortedProducts = sortProducts(products, sortOrder, sortDirection);
  
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);

  return (
    <>
    <div className='flex mx-auto  flex-col align-middle items-center w-4/5 h-5/6'>
    <h1 className="text-2xl font-bold mb-4">لیست کالاها</h1>
      <table className="min-w-full border border-gray-300 mb-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2">عملیات</th>
            <th className="border border-gray-300 p-2">دسته بندی</th>
            <th className="border border-gray-300 p-2">نام کالا</th>
            <th className="border border-gray-300 p-2">تصویر</th>
          </tr>
        </thead>
        <tbody>
          {currentProducts.map((product) => (
            <tr key={product._id}>
              <td className="border border-gray-300 p-2 flex align-middle space-x-2 mx-auto">
                <button className='bg-green-500 text-white p-1 rounded-xl'>ویرایش</button>
                <button className='bg-red-500 text-white p-1 rounded-xl'>حذف</button>
              </td>
              <td className="border border-gray-300 p-2 text-center">{product.category.name} - {product.subcategory.name}</td>
              <td className="border border-gray-300 p-2 text-center">{product.name}</td>
              <td className="border border-gray-300 p-2 h-full flex justify-center items-center">
                {product.images.length > 0 ? (<img height={50} width={50} src={`http://${product.images[0]}`} alt="Product" />) : (<span>No Image</span>)}
              </td>
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

export default ProductTable;
