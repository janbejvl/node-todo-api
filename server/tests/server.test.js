const expect = require('expect')
const request = require('supertest')
const { ObjectID } = require('mongodb')

const { app } = require('./../server')
const { Todo } = require('./../models/todo')

const todos = [{
  _id: new ObjectID(),
  text: 'First test todo'
}, {
  _id: new ObjectID(),
  text: 'Second test todo',
  completed: true,
  completedAt: 333
}]

beforeEach((done) => {
  Todo.remove({}).then(() => {
    Todo.insertMany(todos)
  }).then(() => done())
})

describe('POST /todos', () => {
  it('Should create a new todo', (done) => {
    const text = 'Test todo text'

    request(app)
      .post('/todos')
      .send({ text })
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text)
      })
      .end((err, res) => {
        if (err) {
          return done(err)
        }

        Todo.find({text}).then((todos) => {
          expect(todos.length).toBe(1)
          expect(todos[0].text).toBe(text)
          done()
        }).catch((err) => done(err))
      })
  })

  it('Should not create todo with invalid body data', (done) => {
     request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          done(err)
        }

        Todo.find().then((todos) => {
          expect(todos.length).toBe(2)
          done()
        }).catch((err) => done(err))
      })
  })
})

describe('GET /todos', () => {
  it('Should get all todos', (done) => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(2)
      })
      .end(done)
  })
})

describe('GET /todos/:id', () => {
  it('Should return todo doc', (done) => {
    const id = todos[0]._id.toHexString()
    request(app)
      .get(`/todos/${id}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text)
      })
      .end(done)
  })

  it('Should return 404 if todo not found', (done) => {
    // make sure you get a 404 back
    const hexId = new ObjectID().toHexString()
    request(app)
      .get(`/todos/${hexId}`)
      .expect(404)
      .end(done)
  })

  it('Should return 404 for non-object ids', (done) => {
    // /todos/123
    request(app)
      .get(`/todos/1234`)
      .expect(404)
      .end(done)
  })
})

describe('DELETE /todos/:id', () => {
  it('Should remove a todo', (done) => {
    const hexId = todos[1]._id.toHexString()

    request(app)
      .delete(`/todos/${hexId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo._id).toBe(hexId)
      })
      .end((err, res) => {
        if (err) {
          return done(err)
        }

        Todo.findById({_id: hexId}).then((todo) => {
          expect(todo).toNotExist()
          done()
        }).catch((e) => done(err))
      })
  })

  it('Should return 404 if todo not found', (done) => {
     request(app)
      .delete(`/todos/${(new ObjectID()).toHexString()}`)
      .expect(404)
      .end(done)
  })

  it('Should return 404 if ObjectID is invalid', (done) => {
    request(app)
      .delete(`/todos/1234`)
      .expect(404)
      .end(done)
  })
})

describe('PATCH /todos/:id', () => {
  it('Should update the todo', (done) => {
    const hexId = todos[0]._id.toHexString()

    const data = {
      "completed": true,
      "text": "test update"
    }
    
    request(app)
      .patch(`/todos/${hexId}`)
      .send(data)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(data.text)
        expect(res.body.todo.completed).toBe(data.completed)
        expect(res.body.todo.completedAt).toBeA('number')
      })
      .end(done)
  })

  it('Should clear completedAt when todo is not completed', (done) => {
    const hexId = todos[1]._id.toHexString()
    
    request(app)
      .patch(`/todos/${hexId}`)
      .send({
        "completed": false,
        "text": "test update 2"
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.completedAt).toNotExist()
      })
      .end(done)
  })
})
