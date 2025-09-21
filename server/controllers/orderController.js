const Order = require('../models/Order');

exports.createOrder = async (req, res) => {
  const { products, total } = req.body;
  const order = new Order({
    user: req.user.id,
    products,
    total,
  });
  await order.save();
  res.status(201).json(order);
};

exports.getOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user.id }).populate('products');
  res.json(orders);
};