let getTodosQuery = `
  {
      todos: getTodos {
        todo
        completed
      }
  }
`

export const getTodos = getTodosQuery