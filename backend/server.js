const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { sequelize } = require('./models');
const { authenticateToken, requireSuperadmin } = require('./middlewares/authMiddleware'); // ✅ FIXED

const userRoutes = require('./routes/userRoutes');
const assetRoutes = require('./routes/assetRoutes');
const modelRoutes = require('./routes/modelRoutes');
const authRoutes = require('./routes/authRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({
  origin: 'http://localhost:3000', // ✅ only allow your frontend
  credentials: true                // ✅ allow cookies/auth headers
}));
app.use(express.json());

// Routes
app.use('/api/users', authenticateToken, requireSuperadmin, userRoutes);  // ✅ protect with both
app.use('/api/assets', authenticateToken, assetRoutes);                   // ✅ protected
app.use('/api/models', authenticateToken, modelRoutes);                   // ✅ protected

app.use('/api/auth', authRoutes);  // ✅ This is required

// Root route
app.get('/', (req, res) => {
  res.send('Asset Management API is running.');
});

// Sync database and start server
sequelize.sync({ alter: false }).then(() => {
  console.log('Database synced.');
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error('Unable to connect to the database:', err);
});
