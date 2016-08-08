"use strict";

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
           let grade = grades[0];
           //console.log(grade.score)
          let graded = (grade.score/grade.total)
          grade.letter = gradeEvaluation(graded)
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
  return new Promise((resolve, reject) => {

    let totals = {};
    let totalLetters = {};

    let overalls = grades.map(grade => {
      return grade.total;
    })
    totals.overall = overalls.reduce((total, next) =>{
      return total + next;
    }, 0)

    let scores = grades.map(grade => {
      return grade.score;
    })
    totals.score = scores.reduce((total, next) =>{
      return total + next;
    }, 0)

    let letterScores = grades.map(grade =>{
      return grade.letter;
    }).sort();

    letterScores.forEach(letter =>{
      return totalLetters[letter] = totalLetters[letter] ? totalLetters[letter] + 1: 1;
    })

    totals.letter = totalLetters;
    resolve(totals);
  })
}

exports.update = function(id, newGrade){
  return new Promise((resolve, reject) => {
    delete newGrade.id;

    let sql = squel.update()
                   .table('grades')
                   .setFields(newGrade)
                   .where(`id = ?`, id)
                   .toString();

    db.query(sql, err =>{
      if(err){
        reject(err);
      } else {
        resolve();
      }
    });
  });
}


function gradeEvaluation(score){
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
