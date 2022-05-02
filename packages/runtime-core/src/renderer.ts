import { isArray, ShapeFlags } from '@cphayim/vue-shared'
import { createComponentInstance, setupComponent } from './component'

export function render(vnode: any, container: any) {
  // patch
  patch(vnode, container)
}

function patch(vnode: any, container: any) {
  const { shapeFlag } = vnode
  // 通过 shapeFlag 判断是元素还是组件
  // 例如 0b1001 & 0b1 = 0b1 -> 这个节点是元素
  // 0b1000 & 0b1 = 0b0 -> 这个节点不是元素
  if (shapeFlag & ShapeFlags.ELEMENT) {
    // 处理元素
    processElement(vnode, container)
  } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
    // 处理组件
    processComponent(vnode, container)
  }
}

// 处理元素
function processElement(vnode: any, container: any) {
  // 分为 init 和 update
  mountElement(vnode, container)
  // TODO update
}

// 挂载元素
function mountElement(vnode: any, container: any) {
  const { type, props, children, shapeFlag } = vnode
  // 1.创建对应标签的元素
  const el = (vnode.el = document.createElement(type))

  // 2.添加 children
  if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
    el.textContent = children
  } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
    // 创建并挂载所有 children
    mountChildren(children, el)
  }

  // 3.添加属性和事件
  if (props) {
    for (const key in props) {
      const value = props[key]

      const isOn = (key: string) => /^on[A-Z]/.test(key)

      if (isOn(key)) {
        const eventName = key.slice(2).toLowerCase()
        // 事件
        el.addEventListener(eventName, value)
      } else {
        // 属性
        el.setAttribute(key, isArray(value) ? value.join(' ') : value)
      }
    }
  }

  // 4.挂载元素
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
