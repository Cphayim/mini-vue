import { describe, expect, it, vi } from 'vitest'
import { effect } from '../src/effect'
import { reactive } from '../src/reactive'
import { isRef, proxyRefs, ref, toRefs, unRef } from '../src/ref'

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

  it('toRefs', () => {
    const observed = reactive({ name: 'abc', age: 18 })
    const { name, age } = toRefs(observed)

    // 解构并保持响应
    expect(name.value).toBe('abc')
    expect(age.value).toBe(18)

    observed.age = 19
    expect(age.value).toBe(19)
    age.value = 20
    expect(observed.age).toBe(20)

    // 传入非响应式对象将得到警告
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => void 0)
    const plain = { name: 'def', age: 18 }
    const { name: name2, age: age2 } = toRefs(plain)

    expect(warnSpy).toBeCalled()
    expect(warnSpy).toBeCalledWith(`toRefs() expects a reactive object but received a plain one.`)
    expect(name2.value).toBe('def')
    expect(age2.value).toBe(18)

    plain.age = 19
    expect(age2.value).toBe(19)
    age2.value = 20
    expect(plain.age).toBe(20)
    vi.restoreAllMocks()
  })
})
