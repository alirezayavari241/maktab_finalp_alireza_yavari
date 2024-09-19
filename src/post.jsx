import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProductList = () => {
//   const [products, setProducts] = useState([]); // مقدار اولیه آرایه خالی
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     axios.get('http://localhost:8000/api/products')  // URL بک‌اند خود را جایگزین کنید
//       .then(response => {
//         // دسترسی به لیست محصولات در داخل response.data.data.products
//         const productData = response.data?.data?.products; // بررسی وجود سلسله مراتب داده‌ها
//         if (Array.isArray(productData)) {
//           setProducts(productData);  // اگر products یک آرایه بود آن را تنظیم کن
//         } else {
//           console.error("Expected an array but got:", typeof productData);
//           setError("Invalid data format");
//         }
//         setLoading(false);
//       })
//       .catch(err => {
//         console.error('Error fetching products:', err.message);
//         setError(err.message);
//         setLoading(false);
//       });
//   }, []);

//   if (loading) return <p>در حال بارگذاری...</p>;
//   if (error) return <p>خطا: {error}</p>;

//   return (
//     <div>
//       <h1>لیست محصولات</h1>
//       <ul>
//         {products.map(product => (
//           <li key={product.id}>
//             {product.name} - ${product.price}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
};

export default ProductList;
