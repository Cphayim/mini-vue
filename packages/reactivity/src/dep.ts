import { ReactiveEffect } from './effect'

// 依赖是一组 ReactiveEffect 集合
export type Dep = Set<ReactiveEffect>

export function createDep() {
  return new Set<ReactiveEffect>()
}
