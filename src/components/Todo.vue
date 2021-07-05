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
  .todo-item {
    background-color: #fff;
    color: black;
    display: flex;
    align-items: center;
    padding: 0px 16px;
    margin: 8px 0px;
    border-radius: 8px;
    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
  }
  .todo-title {
    width: 240px;
    word-break: break-all;
    margin-right: 16px;
  }
  .todo-options {
    width: min-content;
    margin: 12px 0px;
  }
  .todo-button {
    width: 100px;
    padding: 8px;
    cursor: pointer;
    border-radius: 4px;
    border: none;
    margin: 8px 0px;
  }
  .checked {
    background-color: #e7ffe7;
  }
  .checked .todo-title, .checked .todo-arrow {
    color: #d0d0d0;
  }
</style>
