import { describe, expect, it, vi } from 'vitest'
import { computed } from '../src/computed'
import { reactive } from '../src/reactive'

describe('reactivity/computed', () => {
  it('happy path', () => {
    const user = reactive({ age: 1 })
    const age = computed(() => {
      return user.age
    })
    expect(age.value).toBe(1)
  })

  it('should compute lazily', () => {
    const value = reactive({
      foo: 1,
    })
    const getter = vi.fn(() => {
      return value.foo
    })
    const cValue = computed(getter)

    // lazy，首次使用 cValue.value 之前不会调用 getter
    expect(getter).not.toBeCalled()

    expect(cValue.value).toBe(1)
    expect(getter).toBeCalledTimes(1)

    expect(cValue.value).toBe(1)
    // cached，不会再执行 getter
    expect(getter).toBeCalledTimes(1)

    // 更新依赖
    value.foo = 2
    // 此时 trigger 调用的是 effect.scheduler，getter 没有执行
    expect(getter).toBeCalledTimes(1)
    // 重新计算值
    expect(cValue.value).toBe(2)
    expect(getter).toBeCalledTimes(2)
  })
})
