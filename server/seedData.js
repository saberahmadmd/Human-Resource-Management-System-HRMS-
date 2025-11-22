const sequelize = require('./db');
const Organisation = require('./models/organisation');
const User = require('./models/user');
const Employee = require('./models/employee');
const Team = require('./models/team');
const EmployeeTeam = require('./models/employeeTeam');
const bcrypt = require('bcrypt');

const seedData = async () => {
  try {
    await sequelize.sync({ force: false }); 

    const existingOrg = await Organisation.findOne({ where: { name: 'Demo Tutoring Center' } });
    if (existingOrg) {
      console.log('Demo data already exists');
      return;
    }

    console.log('Seeding demo data...');

    const organisation = await Organisation.create({
      name: 'Demo Tutoring Center'
    });

    const passwordHash = await bcrypt.hash('demo123', 10);
    const user = await User.create({
      name: 'Demo Admin',
      email: 'admin@demotutoring.com',
      passwordHash,
      organisationId: organisation.id
    });

    const employees = await Employee.bulkCreate([
      {
        firstName: 'Sarah',
        lastName: 'Chen',
        email: 'sarah.chen@demotutoring.com',
        phone: '+1-555-0101',
        organisationId: organisation.id
      },
      {
        firstName: 'Marcus',
        lastName: 'Johnson',
        email: 'marcus.j@demotutoring.com',
        phone: '+1-555-0102',
        organisationId: organisation.id
      },
      {
        firstName: 'Priya',
        lastName: 'Patel',
        email: 'priya.patel@demotutoring.com',
        phone: '+1-555-0103',
        organisationId: organisation.id
      },
      {
        firstName: 'David',
        lastName: 'Kim',
        email: 'david.kim@demotutoring.com',
        phone: '+1-555-0104',
        organisationId: organisation.id
      },
      {
        firstName: 'Emily',
        lastName: 'Rodriguez',
        email: 'emily.r@demotutoring.com',
        phone: '+1-555-0105',
        organisationId: organisation.id
      }
    ]);

    const teams = await Team.bulkCreate([
      {
        name: 'Mathematics Department',
        description: 'Tutors specializing in Math from elementary to calculus',
        organisationId: organisation.id
      },
      {
        name: 'Science Team',
        description: 'Biology, Chemistry, Physics and Environmental Science tutors',
        organisationId: organisation.id
      },
      {
        name: 'SAT Prep Specialists',
        description: 'Expert tutors for SAT/ACT test preparation',
        organisationId: organisation.id
      },
      {
        name: 'Elementary Education',
        description: 'Tutors for K-5 grade levels',
        organisationId: organisation.id
      }
    ]);

    await employees[0].addTeam(teams[0]);
    await employees[0].addTeam(teams[2]);
    await employees[1].addTeam(teams[1]);
    await employees[2].addTeam(teams[0]);
    await employees[2].addTeam(teams[3]);
    await employees[3].addTeam(teams[1]);
    await employees[4].addTeam(teams[3]);

    console.log('Demo data seeded successfully!');
    console.log('Demo Login: admin@demotutoring.com / demo123');

  } catch (error) {
    console.error('Error seeding data:', error);
  }
};

module.exports = seedData;