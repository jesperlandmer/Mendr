
"use strict";

let mongoose = require("mongoose");
var uniqueValidator = require("mongoose-unique-validator");
let bcrypt = require("bcryptjs");
var salt = bcrypt.genSaltSync();

// Defining the Schema
let userSchema = mongoose.Schema({
    user: { type: String, required: true, unique: true },
    pass: { type: String, required: true }
});

userSchema.pre("save", function(next) {
    // Get the current user
    var newUser = this;

    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.pass, salt, function(err, hash) {
            if (err) {
                return next(err);
            }

            // override the clear-text password with the hashed one
            newUser.pass = hash;
        });
    });

    next();
});

// Apply the uniqueValidator plugin to check if username exists
userSchema.plugin(uniqueValidator, { message: "Username already exists" });

// Check if password has required length
userSchema.path("pass").validate(function(password) {
    return password.length >= 6;
}, "The password must be longer than 6 characters");

userSchema.methods.comparePassword = function(candidatePassword, callback) {

    bcrypt.hash(candidatePassword, salt, function(err, hash) {
        // Compare password with user
        // Return true if password matches
        bcrypt.compare(candidatePassword, hash, function(err, match) {
            if (err) {
                return callback(err)
            }

            callback(null, match)
        })
    });
};

userSchema.methods.hashSync = function(candidatePassword, callback) {

    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(candidatePassword, salt, function(err, hash) {
            if (err) {
                return next(err);
            }

            callback(null, hash);
        });
    });
};

// Creating the Model - Just like an Object
let User = mongoose.model("User", userSchema);
module.exports = User;