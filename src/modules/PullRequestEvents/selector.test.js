const { assert } = require ('chai')
const parametrize = require ('js-parametrize')

const SUT = require ('./selector')
const Settings = require ('../../config/settings')

describe ('modules/PullRequests/selector', () => {
  describe ('pullRequestEvents', () => {
    it ('should return pull request events from state as is', () => {
      const state = {
        pullRequestEvents: [
          { id: 'PULL REQUEST 1 EVENT 1' },
        ],
      }
      assert.deepEqual (SUT (state).pullRequestEvents, state.pullRequestEvents)
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
