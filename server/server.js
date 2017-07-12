const express = require('express')
const bodyParser = require('body-parser')
const { mongoose } = require('./db/mongoose')
const { Todo } = require('./models/todo')
const { User } = require('./models/user')

const app = express()

app.use(bodyParser.json())

app.post('/todos', (req, res) => {
  const todo = new Todo({
    text: req.body.text
  })

  todo.save().then((todo) => {
    res.send(todo);
  }).catch((err) => {
    res.status(400).send(err);
  })
})

app.get('/todos', (req, res) => {
  const todos = Todo.find().then((todos) => {
    res.send({todos})
  }).catch((e) => {
    res.status(400).send(e)
  })


})


app.listen(3000, () => {
  console.log('Server is live on port 3000');
})

module.exports = { app }