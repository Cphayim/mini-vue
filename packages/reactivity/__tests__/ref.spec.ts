import { describe, expect, it } from 'vitest'
import { effect } from '../src/effect'
import { reactive } from '../src/reactive'
import { isRef, proxyRefs, ref, unRef } from '../src/ref'

describe('reactivity/ref', () => {
  it('should hold a value', () => {
    const a = ref(1)
    expect(a.value).toBe(1)
    a.value = 2
    expect(a.value).toBe(2)
  })

  it('should be reactive', () => {
    const a = ref(1)
    let dummy
    let calls = 0
    effect(() => {
      calls++
      dummy = a.value
    })
    expect(calls).toBe(1)
    expect(dummy).toBe(1)
    a.value = 2
    expect(calls).toBe(2)
    expect(dummy).toBe(2)
    // 相同的值不会 trigger
    a.value = 2
    expect(calls).toBe(2)
  })

  it('should make nested properties reactive', () => {
    const raw = {
      count: 1,
    }
    const a = ref(raw)
    let dummy
    let calls = 0
    effect(() => {
      calls++
      dummy = a.value.count
    })
    expect(calls).toBe(1)
    expect(dummy).toBe(1)
    a.value.count = 2
    expect(calls).toBe(2)
    expect(dummy).toBe(2)
    // 相同的值不会 trigger
    a.value = raw
    expect(calls).toBe(2)
  })

  it('isRef', () => {
    const a = ref(1)
    const b = 2
    const c = reactive({ foo: 3 })
    expect(isRef(a)).toBe(true)
    expect(isRef(b)).toBe(false)
    expect(isRef(c)).toBe(false)
  })

  it('unRef', () => {
    const a = ref(1)
    const b = 2
    const original = { foo: 1 }
    const c = ref(original)
    expect(unRef(a)).toBe(1)
    expect(unRef(b)).toBe(2)
    // equal reactive object
    expect(unRef(c)).toBe(c.value)
  })

  it('proxyRefs', () => {
    const user = {
      name: 'abc',
      age: ref(10),
    }
    const proxyUser = proxyRefs(user)
    expect(user.age.value).toBe(10)
    // 获取 proxy 对象上的 ref 不需要 .value
    expect(proxyUser.age).toBe(10)
    expect(proxyUser.name).toBe('abc')

    proxyUser.age = 20
    // 设置 proxy 对象上的 ref 不需要 .value
    expect(proxyUser.age).toBe(20)
    expect(user.age.value).toBe(20)

    const nVal = ref(30)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    proxyUser.age = nVal
    expect(proxyUser.age).toBe(30)
    // 当新值是一个 ref 时，使用新的 ref 替换旧的 ref
    expect(user.age.value).toBe(30)
    expect(user.age).toBe(nVal)
  })
})
