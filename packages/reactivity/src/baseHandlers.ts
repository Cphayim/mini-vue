import { track, trigger } from './effect'
import { ReactiveFlags } from './reactive'

const get = createGetter()
const readonlyGet = createGetter(true)

function createGetter<T extends object>(isReadonly = false) {
  return function (target: T, key: string | symbol, receiver: any) {
    // 处理 isReactive, isReadonly 函数访问的属性
    if (key === ReactiveFlags.IS_REACTIVE) {
      return !isReadonly
    } else if (key === ReactiveFlags.IS_READONLY) {
      return isReadonly
    }

    const value = Reflect.get(target, key, receiver)
    if (!isReadonly) {
      track(target, key)
    }
    return value
  }
}

const set = createSetter()

function createSetter<T extends object>() {
  return function (target: T, key: string | symbol, receiver: any) {
    const result = Reflect.set(target, key, receiver)
    trigger(target, key)
    return result
  }
}

export const mutableHandlers: ProxyHandler<object> = {
  get,
  set,
}

export const readonlyHandlers: ProxyHandler<object> = {
  get: readonlyGet,
  set(_, key) {
    // readonly 对象不可以修改值
    console.warn(`Set operation on key "${String(key)}" failed: target is readonly.`)
    return true
  },
}
