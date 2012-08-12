var application_root = __dirname,
    express = require("express"),
    path = require("path"),
    mongoose = require("mongoose"),
    salt = 'mySaltyString',
    SHA2 = new (require('jshashes').SHA512),
    tokenGenerator = new require('crypto');

var app = express.createServer();

var auth = express.basicAuth(function (username, password) {
   return (username === process.env.auth_username && password === process.env.auth_password);
}, "Failure");

function encodePassword( password ){
    if( typeof password === 'string' && password.length < 6 ) return ''
    return SHA2.b64_hmac(password, salt )
}

function generateToken() {
  return tokenGenerator.randomBytes(24).toString('hex');
}


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

var Customer = new Schema({
   pickUpName: { type: String, required: true},
   emailAddress: { type: String, required: true, unique: true},
   password: { type: String, set: encodePassword, required: true},
   cafeName: { type: String, required: true},
   token: { type: String }
});

var Cafe = new Schema({
   name: { type: String, required: true, unique: true},
   emailAddress: { type: String, required: true, unique: true},
   password: { type: String, set: encodePassword, required: true},
   address: { type: String, required: true},
   token: {type: String}
});

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
    customerId: { type: String, required: true},
    pickUpName: { type: String, required: true },  
    token: {type: String, required: true},
    cafe: { type: String, required: true },  
    pickUpTime: { type: Date, required: true },
    status: { type: String, required: true },
    coffees: [Coffees],
    modified: { type: Date, default: Date.now }
});
   
var OrderModel = mongoose.model('Order',Order);
var CustomerModel = mongoose.model('Customer',Customer);
var CafeModel = mongoose.model('Cafe', Cafe);

app.post('/api/customers', function (req, res) {
  var customer;
  var cToken = generateToken();
  customer = new CustomerModel({
     pickUpName: req.body.pickUpName,
     emailAddress: req.body.emailAddress,
     password: req.body.password,
     cafeName: req.body.cafeName,
     token: cToken    
  });
  customer.save(function (err) {
    if (!err) {
      return res.send(cToken);
    } else {
      res.send(err);
      return console.log(err);
    }
  });
});

app.get('/api/customers', auth, function (req, res){
  return CustomerModel.find(function (err, customers) {
    console.log(err);
    if(!err) {
       return res.send(customers);
    } else {
       return console.log(err);
    }
  });
});

app.get('/api/customers/login', auth, function (req, res){
  var query = CustomerModel.findOne({});
 
  query.where('emailAddress',req.query["login"]);
  query.where('password', encodePassword(req.query["password"]));

  query.exec( function (err, customer) {
    if (!err) {     
      if(customer) { 
         return res.send(customer.token);
      } else {
         return res.send(403,"Invalid login or password");
      }
    } else {
      return console.log(err);
    }
  });
});

app.delete('/api/customers', auth, function (req, res) {
  CustomerModel.remove(function (err) {
    if (!err) {
      return res.send('');
    } else {
      console.log(err);
    }
  });
});

app.post('/api/cafes', function (req, res) {
  var cafe;
  var cToken = generateToken();
  cafe = new CafeModel({
     name: req.body.name,
     emailAddress: req.body.emailAddress,
     password: req.body.password,
     address: req.body.address,
     token: cToken    
  });
  cafe.save(function (err) {
    if (!err) {
      return res.send(cToken);
    } else {
      res.send(err);
      return console.log(err);
    }
  });
});

app.get('/api/cafes', auth, function (req, res){
  return CafeModel.find({}, 'name', function (err, cafes) {
    console.log(err);
    if(!err) {
       return res.send(cafes);
    } else {
       return console.log(err);
    }
  });
});

app.get('/api/cafes/login', auth, function (req, res){
  var query = CafeModel.findOne({});
 
  query.where('emailAddress',req.query["login"]);
  query.where('password', encodePassword(req.query["password"]));

  query.exec( function (err, cafe) {
    if (!err) {     
      if(cafe) { 
         return res.send(cafe.token);
      } else {
         return res.send(403,"Invalid login or password");
      }
    } else {
      return console.log(err);
    }
  });
});

app.delete('/api/cafes', auth, function (req, res) {
  CafeModel.remove(function (err) {
    if (!err) {
      return res.send('');
    } else {
      console.log(err);
    }
  });
});

app.get('/api', function(req,res) {
  res.send('Coffee App API is running');
});

app.get('/api/orders', auth, function (req, res){
  return OrderModel.find(function (err, orders) {
    console.log(err);
    if(!err) {
       return res.send(orders);
    } else {
       return console.log(err);
    }
  });
});



app.post('/api/orders', auth, function (req, res){
  var order;
  order = new OrderModel({
    customerId: req.body.customerId,
    pickUpName: req.body.pickUpName,
    cafe: req.body.cafe,
    pickUpTime: req.body.pickUpTime,
    status: req.body.status,
    coffees: req.body.coffees,
    token: req.body.token   
  });
  order.save(function (err) {
    if (!err) {
      return '';
    } else {
      return console.log(err);
    }
  });
  return res.send(order.id);
});

app.get('/api/orders/:id', auth, function (req, res){
  return OrderModel.findById(req.params.id, function (err, order) {
    if (!err) {     
      return res.send(order);
    } else {
      return console.log(err);
    }
  });
});

app.get('/api/orders/cafe/:name/:token', auth, function (req, res){
  var query = OrderModel.find({});
 
  query.where('cafe',req.params.name);
  query.where('status','submitted');

  query.exec( function (err, orders) {
    if (!err) {     
      return res.send(orders);
    } else {
      return console.log(err);
    }
  });
});



app.put('/api/orders/:id/:token', auth, function (req, res){
  return OrderModel.findById(req.params.id, function (err, order) {
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

app.delete('/api/orders/:id', auth, function (req, res){
  return OrderModel.findById(req.params.id, function (err, order) {
    return order.remove(function (err) {
      if (!err) {
        return res.send('');
      } else {
        console.log(err);
      }
    });
  });
});

app.delete('/api/orders', auth, function (req, res) {
  OrderModel.remove(function (err) {
    if (!err) {
      return res.send('');
    } else {
      console.log(err);
    }
  });
});

//Start server

app.listen(4242);
