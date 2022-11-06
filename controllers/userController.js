const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
// require("dotenv").config()

const userModel = require("../models/userModel")



passport.use(
    new JWTstrategy(
        {
            secretOrKey: process.env.JWT_SECRET,
            jwtFromRequest: ExtractJWT.fromUrlQueryParameter('secret_token'),
        },
        async (token, done) => {
            try {
                return done(null, token.user);
            } catch (error) {
                done(error);
            }
        }
    )
);


passport.use(
    'signup',
    new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
         async (req, email, password, done) => {
            try {
                const first_name = req.body.first_name;
                const last_name = req.body.last_name;
                const user = await userModel.create({ email, password, first_name, last_name });

                return done(null, user);
            } catch (error) {
                done(error);
            }
        }
    )
);

passport.use(
    'signin',
    new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        async (email, password, done) => {
            try {
                const user = await userModel.findOne({ email });

                if (!user) {
                    return done(null, false, { message: 'User not found' });
                }

                const validate = await user.isValidPassword(password);

                if (!validate) {
                    return done(null, false, { message: 'Wrong Password' });
                }

                return done(null, user, { message: 'Logged in Successfully' });
            } catch (error) {
                return done(error);
            }
        }
    )
);





userController = {
    //Finds Blogs by Author, Title and Tags.
    find: async (req, res)=> {
    const authorSeen = await userModel.find({author: req.params.author})
    res.json(authorSeen)
    },
    find: async (req, res)=> {
    const titleSeen = await userModel.find({title: req.params.title})
    res.json(titleSeen)
    },
    find: async (req, res)=> {
    const tagsSeen = await userModel.find({tags: req.params.tags})
    res.json(tagsSeen)
    },
    all: async (req, res)=> {
        const allUser = await userModel.find()
        res.json(allUser)
    },
    create: async( req, res) => {
        const newUser = userModel.create(req.body)
        const userSaved = await newUser.save()
        res.json(userSaved)
    },
    getAllBlogs: async (req, res) => {
        const userFound1 = await userModel.find({author: req.params.author}).populate("blogs")
        res.json(userFound1) 
    
        const userFound2 = await userModel.find({title: req.params.title}).populate("blogs")
        res.json(userFound2) 
        const userFound3 = await userModel.find({tags: req.params.tags}).populate("blogs")
        res.json(userFound3)  
    }
}

module.exports = userController