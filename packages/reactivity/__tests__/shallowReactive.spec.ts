import { describe, expect, it } from 'vitest'
import { isReactive, shallowReactive } from '../src/reactive'

describe('reactivity/readonly', () => {
  it('should not make non-reactive properties reactive', () => {
    const observed = shallowReactive({ n: { foo: 1 } })
    expect(isReactive(observed)).toBe(true)
    expect(isReactive(observed.n)).toBe(false)
  })
})
