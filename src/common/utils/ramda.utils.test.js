const { assert } = require ('chai')
const R = require ('ramda')

const SUT = require ('./ramda.utils')

describe ('common/utils/ramda.utils', () => {
  describe ('pickAll', () => {
    it ('should pick provided keys from object return null for those not found', () => {
      const source = { a: 'A', b: 'B', c: 'C' }
      const result = SUT.pickAll (['a', 'b', 'd'], source)
      assert.deepEqual (result, { a: 'A', b: 'B', d: null })
    })
  })

  describe ('assocSpec', () => {
    it ('should add props to obj based of obj', () => {
      const source = { a: 'A', b: 'B' }
      const result = SUT.assocSpec ({
        c: x => x.a + x.b,
      }, source)
      assert.deepEqual (result, { a: 'A', b: 'B', c: 'AB' })
    })
  })
})
