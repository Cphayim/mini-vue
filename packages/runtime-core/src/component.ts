import { shallowReadonly } from '@cphayim/vue-reactivity'
import { isObject } from '@cphayim/vue-shared'
import { initProps } from './componentProps'
import { publicInstanceProxyHandlers } from './componentPublicInstance'

/**
 * 创建组件实例
 */
export function createComponentInstance(vnode: any) {
  // 组件实例，存储了一些组件上必要的属性
  const component = {
    vnode, // 组件虚拟节点
    type: vnode.type,
    proxy: null, // 组件代理对象
    setupState: {}, // setup 返回的状态
    render: null, // 渲染函数
    props: {},
  }
  return component
}

/**
 * 初始化组件
 */
export function setupComponent(instance: any) {
  // 初始化 props
  initProps(instance, instance.vnode.props)
  // TODO initSlots

  // 初始化有状态组件
  setupStatefulComponent(instance)
}

/**
 * 初始化有状态的组件
 */
function setupStatefulComponent(instance: any) {
  // 创建组件代理对象，用于代理组件的状态、$el、$options 等
  instance.proxy = new Proxy({ _: instance }, publicInstanceProxyHandlers)

  // 执行组件上的 setup() 函数，并处理返回内容
  const Component = instance.type
  const { setup } = Component
  if (setup) {
    const setupResult = setup(shallowReadonly(instance.props))
    handleSetupResult(instance, setupResult)
  }
}

/**
 * 处理 setup() 的返回值
 */
function handleSetupResult(instance: any, setupResult: any) {
  // 有两种情况，函数（render 函数） 或 对象（状态）
  // TODO function

  if (isObject(setupResult)) {
    // 将 setup() 返回的状态添加到组件实例上
    instance.setupState = setupResult
  }

  finishComponentSetup(instance)
}

function finishComponentSetup(instance: any) {
  const Component = instance.type

  // 如果 Component 上有 render 函数（用户传入的），则使用
  if (Component.render) {
    instance.render = Component.render
  }
}
