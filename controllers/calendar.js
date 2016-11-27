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
 * GET /Shuttles
 * List all Shuttles. will likely be useless for actual implementation...
 */
exports.ReadAll = (req, res) => {
    Shuttle.find((err, results) => {
        if (err) {alert("Something went wrong with the database in controler");}
        console.log("Looking for Shuttles");
        console.log(results);
        res.send(results);

    });
};

/**
 * Get the shuttles for a range of dates using a RESTful API
 *
 * Only looks for greater than startDate and less than endDate. If either of
 * there are undefined, its ok, that side of the bounding just wont be there.
 */
exports.ReadRange = (req, res) => {
    // make the mongodb query, get the strings and turn them into moment objects
    console.log("query:");
    console.log(req.query);
    console.log('');
    var sdate = req.query.start;
    var edate = req.query.end;

    if (sdate == null){
        sdate = 0; // sometime in 1969
    }
    if (edate == null){
        edate = 9999999999999; // sometime in 2286
    }

    console.log(sdate);
    var momStart = moment(sdate);
    var momEnd = moment(edate);

    console.log(momStart);
    // construct the mongo query
    var query = {start: {$gt: momStart, $lt: momEnd}};
    console.log(query);
    
    // now find the shuttles
    Shuttle.find(query, (err, results) =>{
        if (err) {alert("Something went wrong with the database in controler");}
        console.log(results);
        res.send(results);
    });
}


/**
 * Post /shuttle
 *
 * Submit for a shuttle.
 */
exports.postShuttle = (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
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
    var startDate = moment(req.body.date + ' ' + req.body.time, 'MM/DD/YYYY hh:mm');
    var endDate = moment(startDate).add(15, 'minutes');

    console.log(startDate.utc().format());
    console.log(endDate.utc().format());
    console.log(req.body.dept);
    console.log(req.body.ariv);
    console.log("");
    console.log(req.user);
    console.log("");

    var title = req.body.dept + " " + req.body.ariv;

    const shuttle = new Shuttle({
        rider: req.user._id,
        start: startDate.utc().format(),
        end: endDate.utc().format(),
        dept: req.body.dept,
        ariv: req.body.ariv,
        title: title,
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
