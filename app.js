let createError = require('http-errors');
let express = require('express');
let path = require('path');
let fs = require('fs')
let cookieParser = require('cookie-parser');
let bodyparser=require('body-parser');
let logger = require('morgan');
let indexRouter = require('./routes/index');
let gunDetail = require('./routes/gunDetail');

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/public')));

app.use('/', indexRouter);
app.use('/guns', gunDetail);

let gunBase = require('./db/product.json')

//==================ADD===================>

app.post("/addProduct", (req, res) => {
  const id = Date.now();
  gunBase.push({
    title: req.body.title,
    author: req.body.author,
    aboutGun: req.body.aboutGun,
    country: req.body.country,
    price: req.body.price,
    years: req.body.years,
    imageLink: req.body.imageLink,
    id: id
  });
  fs.writeFileSync(
    path.join(__dirname, "./db/product.json"),
    JSON.stringify(gunBase, null, 2)
  );
  res.redirect("/admin-page");
});

//==================DELETE===================>
app.delete("/", (req, res) => {
  console.log(req.body.id);
  let id = gunBase.findIndex(product => {
    return product.id == req.body.id;
  });
  let status = false;
  if (id > -1) {
    gunBase.splice(id, 1);
    fs.writeFileSync(
      path.join(__dirname, "./db/product.json"),
      JSON.stringify(gunBase, null, 2)
    );
    status = true;
  }
  res.json({ status });
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});
// error handler
app.use( (err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};


  // render the error page
  res.status(err.status || 500);
  res.render('404.ejs');
});

module.exports = app;
