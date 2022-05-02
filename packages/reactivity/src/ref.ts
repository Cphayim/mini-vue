import { hasChanged, IfAny, isArray } from '@cphayim/vue-shared'
import { createDep, Dep } from './dep'
import { trackEffect, triggerEffect } from './effect'
import { isProxy, toReactive } from './reactive'

export interface Ref<T = any> {
  value: T
}

class RefImpl<T> {
  private _value: T
  private _rawValue: T

  public readonly __v_isRef = true

  // 每个 RefImpl 维护自己的 dep
  dep: Dep = createDep()

  constructor(value: T) {
    this._rawValue = value
    // 将对象转为 reactive 对象
    this._value = toReactive(value)
  }

  get value() {
    // 收集依赖
    trackEffect(this.dep)
    return this._value
  }

  set value(newValue: T) {
    // 仅值变化时 trigger
    // 使用 _rawValue 和 newValue 进行对比
    if (hasChanged(newValue, this._rawValue)) {
      this._rawValue = newValue
      this._value = toReactive(newValue)
      // 触发依赖
      triggerEffect(this.dep)
    }
  }
}

export function ref<T>(value: T): Ref<T> {
  return new RefImpl(value)
}

export function isRef<T>(r: any): r is Ref<T> {
  return !!(r && r.__v_isRef === true)
}

export function unRef<T>(r: T | Ref<T>): T {
  return isRef(r) ? r.value : r
}

type ShallowUnWrapRef<T> = {
  [K in keyof T]: T[K] extends Ref<infer V> ? V : T[K]
}

export function proxyRefs<T extends object>(objectWithRefs: T): ShallowUnWrapRef<T> {
  return new Proxy<any>(objectWithRefs, {
    get(target, key, receiver) {
      // 如果 target[key] 是一个 ref，取 target[key].value
      return unRef(Reflect.get(target, key, receiver))
    },
    set(target, key, value, receiver) {
      const oldValue = Reflect.get(target, key, receiver)
      // 1. oldValue 是 ref，value 不是 ref，将 value 赋值给 oldValue.value
      // 2. oldValue 是 ref，value 是 ref，使用 value 替换 oldValue
      // 3. oldValue 不是 ref，使用 value 替换 oldValue
      if (isRef(oldValue) && !isRef(value)) {
        oldValue.value = value
        return true
      } else {
        return Reflect.set(target, key, value, receiver)
      }
    },
  })
}

class ObjectRefImpl<T extends object, K extends keyof T> {
  public readonly __v_isRef = true

  constructor(private readonly _object: T, private readonly _key: K) {}

  get value() {
    return this._object[this._key]
  }

  set value(newValue: T[K]) {
    this._object[this._key] = newValue
  }
}

export type ToRef<T> = IfAny<T, Ref<T>, [T] extends [Ref] ? T : Ref<T>>

export function toRef<T extends object, K extends keyof T>(obj: T, key: K): ToRef<T[K]> {
  const value = obj[key]
  return isRef(value) ? value : (new ObjectRefImpl(obj, key) as any)
}

export type ToRefs<T = any> = {
  [K in keyof T]: ToRef<T[K]>
}

// 将一个响应式对象转为 refs 对象
export function toRefs<T extends object>(obj: T): ToRefs<T> {
  // 如果传入的 obj 不是一个响应式对象，发出 warning
  if (!isProxy(obj)) {
    console.warn(`toRefs() expects a reactive object but received a plain one.`)
  }
  const result: any = isArray(obj) ? new Array(obj.length) : {}
  // 对每一个键值执行 toRef
  for (const key in obj) {
    result[key] = toRef(obj, key)
  }
  return result
}
