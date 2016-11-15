const mongoose = require('mongoose');

const shuttleSchema = new mongoose.Schema({
    rider: String,          // user that is riding
    shuttleDate: Date,      // date of the shuttle in ISO format
    shuttleDept: String,    // departing location
    shuttleAriv: String,    // arriving location
    shuttleTitle: String,   // Name for the shuttle
    color: String,          // based on destination
    requestedDate: Date,    // when was it requested
    status: String          // has the driver confirmed?
    }
);

const Shuttle = mongoose.model('shuttle', shuttleSchema);

module.exports = Shuttle;


/**
 * Test entry
 *
 * db.shuttle.insert({number: 123, rider: "Dave", shuttleDate: new Date("2016-11-13T16:15"), shuttleSource: "Rotunda", shuttleDest: "Muller", color: "Blue", requestDate: new Date() });
 *
 *
const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  name: String
});

const Book = mongoose.model('Book', bookSchema);
module.exports = Book;

 */
