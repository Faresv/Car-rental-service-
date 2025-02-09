const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const session = require('express-session');
const path = require('path');

const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname));

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false
}));

// Database setup
const db = new sqlite3.Database('users.db', (err) => {
    if (err) {
        console.error('Error connecting to database:', err);
    } else {
        console.log('Connected to SQLite database');
        // Create users table
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL
        )`);
    }
});

// Check if user is authenticated
const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/login');
    }
};

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'register.html'));
});

// Register new user
app.post('/register', async (req, res) => {
    const { username, password, email } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        db.run('INSERT INTO users (username, password, email) VALUES (?, ?, ?)',
            [username, hashedPassword, email],
            (err) => {
                if (err) {
                    if (err.message.includes('UNIQUE constraint failed')) {
                        res.status(400).json({ error: 'Username or email already exists' });
                    } else {
                        res.status(500).json({ error: 'Error creating user' });
                    }
                } else {
                    res.json({ message: 'User registered successfully' });
                }
            }
        );
    } catch (error) {
        res.status(500).json({ error: 'Error creating user' });
    }
});

// Login user
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
        if (err) {
            res.status(500).json({ error: 'Error logging in' });
        } else if (!user) {
            res.status(401).json({ error: 'User not found' });
        } else {
            const match = await bcrypt.compare(password, user.password);
            if (match) {
                req.session.user = { id: user.id, username: user.username };
                res.json({ message: 'Logged in successfully' });
            } else {
                res.status(401).json({ error: 'Invalid password' });
            }
        }
    });
});

// Logout user
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

// Protected route example
app.get('/profile', isAuthenticated, (req, res) => {
    res.json({ user: req.session.user });
});

// Catch-all route for any unmatched routes
app.get('*', (req, res) => {
    res.redirect('/');
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
