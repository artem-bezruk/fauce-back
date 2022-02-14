const AWS = require('aws-sdk');
const documentClient = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.FAUCET_QUEUE_TABLE_NAME;
module.exports.create = (faucetRequest) => {
	let params = {
		TableName: tableName,
		Item: faucetRequest
	};
	return documentClient.put(params).promise();
};
module.exports.getAll = () => {
	let params = {
		TableName: tableName
	};
	return documentClient.scan(params).promise();
};
module.exports.delete = (address) => {
	let params = {
		TableName: tableName,
		Key: {
			faucetRequestAddress: address
		}
	};
	return documentClient.delete(params).promise();
};
const updateExpression = (args) => {
	const keys = Object.keys(args);
	let params = keys.reduce((accum, key, idx) => {
		accum.UpdateExpression += ` #${key} = :${key}`;
		if (idx + 1 < keys.length) {
			accum.UpdateExpression += " ,";
		}
		accum.ExpressionAttributeNames[`#${key}`] = key;
		accum.ExpressionAttributeValues[`:${key}`] = args[key];
		return accum;
	}, {
		UpdateExpression: "set",
		ExpressionAttributeNames: {},
		ExpressionAttributeValues: {}
	});
	return params;
};
module.exports.update = (faucetRequest) => {
	const requestId = faucetRequest.requestId;
	console.log('faucetStorage - ' + JSON.stringify(faucetRequest));
	delete faucetRequest["requestId"];
	console.log('faucetStorage - ' + JSON.stringify(faucetRequest));
	let params = {
		TableName: tableName,
		Key: {
			requestId: requestId
		},
		...updateExpression(faucetRequest)
	};
	console.log('faucetStorage - ' + JSON.stringify(faucetRequest));
	return documentClient.update(params).promise();
};
