export * from './shapeFlags'
export * from './typeUtils'

export const extend = Object.assign

export const isObject = (val: unknown): val is Record<any, any> => {
  return val !== null && typeof val === 'object'
}
export const isString = (val: unknown): val is string => typeof val === 'string'
export const isArray = Array.isArray
export const isFunction = (val: unknown): val is (...args: any[]) => any =>
  typeof val === 'function'

export const hasOwn = (target: unknown, key: string | symbol): boolean =>
  Object.prototype.hasOwnProperty.call(target, key)

export const hasChanged = (nVal: unknown, oVal: unknown): boolean => {
  return !Object.is(nVal, oVal)
}
