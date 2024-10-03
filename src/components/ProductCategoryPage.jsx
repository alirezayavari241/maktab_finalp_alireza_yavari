import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "./Headermenu";
const CategoryPage = () => {
  const { categoryId, subcategoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleProductClick = (productId) => {
    navigate(`/products/${productId}`);
  };

  const fetchProducts = async (catId = null, subcatId = null) => {
    try {
      let url = "http://localhost:8000/api/products";
      
      if (subcatId && !catId) {
        url += `?subcategory=${subcatId}`;
      }
      else if (catId) {
        url += `?category=${catId}`;
        if (subcatId) {
          url += `&subcategory=${subcatId}`;
        }
      }
  
      const response = await axios.get(url);
      setProducts(response.data.data.products);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoryRes = await axios.get("http://localhost:8000/api/categories");
        setCategories(categoryRes.data.data.categories);

        const subcategoryRes = await axios.get("http://localhost:8000/api/subcategories");
        setSubcategories(subcategoryRes.data.data.subcategories);
      } catch (error) {
        console.error("Error fetching categories or subcategories:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts(categoryId, subcategoryId);
  }, [categoryId, subcategoryId]);

  const handleCategoryClick = (catId) => {
    navigate(`/productlist/${catId}`);
  };

  const handleSubcategoryClick = (subcatId, catId) => {
    navigate(`/productlist/${catId}/${subcatId}`);
  };

  return (<>
    <div className="font-iransans h-full overflow-scroll  bg-pbg">
    <Header/>
    <div className="flex flex-row-reverse w-4/5 mx-auto mt-8 ">
      <div className="w-1/4 h-full p-4 bg-gray-100 mr-0 text-textcolot text-right rounded-3xl">
        <h3 className="text-xl mb-4 w-full border-b-2 border-textcolot">دسته بندی کالا ها</h3>
        <ul>
          <li
            className={`cursor-pointer ${!categoryId ? "font-bold text-btnbg" : ""} text-xl`}
            onClick={() => navigate("/productlist")}
            >
            همه محصولات
          </li>
          {categories.map((category) => (
              <div key={category._id}>
              <li
                className={`cursor-pointer ${categoryId === category._id ? "font-bold text-btnbg" : ""} text-xl`}
                onClick={() => handleCategoryClick(category._id)}
                >
                {category.name}
              </li>
              <ul className="ml-4 ">
                {subcategories
                  .filter((subcat) => subcat.category === category._id) 
                  .map((subcat) => (
                      <li
                      key={subcat._id}
                      className={`cursor-pointer ${subcategoryId === subcat._id ? "font-bold text-btnbg underline" : ""} mr-2`}
                        onClick={() => handleSubcategoryClick(subcat._id, category._id)}
                      >
                      {subcat.name}
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </ul>
      </div>

      <div className="w-3/4">
        {loading ? (
            <p>Loading...</p>
        ) : (
            <div className="grid grid-cols-3 gap-4">
            {products.length > 0 ? (
                products.map((product) => (
                    <div key={product.id} className="flex-none w-64 border-btnbg border-2 p-4 rounded-3xl shadow-lg items-center justify-center">
            <img
              src={`http://${product.images}`} 
              alt={product.name}
              className="h-48 w-48 object-cover mb-4 mx-auto"
            />
            <h3 className="text-lg font-bold mb-2 text-black text-center">{product.name}</h3>
            <div className='flex justify-center'>
              <p className='text-black'>تومان</p>
              <p className="mb-2 text-black">{product.price.toLocaleString('fa-IR')}</p>
            </div>
            <button
              onClick={() => handleProductClick(product._id)}
              className="bg-textcolot text-white px-4 py-2 rounded w-full"
            >
              مشاهده بیشتر
            </button>
          </div>
              ))
            ) : (
                <p className="text-red-800 text-center">هنوز محصولاتی در این دسته بندی اضافه نشده</p>
            )}
          </div>
        )}
      </div>
    </div>

    </div>
        </>
  );
};

export default CategoryPage;
