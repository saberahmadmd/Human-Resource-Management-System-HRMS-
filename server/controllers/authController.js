const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Organisation = require('../models/organisation');
const User = require('../models/user');
const Log = require('../models/log');

exports.register = async (req, res) => {
  try {
    const { orgName, adminName, email, password } = req.body;

    const organisation = await Organisation.create({ name: orgName });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name: adminName,
      email,
      passwordHash,
      organisationId: organisation.id
    });

    const token = jwt.sign(
      { userId: user.id, orgId: organisation.id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
    );

    await Log.create({
      organisationId: organisation.id,
      userId: user.id,
      action: 'organisation_created',
      meta: { organisationId: organisation.id, userId: user.id }
    });

    return res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ message: 'Registration failed' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email } = req.body;
    const { password } = req.body;

    const user = await User.findOne({ where: { email }, include: Organisation });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { userId: user.id, orgId: user.organisationId },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
    );

    await Log.create({
      organisationId: user.organisationId,
      userId: user.id,
      action: 'user_logged_in',
      meta: {}
    });

    return res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ message: 'Login failed' });
  }
};

exports.logout = async (req, res) => {
  try {
    await Log.create({
      organisationId: req.user.organisationId,
      userId: req.user.userId,
      action: 'user_logged_out',
      meta: {}
    });
    return res.json({ message: 'Logged out' });
  } catch (err) {
    return res.status(400).json({ message: 'Logout failed' });
  }
};
