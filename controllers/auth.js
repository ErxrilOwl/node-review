const bcrypt = require('bcryptjs');
const User = require('../models/user');
const nodemailer = require('nodemailer');

// Looking to send emails in production? Check out our Email API/SMTP product!
const transport = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: 2525,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD
  }
});

exports.getLogin = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    errorMessage: message
  });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMessage: message
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({
    email: email
  })
    .then(user => {
      if (!user) {
        req.flash('error', 'Invalid credentials.');
        return res.redirect('/login');
      }

      bcrypt.compare(password, user.password)
        .then((doMatch) => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save(() => {
              res.redirect('/');
            });
          }
          req.flash('error', 'Invalid credentials.');
          res.redirect('/login');
        })
        .catch(err => console.log(err));
    
    })
    .catch(err => console.log('Error Login: ', err));
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  User.findOne({
    email: email
  })
  .then(userDoc => {
    if (userDoc) {
      req.flash('error', 'Email already exists. Pick another one.');
      return res.redirect('/signup');
    }
    return bcrypt.hash(password, 12)
      .then(hashedPassword => {
        const user = new User({
          email: email,
          password: hashedPassword,
          cart: { items: [] }
        });
        user.save();
      })
      .then(result => {
        res.redirect('/login');
        return transport.sendMail({
          to: email,
          from: 'shop@test.com',
          subject: 'Signup succeeded',
          html: '<h1>You successfully signed up!</h1>'
        })
      })
      .catch(err => console.log(err))
  })
  .catch(err => console.log(err))
};


exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect('/');
  });
};

exports.getReset = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/reset', {
    path: '/reset',
    pageTitle: 'Reset Password',
    errorMessage: message
  });
}