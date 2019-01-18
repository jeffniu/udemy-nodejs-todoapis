require('./config/config.js')

const _ = require('lodash')
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

app.delete('/todos/:id', (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).send("bad id")
  } else {
    Todo.deleteOne({_id: req.params.id}).then((res) => {
        if (res) {
          res.send({result: res})
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

app.listen(process.env.PORT, () => {
    console.log(`Started on port ${process.env.PORT}`)
})

module.exports = {app};
