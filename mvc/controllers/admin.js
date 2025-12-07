const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
}

exports.postAddProduct = (req, res, next) => {
    const {
      title,
      imageUrl,
      price,
      description
    } = req.body;
    Product.create({
      title,
      imageUrl,
      price,
      description
    }).then(result => {
      console.log('Create Product');
    }).catch(err => {
      
    });
}

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;

  if (!editMode) {
    return res.redirect('/');
  }

  const prodId = req.params.productId;
  Product.findById(prodId, product => {
    if (!product) {
      return res.redirect('/');
    }
    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: editMode,
      product: product
    });
  })
}

exports.postEditProduct = (req, res, next) => {
  const { productId: prodId , title, price, imageUrl, description } = req.body;
  const product = new Product(prodId, title, imageUrl, description, price);
  product.save();
  res.redirect('/admin/products')
};

exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then(products => {
      res.render('admin/products', {
          prods: products,
          pageTitle: 'Admin Products',
          path: '/admin/products'
      });
    })
    .catch(err => {
      console.log(err);
    });
}

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.deleteById(prodId);
  res.redirect('/admin/products');
}