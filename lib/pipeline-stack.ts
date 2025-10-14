import { CfnOutput, RemovalPolicy, Stack, StackProps } from "aws-cdk-lib";
import * as codepipeline from "aws-cdk-lib/aws-codepipeline";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as pipeline from "aws-cdk-lib/pipelines";
import { Construct } from "constructs";
import { WorkshopPipelineStage } from "./pipeline-stage";
codepipeline.Pipeline;
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
    const environmentVariables = {
      ENVIRONMENT: "dev",
      VERSION: "1.0.0",
    };

    // const environmentVariable = new codepipeline.Variable({
    //   variableName: "ENVIRONMENT",
    //   description: "Deployment Environment",
    //   defaultValue: "dev",
    // });

    // const versionVariable = new codepipeline.Variable({
    //   variableName: "VERSION",
    //   description: "App Version",
    //   defaultValue: "1.0.0",
    // });

    // Create pipeline with S3 source
    const appPipeline = new pipeline.CodePipeline(this, "Pipeline", {
      pipelineName: "workshop-pipeline",
      pipelineType: codepipeline.PipelineType.V2, // Enable V2 features
      synth: new pipeline.CodeBuildStep("SythStep", {
        input: pipeline.CodePipelineSource.s3(
          gitBucket,
          "cdk-workshop/refs/heads/main/repo.zip"
        ),
        commands: ["npm ci", "npm run build", "npx cdk synth"],
        env: environmentVariables,
      }),
    });

    // Add deployment stage
    const deploy = new WorkshopPipelineStage(this, "Deploy");
    const deployStage = appPipeline.addStage(deploy);

    // Add test actions with variable usage
    deployStage.addPost(
      // Testing Dynamo Table Viewer after deploy
      new pipeline.CodeBuildStep("TestViewer", {
        projectName: "TestViewer",
        envFromCfnOutputs: {
          ENDPOINT_URL: deploy.hcViewerUrl,
        },
        env: environmentVariables,
        commands: [
          'echo "Testing TableViewer in environment: $ENVIRONMENT, version: $VERSION"',
          'echo "Source: S3 git remote with automatic zip archive"',
          "curl -Ssf $ENDPOINT_URL",
        ],
      }),

      // Testing HitCounter endpoint after deploy
      new pipeline.CodeBuildStep("TestAPI", {
        projectName: "TestAPI",
        envFromCfnOutputs: {
          ENDPOINT_URL: deploy.hcEndpoint,
        },
        env: environmentVariables,
        commands: [
          'echo "Testing API in environment: $ENVIRONMENT, version: $VERSION"',
          'echo "Deployed from S3 bucket: ${gitBucket.bucketName}"',
          "curl -Ssf $ENDPOINT_URL",
          "curl -Ssf $ENDPOINT_URL/hello",
          "curl -Ssf $ENDPOINT_URL/test",
        ],
      })
    );

    // Output the bucket name
    new CfnOutput(this, "GitBucketName", {
      value: gitBucket.bucketName,
      description: "S3 Bucket name for git remote",
    });
  }
}
