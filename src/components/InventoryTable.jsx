import React, { useState, useEffect } from 'react';
import Pagination from './Pagination';
import { sortProducts } from '../utils/sorting';
import axios from 'axios'; 
import { toast, ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 

const InventoryTable = ({ itemsPerPage, setItemsPerPage, currentPage, setCurrentPage, sortOrder, setSortOrder, sortDirection, setSortDirection }) => {
    const [products, setProducts] = useState([]); // محصولات از سرور
    const [editableProducts, setEditableProducts] = useState([]); // محصولات قابل ویرایش
    const [editedProductIds, setEditedProductIds] = useState([]); // محصولات تغییر کرده
    const [loading, setLoading] = useState(false); // حالت بارگذاری
    const [originalProducts, setOriginalProducts] = useState([]); // ذخیره نسخه اصلی محصولات

    // واکشی محصولات از سرور
    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/products?limit=100');
            setProducts(response.data.data.products);
            setEditableProducts(response.data.data.products.map(product => ({ ...product, isEditing: [] }))); // تنظیم اولیه برای editable
            setOriginalProducts(response.data.data.products); // ذخیره نسخه اصلی محصولات
        } catch (error) {
            console.error('خطا در دریافت محصولات:', error);
        }
    };

    useEffect(() => {
        fetchProducts(); // واکشی اولیه محصولات
    }, []);

    const sortedProducts = sortProducts(products, sortOrder, sortDirection);
    const indexOfLastProduct = currentPage * itemsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
    let currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);

    // فعال‌سازی حالت ویرایش با کلیک برای چندین سلول
    const handleCellClick = (productId, field) => {
        const updatedProducts = editableProducts.map(product => 
            product._id === productId
                ? { ...product, isEditing: [...product.isEditing, field] } // اضافه کردن فیلد به لیست فیلدهای در حال ویرایش
                : product
        );
        setEditableProducts(updatedProducts);
    };

    // لغو ویرایش با کلید ESC برای همان فیلد
    const handleKeyDown = (e, productId, field) => {
        if (e.key === 'Escape') {
            const updatedProducts = editableProducts.map(product =>
                product._id === productId
                    ? { 
                        ...product, 
                        isEditing: product.isEditing.filter(f => f !== field), // حذف فیلد از لیست فیلدهای در حال ویرایش
                        [field]: originalProducts.find(p => p._id === productId)[field] // بازگرداندن مقدار به مقدار اولیه
                      }
                    : product
            );
            setEditableProducts(updatedProducts);
        }
    };

    // ذخیره‌سازی تغییرات
    const handleSaveClick = async () => {
        setLoading(true); 
        try {
            const updateRequests = editableProducts.map(product => 
                axios.patch(`http://localhost:8000/api/products/${product._id}`, {
                    quantity: product.quantity,
                    price: product.price
                })
            );
            await Promise.all(updateRequests);

            toast.success('تغییرات با موفقیت ذخیره شد!', { position: "top-right" });

            // خروج از حالت ویرایش برای همه محصولات
            const updatedProducts = editableProducts.map(product => ({ ...product, isEditing: [] }));
            setEditableProducts(updatedProducts);

            // واکشی مجدد محصولات برای بروزرسانی جدول
            await fetchProducts();
            setEditedProductIds([]); 
            setLoading(false);
        } catch (error) {
            console.error('خطا در به‌روزرسانی محصولات:', error);
            toast.error('خطایی رخ داد!', { position: "top-right" });
            setLoading(false); 
        }
    };

    // مدیریت تغییر در مقادیر موجودی و قیمت
    const handleInputChange = (e, productId, field) => {
        const updatedProducts = editableProducts.map(product => 
            product._id === productId ? { ...product, [field]: e.target.value } : product
        );
        setEditableProducts(updatedProducts);

        if (!editedProductIds.includes(productId)) {
            setEditedProductIds([...editedProductIds, productId]);
        }
    };

    // بررسی اینکه آیا تغییری نسبت به مقدار اولیه صورت گرفته است یا خیر
    const hasChanges = (productId, field) => {
        const originalProduct = originalProducts.find(p => p._id === productId);
        const editedProduct = editableProducts.find(p => p._id === productId);
        return originalProduct[field] !== editedProduct[field];
    };

    // بررسی فعال بودن دکمه ثبت تغییرات
    const isSaveDisabled = () => {
        return editedProductIds.length === 0 || !editableProducts.some(product => {
            return hasChanges(product._id, 'quantity') || hasChanges(product._id, 'price');
        });
    };

    return (
      <>
        <div className='flex mx-auto  flex-col align-middle items-center w-4/5 h-5/6'>
          <h1 className="text-2xl font-bold mb-4">مدیریت موجودی و قیمت</h1>
          <button
            onClick={handleSaveClick}
            className="mb-4 px-4 py-2 bg-green-500 text-white rounded"
            disabled={loading || isSaveDisabled()} 
          >
            {loading ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
          </button>

          <ToastContainer /> {/* نمایش Toast */}
          
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
                <tr key={product._id} className={`text-black ${editedProductIds.includes(product._id) ? 'bg-yellow-200' : ''}`}>
                  <td 
                    className="border border-gray-300 p-2 text-center"
                    onClick={() => handleCellClick(product._id, 'quantity')}
                    onKeyDown={(e) => handleKeyDown(e, product._id, 'quantity')}
                  >
                    {editableProducts.find(p => p._id === product._id)?.isEditing.includes('quantity') ? (
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
                  <td 
                    className="border border-gray-300 p-2 text-center"
                    onClick={() => handleCellClick(product._id, 'price')}
                    onKeyDown={(e) => handleKeyDown(e, product._id, 'price')}
                  >
                    {editableProducts.find(p => p._id === product._id)?.isEditing.includes('price') ? (
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





