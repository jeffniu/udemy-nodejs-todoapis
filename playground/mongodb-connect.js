//es6 object destructure
const {MongoClient, ObjectID} = require('mongodb');

var obj = new ObjectID();

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
  if (err) {
    return console.log('Unable to connect to MongoDB Server');
  }
  console.log('Connected to MongoDB server');
  const db = client.db('TodoApp')
  var todos = db.collection('Todos').find({completed: false}).toArray().then((docs) => {
      console.log('Todos');
      console.log(JSON.stringify(docs, undefined, 2))
  }, (err) => {
    console.log('Unable to fetch todos', err)
  });

  // db.collection('Users').insertOne({
  //     name: 'ngy',
  //     age: 31,
  //     location: 'CA',
  // }, (err, result) => {
  //   if (err) {
  //       return console.log('Unable to insert user', err);
  //   }
  //   console.log(JSON.stringify(result.ops, undefined, 2));
  // })

  client.close();
});
