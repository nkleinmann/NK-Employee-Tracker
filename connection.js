const mysql = require("mysql");

// accessing database
const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "AustraliA2!",
    database: "employeeDB"
  });
  
  connection.connect(function(err) {
    if (err) throw err;
    // console.log("connected as id " + connection.threadId + "\n");
  });

  module.exports = connection;