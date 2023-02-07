app.get('/range-search', (req, res) => {
    const startDate = req.query.start;
    const endDate = req.query.end;
    sql.connect(config, err => {
      if (err) console.log(err);
      const request = new sql.Request();
      const query = `
        SELECT FirstName,LastName,Number, AgentId, Campaign, Description,StatusText,UTime,UTimeString,IvrDuration
        FROM [HN_Ondata].[dbo].[vwInboundCalls] v
        JOIN [HN_Admin].[dbo].[ListCallStatus]l on v.CallStatusGroup=l.StatusGroup and v.CallStatusDetail=l.StatusDetail and v.CallStatusNum=l.StatusCode
        JOIN [HN_Admin].[dbo].ListAgents a on a.Ident=v.AgentId
        JOIN [HN_Admin].[dbo].[Campaigns] c on c.DID=v.DID
        WHERE UTime >= '${startDate}' AND UTime <= '${endDate}'
      `;
      request.query(query, (err, result) => {
        if (err) console.log(err);
        res.send(result);
      });
    });
  });







import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

function DataTable({startDate, endDate}) {
  const [data, setData] = useState([]);
  const classes = useStyles();

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get(`http://localhost:3000/data?startDate=${startDate}&endDate=${endDate}`);
      setData(result.data.recordsets[0]);
    };
    fetchData();
  }, [startDate, endDate]);

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Department ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Group Name</TableCell>
            <TableCell>Modified Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map(row => (
            <TableRow key={row.DepartmentID}>
              <TableCell component="th" scope="row">
                {row.DepartmentID}
              </TableCell>
              <TableCell>{row.Name}</TableCell>
              <TableCell>{row.GroupName}</TableCell>
              <TableCell>{row.ModifiedDate}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default DataTable;
