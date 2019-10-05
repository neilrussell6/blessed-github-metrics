/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable max-len */
const R = require ('ramda')
const Faker = require ('faker')

const GenericModel = require('./generic-model')

module.exports = factory => factory.define ('GithubPullRequest', GenericModel, config => ({
  title: Faker.lorem.sentence,
  baseRefName: 'develop',
  headRefName: R.compose (R.replace (/\s/) ('_'), Faker.lorem.sentence),
  author: { login: Faker.internet.userName },
  state: Faker.random.arrayElement (['OPEN', 'CLOSED', 'MERGED']),
  createdAt: Faker.date.recent,
  publishedAt: Faker.date.recent,
  updatedAt: Faker.date.recent,
  mergedAt: Faker.date.recent,
  mergedBy: { login: Faker.internet.userName },
  mergeable: Faker.random.arrayElement (['MERGEABLE', 'CONFLICTING', 'UNKNOWN']),
  reviewRequests: { totalCount: Faker.random.number(3) },
  reviewsApproved: { totalCount: Faker.random.number(3) },
  reviewsChangesRequested: { totalCount: Faker.random.number(3) },
}))
