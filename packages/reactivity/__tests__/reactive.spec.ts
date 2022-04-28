import { describe, expect, it } from 'vitest'
import { isReactive, reactive } from '../src/reactive'

describe('reactivity/reactive', () => {
  it('object', () => {
    const original = { foo: 1 }
    const observed = reactive(original)

    expect(observed).not.toBe(original)
    expect(isReactive(observed)).toBe(true)
    expect(observed.foo).toBe(1)

    observed.foo++
    expect(observed.foo).toBe(2)
    expect(original.foo).toBe(2)
  })
})
