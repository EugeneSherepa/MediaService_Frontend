import { FC, useState } from 'react';
import { ProductInReceipt, Product, Receipt } from '../../types';
import { client } from '../../fetchClient';
import cn from 'classnames';
import './RightColumn.scss';
import Table from '@mui/material/Table';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

interface RightColumnProps {
  productsInReceipt: ProductInReceipt[];
  products: Product[];
  receipt: Receipt[];
  fetchData: () => void;
}

export const RightColumn: FC<RightColumnProps> = ({
  productsInReceipt,
  products,
  receipt,
  fetchData,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false); 
  const sortedProductsInReceipt = [...productsInReceipt].sort((a, b) => a.id - b.id)
  .filter(product => product.receipt_id === receipt[receipt.length - 1].id);

  const handleCloseReceipt = async () => {
    if (sortedProductsInReceipt.length) {
      const receiptId = receipt[receipt.length - 1].id;
      const newTotal = sortedProductsInReceipt.reduce(
        (acc: number, product: ProductInReceipt) => acc + parseFloat(product.price),
        0
      );
    await client.post('/prodreceiptall', { receipt_id: receiptId, total: newTotal })
    client.post('/receipt', {});
    fetchData();
    setIsModalVisible(true);
    }
  }

  const handleModalClose = () => {
    setIsModalVisible(false);
  }

  const handleProductQuantity = async (newQuantity: number, product_id: number) => {
    await client.patch('/prodreceipt', { newQuantity, product_id });
    fetchData();
  };

  const handleDeleteProduct = async (id: number) => {
    await client.delete(`/prodreceipt/${id}`, { id });
    fetchData();
  };

  const total = sortedProductsInReceipt.reduce((acc, productInReceipt) => {
    const matchedProduct = products.find(product => product.id === productInReceipt.product_id);
    const productPrice = matchedProduct ? parseFloat(matchedProduct.price) : 0;
    const productInReceiptWorth = productPrice * productInReceipt.quantity;
    return acc + productInReceiptWorth;
  }, 0);

  const renderProductRows = () => {
    return sortedProductsInReceipt.map(productInReceipt => {
      const matchedProduct = products.find(product => product.id === productInReceipt.product_id);
      const productName = matchedProduct ? matchedProduct.name : 'Unknown Product';
      const productPrice = matchedProduct ? parseFloat(matchedProduct.price) : 0;
      const productInReceiptWorth = productPrice * productInReceipt.quantity;

      return (
        <TableRow key={productInReceipt.product_id} className='right-column-row'>
          <TableCell align="left">
            {sortedProductsInReceipt.indexOf(productInReceipt) + 1}
          </TableCell>
          <TableCell align="left" title={productName} colSpan={3}>{productName}</TableCell>
          <TableCell align="right" />
          <TableCell align="center" colSpan={2}>
            <div className="quantity__container">
              <button
                className="receipt__button"
                onClick={() => handleProductQuantity(productInReceipt.quantity - 1, productInReceipt.product_id)}
              >
                -
              </button>
              <p className="quantity__counter">{productInReceipt.quantity}</p>
              <button
                className="receipt__button"
                onClick={() => handleProductQuantity(productInReceipt.quantity + 1, productInReceipt.product_id)}
              >
                +
              </button>
            </div>
          </TableCell>
          <TableCell align="center" />
          <TableCell align="center" colSpan={2}>
            <div className='flex__price'>
            {productInReceipt.quantity}
            &nbsp;
            &times;
            &nbsp;
            {matchedProduct?.price}

            <p className='total__price'>{productInReceiptWorth.toFixed(2)}</p>
            </div>
          </TableCell>
          <TableCell align="center">
            <button
              className="receipt__button"
              onClick={() => handleDeleteProduct(productInReceipt.id)}
            >
              ✖
            </button>
          </TableCell>
          
        </TableRow>
      );
    });
  };

  return (
    <>
      <div className="right-column__container">
      <Container maxWidth="lg" sx={{ margin: 0 }} disableGutters>
        <TableContainer component={Paper} className="right-column__table-container">
          <Table className="right-column__table">
            <TableBody>
              <TableRow className="right-column__header-row">
                <TableCell className="right-column__table-cell" align="left">
                  #
                </TableCell>
                <TableCell className="right-column__table-cell" align="left" colSpan={3}>
                  Найменування
                </TableCell>
                <TableCell className="right-column__table-cell" align="right" />
                <TableCell className="right-column__table-cell" align="center" colSpan={2}>
                  Кількість
                </TableCell>
                <TableCell className="right-column__table-cell" align="center" />
                <TableCell className="right-column__table-cell" align="center" colSpan={2}>
                  Вартість
                </TableCell>
                <TableCell className="right-column__table-cell" align="center" />
              </TableRow>
              {renderProductRows()}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
      <Container maxWidth="lg" sx={{ margin: 0 }} disableGutters>
        <TableContainer component={Paper}>
          <Table>
            <TableBody>
              <TableRow className="right-column__total-row">
                <TableCell className="right-column__total-cell" colSpan={2}>
                  <p className='total__price'>До сплати: {total.toFixed(2)}</p>
                </TableCell>
                <TableCell colSpan={2} className="right-column__total-cell" align="right">
                  <button
                    className="right-column__payment-button"
                    onClick={handleCloseReceipt}
                  >
                    Карткою
                  </button>
                </TableCell>
                <TableCell
                align="left">
                  <button
                    className="right-column__payment-button"
                    onClick={handleCloseReceipt}
                  >
                    Готівкою
                  </button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </div>

    {isModalVisible && (
      <>
        <div className="backdrop"></div>
        <div className="Modal">
          <div
            className={cn("ModalContent", {
              "ModalContentActive": isModalVisible,
            })}>
            <h2 className="ModalContentText">Дякуємо!</h2>
            <p className="ModalContentDay">Гарного дня!</p>
            <button onClick={handleModalClose} className="ModalContentButton">
              Продовжити
            </button>
          </div>
        </div>
      </>
    )}
    </>
  );
};
