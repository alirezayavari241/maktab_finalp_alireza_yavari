import React from 'react';

const SortOptions = ({ sortOrder, setSortOrder, sortDirection, setSortDirection }) => {
  return (
    <div className="flex justify-between mb-4">
      <div>
        <label>
          مرتب‌سازی بر اساس:
          <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="border rounded ml-2">
            <option value="createdAt">تاریخ اضافه شدن</option>
            <option value="price">قیمت</option>
            <option value="quantity">موجودی</option>
          </select>
        </label>
        <label className="ml-4">
          ترتیب:
          <select value={sortDirection} onChange={(e) => setSortDirection(e.target.value)} className="border rounded ml-2 bg-white">
            <option value="asc">صعودی</option>
            <option value="desc">نزولی</option>
          </select>
        </label>
      </div>
    </div>
  );
};

export default SortOptions;
