const dotenv = require('dotenv');
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const errorController = require('./controllers/error');

const User = require('./models/user');

dotenv.config();

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User.findById('6941668c9c77fdbc19304f56') // Todo: For update
        .then(user => {
            req.user = new User(user.name, user.email, user.cart, user._id);
            next();
        })
        .catch(err => {
            console.log(err);
        });
    next();
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose.connect(process.env.MONGODB_URI)
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
        })
        
        app.listen(3000);    
    })
    .catch(err => console.log(err));
