import { describe, expect, it, vi } from 'vitest'
import { isProxy, isReadonly, readonly } from '../src/reactive'

describe('reactivity/readonly', () => {
  it('object', () => {
    const original = { foo: 1 }
    const observed = readonly(original)

    expect(observed).not.toBe(original)
    expect(isReadonly(observed)).toBe(true)
    expect(isProxy(observed)).toBe(true)
    expect(observed.foo).toBe(1)
  })

  it('nested readonly', () => {
    const original = { nested: { foo: 1 }, array: [{ bar: 2 }] }
    const observed = readonly(original)

    expect(isReadonly(observed)).toBe(true)
    expect(isReadonly(observed.nested)).toBe(true)
    expect(isReadonly(observed.array)).toBe(true)
    expect(isReadonly(observed.array[0])).toBe(true)
  })

  it('should call console.warn when set', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => void 0)
    const qux = Symbol('qux')
    const observed = readonly({ foo: 1, [qux]: 3 })

    observed.foo++
    expect(observed.foo).toBe(1)
    expect(warnSpy).toBeCalled()
    expect(warnSpy).toBeCalledWith('Set operation on key "foo" failed: target is readonly.')

    warnSpy.mockClear()

    observed[qux] = 4
    expect(observed[qux]).toBe(3)
    expect(warnSpy).toBeCalled()
    expect(warnSpy).toBeCalledWith('Set operation on key "Symbol(qux)" failed: target is readonly.')

    vi.restoreAllMocks()
  })
})
