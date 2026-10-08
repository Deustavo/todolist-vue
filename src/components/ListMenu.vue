<template>
  <div class="list-menu">
    <button
      class="todo-button blue-button hamburger"
      :class="{ 'hamburger-open': open }"
      @click="open = !open"
    >
      <span /><span /><span />
    </button>
    <div v-if="open" class="list-menu-overlay" @click="open = false" />
    <transition name="fade">
      <div v-if="open" class="list-menu-dropdown">
        <button @click="choose('edit')">
          <font-awesome-icon icon="fa-solid fa-pencil" /> Editar
        </button>
        <button @click="share">
          <font-awesome-icon icon="fa-solid fa-share-nodes" /> Compartilhar
        </button>
        <button class="list-menu-danger" @click="confirmDelete = true; open = false">
          <font-awesome-icon icon="fa-solid fa-trash" /> Excluir
        </button>
      </div>
    </transition>

    <transition name="modal">
      <div v-if="confirmDelete" class="container-confirm-clear-background" @click.self="confirmDelete = false">
        <div class="container-confirm-clear">
          <p class="title-confirm-clear">Deseja excluir esta lista?</p>
          <div>
            <button class="form-button red-button" @click="confirmDelete = false">
              <font-awesome-icon icon="fa-solid fa-xmark" />
            </button>
            <button class="form-button green-button" @click="$emit('delete')">
              <font-awesome-icon icon="fa-solid fa-check" />
            </button>
          </div>
        </div>
      </div>
    </transition>

    <transition name="fade">
      <div v-if="toast" class="list-menu-toast">{{ toast }}</div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'AppListMenu',
  props: {
    list: { type: Object, required: true }
  },
  data () {
    return {
      open: false,
      confirmDelete: false,
      toast: ''
    }
  },
  mounted () {
    window.addEventListener('keydown', this.onKeydown)
  },
  beforeUnmount () {
    window.removeEventListener('keydown', this.onKeydown)
  },
  methods: {
    onKeydown (e) {
      if (e.key !== 'Escape') return
      this.open = this.confirmDelete = false
    },

    /**
     * Fecha o dropdown e emite a opção escolhida
     * @param {string} event
     * @return {undefined}
     */
    choose (event) {
      this.open = false
      this.$emit(event)
    },

    /**
     * Gera o link de importação com os itens em query param e encurta no servidor.
     * Se o encurtador falhar, usa o link longo
     * @return {undefined}
     */
    async share () {
      this.open = false
      const params = new URLSearchParams({ nome: this.list.name })
      this.list.todos.forEach(t => params.append('item', t.description))
      const path = `/?${params}`

      let link
      try {
        const res = await fetch('/api/shorten', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ path })
        })
        const { code } = await res.json()
        link = `${location.origin}/s/${code}`
      } catch {
        link = location.origin + path
      }

      try {
        await navigator.clipboard.writeText(link)
        this.toast = 'Link copiado!'
      } catch {
        this.toast = 'Não foi possível copiar o link'
      }
      clearTimeout(this.toastTimer)
      this.toastTimer = setTimeout(() => { this.toast = '' }, 2500)
    }
  }
}
</script>
