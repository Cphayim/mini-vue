import { h } from '../../lib/mini-vue.esm.js'

export const App = {
  // .vue
  // <template></template>
  // render
  render() {
    return h('div', { id: 'root', class: ['header', 'bg-blue'] }, [
      h('span', { class: ['red'] }, 'Hello, '),
      h('span', { class: ['blue'] }, 'mini-vue!'),
    ])
  },
  setup() {
    // composition api
    return {
      msg: 'mini-vue',
    }
  },
}
