/**
 * GET /books
 * List all books.
 */
const Book = require('../models/Book.js');

exports.getBooks = (req, res) => {
    Book.find((err, results) => {
        console.log(results);
        res.render('books', { title: "Books", books: results });
    });
};
