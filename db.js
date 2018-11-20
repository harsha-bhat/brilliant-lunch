const mysql = require('mysql');

let dbClient = null;

module.exports = () => {
    if (!dbClient) {
        dbClient = mysql.createConnection({
            host: process.env.DB_HOST,
            database: process.env.DB_DATABASE,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD
        });
        dbClient.connect();
    }
    return dbClient;
}