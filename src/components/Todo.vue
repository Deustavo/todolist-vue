<template>
  <div
    :id="`todo-item${this.todo.id}`"
    :class="{checked: todo.checked, 'large-card': this.hasLargeTitle}"
    class="todo-item"
  >
    <div class="todo-text">
      <span class="todo-arrow" style="margin: 0px 12px 0px 0px">&#8594;</span>
      <p :id="`todo-title${todo.id}`" class="todo-title">{{ todo.description }}</p>
    </div>
    <div class="todo-options" :id="`todo-options${this.todo.id}`">
      <button
        class="todo-button"
        style="background-color: #24b5fa; font-size: 16px"
        v-show="!todo.checked"
        @click="$emit('edit', todo)"
      >
        <font-awesome-icon icon="fa-solid fa-pencil" />
      </button>
      <button
        class="todo-button"
        style="background-color: #f84748"
        v-show="!todo.checked"
        @click="$emit('remove', todo)"
      >
        <font-awesome-icon icon="fa-solid fa-xmark" />
      </button>
      <button
        class="todo-button"
        style="background-color: #5bcf67"
        @click="$emit('toggle', todo)"
      >
        <font-awesome-icon v-if="todo.checked" icon="fa-solid fa-xmark" />
        <font-awesome-icon v-else icon="fa-solid fa-check" />
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppTodo',
  props: {
    todo: { type: Object, required: true }
  },
  data () {
    return {
      hasLargeTitle: false,
      totalMarginTodoItem: 60
    }
  },
  mounted () {
    this.hasLargeTitle = this.titleIsBiggerThanTodoItem
  },
  computed: {
    /**
     * Valida se o titulo oucupa mais espaço do que o tamanho do todo-title
     * @return {bool}
     */
    titleIsBiggerThanTodoItem () {
      const todoItemWidth = document.getElementById(`todo-item${this.todo.id}`).offsetWidth - this.totalMarginTodoItem
      const todoTitleWidth = document.getElementById(`todo-title${this.todo.id}`).offsetWidth
      const todoOptionsWidth = document.getElementById(`todo-options${this.todo.id}`).offsetWidth

      return todoTitleWidth + todoOptionsWidth >= todoItemWidth
    }
  }
}
</script>

<style>
  @import '../assets/style/todo.css';
</style>
