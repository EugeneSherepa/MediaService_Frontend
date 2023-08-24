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
  fetchData: () => void;
}

export const TableLeft: FC<Props> = ({ 
  filteredProducts, 
  receipt, 
  productsInReceipt, 
  fetchData,
}) => {
  const [newProduct, setNewProduct] = useState(false);

  const handleProductToReceipt = (id: number, price: number) => {
      console.log('obeme')
      const receiptId = receipt[receipt.length - 1].id;
  
      const existingProductIndex = productsInReceipt.findIndex(product => product.product_id === id);
    
      if (existingProductIndex !== -1) {
        const existingProduct = productsInReceipt[existingProductIndex];
        let newQuantity;
        if (existingProduct.quantity !== null && existingProduct.quantity !== undefined) {
          console.log('quatity + 1')
          newQuantity = existingProduct.quantity + 1;
        } else {
          console.log('quantity 1')
          newQuantity = 1;
        }

        client.patch('/prodreceipt', { newQuantity, product_id: id });
        fetchData();
      } else {
        const newTotal = productsInReceipt.reduce(
          (acc: number, product: ProductInReceipt) => acc + parseFloat(product.price),
          price
        );

        console.log('newTotal', newTotal)

        client.post('/prodreceipt', { id, receipt_id: receiptId, price });

        client.patch('/receipt', { receipt_id: receiptId, total: newTotal });

        fetchData();
      }
  };

  const handleAddProduct = (name: string, price: number) => {
    client.post('/product', {name, price});
    setNewProduct(false);
    fetchData();
  }

  return (
    <div className="table__container">
       <Container maxWidth="lg" disableGutters>
        <div className="table-content">
          <TableContainer component={Paper} className="table-container">
            <Table className="table">
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow 
                    key={product.id}
                    onClick={() => handleProductToReceipt(product.id, parseFloat(product.price))}
                    className="table-row"
                  >
                    <TableCell align='left'>{product.name}</TableCell>
                    <TableCell align='right'>{product.price}</TableCell>
                  </TableRow>
                ))}
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

