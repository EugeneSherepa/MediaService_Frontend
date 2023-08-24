import { FC, useState, useEffect } from 'react';
import { LeftColumn } from './Components/LeftColumn/LeftColumn';
import { RightColumn } from './Components/RightColumn/RightColumn';
import './App.scss';
import { client } from './fetchClient';
import { Product, Receipt ,ProductInReceipt } from './types';

export const App: FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [receipt, setReceipt] = useState<Receipt[]>([]);
  const [productsInReceipt, setProductsInReceipt] = useState<ProductInReceipt[]>([]);

  const fetchData = async () => {
    try {
      const receiptFromServer = await client.get<Receipt[]>('/receipt');
      setReceipt(receiptFromServer);
      
      const productsFromServer = await client.get<Product[]>('/product');
      setProducts(productsFromServer);
      
      const productsInReceiptFromServer = await client.get<ProductInReceipt[]>('/prodreceipt');
      setProductsInReceipt(productsInReceiptFromServer);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="app__container">
      <LeftColumn 
        receipt={receipt}
        products={products} 
        productsInReceipt={productsInReceipt}
        fetchData={fetchData}
      />
      <RightColumn 
        productsInReceipt={productsInReceipt} 
        receipt={receipt}
        products={products} 
        fetchData={fetchData}
      />
    </div>
  );
};
