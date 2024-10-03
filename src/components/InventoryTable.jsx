import React, { useState } from 'react';
import Pagination from './Pagination';
import { sortProducts } from '../utils/sorting';
import axios from 'axios'; // اضافه کردن axios

const InventoryTable = ({ products, itemsPerPage, setItemsPerPage, currentPage, setCurrentPage, sortOrder, setSortOrder, sortDirection, setSortDirection }) => {
    const [isEditMode, setIsEditMode] = useState(false); // حالت ویرایش
    const [editableProducts, setEditableProducts] = useState([]); // محصولات قابل ویرایش
    const [loading, setLoading] = useState(false); // حالت بارگذاری

    const sortedProducts = sortProducts(products, sortOrder, sortDirection);

    const indexOfLastProduct = currentPage * itemsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
    const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);

    // فعال‌سازی حالت ویرایش
    const handleEditClick = () => {
        setIsEditMode(true);
        setEditableProducts(currentProducts.map(product => ({ ...product })));
    };

    // ذخیره‌سازی تغییرات
    const handleSaveClick = async () => {
        setLoading(true); // شروع حالت بارگذاری
        try {
            // ارسال درخواست patch برای هر محصول ویرایش شده
            const updateRequests = editableProducts.map(product => 
                axios.patch(`http://localhost:8000/api/products/${product._id}`, {
                    quantity: product.quantity,
                    price: product.price
                })
            );
            await Promise.all(updateRequests);
            setIsEditMode(false);
            console.log('محصولات با موفقیت به‌روزرسانی شدند');
        } catch (error) {
            console.error('خطا در به‌روزرسانی محصولات:', error);
        }
        setLoading(false); // پایان حالت بارگذاری
    };

    // مدیریت تغییر در مقادیر موجودی و قیمت
    const handleInputChange = (e, productId, field) => {
        const updatedProducts = editableProducts.map(product => 
            product._id === productId ? { ...product, [field]: e.target.value } : product
        );
        setEditableProducts(updatedProducts);
    };

    return (
      <>
        <div className='flex mx-auto  flex-col align-middle items-center w-4/5 h-5/6'>
          <h1 className="text-2xl font-bold mb-4">مدیریت موجودی و قیمت</h1>
          <button
            onClick={isEditMode ? handleSaveClick : handleEditClick}
            className={`mb-4 px-4 py-2 ${isEditMode ? 'bg-green-500' : 'bg-blue-500'} text-white rounded`}
            disabled={loading} // غیرفعال کردن دکمه در حالت بارگذاری
          >
            {loading ? 'در حال ذخیره...' : isEditMode ? 'ذخیره تغییرات' : 'ویرایش موجودی و قیمت‌ها'}
          </button>
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
          <table className="min-w-full border border-gray-300 mb-4">
            <thead>
              <tr className="bg-gray-100 text-black">
                <th className="border border-gray-300 p-2">موجودی</th>
                <th className="border border-gray-300 p-2">قیمت</th>
                <th className="border border-gray-300 p-2">نام کالا</th>
              </tr>
            </thead>
            <tbody>
              {currentProducts.map((product) => (
                <tr key={product._id} className="text-black">
                  <td className="border border-gray-300 p-2 text-center">
                    {isEditMode ? (
                      <input
                        type="number"
                        value={
                          editableProducts.find(p => p._id === product._id)?.quantity || ''
                        }
                        onChange={(e) => handleInputChange(e, product._id, 'quantity')}
                        className=" text-center border-gray-300 rounded bg-gray-300 w-fit"
                      />
                    ) : (
                      product.quantity.toLocaleString('fa-IR')
                    )}
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    {isEditMode ? (
                      <input
                        type="number"
                        value={
                          editableProducts.find(p => p._id === product._id)?.price || ''
                        }
                        onChange={(e) => handleInputChange(e, product._id, 'price')}
                        className=" text-center border-gray-300 rounded bg-gray-300 w-fit"
                      />
                    ) : (
                      product.price.toLocaleString('fa-IR')
                    )}
                  </td>
                  <td className="border border-gray-300 p-2 text-center">{product.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    );
};

export default InventoryTable;
