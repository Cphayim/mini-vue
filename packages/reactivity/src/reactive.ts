import { isObject } from '@cy-pg/vue-shared'
import { track, trigger } from './effect'

export function reactive<T extends object>(raw: T) {
  // 对于原始类型，直接返回 raw
  if (!isObject(raw)) return raw

  return new Proxy(raw, {
    get(target, key, receiver) {
      const value = Reflect.get(target, key, receiver)
      track(target, key)
      return value
    },
    set(target, key, value, receiver) {
      const result = Reflect.set(target, key, value, receiver)
      trigger(target, key)
      return result
    },
  })
}
