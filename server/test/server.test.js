const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const todos = [{
  text: 'First test todo'
}, {
  text: 'Second test todo'
}]

beforeEach((done) => {
  Todo.deleteMany({}).then(()=> {
    return Todo.insertMany(todos)
  }).then(()=> {
    done()
  })
})

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
      var text = 'Test todo text';
      request(app)
        .post('/todos')
        .send({text})
        .expect(200)
        .expect((res) => {
            expect(res.body.text).toBe(text)
        })
        .end((err, res) => {
          if (err) {
            return done(err)
          }
          Todo.find({text: text}).then((todos) => {
            expect(todos.length).toBe(1);
            expect(todos[0].text).toBe(text);
            done()
          }).catch((e) => done(e));
        })
  })

  it('should not create todo with invalid data', (done)=> {
    request(app)
      .post('/todos')
      .send({text: ""})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err)
        }
        Todo.find().then((dbdata) => {
          expect(dbdata.length).toBe(todos.length)
          done();
        }).catch((e) => done(e))
      })
  })
})

describe('GET /todos', () => {
  it('should get all todos', (done) => {
      request(app)
        .get('/todos')
        .expect(200)
        .expect((res) => {
            expect(res.body.todos.length).toBe(todos.length)
        })
        .end(done)
  })

  it('get todo by id', (done) => {
      Todo.findOne().then((todo)=> {
        request(app)
          .get('/todos/' + todo._id)
          .expect(200)
          .expect((res) => {
            expect(res.body.todo._id).toEqual(todo._id.toHexString())
          })
          .end(done)
      }, (e) => {done(e)})
  })
})
