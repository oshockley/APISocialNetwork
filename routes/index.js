const router = require('express').Router();
// API routes form /api/index.js are imported
const apiRoutes = require('./api');

router.use('/api', apiRoutes);

// Route for undefined endpoints
router.use((req, res) => res.send('Route was not found!'));

module.exports = router;