import { createApp } from 'vue'
import App from './App.vue'
import './assets/style/buttons.css'

/**
 * Icones
 */
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCheck, faXmark, faPencil, faRotateLeft, faPlus, faBars, faShareNodes, faTrash, faCopy } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faCheck, faPencil, faXmark, faRotateLeft, faPlus, faBars, faShareNodes, faTrash, faCopy)

createApp(App)
  .component('font-awesome-icon', FontAwesomeIcon)
  .mount('#app')
