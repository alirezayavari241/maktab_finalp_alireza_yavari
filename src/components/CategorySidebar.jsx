import React from 'react';
import { Link } from 'react-router-dom';

const CategorySidebar = ({ categories }) => {
  return (
    <div className="w-1/4">
      <ul>
        {categories.map(category => (
          <li key={category.id}>
            <Link to={`/category/${category.id}`}>{category.name}</Link>
            <ul>
              {category.subcategories.map(sub => (
                <li key={sub.id}>
                  <Link to={`/category/${category.id}/subcategory/${sub.id}`}>{sub.name}</Link>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategorySidebar;
