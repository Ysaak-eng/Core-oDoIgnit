const express = require('express');
const cors = require('cors');

 const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

 const users = [];

function checksExistsUserAccount(req, res, next) {
const {username} = req.headers;

const user = users.find(user =>{user.username ===username});

if(!user){
return res.json(400).json({erro:"User not found"})
}
req.user = user;
return next()

}

app.post('/users', (req, res) => {
const {name,username} = req.body;

const UserExiste = users.find(user=>  user.username === username);

if(UserExiste){
res.status(400).json({erro:"Mensagem do erro"})
}

const user = [{
  id: uuidv4(), //
  name, 
  username, 
  todos: []
}]

users.push(user)

return res.status(200).json(user)

});

app.get('/todos', checksExistsUserAccount, (req, res) => {
const {user} = req;

return res.json(user.todos)
});

app.post('/todos', checksExistsUserAccount, (req,res) => {
  const {user} = req;
  const {title,deadline} = req.body
 
  const tudo = [{ 
    id: uuidv4(),
    title,
    done:false, 
    deadline: new Date(deadline), 
    created_at: new Date(),
  }]
user.todos.push(tudo)

return res.status(201).send(tudo);

});

app.put('/todos/:id', checksExistsUserAccount, (req, res) => {
  const {user} = req;
  const {title,deadline} = req.body
  const {id} = req.params

  const tudo = user.todos.find(todo=>todo.id ===id);

    if(!tudo){
    res.status(400).json({erro:"Messagem"})
    }

  todo.title = title;

  todo.deadline = new Date(deadline);

  return res.json(todo)

});

app.patch('/todos/:id/done', checksExistsUserAccount, (req, res) => {
  const {user} = req;
  const {id} = req.params;

  const todo = user.todos.find(todo=>todo.id ===id);

  if(!todo){
    res.status(400).json({erro:"Messagem de erro"})
    }

  todo.done = true;

  return res.json(todo)

 

});

app.delete('/todos/:id', checksExistsUserAccount, (req, res) => {
  const {user} = req;
  const {id} = req.params;

  const todoIndex = user.todos.findIndex(todo=> todo.id==id);

  if(todoIndex == -1){
  return res.status(404).json({erro:"Todo not found"})
  }
  user.todos.splice(todoIndex,1);

  return res.status(204).json()
});

module.exports = app;