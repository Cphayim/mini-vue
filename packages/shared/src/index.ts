export const extend = Object.assign

export const isObject = (val: unknown): val is Record<any, any> => {
  return val !== null && typeof val === 'object'
}
export const isString = (val: unknown): val is string => typeof val === 'string'
export const isArray = Array.isArray

export const hasChanged = (nVal: unknown, oVal: unknown): boolean => {
  return !Object.is(nVal, oVal)
}
