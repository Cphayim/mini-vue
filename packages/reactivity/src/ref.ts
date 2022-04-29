import { hasChanged } from '@cphayim/vue-shared'
import { createDep, Dep } from './dep'
import { trackEffect, triggerEffect } from './effect'
import { toReactive } from './reactive'

export interface Ref<T = any> {
  value: T
}

class RefImpl<T> {
  private _value: T
  private _rawValue: T

  // 每个 RefImpl 维护自己的 dep
  dep: Dep = createDep()

  constructor(value: T) {
    this._rawValue = value
    // 将对象转为 reactive 对象
    this._value = toReactive(value)
  }

  get value() {
    trackEffect(this.dep)
    return this._value
  }

  set value(newValue: T) {
    // 仅变化时 trigger
    // 使用 _rawValue 和 newValue 对比
    if (hasChanged(newValue, this._rawValue)) {
      this._rawValue = newValue
      this._value = toReactive(newValue)
      triggerEffect(this.dep)
    }
  }
}

export function ref<T>(value: T): Ref<T> {
  return new RefImpl(value)
}
