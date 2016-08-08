const db = require('../config/db');
const squel = require('squel').useFlavour('mysql');
const uuid = require('uuid');

db.query(`create table if not exists grades(
  id varchar(50),
  student varchar(50),
  name varchar(50),
  total smallint,
  score smallinit
)`, err =>{
  if(err){
    console.log('table create err:', err)
  }
})
