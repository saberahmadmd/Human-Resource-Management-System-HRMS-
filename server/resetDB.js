const sequelize = require('./db');
const fs = require('fs');
const path = require('path');

const resetDatabase = async () => {
  try {
    const dbPath = path.join(__dirname, 'hrms.sqlite');
    if (fs.existsSync(dbPath)) {
      fs.unlinkSync(dbPath);
      console.log('Database file deleted');
    }

    await sequelize.sync({ force: true });
    console.log('Database reset successfully');

    const seedData = require('./seedData');
    await seedData();
    console.log('Demo data re-seeded');

  } catch (error) {
    console.error('Error resetting database:', error);
  }
};

resetDatabase();