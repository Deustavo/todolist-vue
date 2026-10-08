<template>
  <div class="container-confirm-clear-background" @click.self="$emit('close')">
    <form class="container-confirm-clear" @submit.prevent="save">
      <p class="title-confirm-clear">{{ title }}</p>
      <input
        ref="input"
        class="form-input edit-name-input"
        type="text"
        :maxlength="maxlength"
        v-model="newName"
      />
      <div>
        <button
          type="button"
          class="form-button red-button"
          @click="$emit('close')"
        >
          <font-awesome-icon icon="fa-solid fa-xmark" />
        </button>
        <button class="form-button green-button">
          <font-awesome-icon icon="fa-solid fa-check" />
        </button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'AppEditListName',
  props: {
    name: { type: String, required: true },
    title: { type: String, default: 'Nome da lista' },
    maxlength: { type: Number, default: 25 }
  },
  data () {
    return {
      newName: this.name
    }
  },
  mounted () {
    this.$refs.input.focus()
    window.addEventListener('keydown', this.onKeydown)
  },
  beforeUnmount () {
    window.removeEventListener('keydown', this.onKeydown)
  },
  methods: {
    onKeydown (e) {
      if (e.key === 'Escape') this.$emit('close')
    },

    /**
     * Salva o novo nome caso não esteja vazio
     * @return {undefined}
     */
    save () {
      if (this.newName.trim().length > 0) {
        this.$emit('save', this.newName.trim())
      }
    }
  }
}
</script>

<style>
  @import "../assets/style/clearList.css";
</style>
