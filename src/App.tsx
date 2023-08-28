import { FC, useState, useEffect } from 'react';
import { LeftColumn } from './Components/LeftColumn/LeftColumn';
import { RightColumn } from './Components/RightColumn/RightColumn';
import './App.scss';
import emptyReceiptPhoto from './assets/Emptyreceipt.png'
import { client } from './fetchClient';
import { Product, Receipt ,ProductInReceipt } from './types';

export const App: FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [receipt, setReceipt] = useState<Receipt[]>([]);
  const [productsInReceipt, setProductsInReceipt] = useState<ProductInReceipt[]>([]);

  const fetchData = {
    fetchReceipts: async () => {
      try {
        const receiptFromServer = await client.get<Receipt[]>('/receipt');
        setReceipt(receiptFromServer);
      } catch (error) {
        console.error('Error fetching receipts:', error);
      }
    },
  
    fetchProducts: async () => {
      try {
        const productsFromServer = await client.get<Product[]>('/product');
        setProducts(productsFromServer);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    },
  
    fetchProductsInReceipt: async () => {
      try {
        const productsInReceiptFromServer = await client.get<ProductInReceipt[]>('/prodreceipt');
        setProductsInReceipt(productsInReceiptFromServer);
      } catch (error) {
        console.error('Error fetching products in receipt:', error);
      }
    }
  };

  useEffect(() => {
    fetchData.fetchReceipts();
    fetchData.fetchProducts();
    fetchData.fetchProductsInReceipt();
  }, []);

  return (
    <div className="app__container">
      <LeftColumn 
        receipt={receipt}
        products={products} 
        productsInReceipt={productsInReceipt}
        fetchData={fetchData}
      />
      <div className="rightColumnContainer">
        {productsInReceipt.length > 0 ? (
          <RightColumn 
          productsInReceipt={productsInReceipt} 
          receipt={receipt}
          products={products} 
          fetchData={fetchData}
        />
        ): (
            <div className={"EmptyModalContent"}>
              <div>
                <img src={emptyReceiptPhoto} className={"EmptyModalContentImage"}/>
                <h2 className={"EmptyModalContentText"}>Receipt is empty, let`s find somethig!</h2>
                <p className={"EmptyModalContentError"}>To add a product to receipt, just click on it!</p>
              </div>
            </div>
        )}
      </div>
    </div>
  );
};
