// api.js
import express from 'express';
import database from "./Database.js"
import cors from "cors"
import bodyParser from"body-parser"
import sql from"mssql"
import session from 'express-session'
import sequelizeStore from 'connect-session-sequelize'
import db from './config/DB.js';
import dotenv from "dotenv"
import UserRoute from "./routes/UserRoutes.js"
const app = express();


const sessionStore = sequelizeStore(session.Store)
const store = new sessionStore({
    db: db
});
// (async () => {
//     await db.sync()
// })();



app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(cors({
  credentials: true,
  origin: ['http://localhost:4434', 'http://localhost:2023']
}));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Credentials', true);
  next();
});

app.use(express.static("public"));
app.use(express.json())
app.use(UserRoute)

// store.sync();



app.get('/data', (req, res) => {
  const startDate = req.query.startDate;
  const endDate = req.query.endDate;
  const query = `SELECT TOP (1000) [DepartmentID],
    [Name],[GroupName],[ModifiedDate] FROM 
    [AdventureWorks2019].[HumanResources].[Department]
    WHERE ModifiedDate >= '${startDate}' AND ModifiedDate <= '${endDate}'`;
  database.executeQuery(query, (err, result) => {
    if (err) res.status(500).send(err.message);
    else res.send(result);
  });
});

app.post('/dataq', (req, res) => {
  const startDate = req.body.startDate;
  const endDate = req.body.endDate;
  const query = `
  SELECT FirstName,LastName,Number, AgentId, Campaign, Description,StatusText,UTime,UTimeString,IvrDuration
        FROM [HN_Ondata].[dbo].[vwInboundCalls] v
        JOIN [HN_Admin].[dbo].[ListCallStatus]l on v.CallStatusGroup=l.StatusGroup and v.CallStatusDetail=l.StatusDetail and v.CallStatusNum=l.StatusCode
        JOIN [HN_Admin].[dbo].ListAgents a on a.Ident=v.AgentId
        JOIN [HN_Admin].[dbo].[Campaigns] c on c.DID=v.DID
       
  `;
  database.executeQuery(query, (err, result) => {
    if (err) res.status(500).send(err.message);
    else res.send(result);
  });
});

app.post('/dataa', (req, res) => {
  const startDate = req.body.startDate ;
  const endDate = req.body.endDate ;
  const query = `
  SELECT FirstName,LastName,Number, AgentId, Campaign, Description,StatusText,UTime,UTimeString,IvrDuration
        FROM [HN_Ondata].[dbo].[vwInboundCalls] v
        JOIN [HN_Admin].[dbo].[ListCallStatus]l on v.CallStatusGroup=l.StatusGroup and v.CallStatusDetail=l.StatusDetail and v.CallStatusNum=l.StatusCode
        JOIN [HN_Admin].[dbo].ListAgents a on a.Ident=v.AgentId
        JOIN [HN_Admin].[dbo].[Campaigns] c on c.DID=v.DID
        WHERE UTime >= '${startDate}${":00.000Z"}' AND UTime <= '${endDate}${":00.000Z"}'
  `;
  database.executeQuery(query, (err, result) => {
    if (err) res.status(500).send(err.message);
    else res.send(result);
  });
});


app.listen(3004, () => {
  console.log('API listening on port 3004');
});
