
import { ReplaySubject } from 'rxjs/ReplaySubject'
import { CacheStore, defaultStore } from './defaultCacheStore';

export interface CacheConfig {
  cacheError?: boolean
  key: string | Function
  store?: CacheStore
  ttl?: number,
}

export function ngrxCache({cacheError, key, store, ttl}: CacheConfig) {
  let caches = {} as any
  cacheError = !!cacheError
  const getKey = typeof key === 'string' ? () => key : key
  store = store || defaultStore()

  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const oldFn = descriptor.value

    descriptor.value = function(...args) {
      const k = getKey(...args)
      const cached = store.get(k)
      if (!!cached) {
        return cached
      }

      const sbj = new ReplaySubject()
      const ob = oldFn.bind(this)(...args)
      ob.subscribe(sbj)
      if (!cacheError) {
        sbj.subscribe(null, () => {
          store.remove(k)
        })
      }
      store.set(k, sbj, ttl)
      return sbj
    }
  }
}
