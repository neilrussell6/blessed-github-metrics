const R = require ('ramda')

//---------------------------------
// stub curried
//---------------------------------

const stubCurried = sandbox => (arity, obj, property) => {
  const _stub = R.isNil (obj) ? sandbox.stub () : sandbox.stub (obj, property)
  const _curriedStub = R.curryN (arity, _stub)
  return new Proxy (_curriedStub, {
    get (target, name) {
      return name === 'defaultBehavior' ? _stub : _stub[name]
    },
  })
}

module.exports.stubCurried = stubCurried
