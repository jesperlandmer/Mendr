"use strict";

let mongoose = require("mongoose");

module.exports = {
    start: function() {

        // Listen for Signal Events, close mongoose if process ends
        process.on("SIGINT", function() {
            mongoose.connection.close(function() {
                console.log("Received SIGINT, Mongoose connection closed");
                process.exit(0);
            });
        });

        // Plugging in own Promise Library
        mongoose.Promise = global.Promise;

        // Connect to the database.
        mongoose.connect("mongodb://localhost/usersDB", function(error) {
            if (error) {
                throw error;
            } else {
                console.log("Connected to mongoDB");
            }

        });
    }
};