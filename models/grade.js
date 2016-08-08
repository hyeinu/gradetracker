const db = require('../config/db');
const squel = require('squel').useFlavour('mysql');
const uuid = require('uuid');

db.query(`create table if not exists grades(
  id varchar(50),
  student varchar(50),
  name varchar(50),
  total smallint,
  score smallint
)`, err =>{
  if(err){
    console.log('table create err:', err)
  }
})

exports.getAll = function(){
  return new Promise((resolve, reject) => {
    let sql = squel.select().from('grades').toString()
    db.query(sql, (err, grades) =>{
      if(err){
        reject(err);
      } else {
        grades.forEach(grade =>{
          let graded = (grade.score/grade.total)
          grade.letter = gradeEvaluation(graded)
        })
        resolve(grades);
      }
    })
  })
}

exports.create = function(newGrade){
  return new Promise((resolve, reject) =>{
    let sql = squel.insert()
                   .into('grades')
                   .setFields(newGrade)
                   .set('id', uuid())
                   .toString();

    db.query(sql, err =>{
      if(err){
        reject(err);
      } else {
        resolve();
      }
    })
  })
 }

 exports.getOne = function(id){
   return new Promise((resolve, reject) => {
     let sql = squel.select()
                    .from('grades')
                    .where(`id = ?`, id)
                    .toString()

     db.query(sql, (err, grades) =>{
       if(err){
         reject(err);
       } else {
         grades.forEach(grade =>{
           let graded = (grade.score/grade.total)
           grade.letter = gradeEvaluation(graded)
         })
         resolve(grade);
       }
     })
   })
 }

exports.delete = function(id){
  return new Promise((resolve, reject) => {
    let sql = squel.delete()
                   .from('grades')
                   .where(`id = ?`, id)
                   .toString()

    db.query(sql, (err, grades) =>{
      if(err){
        reject(err);
      } else {
        grades.forEach(grade =>{
          let graded = (grade.score/grade.total)
          grade.score = gradeEvaluation(graded)
        })
        resolve(grade);
      }
    })
  })
}

exports.getTotal = function(grades){
  let totals = {};

  totals.overall = grades.reduce(grade =>{
    
  })
}



function gradedEvaluation(score){
  let percent = score*100;
  if(percent >= 90){
    return 'A';
  } else if (percent < 90 && percent >= 80){
    return 'B';
  } else if (percent < 80 && percent >=70){
    return 'C';
  } else if (percent < 70 && percent >= 60){
    return 'D';
  } else {
    return 'F';
  }
}
