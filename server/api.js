const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

/**
 * Tokenization endpoint
 * Accepts card data and returns a secure token
 */
app.post('/api/tokenize', async (req, res) => {
  try {
    const { encryptedData, cardData } = req.body;
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Generate a token
    const token = `tok_${generateRandomString(32)}`;
    
    console.log('Token generated:', token);
    
    res.json({
      success: true,
      token,
      metadata: cardData?.metadata || {
        cardType: 'visa',
        last4: '4242'
      }
    });
  } catch (error) {
    console.error('Tokenization error:', error);
    res.status(500).json({
      success: false,
      error: 'Tokenization failed',
      message: error.message
    });
  }
});

/**
 * Payment processing endpoint
 * Accepts a token and processes payment
 */
app.post('/api/payments', async (req, res) => {
  try {
    const { token, amount, currency = 'USD' } = req.body;
    
    if (!token) {
      return res.status(400).json({
        success: false,
        error: 'Missing token',
        message: 'Payment token is required'
      });
    }
    
    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid amount',
        message: 'Amount must be greater than 0'
      });
    }
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate success/failure (90% success rate)
    const isSuccess = Math.random() > 0.1;
    
    if (isSuccess) {
      const transactionId = `txn_${generateRandomString(24)}`;
      
      console.log('Payment successful:', transactionId);
      
      res.json({
        success: true,
        transactionId,
        amount,
        currency,
        status: 'completed',
        message: 'Payment processed successfully',
        timestamp: new Date().toISOString()
      });
    } else {
      console.log('Payment failed: Insufficient funds');
      
      res.json({
        success: false,
        error: 'payment_failed',
        message: 'Payment declined - Insufficient funds',
        code: 'insufficient_funds'
      });
    }
  } catch (error) {
    console.error('Payment error:', error);
    res.status(500).json({
      success: false,
      error: 'Payment processing failed',
      message: error.message
    });
  }
});

/**
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

/**
 * Test endpoint to simulate different scenarios
 */
app.post('/api/payments/test', async (req, res) => {
  const { scenario = 'success' } = req.body;
  
  await new Promise(resolve => setTimeout(resolve, 800));
  
  switch (scenario) {
    case 'success':
      res.json({
        success: true,
        transactionId: `txn_test_${Date.now()}`,
        amount: 1000,
        currency: 'USD',
        status: 'completed',
        message: 'Test payment successful'
      });
      break;
      
    case 'insufficient_funds':
      res.json({
        success: false,
        error: 'payment_failed',
        message: 'Insufficient funds',
        code: 'insufficient_funds'
      });
      break;
      
    case 'card_declined':
      res.json({
        success: false,
        error: 'payment_failed',
        message: 'Card declined',
        code: 'card_declined'
      });
      break;
      
    case 'network_error':
      res.status(500).json({
        success: false,
        error: 'network_error',
        message: 'Network connection failed'
      });
      break;
      
    default:
      res.json({
        success: true,
        transactionId: `txn_test_${Date.now()}`,
        message: 'Test payment processed'
      });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: err.message
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Not found',
    message: `Route ${req.method} ${req.path} not found`
  });
});

// Helper function
function generateRandomString(length) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Start server
app.listen(PORT, () => {
  console.log('╔════════════════════════════════════════════════╗');
  console.log('║  Payment Component Mock API Server            ║');
  console.log('╠════════════════════════════════════════════════╣');
  console.log(`║  Status: Running                               ║`);
  console.log(`║  Port: ${PORT}                                    ║`);
  console.log(`║  URL: http://localhost:${PORT}                    ║`);
  console.log('╠════════════════════════════════════════════════╣');
  console.log('║  Endpoints:                                    ║');
  console.log(`║  POST /api/tokenize                            ║`);
  console.log(`║  POST /api/payments                            ║`);
  console.log(`║  POST /api/payments/test                       ║`);
  console.log(`║  GET  /api/health                              ║`);
  console.log('╚════════════════════════════════════════════════╝');
  console.log('');
  console.log('Ready to accept requests...\n');
});

module.exports = app;
