// const { assert } = require ('chai')
// const sinon = require ('sinon')
//
// const SUT = require ('./selector')
//
// describe ('modules/PullRequests/selector', () => {
//   let sandbox = null
//
//   beforeEach (async () => {
//     sandbox = await sinon.createSandbox ()
//   })
//
//   afterEach (async () => {
//     await sandbox.restore ()
//   })
//
//   describe ('general', () => {
//     it ('should return required view props as expected', () => {
//       const state = {
//         pullRequests: [
//           {
//             label: 'TETH PullRequest 1',
//             address: '0xc94655ded2bdfe8a476ff7e654055109e2946c90',
//             blockchain: 'TETH',
//             balances: {
//               TETH: '1000',
//               TERC: '10',
//             },
//           },
//           // {
//           //   label: 'TETH PullRequest 2',
//           //   address: '0xc94655ded2bdfe8a476ff7e654055109e2946c91',
//           //   blockchain: 'TETH',
//           //   balances: {
//           //     TETH: '200',
//           //     TERC: '2',
//           //   },
//           // },
//           {
//             label: 'ETH PullRequest 1',
//             address: '0xc94655ded2bdfe8a476ff7e654055109e2946c92',
//             blockchain: 'ETH',
//             balances: {
//               ETH: '300000',
//               // EOS: '3000',
//               // BNB: '300',
//               // OMG: '30',
//             },
//           },
//           // {
//           //   label: 'TBTC PullRequest 1',
//           //   address: '2N8pRPYeHfyMU6EZMe93kPzEP7dnd3cxFMx',
//           //   blockchain: 'TBTC',
//           //   balances: {
//           //     TBTC: '400000',
//           //   },
//           // },
//           // {
//           //   label: 'BTC PullRequest 1',
//           //   address: '2N8pRPYeHfyMU6EZMe93kPzEP7dnd3cxFMx',
//           //   blockchain: 'BTC',
//           //   balances: {
//           //     BTC: '500000',
//           //     BCH: '50000',
//           //     LTC: '5000',
//           //     RMG: '500',
//           //   },
//           // },
//         ],
//       }
//
//       SUT (state)
//       // assert.deepEqual (SUT (state), {
//       //   pullRequestBalanceTotals: {
//       //     TERC: '12',
//       //     TETH: '1200',
//       //   },
//       //   columnsConfig: [
//       //     {
//       //       key: 'label',
//       //       label: 'NAME',
//       //       width: 32,
//       //     },
//       //     {
//       //       key: 'address',
//       //       label: 'ADDRESS',
//       //       width: 21,
//       //     },
//       //     {
//       //       key: 'TETH',
//       //       label: 'TETH',
//       //       width: 12,
//       //     },
//       //     {
//       //       key: 'TERC',
//       //       label: 'TERC',
//       //       width: 12,
//       //     },
//       //   ],
//       //   rows: [
//       //     [
//       //       'TETH PullRequest 1',
//       //       '0xc9...6c90',
//       //       '1000',
//       //       '10',
//       //     ],
//       //     [
//       //       'TETH PullRequest 2',
//       //       '0xc9...6c91',
//       //       '200',
//       //       '2',
//       //     ],
//       //   ],
//       // })
//     })
//   })
// })
