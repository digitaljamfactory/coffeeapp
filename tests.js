jQuery.post("/api/orders", {
  "customerName": "Anthony",
  "cafe": "3beanscastletowers",
  "pickUpTime": "10 mins",
  "status": "submitted"
}, function(data, textStatus, jqXHR) {
    console.log("Post resposne:"); console.dir(data); console.log(textStatus); console.dir(jqXHR);
});

jQuery.get("/api/orders/", function (data, textStatus, jqXHR) {
    console.log("Get resposne:");
    console.dir(data);
    console.log(textStatus);
    console.dir(jqXHR);
});


5013e0f81729c7fc41000001


jQuery.get("/api/orders/5013e7111df53cd644000001", function(data, textStatus, jqXHR) {
    console.log("Get resposne:");
    console.dir(data);
    console.log(textStatus);
    console.dir(jqXHR);
});

jQuery.get("/api/orders/");  

jQuery.post("/api/orders", {
  "customerName": "Anthony",
  "cafe": "3beanscastletowers",
  "pickUpTime": "10 mins",
  "status": "submitted",
  "coffees": [
     { "size": "small",
       "strength": "Decaf",
       "milk": "skim",
       "sugars": [
         {
            "type":"Brown",
            "number":"2"
         }
       ],
       "type": "flat white",
       "quantity": "1",
       "note": "not too hot please"
     },
     { "size": "large",
       "strength": "strong",
       "milk": "black",
       "sugars": [
         {
            "type":"None",
            "number": "0"
         }
       ],
       "type": "cappuccino",
       "quantity": "1",
       "note": ""
     }
   ]
}, function(data, textStatus, jqXHR) {
    console.log("Post resposne:"); console.dir(data); console.log(textStatus); console.dir(jqXHR);
});


jQuery.ajax({
    url: "/api/orders/5014efc1fc3fb1a24f000003", 
    type: "PUT",
    data: { 
         "status": "queued"
    },
    success: function(data, textStatus, jqXHR) { 
        console.log("PUT resposne:"); 
        console.dir(data); 
        console.log(textStatus); 
        console.dir(jqXHR); 
    }
});
