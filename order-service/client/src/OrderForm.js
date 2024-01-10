import React, { useState } from 'react';
import axios from 'axios';

const OrderForm = ({ userId }) => {
  const [category, setCategory] = useState('');
  const [products, setProducts] = useState('');

  const placeOrder = async () => {
    try {
      const response = await axios.post('http://localhost:3001/placeOrder', {
        userId,
        category,
        products,
      });
      console.log('Order placed successfully:', response.data.order);
    } catch (error) {
      console.error('Error placing order:', error);
    }
  };

  return (
    <div>
      <h2>Place an Order</h2>
      <label>
        Category:
        <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} />
      </label>
      <label>
        Products:
        <textarea value={products} onChange={(e) => setProducts(e.target.value)} />
      </label>
      <button onClick={placeOrder}>Place Order</button>
    </div>
  );
};

export default OrderForm;
