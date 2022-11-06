const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
require('dotenv').config();



const authRouter = express.Router();




module.exports = authRouter;