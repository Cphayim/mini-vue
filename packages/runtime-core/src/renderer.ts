import { createComponentInstance, setupComponent } from './component'

export function render(vnode: any, container: any) {
  // patch
  patch(vnode, container)
}

function patch(vnode: any, container: any) {
  // TODO 判断 vnode 的类型
  // 去处理组件
  processComponent(vnode, container)
}

// 处理组件
function processComponent(vnode: any, container: any) {
  mountComponent(vnode, container)
}

function mountComponent(vnode: any, container: any) {
  // 创建组件实例
  const instance = createComponentInstance(vnode)

  setupComponent(instance)

  setupRenderEffect(instance, container)
}

function setupRenderEffect(instance: any, container: any) {
  // 虚拟节点树
  const subTree = instance.render()

  // vnode -> patch
  // vnode -> element -> mountElement
  patch(subTree, container)
}
