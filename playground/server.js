const { mongoose } = require('./db/mongoose')

const Todo = mongoose.model('Todo', {
  text: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Number,
    default: null
  }
})

// const newTodo = new Todo({
//   text: 'Cook dinner'
// })

// const newTodo = new Todo({
//   text: 'Edit this video'
// })

// newTodo.save().then((doc) => {
//   console.log('Saved todo: ', JSON.stringify(doc, undefined, 2));
// }).catch((err) => {
//   console.log('Unable to save todo.');
// })

// User
// email - require, trim, type String, minlenght of 1
const User = mongoose.model('User', {
  email: {
    type: String,
    required: true,
    minlenght: 1,
    trim: true
  }
})

const newUser = new User({
  email: ' test@test.com  '
})

newUser.save().then((user) => {
  console.log('Saved user: ', JSON.stringify(user, undefined, 2));
}).catch((err) => {
  console.log('Unable to save user', err);
})
