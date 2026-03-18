require('dotenv').config();

const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const csrf = require('csurf');
const flash = require('connect-flash');
const multer = require('multer');

const errorController = require('./controllers/error');
const User = require('./models/user');

const app = express();

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        const datePrefix = new Date().toISOString().replace(/:/g, '-');
        cb(null, datePrefix + '-' + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype == 'image/png' || file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ storage: fileStorage, fileFilter }).single('image'));
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('MongoDB connected');
        const store = MongoStore.create({
            client: mongoose.connection.getClient(),
            collectionName: 'sessions'
        });

        const csrfProtection = csrf();
        
        app.use(session({
            secret: process.env.SESSION_SECRET,
            resave: false,
            saveUninitialized: false,
            store: store
        }));

        app.use(csrfProtection);
        app.use(flash());

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
                throw new Error(err);
            }
        });

        app.use((req, res, next) => {
            res.locals.isAuthenticated = req.session.isLoggedIn;
            res.locals.csrfToken = req.csrfToken();
            next();
        });

        const adminRoutes = require('./routes/admin');
        const shopRoutes = require('./routes/shop');
        const authRoutes = require('./routes/auth');

        app.use('/admin', adminRoutes);
        app.use(shopRoutes);
        app.use(authRoutes);

        app.use('/500', errorController.get500);
        app.use(errorController.get404);

        app.use((error, req, res, next) => {
            console.log(error);
            res.status(500).render('500', { pageTitle: 'Error', path: '/500', isAuthenticated: req.isLoggedIn });
        })
        
        app.listen(3000, () => console.log('Server running on port 3000'));
    })
    .catch(err => console.log(err));
