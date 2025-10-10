import { Stack } from "aws-cdk-lib";
import { HitCounter } from "../lib/hitcounter";
import { Function, Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Capture, Template } from "aws-cdk-lib/assertions";

test("DynamoDB table created", () => {
  const stack = new Stack();

  // WHEN
  new HitCounter(stack, "TableCreatedTest", {
    downstream: new NodejsFunction(stack, "TestTSLambdaInHitCounter", {
      runtime: Runtime.NODEJS_22_X,
      entry: "lambda/index.ts",
      handler: "handler",
    }),
  });

  // THEN
  const template = Template.fromStack(stack);
  template.resourceCountIs("AWS::DynamoDB::Table", 1);
});

test("HitCounter's lambda has environment values", () => {
  const stack = new Stack();

  // WHEN
  const hitCounter = new HitCounter(stack, "TableCreatedTest", {
    downstream: new NodejsFunction(stack, "TestTSLambdaInHitCounter", {
      runtime: Runtime.NODEJS_22_X,
      entry: "lambda/index.ts",
      handler: "handler",
    }),
  });

  // THEN
  const template = Template.fromStack(stack);
  const envCapture = new Capture();
  template.hasResourceProperties("AWS::Lambda::Function", {
    Environment: envCapture,
  });

  expect(envCapture.asObject()).toEqual({
    Variables: {
      DOWNSTREAM_FUNCTION_NAME: {
        Ref: "TestTSLambdaInHitCounter4651F934",
      },
      HITS_TABLE_NAME: {
        Ref: "TableCreatedTestHits80F0EF09",
      },
    },
  });
});

test("DynamoDB table is encrypted with SSE", () => {
  const stack = new Stack();

  new HitCounter(stack, "DynamoTableEncrypted", {
    downstream: new NodejsFunction(stack, "LambdaFn", {
      runtime: Runtime.NODEJS_22_X,
      entry: "lambda/index.ts",
      handler: "handler",
    }),
  });

  const template = Template.fromStack(stack);
  template.hasResourceProperties("AWS::DynamoDB::Table", {
    SSESpecification: {
      SSEEnabled: true,
    },
  });
});
