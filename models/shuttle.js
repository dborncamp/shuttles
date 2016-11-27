const mongoose = require('mongoose');

const shuttleSchema = new mongoose.Schema({
    rider: String,          // user that is riding
    start: Date,            // date and time of the shuttle in ISO format
    end: Date,              // date and time of the shuttle ending
    deptarture: String,     // departing location
    arival: String,         // arriving location
    title: String,          // Name for the shuttle
    color: String,          // based on destination, probably dont need...
    requestedDate: Date,    // when was it requested
    status: String          // has the driver confirmed?
    }
);

const Shuttle = mongoose.model('shuttle', shuttleSchema);

module.exports = Shuttle;

/**
 * Test entry
 *
 * db.shuttle.insert({rider: "Dave", shuttleDate: new Date("2016-11-13T16:15"), shuttleDept: "Rotunda", shuttleAriv: "Muller", color: "Blue", requestDate: new Date(), status: "pending" });
 *
 *
 */
