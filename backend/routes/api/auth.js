const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

// Guest session creation - both GET and POST
const createGuestSession = (req, res) => {
  const sessionId = uuidv4();
  const token = jwt.sign(
    { sessionId, type: 'guest' },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '24h' }
  );
  
  res.json({
    success: true,
    token,
    sessionId,
    type: 'guest'
  });
};

router.post('/guest', createGuestSession);
router.get('/guest', createGuestSession);

// Optional: User registration/login
router.post('/register', async (req, res) => {
  // User registration logic
  res.json({ message: 'Registration endpoint - to be implemented' });
});

router.post('/login', async (req, res) => {
  // User login logic
  res.json({ message: 'Login endpoint - to be implemented' });
});

module.exports = router;