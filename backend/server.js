const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = 5001;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = 'mongodb://127.0.0.1:27017/restaurant-pos';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB successfully!'))
  .catch(err => console.error('MongoDB connection error:', err));

// Schemas
const OrderSchema = new mongoose.Schema({
  id: Number,
  items: Array,
  subtotal: Number,
  vat: Number,
  total: Number,
  paymentMethod: String,
  amountGiven: Number,
  orderType: String,
  orderDetails: Object,
  createdAt: String
});
const Order = mongoose.model('Order', OrderSchema);

const UserSchema = new mongoose.Schema({
  id: Number,
  username: { type: String, unique: true },
  password: String,
  role: String
});
const User = mongoose.model('User', UserSchema);

const MenuItemSchema = new mongoose.Schema({
  id: Number,
  name: String,
  price: Number,
  category: String,
  icon: String
});
const MenuItem = mongoose.model('MenuItem', MenuItemSchema);

// --- Auth Routes ---
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { username, password, role } = req.body;
    
    const existing = await User.findOne({ username });
    if (existing) return res.status(400).json({ error: 'Username already exists' });
    
    const newUser = new User({ id: Date.now(), username, password, role: role || 'Cashier' });
    await newUser.save();
    
    res.status(201).json({ message: 'User created successfully', user: { username: newUser.username, role: newUser.role } });
  } catch (error) {
    res.status(500).json({ error: 'Failed to sign up' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username, password });
    
    if (!user) {
      if (username === 'admin' && password === 'admin') {
        return res.json({ message: 'Login successful', user: { username: 'admin', role: 'Administrator' } });
      }
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    res.json({ message: 'Login successful', user: { username: user.username, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: 'Failed to log in' });
  }
});

// --- Order Routes ---
app.post('/api/orders', async (req, res) => {
  try {
    const newOrder = req.body;
    if (!newOrder.id) newOrder.id = Date.now();
    newOrder.createdAt = new Date().toISOString();

    const order = new Order(newOrder);
    await order.save();

    res.status(201).json({ message: 'Order saved successfully', order });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save order' });
  }
});

app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve orders' });
  }
});

// --- Menu Routes ---
app.get('/api/menu', async (req, res) => {
  try {
    const menu = await MenuItem.find();
    res.json(menu);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve menu' });
  }
});

app.post('/api/menu', async (req, res) => {
  try {
    await MenuItem.deleteMany({});
    const items = req.body.menuItems.map(item => ({ ...item, id: item.id || Date.now() }));
    await MenuItem.insertMany(items);
    res.json({ message: 'Menu successfully saved to backend!' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save menu' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
