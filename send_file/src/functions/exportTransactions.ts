// Event responsável por trazer os dados da requisição para dentro da nossa função.

import { APIGatewayProxyHandler } from "aws-lambda"
import { document } from "src/utils/dynamodbClient"


type Transactions = {
  description: string,
  value: string,
  
}
interface EventBody {
  transactions: Transactions[]
}


export const handler: APIGatewayProxyHandler = async (event) => {
  const { transactions } = JSON.parse(event.body) as EventBody;

  const id = "d20a1b54-45a3-42fa-a900-d5ee55059a71";

  await document.put({
    TableName: "users_file_export",
    Item:{
      id,
      description: 'test',
      created_at: new Date().getTime()
    }
  }).promise();

  const response = await document.query({
    TableName: "users_file_export",
    KeyConditionExpression: "id = :id",
    ExpressionAttributeValues: {
      ":id": id
    }

  }).promise()

  return {
    statusCode: 201,
    body: JSON.stringify(response.Items[0])
  }
}