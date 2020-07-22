const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

router.get('/register', (req, res) => res.render('register'));

router.get('/login', (req, res) => res.render('login'));

// handle register

router.post('/register', (req, res) => {
    const { name, email, password, password2 } = req.body
    // Validation
    var errors = [];

    // required fields
    if (!name || !email || !password || !password2) {
        errors.push({ msg: 'Please fill in all fields' })
    }
    // password match
    if (password != password2) {
        errors.push({ msg: 'Passwords do not match' })
    }
    // password length
    if (password.length < 6) {
        errors.push({ msg: 'Password should be at least six characters' })
    }

    if (errors.length > 0) {
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        });
    } else {
        User.findOne({ email: email })
            .then(user => {
                if (user) {
                    errors.push({ msg: 'Email is already taken' })
                    res.render('register', {
                        errors,
                        name,
                        email,
                        password,
                        password2
                    });
                } else {
                    const newUser = new User({
                        name,
                        email,
                        password,
                        password2,
                        date: new Date()
                    });

                    bcrypt.genSalt(10, (err, salt) =>
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) throw err;
                            newUser.password = hash;
                        // jwt.sign({id: newUser._id}, 'secretkey', (err, token) => {
                        //     res.json({
                        //         token
                        //     });
                        // })
                            newUser.save()
                                .then(user => {
                                    req.flash('success_msg', 'Your are now registered, You can log in')
                                    res.redirect('/users/login')
                                })
                                .catch((err) => console.log(err))
                        }))
                }
            })
            .catch((err) => console.log(err))
    }
});
//login handle

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
})

//logout handle

router.get('/logout', (req, res,) => {
    req.logout();
    req.flash('success_msg', 'You are successfuly logged out');
    res.redirect('/users/login')
})

module.exports = router;