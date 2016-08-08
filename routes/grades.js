const express = require('express')
const router = express.Router();

let Grade = require('../models/grade')

router.get('/', (req, res) =>{
  Grade.getAll()
       .then(grades =>{
         res.send(grades);
       })
       .catch(err =>{
         res.status(400).send(err);
       })
})

router.get('/totals', (req, res) =>{
  Grade.getAll()
       .then(grades => {
         return Grade.getTotal(grades)
       })
       .then(totals =>{
         res.send(totals);
       })
       .catch(err =>{
         res.status(400).send(err);
       })
})

router.post('/', (req, res) =>{
  Grade.create(req.body)
       .then(()=>{
         res.send();
       })
       .catch(err =>{
         res.status(400).send(err);
       })
})

router.get('/:id', (req, res) =>{
  Grade.getOne(req.params.id)
       .then(grade =>{
         res.send(grade);
       })
       .catch(err =>{
         res.status(400).send(err);
       })
})

router.put('/:id', (req, res) =>{
  Grade.update(req.params.id, req.body)
       .then(()=>{
         res.send();
       })
       .catch(err =>{
         res.status(400).send(err);
       })
})

router.delete('/:id', (req, res) =>{
  Grade.delete(req.params.id)
       .then(()=>{
         res.send();
       })
       .catch(err =>{
         res.status(400).send(err);
       })
})



module.exports = router;
