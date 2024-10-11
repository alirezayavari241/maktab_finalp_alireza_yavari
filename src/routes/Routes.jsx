import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Home from "../pages/Home";
import AdminPanel from "../pages/Management";
import ProductDetail from "../pages/ProductDetail";
import CategoryPage from "../components/ProductCategoryPage";
import CartPage from "../pages/Cart";
import OrderCompletionPage from "../pages/SubmitCart";
import PaymentPage from "../pages/PaymentPage";
import OrderStatusPage from "../pages/OrderStatus";

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
  <Route path='/cart' element={<CartPage />} />
  <Route path='/SubmitCart' element={<OrderCompletionPage />} />
  <Route path="/payment" element={<PaymentPage/> } />
  <Route path="/orders/:orderId" element={<OrderStatusPage />} />

            </Routes>
        </Router>
    )
}

export default AppRoutes;
