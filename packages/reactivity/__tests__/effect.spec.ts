import { describe, expect, it, vi } from 'vitest'
import { effect, stop } from '../src/effect'
import { reactive } from '../src/reactive'

describe('reactivity/effect', () => {
  it('should run the passed function once (wrapped by a effect)', () => {
    // 传入的函数会被立即执行一次
    const fn = vi.fn()
    effect(fn)
    expect(fn).toBeCalled()
  })

  it('should observe basic properties', () => {
    // 能够观察属性变化再次执行传入的函数
    let dummy
    const counter = reactive({ num: 0 })
    effect(() => (dummy = counter.num))
    expect(dummy).toBe(0)
    counter.num = 3
    expect(dummy).toBe(3)
    counter.num = 10
    expect(dummy).toBe(10)
  })

  it('should observe multiple properties', () => {
    // 能够观察多个属性的变化
    let dummy
    const counter = reactive({ num1: 0, num2: 0 })
    effect(() => (dummy = counter.num1 + counter.num2))
    expect(dummy).toBe(0)
    counter.num1 = 5
    expect(dummy).toBe(5)
    counter.num1 = counter.num2 = 30
    expect(dummy).toBe(60)
  })

  it('should handle multiple effects', () => {
    // 能够处理多个 effect
    let dummy1, dummy2
    const counter = reactive({ num: 0 })
    effect(() => (dummy1 = counter.num * 3))
    effect(() => (dummy2 = counter.num * 6))
    expect(dummy1).toBe(0)
    expect(dummy2).toBe(0)
    counter.num = 5
    expect(dummy1).toBe(15)
    expect(dummy2).toBe(30)
  })

  it.todo('should handle nested properties', () => {
    // 能够处理嵌套属性
    let dummy
    const counter = reactive({ nested: { num: 0 } })
    effect(() => (dummy = counter.nested.num))
    expect(dummy).toBe(0)
    counter.nested.num = 3
    expect(dummy).toBe(3)
  })

  it('should return runner when call effect', () => {
    // effect(fn) 将返回一个 runner
    let foo = 10
    const runner = effect(() => {
      foo++
      return 'foo'
    })

    expect(foo).toBe(11)
    // 手动执行 runner 可以再次调用 fn，并得到返回值
    const r = runner()
    expect(foo).toBe(12)
    expect(r).toBe('foo')
  })

  it('should exec scheduler', () => {
    // 1. 通过 effect(fn, { scheduler }) 的第二个参数传递一个 scheduler 函数
    // 2. effect 第一次执行时，将执行 fn
    // 3. 当响应式对象 set 触发 trigger 执行依赖函数时将执行 scheduler 而不是 fn
    // 4. 如果手动执行 effect 返回的 runner，则执行 fn
    let dummy
    let run: any
    const scheduler = vi.fn(() => {
      run = runner
    })
    const obj = reactive({ foo: 1 })
    const runner = effect(
      () => {
        dummy = obj.foo
      },
      {
        scheduler,
      },
    )
    expect(scheduler).not.toBeCalled()
    expect(dummy).toBe(1)
    // should be called on first trigger
    obj.foo++
    expect(scheduler).toBeCalledTimes(1)
    // should not run yet
    expect(dummy).toBe(1)
    // manually run
    run()
    // should have run
    expect(dummy).toBe(2)
  })

  it('stop', () => {
    let dummy
    const obj = reactive({ foo: 1 })
    const runner = effect(() => {
      dummy = obj.foo
    })
    obj.foo = 2
    expect(dummy).toBe(2)
    // 当调用 stop 时，将停止对依赖的跟踪
    stop(runner)
    obj.foo = 3
    expect(dummy).toBe(2)

    // 停止的 effect 应该仍然可以手动调用
    runner()
    expect(dummy).toBe(3)
    // 但无法再次启用依赖跟踪
    obj.foo = 5
    expect(dummy).toBe(3)
  })

  it('onStop', () => {
    // 传递的 onStop 函数，在 stop 执行后将被调用
    const obj = reactive({ foo: 1 })
    const onStop = vi.fn()
    let dummy
    const runner = effect(() => (dummy = obj.foo), {
      onStop,
    })
    expect(dummy).toBe(1)
    stop(runner)
    expect(onStop).toBeCalledTimes(1)
  })
})
