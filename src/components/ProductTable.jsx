
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Pagination from './Pagination';
import { sortProducts } from '../utils/sorting';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { ClassicEditor, Bold, Essentials, Italic, Mention, Paragraph, Undo } from 'ckeditor5';
import { SlashCommand } from 'ckeditor5-premium-features';
import 'ckeditor5/ckeditor5.css';
import 'ckeditor5-premium-features/ckeditor5-premium-features.css';
const ProductTable = ({ itemsPerPage, setItemsPerPage, currentPage, setCurrentPage, sortOrder, setSortOrder, sortDirection, setSortDirection }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); // Add modal state
  const [editProductData, setEditProductData] = useState({});
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState([]);
  const [loading, setLoading] = useState(false); // Loading state
  const [addProductData, setAddProductData] = useState({
    description: '',
  });
  useEffect(() => {
    const fetchCategoriesAndSubcategories = async () => {
      try {
        const categoryResponse = await axios.get('http://localhost:8000/api/categories');
        setCategories(categoryResponse.data.data.categories);

        const subcategoryResponse = await axios.get('http://localhost:8000/api/subcategories');
        setSubcategories(subcategoryResponse.data.data.subcategories);
      } catch (error) {
        console.error('Error fetching categories and subcategories:', error);
      }
    };

    fetchCategoriesAndSubcategories();
  }, []);

  const handleCategoryChange = (e) => {
    const selectedCategoryId = e.target.value;
    setEditProductData({ ...editProductData, category: selectedCategoryId });

    const filtered = subcategories.filter(subcategory => subcategory.category === selectedCategoryId);
    setFilteredSubcategories(filtered);
  };

  const handleAddCategoryChange = (e) => {
    const selectedCategoryId = e.target.value;
    setAddProductData({ ...addProductData, category: selectedCategoryId });

    const filtered = subcategories.filter(subcategory => subcategory.category === selectedCategoryId);
    setFilteredSubcategories(filtered);
  };
  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/products?page=1&limit=100');
      const products = response.data.data.products
      setProducts(products)
      sortProducts(products);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };
 
  useEffect(() => {
    fetchProducts();
  }, []);

