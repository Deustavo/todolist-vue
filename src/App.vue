<template>
  <div class="container-page">
    <div class="container-header">
      <h1 class="title-page">Lista de compras</h1>
      <form @submit.prevent="addTodo(todo)">
        <div class="container-input">
          <input
            id="form-input"
            class="form-input"
            type="text"
            placeholder="Nome do item" maxlength="100"
            v-model="todo.description"
          />
          <button
            class="form-button green-button"
            style="font-size: 18px; margin-top: 1px"
          >
            <font-awesome-icon icon="fa-solid fa-plus" />
          </button>
        </div>
      </form>
    </div>
    <div v-if="todos.length < 1" class="empty-state">
      <iframe
        id="check-list-animation"
        src="https://embed.lottiefiles.com/animation/93061"
      />
      <span>
        Escreva a cima o nome dos itens que
        deseja adicionar em sua lista
      </span>
    </div>
    <div v-else class="container-todo-list">
      <app-todo
        v-for="t in todos.slice().reverse()"
        :key="t.id"
        :todo="t"
        @toggle="toggleTodo"
        @remove="removeTodo"
        @edit="editTodo"
      />
    </div>
    <app-clear-list
      :todos="this.todos"
      @clear="clearTodos"
    />
    <app-undo-delete
      :lastDeleted="this.lastDeleted"
      @restore="addTodo"
    />
  </div>
</template>

<script>
import AppTodo from './components/Todo'
import AppClearList from './components/ClearList'
import AppUndoDelete from './components/UndoDelete'

export default {
  components: {
    AppTodo,
    AppClearList,
    AppUndoDelete
  },
  data () {
    return {
      todos: [],
      todo: {
        description: '',
        checked: false
      },
      lastDeleted: {
        description: '',
        checked: false
      }
    }
  },

  mounted () {
    this.getLocalstorageTodos()
  },

  methods: {
    /**
     * Recupera a todo list do localstorage
     * @return {undefined}
     */
    getLocalstorageTodos () {
      const LocalStorageTodos = localStorage.getItem('ToDoList')

      if (LocalStorageTodos) {
        this.todos = JSON.parse(LocalStorageTodos)
      }
    },

    /**
     * Atualiza o valor da lista no localStorage
     * @param {array} todos valor da lista atualizado
     * @return {undefined}
     */
    setTodosLocalStorage (todos) {
      localStorage.setItem('ToDoList', JSON.stringify(todos))
    },

    /**
     * Procura o item na lista pelo seu id
     * @param {number} id
     * @return {number}
     */
    findTodoById (id) {
      return this.todos.findIndex(item => item.id === id)
    },

    /**
     * Adiciona um item a lista de compras
     * @param {object} todo informações do item
     * @return {undefined}
     */
    addTodo (todo) {
      if (todo?.description?.trimStart().length > 0) {
        todo.id = Date.now()
        this.todos.push(todo)
        this.todo = { checked: false }
        this.setTodosLocalStorage(this.todos)

        this.lastDeleted = {
          description: '',
          checked: false
        }
      }
    },

    /**
     * Inverte o valor status do item
     * @param {object} todo informações do item
     * @return {undefined}
     */
    toggleTodo (todo) {
      const index = this.findTodoById(todo.id)

      if (index > -1) {
        const checked = !this.todos[index].checked
        this.$set(this.todos, index, { ...this.todos[index], checked })
        this.setTodosLocalStorage(this.todos)
      }
    },

    /**
     * Remove item da lista de todos
     * @param {object} todo informações do item
     * @return {undefined}
     */
    removeTodo (todo) {
      const index = this.findTodoById(todo.id)
      this.lastDeleted = this.todos[index]

      if (index > -1) {
        this.$delete(this.todos, index)
        this.setTodosLocalStorage(this.todos)
      }
    },

    /**
     * Coloca o valor da descrição da todo no input
     * @param {object} todo informações do item
     * @return {undefined}
     */
    editTodo (localTodo) {
      this.todo.description = localTodo.description
      this.removeTodo(localTodo)
      document.getElementById('form-input').focus()
    },

    /**
     * Limpa a lista de todos
     * @return {undefined}
     */
    clearTodos () {
      this.todos = []
      this.setTodosLocalStorage(this.todos)
    }
  }
}
</script>

<style>
  @import './assets/style/app.css';
</style>
