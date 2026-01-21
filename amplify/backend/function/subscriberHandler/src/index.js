/* Amplify Params - DO NOT EDIT
	ENV
	REGION
Amplify Params - DO NOT EDIT *//* Amplify Params - DO NOT EDIT
  ENV
  REGION
Amplify Params - DO NOT EDIT */const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  ScanCommand,
} = require("@aws-sdk/lib-dynamodb");
const { v4: uuidv4 } = require("uuid");

const client = new DynamoDBClient({});
const ddb = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.STORAGE_CONTACTS_NAME || 'Contacts-dev';

exports.handler = async (event) => {
  try {
    console.log("EVENT:", JSON.stringify(event));
    console.log("ENV VARS:", process.env);

    // GET all
    if (event.httpMethod === "GET" && !event.queryStringParameters?.id) {
      const result = await ddb.send(
        new ScanCommand({ TableName: TABLE_NAME })
      );

      return {
        statusCode: 200,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify(result.Items || []),
      };
    }

    // GET by id
    if (event.httpMethod === "GET" && event.queryStringParameters?.id) {
      const result = await ddb.send(
        new GetCommand({
          TableName: TABLE_NAME,
          Key: { id: event.queryStringParameters.id },
        })
      );

      return {
        statusCode: 200,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify(result.Item || null),
      };
    }

    // POST
    if (event.httpMethod === "POST") {
      if (!event.body) {
        return {
          statusCode: 400,
          headers: { "Access-Control-Allow-Origin": "*" },
          body: JSON.stringify({ message: "Missing body" }),
        };
      }

      const body = JSON.parse(event.body);

      const item = {
        id: uuidv4(),
        email: body.email,
        firstName: body.firstName,
        lastName: body.lastName,
        createdAt: new Date().toISOString(),
      };

      await ddb.send(
        new PutCommand({
          TableName: TABLE_NAME,
          Item: item,
        })
      );

      return {
        statusCode: 200,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify(item),
      };
    }

    return { statusCode: 405 };
  } catch (err) {
    console.error("LAMBDA ERROR:", err);
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: err.message }),
    };
  }
};