const handleproduct =async () =>{
  const sortedProducts = sortProducts(products, sortOrder, sortDirection);
  
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);

}
  const sortedProducts = sortProducts(products, sortOrder, sortDirection);
  
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);

  const handleDeleteClick = (product) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    setLoading(true);
    try {
      await axios.delete(`http://localhost:8000/api/products/${selectedProduct._id}`);
      setSelectedProduct(null);
      setIsDeleteModalOpen(false);
       fetchProducts();
      if(Response.status==500){
        setSelectedProduct(null);
        setIsDeleteModalOpen(false);
         fetchProducts();
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    } finally {
      setLoading(false);
      await fetchProducts();

    }
  };

  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setEditProductData({
      ...product,
      category: product.category._id,
      subcategory: product.subcategory._id
    });
    setFilteredSubcategories(subcategories.filter(subcategory => subcategory.category === product.category._id));
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async () => {
    setLoading(true);
    try {
      const { _id, thumbnail, images, createdAt, updatedAt, slugname, ...productDataToUpdate } = editProductData; 
      await handleproduct();
      await axios.patch(`http://localhost:8000/api/products/${selectedProduct._id}`, productDataToUpdate);
      setSelectedProduct(null);
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Error updating product:', error);
    } finally {
     setLoading(false);
     await fetchProducts();


    }
  };
  const handleEditChange1 = (e) => {
    setEditProductData({ ...editProductData, [e.target.name]: e.target.value });
  };
  const handleEditChange2 = (event, editor) => {
    const data = editor.getData(); 
    setEditProductData({ ...editProductData, description: data });
  };

  const handleAddChange = (event, editor) => {
    handleinputs()
    const data = editor.getData();
    setAddProductData({...addProductData, description: data }); 
  };

  const handleAddSubmit = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', addProductData.name);
      formData.append('brand', addProductData.brand);
      formData.append('price', addProductData.price);
      formData.append('quantity', addProductData.quantity);
      formData.append('description', addProductData.description);
      formData.append('category', addProductData.category);
      formData.append('subcategory', addProductData.subcategory);
      
      // Append images
      Array.from(addProductData.images).forEach((image) => {
        formData.append('images', image);
      });

      formData.append('thumbnail', addProductData.thumbnail);

      await axios.post('http://localhost:8000/api/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setAddProductData({}); 
      setIsAddModalOpen(false);
       fetchProducts(); 
      console.error('Error adding product:', error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div className='flex mx-auto flex-col align-middle items-center w-4/5 h-5/6'>
        <h1 className="text-2xl font-bold mb-4">لیست کالاها</h1>
        <button 
          className="bg-blue-500 text-white px-4 py-2 rounded mb-4" 
          onClick={() => setIsAddModalOpen(true)}
        >افزودن کالا
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
              <th className="border border-gray-300 p-2">عملیات</th>
              <th className="border border-gray-300 p-2">دسته بندی</th>
              <th className="border border-gray-300 p-2">نام کالا</th>
              <th className="border border-gray-300 p-2">تصویر</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="text-center py-4">
                  <div className="loader"></div>
                </td>
              </tr>
            ) : (
              currentProducts.map((product) => (
                <tr key={product._id} className='text-black'>
                  <td className="border border-gray-300 p-2 space-x-2 mx-auto">
                    <div className='w-full mx-auto align-middle justify-center flex space-x-2'> 
                      <button className='bg-green-500 text-white p-1 rounded-xl' onClick={() => handleEditClick(product)}>ویرایش</button>
                      <button className='bg-red-500 text-white p-1 rounded-xl' onClick={() => handleDeleteClick(product)}>حذف</button>
                    </div>
                  </td>
                  <td className="border border-gray-300 p-2 text-center">{product.category.name} - {product.subcategory.name}</td>
                  <td className="border border-gray-300 p-2 text-center">{product.name}</td>
                  <td className="border border-gray-300 p-2 h-full flex justify-center items-center">
                    {product.images.length > 0 ? (<img height={50} width={50} src={`http://${product.images[0]}`} alt="Product" />) : (<span>No Image</span>)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg felx flex-col mx-auto">
            <h2 className="mb-4 text-textcolot mx-auto">آیا مطمئن هستید که می‌خواهید این کالا را حذف کنید؟</h2>
            <p className='text-center mx-auto text-textcolot mb-2 mt-2'><strong>نام کالا:</strong> {selectedProduct.name}</p>
            <div className="flex justify-center space-x-2 mx-auto">
              <button onClick={handleDeleteConfirm} className="bg-red-500 text-white px-4 py-2 rounded">حذف</button>
              <button onClick={() => setIsDeleteModalOpen(false)} className="bg-gray-500 text-white px-4 py-2 rounded">بستن</button>
            </div>
          </div>
        </div>
      )}

      {isEditModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white p-4 px-4 rounded-lg mx-auto items-center justify-center align-middle flex flex-col overflow-scroll">
            <h2 className="mb-4 text-center text-textcolot">ویرایش کالا</h2>
            <div className='w-96 h-96'>
              <div className="mb-4">
                <label className=" w-full justify-between text-sm  font-medium text-gray-700 text-right flex">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
  <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
</svg>نام کالا</label>
                <input type="text" name="name" value={editProductData.name || ''} onChange={handleEditChange1} className="mt-1 block w-full border-btnbg border-2 px-1 rounded-md shadow-sm placeholder:text-right text-right bg-white text-black " />
              </div>
              <div className="mb-4">
                <label className="flex justify-between text-sm font-medium text-gray-700"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
</svg>قیمت</label>
                <input type="number" name="price" value={editProductData.price || ''} onChange={handleEditChange1} className="mt-1 block w-full border-btnbg border-2 px-1 rounded-md shadow-sm placeholder:text-right text-right bg-white text-black " />
              </div>
              <div className="mb-4">
                <label className="flex justify-between text-sm font-medium text-gray-700"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
  <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
</svg>تعداد</label>
                <input type="number" name="quantity" value={editProductData.quantity || ''} onChange={handleEditChange1} className="mt-1 block w-full border-btnbg border-2 px-1 rounded-md shadow-sm placeholder:text-right text-right bg-white text-black " />
              </div>
              <div className="mb-4">
                <label className="flex justify-between text-sm font-medium text-gray-700"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z" />
</svg>دسته بندی</label>
                <select name="category" value={editProductData.category || ''} onChange={handleCategoryChange} className="mt-1 block w-full border-btnbg border-2 px-1 rounded-md shadow-sm placeholder:text-right text-right bg-white text-black ">
                  <option value="">انتخاب دسته بندی</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>{category.name}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="flex justify-between text-sm font-medium text-gray-700"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
</svg>زیر دسته بندی</label>
                <select name="subcategory" value={editProductData.subcategory || ''} onChange={handleEditChange1} className="mt-1 block w-full border-btnbg border-2 px-1 rounded-md shadow-sm placeholder:text-right text-right bg-white text-black ">
                  <option value="">انتخاب زیر دسته بندی</option>
                  {filteredSubcategories.map((subcategory) => (
                    <option key={subcategory._id} value={subcategory._id}>{subcategory.name}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">توضیحات</label>
               <div className=''>
               <CKEditor
        editor={ClassicEditor}
        data={editProductData.description}
        onChange={handleEditChange2} 
            config={ {
                toolbar: {
                    items: [ 'undo', 'redo', '|', 'bold', 'italic' ],
                },
                plugins: [
                    Bold, Essentials, Italic, Mention, Paragraph, SlashCommand, Undo
                ],
                licenseKey: 'aGRMTUN1L25sK1VnTldna2ZYcW9kTVJJZFRLd0VzTi9paFhIanFCYWt6UlhBSXppc0FHMmpSR1kySWhFUEE9PS1NakF5TkRFeE1EYz0=',
                mention: {
                },
            } }
        />
               </div>
              </div>
              <div className="flex justify-center space-x-2 mx-auto col-span-3 mt-3 mb-4">
                <button type="button" onClick={handleEditSubmit} className="bg-blue-500 text-white px-4 py-2 rounded ">ذخیره</button>
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="bg-gray-500 text-white px-4 py-2 rounded">بستن</button>
              </div>
            </div>
          </div>
        </div>
      )}



      {isAddModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white  rounded-lg h-4/6 w-4/6 p-3 overflow-scroll">
            <h2 className="mb-6 text-textcolot text-center text-xl  w-full border-b-2 border-textcolot py-2">اضافه کردن کالا</h2>
            <form className='grid grid-cols-3 gap-y-3 justify-center align-middle items-center mx-auto'>
            <div className="mb-2 justify-center mx-auto">
            <label className="flex text-sm font-medium text-gray-700 text-right justify-between"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
</svg>
قیمت</label>
                <input type="number" name="price" value={addProductData.price || ''} onChange={handleAddChange} className="mt-1 p-1 block w-full border-gray-500 border-2 rounded-md shadow-sm bg-white" />
              </div>
              <div className="mb-2 justify-center mx-auto">
                <label className="flex text-sm font-medium text-gray-700 text-right justify-between"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
  <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
</svg>
تعداد</label>
                <input type="number" name="quantity" value={addProductData.quantity || ''} onChange={handleAddChange} className="mt-1 p-1 block w-full border-gray-500 border-2 rounded-md shadow-sm bg-white"/>
              </div>
              <div className="mb-2 justify-center mx-auto">
                <label className="flex text-sm font-medium text-gray-700 text-right justify-between">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
  <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
</svg>
نام کالا</label>

                <input type="text" name="name" value={addProductData.name || ''} onChange={handleAddChange}     className='mt-1 block p-1 w-full border-2 rounded-md shadow-sm bg-white '  />
              </div>
              <div className="mb-2 justify-center mx-auto">
                <label className="flex text-sm font-medium text-gray-700 text-right justify-between"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
</svg>
زیر دسته بندی</label>
                <select name="subcategory" value={addProductData.subcategory || ''} onChange={handleAddChange} className="mt-1 block w-52 p-1 border-gray-500 border-2 rounded-md shadow-sm bg-white">
                  <option value="">انتخاب زیر دسته بندی</option>
                  {filteredSubcategories.map((subcategory) => (
                    <option key={subcategory._id} value={subcategory._id}>{subcategory.name}</option>
                  ))}
                </select>
              </div>
              <div className="mb-2 justify-center mx-auto">
                <label className="flex text-sm font-medium text-gray-700 text-right justify-between"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z" />
</svg>
دسته بندی</label>
                <select name="category" value={addProductData.category || ''} onChange={handleAddCategoryChange} className="mt-1 block w-52 p-1 border-gray-500 border-2 rounded-md shadow-sm bg-white">
                  <option value="">انتخاب دسته بندی</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>{category.name}</option>
                  ))}
                </select>
              </div>
              <div className="mb-2 justify-center mx-auto">
                <label className="flex text-sm font-medium text-gray-700 text-right justify-between"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
  <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
  <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
</svg>
برند</label>
                <input type="text" name="brand" value={addProductData.brand || ''} onChange={handleAddChange} className="mt-1 block w-full  p-1 border-gray-500 border-2 rounded-md shadow-sm bg-white" />
              </div>
              <div className="mb-2 col-span-3  text-sm font-medium text-gray-700 text-right">
                <label className="block font-medium text-gray-700 text-right mt-3 mr-2 text-lg">توضیحات</label>
                  <div className=''>
                  <CKEditor
                          editor={ClassicEditor}
                          data={addProductData.description}
                          onChange={handleAddChange}
            config={ {
                toolbar: {
                    items: [ 'undo', 'redo', '|', 'bold', 'italic' ],
                },
                plugins: [
                    Bold, Essentials, Italic, Mention, Paragraph, SlashCommand, Undo
                ],
                licenseKey: 'aGRMTUN1L25sK1VnTldna2ZYcW9kTVJJZFRLd0VzTi9paFhIanFCYWt6UlhBSXppc0FHMmpSR1kySWhFUEE9PS1NakF5TkRFeE1EYz0=',
                mention: {
                },
            } }
        />
                  </div>
                {/* <textarea name="description" value={addProductData.description || ''} onChange={handleAddChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"></textarea> */}
              </div>
              <div className='flex mx-auto justify-center items-center space-x-4 col-span-3'>
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700  text-right">تصاویر</label>
                <input type="file" name="images" multiple onChange={(e) => setAddProductData({ ...addProductData, images: e.target.files })} className="mt-1 block w-full border-gray-500 border-2 rounded-md shadow-sm bg-white"/>

      </div>
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700  text-right">تصویر بند انگشتی</label>
                <input type="file" name="thumbnail" onChange={(e) => setAddProductData({ ...addProductData, thumbnail: e.target.files[0] })} className="mt-1 block w-full border-gray-500 border-2 rounded-md shadow-sm bg-white" />
              </div>
              </div>
              <div className="flex justify-center space-x-2 mx-auto col-span-3 mt-3 ">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="bg-gray-500 text-white px-4 py-2 rounded">بستن</button>
                <button type="button" onClick={handleAddSubmit} className="bg-blue-500 text-white px-4 py-2 rounded">اضافه کردن</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductTable;

