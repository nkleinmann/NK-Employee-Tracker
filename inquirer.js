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
                'View All Employees By Manager',
                'Add Employee',
                'Add Department',
                'Add Role',
                'Update Employee Role'
            ]
        }
    ]).then(function (answers) {
        switch (answers.whatWouldYouLikeToDo) {
            case "View All Employees":
                connection.query('SELECT * from employee', function (err, data) {
                    if (err) throw err;
                    console.table(data);
                });
                break;
        }

    })
}

module.exports = { startPrompt }
