import { describe, expect, it, vi } from 'vitest'
import { isReadonly, readonly } from '../src/reactive'

describe('reactivity/readonly', () => {
  it('object', () => {
    const original = { foo: 1 }
    const observed = readonly(original)

    expect(observed).not.toBe(original)
    expect(isReadonly(observed)).toBe(true)
    expect(observed.foo).toBe(1)
  })

  it('should call console.warn when set', () => {
    const warnSpy = vi.spyOn(console, 'warn')
    const observed = readonly({ foo: 1 })
    observed.foo++
    expect(warnSpy).toBeCalled()
    expect(observed.foo).toBe(1)
    vi.restoreAllMocks()
  })
})
