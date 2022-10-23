// Event responsável por trazer os dados da requisição para dentro da nossa função.

import { APIGatewayProxyHandler } from "aws-lambda"

export const handler: APIGatewayProxyHandler = async (event) => {


  return {
    statusCode: 201,
    body: JSON.stringify({message: 'helloWorld'})
  }
}