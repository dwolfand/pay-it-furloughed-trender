'use strict';
const AWS = require('aws-sdk');
const http = require('http');

function refreshAndReturnResults(docClient) {
    return docClient
        .scan({
            TableName: 'pay-it-furloughed',
            FilterExpression: "createdDate <> :a",
            ExpressionAttributeValues: {':a': 'total'}, 
        }).promise()
        .then((results) => results.Items)
        .then((items) => {
            let prunedList = items.sort((a, b)=>{
                return a < b;
            });
            console.log("whats the list", prunedList);
            prunedList = prunedList.filter((cur, idx) => {
                return idx % 10 === 0;
            });
            return docClient
            .update({
                TableName: 'pay-it-furloughed',
                Key: {createdDate: 'total'},
                UpdateExpression: `set agg = :all, expires = :expires`,
                ExpressionAttributeValues: {
                    ':all': prunedList,
                    ':expires': (new Date().getTime() / 1000) + 200,
                },
                ReturnValues: 'UPDATED_NEW',
            }).promise()
        })
        .then((result) => result.Attributes.agg)
};

module.exports.getData = async (event) => {
  const docClient = new AWS.DynamoDB.DocumentClient();

  return docClient
  .get({
      TableName: 'pay-it-furloughed',
      Key: {createdDate: 'total'},
  }).promise()
  .then((total) => {
      if (total.Item && total.Item.expires && Number(total.Item.expires) > new Date().getTime() / 1000){
          console.log('returning agg');
          return total.Item.agg;
      } else {
          console.log('refreshing total');
          return refreshAndReturnResults(docClient);
      }
  })
  .then((result) => {
      return {
          statusCode: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
          },
          body: JSON.stringify(result),
      }
  });
};

module.exports.saveData = async (event) => {
  const docClient = new AWS.DynamoDB.DocumentClient();

  return new Promise((resolve, reject) => {
      const options = {
          host: 'gray-cobra-3998.twil.io',
          path: '/balance',
          port: 80,
          method: 'GET'
      };

      const req = http.request(options, (res) => {
        res.on("data", function(chunk) {
          resolve(JSON.parse(chunk.toString()));
        });
      });

      req.on('error', (e) => {
        reject(e.message);
      });

      // send the request
      req.write('');
      req.end();
  })
  .then((result) => {
      return docClient
      .put({
        TableName: 'pay-it-furloughed',
        Item: {
          createdDate: new Date().toISOString(),
          ...result
        },
      })
      .promise()
      .then(() => result);
  })
  .then((result) => {
      return {
          statusCode: 200,
          body: JSON.stringify(result),
      }
  });
};
