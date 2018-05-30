var express = require('express');
var router = express.Router();
const csrf = require('csurf');
const passport = require('passport');
const Product = require('../models/product');
const Cart = require('../models/cart');
const Order = require('../models/order');


var csrfProtection = csrf();

router.use(csrfProtection);

/* User routes */

router.get('/profile', isLoggedIn, (req, res, next) => {
    Order.find({
        user: req.user
    }, function (err, orders) {
        if (err) {
            return res.write('Error!');
        }
        var cart;
        orders.forEach(function (order) {
            cart = new Cart(order.cart);
            order.items = cart.generateArray();
        });
        res.render('user/profile', {
            orders: orders,
            title: 'My Profile'
        });
    });
});

router.get('/logout', (req, res, next) => {
    req.logOut();
    res.redirect('/');
});

//middleware
router.use('/', noLoggedIn, (req, res, next) => {
    next();
});

router.get('/signup', (req, res, next) => {
    let messages = req.flash('error');
    res.render('user/signup', {
        title: 'Sign Up',
        csrfToken: req.csrfToken(),
        messages: messages,
        hasErrors: messages.length > 0
    });
});

router.post('/signup', passport.authenticate('local.signup', {
    successRedirect: '/user/profile',
    failureRedirect: '/user/signup',
    failureFlash: true
}), (req, res, next) => {
    if (req.session.oldUrl) {
        var oldUrl = req.session.oldUrl;
        req.session.oldUrl = null;
        res.redirect(oldUrl);
    } else {
        res.redirect('/user/profile');
    }
});

router.get('/signin', (req, res, next) => {
    let messages = req.flash('error');
    res.render('user/signin', {
        title: 'Sign In',
        csrfToken: req.csrfToken(),
        messages: messages,
        hasErrors: messages.length > 0
    });
});

router.post('/signin', passport.authenticate('local.signin', {
    //successRedirect: '/user/profile',
    failureRedirect: '/user/signin',
    failureFlash: true
}), (req, res, next) => {
    if (req.session.oldUrl) {
        var oldUrl = req.session.oldUrl;
        req.session.oldUrl = null;
        res.redirect(oldUrl);
    } else {
        res.redirect('/user/profile');
    }
});


module.exports = router;

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}

function noLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}