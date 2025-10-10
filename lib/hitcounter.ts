import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";

// Custom construct props
export interface HitCounterProps {
  /** the function for which we want to count url hits */
  downstream: lambda.IFunction;
}

// Custom construct to count URL hits
export class HitCounter extends Construct {
  /** Allows accessing the counter function */
  public readonly handler: lambda.Function;

  /** Allows accessing the hit counter table */
  public readonly table: dynamodb.Table;

  constructor(scope: Construct, id: string, props: HitCounterProps) {
    super(scope, id);

    // Create the DynamoDB Table
    this.table = new dynamodb.Table(this, "Hits", {
      tableName: "HitsTable",
      partitionKey: { name: "path", type: dynamodb.AttributeType.STRING },
      encryption: dynamodb.TableEncryption.AWS_MANAGED,
    });

    this.handler = new lambda.Function(this, "HitCounterHandler", {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: "hitcounter.handler",
      code: lambda.Code.fromAsset("lambda"),
      environment: {
        DOWNSTREAM_FUNCTION_NAME: props.downstream.functionName,
        HITS_TABLE_NAME: this.table.tableName,
      },
    });

    // Grant access to write in the DynamoDB table
    this.table.grantWriteData(this.handler);

    // Grant access to HitCounter to invoke the downsstream function
    props.downstream.grantInvoke(this.handler);
  }
}
