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
          :class="{ 'pulse-button': !lists.length }"
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
    <transition-group v-else v-sortable="moveList" tag="div" name="item" class="container-todo-list" @before-leave="el => (el.style.width = el.offsetWidth + 'px')">
      <div v-for="l in lists" :key="l.id" class="swipe-row">
        <span class="swipe-delete red-button"><font-awesome-icon icon="fa-solid fa-trash" /></span>
        <div
          v-swipe="() => (deletingList = l)"
          v-longpress="() => selected.includes(l.id) || selected.push(l.id)"
          class="todo-item list-card"
          :class="{ 'flash-red': flashingList === l, selected: selected.includes(l.id) }"
          @click.capture="selected.length && toggleSelected($event, l.id)"
          @click="openList(l.id)"
          @animationend.self="flashingList === l && deleteList(l.id)"
        >
          <div class="todo-text">
            <span class="todo-arrow drag-handle"><font-awesome-icon icon="fa-solid fa-grip-vertical" /></span>
            <p class="todo-title">{{ l.name }}</p>
          </div>
          <span class="list-count">{{ l.todos.length }}</span>
        </div>
      </div>
    </transition-group>
    </transition>
    <button class="bulk-delete-button red-button" :class="{ 'hide-bulk-delete': !selected.length }" @click="confirmBulkDelete = true">
      Excluir
    </button>
    <transition name="modal">
    <app-confirm
      v-if="confirmBulkDelete"
      :message="`Deseja excluir ${selected.length} ${selected.length > 1 ? 'listas' : 'lista'}?`"
      @confirm="deleteSelected"
      @close="confirmBulkDelete = false"
    />
    </transition>
    <transition name="modal">
    <app-confirm
      v-if="deletingList"
      :message="`Deseja excluir a lista ${deletingList.name}?`"
      @confirm="flashingList = deletingList; deletingList = null"
      @close="deletingList = null"
    />
    </transition>
  </div>
  </transition>
</template>

<script>
import AppList from './components/List.vue'
import AppConfirm from './components/Confirm.vue'

export default {
  components: {
    AppList,
    AppConfirm
  },
  data () {
    return {
      lists: [],
      currentListId: null,
      deletingList: null,
      flashingList: null,
      selected: [],
      confirmBulkDelete: false
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
     * Exclui a lista (por padrão a aberta) e volta para a tela principal
     * @param {number} id
     * @return {undefined}
     */
    deleteList (id = this.currentListId) {
      this.lists = this.lists.filter(l => l.id !== id)
      this.setListsLocalStorage()
      this.openList(null)
    },

    /**
     * Em modo de seleção, o clique marca/desmarca a lista em vez de abrir
     * @param {Event} e
     * @param {number} id
     * @return {undefined}
     */
    toggleSelected (e, id) {
      e.stopPropagation()
      const index = this.selected.indexOf(id)
      index > -1 ? this.selected.splice(index, 1) : this.selected.push(id)
    },

    /**
     * Exclui todas as listas selecionadas
     * @return {undefined}
     */
    deleteSelected () {
      this.lists = this.lists.filter(l => !this.selected.includes(l.id))
      this.setListsLocalStorage()
      this.selected = []
      this.confirmBulkDelete = false
    },

    /**
     * Move a lista de uma posição para outra
     * @param {number} from
     * @param {number} to
     * @return {undefined}
     */
    moveList (from, to) {
      this.lists.splice(to, 0, ...this.lists.splice(from, 1))
      this.setListsLocalStorage()
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
