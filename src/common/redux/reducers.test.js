const R = require ('ramda')
const { assert } = require ('chai')
const parametrize = require ('js-parametrize')

const SUT = require ('./reducers')

describe ('common/redux/reducers', () => {
  describe ('overwriteStateWithPayload', () => {
    parametrize ([
      ['EXISTING', 'NEW', 'NEW'],
      [['a', 'b'], ['c'], ['c']],
      [{ a: 'A' }, { b: 'B' }, { b: 'B' }],
    ], (state, payload, expected) => {
      it ('should overwrite state with provided payload', () => {
        const action = { type: 'NA', payload }
        const result = SUT.overwriteStateWithPayload (state, action)
        assert.deepEqual (result, expected)
      })
    })

    parametrize ([
      [['a'], { data: 'x', index: 0 }, ['a']],
      [['a', 'b'], { data: 'x', index: 0 }, ['a', 'b']],
      [['a', 'b'], { data: 'x', index: 1 }, ['a', 'b']],
      [['a', 'b', 'c'], { data: 'x', index: 1 }, ['a', 'b', 'c']],
    ], (state, payload, expected) => {
      it ('should not update item at provided index if predicate fails', () => {
        const action = { type: 'NA', payload }
        const result = SUT.updateItemByIndexWith (R.F) (state, action)
        assert.deepEqual (result, expected)
      })
    })
  })
})
