const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

const app = express();
const port = 3000;

app.use(bodyParser.json());

let users = [];

// Register a new user
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ username, password: hashedPassword });
    res.status(201).json({ message: 'User registered successfully' });
});

// Login user
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }
    res.json({ message: 'Login successful' });
});

// Get all users (for testing purposes, not recommended in production)
app.get('/users', (req, res) => {
    res.json(users.map(user => ({ username: user.username })));
});

app.listen(port, () => {
    console.log(`User Authentication API running on http://localhost:${port}`);
});
