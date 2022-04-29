import { isObject } from '@cphayim/vue-shared'
import {
  mutableHandlers,
  readonlyHandlers,
  shallowReactiveHandlers,
  shallowReadonlyHandlers,
} from './baseHandlers'

export const enum ReactiveFlags {
  IS_REACTIVE = '__v_isReactive',
  IS_READONLY = '__v_isReadonly',
}

export interface Target {
  [ReactiveFlags.IS_REACTIVE]: boolean
  [ReactiveFlags.IS_READONLY]: boolean
}

export function reactive<T extends object>(target: T) {
  return createReactiveObject<T>(target, mutableHandlers)
}

export function shallowReactive<T extends object>(target: T) {
  return createReactiveObject<T>(target, shallowReactiveHandlers)
}

export function readonly<T extends object>(target: T) {
  return createReactiveObject<T>(target, readonlyHandlers)
}

export function shallowReadonly<T extends object>(target: T) {
  return createReactiveObject<T>(target, shallowReadonlyHandlers)
}

function createReactiveObject<T extends object>(target: T, baseHandlers: ProxyHandler<T>) {
  return new Proxy(target, baseHandlers)
}

export function isReactive(value: unknown): boolean {
  return !!(value && (value as Target)[ReactiveFlags.IS_REACTIVE])
}

export function isProxy(value: unknown): boolean {
  return isReactive(value) || isReadonly(value)
}

export function isReadonly(value: unknown): boolean {
  return !!(value && (value as Target)[ReactiveFlags.IS_READONLY])
}

export function toReactive<T>(value: T): T {
  return isObject(value) ? reactive(value as Record<any, any>) : value
}

export function toReadonly<T>(value: T): T {
  return isObject(value) ? readonly(value as Record<any, any>) : value
}
