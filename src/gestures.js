import { nextTick } from 'vue'

/**
 * Escuta move/up/cancel do ponteiro até soltar (mouse e toque)
 * @param {function} move
 * @param {function} end
 * @return {undefined}
 */
function track (move, end) {
  const up = () => {
    window.removeEventListener('pointermove', move)
    window.removeEventListener('pointerup', up)
    window.removeEventListener('pointercancel', up)
    end()
  }
  window.addEventListener('pointermove', move)
  window.addEventListener('pointerup', up)
  window.addEventListener('pointercancel', up)
}

/**
 * v-sortable="fn": arrasta um filho do container pela .drag-handle e chama fn(from, to) ao trocar de posição
 */
export const sortable = {
  mounted (container, binding) {
    container._onSort = binding.value
    container.addEventListener('pointerdown', e => {
      const handle = e.target.closest('.drag-handle')
      if (!handle || e.button !== 0) return
      e.preventDefault()

      let item = handle
      while (item.parentElement !== container) item = item.parentElement
      const grabY = e.clientY - item.getBoundingClientRect().top
      let y = e.clientY
      let dragging = true
      item.classList.add('dragging')

      // posiciona o item embaixo do dedo, relativo ao lugar dele na lista
      const place = () => {
        item.style.transform = ''
        if (!dragging) return
        item.style.transform = `translateY(${y - grabY - item.getBoundingClientRect().top}px)`
      }

      track(e => {
        y = e.clientY
        const box = container.getBoundingClientRect()
        if (y < box.top + 40) container.scrollTop -= 10
        if (y > box.bottom - 40) container.scrollTop += 10

        const items = [...container.children].filter(c => !c.classList.contains('item-leave-active'))
        const from = items.indexOf(item)
        const to = items.filter(c => {
          if (c === item) return false
          const r = c.getBoundingClientRect()
          return r.top + r.height / 2 < y
        }).length

        if (from !== to) {
          container._onSort(from, to)
          nextTick(place)
        }
        place()
      }, () => {
        dragging = false
        item.style.transform = ''
        item.classList.remove('dragging')
      })
    })
  },
  updated (container, binding) {
    container._onSort = binding.value
  }
}

const SWIPE_THRESHOLD = 100

/**
 * v-swipe="fn": arrastar o card para a esquerda além do limite chama fn (ex: confirmar exclusão)
 */
export const swipe = {
  mounted (el, binding) {
    el._onSwipe = binding.value
    let blockClick = false

    // depois de arrastar, o clique não deve abrir/alterar o card
    el.addEventListener('click', e => {
      if (blockClick) e.stopPropagation()
    }, true)

    el.addEventListener('pointerdown', e => {
      if (e.button !== 0 || e.target.closest('button, .drag-handle')) return
      const x0 = e.clientX
      const y0 = e.clientY
      let dx = 0
      let swiping = false
      let cancelled = false

      track(e => {
        if (cancelled) return
        dx = e.clientX - x0
        if (!swiping) {
          if (Math.abs(e.clientY - y0) > Math.abs(dx)) cancelled = Math.abs(e.clientY - y0) > 10
          if (Math.abs(dx) < 10 || cancelled) return
          swiping = true
          el.style.transition = 'none'
        }
        el.style.transform = `translateX(${Math.min(0, dx)}px)`
      }, () => {
        if (!swiping) return
        el.style.transition = ''
        el.style.transform = ''
        if (dx < -SWIPE_THRESHOLD) el._onSwipe()
        blockClick = true
        setTimeout(() => (blockClick = false))
      })
    })
  },
  updated (el, binding) {
    el._onSwipe = binding.value
  }
}

const LONGPRESS_DELAY = 500

/**
 * v-longpress="fn": segurar o card parado chama fn (ex: selecionar)
 */
export const longpress = {
  mounted (el, binding) {
    el._onLongpress = binding.value
    // no celular, segurar abriria o menu do navegador
    el.addEventListener('contextmenu', e => e.preventDefault())

    el.addEventListener('pointerdown', e => {
      if (e.button !== 0 || e.target.closest('button, .drag-handle')) return
      const x0 = e.clientX
      const y0 = e.clientY
      let fired = false
      const timer = setTimeout(() => {
        fired = true
        el._onLongpress()
      }, LONGPRESS_DELAY)

      track(e => {
        if (Math.abs(e.clientX - x0) > 10 || Math.abs(e.clientY - y0) > 10) clearTimeout(timer)
      }, () => {
        clearTimeout(timer)
        if (!fired) return
        // o clique que vem ao soltar não deve desmarcar o item recém selecionado
        const block = e => e.stopPropagation()
        window.addEventListener('click', block, true)
        setTimeout(() => window.removeEventListener('click', block, true))
      })
    })
  },
  updated (el, binding) {
    el._onLongpress = binding.value
  }
}
