const MongoClient = require('mongodb').MongoClient

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');

  // db.collection('Todos').insertOne({
  //   text: 'Something to do',
  //   completed: false
  // }, (err, res) => {
  //   if (err) {
  //     return console.log('Unable to insert todo', err)
  //   }

  //   console.log(JSON.stringify(res.ops, undefined, 2))    
  // })

  // // Insert new doc into Users {name, age, location}
  // db.collection('Users').insertOne({
  //   name: 'Honza',
  //   age: 28,
  //   location: 'Kolín'
  // }, (err, res) => {
  //   if (err) {
  //     return console.log('Unable to insert user', user);
  //   }

  //   console.log(JSON.stringify(res.ops, undefined, 2));
  // })

  db.close()
})


