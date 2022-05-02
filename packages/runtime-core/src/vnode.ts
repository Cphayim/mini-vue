import { isFunction, isObject, isString, ShapeFlags } from '@cphayim/vue-shared'

export function createVNode(type: any, props?: any, children?: any) {
  // 记录 vnode 的 shapeFlag
  let shapeFlag = isString(type)
    ? ShapeFlags.ELEMENT
    : isObject(type)
    ? ShapeFlags.STATEFUL_COMPONENT
    : isFunction(type)
    ? ShapeFlags.FUNCTIONAL_COMPONENT
    : 0

  // 将 children 的 shapeFlag 也记录到一起
  if (children) {
    // 例如 上面的 shapeFlag 是 ShapeFlags.Element -> 0b1
    // children 是 ShapeFlags.TEXT_CHILDREN -> 0b100
    // 0b1 | 0b100 = 0b101
    shapeFlag |= isString(children) ? ShapeFlags.TEXT_CHILDREN : ShapeFlags.ARRAY_CHILDREN
  }

  return {
    type,
    props,
    children,
    shapeFlag,
    el: null,
  }
}
