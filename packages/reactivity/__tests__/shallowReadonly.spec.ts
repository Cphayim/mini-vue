import { describe, expect, it, vi } from 'vitest'
import { isReadonly, shallowReadonly } from '../src/reactive'

describe('reactivity/readonly', () => {
  it('should not make non-reactive properties reactive', () => {
    const observed = shallowReadonly({ n: { foo: 1 } })
    expect(isReadonly(observed)).toBe(true)
    expect(isReadonly(observed.n)).toBe(false)
  })

  it('should make root level properties readonly', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => void 0)
    const observed = shallowReadonly({ foo: 1 })

    observed.foo = 2
    expect(observed.foo).toBe(1)
    expect(warnSpy).toBeCalled()
    expect(warnSpy.mock.lastCall?.[0]).toMatch(
      'Set operation on key "foo" failed: target is readonly.',
    )
    vi.restoreAllMocks()
  })

  it('should NOT make nested properties readonly', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => void 0)
    const observed = shallowReadonly({ n: { foo: 1 } })

    observed.n.foo = 2
    expect(observed.n.foo).toBe(2)
    expect(warnSpy).not.toBeCalled()
    vi.restoreAllMocks()
  })
})
