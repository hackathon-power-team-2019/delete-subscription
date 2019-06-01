'use strict';
const AWS = require('aws-sdk');
AWS.config.update({
  region: "us-east-1"
});
const dynamo = new AWS.DynamoDB();

exports.handler = async function (event, context) {
   
    var params = {
        TableName: 'delete-subssription-test',
        Key: {
           email: {
                S: event.email // String value.
            },
        }

    }
    console.log("email: ", event.email);
    console.log("productCode:", event.productCode);

    // delete the item that matches the email and productCode provided as input. Note: email and productCode combination should be unique.
    console.log("Attempting a conditional delete based on email and productCode....");
    
   dynamo.deleteItem(params, function (err, data) {
         console.log("in delete item block. ");
        if (err) {
            console.log("Unable to delete item.");
        } else {
            console.log("DeleteItem succeeded:", JSON.stringify(data, null, 2));
        }
    });
};
