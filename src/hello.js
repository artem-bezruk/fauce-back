const utils = require('./lib/utils');
module.exports.handler = (event, context, callback) => {
    callback(null, utils.createHttpResponse(200, {message: 'Hello World!'}));
};
