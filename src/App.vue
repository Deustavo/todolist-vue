<template>
  <!-- abrindo lista: tela sai pra esquerda e lista vem da direita; voltando: o inverso -->
  <transition :name="currentList ? 'slide-left' : 'slide-right'" mode="out-in">
  <app-list
    v-if="currentList"
    :key="currentList.id"
    :list="currentList"
    @save="saveList"
    @back="openList(null)"
    @delete="deleteList"
  />
  <div v-else class="container-page">
    <div class="container-header">
      <div class="list-header">
        <h1 class="title-page list-title">Suas listas</h1>
        <button
          class="todo-button green-button"
          style="font-size: 18px"
          @click="addList"
        >
          <font-awesome-icon icon="fa-solid fa-plus" />
        </button>
      </div>
    </div>
    <transition name="fade" mode="out-in">
    <div v-if="lists.length < 1" class="empty-state">
      <img src="@/assets/cart.png" />
      <span>Clique no + para criar sua primeira lista</span>
    </div>
    <transition-group v-else tag="div" name="item" class="container-todo-list" @before-leave="el => (el.style.width = el.offsetWidth + 'px')">
      <div
        v-for="l in lists"
        :key="l.id"
        class="todo-item list-card"
        @click="openList(l.id)"
      >
        <div class="todo-text">
          <span class="todo-arrow" style="margin: 0px 12px 0px 0px">&#8594;</span>
          <p class="todo-title">{{ l.name }}</p>
        </div>
        <span class="list-count">{{ l.todos.length }}</span>
      </div>
    </transition-group>
    </transition>
  </div>
  </transition>
</template>

<script>
import AppList from './components/List.vue'

export default {
  components: {
    AppList
  },
  data () {
    return {
      lists: [],
      currentListId: null
    }
  },

  computed: {
    currentList () {
      return this.lists.find(l => l.id === this.currentListId)
    }
  },

  mounted () {
    this.getLocalstorageLists()
    this.importFromUrl()
    this.readUrl()
    window.addEventListener('hashchange', this.readUrl)
  },

  unmounted () {
    window.removeEventListener('hashchange', this.readUrl)
  },

  methods: {
    /**
     * Abre a lista pelo id na URL (#/lista/:id); sem id ou id inexistente volta para a tela principal
     * @return {undefined}
     */
    readUrl () {
      const match = location.hash.match(/^#\/lista\/(\d+)$/)
      const id = match && Number(match[1])

      if (id && !this.lists.some(l => l.id === id)) {
        location.replace('#/')
        return
      }
      this.currentListId = id || null
    },

    /**
     * Navega para a URL da lista, ou para a tela principal se id for null
     * @param {number|null} id
     * @return {undefined}
     */
    openList (id) {
      location.hash = id ? `/lista/${id}` : '/'
    },

    /**
     * Recupera as listas do localstorage, migrando a lista única antiga se existir
     * @return {undefined}
     */
    getLocalstorageLists () {
      const localStorageLists = localStorage.getItem('Lists')
      const oldTodos = localStorage.getItem('ToDoList')

      if (localStorageLists) {
        this.lists = JSON.parse(localStorageLists)
      } else if (oldTodos) {
        this.lists = [{ id: Date.now(), number: 1, name: 'Lista 1', todos: JSON.parse(oldTodos) }]
        this.setListsLocalStorage()
        localStorage.removeItem('ToDoList')
      }
    },

    /**
     * Atualiza o valor das listas no localStorage
     * @return {undefined}
     */
    setListsLocalStorage () {
      localStorage.setItem('Lists', JSON.stringify(this.lists))
    },

    /**
     * Cria uma nova lista com nome incremental e abre ela
     * @return {undefined}
     */
    addList () {
      const number = Math.max(0, ...this.lists.map(l => l.number)) + 1
      const list = { id: Date.now(), number, name: `Lista ${number}`, todos: [] }

      this.lists.push(list)
      this.setListsLocalStorage()
      this.openList(list.id)
    },

    /**
     * Cria uma nova lista a partir de um link compartilhado (?nome=...&item=...) e abre ela
     * @return {undefined}
     */
    importFromUrl () {
      const params = new URLSearchParams(location.search)
      if (!params.has('nome')) return

      const id = Date.now()
      const number = Math.max(0, ...this.lists.map(l => l.number)) + 1
      const name = params.get('nome').trim().slice(0, 25) || `Lista ${number}`
      const todos = params.getAll('item')
        .filter(description => description.trim())
        .map((description, i) => ({ id: id + i, description: description.slice(0, 100), checked: false }))

      this.lists.push({ id, number, name, todos })
      this.setListsLocalStorage()
      // remove a query da URL para não importar de novo ao recarregar
      history.replaceState(null, '', `/#/lista/${id}`)
    },

    /**
     * Exclui a lista aberta e volta para a tela principal
     * @return {undefined}
     */
    deleteList () {
      this.lists = this.lists.filter(l => l.id !== this.currentListId)
      this.setListsLocalStorage()
      this.openList(null)
    },

    /**
     * Atualiza os campos da lista aberta e salva
     * @param {object} changes campos alterados (name e/ou todos)
     * @return {undefined}
     */
    saveList (changes) {
      Object.assign(this.currentList, changes)
      this.setListsLocalStorage()
    }
  }
}
</script>

<style>
  @import './assets/style/app.css';
</style>
