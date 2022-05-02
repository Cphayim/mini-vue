import { h } from '../../lib/mini-vue.esm.js'

window.self = null

export const App = {
  // .vue
  // <template></template>
  // render
  render() {
    window.self = this
    return h('div', { id: 'root', class: ['header', 'bg-blue'] }, [
      h('span', { class: ['red'] }, 'Hello, '),
      h('span', { class: ['blue'] }, `${this.msg}!`),
    ])
  },
  setup() {
    // composition api
    return {
      msg: 'mini-vue',
    }
  },
}
