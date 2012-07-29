jQuery.get("/api/orders/", function (data, textStatus, jqXHR) {
    console.log("Get response:");
    console.dir(data);
    console.log(textStatus);
    console.dir(jqXHR);
});


jQuery.get("/api/orders/5013e7111df53cd644000001", function(data, textStatus, jqXHR) {
    console.log("Get response:");
    console.dir(data);
    console.log(textStatus);
    console.dir(jqXHR);
});

jQuery.get("/api/orders/");  

jQuery.post("/api/orders", {
  "customerName": "Anthony",
  "cafe": "coffehutcastletowers",
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
    console.log("Post response:"); console.dir(data); console.log(textStatus); console.dir(jqXHR);
});


jQuery.ajax({
    url: "/api/orders/501518c26b90bdc359000003", 
    type: "PUT",
    data: { 
         "status": "queued"
    },
    success: function(data, textStatus, jqXHR) { 
        console.log("PUT response:"); 
        console.dir(data); 
        console.log(textStatus); 
        console.dir(jqXHR); 
    }
});


jQuery.ajax({
     url: "/api/orders", 
     type: "DELETE", 
     success: function(data, textStatus, jqXHR) { 
        console.dir(data); 
     }
});
