const { Router } = require('express');
const router = new Router();

const bcryptjs = require('bcryptjs');
const saltRounds = 10;

const User = require('../models/User.model')





router.get('/signup', (req, res) => res.render('auth/signup'));

router.post('/signup', (req, res, next) => {
    console.log('The form data: ', req.body);
    //res.send(req.body)
    const { username, password } = req.body;

    if (!username || !password) {
        res.render('auth/signup', { errorMessage: 'All fields are mandatory. Please provide your username and password.' });
        return; //this return makes it so that if there is no username or password it will stop executing the rest of the code.
    }

    bcryptjs
        .genSalt(saltRounds)
        .then(salt => bcryptjs.hash(password, salt))
        .then(hashedPassword => {
            console.log(`Password hash: ${hashedPassword}`);
            return User.create({
                username: username,
                password: hashedPassword
            })
        })
        .then(userCreated => {
            res.render("auth/registered", { username })////
            return userCreated
        })
        .catch(error => next(error));
    //res.render("auth/registered", { username })
    //res.redirect("auth/registered")
});

//////////////////////////////LOGIN\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
router.get('/login', (req, res) => {
    res.render('auth/login');
});

router.post('/login', (req, res, next) => {
    const { username, password } = req.body;
    //console.log('SESSION =====> ', req.session);
    console.log(username)
    if (username === '' || password === '') {
        res.render('auth/login', {
            errorMessage: 'Please enter both, username and password to login.'
        });
        return;
    }

    User.findOne({ username })
        .then(user => {
            if (!user) {
                console.log("Username not registered. ");
                res.render('auth/login', { errorMessage: 'USER not found and/or incorrect password.' });
                return;
            } else if (bcryptjs.compareSync(password, user.password)) {
                req.session.currentUser = user;
                res.render('users/user-profile', { user });
            } else {
                console.log("Incorrect password. ");
                res.render('auth/login', { errorMessage: 'User not found and/or incorrect PASSWORD.' });
            }
        })
        .catch(error => next(error));
});






module.exports = router;