#!/usr/bin/env node
const amqp = require ('amqplib/callback_api')
const amqplib = require ('amqplib')
const R = require('ramda')

const opt = { credentials: amqplib.credentials.plain ('rabbitmq', 'rabbitmq') }

const QUEUE_NAME = 'rabbitmq-redux-logger'

let state = {
  channel: null,
  connection: null,
}

amqp.connect ('amqp://localhost', opt, (error0, connection) => {
  if (error0) {
    throw error0
  }

  connection.createChannel ((error1, channel) => {
    if (error1) {
      throw error1
    }

    state.channel = channel
  })
})

const middleware = ({ getState }) => {
  return next => action => {
    const stateBefore = getState ()

    const returnValue = next (action)

    if (R.compose (R.isNil, R.prop ('channel')) (state)) {
      return returnValue
    }

    const msgData = {
      datetime: new Date ().toISOString (),
      state: {
        before: stateBefore,
        after: getState (),
      },
      action,
    }
    const msg = JSON.stringify (msgData)
    state.channel.assertQueue (QUEUE_NAME, { durable: false })
    state.channel.sendToQueue (QUEUE_NAME, Buffer.from (msg))

    return returnValue
  }
}

module.exports = {
  middleware,
  state,
}
