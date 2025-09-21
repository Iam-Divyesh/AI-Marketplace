const Product = require('../models/Product');
const path = require('path');

exports.getAllProducts = async (req, res) => {
  const products = await Product.find();
  res.json(products);
};

exports.getProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
};

exports.createProduct = async (req, res) => {
  const { name, description, price } = req.body;
  let modelUrl = '';
  if (req.file) {
    modelUrl = `/uploads/${req.file.filename}`;
  }
  const product = new Product({
    name,
    description,
    price,
    images: req.body.images || [],
    modelUrl,
  });
  await product.save();
  res.status(201).json(product);
};

exports.serveModel = (req, res) => {
  const file = req.params.filename;
  res.sendFile(path.join(__dirname, '../uploads', file));
};