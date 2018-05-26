var express = require('express');
var router = express.Router();

const Product = require('../models/product');

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
});


module.exports = router;