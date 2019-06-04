'use strict';
const AWS = require('aws-sdk');
AWS.config.update({
    region: "us-east-1"
});
const dynamo = new AWS.DynamoDB();

exports.handler = async function(event, context, callback) {

    function scan() {
        return new Promise(function(resolve, reject) {
            var params = {
                TableName: 'product-subscriptions',
                FilterExpression: 'email = :email and productCode = :productCode',
                ExpressionAttributeValues: {
                    ':email': { 'S': event.email },
                    ':productCode': { 'S': event.productCode }
                }
            };
            dynamo.scan(params, function(err, result) {
                if (err) {
                    callback(err, null);
                }
                else {
                    console.log("In Promise... result: ", result);
                    resolve(result);
                    callback(null, result);
                }
            });
        });
    }

    const scanResult = await scan();
    var id = scanResult.Items[0].id.S;

    console.log("scanResult: ", scanResult);
    console.log("id: ", id);

    console.log("email: ", event.email);
    console.log("productCode:", event.productCode);

    // delete the item that matches the email and productCode provided as input. Note: email and productCode combination should be unique.
    console.log("Attempting a conditional delete based on email and productCode....");
    var params2 = {
        TableName: 'product-subscriptions',
        Key: {
            id: {
                S: id // String value.
            },
        }
    }
    dynamo.deleteItem(params2, function(err, data) {
        console.log("in delete item block. ");
        if (err) {
            console.log("Unable to delete item. Error JSON:", JSON.stringify(err, null, 2));
        }
        else {
            console.log("DeleteItem succeeded:", JSON.stringify(data, null, 2));
        }
    });
};
