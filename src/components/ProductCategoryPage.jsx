import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import Header from "./Headermenu";
import Bfooter from "./Footer";

const CategoryPage = () => {
  const { categoryId, subcategoryId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortType, setSortType] = useState(searchParams.get("sort") || "newest");
  const [itemsPerPage, setItemsPerPage] = useState(Number(searchParams.get("limit")) || 6);
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get("page")) || 1);
  const [totalProducts, setTotalProducts] = useState(0);
  const navigate = useNavigate();

  const handleProductClick = (productId) => {
    navigate(`/products/${productId}`);
  };

  const fetchProducts = async (catId = null, subcatId = null, sort = "newest", page = 1, limit = 6) => {
    try {
      let url = `http://localhost:8000/api/products?page=${page}&limit=${limit}`;

      if (subcatId && !catId) {
        url += `&subcategory=${subcatId}`;
      } else if (catId) {
        url += `&category=${catId}`;
        if (subcatId) {
          url += `&subcategory=${subcatId}`;
        }
      }

      if (sort === "+price") {
        url += `&sort=+price`;
      } else if (sort === "-price") {
        url += `&sort=-price`;
      } else {
        url += `&sort=-createdAt`;
      }

      const response = await axios.get(url);
      setProducts(response.data.data.products);
      setTotalProducts(response.data.total);
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
    fetchProducts(categoryId, subcategoryId, sortType, currentPage, itemsPerPage);
  }, [categoryId, subcategoryId, sortType, currentPage, itemsPerPage]);

  useEffect(() => {
    setSearchParams({
      sort: sortType,
      limit: itemsPerPage,
      page: currentPage,
    });
  }, [sortType, itemsPerPage, currentPage, setSearchParams]);

  const handleCategoryClick = (catId) => {
    navigate(`/productlist/${catId}`);
  };

  const handleSubcategoryClick = (subcatId, catId) => {
    navigate(`/productlist/${catId}/${subcatId}`);
  };

  const handleSortChange = (event) => {
    setSortType(event.target.value);
    setCurrentPage(1); // Reset to first page
  };

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(1); // Reset to first page
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const totalPages = Math.ceil(totalProducts / itemsPerPage);

  return (
    <>
      <div className="font-iransans bg-pbg">
        <Header />
        <div className="flex flex-row-reverse w-4/5 mx-auto mt-8 ">
          <div className="w-1/4 h-full p-4 bg-gray-100 mr-0 text-textcolot text-right rounded-3xl">
            <h3 className="text-xl mb-4 w-full border-b-2 border-textcolot">
              دسته بندی کالا ها
            </h3>
            <ul>
              <li
                className={`cursor-pointer ${
                  !categoryId ? "font-bold text-btnbg" : ""
                } text-xl`}
                onClick={() => navigate("/productlist")}
              >
                همه محصولات
              </li>
              {categories.map((category) => (
                <div key={category._id}>
                  <li
                    className={`cursor-pointer ${
                      categoryId === category._id ? "font-bold text-btnbg" : ""
                    } text-xl`}
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
                          className={`cursor-pointer ${
                            subcategoryId === subcat._id
                              ? "font-bold text-btnbg underline"
                              : ""
                          } mr-2`}
                          onClick={() =>
                            handleSubcategoryClick(subcat._id, category._id)
                          }
                        >
                          {subcat.name}
                        </li>
                      ))}
                  </ul>
                </div>
              ))}
            </ul>
          </div>

          <div className="w-3/4 ">
            <div className="flex items-center mx-auto space-x-4">
              <div className="flex flex-row">
                <label className="text-lg text-textcolot mx-auto mt-1">مرتب‌سازی بر اساس</label>
                <select
                  value={sortType}
                  onChange={handleSortChange}
                  className="bg-white border-btnbg border rounded-xl p-1 text-center text-black"
                >
                  <option value="+price" className="bg-white">ارزان‌ترین</option>
                  <option value="-price">گران‌ترین</option>
                  <option value="newest">جدیدترین</option>
                </select>
              </div>

              <div className="flex flex-row mr-10">
                <label className="text-lg text-textcolot mx-auto mt-1">تعداد محصولات در صفحه</label>
                <select
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                  className="bg-white border-btnbg border rounded-xl p-1 text-center text-black"
                >
                  <option value={2}>2</option>
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                </select>
              </div>
            </div>

            {loading ? (
              <p>Loading...</p>
            ) : (
              <>
                <div className="grid grid-cols-3 gap-4 mt-8">
                  {products.length > 0 ? (
                    products.map((product) => (
                      <div
                        key={product.id}
                        className="flex-none w-64 border-btnbg border-2 p-4 rounded-3xl shadow-lg items-center justify-center"
                      >
                        <img
                          src={`http://${product.images[0]}`}
                          alt={product.name}
                          className="h-48 w-48 object-cover mb-4 mx-auto"
                        />
                        <h3 className="text-lg font-bold mb-2 text-black text-center">
                          {product.name}
                        </h3>
                        <div className="flex justify-center">
                          <p className="text-black">تومان</p>
                          <p className="mb-2 text-black">
                            {product.price.toLocaleString("fa-IR")}
                          </p>
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
                    <p className="text-red-800 text-center">
                      هنوز محصولاتی در این دسته بندی اضافه نشده
                    </p>
                  )}
                </div>
                {totalProducts > itemsPerPage && (
                  <div className="flex justify-center mt-8">
                    {Array.from({ length: totalPages }, (_, index) => (
                      <button
                        key={index}
                        className={`px-4 py-2 mx-1 border rounded  ${
                          currentPage === index + 1
                            ? "bg-btnbg text-white"
                            : "bg-gray-200 text-black"
                        }`}
                        onClick={() => handlePageChange(index + 1)}
                      >
                        {index + 1}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        <Bfooter />
      </div>
    </>
  );
};

export default CategoryPage;
