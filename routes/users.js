const express = require('express');

const router = express.Router();

router.get('/users/register', (req, res) => res.send("Register"))

router.get('/users/login', (req, res) => res.send("Login"))

module.exports = router;