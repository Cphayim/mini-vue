import { isArray, isObject, isString } from '@cphayim/vue-shared'
import { createComponentInstance, setupComponent } from './component'

export function render(vnode: any, container: any) {
  // patch
  patch(vnode, container)
}

function patch(vnode: any, container: any) {
  // 判断 vnode 的类型
  if (isString(vnode.type)) {
    // 处理元素
    processElement(vnode, container)
  } else if (isObject(vnode.type)) {
    // 处理组件
    processComponent(vnode, container)
  }
}

// 处理元素
function processElement(vnode: any, container: any) {
  // 分为 init 和 update
  mountElement(vnode, container)
}

function mountElement(vnode: any, container: any) {
  const { type, props, children } = vnode
  // 创建对应标签的元素
  const el = (vnode.el = document.createElement(type))
  // 添加属性
  for (const key in props) {
    const value = props[key]
    el.setAttribute(key, isArray(value) ? value.join(' ') : value)
  }

  // 添加 children
  // 两种情况，string 和 array
  if (isString(children)) {
    // 文本节点直接赋值
    el.textContent = children
  } else {
    // 创建并挂载所有 children
    mountChildren(children, el)
  }

  // 挂载元素
  container.append(el)
}

function mountChildren(children: any, container: any) {
  for (let i = 0; i < children.length; i++) {
    // 为每个子 vnode 调用 patch
    patch(children[i], container)
  }
}

// 处理组件
function processComponent(vnode: any, container: any) {
  // 分为 init 和 update
  mountComponent(vnode, container)
}

function mountComponent(initialVNode: any, container: any) {
  // 创建组件实例
  const instance = createComponentInstance(initialVNode)

  setupComponent(instance)
  setupRenderEffect(instance, initialVNode, container)
}

function setupRenderEffect(instance: any, initialVNode: any, container: any) {
  // 执行 render() 获取虚拟节点树, 将组件代理对象绑定到 this
  const { proxy } = instance
  const subTree = instance.render.call(proxy)

  // 递归调用 patch 处理 subTree
  // vnode -> patch
  // vnode -> element -> mountElement
  patch(subTree, container)

  // 将根元素（可能根节点是组件，那就是它的根元素）的 el 赋值给当前组件节点的 el
  initialVNode.el = subTree.el
}
