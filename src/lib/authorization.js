const buildAllowAllPolicy = (event, principalId) => {
    const policy = {
        principalId: principalId,
        policyDocument: {
        Version: '2012-10-17',
        Statement: [
            {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: event.methodArn
            }]
        }
    }
    return policy;
}
const getToken = (params) => {
    console.log('params:' + JSON.stringify(params));
    if (!params.type || params.type !== 'TOKEN') {
        throw new Error('Expected "event.type" parameter to have value "TOKEN"');
    }
    const tokenString = params.authorizationToken;
    if (!tokenString) {
        throw new Error('Expected "event.authorizationToken" parameter to be set');
    }
    const match = tokenString.match(/^Basic (.*)$/);
    if (!match || match.length < 2) {
        throw new Error(`Invalid Authorization token - ${tokenString} does not match "Basic .*"`);
    }
    return match[1];
}
module.exports.handler = async function (event, context, callback) {
    console.log();
    var authorizationHeader = getToken(event);
    if (!authorizationHeader) 
        context.fail('Unauthorized');
    console.log('Authorization header = ' + authorizationHeader);
    console.log(JSON.stringify(authorizationHeader));
    var plainCreds = (new Buffer(authorizationHeader, 'base64')).toString().split(':');
    console.log(JSON.stringify(plainCreds));
    var username = plainCreds[0];
    var password = plainCreds[1];
    console.log(`username = ${username}, password=${password}`);
    if (!((username === process.env.HTTP_BASIC_AUTH_USER) && (password === process.env.HTTP_BASIC_AUTH_PASSWORD))) 
        context.fail('Unauthorized');
    const authResponse = buildAllowAllPolicy(event, username)
    return authResponse;
}
