const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
var cors = require('cors')
const userRoute = require('./routes/user');
const employeeRoute = require('./routes/employee');

app.use(cors());

app.use(express.static(path.join(__dirname, '../build')));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.use(userRoute);
app.use(employeeRoute);

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

app.listen(process.env.PORT || 3000);