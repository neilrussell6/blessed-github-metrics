/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable max-len */
const Faker = require ('faker')

const GenericModel = require('./generic-model')
const { participantRoles } = require('../../modules/PullRequestEvents')

module.exports = factory => factory.define ('PullRequestParticipant', GenericModel, ({
  login: Faker.internet.userName,
  role: () => Faker.random.objectElement (participantRoles),
  isActive: Faker.random.boolean,
  isResponsible: Faker.random.boolean,
}))
