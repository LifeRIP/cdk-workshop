import { CfnOutput, Stack, StackProps } from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as nodelambda from "aws-cdk-lib/aws-lambda-nodejs";
import * as apiGateway from "aws-cdk-lib/aws-apigateway";
import * as dynamoViewer from "cdk-dynamo-table-viewer";
// import * as sns from "aws-cdk-lib/aws-sns";
// import * as subs from "aws-cdk-lib/aws-sns-subscriptions";
// import * as sqs from "aws-cdk-lib/aws-sqs";
import { Construct } from "constructs";
import { HitCounter } from "./hitcounter";

export class CdkWorkshopStack extends Stack {
  public readonly hcViewerUrl: CfnOutput;
  public readonly hcEndpoint: CfnOutput;
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Lambda function hello world - JavaScript with AWS CDK
    const helloLambda = new lambda.Function(this, "HelloWorldLambda", {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: "index.handler", // file is "hello", function is "handler"
      code: lambda.Code.fromAsset("lambda"), // code loaded from "lambda" directory
    });

    // Lambda function hello world - TypeScript with AWS CDK
    const helloLambdaTypeScript = new nodelambda.NodejsFunction(
      this,
      "HelloWorldLambdaTypeScript",
      {
        runtime: lambda.Runtime.NODEJS_22_X,
        entry: "lambda/index.ts", // code loaded from this path
        handler: "handler", // function is "handler"
      }
    );

    // Define the custom construct (HitCounter)
    const helloHitCounter = new HitCounter(this, "HelloHitCounter", {
      downstream: helloLambdaTypeScript,
    });

    // API Gateway definition for Lambda
    const apiGatewayService = new apiGateway.LambdaRestApi(
      this,
      "ApiGatewayService",
      {
        handler: helloHitCounter.handler,
      }
    );

    // Table viewer library
    const viewer = new dynamoViewer.TableViewer(this, "HitsTableViewer", {
      table: helloHitCounter.table,
      title: helloHitCounter.table.tableName,
      sortBy: "-".concat(helloHitCounter.table.schema().partitionKey.name), // '-path'
    });

    // Outputs to deployment
    this.hcViewerUrl = new CfnOutput(this, "DynamoTableUrl", {
      value: viewer.endpoint,
    });
    this.hcEndpoint = new CfnOutput(this, "HitCounterEnpoint", {
      value: apiGatewayService.url,
    });
  }
}
