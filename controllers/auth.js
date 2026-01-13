const User = require('../models/user');

exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: req.session.isLoggedIn
  });
};

exports.getSignup = (req, res, next) => {
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    isAuthenticated: false
  });
};

exports.postLogin = (req, res, next) => {
  User.findById('6964f7a6ec6fe6481416fbbb')
      .then(user => {
          req.session.isLoggedIn = true;
          req.session.user = user;
          req.session.save(() => {
            res.redirect('/');
          });
      })
      .catch(err => console.log('Error Login: ', err));
};

exports.postSignup = (req, res, next) => {};


exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect('/');
  });
};
