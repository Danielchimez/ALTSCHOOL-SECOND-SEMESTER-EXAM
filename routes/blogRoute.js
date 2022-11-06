const express = require("express");
const passport = require('passport');
const jwt = require('jsonwebtoken');
const blogModelController = require("../controllers/blogController");


const blogRoute = express.Router()

blogRoute.get('/', blogModelController.getAllBlogs)
blogRoute.get('/:id', blogModelController.getBlogById)
blogRoute.post('/', passport.authenticate('jwt', { session: false }), passport.authenticate('jwt', { session: false }), blogModelController.createBlog)
blogRoute.patch('/:id', passport.authenticate('jwt', { session: false }), blogModelController.updateBlog)
blogRoute.delete('/:id', passport.authenticate('jwt', { session: false }), blogModelController.deleteBlog)

module.exports = blogRoute;