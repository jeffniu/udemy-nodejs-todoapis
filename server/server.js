require('./config/config.js')

const _ = require('lodash')
var express = require('express')
var bodyParser = require('body-parser')
var {mongoose} = require('./db/mongoose')
var {Todo} = require('./models/todo')
var {User} = require('./models/user')
var {ObjectID} = require('mongodb')
var {authenticate} = require('./middleware/authenticate')



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

app.patch('/todos/:id', (req, res) => {
  var id = req.params.id;
  var body = _.pick(req.body, ['text', 'completed']);
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }
  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }
  Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo)=> {
    if (!todo) {
      return res.status(404).send();
    }
    res.send({todo})
  }).catch((e)=>{res.status(400).send()})
})

//POST /users //sign up api
app.post('/users', (req, res) => {
  var body = _.pick(req.body, ['email', 'password'])
  var user = new User(body)
  user.save().then(() => {
    // res.send(user);
    return user.generateAuthToken();
  }).then((token) => {
      res.header('x-auth', token).send(user)
  }).catch((e) => {
    console.log(e)
    res.status(400).send(e)
  })
})

//POST /users/login {email, password}
app.post('/users/login', (req, res) => {
  var body = _.pick(req.body, ['email', 'password'])
  User.findByCredentials(body.email, body.password).then((user) => {
      return user.generateAuthToken().then((token) => {
        res.header('x-auth', token).send(user)
      })
  }).catch((e) => {
      res.status(400).send(e);
  })
})

app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user)
})

app.listen(process.env.PORT, () => {
    console.log(`Started on port ${process.env.PORT}`)
})

module.exports = {app};
