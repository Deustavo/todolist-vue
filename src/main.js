import { createApp } from 'vue'
import App from './App.vue'
import './assets/style/buttons.css'
import { sortable, swipe, longpress } from './gestures.js'

/**
 * Icones
 */
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCheck, faXmark, faPencil, faRotateLeft, faPlus, faShareNodes, faTrash, faCopy, faGripVertical } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faCheck, faPencil, faXmark, faRotateLeft, faPlus, faShareNodes, faTrash, faCopy, faGripVertical)

createApp(App)
  .component('font-awesome-icon', FontAwesomeIcon)
  .directive('sortable', sortable)
  .directive('swipe', swipe)
  .directive('longpress', longpress)
  .mount('#app')
