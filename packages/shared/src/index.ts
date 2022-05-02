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

const cacheStringFunction = <T extends (str: string) => string>(fn: T): T => {
  const cache: Record<string, string> = Object.create(null)
  return ((str: string) => {
    const hit = cache[str]
    return hit || (cache[str] = fn(str))
  }) as any
}

const camelizeRE = /[_-](\w)?/g

export const camelize = cacheStringFunction((str: string) =>
  str.replace(camelizeRE, (_, $1: string) => ($1 ? $1.toUpperCase() : '')),
)

const hyphenateRE = /\B([A-Z])/g

export const hyphenate = cacheStringFunction((str: string) =>
  str.replace(hyphenateRE, '-$1').toLowerCase(),
)

export const capitalize = cacheStringFunction(
  (str: string) => str.charAt(0).toUpperCase() + str.slice(1),
)

export const toHandlerKey = cacheStringFunction((str: string) =>
  str ? `on${capitalize(str)}` : '',
)
