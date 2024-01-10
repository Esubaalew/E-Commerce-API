const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the cors middleware

const app = express();
const port = 3001;

app.use(cors()); // Enable CORS for all routes

app.use(bodyParser.json());

const orders = [];

app.post('/placeOrder', (req, res) => {
  const { userId, category, products } = req.body;

  const order = {
    orderId: generateOrderId(),
    userId,
    category,
    products,
    timestamp: new Date(),
  };

  orders.push(order);

  res.json({ success: true, order });
});

app.get('/orderHistory/:userId', (req, res) => {
  const { userId } = req.params;

  const userOrders = orders.filter((order) => order.userId === userId);

  res.json(userOrders);
});

function generateOrderId() {
  return `ORDER-${Math.floor(Math.random() * 100000)}`;
}

app.listen(port, () => {
  console.log(`Order Service is listening at http://localhost:${port}`);
});
