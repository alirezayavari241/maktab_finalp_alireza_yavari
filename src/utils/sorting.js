export const sortProducts = (products, sortOrder, sortDirection) => {
    return [...products].sort((a, b) => {
      const aValue = sortOrder === 'createdAt' ? new Date(a.createdAt) : sortOrder === 'price' ? a.price : a.quantity;
      const bValue = sortOrder === 'createdAt' ? new Date(b.createdAt) : sortOrder === 'price' ? b.price : b.quantity;
  
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    });
  };
  