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
        .catch(error => next(error));
    res.render("auth/registered", { username })
});






module.exports = router;