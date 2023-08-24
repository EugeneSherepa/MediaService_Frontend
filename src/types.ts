export type Product = {
  id: number;
  name: string;
  price: string;
};

export type Receipt = {
  id: number;
  number: number;
  date: string;
  total: number;
};

export type ProductInReceipt = {
  id: number;
  receipt_id: number;
  product_id: number;
  quantity: number;
  price: string;
};