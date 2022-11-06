const express = require('express')
const passport = require('passport')
const jwt = require('jsonwebtoken')
require('dotenv').config()


const userRoute = express.Router()

userRoute.post(
    '/signup',
    passport.authenticate('signup', {session: false}), async (req, res, next) => {
        res.json({
            message: 'Signup Successfull',
            user: req.user
        });
    }
);

userRoute.post(
    '/signin',
    async (req, res, next) => {
        passport.authenticate('signin', async (err, user, info) => {
            try {
                if (err) {
                    return next(err);
                }
                if(!user) {
                    const error = new Error('username or Password is incorrect');
                    return next(error)
                }

                req.login(user, {session: false},
                    async (error) => {
                        if (error) return next(error);

                        const body = { _id: user._id, email: user.email};
                        const token = jwt.sign({ user: body}, process.env.JWT_SECRET, {expiresIn: "1h"});

                        return res.json({ token });
                    }
                );
            }catch (error) {
                return next(error)
            }
        }
        )(req, res, next)
    }
);





module.exports = userRoute;

