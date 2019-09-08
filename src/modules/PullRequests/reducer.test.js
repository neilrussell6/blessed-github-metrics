const { assert } = require ('chai')

const SUT = require ('./reducer')

describe ('modules/PullRequests/reducer', () => {
  describe ('setPullRequests', () => {
    it ('should transform payload as expected and overwrite state', () => {
      const state = ['EXISTING']
      const payload = {
        repository: {
          pullRequests: {
            nodes: [
              { id: 1, name: 'ONE', author: { login: 'ONE AUTH LOGIN' } },
              { id: 2, name: 'TWO', author: { login: 'TWO AUTH LOGIN' } },
              { id: 3, name: 'THREE', author: { login: 'THREE AUTH LOGIN' } },
            ],
          },
        },
      }
      const action = SUT.actionCreators.getPullRequestsSuccess (payload)
      const expected = [
        { id: 3, name: 'THREE', authorLogin: 'THREE AUTH LOGIN' },
        { id: 2, name: 'TWO', authorLogin: 'TWO AUTH LOGIN' },
        { id: 1, name: 'ONE', authorLogin: 'ONE AUTH LOGIN' },
      ]
      assert.deepEqual (SUT.reducer (state, action), expected)
    })
  })
})
