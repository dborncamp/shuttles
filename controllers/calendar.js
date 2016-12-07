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
    var sdate = req.query.start;
    var edate = req.query.end;

    if (sdate == null){
        sdate = 0; // sometime in 1969
    }
    if (edate == null){
        edate = 9999999999999; // sometime in 2286
    }

    var momStart = moment(sdate);
    var momEnd = moment(edate);

    // construct the mongo query
    var query = {start: {$gt: momStart, $lt: momEnd}};
    
    // now find the shuttles
    Shuttle.find(query, (err, results) =>{
        if (err) {alert("Something went wrong with the database in controler");}
        res.send(results);
    });
}


exports.postShuttleRest = (req, res, next) =>{
    var date = req.body.date;
    var time = req.body.time;
    var dept = req.body.dept;
    var ariv = req.body.ariv;
    var rider = req.body.rider;

    // first some error checking, probably a better way to do this...
    var missing = '';
    if(!req.query.date){ missing = 'date'; }
    if(!req.query.time){ missing = 'time'; }
    if(!req.query.dept){ missing = 'dept'; }
    if(!req.query.ariv){ missing = 'ariv'; }
    if(!req.query.rider){ missing = 'rider'; }
    // if we have an error return an error
    if (missing != ''){
        //return res.send({'status': 'Error', 'Missing: ' + missing});
        req.flash("errors", {msg: "Missing: " + missing});
    }


    var startDate = moment(date + ' ' + time, 'MM/DD/YYYY hh:mm');
    // hack for timezone issues... need a better solution
    startDate.subtract(5, 'hours')
    var endDate = moment(startDate).add(15, 'minutes');

    var title = req.body.dept + " " + req.body.ariv;

    // get the color
    var color = '';
    if (req.body.dept == 'muller' & req.body.ariv == 'rotunda'){ color = 'blue'; }
    if (req.body.dept == 'rotunda' & req.body.ariv == 'muller'){ color = 'purple';}
    if (req.body.dept == 'muller' & req.body.ariv == 'stief'){ color = 'teal';}
    if (req.body.dept == 'stief' & req.body.ariv == 'muller'){ color = 'pink';}
    if (req.body.dept == 'stief' & req.body.ariv == 'rotunda'){ color = 'brown';}

    // something bad happened...
    if (color == ''){
        req.flash("errors", {msg: "Something went wrong pushing shuttle."});
    }

    const shuttle = new Shuttle({
        rider: rider,
        start: startDate.utc().format(),
        end: endDate.utc().format(),
        dept: dept,
        ariv: ariv,
        title: title,
        color: color,
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

    if (req.body.dept == req.body.ariv){
        req.flash("errors", {msg: "Departure and Arrival locations cannot be the same"});
    }


    console.log("Reading request:");
    console.log(req.body.date);
    console.log(req.body.time);
    var startDate = moment(req.body.date + ' ' + req.body.time, 'MM/DD/YYYY hh:mm');
    // hack for timezone issues
    startDate.subtract(5, 'hours')
    var endDate = moment(startDate).add(15, 'minutes');

    console.log(startDate.utc().format());
    console.log(endDate.utc().format());
    console.log(req.body.dept);
    console.log(req.body.ariv);
    console.log("");
    console.log(req.user);
    console.log("");

    var title = req.body.dept + " " + req.body.ariv;

    // get the color
    var color = '';
    if (req.body.dept == 'muller' & req.body.ariv == 'rotunda'){
        color = 'blue';
    }
    if (req.body.dept == 'rotunda' & req.body.ariv == 'muller'){
        color = 'purple';
    }
    if (req.body.dept == 'muller' & req.body.ariv == 'stief'){
        color = 'teal';
    }
    if (req.body.dept == 'stief' & req.body.ariv == 'muller'){
        color = 'pink';
    }
    if (req.body.dept == 'stief' & req.body.ariv == 'rotunda'){
        color = 'brown';
    }

    // something bad happened...
    if (color == ''){
        req.flash("errors", {msg: "Something went wrong coloring the shuttle."});
    }

    const shuttle = new Shuttle({
        rider: req.user._id,
        start: startDate.utc().format(),
        end: endDate.utc().format(),
        dept: req.body.dept,
        ariv: req.body.ariv,
        title: title,
        color: color,
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
