const { marbles } = require ('rxjs-marbles/mocha')
const sinon = require ('sinon')

const { initAppSuccess } = require ('../App')
const SUT = require ('./epics')
const { actionCreators } = require ('./reducer')

const { getPullRequestsSuccess } = actionCreators

describe ('modules/PullRequests/epics', () => {
  let sandbox = null

  beforeEach (async () => {
    sandbox = await sinon.createSandbox ()
  })

  afterEach (async () => {
    await sandbox.restore ()
  })

  describe ('getPullRequestsEpic', () => {
    it ('should get pull requests', marbles (async (m) => {
      // given ...
      const values = {
        a: initAppSuccess (),
        b: 'API RESPONSE',
        c: getPullRequestsSuccess ('API RESPONSE'),
      }
      const state$            = m.cold ('-------', values)
      const action$           = m.cold ('---a---', values)
      const getPullRequests$  = m.cold ('   ---b', values)
      const expected          =         '------c'

      const getPullRequests$Stub = sandbox.stub ().returns (getPullRequests$)

      const dependencies = {
        pullRequestsUtils: {
          getPullRequests: getPullRequests$Stub
        },
      }

      // when ... we get pull requests
      const destination$ = SUT.getPullRequestsEpic (action$, state$, dependencies)

      // then
      // ... should succeed as expected
      // ... after correctly getting pull requests
      await m.equal (destination$, expected, values)
      sinon.assert.calledWithExactly (getPullRequests$Stub)
    }))
  })
})


