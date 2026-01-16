# CDK Workshop Project

This project was created following the [AWS CDK Immersion Day Workshop](https://cdkworkshop.com/).

## Project Overview

This is a full-featured AWS CDK application that demonstrates key concepts of Infrastructure as Code (IaC) using TypeScript. The application includes:

### Main Application (`CdkWorkshopStack`)

- **Lambda Functions**: Two "Hello World" Lambda functions (JavaScript and TypeScript versions) that respond to HTTP requests
- **Hit Counter**: A custom CDK construct that tracks URL hits using:
  - A DynamoDB table to store hit counts by path
  - A Lambda function that increments the counter and proxies requests to the downstream Lambda
- **API Gateway**: REST API that exposes the hit counter functionality through HTTP endpoints
- **DynamoDB Table Viewer**: A web-based viewer to visualize the hit counter data in real-time

### CI/CD Pipeline (`PipelineStack`)

- **CodePipeline**: Automated deployment pipeline with:
  - S3-based source stage (for git remote)
  - Synth stage that builds and synthesizes the CDK app
  - Deploy stage that deploys the application stack
  - Post-deployment testing for both the API and table viewer endpoints
- **Pipeline Variables**: Environment configuration for deployment environments and versions

### Features Demonstrated

- ✅ Custom CDK constructs with reusable components
- ✅ Lambda function integration (Node.js with TypeScript and JavaScript)
- ✅ DynamoDB table creation and permission management
- ✅ API Gateway integration with Lambda
- ✅ CDK Pipelines for automated deployments
- ✅ Unit testing with Jest and CDK assertions
- ✅ CloudFormation outputs for deployment URLs

## Project Structure

```
├── bin/                    # CDK app entry point
├── lib/                    # CDK stack and construct definitions
│   ├── cdk-workshop-stack.ts   # Main application stack
│   ├── hitcounter.ts           # Custom hit counter construct
│   ├── pipeline-stack.ts       # CI/CD pipeline stack
│   └── pipeline-stage.ts       # Pipeline deployment stage
├── lambda/                 # Lambda function code
│   ├── index.ts           # Hello world function (TypeScript)
│   ├── index.js           # Hello world function (JavaScript)
│   └── hitcounter.js      # Hit counter Lambda handler
└── test/                  # Unit tests
    └── hitcounter.test.ts # Tests for hit counter construct
```

## Useful Commands

- `npm run build` compile typescript to js
- `npm run watch` watch for changes and compile
- `npm run test` perform the jest unit tests
- `cdk deploy` deploy this stack to your default AWS account/region
- `cdk diff` compare deployed stack with current state
- `cdk synth` emits the synthesized CloudFormation template

## What You'll Learn

This workshop teaches you how to:

- Create and deploy AWS infrastructure using CDK
- Build custom CDK constructs
- Integrate multiple AWS services (Lambda, DynamoDB, API Gateway)
- Set up CI/CD pipelines with CDK Pipelines
- Test infrastructure code with Jest
- Use CloudFormation outputs and cross-stack references
