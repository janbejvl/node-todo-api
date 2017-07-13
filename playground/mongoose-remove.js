const { ObjectID } = require('mongodb')
const { mongoose } = require('./../server/db/mongoose')
const { Todo } = require('./../server/models/todo')
const { User } = require('./../server/models/user')

// Todo.remove({}).then((result) => {
//   console.log(result);
// })

Todo.findOneAndRemove({_id: "5967ea4583affbdf6de25106"}).then((res) => {
  console.log(res)
})

// Todo.findByIdAndRemove('5967ea4583affbdf6de25106').then((res) => {
//   console.log(res)
// })
