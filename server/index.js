const { GraphQLServer, PubSub } = require('graphql-yoga')

const pubsub = new PubSub()

const typeDefs = `
  #The thing I should be doing
  type Todo { 
    #Description of the thing I should be doing
    todo: String
    #Have I completed the thing I should be doing?
    completed: Boolean
  }
  
  input TodoInput {
    todo: String
    completed: Boolean
  }
  
  type Query {
    #Get all todos
    todos: [Todo]
  }
  
  type Mutation {
    #Add a new todo
    addTodo(newTodo: TodoInput): [Todo]
    #Update an existing todo
    updateTodo(todo: TodoInput): [Todo]
    #Delete a todo
    deleteTodo(todo: String): [Todo]
  }
  
  type Subscription {
    #Get live counter
    counter: String
    #Get real time todos 
    todos: [Todo]
  }
`
let counter = 0;
setInterval(()=> pubsub.publish('counter',{counter:counter++}, 1000))

let todos = [];

const publishTodos = () => {
  pubsub.publish('todos', { todos: todos })
}

const resolvers = {
  Query: {
    todos() {
      return todos;
    }
  },
  Mutation: {
    addTodo(_, { newTodo }) {
      var existingTodo = todos.find(t => {
        return t.todo == newTodo.todo
      });

      if (!existingTodo) {
        todos.push(newTodo)
        publishTodos()
      }

      return todos;
    },
    updateTodo(_, { todo }) {
      var index = todos.findIndex(t => t.todo == todo.todo)
      todos[index] = todo;
      publishTodos()
      return todos;
    },
    deleteTodo(_, { todo }) {
      var index = todos.findIndex(t => t.todo == todo)
      todos.splice(index, 1)
      publishTodos()
      return todos;
    }
  },
  Subscription: {
    counter: {
      subscribe: (parent, args, context) => {
        return pubsub.asyncIterator('counter')
      }
    },
    todos: {
      subscribe: (parent, args, context) => {
        setTimeout(publishTodos, 0)
        return pubsub.asyncIterator('todos')
      }
    }
  }
}

const server = new GraphQLServer({
  typeDefs,
  resolvers
})

const options = {
  port: process.env.PORT || 9000,
  playground: '/'
}

server.start(options, ({ port }) => console.log(`Server started, listening on port http://localhost:${port} for incoming  requests.`))
