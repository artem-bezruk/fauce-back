var assert = require('assert');
var hello = require('../hello');
describe('hello', () => {
  describe('handler()', () => {
    const event = {
      resource: "/",
      path: "/hello",
      httpMethod: "GET" 
    };
    it('should return http status 200 ', () => {
      hello.handler(event, null, (err, response) => {
        assert.equal(response.statusCode, 200);
      });
    });
    it('should return "Hello World" text', () => {
      hello.handler(event, null, (err, response) => {
        const body = JSON.stringify({message:"Hello World!"});
        assert.equal(response.body, body);
      });  
    });
  });
});
