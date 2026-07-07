const connecttomongo = require('./db');
const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3001; // ✅ use env PORT for Render

// ✅ Fixed CORS - allow Vercel
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://bank-froud.vercel.app',
    'https://bank-froud-detection.vercel.app',
    /\.vercel\.app$/ // ← allows ALL vercel URLs
  ],
  credentials: true
}));

app.use(express.json());
connecttomongo();

// ✅ All routes together
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/transactions', require('./routes/transactionRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

app.get('/', (req, res) => {
  res.send("FraudGuard API Running ✅");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});