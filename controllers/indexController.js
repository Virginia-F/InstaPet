const connection = require("../config/db");

class IndexController {
  allOwner = (req, res) => {
    let sql = `SELECT * FROM owner WHERE owner_is_deleted = 0`;
    connection.query(sql, (err, result) => {
      if (err) {
        throw err;
      } else {
        res.render("index", { result });
      }
    });
  };
}

module.exports = new IndexController();
