import { h } from '../../lib/mini-vue.esm.js'

export const App = {
  // .vue
  // <template></template>
  // render
  render() {
    return h('div', `Hello, ${this.msg}!`)
  },
  setup() {
    // composition api
    return {
      msg: 'mini-vue',
    }
  },
}
