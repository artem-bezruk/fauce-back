const assert = require('assert');
const utils = require('../lib/utils');
const contractkit = require('@celo/contractkit');
describe('contractkit', () => {
  describe('connect to provider', () => {
    it('should return a block number', async () => {
      const kit = contractkit.newKit('https:
      const blockNumber = await kit.web3.eth.getBlockNumber();
      console.log('Current blockNumber is ' + blockNumber);
      assert(blockNumber);
      assert.notEqual(blockNumber, 0);      
    });
  });
  describe('create account from private key', () => {
    it('should return a valid web3 account from a private key', async () => {
      const kit = contractkit.newKit('https:
      var privateKey = Buffer.alloc(32, 0);
      privateKey[31] = 1;
      console.log("PK::" + privateKey.toString('hex'));
      kit.addAccount(privateKey.toString('hex'));
      privateKey = Buffer.alloc(32, 0);
      privateKey[31] = 2;
      console.log("PK::" + privateKey.toString('hex'));
      kit.addAccount(privateKey.toString('hex'));
      const accounts = await kit.web3.eth.getAccounts();
      console.log(accounts);
      assert.equal(accounts.length, 2);
      assert.equal(accounts[0], '0x7E5F4552091A69125d5DfCb7b8C2659029395Bdf');
      assert.equal(accounts[1], '0x2B5AD5c4795c026514f8317c7a215E218DcCD6cF');
      kit.defaultAccount = accounts[0];
      assert.equal(accounts[0], kit.defaultAccount);
    });
  });
});
