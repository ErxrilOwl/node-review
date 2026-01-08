const dotenv = require('dotenv');
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');

const errorController = require('./controllers/error');

const User = require('./models/user');

dotenv.config();

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))

app.use((req, res, next) => {
    User.findById('695ba5442ee704667a07e0a2')
        .then(user => {
            req.user = user;
            console.log(req.user)
            next();
        })
        .catch(err => {
            console.log(err);
            next();
        });
    
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        User.findOne().then(user => {
            if (!user) {
                const user = new User({
                    name: 'Test',
                    email: 'test@example.com',
                    cart: {
                        items: []
                    }
                });
                user.save();
            }

            app.listen(3000); 
        });
    })
    .catch(err => console.log(err));
