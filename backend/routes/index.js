const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const aspiranteRoutes = require('./aspirante.routes');
const adminRoutes = require('./admin.routes');

router.use('/auth', authRoutes);
router.use('/aspirantes', aspiranteRoutes);
router.use('/admin', adminRoutes);

module.exports = router;