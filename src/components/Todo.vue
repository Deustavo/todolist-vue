<template>
  <div class="todo-item" :class="{checked: todo.checked}">
    <span class="todo-arrow" style="margin: 0px 12px 0px 0px">&#8594;</span>
    <p class="todo-title">{{ todo.description }}</p>
    <div class="todo-options">
      <button
        class="todo-button"
        style="background-color: #5ce05c"
        @click="$emit('toggle', todo)"
      >
        <span v-if="todo.checked">Desmarcar</span>
        <span v-else>Confere</span>
      </button>
      <button
        class="todo-button"
        style="background-color: #ff5959"
        v-show="!todo.checked"
        @click="$emit('remove', todo)"
      >
        Remover
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    todo: { type: Object, required: true }
  }
}
</script>

<style>
  @import '../assets/style/todo.css';
</style>
