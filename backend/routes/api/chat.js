const express = require('express');
const router = express.Router();
const pythonBridge = require('../../services/pythonBridge');
const { body, validationResult } = require('express-validator');

// Chat endpoint - POST (main)
router.post('/', [
  body('message').isString().isLength({ min: 1, max: 500 }).trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { message } = req.body;
    const sessionId = req.headers['x-session-id'];
    
    const result = await pythonBridge.sendMessage(message, sessionId);
    
    res.json({
      success: true,
      response: result.response,
      csv_available: result.csv_available,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Chat endpoint - GET (for testing)
router.get('/', async (req, res) => {
  try {
    const message = req.query.message || 'Hello, this is a test message';
    const sessionId = req.headers['x-session-id'];
    
    const result = await pythonBridge.sendMessage(message, sessionId);
    
    res.json({
      success: true,
      response: result.response,
      csv_available: result.csv_available,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Download CSV endpoint
router.get('/download-csv', async (req, res) => {
  try {
    const csvStream = await pythonBridge.downloadCsv();
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=query_results.csv');
    
    csvStream.data.pipe(res);
    
  } catch (error) {
    res.status(404).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;