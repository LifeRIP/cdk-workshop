import { Stack, StackProps } from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
// import * as sns from "aws-cdk-lib/aws-sns";
// import * as subs from "aws-cdk-lib/aws-sns-subscriptions";
// import * as sqs from "aws-cdk-lib/aws-sqs";
import { Construct } from "constructs";

export class CdkWorkshopStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Lambda function hello world
    const helloLambda = new lambda.Function(this, "HelloWorldLambda", {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: "index.handler",
      code: lambda.Code.fromAsset("lambda"),
    });
  }
}
