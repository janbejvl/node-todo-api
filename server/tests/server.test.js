const expect = require('expect')
const request = require('supertest')
const { ObjectID } = require('mongodb')

const { app } = require('./../server')
const { Todo } = require('./../models/todo')
const { User } = require('./../models/user')
const { todos, populateTodos, users, populateUsers } = require('./seed/seed')

beforeEach(populateUsers)
beforeEach(populateTodos)

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

describe('GET /users/me', () => {
  it('Should return user if authenticated', (done) => {
    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(users[0]._id.toHexString())
        expect(res.body.email).toBe(users[0].email)
      })
      .end(done)
  })

  it('Should return 401 if not authenticated', (done) => {
    request(app)
      .get('/users/me')
      .expect(401)
      .expect((res) => {
        expect(res.body).toEqual({})
      })
      .end(done)
  })
})

describe('POST /users', () => {
  it('Should create a user', (done) => {
    const email = 'example@example.com'
    const password = '123mnb!'

    request(app)
      .post('/users')
      .send({ email, password })
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toExist()
        expect(res.body._id).toExist()
        expect(res.body.email).toBe(email)
      })
      .end((err) => {
        if (err) {
          return done(err)
        }

        User.findOne({email}).then((user) => {
          expect(user).toExist()
          expect(user.password).toNotBe(password)
          done()
        }).catch((e) => done(e))
      })
  })

  it('Should return validation errors if request invalid', (done) => {
    const invalidEmail = 'asdf'
    const invalidPassword = '123'

    request(app)
      .post('/users')
      .send({ invalidEmail, invalidPassword })
      .expect(400)
      .expect((res) => {
        expect(res.body.errors).toExist()
      })
      .end(done)
  })

  it('Should not create user if email in use', (done) => {
    const emailTaken = users[0].email
    const password = 'somepassword'

    request(app)
      .post('/users')
      .send({ email: emailTaken, password })
      .expect(400)
      .end((err) => {
        if (err) {
          return done(err)
        }

        User.findOne({email: emailTaken}).then((user) => {
          expect(user).toExist()
          expect(user.email).toBe(emailTaken)
          done()
        })
      })
  })
})

describe('POST /users/login', () => {
  it('Should login user and return auth token', (done) => {
    request(app)
      .post('/users/login')
      .send({
        email: users[1].email,
        password: users[1].password})
      .expect(200)
      .expect((res) => {
        expect(res.header['x-auth']).toExist()
      })
      .end((err, res) => {
        if (err) {
          return done(err)
        }

        User.findById(users[1]._id).then((user) => {
          expect(user.tokens[0]).toInclude({
            access: 'auth',
            token: res.headers['x-auth']
          })
          done()
        }).catch((e) => done(e))
      })
  })

  it('Should reject invalid login', (done) => {
     request(app)
      .post('/users/login')
      .send({
        email: users[1].email,
        password: users[1].password + '1'})
      .expect(400)
      .expect((res) => {
        expect(res.header['x-auth']).toNotExist()
      })
      .end((err, res) => {
        if (err) {
          return done(err)
        }

        User.findById(users[1]._id).then((user) => {
          expect(user.tokens.length).toBe(0)
          done()
        }).catch((e) => done(e))
      })
  })
})
