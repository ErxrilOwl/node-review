const fs = require('fs');
const path = require('path');

const getProductsFromFile = (cb) => {
    const p = path.join(path.dirname(require.main.filename), 'data', 'products.json');

    fs.readFile(p, (err, fileContent) => {
        if (err) {
            cb([]);
        } else {
            cb(JSON.parse(fileContent))
        }
    });
}

class Product {
    constructor(id, title, imageUrl, description, price) {
        this.id = id;
        this.title = title.trim();
        this.imageUrl = imageUrl;
        this.description = description.trim();
        this.price = price;
    }

    save() {
        getProductsFromFile((products) => {
            const p = path.join(path.dirname(require.main.filename), 'data', 'products.json');

            if (this.id) {
                const existingProductIndex = products.findIndex(prod => prod.id === this.id);
                
                const updatedProducts = [...products];
                updatedProducts[existingProductIndex] = this;
                fs.writeFile(p, JSON.stringify(updatedProducts), err => {
                    console.log('error', err);
                });
            } else {
                this.id = Math.random().toString();
                products.push(this);
                fs.writeFile(p, JSON.stringify(products), err => {
                    console.log('error', err);
                });
            }
        });
    }

    static fetchAll(cb) {
        getProductsFromFile(cb);
    }

    static findById(id, cb) {
        getProductsFromFile(products => {
            const product = products.find(p => p.id === id);
            cb(product);
        })
    }
}

module.exports = Product