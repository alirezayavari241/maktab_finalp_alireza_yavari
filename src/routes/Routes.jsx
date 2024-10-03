import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Home from "../pages/Home";
import AdminPanel from "../pages/Management";
import ProductDetail from "../pages/ProductDetail";
import CategoryPage from "../components/ProductCategoryPage";

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path='/panel' element={<AdminPanel />} />
                <Route path="/products/:id" element={<ProductDetail />} />
                <Route path="/productlist" element={<CategoryPage />} />
  <Route path="/productlist/:categoryId" element={<CategoryPage />} />
  <Route path="/productlist/:categoryId/:subcategoryId" element={<CategoryPage />} />
  <Route path="/productlist/subcategory/:subcategoryId" element={<CategoryPage />} />

            </Routes>
        </Router>
    )
}

export default AppRoutes;
