import { extend, hasOwn } from '@cphayim/vue-shared'

type PublicPropertiesMap = Record<string, (i: any) => any>
const publicPropertiesMap: PublicPropertiesMap = extend(Object.create(null), {
  $el: (i: any) => i.vnode.el,
})

export const publicInstanceProxyHandlers = {
  get({ _: instance }: any, key: string) {
    // 尝试在 setupState 中查找属性
    const { setupState, props } = instance

    if (hasOwn(setupState, key)) {
      return setupState[key]
    } else if (hasOwn(props, key)) {
      return props[key]
    }

    // 获取 $el, $options 等属性
    const publicGetter = publicPropertiesMap[key]
    if (publicGetter) {
      return publicGetter(instance)
    }
  },
}
