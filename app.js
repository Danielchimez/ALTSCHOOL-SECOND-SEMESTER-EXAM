const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');


const blogRoute = require("./routes/blogRoute")
const userRoute = require("./routes/userRoute");
const userController = require("./controllers/userController")


require('./database').connectToMongoDB()
require('dotenv').config()



const PORT = process.env.PORT

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));


app.use('/', userRoute)
app.use('/signup',  passport.authenticate('jwt', { session: false }), userRoute)
app.use('/signin',  passport.authenticate('jwt', { session: false }), userRoute)

app.use('/blogs',blogRoute)


app.set('views', 'views');
app.set('view engine', 'ejs')
//renders Home Page
app.get('/',  (req, res) => {
    res.render('app');
});

// renders the login page
app.get('/signin', (req, res) => {
    res.render('signin');
});

// renders the signup page
app.get('/signup', (req, res) => {
    res.render('signup');
});

app.get("/users",userController.all );
app.get("/users/create", userController.create);
app.get("/users/:author", userController.find);
app.get("/users/:author/blogs",userController.getAllBlogs);

app.get('/blogs')

// Error Handler.
app.use(function (err, req, res, next) {
    console.log(err);
    res.status(err.status || 500);
    res.json({ error: err.message });
});

app.listen(PORT, () => {
    console.log(`Server is running on Port: ${PORT}`)
})