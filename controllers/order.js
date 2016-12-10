const Shuttle = require('../models/shuttle.js');
const User = require('../models/User');
const moment = require('moment');

exports.order = (req, res) => {
  res.render('order', {
    title: 'Order'
  });
};
