import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange, itemsPerPage, onItemsPerPageChange }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex justify-between items-center">
      <select onChange={e => onItemsPerPageChange(e.target.value)} value={itemsPerPage}>
        <option value="10">10 آیتم</option>
        <option value="20">20 آیتم</option>
        <option value="50">50 آیتم</option>
      </select>
      <ul className="flex">
        {pages.map(page => (
          <li key={page} onClick={() => onPageChange(page)} className={page === currentPage ? 'font-bold' : ''}>
            {page}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Pagination;
