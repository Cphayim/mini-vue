import { ReactiveEffect } from './effect'
import { Ref } from './ref'

export interface ComputedRef<T = any> extends Ref<T> {
  readonly effect: ReactiveEffect<T>
}
export type ComputedGetter<T> = (...ags: any[]) => T

export class ComputedRefImpl<T> {
  // 缓存值
  private _value!: T
  // 标记是否需要重新计算
  private _dirty = true
  // 通过 effect 收集依赖
  public readonly effect: ReactiveEffect<T>

  public readonly __v_isRef = true

  constructor(getter: ComputedGetter<T>) {
    // 给 effect 传入一个 scheduler，当依赖 trigger 时
    // scheduler 被调用，将 _dirty 设置 为 true
    // 在下一次获取 value 时将重新计算
    //? 需要注意的是，我们在这使用的是 ReactiveEffect 类而不是 effect 函数
    //? 因此不会立即调用 getter，需要等到用户第一次访问 .value 时才会计算（lazy）
    this.effect = new ReactiveEffect(getter, () => {
      if (!this._dirty) {
        this._dirty = true
      }
    })
  }

  get value() {
    // 仅 _dirty 为 true 时重新计算
    if (this._dirty) {
      this._dirty = false
      this._value = this.effect.run()
    }
    return this._value
  }
}

export function computed<T>(getter: ComputedGetter<T>): ComputedRef<T> {
  return new ComputedRefImpl<T>(getter)
}
