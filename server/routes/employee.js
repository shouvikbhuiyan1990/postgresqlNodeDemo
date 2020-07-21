const express = require('express');
const router = new express.Router();
const { Pool } = require('pg');


const connection = new Pool({
    user: 'shouvikbhuiyan',
    host: 'localhost',
    database: 'testdb',
    password: '12345',
    port: 5432,
});

connection.on('error', (err, success) => {
    console.log('Problem in connecting to db')
});

(async () => {

    const client = await connection.connect();

    const checkTableQueryStr = `
        SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE  table_name   = 'employees'
        );
    `;

    const response = await client.query(checkTableQueryStr);

    if (!response.rows[0].exists) { //this checks whether the table is already created
        const queryStr = `
    CREATE TABLE employees (
        email varchar,
        firstName varchar,
        lastName varchar,
        age int
    );
`;

        try {
            await client.query(queryStr);
            console.log('Table Created Successfully');
        } catch (e) {
            console.log('Something Went Wrong');
            throw e;
        }
    }
})();

router.post('/api/insertEmployee', async (req, res) => {

    const client = await connection.connect();

    const queryStr = {
        text: `INSERT INTO employees (email, firstName, lastName, age) VALUES($1, $2, $3, $4)`,
        values: [req.body.email, req.body.firstName, req.body.lastName, req.body.age]
    };

    try {
        await client.query(queryStr);
        res.status(200).send({
            isSuccess: true
        });
    } catch (e) {
        res.status(500).send({
            isSuccess: false
        });
        throw e;
    }
});

router.get('/api/getAllEmployees/:getByAge', async (req, res) => {
    const getByAge = req.params.getByAge;

    const client = await connection.connect();

    const queryStr = getByAge === 'false' ? `SELECT * FROM employees;` : `SELECT * FROM employees WHERE age > 20`;

    try {
        const response = await client.query(queryStr);
        res.status(200).send({
            result: response.rows
        });
    } catch (e) {
        res.status(500).send({
            isSuccess: false
        });
        throw e;
    }
});

router.put('/api/updateEmployee/', async (req, res) => {

    const client = await connection.connect();

    const queryStr = {
        text: `UPDATE employees
        SET firstName = $2
        WHERE email = $1;`,
        values: [req.body.email, req.body.firstName]

    }

    try {
        await client.query(queryStr);
        res.status(200).send({
            isSuccess: true
        });
    } catch (e) {
        res.status(500).send({
            isSuccess: false
        });
        throw e;
    }
});

router.delete('/api/removeEmployee/', async (req, res) => {

    const client = await connection.connect();

    const queryStr = {
        text: `DELETE FROM employees WHERE email = $1;`,
        values: [req.body.email]

    }

    try {
        await client.query(queryStr);
        res.status(200).send({
            isSuccess: true
        });
    } catch (e) {
        res.status(500).send({
            isSuccess: false
        });
        throw e;
    }
});

module.exports = router;