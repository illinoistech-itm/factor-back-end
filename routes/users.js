// Import dependencies
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

const User = require("../models/userModel");

//Set up default mongoose connection
const mongoUrl = 'mongodb://database/mean-docker';

var connectWithRetry = function() {
  return mongoose.connect(mongoUrl, function(err) {
    if (err) {
      console.error('Failed to connect to mongo on startup - retrying in 5 sec', err);
      setTimeout(connectWithRetry, 5000);
    }
  });
};
connectWithRetry();

/* GET api listing. */
router.get('/', (req, res) => {
		res.send('api works');
});

/* GET all users. */
router.get('/users', (req, res) => {
	User.find({}, (err, users) => {
		if (err) res.status(500).send(error)

		res.status(200).json(users);
	});
});

/* GET one users. */
router.get('/users/:id', (req, res) => {
	User.findById(req.params.id, (err, user) => {
		if (err) res.status(500).send(error)

		res.status(200).json(user);
	});
});

/* Create a user. */
router.post('/users', (req, res) => {
	let user = new User({
		email: req.body.email,
		pass: req.body.pass
	});

	user.save(error => {
		if (error) res.status(500).send(error);

		res.status(201).json({
			message: 'User created successfully'
		});
	});
});

module.exports = router;