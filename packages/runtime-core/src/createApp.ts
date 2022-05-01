import { createVNode } from './vnode'
import { render } from './renderer'

export function createApp(rootComponent: any) {
  return {
    // 接收一个根容器
    mount(rootContainer: any) {
      // 先将 component 转换成 vnode
      // 所有的逻辑操作都会基于 vnode 做处理
      const vnode = createVNode(rootComponent)

      render(vnode, rootContainer)
    },
  }
}
