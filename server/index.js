import { GraphQLServer, PubSub } from "graphql-yoga";
const pubsub = new PubSub();

let counter = 0;
setInterval(() => pubsub.publish("counter", { counter: counter++ }, 1000));

let todos = [];

const publishTodos = () => {
  pubsub.publish("todos", { todos: todos });
};

const resolvers = {
  Query: {
    todos() {
      return todos;
    }
  },
  Mutation: {
    addTodo(_, { newTodo }) {
      var existingTodo = todos.find(t => {
        return t.todo == newTodo.todo;
      });

      if (!existingTodo) {
        todos.push(newTodo);
        publishTodos();
      }

      return todos;
    },
    updateTodo(_, { todo }) {
      var index = todos.findIndex(t => t.todo == todo.todo);
      todos[index] = todo;
      publishTodos();
      return todos;
    },
    deleteTodo(_, { todo }) {
      var index = todos.findIndex(t => t.todo == todo);
      todos.splice(index, 1);
      publishTodos();
      return todos;
    }
  },
  Subscription: {
    todos: {
      subscribe: (parent, args, context) => {
        setTimeout(publishTodos, 0);
        return pubsub.asyncIterator("todos");
      }
    }
  }
};

const server = new GraphQLServer({
  typeDefs: "gql/typedefs.graphql",
  resolvers
});

const options = {
  port: process.env.PORT || 9000,
  playground: "/"
};

server.start(options, ({ port }) =>
  console.log(
    `Server started, listening on port http://localhost:${port} for incoming  requests.`
  )
);
