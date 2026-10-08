<template>
  <div class="container-page">
    <div class="container-header">
      <button class="back-button" @click="$emit('back')">&#8592; Suas listas</button>
      <div class="list-header">
        <h1
          class="title-page list-title"
          :class="{ 'list-title-long': list.name.length > 12, 'flash-green': nameSaved }"
          @animationend="nameSaved = false"
          :title="list.name"
        >
          {{ list.name }}
        </h1>
        <app-list-menu
          :list="list"
          @edit="editingName = true"
          @delete="$emit('delete')"
        />
      </div>
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
    <transition name="fade" mode="out-in">
    <div v-if="todos.length < 1" class="empty-state">
      <img src="@/assets/cart.png" />
      <span>
        Escreva a cima o nome dos itens que
        deseja adicionar em sua lista
      </span>
    </div>
    <transition-group v-else tag="div" name="item" class="container-todo-list" @before-leave="el => (el.style.width = el.offsetWidth + 'px')">
      <app-todo
        v-for="t in todos.slice().reverse()"
        :key="t.id"
        :todo="t"
        @toggle="toggleTodo"
        @remove="removeTodo"
        @edit="editTodo"
      />
    </transition-group>
    </transition>
    <app-clear-list
      :todos="todos"
      @clear="clearTodos"
    />
    <app-undo-delete
      :lastDeleted="lastDeleted"
      @restore="addTodo"
    />
    <transition name="modal">
    <app-edit-list-name
      v-if="editingName"
      :name="list.name"
      @save="saveName"
      @close="editingName = false"
    />
    </transition>
  </div>
</template>

<script>
import AppTodo from './Todo.vue'
import AppClearList from './ClearList.vue'
import AppUndoDelete from './UndoDelete.vue'
import AppEditListName from './EditListName.vue'
import AppListMenu from './ListMenu.vue'

export default {
  name: 'AppList',
  components: {
    AppTodo,
    AppClearList,
    AppUndoDelete,
    AppEditListName,
    AppListMenu
  },
  props: {
    list: { type: Object, required: true }
  },
  data () {
    return {
      todos: this.list.todos,
      editingName: false,
      nameSaved: false,
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

  methods: {
    /**
     * Envia a lista atualizada para ser salva
     * @param {array} todos valor da lista atualizado
     * @return {undefined}
     */
    setTodosLocalStorage (todos) {
      this.$emit('save', { todos })
    },

    /**
     * Salva o novo nome da lista e fecha a modal
     * @param {string} name novo nome
     * @return {undefined}
     */
    saveName (name) {
      this.$emit('save', { name })
      this.editingName = false
      this.nameSaved = true
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
        this.todos[index] = { ...this.todos[index], checked }
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
        this.todos.splice(index, 1)
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
