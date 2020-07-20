const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const app = express();
const ejs = require('express-ejs-layouts');
const passport = require('passport')

require('./config/passport')(passport);
//Database
const mongoose = require('mongoose');
const db = require('./config/keys').MongoURI;

mongoose.connect(db, {useNewUrlParser: true,  useUnifiedTopology: true })
    .then(()=> console.log('Database connected'))
    .catch((err)=> console.log(err));
//ejs
app.use(expressLayouts);
app.set('view engine', 'ejs');

//body-parser
app.use(express.urlencoded({extended: false}))

app.use(passport.initialize());
app.use(passport.session())
//Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on ${PORT}`));