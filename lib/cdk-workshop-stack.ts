import { Stack, StackProps } from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as nodelambda from "aws-cdk-lib/aws-lambda-nodejs";
import * as apiGateway from "aws-cdk-lib/aws-apigateway";
// import * as sns from "aws-cdk-lib/aws-sns";
// import * as subs from "aws-cdk-lib/aws-sns-subscriptions";
// import * as sqs from "aws-cdk-lib/aws-sqs";
import { Construct } from "constructs";

export class CdkWorkshopStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Lambda function hello world - JavaScript with AWS CDK
    const helloLambda = new lambda.Function(this, "HelloWorldLambda", {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: "index.handler",
      code: lambda.Code.fromAsset("lambda"),
    });

    // Lambda function hello world - TypeScript with AWS CDK
    const helloLambdaTypeScript = new nodelambda.NodejsFunction(this, "HelloWorldLambdaTypeScript", {
      runtime: lambda.Runtime.NODEJS_22_X,
      entry: "lambda/index.ts",
      handler: "handler",
    });

    // API Gateway definition for Lambda
    const apiGatewayService = new apiGateway.LambdaRestApi(this, "ApiGatewayService", {
      handler: helloLambdaTypeScript,
    });
  }
}
