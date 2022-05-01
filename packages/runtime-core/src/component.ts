import { isObject } from '@cphayim/vue-shared'

export function createComponentInstance(vnode: any) {
  // 组件实例，存储了一些组件上必要的属性
  const component = {
    vnode,
    type: vnode.type,
  }
  return component
}

export function setupComponent(instance: any) {
  // TODO
  // initProps
  // initSlots

  // 初始化有状态组件
  setupStatefulComponent(instance)
}

function setupStatefulComponent(instance: any) {
  const Component = instance.type

  const { setup } = Component

  // 调用 setup 拿到返回值
  if (setup) {
    // object or function
    const setupResult = setup()
    handleSetupResult(instance, setupResult)
  }
}

// 处理 setup() 返回值
function handleSetupResult(instance: any, setupResult: any) {
  // function object
  // TODO function

  if (isObject(setupResult)) {
    // 将 setup() 返回的状态添加到组件实例上
    instance.setupState = setupResult
  }

  finishComponentSetup(instance)
}

function finishComponentSetup(instance: any) {
  const Component = instance.type

  // 如果 Component 选项上有 render 函数，则使用
  if (Component.render) {
    instance.render = Component.render
  }
}
