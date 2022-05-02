import { h } from '../../lib/mini-vue.esm.js'

export const Foo = {
  setup(props, { emit }) {
    const emitAdd = () => {
      emit('addFoo', 1, 2, 3)
    }

    return { emitAdd }
  },
  render() {
    const btn = h('button', { onClick: this.emitAdd }, 'emitAdd')
    const p = h('p', {}, 'foo')
    return h('div', {}, [p, btn])
  },
}
