const { assert } = require ('chai')
const R = require ('ramda')

const factory = require ('../../common/factories')
const { reducer: SUT, httpGetPullRequestsSuccess } = require ('./reducer')

const repositoryFixture = async pullRequests => ({
  repository: {
    pullRequests: {
      nodes: pullRequests,
    },
  },
})

describe ('modules/PullRequests/reducer', () => {
  describe ('setPullRequests', () => {
    it ('should return all expected fields', async () => {
      // when
      // ... we update our state from a http response including 3 pull requests
      const pullRequests = await factory.buildMany ('GithubPullRequest', 3)
      const state = []
      const { repository } = await repositoryFixture (pullRequests)
      const payload = { repository }
      const action = httpGetPullRequestsSuccess (payload)
      const result = SUT (state, action)

      // then ... should return all events with expected fields
      assert.equal (result.length, 3)
      assert.sameMembers (R.keys (result[0]), [
        'author',
        'mergedBy',
        'reviewRequests',
        'reviewsApproved',
        'reviewsChangesRequested',
        'title',
        'baseRefName',
        'headRefName',
        'state',
        'createdAt',
        'publishedAt',
        'updatedAt',
        'mergedAt',
        'mergeable',
      ])
    })

    it ('should set user fields as expected', async () => {
      // when
      // ... we update our state from a http response including:
      // ... a pull request with an author and a merger
      const pullRequest = await factory.build ('GithubPullRequest', {
        author: { login: 'AUTHOR LOGIN' },
        mergedBy: { login: 'MERGED BY LOGIN' },
      })
      const state = []
      const { repository } = await repositoryFixture ([pullRequest])
      const payload = { repository }
      const action = httpGetPullRequestsSuccess (payload)
      const result = SUT (state, action)

      // then ... should return user fields as expected
      assert.equal (result[0].author, 'AUTHOR LOGIN')
      assert.equal (result[0].mergedBy, 'MERGED BY LOGIN')
    })

    it ('should extract and transform totals as expected', async () => {
      // when
      // ... we update our state from a http response including:
      // ... a pull request with total review requests, approvals and change requests
      const pullRequest = await factory.build ('GithubPullRequest', {
        reviewRequests: { totalCount: 100 },
        reviewsApproved: { totalCount: 200 },
        reviewsChangesRequested: { totalCount: 300 },
      })
      const state = []
      const { repository } = await repositoryFixture ([pullRequest])
      const payload = { repository }
      const action = httpGetPullRequestsSuccess (payload)
      const result = SUT (state, action)

      // then ... should return total fields as expected
      assert.equal (result[0].reviewRequests, 100)
      assert.equal (result[0].reviewsApproved, 200)
      assert.equal (result[0].reviewsChangesRequested, 300)
    })
  })
})
