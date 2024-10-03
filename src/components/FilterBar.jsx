import React, { useState } from 'react';

const FilterBar = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({ price: '', stock: '', dateAdded: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    onFilterChange({ ...filters, [name]: value });
  };

  return (
    <div className="flex justify-between mb-4">
      <select name="price" onChange={handleChange}>
        <option value="">قیمت</option>
        <option value="asc">ارزان‌ترین</option>
        <option value="desc">گران‌ترین</option>
      </select>
      <select name="stock" onChange={handleChange}>
        <option value="">موجودی</option>
        <option value="asc">موجودی کم</option>
        <option value="desc">موجودی زیاد</option>
      </select>
      <select name="dateAdded" onChange={handleChange}>
        <option value="">تاریخ افزوده شدن</option>
        <option value="asc">قدیمی‌ترین</option>
        <option value="desc">جدیدترین</option>
      </select>
    </div>
  );
};

export default FilterBar;
