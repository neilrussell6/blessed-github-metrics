const axios = require ('axios')
const Bluebird = require ('bluebird')
const R = require ('ramda')

const { HTTPError, errorMap } = require('./errors')

//---------------------------------
// POST
//---------------------------------

const post = headers => baseUrl => endpoint => body => Bluebird
  .resolve (axios.post (`${baseUrl}${endpoint}`, body, { headers }))
  .then (R.path (['data', 'data']))
  .catch (R.pipe (
    R.converge (R.pathOr, [
      R.prop ('code'),
      R.always (['response', 'status']),
      R.identity,
    ]),
    x => R.propOr (HTTPError) (x) (errorMap),
    f => Bluebird.reject(new f ()),
  ))

module.exports.post = post

//---------------------------------
// factory
//---------------------------------

module.exports.factory = headers => baseUrl => R.map (f => f (headers) (baseUrl)) ({ post })
