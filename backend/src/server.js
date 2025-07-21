const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const goalRoutes = require('./routes/goals');
const planRoutes = require('./routes/plans');
const interactionRoutes = require('./routes/interactions');
const performanceRoutes = require('./routes/performance');
const notificationRoutes = require('./routes/notifications');

const { errorHandler } = require('./middleware/errorHandler');
const { startCronJobs } = require('./services/cronService');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://seu-dominio.com'] 
    : ['http://localhost:3000', 'http://localhost:8081', 'exp://localhost:8081'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());

// Health check
app.get('/healthcheck', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV 
  });
});

// Rotas
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/goals', goalRoutes);
app.use('/plans', planRoutes);
app.use('/interactions', interactionRoutes);
app.use('/performance', performanceRoutes);
app.use('/notifications', notificationRoutes);

// Error handling
app.use(errorHandler);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/healthcheck`);
  
  // Iniciar cron jobs
  startCronJobs();
});

module.exports = app; 