import { describe, expect, it } from 'vitest'
import { isProxy, isReactive, reactive, toReactive } from '../src/reactive'

describe('reactivity/reactive', () => {
  it('object', () => {
    const original = { foo: 1 }
    const observed = reactive(original)

    expect(observed).not.toBe(original)
    expect(isReactive(observed)).toBe(true)
    expect(isProxy(observed)).toBe(true)
    expect(observed.foo).toBe(1)

    observed.foo++
    expect(observed.foo).toBe(2)
    expect(original.foo).toBe(2)
  })

  it('nested reactive', () => {
    const original = { nested: { foo: 1 }, array: [{ bar: 2 }] }
    const observed = reactive(original)

    expect(isReactive(observed)).toBe(true)
    expect(isReactive(observed.nested)).toBe(true)
    expect(isReactive(observed.array)).toBe(true)
    expect(isReactive(observed.array[0])).toBe(true)
  })

  it('toReactive', () => {
    const num = toReactive(1)
    const obj = toReactive({ foo: 1 })
    expect(isReactive(num)).toBe(false)
    expect(isReactive(obj)).toBe(true)
  })
})
