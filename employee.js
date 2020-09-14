// const mysql = require("mysql");
const consoleTable = require("console.table");
const inquirer = require('inquirer');

// other files
const connection = require("./connection.js");

// array for new employee info
let employeeInfo = [];
let updateEmpInfo = [];

// function that starts switch cases with option for user
startPrompt = (connection) => {
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

viewEmployees = () => {
  connection.query("SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;", function (err, data) {
    if (err) throw err;
    console.table(data);
    startPrompt(connection);
  });
}

viewDep = () => {
  connection.query('SELECT * from department;', function (err, data) {
    if (err) throw err;
    console.table(data);
    startPrompt(connection);
  });
}

viewRole = () => {
  connection.query('SELECT * from role;', function (err, data) {
    if (err) throw err;
    console.table(data);
    startPrompt(connection);
  });
}

addEmployee = () => {
  employeeQueries();
}

employeeQueries = () => {
  // asks user for first and last name of new employee
  connection.query('SELECT * FROM employee;', async function (err, data) {
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
    connection.query('SELECT * FROM role;', async function (err, rdata) {
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
      connection.query("SELECT * FROM employee WHERE manager_id IS NULL;", async function (err, mresults) {
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


addDepartment = () => {
  inquirer.prompt({
    type: "input",
    name: "newDepartment",
    message: "What department would you like to add?"
  })
    .then(function (answers) {
      departmentQueries();
    });
}

departmentQueries = () => {
  connection.query("INSERT INTO department (name) VALUES (?)", answers.newDepartment, function (err, res) {
    if (err) throw err;
    console.log("Congrats. A new department has been successfully added.");
    startPrompt(connection);
  });
}

addRole = () => {
  connection.query('SELECT * FROM role', function (err, res) {
    if (err) throw err;
    inquirer.prompt([{
      type: "input",
      name: "newRole",
      message: "What role/title would you like to add?"
    },
      {
        type: "input",
        name: "newSalary",
        message: "What is the salary of the new role/title?"
      },
      {
        type: "list",
        name: "connectDep",
        message: "What department is the new role/title in?",
        choices: res.map(function (role) {
          return {
            name: role.title,
            value: role.department_id
          }
        })
      }])
      .then(function (answers) {
        roleQueries(answers);
      });
  })

}

roleQueries = (answers) => {
  connection.query("INSERT INTO role (??) VALUES (?, ?, ?)", [["title", "salary", "department_id"], answers.newRole, answers.newSalary, answers.connectDep], function (err, res) {
    if (err) throw err;
    console.log("Congrats. A new role has been successfully added.");
    startPrompt(connection);
  });
}


updateEmployeeRole = () => {
  connection.query('SELECT id, role_id, CONCAT (first_name, " ", last_name) AS name FROM employee', async function (err, res) {
    try {
      const employeeUpdate = await inquirer.prompt([{
        type:"list",
        name: "empID",
        message: "Select the employee that you want to update the role for.",
        choices: res.map(function(employeeRole) {
          return {
            name: employeeRole.name,
            value: employeeRole.id
          }
        })
      }]).then(function(answers) {
        updateEmpInfo.push(answers.empID);
      });
    } catch (err) {
      console.log(err);
    }
  connection.query('SELECT * FROM role', async function (err, res) {
    try {
      const roleUpdate = await inquirer.prompt([{
        type:"list",
        name:"roleUpdate",
        message: "Select the employee's role",
        choices: res.map(function(newRole) {
          return {
            name: newRole.title,
            value: newRole.id
          }
        })
      }]) .then(function(answers) {
        updateEmpInfo.push(answers.roleUpdate);
        console.log(updateEmpInfo);
        updateQueries(answers);
      });
    } catch (err) {
      console.log(err);
    }
  })
    
    startPrompt(connection);
  });
}

updateQueries = (answers) => {
  connection.query('UPDATE employee SET role_id = ? WHERE id = ?', [updateEmpInfo[1], updateEmpInfo[0]], function (err, res) {
    if (err) throw err;
    console.log("Congrats. The employee's role has successfully been updated.");
    startPrompt(connection);
  })
}

// prompts questions for user in terminal
startPrompt(connection);