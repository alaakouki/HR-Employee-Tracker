const inquirer = require ("inquirer");
const mysql = require ("mysql2");
require('dotenv').config();
// const cTable = require("console.table");
require("console.table");

const db = mysql.createConnection (
    {
        host: "localhost",
        PORT: 3001,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    },
    console.log (`hr_db database connected.`)
);


const mainPage = () => {

inquirer.prompt([
    {
        name:"mainPage",
        type:"list",
        message:"What would you like to do?",
        choices: [
            "View all departments.",
            "View all roles.",
            "View all employees.",
            "Add a department.",
            "Add a role.",
            "Add an employee.",
            "Update an employee role.",
            "Quit."
        ],
    }
  ])

  .then ((answers) => {
  switch (answers.mainPage) {
    case "View all departments.":
        viewDep()
    break;

    case "View all roles.":
        viewRoles()
    break;

    case "View all employees.":
        viewEmployees()
    break;

    case "Add a department.":
        addDep()
    break;

    case "Add a role.":
        addRole()
    break;
    
    case "Add an employee.":
        addEmployee()
    break;
    
    case "Update an employee role.":
        updateEmployee()
    break;
    
    case "Quit.":
    break;
}
});
};

const viewDep = () => {
    const sql = "SELECT * FROM department;";
    db.promise()
    .query({sql, rowsAsArray: true})
    .then (([rows]) => {
        console.table ("\n",rows,"\n");
        mainPage();
    });
};

const viewRoles = () => {
    const sql = "SELECT * FROM role;";
    db.promise()
    .query({sql, rowsAsArray: true})
    .then (([rows]) => {
        console.table ("\n",rows,"\n");
        mainPage();
    });
};

const viewEmployees = () => {
    const sql = "SELECT * FROM employee;";
    db.promise()
    .query({sql, rowsAsArray: true})
    .then (([rows]) => {
        console.table ("\n",rows,"\n");
        mainPage();
    });
};



const addDep = () => {

    inquirer.prompt([
        {
            name: "name",
            type: "input",
            message: "What is the name of the department?",
        }
    ])
    .then ((res) => {
        const sql = `INSERT INTO department (name) VALUES ("${res.name}")`;
        db.promise().query(sql)
        .then (mainPage())
        .catch( (err) =>
        console.error(err));
    });
};


const addRole = () => {
    inquirer.prompt([
        {
            name: "title",
            type: "input",
            message: "What is the name of the role?",
        },
        {
            name: "salary",
            type: "input",
            message: "What is the salary of the role?",
        },
        {
            name: "department_id",
            type: "input",
            message: "Which department does the role belong to?",
        }
    ])
    .then ((res) => {
        const sql = `INSERT INTO role (title, salary, department_id) VALUES
        ("${res.title}","${res.salary}","${res.department_id}");`;
        db.promise().query(sql)
        .then(mainPage())
        .catch( (err) =>
        console.error(err));
    });
};

const addEmployee = () => {
    inquirer.prompt([
        {
            name: "firstName",
            type: "input",
            message: "What is the employee's first name?",
        },
        {
            name: "lastName",
            type: "input",
            message: "What is the employee's last name?",
        },
        {
            name: "roleId",
            type: "input",
            message: "What is the employee's role?",
        },
        {
            name: "managerId",
            type: "input",
            message: "Who is the employee's manager?",
        }
    ])
    .then ((res) => {
        const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
        ("${res.firstName}","${res.lastName}","${res.roleId}","${res.managerId}");`;
        db.promise().query(sql)
        .then(mainPage())
        .catch((err)=>
        console.error(err));
    });
};

const employeeUpdates = () => {
    inquirer.prompt([
        {
            name: "employeeId",
            type: "input",
            message: "what is the employee id number would you like to update?"
        },
        {
            name: "roleId",
            type: "input",
            message: "Which employee's role do you want to update?"
        }
    ])
    .then ((res) => {
        const sql = `UPDATE employees SET roleId = "${res.roleId}"
        WHERE id = "${res.employeeId}";`;

        db.promise().query(sql)
        .then(mainPage())
        .catch((err)=>
        console.error(err));
    });    
};

mainPage();
