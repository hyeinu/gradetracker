require('dotenv').config();

const PORT = process.env.PORT || 8000;

const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const app = express();

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use('/grades', require('./routes/grades'))

app.listen(PORT, err=>{
  console.log(err || `Server is listening on ${PORT}`)
})
