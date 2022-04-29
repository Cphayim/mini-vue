import { describe, expect, it } from 'vitest'
import { effect } from '../src/effect'
import { reactive } from '../src/reactive'
import { isRef, ref, unRef } from '../src/ref'

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
})
