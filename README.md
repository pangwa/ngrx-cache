# ngrx-cache

A simple in memory cache for rx obserable using typescript decorator. It could be used with angular easily.

### Table of Contents
  - [Quick Start](#quick-start)
  - [Configuration Options](#configuration-options)

### Quick Start
`npm install --save ngrx-cache`

```js
class MyService{
  @ngrxCache({key: (id: number) => `c_${id}`})
  public getValue(id: number) {
    return Observable.from([{id,}])
  }
}

// getValue() result will be cached
myService.getValue(3).subscribe(..)
```
### Configuration Options
  - cacheError?: boolean (default: false)

      Should cache the result in case any of the error or not. 
      By default the value will be removed from the cache if it got any error. Set cacheError to true if you want to cache errors.
  - key: string | Function
     
       The key of the cache. Could be a string or a function.
       The arguments method will be feeded to it if it is a function.
  - store?: CacheStore (default: global cacheStore)

       The cache store instance. By default the global cache store will be used.
  - ttl?: number

       Time to live of the key. Note: ttl is not supported by the defaultStore currently
