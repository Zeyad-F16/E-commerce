const express = require('express');

const router = express.Router();

const {register , login} = require('../services/authService');

const {registerValidator , loginValidator } = require('../utils/validators/authValidator');

router.post('/register', registerValidator , register);

router.post('/login', loginValidator , login);

module.exports = router;

