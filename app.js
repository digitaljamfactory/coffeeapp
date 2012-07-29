var application_root = __dirname,
    express = require("express"),
    path = require("path"),
    mongoose = require("mongoose");


var app = express.createServer();


//Database

mongoose.connect('mongodb://localhost/coffee_app_database');

app.configure(function () {
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(application_root, "public")));
  app.use(express.errorHandler({dumpExceptions: true, showStack: true}));
});

var Schema = mongoose.Schema;  


// Schemas

var Sugars = new Schema({
   type: { type: String,  required: true },
   number: { type: Number, required: true, min: 0}
});

var Coffees = new Schema({  
    size: { type: String, required: true },
    strength: { type: String, required: true },  
    milk: { type: String, required: true },
    sugars: [Sugars],
    type: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1},
    note: { type: String }
});

var Order = new Schema({  
    customerName: { type: String, required: true },  
    cafe: { type: String, required: true },  
    pickUpTime: { type: String, required: true },
    status: { type: String, required: true },
    coffees: [Coffees],
    modified: { type: Date, default: Date.now }
});
   
var OrderModel = mongoose.model('Order',Order);

app.get('/api', function(req,res) {
  res.send('Coffee App API is running');
});

app.get('/api/orders', function (req, res){
  return OrderModel.find(function (err, orders) {
    console.log(err);
    if(!err) {
       console.log(orders);
       return res.send(orders);
    } else {
       return console.log(err);
    }
  });
});

app.post('/api/orders', function (req, res){
  var order;
  console.log("POST: ");
  console.log(req.body);
  order = new OrderModel({
    customerName: req.body.customerName,
    cafe: req.body.cafe,
    pickUpTime: req.body.pickUpTime,
    status: req.body.status,
    coffees: req.body.coffees    
  });
  order.save(function (err) {
    if (!err) {
      return console.log("created");
    } else {
      return console.log(err);
    }
  });
  return res.send(order);
});

app.get('/api/orders/:id', function (req, res){
  console.log(req.params.id);
  return OrderModel.findById(req.params.id, function (err, order) {
    if (!err) {     
      console.log(order);
      return res.send(order);
    } else {
      return console.log(err);
    }
  });
});


app.put('/api/orders/:id', function (req, res){
  return OrderModel.findById(req.params.id, function (err, order) {
    order.customerName = req.body.customerName,
    order.cafe = req.body.cafe,
    order.pickUpTime = req.body.pickUpTime,
    order.coffees = req.body.coffees,
    order.status = req.body.status
    return order.save(function (err) {
      if (!err) {
        console.log("updated");
      } else {
        console.log(err);
      }
      return res.send(order);
    });
  });
});

app.delete('/api/orders/:id', function (req, res){
  return OrderModel.findById(req.params.id, function (err, order) {
    return order.remove(function (err) {
      if (!err) {
        console.log("removed");
        return res.send('');
      } else {
        console.log(err);
      }
    });
  });
});

//Laucnh server

app.listen(4242);
