import type { AWS } from '@serverless/typescript';


const serverlessConfiguration: AWS = {
  service: 'send-file',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild', 'serverless-dynamodb-local', 'serverless-offline'],
  provider: {
    name: 'aws',
    region: "sa-east-1",
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
    lambdaHashingVersion: "20201221",
    // permissões do IAM
    iamRoleStatements: [
      {
        // Resulta no efeito para tudo/todos
        Effect: "Allow",
        // Ação no dynamodb e liberar todas as tabelas
        Action: ["dynamodb:*"],
        // libera todos os resources 
        Resource: ["*"]
      }
    ]
  },
  // import the function via paths
  functions: { 
    exportTransactions: {
      handler: "src/functions/exportTransactions.handler",
      events: [
        {
          http: {
            path: 'export',
            method: 'post',
            cors: true
          }
        }
      ]
    },
  },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
    dynamodb: {
      stages: ["dev", "local"],
      start: {
        port: 8000,
        inMemory: true,
        migrate: true
      }
    }
  },
  resources: {
    Resources: {
      dbFileUsers: {
        Type:"AWS::DynamoDB::Table",
        Properties: {
          TableName: "users_file_export",
          ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5
          },
          AttributeDefinitions: [
            {
              AttributeName: "id",
              AttributeType: "S"
            }
          ],
          KeySchema: [
            {
              AttributeName: 'id',
              KeyType: "HASH"
            }
          ]
        }
      }
    }
  }
};

module.exports = serverlessConfiguration;
