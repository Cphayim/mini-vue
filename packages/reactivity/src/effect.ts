import { extend } from '@cphayim/vue-shared'
import { Dep } from './dep'

// {target -> key -> dep}
// KeyToDepMap 维护 target 中 key 键对应的 Dep
// Dep 是订阅者的集合
type KeyToDepMap = Map<any, Dep>
const targetMap = new WeakMap<any, KeyToDepMap>()

let activeEffect: ReactiveEffect | undefined
let shouldTrack = false

type EffectScheduler = (...args: any[]) => any

export class ReactiveEffect<T = any> {
  active = true
  deps: Dep[] = []

  onStop?: () => void

  constructor(public fn: () => T, public scheduler?: EffectScheduler) {}

  run() {
    // 不进行依赖收集
    if (!this.active) {
      return this.fn()
    }

    try {
      // 执行的时候给全局的 activeEffect 赋值
      // 当 fn() 中的响应式对象 get track 时能够获取到当前的 effect
      activeEffect = this
      shouldTrack = true
      // 执行并进行依赖收集
      return this.fn()
    } finally {
      shouldTrack = false
      // 重置 activeEffect
      activeEffect = undefined
    }
  }

  stop() {
    if (this.active) {
      // 从 deps 中移除当前 effect
      cleanupEffect(this)
      if (this.onStop) {
        this.onStop()
      }
      this.active = false
    }
  }
}

// 将 effect 从关联的所有 dep 中移除
function cleanupEffect(effect: ReactiveEffect) {
  if (effect.deps.length) {
    for (const dep of effect.deps) {
      dep.delete(effect)
    }
    effect.deps.length = 0
  }
}

interface ReactiveEffectOptions {
  scheduler?: EffectScheduler
  onStop?: () => void
}
interface ReactiveEffectRunner<T = any> {
  (): T
  effect: ReactiveEffect
}

export function effect<T>(fn: () => T, options?: ReactiveEffectOptions): ReactiveEffectRunner<T> {
  const _effect = new ReactiveEffect(fn)
  extend(_effect, options)
  // 执行一次
  _effect.run()

  const runner = _effect.run.bind(_effect) as ReactiveEffectRunner<T>
  runner.effect = _effect
  return runner
}

export function stop(runner: ReactiveEffectRunner) {
  runner.effect.stop()
}

// 跟踪：订阅
export function track<T>(target: T, key: string | symbol) {
  if (!shouldTrack || !activeEffect) return

  let depsMap = targetMap.get(target)
  if (!depsMap) {
    depsMap = new Map()
    targetMap.set(target, depsMap)
  }

  let dep = depsMap.get(key)
  if (!dep) {
    dep = new Set()
    depsMap.set(key, dep)
  }

  trackEffect(dep)
}

export function trackEffect(dep: Dep) {
  if (!shouldTrack || !activeEffect) return

  if (dep.has(activeEffect)) return
  // 将当前的 effect 添加到订阅中
  dep.add(activeEffect)
  // 反向添加 dep 到当前 effect 的 deps 中，方便 stop 时移除 effect
  activeEffect.deps.push(dep)
}

// 触发：发布
export function trigger<T>(target: T, key: string | symbol) {
  const depsMap = targetMap.get(target)
  if (!depsMap) return

  const dep = depsMap.get(key)
  if (!dep) return

  triggerEffect(dep)
}

export function triggerEffect(dep: Dep) {
  // 执行所有订阅者的回调
  for (const effect of dep) {
    // 如果 effect 存在 scheduler，则执行 scheduler
    if (effect.scheduler) {
      effect.scheduler()
    } else {
      effect.run()
    }
  }
}
