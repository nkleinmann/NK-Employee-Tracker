const mysql = require("mysql");
const consoleTable = require("console.table");

const { startPrompt } = require("./inquirer.js")

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
  console.log("connected as id " + connection.threadId + "\n");
});

// prompts questions for user in terminal
startPrompt();