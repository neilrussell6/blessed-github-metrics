const { marbles } = require ('rxjs-marbles/mocha')
const sinon = require ('sinon')

const SUT = require ('./epics')
const { actionCreators } = require ('./reducer')

const { initApp, initAppSuccess } = actionCreators

describe('modules/App/epics', () => {
  let sandbox = null

  beforeEach(async () => {
    sandbox = await sinon.createSandbox()
  })

  afterEach(async () => {
    await sandbox.restore()
  })

  describe('initAppEpic', () => {
    it('should initialize then succeed', marbles((m) => {
      const values = {
        a: initApp(),
        b: initAppSuccess(),
      }
      const state$   = m.cold('-------', values)
      const action$  = m.cold('---a---', values)
      const expected =        '---b---'

      const destination$ = SUT.initAppEpic(action$, state$)

      m.equal(destination$, expected, values)
    }))
  })
})
