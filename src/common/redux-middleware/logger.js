const logger = ({ getState }) => {
  return next => action => {
    console.log ('ACTION', action)
    console.log ('STATE (before)', getState ())

    // Call the next dispatch method in the middleware chain.
    const returnValue = next (action)

    console.log ('STATE (after)', getState ())

    // This will likely be the action itself, unless
    // a middleware further in chain changed it.
    return returnValue
  }
}

module.exports = logger
