<template>
  <div class="container is-fullhd has-text-centered">
      <div class="notification">      
      
      <div>
          <table class="table is-bordered is-inline-block">
          <tr>
              <td colspan="2">
                  <b-field>              
                      <b-input v-model="newTodo" placeholder="Add a new todo"></b-input>              
                      <button class="button is-primary" @click="addTodo" expanded>Add</button>
                  </b-field>            
              </td>
          </tr>
          <tr v-for="(todo,i) in todos" :key="i">
              <td>
              <div class="field">
                <b-switch v-model="todo.completed" @click.native="updateTodo(todo)">{{todo.todo}}</b-switch>
              </div>
              </td>
              <td><button class="button is-primary" @click="deleteTodo(todo)">Delete</button></td>
          </tr>
          </table>
      </div>
      </div>
  </div>
</template>

<script>
import gql from "graphql-tag";
import { addTodo, updateTodo, deleteTodo } from "../gql/mutations";
import { todosSub } from "../gql/subscriptions";

export default {
  data: () => {
    return {
      todos: [],
      newTodo: ""
    };
  },
  methods: {
    addTodo(e) {
      if (this.newTodo == "") return;
      this.$apollo.mutate({
        mutation: gql(addTodo),
        variables: {
          newTodo: { todo: this.newTodo, completed: false }
        },
        update: (store, { data: { addTodo } }) => {
          this.newTodo = "";
        }
      });
    },
    updateTodo(e) {
      this.$apollo.mutate({
        mutation: gql(updateTodo),
        variables: {
          todo: { todo: e.todo, completed: !e.completed }
        }
      });
    },
    deleteTodo(e) {
      this.$apollo.mutate({
        mutation: gql(deleteTodo),
        variables: {
          todo: e.todo
        }
      });
    }
  },
  apollo: {
    $subscribe: {
      todos: {
        query: gql(todosSub),
        result({ data }) {
          this.todos = data.todos;
        }
      }
    }
  }
};
</script>