const mongoose = require('mongoose');

const shuttleSchema = new mongoose.Schema({
    number: {type: Number, unique: true},
    rider: String,
    shuttleDate: Date,
    shuttleSource: String,
    shuttleDest: String,
    color: String,
    requestedDate: Date
    }, { timestamps: true }
);

const Shuttle = mongoose.model('shuttles', shuttleSchema);

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
