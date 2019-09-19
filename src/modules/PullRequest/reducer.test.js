const { assert } = require ('chai')

const SUT = require ('./reducer')

describe ('modules/PullRequest/reducer', () => {
  describe ('selectPullRequest', () => {
    it ('should set pull request state from payload', () => {
      const state = null
      const payload = 'PULL REQUEST'
      const action = SUT.actionCreators.selectPullRequest (payload)
      assert.deepEqual (SUT.reducer (state, action), 'PULL REQUEST')
    })
  })
})
