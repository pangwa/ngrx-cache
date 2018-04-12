import { expect } from 'chai'
import { Observable } from 'rxjs/Observable'
import 'rxjs/add/observable/from'

import { ngrxCache, defaultStore } from '../src/'

class MyTest {
  @ngrxCache({key: (id: number) => `c_${id}`})
  public getValue(id: number) {
    return Observable.from([{id,}])
  }
}

describe("cache decorator", () => {
  describe("cache", () => {
    const testSvc = new MyTest()
    const store = defaultStore()
    it("should put the cache with the expected value", (done) => {
      testSvc.getValue(3).subscribe(v => {
        expect(v.id).to.equal(3);
        expect(store.get('c_3')).to.exist
        done()
      })
    })

    it("should the correct cache", (done) => {
      testSvc.getValue(3).subscribe(v => {
        expect(v.id).to.equal(3);
        expect(store.get('c_3')).to.exist
        const oldCache = store.get('c_3')
        testSvc.getValue(3)
        const newCache = store.get('c_3')
        expect(newCache).to.be.equal(oldCache)

        testSvc.getValue(4)
        expect(store.get('c_5')).to.be.not.equal(oldCache)
        done()
      })
    })

    it("should reuse the cache", (done) => {
      testSvc.getValue(5).subscribe(v => {
        expect(v.id).to.be.equal(5)
        testSvc.getValue(5).subscribe(v2 => {
          expect(v).to.be.equal(v2)
          done()
        })
      })
    })
  })
})
