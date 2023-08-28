import { FC, useState } from 'react';
import { AddProductModal } from '../../Modal/AddProductModal';
import { client } from '../../../fetchClient';
import { Product, Receipt, ProductInReceipt } from '../../../types';
import './Table.scss';
import Table from '@mui/material/Table';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

interface Props {
  filteredProducts: Product[];
  receipt: Receipt[];
  productsInReceipt: ProductInReceipt[];
  fetchData: {
    fetchReceipts: () => void;
    fetchProducts: () => void;
    fetchProductsInReceipt: () => void;
  };
}

export const TableLeft: FC<Props> = ({ 
  filteredProducts, 
  receipt, 
  productsInReceipt, 
  fetchData,
}) => {
  const [newProduct, setNewProduct] = useState(false);

  const handleProductToReceipt = async (id: number, price: number) => {
    const receiptId = receipt[receipt.length - 1].id;
  
    const FilteredProductsInReceipt = productsInReceipt.filter(
      (product) => product.receipt_id === receiptId
    );
  
    const existingProductIndex = FilteredProductsInReceipt.findIndex(
      (product) => product.product_id === id
    );
  
    if (existingProductIndex !== -1) {
      const existingProduct = FilteredProductsInReceipt[existingProductIndex];
      let newQuantity;
      if (existingProduct.quantity !== null && existingProduct.quantity !== undefined) {
        newQuantity = existingProduct.quantity + 1;
      } else {
        newQuantity = 1;
      }
  
      await client.patch('/prodreceipt', { newQuantity, product_id: id });
      fetchData.fetchProductsInReceipt();
    } else {
      const newTotal = FilteredProductsInReceipt.reduce(
        (acc: number, product: ProductInReceipt) => acc + parseFloat(product.price),
        price
      );
  
      await client.post('/prodreceipt', { id, receipt_id: receiptId, price });
      await client.patch('/receipt', { receipt_id: receiptId, total: newTotal });
  
      fetchData.fetchProductsInReceipt();
      fetchData.fetchReceipts();
    }
  };

  const handleAddProduct = (name: string, price: number) => {
    client.post('/product', {name, price});
    setNewProduct(false);
    fetchData.fetchProducts();
  }

  return (
    <div className="table__container">
       <Container maxWidth="lg" disableGutters>
        <div className="table-content">
          <TableContainer component={Paper} className="table-container">
            <Table className="table">
              <TableBody>
                {filteredProducts.map((product) => {
                  const normalizedProductName = product.name.length > 20 
                    ? product.name.slice(0, 20) + '...' 
                    : product.name;
                  return (
                      <TableRow 
                        key={product.id}
                        onClick={() => handleProductToReceipt(product.id, parseFloat(product.price))}
                        className="table-row"
                        title={product.name}
                      >
                        <TableCell align='left'>{normalizedProductName}</TableCell>
                        <TableCell align='right'>{product.price}</TableCell>
                      </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
       </Container>
        <button
          onClick={() => setNewProduct(!newProduct)}
          className="table__container--button"
        >
          Створити продукт
        </button>

        {newProduct && (
        <AddProductModal
          newProduct={newProduct}
          onClose={() => setNewProduct(false)}
          onSubmit={(name, price) => handleAddProduct(name, price)}
        />
      )}  
    </div>
  );
}

