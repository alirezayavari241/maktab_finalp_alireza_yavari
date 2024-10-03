import React from 'react';

const ProductItem = ({ product }) => {
  return (
    <div className="border rounded-lg p-4">
      <img src={product.image} alt={product.name} className="w-full h-32 object-cover" />
      <h2 className="text-lg font-semibold">{product.name}</h2>
      <p className="text-gray-700">${product.price}</p>
      <p className="text-gray-500">{product.description}</p>
    </div>
  );
};

export default ProductItem;
