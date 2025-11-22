const Employee = require('../models/employee');
const Log = require('../models/log');

exports.listEmployees = async (req, res) => {
  const employees = await Employee.findAll({
    where: { organisationId: req.user.organisationId }
  });
  res.json(employees);
};

exports.getEmployee = async (req, res) => {
  const { id } = req.params;
  const employee = await Employee.findOne({
    where: { id, organisationId: req.user.organisationId }
  });
  if (!employee) return res.status(404).json({ message: 'Not found' });
  res.json(employee);
};

exports.createEmployee = async (req, res) => {
  const { firstName, lastName, email, phone } = req.body;
  const employee = await Employee.create({
    firstName,
    lastName,
    email,
    phone,
    organisationId: req.user.organisationId
  });

  await Log.create({
    organisationId: req.user.organisationId,
    userId: req.user.userId,
    action: 'employee_created',
    meta: { employeeId: employee.id }
  });

  res.status(201).json(employee);
};

exports.updateEmployee = async (req, res) => {
  const { id } = req.params;
  const employee = await Employee.findOne({
    where: { id, organisationId: req.user.organisationId }
  });
  if (!employee) return res.status(404).json({ message: 'Not found' });

  await employee.update(req.body);

  await Log.create({
    organisationId: req.user.organisationId,
    userId: req.user.userId,
    action: 'employee_updated',
    meta: { employeeId: employee.id }
  });

  res.json(employee);
};

exports.deleteEmployee = async (req, res) => {
  const { id } = req.params;
  const employee = await Employee.findOne({
    where: { id, organisationId: req.user.organisationId }
  });
  if (!employee) return res.status(404).json({ message: 'Not found' });

  await employee.destroy();

  await Log.create({
    organisationId: req.user.organisationId,
    userId: req.user.userId,
    action: 'employee_deleted',
    meta: { employeeId: id }
  });

  res.json({ message: 'Deleted' });
};
