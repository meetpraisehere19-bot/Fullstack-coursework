const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const { randomUUID } = require('crypto');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Simple in-memory users (NOT to use in production)
const USERS = [
  { username: 'admin', password: '12345' },
  { username: 'user', password: '12345' }
];

// Create 10 lessons
let LESSONS = [
  { id: 1, title: 'Math Explorers', location: 'North', price: 12.5, spaces: 10, icon: 'fa-calculator' },
  { id: 2, title: 'Science Lab', location: 'East', price: 15.0, spaces: 8, icon: 'fa-flask' },
  { id: 3, title: 'Creative Writing', location: 'South', price: 10.0, spaces: 12, icon: 'fa-pen-fancy' },
  { id: 4, title: 'Chess Club', location: 'West', price: 9.5, spaces: 6, icon: 'fa-chess' },
  { id: 5, title: 'Robotics', location: 'North', price: 18.0, spaces: 5, icon: 'fa-robot' },
  { id: 6, title: 'Art & Design', location: 'East', price: 11.0, spaces: 9, icon: 'fa-paint-brush' },
  { id: 7, title: 'Drama Workshop', location: 'South', price: 13.0, spaces: 7, icon: 'fa-theater-masks' },
  { id: 8, title: 'Music Makers', location: 'West', price: 14.0, spaces: 10, icon: 'fa-music' },
  { id: 9, title: 'Coding for Kids', location: 'Central', price: 16.0, spaces: 4, icon: 'fa-laptop-code' },
  { id: 10, title: 'Language Club', location: 'Central', price: 8.0, spaces: 11, icon: 'fa-language' }
];

// Simple auth endpoint
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const user = USERS.find(u => u.username === username && u.password === password);
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  // return a fake token
  res.json({ token: 'token-' + username });
});

app.get('/api/lessons', (req, res) => {
  res.json(LESSONS);
});

// Endpoint to update spaces when item added/removed from cart
app.post('/api/adjust-spaces', (req, res) => {
  const { id, delta } = req.body; // delta: -1 for add, +1 for remove
  const lesson = LESSONS.find(l => l.id === id);
  if (!lesson) return res.status(404).json({ message: 'Lesson not found' });
  if (lesson.spaces + delta < 0) return res.status(400).json({ message: 'Not enough spaces' });
  lesson.spaces += delta;
  res.json({ lesson });
});

// Checkout endpoint (no real payment) — verify name & phone server-side too
app.post('/api/checkout', (req, res) => {
  const { name, phone, items } = req.body;
  const nameValid = /^[A-Za-z .'-]{2,}$/.test(name);
  const phoneValid = /^[0-9 +()\-]{7,20}$/.test(phone);
  if (!nameValid || !phoneValid) return res.status(400).json({ message: 'Invalid name or phone' });
  // In a real app you'd create an order. Here return success and echo order id.
  // Generate a random, hard-to-guess order id using Node's crypto API
  res.json({ success: true, orderId: 'ORD-' + randomUUID() });
});

// Serve static frontend
app.use(express.static(path.join(__dirname, 'public')));

// open on port 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));