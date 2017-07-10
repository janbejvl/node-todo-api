// const MongoClient = require('mongodb').MongoClient
const { MongoClient, ObjectID } = require('mongodb')

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');

  // db.collection('Todos').find().toArray().then((docs) => {
  //   console.log('Todos')
  //   console.log(JSON.stringify(docs, undefined, 2));
  // }).catch((err) => {
  //   console.log('Unable to fetch todos'. err);
  // })

  // db.collection('Todos').find().count().then((count) => {
  //   console.log(`Todos count: ${count}`)
  // }).catch((err) => {
  //   console.log('Unable to fetch todos'. err);
  // })

  db.collection('Users').find({name: "Honza"}).toArray().then((users) => {
    console.log(`Users`)
    console.log(JSON.stringify(users, undefined, 2));
  }).catch((err) => {
    console.log('Unable to fetch users'. err);
  })

  // db.close()
})


