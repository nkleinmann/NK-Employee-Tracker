const inquirer = require('inquirer');

startPrompt = () => {
    inquirer.prompt([
        {
            type: 'list',
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
    ])
}

module.exports = {startPrompt}
