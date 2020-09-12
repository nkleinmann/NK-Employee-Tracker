const inquirer = require('inquirer');

startPrompt = (connection) => {
    inquirer.prompt([
        {
            type: 'rawlist',
            name: 'whatWouldYouLikeToDo',
            message: 'What would you like to do??',
            choices: [
                'View All Employees',
                'View All Employees by Department',
                'View All Employees By Role',
                'Add Employee',
                'Add Department',
                'Add Role',
                'Update Employee Role'
            ]
        }
    ]).then(function (answers) {
        switch (answers.whatWouldYouLikeToDo) {
            case "View All Employees":
                connection.query('SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;', function (err, data) {
                    if (err) throw err;
                    console.table(data);
                });
                break;
            case "View All Employees by Department":
                connection.query('SELECT employee.id, employee.first_name, employee.last_name, department.name AS department FROM employee LEFT JOIN department on employee.role_id = department.id;', function (err, data) {
                    if (err) throw err;
                    console.table(data);
                });
                break;
            case "View All Employees by Role":
                connection.query('SELECT * from employee', function (err, data) {
                    if (err) throw err;
                    console.table(data);
                });
                break;
            case "Add Employee":
                connection.query('SELECT * from employee', function (err, data) {
                    if (err) throw err;
                    console.table(data);
                });
                break;
            case "Add Department":
                connection.query('SELECT * from employee', function (err, data) {
                    if (err) throw err;
                    console.table(data);
                });
                break;
            case "Add Role":
                connection.query('SELECT * from employee', function (err, data) {
                    if (err) throw err;
                    console.table(data);
                });
                break;
            case "Update Employee Role":
                connection.query('SELECT * from employee', function (err, data) {
                    if (err) throw err;
                    console.table(data);
                });
                break;
        }

    })
}

module.exports = { startPrompt }
