/**
 * GET /calendar
 *
 * Get all of the shuttles in the database.
 * May want a new function to get shuttles based on a date range.
 */

const Shuttle = require('../models/shuttle.js');
const User = require('../models/User');
const moment = require('moment');

exports.calendar = (req, res) => {
  res.render('calendar', {
    title: 'Calendar'
  });
};

/**
 * GET /books
 * List all Shuttles.
 */
exports.getAll = (req, res) => {
    Shuttle.find((err, results) => {
        if (err) {alert("Something went wrong with the database in controler");}
        console.log("Looking for Shuttles");
        console.log(results);
        res.render('calendar',
            {test: results,
             title: "Calendar"
            }
        );
    });
};

/**
 * Post /shuttle
 *
 * Submit for a shuttle.
 */
exports.postShuttle = (req, res) => {
    req.assert('time', "Shuttle time cannot be blank.").notEmpty();
    req.assert('date', "Shuttle date cannot be blank.").notEmpty();
    req.assert('dept', "Shuttle source cannot be blank.").notEmpty();
    req.assert('ariv', "Shuttle destination cannot be blank.").notEmpty();

    const errors = req.validationErrors();

    if (errors) {
        req.flash('errors', errors);
        return res.redirect('/calendar');
    }

    console.log("Reading request:");
    console.log(req.body.date);
    console.log(req.body.time);
    var utcDate = moment(req.body.date + ' ' + req.body.time, 'MM/DD/YYYY hh:mm');

    console.log(utcDate.utc().format());
    console.log(req.body.dept);
    console.log(req.body.ariv);
    console.log("");
    console.log(req.user);
    console.log("");

    var title = req.body.dept + " " + req.body.ariv;

    const shuttle = new Shuttle({
        rider: req.user._id,
        shuttleDate: utcDate.utc().format(),
        shuttleDept: req.body.dept,
        shuttleAriv: req.body.ariv,
        shuttleTitle: title,
        color: 'blue',
        requestedDate: moment.utc().format(),
        status: 'pending'
    });

    shuttle.save((err) =>{
        if (err){
            req.flash("errors", {msg: "Something went wrong pushing shuttle."});
        }
        req.flash("success", {msg: "successfully created shuttle"});
    });
    res.redirect("/calendar");
};
