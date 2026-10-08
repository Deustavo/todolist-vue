<template>
  <div>
      <transition name="fade">
      <button
        v-show="todos.length > 0 && !confirmClear"
        class="form-button clear-button yellow-button"
        @click="setConfirmClear(true)"
      >
        Limpar lista
      </button>
      </transition>
      <transition name="modal">
      <div v-show="confirmClear" class="container-confirm-clear-background">
        <div class="container-confirm-clear">
          <p class="title-confirm-clear">Deseja excluir todos os itens da lista?</p>
          <div>
            <button
              class="form-button red-button"
              @click="setConfirmClear(false)"
            >
              <font-awesome-icon icon="fa-solid fa-xmark" />
            </button>
            <button
              class="form-button green-button"
              @click="clearTodosAndCloseModal"
            >
              <font-awesome-icon icon="fa-solid fa-check" />
            </button>
          </div>
        </div>
      </div>
      </transition>
  </div>
</template>

<script>
export default {
  name: 'AppClearList',
  data () {
    return {
      confirmClear: false
    }
  },
  props: {
    todos: { type: Array, required: true }
  },
  mounted () {
    window.addEventListener('keydown', this.onKeydown)
  },
  beforeUnmount () {
    window.removeEventListener('keydown', this.onKeydown)
  },
  methods: {
    onKeydown (e) {
      if (e.key === 'Escape') this.confirmClear = false
    },

    /**
     * Abre modal para confirmar limpaza da todo list
     * @return {undefined}
     */
    setConfirmClear (value) {
      this.confirmClear = value
    },

    /**
     * Limpa a todo list e fecha o modal
     * @return {undefined}
     */
    clearTodosAndCloseModal () {
      this.$emit('clear')
      this.setConfirmClear(false)
    }
  }
}
</script>

<style>
  @import "../assets/style/clearList.css";
</style>
