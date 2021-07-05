<template>
  <div class="container-page">
    <div class="container-header">
      <img src="@/assets/trayLogo.png" alt="logo tay">
      <h1 class="title-page">Lista de compras</h1>
      <form @submit.prevent="addTodo(todo)">
        <div class="container-input">
          <input type="text" v-model="todo.description" class="form-input" placeholder="Add todo" />
          <button class="form-button">Adicionar</button>
        </div>
      </form>
    </div>
    <div class="container-todo-list">
      <todo
        v-for="t in todos"
        :key="t.id"
        :todo="t"
        @toggle="toggleTodo"
        @remove="removeTodo"
      />
    </div>
  </div>
</template>

<script>
import Todo from './components/Todo'

export default {
  components: { Todo },
  data () {
    return { todos: [], todo: { checked: false } }
  },
  methods: {
    addTodo (todo) {
      todo.id = Date.now()
      this.todos.push(todo)
      this.todo = { checked: false }
    },
    toggleTodo (todo) {
      const index = this.todos.findIndex(item => item.id === todo.id)
      if (index > -1) {
        const checked = !this.todos[index].checked
        // $set será usado para alterar o valor da array de forma segura, o primeiro parametro é a lista, o segundo o index do item na lista e o treceiro valor o que deseja atribuir
        this.$set(this.todos, index, { ...this.todos[index], checked })
      }
    },
    removeTodo (todo) {
      const index = this.todos.findIndex(item => item.id === todo.id)
      if (index > -1) {
        this.$delete(this.todos, index)
      }
    }
  }
}
</script>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Raleway&display=swap');
  .container-page {
    display: flex;
    align-items: center;
    flex-direction: column;
    height: 100vh;
    font-family: 'Raleway', sans-serif;
  }
  .container-header {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    margin-top: 40px;
  }
  .container-header img {
    max-width: 200px;
  }
  .container-input {
    display: flex;
    align-items: center;
    width: 432px;
  }
  .form-input {
    width: 100%;
    padding: 8px;
  }
  .form-button {
    padding: 10px;
    background-color: #5c5ce0;
    border-radius: 4px;
    border: none;
    cursor: pointer;
  }
  .title-page {
    font-size: 56px;
    margin: 0px 0px 40px 0px;
  }
  .container-todo-list {
    margin: 8px 0px 40px 0px;
    max-height: calc(100vh);
    overflow: auto;
  }
</style>
