import { extend } from '@cphayim/vue-shared'

type PublicPropertiesMap = Record<string, (i: any) => any>
const publicPropertiesMap: PublicPropertiesMap = extend(Object.create(null), {
  $el: (i: any) => i.vnode.el,
})

export const publicInstanceProxyHandlers = {
  get({ _: instance }: any, key: string) {
    // 尝试在 setupState 中查找属性
    const { setupState } = instance
    if (key in setupState) {
      return setupState[key]
    }

    // 获取 $el, $options 等属性
    const publicGetter = publicPropertiesMap[key]
    if (publicGetter) {
      return publicGetter(instance)
    }
  },
}
