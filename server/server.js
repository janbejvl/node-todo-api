const express = require('express')
const bodyParser = require('body-parser')
const { ObjectID } = require('mongodb')
const { mongoose } = require('./db/mongoose')
const { Todo } = require('./models/todo')
const { User } = require('./models/user')

const app = express()
const port = process.env.PORT || 3000

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

app.get('/todos/:id', (req, res) => {
  const id = req.params.id

  if (!ObjectID.isValid(id)) {
    return res.status(404).send()
  }

  Todo.findById(id).then((todo) => {
    if (!todo) {
      return res.status(404).send()
    }
    res.send({todo})
  }).catch((e) => res.status(400).send())
})

app.listen(3000, () => {
  console.log(`Server is live on port ${port}`)
})

module.exports = { app }
