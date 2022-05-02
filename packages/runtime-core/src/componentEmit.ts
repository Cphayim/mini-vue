import { camelize, toHandlerKey } from '@cphayim/vue-shared'

export function emit(instance: any, event: string, ...args: any[]) {
  const { props } = instance

  const handlerName = toHandlerKey(camelize(event))
  const handler = props[handlerName]
  if (handler) {
    handler(...args)
  }
}
