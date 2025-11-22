const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sequelize = require('./db');
const seedData = require('./seedData');

dotenv.config();

require('./models/organisation');
require('./models/user');
require('./models/employee');
require('./models/team');
require('./models/employeeTeam');
require('./models/log');

const authRoutes = require('./routes/auth');
const employeeRoutes = require('./routes/employee');
const teamRoutes = require('./routes/teams');
const logRoutes = require('./routes/logs');

const app = express();

app.use(cors({
  origin: true,
  credentials: true,
}));

app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/logs', logRoutes);

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await sequelize.sync();
    app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
  } catch (err) {
    console.error('DB sync error', err);
  }
})();
