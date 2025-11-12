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
    constructor(title) {
        this.title = title;
    }

    save() {
        getProductsFromFile((products) => {
            const p = path.join(path.dirname(require.main.filename), 'data', 'products.json');
            products.push(this);
            fs.writeFile(p, JSON.stringify(products), err => {
                console.log(err);
            });
        });
    }

    static fetchAll(cb) {
        getProductsFromFile(cb);
    }
}

module.exports = Product