const { assert } = require ('chai')

const { reducer: SUT, selectPullRequest } = require ('./reducer')

describe ('modules/PullRequest/reducer', () => {
  describe ('selectPullRequest', () => {
    it ('should set pull request state from payload', () => {
      const state = null
      const payload = 'PULL REQUEST'
      const action = selectPullRequest (payload)
      assert.deepEqual (SUT (state, action), 'PULL REQUEST')
    })
  })
})
