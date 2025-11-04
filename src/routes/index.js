// src/routes/index.js
'use strict';

const express = require('express');
const userRoutes = require('./users.routes');
const chanelRoutes = require('./channels.routes');
const authRoutes = require('./auth.routes')
const router = express.Router();
const passport = require('passport');

router.use('/identity', passport.authenticate('jwt', { session: false }),  userRoutes);
router.use('/channel', passport.authenticate('jwt', { session: false }),  chanelRoutes);
router.use('/auth', authRoutes);

module.exports = router; // 👈 Exporta el Router (no un app)
