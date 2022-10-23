import {DynamoDB} from 'aws-sdk'

const options = {
  region: 'localhost',
  endpoint: 'http://localhost:8000'
}

const ifOffline = () => {
  /* 
    Não necessita criar essa variável de ambiente 
    no .env pois a mesma é criada pelo 
    plugin serverless-offline 
  */
  return process.env.IS_OFFLINE
}

export const document = ifOffline() ? new DynamoDB.DocumentClient(options) : new DynamoDB.DocumentClient()