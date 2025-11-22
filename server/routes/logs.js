const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/authMiddleware');
const Log = require('../models/log');

router.use(authMiddleware);

router.get('/', async (req, res) => {
  const logs = await Log.findAll({
    where: { organisationId: req.user.organisationId },
    order: [['timestamp', 'DESC']],
    limit: 100
  });
  res.json(logs);
});

module.exports = router;
