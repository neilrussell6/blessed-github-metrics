const { assert } = require ('chai')
const parametrize = require ('js-parametrize')

const SUT = require ('./selector')
const Settings = require ('../../config/settings')

describe ('modules/PullRequests/selector', () => {
  describe ('pullRequests', () => {
    it ('should return pullRequests directly from state as is', () => {
      const state = {
        pullRequests: 'STATE PULL REQUESTS',
      }
      assert.equal (SUT (state).pullRequests, 'STATE PULL REQUESTS')
    })
  })

  describe ('isFocused', () => {
    parametrize ([
      [{ app: { selectedSectionIndex: 0 } }, true],
      [{ app: { selectedSectionIndex: 1 } }, false],
    ], (state, expected) => {
      it ('should return isFocused as expected', () => {
        assert.equal (SUT (state).isFocused, expected)
      })
    })
  })

  describe ('columnsConfig', () => {
    it ('should return columnsConfig from app settings', () => {
      const state = {}
      assert.deepEqual (SUT (state).columnsConfig, Settings.pullRequests.tableColumnsConfig)
    })
  })
})
