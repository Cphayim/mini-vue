import { mutableHandlers, readonlyHandlers } from './baseHandlers'

export const enum ReactiveFlags {
  IS_REACTIVE = '__v_isReactive',
  IS_READONLY = '__v_isReadonly',
}

export interface Target {
  [ReactiveFlags.IS_REACTIVE]: boolean
  [ReactiveFlags.IS_READONLY]: boolean
}

/**
 * 创建原始对象的响应式副本
 */
export function reactive<T extends object>(target: T) {
  return createReactiveObject<T>(target, mutableHandlers)
}

/**
 * 创建原始对象的只读副本
 */
export function readonly<T extends object>(target: T) {
  return createReactiveObject<T>(target, readonlyHandlers)
}

function createReactiveObject<T extends object>(target: T, baseHandlers: ProxyHandler<T>) {
  return new Proxy(target, baseHandlers)
}

export function isReactive(value: unknown): boolean {
  return !!(value && (value as Target)[ReactiveFlags.IS_REACTIVE])
}

export function isReadonly(value: unknown): boolean {
  return !!(value && (value as Target)[ReactiveFlags.IS_READONLY])
}
