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
  // array for new employee info
  let employeeInfo = [];

  // asks user for first and last name of new employee
  connection.query('SELECT * FROM employee', async function (err, data) {
    try {
      const newName = await inquirer.prompt([{
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

    // asks user for new employee's role
    connection.query('SELECT * FROM role', async function (err, rdata) {
      try {
        const newR = await inquirer.prompt([{
          type: "list",
          name: "newRole",
          message: "What is the role for the new employee?",
          choices: rdata.map(function (r) {
            return {
              name: r.title,
              value: r.id
            }
          })
        }]).then(function (answers) {
          employeeInfo.push(answers.newRole);
          console.log(employeeInfo);
        });
      } catch (err) {
        console.log(err);
      }

      // asks user for manager
      connection.query("SELECT * FROM employee WHERE manager_id IS NULL", async function (err, mresults) {
        try {
          const newM = await inquirer.prompt([{
            type: "list",
            name: "newm",
            message: "Who is the manager of the new employee?",
            choices: mresults.map(function (m) {
              return {
                name: `${m.first_name} ${m.last_name}`,
                value: m.manager_id
              }
            })
          }]).then(function (answers) {
            employeeInfo.push(answers.newm);
            console.log(employeeInfo);
            connection.query('INSERT INTO employee (??) VALUES (?, ?, ?, ?)', [["first_name", "last_name", "role_id", "manager_id"], employeeInfo[0], employeeInfo[1], employeeInfo[2], employeeInfo[3]], function (err, res) {
              if (err) throw err;
              console.log("Congrats. New employee has been added successfully.");
            });
          });
        } catch (err) {
          console.log(err);
        }
        //restarts prompt
        startPrompt(connection);
      });
    });
  });
}


function addDepartment() {
  inquirer.prompt({
    type: "input",
    name: "newDepartment",
    message: "What department would you like to add?"
  })
    .then(function (answers) {
      connection.query("INSERT INTO department (name) VALUES (?)", answers.newDepartment, function (err, res) {
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