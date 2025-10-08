const { DynamoDB } = require("@aws-sdk/client-dynamodb");
const { Lambda, InvokeCommand } = require("@aws-sdk/client-lambda");

exports.handler = async function (event) {
  console.log("request", JSON.stringify(event, undefined, 2));

  // Create SDK clients
  const dynamo = new DynamoDB();
  const lambda = new Lambda();

  // Update dynamo entry path with hits++
  await dynamo.updateItem({
    TableName: process.env.HITS_TABLE_NAME,
    Key: { path: { S: event.path } },
    UpdateExpression: "ADD hits :incr",
    ExpressionAttributeValues: { ":incr": { N: "1" } },
  });

  // Call downstream function and capture response
  const command = new InvokeCommand({
    FunctionName: process.env.DOWNSTREAM_FUNCTION_NAME,
    Payload: JSON.stringify(event),
  });

  // Formatting result
  const { Payload } = await lambda.send(command);
  console.log("raw payload", Payload);

  const buffer = Buffer.from(Payload);
  console.log("payload to buffer", Buffer.from(Payload));

  const result = buffer.toString();
  console.log("buffer to string", result);

  console.log("downstream response:", JSON.stringify(result, undefined, 2));

  return JSON.parse(result);
};
