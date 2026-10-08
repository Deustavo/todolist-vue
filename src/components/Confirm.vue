<template>
  <div class="container-confirm-clear-background" @click.self="$emit('close')">
    <div class="container-confirm-clear">
      <p class="title-confirm-clear">{{ name ? message + ' ' : message }}<span v-if="name" class="confirm-name">{{ name }}</span>{{ name ? '?' : '' }}</p>
      <div>
        <button class="form-button red-button" @click="$emit('close')">
          <font-awesome-icon icon="fa-solid fa-xmark" />
        </button>
        <button class="form-button green-button" @click="$emit('confirm')">
          <font-awesome-icon icon="fa-solid fa-check" />
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppConfirm',
  props: {
    message: { type: String, required: true },
    name: { type: String, default: '' }
  },
  mounted () {
    window.addEventListener('keydown', this.onKeydown)
  },
  beforeUnmount () {
    window.removeEventListener('keydown', this.onKeydown)
  },
  methods: {
    onKeydown (e) {
      if (e.key === 'Escape') this.$emit('close')
    }
  }
}
</script>

<style>
  @import "../assets/style/clearList.css";
</style>
