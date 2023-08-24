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

  const handleAddProduct = () => {
    onSubmit(newProductName, parseFloat(newProductPrice));
    onClose();
  };

  return (
    <div className={cn("modal__overlay", {
      "blur": newProduct,
    })}>
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
          onChange={(event) => setNewProductPrice(event.target.value)}
          placeholder="Product Price"
        />
        <button onClick={handleAddProduct}>Add New Product</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};
