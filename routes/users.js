const express = require('express');
const uDb = require('../models/userModel')
const bDb = require('../models/bookModel')
const router = express.Router();
const userDb = new uDb();
const bookDb = new bDb();
const mongoose = require('mongoose');
const objectId = mongoose.Types.ObjectId;

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('createUser');
});
router.get('/createuser',  async function(req, res, next) {
  try{
    await userDb.createUser({name: req.query['name'], ph: req.query['ph']});
    res.send('DONE');
  }catch(err){
    console.log(err.message);
    res.send('NOT DONE');
  }
});

router.all('/createbook',  async function(req, res, next) {
  const users = await userDb.getAllUsers();
  if(req.method == "POST"){
    try{
      const name = req.body.name;
      const userId = await userDb.getUserIdByName({name: name})
      console.log(userId)
      await bookDb.createBook({
        bookname: req.body.bookname,
        author: userId,
        page: req.body.page,
      });
      res.redirect(301,'/user/createbook');
    }catch(err){
      console.log(err.message);
      res.send('NOT DONE');
    }
  }else{
    res.render('createBook', {users: users})
  }
});
router.get('/get', async function (req, res){
  const user = await userDb.getUserIdByName({name: "Afaq Ahmad"});
  console.log(user);
  const books = await bookDb.getBooksByAuthor({author: user});
  res.send(books);
});


module.exports = router;
