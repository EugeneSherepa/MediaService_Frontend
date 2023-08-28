import React, { FC, useState, useMemo } from 'react';
import { Receipt, ProductInReceipt, Product } from '../../types';
import { TableLeft } from './Table/Table';
import { Search } from './Search/Search';
import './LeftColumn.scss';

type Props = {
  receipt: Receipt[];
  productsInReceipt: ProductInReceipt[];
  products: Product[];
  fetchData: {
    fetchReceipts: () => void;
    fetchProducts: () => void;
    fetchProductsInReceipt: () => void;
  };
};

export const LeftColumn: FC<Props> = ({ 
  receipt, 
  productsInReceipt, 
  products, 
  fetchData 
}) => {
  const [searchValue, setSearchValue] = useState('');

  const filteredProducts = useMemo(() => {
    return products.filter(product =>
      product.name.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [products, searchValue]);

  const handleSearch = (newSearchValue: string) => {
    setSearchValue(newSearchValue);
  };

  return (
    <div className="left-column__container">
      <div className="search-bar">
        <Search 
          searchValue={searchValue}
          onSearch={handleSearch}
        />
      </div>
      <div className="table-wrapper">
        <TableLeft 
          filteredProducts={filteredProducts}
          receipt={receipt}
          productsInReceipt={productsInReceipt}
          fetchData={fetchData}
        />
      </div>
    </div>
  );
}
