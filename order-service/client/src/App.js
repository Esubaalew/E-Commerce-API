import React from 'react';
import OrderForm from './OrderForm';

function App() {
  // Assuming you have a user ID, replace 'yourUserId' with the actual user ID.
  const userId = '1';

  return (
    <div className="App">
      <h1>E-Commerce App</h1>
      <OrderForm userId={userId} />
    </div>
  );
}

export default App;
