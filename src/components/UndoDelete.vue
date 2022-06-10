<template>
  <div>
    <button
      class="undo-button red-button"
      :class="{'hide-undo-button': this.hasDeletedItem}"
      @click="$emit('restore', lastDeleted)"
    >
      Desfazer
    </button>
  </div>
</template>

<script>
export default {
  name: 'AppUndoDelete',
  props: {
    lastDeleted: {
      description: '',
      checked: false
    }
  },
  computed: {
    /**
     * Valida se há um item para ser restaurado
     * @return {bool}
     */
    hasDeletedItem () {
      return this.lastDeleted?.description?.length <= 0
    }
  }
}
</script>

<style>
  @import "../assets/style/undoDelete.css";
</style>
