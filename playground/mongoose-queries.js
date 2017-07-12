const { ObjectID } = require('mongodb')
const { mongoose } = require('./../server/db/mongoose')
const { Todo } = require('./../server/models/todo')
const { User } = require('./../server/models/user')

// const id = '69668ea6feb26e2becce505811'
const userId = '5965385ca88a0943fcd591fe'

// if (!ObjectID.isValid(id)) {
//   console.log('ID not valid.');
// }

// Todo.find({
//   _id: id
// }).then((todos) => {
//   console.log('Todos', todos);
// })

// Todo.findOne({
//   _id: id
// }).then((todo) => {
//   console.log('Todo', todo);
// })

// Todo.findById(id).then((todo) => {
//   if (!todo) {
//     return console.log('ID not found.');
//   }
//   console.log('Todo By Id', todo);
// }).catch((e) => console.log(e))

// User.findById
User.findById(userId).then((user) => {
  if (!user) {
    return console.log('User by ID not found.');
  }
  console.log('User By Id', user);
}).catch((e) => console.log(e))
// query works but no user found
// user found, print to the screen
// any errors that can occure