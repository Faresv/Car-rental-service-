# Car Rental Service

A web application for car rentals with user authentication and a beautiful UI.

## Features

- User Registration and Login
- Session Management
- Secure Password Hashing
- Responsive Design
- Car Listing and Booking System

## Technologies Used

- Node.js
- Express.js
- SQLite3
- Bootstrap 5
- bcryptjs for password hashing
- express-session for session management

## Setup

1. Clone the repository:
```bash
git clone [your-repository-url]
```

2. Install dependencies:
```bash
npm install
```

3. Create a .env file in the root directory with the following content:
```env
SESSION_SECRET=your-secret-key
```

4. Start the server:
```bash
node server.js
```

5. Visit `http://localhost:3000` in your browser

## Project Structure

- `server.js` - Main application file
- `public/` - Static files
- `login.html` - Login page
- `register.html` - Registration page
- `index.html` - Home page
- `script.js` - Client-side JavaScript

## Security Features

- Password hashing with bcrypt
- Session management
- SQL injection prevention
- XSS protection
- Environment variable protection

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a Pull Request
