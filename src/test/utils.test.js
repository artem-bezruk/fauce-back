var assert = require('assert');
var utils = require('../lib/utils');
describe('utils', () => {
  describe('createHttpResponse()', () => {
    it('should return valid API Gateway HTTP payload ', () => {
      const expected = {
        statusCode: 201,
        isBase64Encoded: false,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: "{\"message\":\"Created!\"}"
      };
      const result = utils.createHttpResponse(201, {
        message: "Created!"
      });
      assert.deepEqual(result, expected);
    });
  });
  describe('getTimestamp()', () => {
    it('should successfully return timestamp', () => {
      const result = utils.getTimestamp();
      assert(result);
    });
  });
  describe('getCurrentBlockNumber()', () => {
    it('should successfully return current Alfajores block number', () => {
      const result = utils.getCurrentBlockNumber();
      assert(result);
    });
  });  
  describe('sortByRequestedBlock()', () => {
    it('should successfully return sorted array by createdBlockNumber', () => {
      const data =[{createdBlockNumber: 1}, {createdBlockNumber: 2}, {createdBlockNumber: -1}];
      let result = utils.sortByRequestedBlock(true, data);
      assert(result, [{createdBlockNumber: -1}, {createdBlockNumber: 1}, {createdBlockNumber: 2}]);
      result = utils.sortByRequestedBlock(false, data);
      assert(result, [{createdBlockNumber: 2}, {createdBlockNumber: 1}, {createdBlockNumber: -1}]);
    });
  });  
});
