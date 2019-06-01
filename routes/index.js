let express = require('express');
let router = express.Router();
let products = require("../db/product.json");

router.get("/", (req, res) => {
  res.render("index", { products });
});
router.get('/gallery', (req, res) => {
  res.render('gallery', { title: "express" });
});
router.get('/contact', (req, res) => {
  res.render('contact', { title: "express" });
});
router.get('/registration', (req, res) => {
  res.render('registration', { title: "express" });
});
router.get('/admin-page', (req, res) => {
  res.render('admin/admin-page', { products });
});

module.exports = router;

