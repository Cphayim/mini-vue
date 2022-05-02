import { h } from '../../lib/mini-vue.esm.js'

export const Foo = {
  setup(props) {
    // shallowReadonly
    props.count++
    console.log(props)
  },
  render() {
    return h('div', {}, 'foo: ' + this.count)
  },
}
