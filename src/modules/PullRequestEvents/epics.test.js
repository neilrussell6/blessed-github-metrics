const { marbles } = require ('rxjs-marbles/mocha')
const { assert } = require ('chai')
const sinon = require ('sinon')

const TestUtils = require('../../common/utils/test.utils')
const SUT = require ('./epics')
const { httpGetPullRequestEvents, httpGetPullRequestEventsSuccess } = require ('./reducer')

describe ('modules/PullRequestEvents/epics', () => {
  let sandbox = null

  beforeEach (async () => {
    sandbox = await sinon.createSandbox ()
    sandbox.stubCurried = TestUtils.stubCurried(sandbox)
  })

  afterEach (async () => {
    await sandbox.restore ()
  })

  describe ('getPullRequestsEpic', () => {
    it ('should get pull requests', marbles (async (m) => {
      // given ...
      const state = { pullRequest: { headRefName: 'STATE HEAD REF NAME' } }
      const values = {
        s: state,
        a: httpGetPullRequestEvents (),
        b: 'API RESPONSE',
        c: httpGetPullRequestEventsSuccess ('API RESPONSE'),
      }
      const state$   = m.cold ('s------', values)
      const action$  = m.cold ('---a---', values)
      const post$    = m.cold ('   ---b', values)
      const expected =         '------c'

      const post$Stub = sandbox.stubCurried (2).returns (post$)
      const dependencies = { githubHttpUtils: { post: post$Stub } }

      // when ... we http get pull request events
      const destination$ = SUT.getPullRequestEventsEpic (action$, state$, dependencies)

      // then
      // ... should succeed as expected
      // ... after correctly getting pull request events
      await m.equal (destination$, expected, values)
      assert.equal (post$Stub.args[0].length, 2)
      assert.equal (post$Stub.args[0][0], '')
      assert.hasAllKeys (post$Stub.args[0][1], ['variables', 'query'])
    }))
  })
})


