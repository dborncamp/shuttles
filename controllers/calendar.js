/**
 * GET /calendar
 * test shuttle page.
 */

const Shuttle = require('../models/shuttle.js')

exports.calendar = (req, res) => {
  res.render('calendar', {
    title: 'Calendar'
  });
};

/**
 * GET /books
 * List all Shuttles.
 */
exports.getShuttles = (req, res) => {
  Shuttle.find((err, result) => {
      if (err) {alert("Something went wrong with the database in controler");}
      console.log(result);
      res.render('calendar',
          {shuttles: result,
           title: "Calendar"
          }
      );
  });
};
