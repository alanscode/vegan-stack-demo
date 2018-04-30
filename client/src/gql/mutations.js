let addTodoMutation = `
    mutation($newTodo: TodoInput) {
        addTodo(newTodo: $newTodo) {
            todo
            completed
        }
    }
`
let updateTodoMutation = `
    mutation($todo: TodoInput){
        updateTodo(todo:$todo){
            todo
            completed
        }
    }
`

let deleteTodoMutation = `
    mutation ($todo: String){
        deleteTodo(todo:$todo){
            todo,
            completed
        }
    }
`

export const addTodo = addTodoMutation

export const updateTodo = updateTodoMutation

export const deleteTodo = deleteTodoMutation