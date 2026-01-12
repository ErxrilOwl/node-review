require('dotenv').config();

const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');

const errorController = require('./controllers/error');
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('MongoDB connected');
        const store = MongoStore.create({
            client: mongoose.connection.getClient(),
            collectionName: 'sessions'
        });

        app.use(session({
            secret: process.env.SESSION_SECRET,
            resave: false,
            saveUninitialized: false,
            store: store
        }));

        app.use(async (req, res, next) => {
            if (!req.session.user) return next();

            try {
                const user = await User.findById(req.session.user._id);
                if (user) {
                    req.user = user;
                    req.session.isLoggedIn = true;
                }
                next();
            } catch (err) {
                next(err);
            }
        });

        const adminRoutes = require('./routes/admin');
        const shopRoutes = require('./routes/shop');
        const authRoutes = require('./routes/auth');

        app.use('/admin', adminRoutes);
        app.use(shopRoutes);
        app.use(authRoutes);

        app.use(errorController.get404);

        User.findOne().then(user => {
            if (!user) {
                const newUser = new User({
                    name: 'Test',
                    email: 'test@example.com',
                    cart: { items: [] }
                });
                return newUser.save();
            }
            return user;
        }).then(() => {
            app.listen(3000, () => console.log('Server running on port 3000'));
        });

    })
    .catch(err => console.log(err));
