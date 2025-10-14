import { CfnOutput, RemovalPolicy, Stack, StackProps } from "aws-cdk-lib";
import * as codepipeline from "aws-cdk-lib/aws-codepipeline";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as pipeline from "aws-cdk-lib/pipelines";
import { Construct } from "constructs";

export class PipelineStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Create a S3 Bucket for git remote
    const gitBucket = new s3.Bucket(this, "GitBucket", {
      bucketName: `workshop-git-${this.account}-${this.region}`,
      versioned: true,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: RemovalPolicy.DESTROY, // For workshop cleanup - use RETAIN in production
      autoDeleteObjects: true,
    });

    // Pipeline variables
    const environmentVariable = new codepipeline.Variable({
      variableName: "ENVIRONMENT",
      description: "Deployment Environment",
      defaultValue: "dev",
    });

    const versionVariable = new codepipeline.Variable({
      variableName: "VERSION",
      description: "App Version",
      defaultValue: "1.0.0",
    });

    // Create pipeline with S3 source
    const appPipeline = new pipeline.CodePipeline(this, "Pipeline", {
      pipelineName: "workshop-pipeline",
      pipelineType: codepipeline.PipelineType.V2, // Enable V2 features
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore TS2353: 'variables' is only available when using PipelineType.V2
      variables: [environmentVariable, versionVariable],
      synth: new pipeline.CodeBuildStep("SythStep", {
        input: pipeline.CodePipelineSource.s3(
          gitBucket,
          "cdk-workshop/refs/heads/main/repo.zip"
        ),
        commands: ["npm ci", "npm run build", "npx cdk synth"],
        env: {
          ENVIRONMENT: environmentVariable.reference(),
          VERSION: versionVariable.reference(),
        },
      }),
    });

    // Output the bucket name
    new CfnOutput(this, "GitBucketName", {
      value: gitBucket.bucketName,
      description: "S3 Bucket name for git remote",
    });
  }
}
