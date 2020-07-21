const express = require('express');
const router = new express.Router();
const { Client } = require('pg');

(async () => {
    const connection = new Client({
        user: 'shouvikbhuiyan',
        host: 'localhost',
        database: 'testdb',
        password: '12345',
        port: 5432,
    });

    connection.connect();

    const queryStr = `
    CREATE TABLE users (
        email varchar,
        firstName varchar,
        lastName varchar,
        age int
    );
`;

    try {
        await connection.query(queryStr);
        console.log('Table Created Successfully');
    } catch (e) {
        console.log('Something Went Wrong');
        throw e;
    } finally {
        connection.end();
    }
})();

router.post('/api/insertUser', async (req, res) => {
    const connection = new Client({
        user: 'shouvikbhuiyan',
        host: 'localhost',
        database: 'testdb',
        password: '12345',
        port: 5432,
    });

    connection.connect();

    const queryStr = {
        text: `INSERT INTO users (email, firstName, lastName, age) VALUES($1, $2, $3, $4)`,
        values: [req.body.email, req.body.firstName, req.body.lastName, req.body.age]
    };

    try {
        await connection.query(queryStr);
        res.status(200).send({
            isSuccess: true
        });
    } catch (e) {
        res.status(500).send({
            isSuccess: false
        });
        throw e;
    } finally {
        connection.end();
    }
});

router.get('/api/getAllUsers/:getByAge', async (req, res) => {
    const getByAge = req.params.getByAge;

    const connection = new Client({
        user: 'shouvikbhuiyan',
        host: 'localhost',
        database: 'testdb',
        password: '12345',
        port: 5432,
    });

    connection.connect();

    const queryStr = getByAge === 'false' ? `SELECT * FROM users;` : `SELECT * FROM users WHERE age > 20`;

    try {
        const response = await connection.query(queryStr);
        res.status(200).send({
            result: response.rows
        });
    } catch (e) {
        res.status(500).send({
            isSuccess: false
        });
        throw e;
    } finally {
        connection.end();
    }
});

router.put('/api/updateUser/', async (req, res) => {

    const connection = new Client({
        user: 'shouvikbhuiyan',
        host: 'localhost',
        database: 'testdb',
        password: '12345',
        port: 5432,
    });

    connection.connect();

    const queryStr = {
        text: `UPDATE users
        SET firstName = $2
        WHERE email = $1;`,
        values: [req.body.email, req.body.firstName]

    }

    try {
        await connection.query(queryStr);
        res.status(200).send({
            isSuccess: true
        });
    } catch (e) {
        res.status(500).send({
            isSuccess: false
        });
        throw e;
    } finally {
        connection.end();
    }
});

router.delete('/api/removeUser/', async (req, res) => {

    const connection = new Client({
        user: 'shouvikbhuiyan',
        host: 'localhost',
        database: 'testdb',
        password: '12345',
        port: 5432,
    });

    connection.connect();

    const queryStr = {
        text: `DELETE FROM users WHERE email = $1;`,
        values: [req.body.email]

    }

    try {
        await connection.query(queryStr);
        res.status(200).send({
            isSuccess: true
        });
    } catch (e) {
        res.status(500).send({
            isSuccess: false
        });
        throw e;
    } finally {
        connection.end();
    }
});

module.exports = router;