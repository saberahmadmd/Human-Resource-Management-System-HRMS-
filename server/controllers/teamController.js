const Team = require('../models/team');
const Employee = require('../models/employee');
const Log = require('../models/log');

exports.listTeams = async (req, res) => {
  const teams = await Team.findAll({
    where: { organisationId: req.user.organisationId },
    include: [{ model: Employee, through: { attributes: [] } }]
  });
  res.json(teams);
};

exports.createTeam = async (req, res) => {
  const { name, description } = req.body;
  const team = await Team.create({
    name,
    description,
    organisationId: req.user.organisationId
  });

  await Log.create({
    organisationId: req.user.organisationId,
    userId: req.user.userId,
    action: 'team_created',
    meta: { teamId: team.id }
  });

  res.status(201).json(team);
};

exports.updateTeam = async (req, res) => {
  const { id } = req.params;
  const team = await Team.findOne({
    where: { id, organisationId: req.user.organisationId }
  });
  if (!team) return res.status(404).json({ message: 'Not found' });

  await team.update(req.body);

  await Log.create({
    organisationId: req.user.organisationId,
    userId: req.user.userId,
    action: 'team_updated',
    meta: { teamId: team.id }
  });

  res.json(team);
};

exports.deleteTeam = async (req, res) => {
  const { id } = req.params;
  const team = await Team.findOne({
    where: { id, organisationId: req.user.organisationId }
  });
  if (!team) return res.status(404).json({ message: 'Not found' });

  await team.destroy();

  await Log.create({
    organisationId: req.user.organisationId,
    userId: req.user.userId,
    action: 'team_deleted',
    meta: { teamId: id }
  });

  res.json({ message: 'Deleted' });
};

// Assign single employee to team
exports.assignEmployee = async (req, res) => {
  const { teamId } = req.params;
  const { employeeId } = req.body;

  const team = await Team.findOne({
    where: { id: teamId, organisationId: req.user.organisationId }
  });
  const employee = await Employee.findOne({
    where: { id: employeeId, organisationId: req.user.organisationId }
  });

  if (!team || !employee) return res.status(404).json({ message: 'Not found' });

  await team.addEmployee(employee);

  await Log.create({
    organisationId: req.user.organisationId,
    userId: req.user.userId,
    action: 'employee_assigned_to_team',
    meta: { employeeId, teamId }
  });

  res.json({ message: 'Assigned' });
};

// Unassign
exports.unassignEmployee = async (req, res) => {
  const { teamId } = req.params;
  const { employeeId } = req.body;

  const team = await Team.findOne({
    where: { id: teamId, organisationId: req.user.organisationId }
  });
  const employee = await Employee.findOne({
    where: { id: employeeId, organisationId: req.user.organisationId }
  });

  if (!team || !employee) return res.status(404).json({ message: 'Not found' });

  await team.removeEmployee(employee);

  await Log.create({
    organisationId: req.user.organisationId,
    userId: req.user.userId,
    action: 'employee_unassigned_from_team',
    meta: { employeeId, teamId }
  });

  res.json({ message: 'Unassigned' });
};
