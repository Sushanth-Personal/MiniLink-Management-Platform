const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Routes = require('./routes/route');
const ConnectionRoute = require('./routes/connectionRoute');
const ConnectDB = require('./config/db');
const authRoutes = require('./auth/routes/authRoutes');
const authenticateToken = require('./auth/middlewares/authMiddleware');
const morgan = require('morgan');
const cors = require("cors");
const app = express();
const cookieParser = require("cookie-parser");

dotenv.config();
ConnectDB();

// Middlewares

const corsOptions = {
  origin: 'http://localhost:5173',  // Frontend URL
  credentials: true,  // Allow cookies and credentials to be sent with requests
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());
app.use('/api', authenticateToken);  
app.use('/auth', authRoutes);
app.use('/api', Routes);
app.use('/connection', ConnectionRoute);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Successfully Connected with PORT: ", PORT);
});
