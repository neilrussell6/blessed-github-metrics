const { assert } = require ('chai')
const parametrize = require ('js-parametrize')

const SUT = require ('./selector')
const Settings = require ('../../config/settings')

describe ('modules/PullRequests/selector', () => {
  describe ('pullRequestEvents', () => {
    it ('should return first pull events directly from state as is', () => {
      const state = {
        pullRequestEvents: [
          'STATE PULL REQUEST 1 EVENTS',
          'STATE PULL REQUEST 2 EVENTS',
        ],
      }
      assert.equal (SUT (state).pullRequestEvents, 'STATE PULL REQUEST 1 EVENTS')
    })
  })

  describe ('isFocused', () => {
    parametrize ([
      [{ app: { selectedSectionIndex: 0 } }, false],
      [{ app: { selectedSectionIndex: 1 } }, true],
    ], (state, expected) => {
      it ('should return isFocused as expected', () => {
        assert.equal (SUT (state).isFocused, expected)
      })
    })
  })

  describe ('columnsConfig', () => {
    it ('should return columnsConfig from app settings', () => {
      const state = {}
      assert.deepEqual (SUT (state).columnsConfig, Settings.pullRequestEvents.tableColumnsConfig)
    })
  })
})
