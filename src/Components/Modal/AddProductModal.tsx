import React, { useState } from 'react';
import cn from 'classnames';
import './AddProductModal.scss';

interface AddProductModalProps {
  onClose: () => void;
  onSubmit: (name: string, price: number) => void;
  newProduct: boolean;
}

export const AddProductModal: React.FC<AddProductModalProps> = ({ onClose, onSubmit, newProduct }) => {
  const [newProductName, setNewProductName] = useState('');
  const [newProductPrice, setNewProductPrice] = useState('');
  const [priceValid, setPriceValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const handleAddProduct = (event: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();

    if (isNaN(parseFloat(newProductPrice))) {
      setPriceValid(false);
      setErrorMessage('Please enter a valid price.');
    } else if (newProductName.length === 0) {
      setPriceValid(false);
      setErrorMessage('Please enter a valid name.');
    } else {
      setPriceValid(true);
      setErrorMessage('');
      onSubmit(newProductName.trim(), parseFloat(newProductPrice));
      onClose();
    }
  };

  return (
    <form 
      className={cn("modal__overlay", {
        "blur": newProduct,
      })}
      onSubmit={(event) => handleAddProduct(event)}
    >
      <div className="modal__content newProduct">
        <input
          type="text"
          value={newProductName}
          onChange={(event) => setNewProductName(event.target.value)}
          placeholder="Product Name"
        />
        <input
          type="text"
          value={newProductPrice}
          onChange={(event) => {
            setNewProductPrice(event.target.value);
            setPriceValid(true);
          }}
          placeholder="Product Price"
          className={priceValid ? '' : 'invalid'}
        />
        {!priceValid && <p className="error-message">{errorMessage}</p>}
        <button type="submit">Add New Product</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </form>
  );
};