// const mysql = require("mysql");
const consoleTable = require("console.table");
const inquirer = require('inquirer');

const connection = require("./connection.js");

// function that starts switch cases with option for user
function startPrompt(connection) {
  inquirer.prompt([
    {
      type: 'rawlist',
      name: 'whatWouldYouLikeToDo',
      message: 'What would you like to do??',
      choices: [
        'View All Employees',
        'View All Departments',
        'View All Roles',
        'Add Employee',
        'Add Department',
        'Add Role',
        'Update Employee Role',
        'Exit'
      ]
    }
  ]).then(function (answers) {
    // console.log("answers",answers);
    switch (answers.whatWouldYouLikeToDo) {
      case "View All Employees":
        viewEmployees();
        break;
      case "View All Departments":
        viewDep();
        break;
      case "View All Roles":
        viewRole();
        break;
      case "Add Employee":
        addEmployee();
        break;
      case "Add Department":
        addDepartment();
        break;
      case "Add Role":
        addRole();
        break;
      case "Update Employee Role":
        updateEmployeeRole();
        break;
      case 'Exit':
        console.log("Thanks for using employee tracker. Have a nice day!");
        return connection.end();
    }

  });
}

function viewEmployees() {
  connection.query('SELECT employee.id, employee.first_name, employee.last_name, department.name AS department FROM employee LEFT JOIN department on employee.role_id = department.id;', function (err, data) {
    if (err) throw err;
    console.table(data);
    startPrompt(connection);
  });
}

function viewDep() {
  connection.query('SELECT * from department;', function (err, data) {
    if (err) throw err;
    console.table(data);
    startPrompt(connection);
  });
}

function viewRole() {
  connection.query('SELECT * from role;', function (err, data) {
    if (err) throw err;
    console.table(data);
    startPrompt(connection);
  });
}

function addEmployee() {

  connection.query('SELECT * from employee', async function (err, data) {
    try {
      let employeeInfo = [];
      const newName = await
        inquirer.prompt([{
          type: "input",
          name: "firstName",
          message: "What is the first name of the employee?"
        },
        {
          type: "input",
          name: "lastName",
          message: "What is the last name of the employee?"
        }]).then(function (answers) {
          employeeInfo.push(answers.firstName, answers.lastName);
          console.log(employeeInfo);
        });
    } catch (err) {
      console.log(err);
    }

  });
}

function addDepartment() {
  inquirer.prompt({
    type: "input",
    name: "newDepartment",
    message: "What department would you like to add?"
  })
  .then(function (answers) {
    connection.query("INSERT INTO department (name) VALUES (?)", answers.newDepartment, function(err, res) {
      if (err) throw err;
      console.log("Congrats. A new department has been successfully added.");
      startPrompt(connection);
    });
  });
}

function addRole() {
  connection.query('SELECT * from employee', function (err, data) {
    if (err) throw err;
    console.table(data);
    startPrompt(connection);
  });
}

function updateEmployeeRole() {
  connection.query('SELECT * from employee', function (err, data) {
    if (err) throw err;
    console.table(data);
    startPrompt(connection);
  });
}

// prompts questions for user in terminal
startPrompt(connection);