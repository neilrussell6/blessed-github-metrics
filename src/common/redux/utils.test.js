const { assert } = require ('chai')
const sinon = require ('sinon')

const SUT = require ('./utils.js')

describe ('common/redux/utils', () => {
  let sandbox = null

  beforeEach (() => {
    sandbox = sinon.createSandbox ()
  })

  afterEach (() => {
    sandbox.restore ()
  })

  describe ('endpoint', () => {
    it ('should map action to reducer passing it current state and action', () => {
      // when
      // ... we create a state endpoint with 2 reducers
      const reducer1Stub = sandbox.stub ()
      const reducer2Stub = sandbox.stub ()
      const reducers = {
        ACTION1: reducer1Stub,
        ACTION2: reducer2Stub,
      }
      const reducer = SUT.endpoint (reducers)
      // ... and call it with a state and action 2
      const state = { a: 'A' }
      const action = { type: 'ACTION2' }
      reducer (state, action)

      // then
      // ... should have mapped action 2 to expected reducer 2
      // ... and passed the provided state and action along
      sinon.assert.notCalled (reducer1Stub)
      sinon.assert.calledWithExactly (reducer2Stub, state, action)
    })

    it ('should use default state when current state is null', () => {
      // when
      // ... we create a state endpoint with 2 reducers
      const reducer1Stub = sandbox.stub ()
      const reducer2Stub = sandbox.stub ()
      const reducers = {
        ACTION1: reducer1Stub,
        ACTION2: reducer2Stub,
      }
      const defaultState = { b: 'B' }
      const reducer = SUT.endpoint (reducers, defaultState)
      // ... and call it with null state and an action
      const state = null
      const action = { type: 'ACTION2' }
      reducer (state, action)

      // then ... should have used default state
      sinon.assert.notCalled (reducer1Stub)
      sinon.assert.calledWithExactly (reducer2Stub, defaultState, action)
    })

    it ('should update state using expected reducer', () => {
      // when
      // ... we create a state endpoint with a reducer that updates the property a
      const reducers = {
        ACTION1: (state, action) => ({ ...state, a: action.payload }),
      }
      const reducer = SUT.endpoint (reducers)
      // ... and call it with state and an action
      const state = { a: 'A' }
      const action = { type: 'ACTION1', payload: 'B' }
      const newState = reducer (state, action)

      // then ... should update state as expected
      assert.deepEqual (newState, { a: 'B' })
    })
  })
})
