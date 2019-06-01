'use strict';
const doc = require('dynamodb-doc');
const dynamo = new doc.DynamoDB();
var docClient = dynamo.DocumentClient();

// event needs to pass in both email and productCode
exports.handler = (event, context, callback) => {

    var params = {
        TableName: 'product-subscriptions',
        IndexName: 'email-productCode-index',
        KeyConditionExpression: "email = :email and productCode = :productCode",
        ExpressionAttributeValues: {
            ":email": event.email,
            ":productCode": event.productCode
        }
    };

    // delete the item that matches the email and productCode provided as input. Note: email and productCode combination should be unique.
    console.log("Attempting a conditional delete based on email and productCode....");
    docClient.delete(params, function (err, data) {
        if (err) {
            console.error("Unable to delete item. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("DeleteItem succeeded:", JSON.stringify(data, null, 2));
        }
    });
};