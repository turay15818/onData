// database.js
import  sql from 'mssql';

const config = {
    user: 'sa',
    // password: '1111',
    // server: 'localhost',
    // database: 'AdventureWorks2019',
    password: 'V0calc0m',
    server: '10.120.255.130',
    database: 'HN_Ondata',
    options: {
        encrypt: false,
        enableArithAbort: true
    },
};

export const executeQuery = (query, callback) => {
    sql.connect(config, err => {
        if (err) callback(err);
        else {
            const request = new sql.Request();
            request.query(query, (err, result) => {
                if (err) callback(err);
                else callback(null, result);
            });
        }
    });
};


export default executeQuery