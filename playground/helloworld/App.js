import { h } from '../../lib/mini-vue.esm.js'
import { Foo } from './Foo.js'

window.self = null

export const App = {
  name: 'App',
  // .vue
  // <template></template>
  // render
  render() {
    window.self = this
    return h(
      'div',
      {
        id: 'root',
        class: ['header', 'bg-blue'],
        onClick() {
          console.log('click')
        },
        onMouseEnter() {
          console.log('enter')
        },
      },
      [h('div', { class: ['red'] }, `Hello, ${this.msg}`), h(Foo, { count: 1 })],
    )
  },
  setup() {
    // composition api
    return {
      msg: 'mini-vue',
    }
  },
}
