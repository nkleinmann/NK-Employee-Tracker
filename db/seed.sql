INSERT INTO department (id, name)
VALUES
	(1,'Sales'),
	(2,'Engineering'),
	(3,'Finance'),
	(4,'Legal');

INSERT INTO role (id, title, salary, department_id)
VALUES
	(1,'Sales Lead', 100000, 1),
	(2,'Salesperson', 80000, 1),
	(3,'Lead Engineer', 150000, 2),
	(4,'Accountant', 125000, 3),
    (5,'Lawyer', 190000, 4);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES
	(1,'John', 'Doe', 1, null),
	(2, 'Sally', 'Smith', 2, null),
	(3, 'Alex', 'Bert', 2, 2),
	(4, 'Nicole', 'Klein', 3, null);