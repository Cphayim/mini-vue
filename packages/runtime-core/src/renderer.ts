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
  const el = document.createElement(type)
  console.log(props)
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
