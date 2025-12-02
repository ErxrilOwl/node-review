const db = require('../util/database');

const Cart = require('../models/cart');

class Product {
    constructor(id, title, imageUrl, description, price) {
        this.id = id;
        this.title = title.trim();
        this.imageUrl = imageUrl;
        this.description = description.trim();
        this.price = price;
    }

    save() {
        return db.execute('INSERT INTO products(title, price, imageUrl, description) VALUES (?, ?, ?, ?)',
            [this.title, this.price, this.imageUrl, this.description]
        );
    }

    static deleteById(id) {

    }

    static fetchAll() {
        return db.execute('SELECT * FROM products');
    }

    static findById(id) {

    }
}

module.exports = Product