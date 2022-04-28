import { extend, isObject } from '@cphayim/vue-shared'
import { track, trigger } from './effect'
import { reactive, ReactiveFlags, readonly } from './reactive'

const get = createGetter()
const shallowGet = createGetter(false, true)
const readonlyGet = createGetter(true)
const shallowReadonlyGet = createGetter(true, true)

function createGetter<T extends object>(isReadonly = false, shallow = false) {
  return function (target: T, key: string | symbol, receiver: any) {
    // 处理 isReactive, isReadonly 函数访问的属性
    if (key === ReactiveFlags.IS_REACTIVE) {
      return !isReadonly
    } else if (key === ReactiveFlags.IS_READONLY) {
      return isReadonly
    }

    const value = Reflect.get(target, key, receiver)

    // 非 readonly 时收集依赖
    if (!isReadonly) {
      track(target, key)
    }

    if (shallow) {
      return value
    }

    // 当 value 是 object 时，返回对应的响应式对象
    if (isObject(value)) {
      return isReadonly ? readonly(value) : reactive(value)
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

export const shallowReactiveHandlers: ProxyHandler<object> = extend({}, mutableHandlers, {
  get: shallowGet,
})

export const shallowReadonlyHandlers: ProxyHandler<object> = extend({}, readonlyHandlers, {
  get: shallowReadonlyGet,
})
