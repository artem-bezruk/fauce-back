var assert = require('assert');
var faucet = require('../createFaucetRequest');
describe('createFaucetRequest', () => {
    describe('handler()', () => {
        it('should return http status 400 when no valid body supplied', () => {
            const invalidEvent = {
                resource: "/",
                path: "/request",
                httpMethod: "POST"
            };
            const expectedBody = JSON.stringify({
                message: "Body cannot be empty"
            });
            faucet.handler(invalidEvent, null, (err, response) => {
                assert.equal(response.statusCode, 400);
                assert.equal(response.body, expectedBody);
            });
        });
        it('should return 400 when the address is burn address', () => {
            const invalidEvent = {
                resource: "/",
                path: "/request",
                httpMethod: "POST",
                body: "{\"address\": \"0x0000000000000000000000000000000000000000\"}"
            };
            const expectedBody = JSON.stringify({
                message: "No burning"
            });
            faucet.handler(invalidEvent, null, (err, response) => {
                assert.equal(response.statusCode, 400);
                assert.equal(response.body, expectedBody);
            });
        });
        it('should return 400 when the address invalid', () => {
            const invalidAddress = "0x9999KKKKinvalid_address";
            const body = JSON.stringify({
                address: invalidAddress
            });
            const invalidEvent = {
                resource: "/",
                path: "/request",
                httpMethod: "POST",
                body: body
            };
            const expectedBody = JSON.stringify({
                message: `Address ${invalidAddress} is not valid`
            });
            faucet.handler(invalidEvent, null, (err, response) => {
                assert.equal(response.statusCode, 400);
                assert.equal(response.body, expectedBody);
            });
        });
    });
});
