const AWS = require('aws-sdk');
const documentClient = new AWS.DynamoDB.DocumentClient();
const utils = require('./utils');
const tableName = process.env.CREATED_REWARDS_TABLE_NAME;
module.exports.getReward = async (hashCode, callback) => {
    try {
        const result = await get(hashCode);
        const reward = result && result.Item;
        console.log("Reward link retrieved : " + JSON.stringify(reward));
        return reward;
    } catch (e) {
        console.log('Error promise resolved :' + e);
        callback(null, utils.createHttpResponse(500, {
            message: 'Server error during retrieval of previously created reward - ' + e
        }));
    };
}
module.exports.create = (rewardObj) => {
    let params = {
        TableName: tableName,
        Item: rewardObj
    };
    return documentClient.put(params).promise();
};
module.exports.getAll = () => {
    let params = {
        TableName: tableName
    };
    return documentClient.scan(params).promise();
};
get = (hashCode) => {
    let params = {
        TableName: tableName,
        Key: {
            hashCode: `${hashCode}`
        }
    };
    return documentClient.get(params).promise();
};
module.exports.get = get;
