const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const expressHandleBars = require('express-handlebars');

const app = express();

// app.engine('hbs', expressHandleBars.engine({
//     extname: 'hbs',
//     layoutsDir: 'views/layouts',
//     // defaultLayout: false
//     defaultLayout: 'main-layout',
//     extname: 'hbs'
//     // layoutsDir: path.join(__dirname, 'views', 'layouts')
// }));
// app.set('view engine', 'hbs');
// app.set('views', 'views');

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use('/admin', adminData.routes);
app.use(shopRoutes);

app.use((req, res, next) => {
    // res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
    res.status(404).render('404', { pageTitle: 'Page Not Found' });
})

app.listen(3000)