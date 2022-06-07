<template>
  <div>
      <button
        v-show="this.todos.length > 0 && !confirmClear"
        class="form-button clear-button"
        style="background-color: #24b5fa"
        @click="setConfirmClear(true)"
      >
        Limpar lista
      </button>
      <div v-show="confirmClear" class="container-confirm-clear-background">
        <div class="container-confirm-clear">
          <p class="title-confirm-clear">Deseja excluir todos os itens da lista?</p>
          <div>
            <button
              class="form-button"
              style="background-color: #f84748"
              @click="setConfirmClear(false)"
            >
              Cancelar
            </button>
            <button
              class="form-button"
              style="background-color: #5bcf67"
              @click="this.clearTodosAndCloseModal"
            >
              Limpar lista
            </button>
          </div>
        </div>
      </div>
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
  methods: {
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
