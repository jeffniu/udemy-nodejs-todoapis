var express = require('express')
var bodyParser = require('body-parser')
var {mongoose} = require('./db/mongoose')
var {Todo} = require('./models/todo')
var {User} = require('./models/user')


var app = express();
app.use(bodyParser.json())


app.post('/todos', (req, res)=> {
  var todo = new Todo({
    text: req.body.text
  })
  todo.save().then((doc)=> {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e)
  })
})

app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    res.send({
      todos: todos
    })
  }, (e) => {
    res.status(400).send(e)
  })
})

app.get('/todos/:id', (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).send("bad id")
  } else {
    Todo.findById(req.params.id).then((todo) => {
        if (todo) {
          res.send({todo})
        } else {
          res.status(404).send("Id not found")
        }
    }, (e) => {
        res.status(400).send(e)
    }).catch((e) => {res.status(400).send(e)})
  }
}, (e) => {
  res.status(400).send(e)
})

app.listen(3000, () => {
    console.log('Started on port 3000')
})

module.exports = {app};
