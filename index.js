/**
 * Created by tonyStark on 11/25/2016.
 */

var five = require("johnny-five");
var Firebase = require("firebase");
var uuid = require('node-uuid');
var board = new five.Board();
var config = {
    apiKey: "AIzaSyAToCcWz-OTkmAOPreVhjQJGtSvqVsZv2c",
    authDomain: "firebot-70932.firebaseapp.com",
    databaseURL: "https://firebot-70932.firebaseio.com",
    storageBucket: "firebot-70932.appspot.com",
    messagingSenderId: "710700352771"
};
Firebase.initializeApp(config);
var database = Firebase.database();
var writeToFirebase = Firebase.database().ref('/ledStatus/');
var readFromFirebase = Firebase.database().ref('/ledStatus/led_status');

board.on("ready", function() {
    console.log("Ready event. Repl instance auto-initialized!");

    var led = new five.Led(13);

    this.repl.inject({
        // Allow limited on/off control access to the
        // Led instance from the REPL.
        on: function() {
            led.on()
            writeToFirebase.set({'led_status' :'on','date':Date.now(),'id':uuid.v1()});
        },
        off: function() {
            led.off();
            writeToFirebase.set({'led_status' :'off','date':Date.now(),'id':uuid.v1()});
        }
    });
    readFromFirebase.on("value", function(snapshot) {
        if(snapshot.val() == "off"){
            console.log(snapshot.val());
            led.off();
        }
        else{
            led.on();
            console.log(snapshot.val());
        }
    }, function (error) {
        console.log("Error: " + error.code);

    });
});
