let todoSubscription = `
    subscription {
        todos {
            todo
            completed
        }    
    }
`

export const todosSub = todoSubscription