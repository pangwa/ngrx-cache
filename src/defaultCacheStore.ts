import { ReplaySubject } from 'rxjs/ReplaySubject'

export interface CacheStore {
  set<T>(key: string, v: ReplaySubject<T>, ttl?: number)
  get<T>(key: string): ReplaySubject<T> | null
  remove(key: string)
}

class DefaultCacheStore implements CacheStore {
  public set<T>(key: string, v: ReplaySubject<T>, ttl?: number) {
    this.caches[key] = v
  }

  public get<T>(key: string): ReplaySubject<T> | null {
    if (key in this.caches) {
      return this.caches[key]
    }
    return null
  }

  public remove(key: string) {
    delete this.caches[key]
  }

  private caches: any = {}
}

let store: CacheStore = null

export function defaultStore() {
  if (store == null) {
    store = new DefaultCacheStore()
  }
  return store
}
