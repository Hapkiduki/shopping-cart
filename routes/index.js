var express = require('express');
var router = express.Router();

const Product = require('../models/product');
const Cart = require('../models/cart');

/* GET home page. */
router.get('/', function (req, res, next) {

  let products = Product.find((err, products) => {
    let productsChunks = [];
    let chunkSize = 4;
    for (let i = 0; i < products.length; i += chunkSize) {
      productsChunks.push(products.slice(i, i + chunkSize));
    }
    res.render('shop/index', {
      title: 'Home',
      products: productsChunks
    });
  });

});

router.get('/add-to-cart/:id', (req, res, next) => {
  let productId = req.params.id;
  let cart = new Cart(req.session.cart ? req.session.cart : {});

  Product.findById(productId, (err, product) => {
    if (err) {
      return res.redirect('/');
    }
    cart.add(product, productId);
    req.session.cart = cart;
    console.log(req.session.cart); 
    res.redirect('/');
  });
});


module.exports = router;